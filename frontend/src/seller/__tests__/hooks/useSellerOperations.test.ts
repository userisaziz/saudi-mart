import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSellerStore } from '@/seller/stores/seller-store';
import { sellerApiService } from '@/seller/services/seller-api';
import {
  useDashboardMetrics,
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useLeads,
  useCreateLead,
  useSellerSelection,
  useSellerFilters,
} from '@/seller/hooks/useSellerOperations';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/seller/services/seller-api');
jest.mock('@/seller/stores/seller-store');

const mockSellerApiService = sellerApiService as jest.Mocked<typeof sellerApiService>;

// Test wrapper with React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSellerOperations hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useDashboardMetrics', () => {
    const mockMetrics = {
      totalRevenue: 100000,
      totalOrders: 50,
      totalProducts: 25,
      totalLeads: 75,
      averageOrderValue: 2000,
      conversionRate: 15.5,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      activeProducts: 20,
      lowStockProducts: 3,
      outOfStockProducts: 2,
      newLeads: 10,
      qualifiedLeads: 15,
      pendingOrders: 5,
      shippedOrders: 10,
    };

    it('should fetch dashboard metrics successfully', async () => {
      const mockSetMetrics = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        setMetrics: mockSetMetrics,
      } as any);

      mockSellerApiService.getDashboardMetrics.mockResolvedValue(mockMetrics);

      const { result } = renderHook(() => useDashboardMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.getDashboardMetrics).toHaveBeenCalledTimes(1);
      expect(mockSetMetrics).toHaveBeenCalledWith(mockMetrics);
      expect(result.current.data).toEqual(mockMetrics);
    });

    it('should handle dashboard metrics fetch error', async () => {
      const error = new Error('Failed to fetch metrics');
      mockSellerApiService.getDashboardMetrics.mockRejectedValue(error);

      const { result } = renderHook(() => useDashboardMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);
    });
  });

  describe('useProducts', () => {
    const mockProductsResponse = {
      data: [
        {
          id: '1',
          name: 'Test Product',
          nameAr: 'منتج اختبار',
          sku: 'TEST-001',
          category: 'Test Category',
          categoryAr: 'فئة الاختبار',
          price: 100,
          cost: 50,
          stock: 10,
          lowStockThreshold: 5,
          status: 'active' as const,
          images: [],
          description: 'Test description',
          descriptionAr: 'وصف الاختبار',
          tags: ['test'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sales: 0,
          views: 0,
          rating: 0,
          reviewCount: 0,
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      message: 'Success',
      success: true,
    };

    it('should fetch products successfully', async () => {
      const mockSetProducts = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        setProducts: mockSetProducts,
      } as any);

      mockSellerApiService.getProducts.mockResolvedValue(mockProductsResponse);

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.getProducts).toHaveBeenCalledWith(undefined);
      expect(mockSetProducts).toHaveBeenCalledWith(mockProductsResponse.data);
      expect(result.current.data).toEqual(mockProductsResponse);
    });

    it('should fetch products with parameters', async () => {
      const mockSetProducts = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        setProducts: mockSetProducts,
      } as any);

      const params = {
        page: 1,
        pageSize: 20,
        search: 'test',
        category: 'electronics',
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      mockSellerApiService.getProducts.mockResolvedValue(mockProductsResponse);

      const { result } = renderHook(() => useProducts(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.getProducts).toHaveBeenCalledWith(params);
    });
  });

  describe('useCreateProduct', () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      nameAr: 'منتج اختبار',
      sku: 'TEST-001',
      category: 'Test Category',
      categoryAr: 'فئة الاختبار',
      price: 100,
      cost: 50,
      stock: 10,
      lowStockThreshold: 5,
      status: 'active' as const,
      images: [],
      description: 'Test description',
      descriptionAr: 'وصف الاختبار',
      tags: ['test'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sales: 0,
      views: 0,
      rating: 0,
      reviewCount: 0,
    };

    const createRequest = {
      name: 'Test Product',
      nameAr: 'منتج اختبار',
      sku: 'TEST-001',
      category: 'Test Category',
      categoryAr: 'فئة الاختبار',
      price: 100,
      cost: 50,
      stock: 10,
      lowStockThreshold: 5,
      description: 'Test description',
      descriptionAr: 'وصف الاختبار',
      tags: ['test'],
      images: [],
    };

    it('should create product successfully', async () => {
      const mockAddProduct = jest.fn();
      const mockAddNotification = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        addProduct: mockAddProduct,
        addNotification: mockAddNotification,
      } as any);

      mockSellerApiService.createProduct.mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(createRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.createProduct).toHaveBeenCalledWith(createRequest);
      expect(mockAddProduct).toHaveBeenCalledWith(mockProduct);
      expect(mockAddNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          title: 'Product Created',
          message: `Product "${mockProduct.name}" has been created successfully.`,
        })
      );
      expect(toast.success).toHaveBeenCalledWith(`Product "${mockProduct.name}" created successfully!`);
    });

    it('should handle create product error', async () => {
      const error = { message: 'Failed to create product' };
      mockSellerApiService.createProduct.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(createRequest);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to create product');
    });
  });

  describe('useUpdateProduct', () => {
    const mockProduct = {
      id: '1',
      name: 'Updated Product',
      nameAr: 'منتج محدث',
      sku: 'TEST-001',
      category: 'Test Category',
      categoryAr: 'فئة الاختبار',
      price: 150,
      cost: 75,
      stock: 15,
      lowStockThreshold: 5,
      status: 'active' as const,
      images: [],
      description: 'Updated description',
      descriptionAr: 'وصف محدث',
      tags: ['test', 'updated'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      sales: 5,
      views: 50,
      rating: 4.5,
      reviewCount: 10,
    };

    it('should update product successfully', async () => {
      const mockUpdateProduct = jest.fn();
      const mockAddNotification = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        updateProduct: mockUpdateProduct,
        addNotification: mockAddNotification,
      } as any);

      mockSellerApiService.updateProduct.mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper(),
      });

      const updateData = { name: 'Updated Product', price: 150 };
      result.current.mutate({ id: '1', data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.updateProduct).toHaveBeenCalledWith('1', updateData);
      expect(mockUpdateProduct).toHaveBeenCalledWith(mockProduct.id, mockProduct);
      expect(mockAddNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          title: 'Product Updated',
          message: `Product "${mockProduct.name}" has been updated successfully.`,
        })
      );
      expect(toast.success).toHaveBeenCalledWith(`Product "${mockProduct.name}" updated successfully!`);
    });
  });

  describe('useDeleteProduct', () => {
    it('should delete product successfully', async () => {
      const mockDeleteProduct = jest.fn();
      const mockAddNotification = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        deleteProduct: mockDeleteProduct,
        addNotification: mockAddNotification,
      } as any);

      mockSellerApiService.deleteProduct.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteProduct(), {
        wrapper: createWrapper(),
      });

      result.current.mutate('1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.deleteProduct).toHaveBeenCalledWith('1');
      expect(mockDeleteProduct).toHaveBeenCalledWith('1');
      expect(mockAddNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          title: 'Product Deleted',
          message: 'Product has been deleted successfully.',
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully!');
    });
  });

  describe('useSellerSelection', () => {
    it('should manage product selection correctly', () => {
      const mockStore = {
        selectedProducts: ['1', '2'],
        setSelectedProducts: jest.fn(),
        selectedLeads: [],
        setSelectedLeads: jest.fn(),
        selectedOrders: [],
        setSelectedOrders: jest.fn(),
      };

      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue(mockStore as any);

      const { result } = renderHook(() => useSellerSelection('products'));

      expect(result.current.selected).toEqual(['1', '2']);
      expect(result.current.selectedCount).toBe(2);
      expect(result.current.hasSelection).toBe(true);
      expect(result.current.isSelected('1')).toBe(true);
      expect(result.current.isSelected('3')).toBe(false);

      // Test toggle selection
      result.current.toggleSelection('3');
      expect(mockStore.setSelectedProducts).toHaveBeenCalledWith(['1', '2', '3']);

      // Test select all
      result.current.selectAll(['1', '2', '3', '4']);
      expect(mockStore.setSelectedProducts).toHaveBeenCalledWith(['1', '2', '3', '4']);

      // Test clear selection
      result.current.clearSelection();
      expect(mockStore.setSelectedProducts).toHaveBeenCalledWith([]);
    });

    it('should manage lead selection correctly', () => {
      const mockStore = {
        selectedProducts: [],
        setSelectedProducts: jest.fn(),
        selectedLeads: ['lead1'],
        setSelectedLeads: jest.fn(),
        selectedOrders: [],
        setSelectedOrders: jest.fn(),
      };

      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue(mockStore as any);

      const { result } = renderHook(() => useSellerSelection('leads'));

      expect(result.current.selected).toEqual(['lead1']);
      expect(result.current.selectedCount).toBe(1);
      expect(result.current.hasSelection).toBe(true);
    });
  });

  describe('useSellerFilters', () => {
    it('should manage product filters correctly', () => {
      const mockFilters = {
        search: 'test',
        category: 'electronics',
        status: 'active',
        stockLevel: 'all',
        priceRange: 'all',
      };

      const mockStore = {
        productFilters: mockFilters,
        setProductFilters: jest.fn(),
        leadFilters: { search: '', status: 'all', priority: 'all', source: 'all', assignedTo: 'all' },
        setLeadFilters: jest.fn(),
        orderFilters: { search: '', status: 'all', paymentStatus: 'all', dateRange: { start: '', end: '' } },
        setOrderFilters: jest.fn(),
      };

      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue(mockStore as any);

      const { result } = renderHook(() => useSellerFilters('products'));

      expect(result.current.filters).toEqual(mockFilters);
      expect(result.current.hasActiveFilters).toBe(true);

      // Test set filters
      const newFilters = { search: 'updated' };
      result.current.setFilters(newFilters);
      expect(mockStore.setProductFilters).toHaveBeenCalledWith(newFilters);

      // Test clear filters
      result.current.clearFilters();
      expect(mockStore.setProductFilters).toHaveBeenCalledWith({
        search: '',
        category: 'all',
        status: 'all',
        stockLevel: 'all',
        priceRange: 'all',
      });
    });

    it('should detect no active filters', () => {
      const mockFilters = {
        search: '',
        category: 'all',
        status: 'all',
        stockLevel: 'all',
        priceRange: 'all',
      };

      const mockStore = {
        productFilters: mockFilters,
        setProductFilters: jest.fn(),
        leadFilters: { search: '', status: 'all', priority: 'all', source: 'all', assignedTo: 'all' },
        setLeadFilters: jest.fn(),
        orderFilters: { search: '', status: 'all', paymentStatus: 'all', dateRange: { start: '', end: '' } },
        setOrderFilters: jest.fn(),
      };

      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue(mockStore as any);

      const { result } = renderHook(() => useSellerFilters('products'));

      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('useLeads', () => {
    const mockLeadsResponse = {
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Test Company',
          position: 'Manager',
          status: 'new' as const,
          priority: 'medium' as const,
          score: 75,
          source: 'Website',
          value: 5000,
          currency: 'USD',
          products: ['Product 1'],
          notes: [],
          activities: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tags: ['potential'],
        },
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
      message: 'Success',
      success: true,
    };

    it('should fetch leads successfully', async () => {
      const mockSetLeads = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        setLeads: mockSetLeads,
      } as any);

      mockSellerApiService.getLeads.mockResolvedValue(mockLeadsResponse);

      const { result } = renderHook(() => useLeads(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.getLeads).toHaveBeenCalledWith(undefined);
      expect(mockSetLeads).toHaveBeenCalledWith(mockLeadsResponse.data);
      expect(result.current.data).toEqual(mockLeadsResponse);
    });
  });

  describe('useCreateLead', () => {
    const mockLead = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      position: 'Manager',
      status: 'new' as const,
      priority: 'medium' as const,
      score: 75,
      source: 'Website',
      value: 5000,
      currency: 'USD',
      products: ['Product 1'],
      notes: [],
      activities: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: ['potential'],
    };

    const createRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      position: 'Manager',
      source: 'Website',
      value: 5000,
      currency: 'USD',
      products: ['Product 1'],
    };

    it('should create lead successfully', async () => {
      const mockAddLead = jest.fn();
      const mockAddNotification = jest.fn();
      (useSellerStore as jest.MockedFunction<typeof useSellerStore>).mockReturnValue({
        addLead: mockAddLead,
        addNotification: mockAddNotification,
      } as any);

      mockSellerApiService.createLead.mockResolvedValue(mockLead);

      const { result } = renderHook(() => useCreateLead(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(createRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSellerApiService.createLead).toHaveBeenCalledWith(createRequest);
      expect(mockAddLead).toHaveBeenCalledWith(mockLead);
      expect(mockAddNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          title: 'New Lead Added',
          message: `Lead from ${mockLead.company} has been added successfully.`,
          actionUrl: `/seller/leads/details/${mockLead.id}`,
        })
      );
      expect(toast.success).toHaveBeenCalledWith(`Lead from ${mockLead.company} created successfully!`);
    });
  });
});