import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { useSellerStore, useSellerProducts } from '../../stores/seller-store';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ChevronDownIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  sku: string;
  category: string;
  categoryAr: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  image?: string;
  description: string;
  descriptionAr: string;
  createdAt: string;
  updatedAt: string;
  sales: number;
  views: number;
  tags: string[];
}

interface FilterOptions {
  category: string;
  status: string;
  stockLevel: string;
  priceRange: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial Water Pump HP-2000',
    nameAr: 'مضخة مياه صناعية عالية الضغط HP-2000',
    sku: 'PUMP-HP-2000',
    category: 'Industrial Equipment',
    categoryAr: 'معدات صناعية',
    price: 15000,
    stock: 25,
    lowStockThreshold: 10,
    status: 'active',
    description: 'High-pressure industrial water pump suitable for large-scale operations',
    descriptionAr: 'مضخة مياه صناعية عالية الضغط مناسبة للعمليات واسعة النطاق',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    sales: 45,
    views: 234,
    tags: ['industrial', 'water', 'pump'],
  },
  {
    id: '2',
    name: 'Pressure Control Valve 4-inch',
    nameAr: 'صمام تحكم في الضغط 4 إنش',
    sku: 'VALVE-PC-4IN',
    category: 'Valves & Controls',
    categoryAr: 'صمامات وأجهزة تحكم',
    price: 2500,
    stock: 8,
    lowStockThreshold: 15,
    status: 'active',
    description: 'Precision pressure control valve for industrial applications',
    descriptionAr: 'صمام تحكم دقيق في الضغط للتطبيقات الصناعية',
    createdAt: '2024-02-28T09:15:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
    sales: 23,
    views: 156,
    tags: ['valve', 'pressure', 'control'],
  },
  {
    id: '3',
    name: 'Three-Phase Electric Motor 50HP',
    nameAr: 'محرك كهربائي ثلاثي الأطوار 50 حصان',
    sku: 'MOTOR-3PH-50HP',
    category: 'Electric Motors',
    categoryAr: 'محركات كهربائية',
    price: 25000,
    stock: 0,
    lowStockThreshold: 5,
    status: 'out_of_stock',
    description: 'High-efficiency three-phase electric motor for industrial use',
    descriptionAr: 'محرك كهربائي ثلاثي الأطوار عالي الكفاءة للاستخدام الصناعي',
    createdAt: '2024-02-25T14:45:00Z',
    updatedAt: '2024-03-13T16:10:00Z',
    sales: 12,
    views: 189,
    tags: ['motor', 'electric', 'industrial'],
  },
  {
    id: '4',
    name: 'Hydraulic Cylinder 200mm Bore',
    nameAr: 'أسطوانة هيدروليكية قطر 200 ملم',
    sku: 'CYL-HYD-200MM',
    category: 'Hydraulic Systems',
    categoryAr: 'أنظمة هيدروليكية',
    price: 8500,
    stock: 15,
    lowStockThreshold: 8,
    status: 'active',
    description: 'Heavy-duty hydraulic cylinder for construction equipment',
    descriptionAr: 'أسطوانة هيدروليكية للخدمة الشاقة لمعدات البناء',
    createdAt: '2024-03-05T13:20:00Z',
    updatedAt: '2024-03-15T10:45:00Z',
    sales: 18,
    views: 145,
    tags: ['hydraulic', 'cylinder', 'construction'],
  },
  {
    id: '5',
    name: 'Safety Relief Valve 1000 PSI',
    nameAr: 'صمام أمان وتخفيف الضغط 1000 رطل',
    sku: 'VALVE-SAFETY-1000',
    category: 'Safety Equipment',
    categoryAr: 'معدات الأمان',
    price: 1200,
    stock: 32,
    lowStockThreshold: 12,
    status: 'active',
    description: 'Safety relief valve rated for 1000 PSI working pressure',
    descriptionAr: 'صمام أمان وتخفيف الضغط مصنف لضغط عمل 1000 رطل لكل بوصة مربعة',
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2024-03-12T15:25:00Z',
    sales: 67,
    views: 298,
    tags: ['safety', 'valve', 'pressure'],
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  out_of_stock: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  active: CheckCircleIcon,
  inactive: ClockIcon,
  draft: PencilIcon,
  out_of_stock: ExclamationTriangleIcon,
};

const ProductsList: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { products: storeProducts, selectedProducts, setSelectedProducts, setProducts, deleteProduct, updateProduct } = useSellerStore();
  const { products, filters, activeProducts, lowStockProducts, outOfStockProducts } = useSellerProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [bulkActionModal, setBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'status' | 'stock' | 'delete' | null>(null);
  
  // Initialize with mock data if empty
  useEffect(() => {
    if (storeProducts.length === 0) {
      setProducts(mockProducts.map(p => ({
        ...p,
        nameAr: p.nameAr || p.name,
        categoryAr: p.categoryAr || p.category,
        descriptionAr: p.descriptionAr || p.description,
        lowStockThreshold: p.lowStockThreshold || 10,
        sales: p.sales || 0,
        views: p.views || 0,
        tags: p.tags || [],
        images: p.images || [],
        cost: 0,
        weight: undefined,
        dimensions: undefined,
        rating: 0,
        reviewCount: 0
      })));
    }
  }, [storeProducts, setProducts]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    category: 'all',
    status: 'all',
    stockLevel: 'all',
    priceRange: 'all',
  });
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sales' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loadedCount, setLoadedCount] = useState(10);
  const [bulkStatusValue, setBulkStatusValue] = useState<string>('');
  const [bulkStockValue, setBulkStockValue] = useState<string>('');

  // Filter and search logic
  const applyFiltersAndSearch = useMemo(() => {
    let filtered = [...storeProducts];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.includes(searchQuery) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (localFilters.category !== 'all') {
      filtered = filtered.filter(product => product.category === localFilters.category);
    }

    // Status filter
    if (localFilters.status !== 'all') {
      filtered = filtered.filter(product => product.status === localFilters.status);
    }

    // Stock level filter
    if (localFilters.stockLevel !== 'all') {
      filtered = filtered.filter(product => {
        switch (localFilters.stockLevel) {
          case 'in_stock':
            return product.stock > 0;
          case 'low_stock':
            return product.stock <= product.lowStockThreshold && product.stock > 0;
          case 'out_of_stock':
            return product.stock === 0;
          default:
            return true;
        }
      });
    }

    // Price range filter
    if (localFilters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        switch (localFilters.priceRange) {
          case 'under_1000':
            return product.price < 1000;
          case '1000_5000':
            return product.price >= 1000 && product.price < 5000;
          case '5000_20000':
            return product.price >= 5000 && product.price < 20000;
          case 'over_20000':
            return product.price >= 20000;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'updated') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [storeProducts, searchQuery, localFilters, sortBy, sortOrder]);

  useEffect(() => {
    setFilteredProducts(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  const handleSelectProduct = (productId: string) => {
    const newSelected = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    const visibleProductIds = filteredProducts.slice(0, loadedCount).map(p => p.id);
    const newSelected = selectedProducts.length === visibleProductIds.length ? [] : visibleProductIds;
    setSelectedProducts(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getStockLevelColor = (product: Product) => {
    if (product.stock === 0) return 'text-red-600 bg-red-50';
    if (product.stock <= product.lowStockThreshold) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStockPercentage = (product: Product) => {
    const maxStock = Math.max(product.lowStockThreshold * 2, product.stock);
    return Math.max((product.stock / maxStock) * 100, 5);
  };

  const categories = [...new Set(storeProducts.map(p => p.category))];
  const displayedProducts = filteredProducts.slice(0, loadedCount);

  const loadMore = () => {
    setLoadedCount(prev => Math.min(prev + 10, filteredProducts.length));
  };

  const clearFilters = () => {
    setLocalFilters({
      category: 'all',
      status: 'all',
      stockLevel: 'all',
      priceRange: 'all',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== 'all') || searchQuery.trim();
  
  // Product actions
  const handleViewProduct = (productId: string) => {
    // Navigate to product details page
    window.open(`/seller/products/view/${productId}`, '_blank');
  };

  const handleEditProduct = (productId: string) => {
    // Navigate to product edit page
    window.location.href = `/seller/products/edit/${productId}`;
  };

  const handleProductMenu = (productId: string) => {
    // For now, just show an alert with available actions
    // In a real app, this would show a dropdown menu
    const product = storeProducts.find(p => p.id === productId);
    if (product) {
      const actions = [
        'View Details',
        'Edit Product',
        'Duplicate Product',
        'Update Stock',
        'Archive Product',
        'Delete Product'
      ];
      
      const action = prompt(`Actions for "${product.name}":\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEnter action number:`);
      
      if (action) {
        const actionIndex = parseInt(action) - 1;
        switch (actionIndex) {
          case 0:
            handleViewProduct(productId);
            break;
          case 1:
            handleEditProduct(productId);
            break;
          case 2:
            alert('Duplicate product functionality would be implemented here');
            break;
          case 3:
            const newStock = prompt('Enter new stock quantity:', product.stock.toString());
            if (newStock && !isNaN(parseInt(newStock))) {
              updateProduct(productId, { stock: parseInt(newStock) });
            }
            break;
          case 4:
            updateProduct(productId, { status: 'inactive' });
            break;
          case 5:
            if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
              // In a real app, this would call a delete API
              alert('Delete functionality would be implemented here');
            }
            break;
        }
      }
    }
  };
  
  // Bulk operations
  const handleBulkAction = (action: 'status' | 'stock' | 'delete') => {
    setBulkAction(action);
    setBulkActionModal(true);
  };
  
  const executeBulkAction = () => {
    if (!bulkAction || selectedProducts.length === 0) return;
    
    switch (bulkAction) {
      case 'status':
        if (bulkStatusValue) {
          selectedProducts.forEach(id => {
            updateProduct(id, { status: bulkStatusValue as any });
          });
        }
        break;
      case 'stock':
        if (bulkStockValue) {
          const stockValue = parseInt(bulkStockValue);
          selectedProducts.forEach(id => {
            updateProduct(id, { stock: stockValue });
          });
        }
        break;
      case 'delete':
        selectedProducts.forEach(id => {
          deleteProduct(id);
        });
        break;
    }
    
    setSelectedProducts([]);
    setBulkActionModal(false);
    setBulkAction(null);
    setBulkStatusValue('');
    setBulkStockValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('products.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('products.subtitle')} ({filteredProducts.length} of {storeProducts.length} products)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? <ListBulletIcon className="w-5 h-5" /> : <Squares2X2Icon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => window.location.href = '/seller/products/add'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            {t('products.addProduct')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('products.totalProducts')}</p>
              <p className="text-2xl font-bold text-gray-900">{storeProducts.length}</p>
            </div>
            <ViewColumnsIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('products.activeProducts')}</p>
              <p className="text-2xl font-bold text-green-600">
                {activeProducts.length}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('products.lowStock')}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {lowStockProducts.length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('products.outOfStock')}</p>
              <p className="text-2xl font-bold text-red-600">
                {outOfStockProducts.length}
              </p>
            </div>
            <XMarkIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">Last Updated</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="sales">Sales</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('products.category')}</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('products.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('products.status')}</label>
                <select
                  value={localFilters.status}
                  onChange={(e) => setLocalFilters({...localFilters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('products.allStatuses')}</option>
                  <option value="active">{t('status.active')}</option>
                  <option value="inactive">{t('status.inactive')}</option>
                  <option value="draft">{t('status.draft')}</option>
                  <option value="out_of_stock">{t('status.outOfStock')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('products.stockLevel')}</label>
                <select
                  value={localFilters.stockLevel}
                  onChange={(e) => setLocalFilters({...localFilters, stockLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('products.allLevels')}</option>
                  <option value="in_stock">{t('stock.inStock')}</option>
                  <option value="low_stock">{t('stock.lowStock')}</option>
                  <option value="out_of_stock">{t('stock.outOfStock')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('products.priceRange')}</label>
                <select
                  value={localFilters.priceRange}
                  onChange={(e) => setLocalFilters({...localFilters, priceRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('products.allPrices')}</option>
                  <option value="under_1000">{t('price.under1000')}</option>
                  <option value="1000_5000">{t('price.1000to5000')}</option>
                  <option value="5000_20000">{t('price.5000to20000')}</option>
                  <option value="over_20000">{t('price.over20000')}</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {t('products.clearFilters')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {selectedProducts.length} {t('products.selected')}
              </span>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Unselect All
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleBulkAction('status')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('products.updateStatus')}
              </button>
              <button 
                onClick={() => handleBulkAction('stock')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                {t('products.updateStock')}
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded-md hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List/Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === displayedProducts.length && displayedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.product')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.category')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.price')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.stock')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.sales')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('products.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedProducts.map((product) => {
                  const StatusIcon = statusIcons[product.status];
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ViewColumnsIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium px-2 py-1 rounded ${getStockLevelColor(product)}`}>
                          {product.stock} {t('products.units')}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full ${
                              product.stock === 0 ? 'bg-red-500' :
                              product.stock <= product.lowStockThreshold ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${getStockPercentage(product)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[product.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>
                            {product.status === 'active' && t('status.active')}
                            {product.status === 'inactive' && t('status.inactive')}
                            {product.status === 'draft' && t('status.draft')}
                            {product.status === 'out_of_stock' && t('status.outOfStock')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.sales} {t('products.sold')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewProduct(product.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Product"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditProduct(product.id)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit Product"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleProductMenu(product.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="More Actions"
                          >
                            <EllipsisVerticalIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const StatusIcon = statusIcons[product.status];
              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => handleProductMenu(product.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="More Actions"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <ViewColumnsIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                    <p className="text-xs text-gray-600">{product.category}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{formatCurrency(product.price)}</span>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[product.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                      </div>
                    </div>
                    
                    <div className={`text-xs font-medium px-2 py-1 rounded text-center ${getStockLevelColor(product)}`}>
                      {product.stock} {t('products.units')}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500">{product.sales} {t('products.sold')}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleViewProduct(product.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Product"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product.id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Edit Product"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {displayedProducts.length < filteredProducts.length && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('products.loadMore')} ({filteredProducts.length - displayedProducts.length} {t('products.remaining')})
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <ViewColumnsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('products.noProducts')}</h3>
            <p className="text-gray-500 mb-6">{t('products.noProductsDesc')}</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Modal */}
      {bulkActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {bulkAction === 'status' && 'Update Status'}
                {bulkAction === 'stock' && 'Update Stock'}
                {bulkAction === 'delete' && 'Delete Products'}
              </h3>
              <button
                onClick={() => setBulkActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                {bulkAction === 'delete' 
                  ? `Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`
                  : `This action will affect ${selectedProducts.length} selected products.`
                }
              </p>
              
              {bulkAction === 'status' && (
                <select
                  value={bulkStatusValue}
                  onChange={(e) => setBulkStatusValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              )}
              
              {bulkAction === 'stock' && (
                <input
                  type="number"
                  value={bulkStockValue}
                  onChange={(e) => setBulkStockValue(e.target.value)}
                  placeholder="Enter stock quantity"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setBulkActionModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                disabled={
                  (bulkAction === 'status' && !bulkStatusValue) ||
                  (bulkAction === 'stock' && !bulkStockValue)
                }
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  bulkAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {bulkAction === 'delete' ? 'Delete' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;