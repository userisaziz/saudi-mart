import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSellerStore } from '@/seller/stores/seller-store';
import { sellerApiService } from '@/seller/services/seller-api';
import type {
  Product,
  Lead,
  Order,
  ProductCreateRequest,
  ProductUpdateRequest,
  LeadCreateRequest,
  LeadUpdateRequest,
  OrderUpdateRequest,
  BulkUpdateRequest,
} from '@/seller/services/seller-api';

// Query Keys
export const SELLER_QUERY_KEYS = {
  dashboard: ['seller', 'dashboard'] as const,
  products: ['seller', 'products'] as const,
  product: (id: string) => ['seller', 'products', id] as const,
  leads: ['seller', 'leads'] as const,
  lead: (id: string) => ['seller', 'leads', id] as const,
  orders: ['seller', 'orders'] as const,
  order: (id: string) => ['seller', 'orders', id] as const,
  notifications: ['seller', 'notifications'] as const,
  profile: ['seller', 'profile'] as const,
  analytics: (params: any) => ['seller', 'analytics', params] as const,
} as const;

// Dashboard Operations
export function useDashboardMetrics() {
  const setMetrics = useSellerStore((state) => state.setMetrics);

  return useQuery({
    queryKey: SELLER_QUERY_KEYS.dashboard,
    queryFn: async () => {
      const metrics = await sellerApiService.getDashboardMetrics();
      setMetrics(metrics);
      return metrics;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Product Operations
export function useProducts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const setProducts = useSellerStore((state) => state.setProducts);

  return useQuery({
    queryKey: [...SELLER_QUERY_KEYS.products, params],
    queryFn: async () => {
      const response = await sellerApiService.getProducts(params);
      setProducts(response.data);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.product(id),
    queryFn: () => sellerApiService.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const addProduct = useSellerStore((state) => state.addProduct);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: ProductCreateRequest) => sellerApiService.createProduct(data),
    onSuccess: (product) => {
      addProduct(product);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'success',
        title: 'Product Created',
        message: `Product "${product.name}" has been created successfully.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      
      toast.success(`Product "${product.name}" created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const updateProduct = useSellerStore((state) => state.updateProduct);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdateRequest }) =>
      sellerApiService.updateProduct(id, data),
    onSuccess: (product) => {
      updateProduct(product.id, product);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.product(product.id) });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'success',
        title: 'Product Updated',
        message: `Product "${product.name}" has been updated successfully.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      
      toast.success(`Product "${product.name}" updated successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const deleteProduct = useSellerStore((state) => state.deleteProduct);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: sellerApiService.deleteProduct,
    onSuccess: (_, productId) => {
      deleteProduct(productId);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'info',
        title: 'Product Deleted',
        message: 'Product has been deleted successfully.',
        read: false,
        createdAt: new Date().toISOString(),
      });
      
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
}

export function useBulkUpdateProducts() {
  const queryClient = useQueryClient();
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: sellerApiService.bulkUpdateProducts,
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'success',
        title: 'Bulk Update Complete',
        message: `${ids.length} products have been updated successfully.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      
      toast.success(`${ids.length} products updated successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update products');
    },
  });
}

// Lead Operations
export function useLeads(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
  source?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const setLeads = useSellerStore((state) => state.setLeads);

  return useQuery({
    queryKey: [...SELLER_QUERY_KEYS.leads, params],
    queryFn: async () => {
      const response = await sellerApiService.getLeads(params);
      setLeads(response.data);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.lead(id),
    queryFn: () => sellerApiService.getLead(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const addLead = useSellerStore((state) => state.addLead);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: (data: LeadCreateRequest) => sellerApiService.createLead(data),
    onSuccess: (lead) => {
      addLead(lead);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.leads });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'success',
        title: 'New Lead Added',
        message: `Lead from ${lead.company} has been added successfully.`,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/seller/leads/details/${lead.id}`,
      });
      
      toast.success(`Lead from ${lead.company} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lead');
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  const updateLead = useSellerStore((state) => state.updateLead);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadUpdateRequest }) =>
      sellerApiService.updateLead(id, data),
    onSuccess: (lead) => {
      updateLead(lead.id, lead);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.leads });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.lead(lead.id) });
      
      toast.success('Lead updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lead');
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  const updateLead = useSellerStore((state) => state.updateLead);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: sellerApiService.convertLeadToOrder,
    onSuccess: (order, leadId) => {
      updateLead(leadId, { status: 'won' });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.leads });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'success',
        title: 'Lead Converted!',
        message: `Lead has been converted to order #${order.orderNumber}`,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/seller/orders/details/${order.id}`,
      });
      
      toast.success(`Lead converted to order #${order.orderNumber}!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to convert lead');
    },
  });
}

// Order Operations
export function useOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const setOrders = useSellerStore((state) => state.setOrders);

  return useQuery({
    queryKey: [...SELLER_QUERY_KEYS.orders, params],
    queryFn: async () => {
      const response = await sellerApiService.getOrders(params);
      setOrders(response.data);
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.order(id),
    queryFn: () => sellerApiService.getOrder(id),
    enabled: !!id,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const updateOrder = useSellerStore((state) => state.updateOrder);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderUpdateRequest }) =>
      sellerApiService.updateOrder(id, data),
    onSuccess: (order) => {
      updateOrder(order.id, order);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.order(order.id) });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'info',
        title: 'Order Updated',
        message: `Order #${order.orderNumber} has been updated.`,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/seller/orders/details/${order.id}`,
      });
      
      toast.success(`Order #${order.orderNumber} updated successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order');
    },
  });
}

export function useFulfillOrder() {
  const queryClient = useQueryClient();
  const updateOrder = useSellerStore((state) => state.updateOrder);
  const addNotification = useSellerStore((state) => state.addNotification);

  return useMutation({
    mutationFn: ({ id, trackingNumber, carrier }: { id: string; trackingNumber: string; carrier?: string }) =>
      sellerApiService.fulfillOrder(id, trackingNumber, carrier),
    onSuccess: (order) => {
      updateOrder(order.id, order);
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.order(order.id) });
      queryClient.invalidateQueries({ queryKey: SELLER_QUERY_KEYS.dashboard });
      
      addNotification({
        type: 'success',
        title: 'Order Fulfilled',
        message: `Order #${order.orderNumber} has been marked as shipped.`,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/seller/orders/details/${order.id}`,
      });
      
      toast.success(`Order #${order.orderNumber} fulfilled successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fulfill order');
    },
  });
}

// Selection Management Hook
export function useSellerSelection<T extends 'products' | 'leads' | 'orders'>(type: T) {
  const store = useSellerStore();
  
  const selectionMap = {
    products: {
      selected: store.selectedProducts,
      setSelected: store.setSelectedProducts,
    },
    leads: {
      selected: store.selectedLeads,
      setSelected: store.setSelectedLeads,
    },
    orders: {
      selected: store.selectedOrders,
      setSelected: store.setSelectedOrders,
    },
  };
  
  const { selected, setSelected } = selectionMap[type];
  
  const toggleSelection = useCallback((id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id]
    );
  }, [selected, setSelected]);
  
  const selectAll = useCallback((ids: string[]) => {
    setSelected(selected.length === ids.length ? [] : ids);
  }, [selected.length, setSelected]);
  
  const clearSelection = useCallback(() => {
    setSelected([]);
  }, [setSelected]);
  
  const isSelected = useCallback((id: string) => {
    return selected.includes(id);
  }, [selected]);
  
  return {
    selected,
    setSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount: selected.length,
    hasSelection: selected.length > 0,
  };
}

// Filtering Hook
export function useSellerFilters<T extends 'products' | 'leads' | 'orders'>(type: T) {
  const store = useSellerStore();
  
  const filterMap = {
    products: {
      filters: store.productFilters,
      setFilters: store.setProductFilters,
    },
    leads: {
      filters: store.leadFilters,
      setFilters: store.setLeadFilters,
    },
    orders: {
      filters: store.orderFilters,
      setFilters: store.setOrderFilters,
    },
  };
  
  const { filters, setFilters } = filterMap[type];
  
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => {
      if (typeof value === 'string') return value !== 'all' && value !== '';
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some((v) => v !== '');
      }
      return false;
    });
  }, [filters]);
  
  const clearFilters = useCallback(() => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      const value = (filters as any)[key];
      if (typeof value === 'string') {
        acc[key] = key === 'search' ? '' : 'all';
      } else if (typeof value === 'object' && value !== null) {
        acc[key] = Object.keys(value).reduce((objAcc, objKey) => {
          objAcc[objKey] = '';
          return objAcc;
        }, {} as any);
      }
      return acc;
    }, {} as any);
    
    setFilters(clearedFilters);
  }, [filters, setFilters]);
  
  return {
    filters,
    setFilters,
    hasActiveFilters,
    clearFilters,
  };
}

// Analytics Hook
export function useSellerAnalytics(params: {
  startDate: string;
  endDate: string;
  metrics: string[];
  groupBy?: 'day' | 'week' | 'month';
}) {
  return useQuery({
    queryKey: SELLER_QUERY_KEYS.analytics(params),
    queryFn: () => sellerApiService.getAnalytics(params),
    enabled: !!(params.startDate && params.endDate && params.metrics.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Notifications Hook
export function useSellerNotifications() {
  const { notifications, unreadCount } = useSellerStore((state) => ({
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
  }));
  
  const markAsRead = useSellerStore((state) => state.markNotificationAsRead);
  
  const markAsReadMutation = useMutation({
    mutationFn: sellerApiService.markNotificationAsRead,
    onSuccess: (_, id) => {
      markAsRead(id);
    },
  });
  
  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}