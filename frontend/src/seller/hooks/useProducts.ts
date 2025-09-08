import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Product, 
  ProductFilter, 
  ProductSort, 
  ProductListState, 
  BulkAction, 
  InventoryAlert, 
  StockMovement 
} from '../types/product';
import { mockProducts } from '../data/mockData';

// Enhanced mock data with comprehensive product information
const enhancedMockProducts: Product[] = mockProducts.map(product => ({
  ...product,
  nameAr: product.name, // Would be properly translated
  hasVariants: false,
  variants: [],
  pricing: {
    cost: product.price * 0.6,
    price: product.price,
    minOrderQuantity: 1,
    bulkPricing: [
      { quantity: 10, price: product.price * 0.95 },
      { quantity: 50, price: product.price * 0.9 },
      { quantity: 100, price: product.price * 0.85 }
    ]
  },
  stockUnit: 'pieces',
  specifications: [
    { name: 'Material', value: 'Steel', category: 'Construction' },
    { name: 'Grade', value: 'A36', category: 'Technical' }
  ],
  features: ['Corrosion resistant', 'High strength', 'Industrial grade'],
  visibility: 'public' as const,
  isDigital: false,
  weight: Math.random() * 100,
  dimensions: {
    length: 100,
    width: 50,
    height: 30,
    unit: 'cm'
  },
  tags: ['industrial', 'b2b'],
  createdBy: 'admin',
  lastModifiedBy: 'admin',
  version: 1,
  reorderPoint: {
    threshold: 10,
    reorderQuantity: 50,
    leadTimeDays: 7
  }
}));

export const useProducts = () => {
  const [state, setState] = useState<ProductListState>({
    products: enhancedMockProducts,
    filteredProducts: enhancedMockProducts,
    loading: false,
    error: null,
    selectedProducts: [],
    currentFilter: {},
    currentSort: { field: 'updatedAt', direction: 'desc' },
    searchQuery: '',
    pagination: {
      page: 1,
      limit: 20,
      total: enhancedMockProducts.length,
      hasMore: false
    }
  });

  // Auto-save functionality
  const [autoSaveEnabled] = useState(true);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Filter products based on current filters and search
  const applyFiltersAndSearch = useCallback((
    products: Product[], 
    filters: ProductFilter, 
    searchQuery: string
  ): Product[] => {
    let filtered = [...products];

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category?.length) {
      filtered = filtered.filter(product =>
        filters.category!.includes(product.category)
      );
    }

    // Status filter
    if (filters.status?.length) {
      filtered = filtered.filter(product =>
        filters.status!.includes(product.status)
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.pricing.price >= filters.priceRange!.min &&
        product.pricing.price <= filters.priceRange!.max
      );
    }

    // Stock level filter
    if (filters.stockLevel) {
      filtered = filtered.filter(product => {
        switch (filters.stockLevel) {
          case 'in_stock':
            return product.stock > 10;
          case 'low_stock':
            return product.stock > 0 && product.stock <= 10;
          case 'out_of_stock':
            return product.stock === 0;
          default:
            return true;
        }
      });
    }

    // Tags filter
    if (filters.tags?.length) {
      filtered = filtered.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }

    return filtered;
  }, []);

  // Sort products
  const sortProducts = useCallback((products: Product[], sort: ProductSort): Product[] => {
    return [...products].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.pricing.price;
          bValue = b.pricing.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'sku':
          aValue = a.sku;
          bValue = b.sku;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, []);

  // Update filtered and sorted products when filters, sort, or search change
  useEffect(() => {
    setState(prev => {
      const filtered = applyFiltersAndSearch(prev.products, prev.currentFilter, prev.searchQuery);
      const sorted = sortProducts(filtered, prev.currentSort);
      
      return {
        ...prev,
        filteredProducts: sorted,
        pagination: {
          ...prev.pagination,
          total: sorted.length,
          hasMore: sorted.length > prev.pagination.limit * prev.pagination.page
        }
      };
    });
  }, [state.currentFilter, state.currentSort, state.searchQuery, applyFiltersAndSearch, sortProducts]);

  // Search products
  const searchProducts = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  // Update filters
  const updateFilters = useCallback((filters: ProductFilter) => {
    setState(prev => ({
      ...prev,
      currentFilter: filters,
      pagination: { ...prev.pagination, page: 1 }
    }));
  }, []);

  // Update sort
  const updateSort = useCallback((sort: ProductSort) => {
    setState(prev => ({
      ...prev,
      currentSort: sort
    }));
  }, []);

  // Select/deselect products
  const toggleProductSelection = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  }, []);

  const selectAllProducts = useCallback((productIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedProducts: productIds
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedProducts: []
    }));
  }, []);

  // Bulk actions
  const executeBulkAction = useCallback(async (action: BulkAction) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => {
        let updatedProducts = [...prev.products];

        switch (action.type) {
          case 'update_status':
            updatedProducts = updatedProducts.map(product =>
              action.selectedIds.includes(product.id)
                ? { ...product, status: action.data.status, updatedAt: new Date().toISOString() }
                : product
            );
            break;
          case 'update_price':
            updatedProducts = updatedProducts.map(product =>
              action.selectedIds.includes(product.id)
                ? {
                    ...product,
                    pricing: { ...product.pricing, price: action.data.price },
                    updatedAt: new Date().toISOString()
                  }
                : product
            );
            break;
          case 'update_stock':
            updatedProducts = updatedProducts.map(product =>
              action.selectedIds.includes(product.id)
                ? { ...product, stock: action.data.stock, updatedAt: new Date().toISOString() }
                : product
            );
            break;
          case 'delete':
            updatedProducts = updatedProducts.filter(product =>
              !action.selectedIds.includes(product.id)
            );
            break;
        }

        return {
          ...prev,
          products: updatedProducts,
          selectedProducts: [],
          loading: false
        };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to execute bulk action',
        loading: false
      }));
    }
  }, []);

  // CRUD operations
  const createProduct = useCallback(async (productData: Partial<Product>) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || '',
        category: productData.category || '',
        description: productData.description || '',
        sku: productData.sku || '',
        pricing: productData.pricing || { cost: 0, price: 0 },
        stock: productData.stock || 0,
        status: 'draft',
        hasVariants: false,
        variants: [],
        images: productData.images || [],
        specifications: productData.specifications || [],
        features: productData.features || [],
        visibility: 'private',
        isDigital: false,
        stockUnit: 'pieces',
        tags: productData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current_user',
        lastModifiedBy: 'current_user',
        version: 1,
        ...productData
      } as Product;

      setState(prev => ({
        ...prev,
        products: [...prev.products, newProduct],
        loading: false
      }));

      return newProduct;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create product',
        loading: false
      }));
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === id
            ? {
                ...product,
                ...productData,
                updatedAt: new Date().toISOString(),
                lastModifiedBy: 'current_user',
                version: product.version + 1
              }
            : product
        ),
        loading: false
      }));

      if (autoSaveEnabled) {
        setLastAutoSave(new Date());
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update product',
        loading: false
      }));
      throw error;
    }
  }, [autoSaveEnabled]);

  const deleteProduct = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id),
        selectedProducts: prev.selectedProducts.filter(productId => productId !== id),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to delete product',
        loading: false
      }));
      throw error;
    }
  }, []);

  // Get product by ID
  const getProduct = useCallback((id: string): Product | undefined => {
    return state.products.find(product => product.id === id);
  }, [state.products]);

  // Analytics and insights
  const productStats = useMemo(() => {
    const total = state.products.length;
    const active = state.products.filter(p => p.status === 'active').length;
    const lowStock = state.products.filter(p => p.stock > 0 && p.stock <= (p.reorderPoint?.threshold || 10)).length;
    const outOfStock = state.products.filter(p => p.stock === 0).length;
    const draft = state.products.filter(p => p.status === 'draft').length;
    const totalValue = state.products.reduce((sum, p) => sum + (p.pricing.price * p.stock), 0);

    return {
      total,
      active,
      lowStock,
      outOfStock,
      draft,
      totalValue,
      averagePrice: total > 0 ? state.products.reduce((sum, p) => sum + p.pricing.price, 0) / total : 0
    };
  }, [state.products]);

  // Generate inventory alerts
  const inventoryAlerts = useMemo((): InventoryAlert[] => {
    return state.products
      .filter(product => {
        const threshold = product.reorderPoint?.threshold || 10;
        return product.stock <= threshold;
      })
      .map(product => ({
        id: `alert-${product.id}`,
        productId: product.id,
        productName: product.name,
        type: product.stock === 0 ? 'out_of_stock' : 'low_stock',
        severity: product.stock === 0 ? 'high' : product.stock < 5 ? 'medium' : 'low',
        currentStock: product.stock,
        threshold: product.reorderPoint?.threshold,
        message: product.stock === 0
          ? `${product.name} is out of stock`
          : `${product.name} is low on stock (${product.stock} remaining)`,
        createdAt: new Date().toISOString()
      }));
  }, [state.products]);

  return {
    // State
    ...state,
    productStats,
    inventoryAlerts,
    lastAutoSave,

    // Actions
    searchProducts,
    updateFilters,
    updateSort,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    executeBulkAction,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,

    // Utilities
    isProductSelected: (id: string) => state.selectedProducts.includes(id),
    hasSelection: state.selectedProducts.length > 0,
    selectedCount: state.selectedProducts.length
  };
};