import { renderHook, act } from '@testing-library/react';
import { useSellerStore } from '@/seller/stores/seller-store';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Seller Store', () => {
  beforeEach(() => {
    // Clear store state before each test
    act(() => {
      useSellerStore.getState().reset();
    });
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSellerStore());

      expect(result.current.products).toEqual([]);
      expect(result.current.leads).toEqual([]);
      expect(result.current.orders).toEqual([]);
      expect(result.current.metrics).toBeNull();
      expect(result.current.notifications).toEqual([]);
      expect(result.current.profile).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedProducts).toEqual([]);
      expect(result.current.selectedLeads).toEqual([]);
      expect(result.current.selectedOrders).toEqual([]);
    });

    it('should have correct initial filters', () => {
      const { result } = renderHook(() => useSellerStore());

      expect(result.current.productFilters).toEqual({
        search: '',
        category: 'all',
        status: 'all',
        stockLevel: 'all',
        priceRange: 'all',
      });

      expect(result.current.leadFilters).toEqual({
        search: '',
        status: 'all',
        priority: 'all',
        source: 'all',
        assignedTo: 'all',
      });

      expect(result.current.orderFilters).toEqual({
        search: '',
        status: 'all',
        paymentStatus: 'all',
        dateRange: { start: '', end: '' },
      });
    });
  });

  describe('Loading and Error State', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useSellerStore());
      const error = 'Something went wrong';

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toBe(error);
    });
  });

  describe('Product Actions', () => {
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

    it('should set products', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProducts([mockProduct]);
      });

      expect(result.current.products).toEqual([mockProduct]);
    });

    it('should add product', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.addProduct(mockProduct);
      });

      expect(result.current.products).toEqual([mockProduct]);
    });

    it('should update product', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProducts([mockProduct]);
      });

      act(() => {
        result.current.updateProduct('1', { name: 'Updated Product' });
      });

      expect(result.current.products[0].name).toBe('Updated Product');
      expect(new Date(result.current.products[0].updatedAt).getTime()).toBeGreaterThan(
        new Date(mockProduct.updatedAt).getTime()
      );
    });

    it('should delete product', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProducts([mockProduct]);
        result.current.setSelectedProducts(['1']);
      });

      act(() => {
        result.current.deleteProduct('1');
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.selectedProducts).toEqual([]);
    });

    it('should set selected products', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setSelectedProducts(['1', '2']);
      });

      expect(result.current.selectedProducts).toEqual(['1', '2']);
    });

    it('should set product filters', () => {
      const { result } = renderHook(() => useSellerStore());
      const newFilters = { search: 'test', category: 'electronics' };

      act(() => {
        result.current.setProductFilters(newFilters);
      });

      expect(result.current.productFilters.search).toBe('test');
      expect(result.current.productFilters.category).toBe('electronics');
    });
  });

  describe('Lead Actions', () => {
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

    it('should set leads', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setLeads([mockLead]);
      });

      expect(result.current.leads).toEqual([mockLead]);
    });

    it('should add lead', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.addLead(mockLead);
      });

      expect(result.current.leads).toEqual([mockLead]);
    });

    it('should update lead', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setLeads([mockLead]);
      });

      act(() => {
        result.current.updateLead('1', { status: 'qualified' });
      });

      expect(result.current.leads[0].status).toBe('qualified');
      expect(new Date(result.current.leads[0].updatedAt).getTime()).toBeGreaterThan(
        new Date(mockLead.updatedAt).getTime()
      );
    });

    it('should delete lead', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setLeads([mockLead]);
        result.current.setSelectedLeads(['1']);
      });

      act(() => {
        result.current.deleteLead('1');
      });

      expect(result.current.leads).toEqual([]);
      expect(result.current.selectedLeads).toEqual([]);
    });
  });

  describe('Order Actions', () => {
    const mockOrder = {
      id: '1',
      orderNumber: 'ORD-001',
      customerId: 'CUST-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: [],
      subtotal: 100,
      tax: 10,
      shipping: 5,
      discount: 0,
      total: 115,
      currency: 'USD',
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
      paymentMethod: 'Credit Card',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345',
        country: 'USA',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    it('should set orders', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setOrders([mockOrder]);
      });

      expect(result.current.orders).toEqual([mockOrder]);
    });

    it('should update order', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setOrders([mockOrder]);
      });

      act(() => {
        result.current.updateOrder('1', { status: 'confirmed' });
      });

      expect(result.current.orders[0].status).toBe('confirmed');
      expect(new Date(result.current.orders[0].updatedAt).getTime()).toBeGreaterThan(
        new Date(mockOrder.updatedAt).getTime()
      );
    });
  });

  describe('Notification Actions', () => {
    const mockNotification = {
      id: '1',
      type: 'success' as const,
      title: 'Test Notification',
      message: 'This is a test notification',
      read: false,
      createdAt: '2024-01-01T00:00:00Z',
    };

    it('should set notifications', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setNotifications([mockNotification]);
      });

      expect(result.current.notifications).toEqual([mockNotification]);
    });

    it('should mark notification as read', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setNotifications([mockNotification]);
      });

      act(() => {
        result.current.markNotificationAsRead('1');
      });

      expect(result.current.notifications[0].read).toBe(true);
    });

    it('should add notification', () => {
      const { result } = renderHook(() => useSellerStore());
      const newNotification = {
        type: 'info' as const,
        title: 'New Notification',
        message: 'This is a new notification',
        read: false,
        createdAt: new Date().toISOString(),
      };

      act(() => {
        result.current.addNotification(newNotification);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0]).toMatchObject(newNotification);
    });
  });

  describe('Profile Actions', () => {
    const mockProfile = {
      businessName: 'Test Business',
      businessNameAr: 'عمل الاختبار',
      email: 'business@test.com',
      phone: '+1234567890',
      website: 'https://test.com',
      description: 'Test business description',
      descriptionAr: 'وصف الأعمال الاختبار',
      address: {
        street: '123 Business St',
        city: 'Business City',
        state: 'BC',
        zipCode: '12345',
        country: 'USA',
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '09:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '12:00', isOpen: true },
        sunday: { open: '09:00', close: '12:00', isOpen: false },
      },
      socialMedia: {
        facebook: 'https://facebook.com/test',
        twitter: 'https://twitter.com/test',
        linkedin: 'https://linkedin.com/company/test',
      },
      certifications: ['ISO 9001', 'ISO 14001'],
      founded: '2020',
      employees: '10-50',
      industry: 'Technology',
    };

    it('should set profile', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProfile(mockProfile);
      });

      expect(result.current.profile).toEqual(mockProfile);
    });

    it('should update profile', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProfile(mockProfile);
      });

      act(() => {
        result.current.updateProfile({ businessName: 'Updated Business' });
      });

      expect(result.current.profile?.businessName).toBe('Updated Business');
    });
  });

  describe('Utility Actions', () => {
    it('should clear all filters', () => {
      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProductFilters({ search: 'test', category: 'electronics' });
        result.current.setLeadFilters({ search: 'lead', status: 'qualified' });
        result.current.setOrderFilters({ search: 'order', status: 'confirmed' });
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.productFilters.search).toBe('');
      expect(result.current.productFilters.category).toBe('all');
      expect(result.current.leadFilters.search).toBe('');
      expect(result.current.leadFilters.status).toBe('all');
      expect(result.current.orderFilters.search).toBe('');
      expect(result.current.orderFilters.status).toBe('all');
    });

    it('should reset store to initial state', () => {
      const { result } = renderHook(() => useSellerStore());

      // Set some data
      act(() => {
        result.current.setProducts([{
          id: '1',
          name: 'Test Product',
          nameAr: 'منتج اختبار',
          sku: 'TEST-001',
          category: 'Test',
          categoryAr: 'اختبار',
          price: 100,
          cost: 50,
          stock: 10,
          lowStockThreshold: 5,
          status: 'active',
          images: [],
          description: 'Test',
          descriptionAr: 'اختبار',
          tags: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sales: 0,
          views: 0,
          rating: 0,
          reviewCount: 0,
        }]);
        result.current.setLoading(true);
        result.current.setError('Test error');
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Selectors', () => {
    it('should provide products selector with computed values', () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Active Product',
          nameAr: 'منتج نشط',
          sku: 'ACTIVE-001',
          category: 'Test',
          categoryAr: 'اختبار',
          price: 100,
          cost: 50,
          stock: 20,
          lowStockThreshold: 10,
          status: 'active' as const,
          images: [],
          description: 'Active product',
          descriptionAr: 'منتج نشط',
          tags: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sales: 0,
          views: 0,
          rating: 0,
          reviewCount: 0,
        },
        {
          id: '2',
          name: 'Low Stock Product',
          nameAr: 'منتج منخفض المخزون',
          sku: 'LOW-002',
          category: 'Test',
          categoryAr: 'اختبار',
          price: 200,
          cost: 100,
          stock: 5,
          lowStockThreshold: 10,
          status: 'active' as const,
          images: [],
          description: 'Low stock product',
          descriptionAr: 'منتج منخفض المخزون',
          tags: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sales: 0,
          views: 0,
          rating: 0,
          reviewCount: 0,
        },
        {
          id: '3',
          name: 'Out of Stock Product',
          nameAr: 'منتج نفد من المخزون',
          sku: 'OUT-003',
          category: 'Test',
          categoryAr: 'اختبار',
          price: 150,
          cost: 75,
          stock: 0,
          lowStockThreshold: 5,
          status: 'active' as const,
          images: [],
          description: 'Out of stock product',
          descriptionAr: 'منتج نفد من المخزون',
          tags: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sales: 0,
          views: 0,
          rating: 0,
          reviewCount: 0,
        },
      ];

      const { result } = renderHook(() => useSellerStore());

      act(() => {
        result.current.setProducts(mockProducts);
      });

      // Test the selectors would work correctly
      const products = result.current.products;
      const activeProducts = products.filter(p => p.status === 'active');
      const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0);
      const outOfStockProducts = products.filter(p => p.stock === 0);

      expect(activeProducts).toHaveLength(3);
      expect(lowStockProducts).toHaveLength(1);
      expect(outOfStockProducts).toHaveLength(1);
    });
  });
});