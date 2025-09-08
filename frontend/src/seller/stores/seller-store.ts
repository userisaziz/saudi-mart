import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
interface Product {
  id: string;
  name: string;
  nameAr: string;
  sku: string;
  category: string;
  categoryAr: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock';
  images: string[];
  description: string;
  descriptionAr: string;
  tags: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  createdAt: string;
  updatedAt: string;
  sales: number;
  views: number;
  rating: number;
  reviewCount: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  source: string;
  value: number;
  currency: string;
  products: string[];
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }>;
  activities: Array<{
    id: string;
    type: 'call' | 'email' | 'meeting' | 'note';
    description: string;
    createdAt: string;
  }>;
  lastContact?: string;
  nextFollowUp?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalLeads: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  newLeads: number;
  qualifiedLeads: number;
  pendingOrders: number;
  shippedOrders: number;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

interface SellerProfile {
  businessName: string;
  businessNameAr: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  descriptionAr: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  certifications: string[];
  founded: string;
  employees: string;
  industry: string;
  taxId?: string;
  bankAccount?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    iban?: string;
  };
}

// Store interface
interface SellerState {
  // Data
  products: Product[];
  leads: Lead[];
  orders: Order[];
  metrics: DashboardMetrics | null;
  notifications: Notification[];
  profile: SellerProfile | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedProducts: string[];
  selectedLeads: string[];
  selectedOrders: string[];
  
  // Filters & Search
  productFilters: {
    search: string;
    category: string;
    status: string;
    stockLevel: string;
    priceRange: string;
  };
  leadFilters: {
    search: string;
    status: string;
    priority: string;
    source: string;
    assignedTo: string;
  };
  orderFilters: {
    search: string;
    status: string;
    paymentStatus: string;
    dateRange: { start: string; end: string };
  };
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProducts: (ids: string[]) => void;
  setProductFilters: (filters: Partial<SellerState['productFilters']>) => void;
  
  // Lead actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  setSelectedLeads: (ids: string[]) => void;
  setLeadFilters: (filters: Partial<SellerState['leadFilters']>) => void;
  
  // Order actions
  setOrders: (orders: Order[]) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setSelectedOrders: (ids: string[]) => void;
  setOrderFilters: (filters: Partial<SellerState['orderFilters']>) => void;
  
  // Metrics actions
  setMetrics: (metrics: DashboardMetrics) => void;
  
  // Notification actions
  setNotifications: (notifications: Notification[]) => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  
  // Profile actions
  setProfile: (profile: SellerProfile) => void;
  updateProfile: (updates: Partial<SellerProfile>) => void;
  
  // Utility actions
  clearFilters: () => void;
  reset: () => void;
}

const initialState = {
  products: [],
  leads: [],
  orders: [],
  metrics: null,
  notifications: [],
  profile: null,
  isLoading: false,
  error: null,
  selectedProducts: [],
  selectedLeads: [],
  selectedOrders: [],
  productFilters: {
    search: '',
    category: 'all',
    status: 'all',
    stockLevel: 'all',
    priceRange: 'all',
  },
  leadFilters: {
    search: '',
    status: 'all',
    priority: 'all',
    source: 'all',
    assignedTo: 'all',
  },
  orderFilters: {
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: { start: '', end: '' },
  },
};

export const useSellerStore = create<SellerState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Basic actions
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),
          
        setError: (error) =>
          set((state) => {
            state.error = error;
          }),
        
        // Product actions
        setProducts: (products) =>
          set((state) => {
            state.products = products;
          }),
          
        addProduct: (product) =>
          set((state) => {
            state.products.push(product);
          }),
          
        updateProduct: (id, updates) =>
          set((state) => {
            const index = state.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              Object.assign(state.products[index], updates, {
                updatedAt: new Date().toISOString(),
              });
            }
          }),
          
        deleteProduct: (id) =>
          set((state) => {
            state.products = state.products.filter((p) => p.id !== id);
            state.selectedProducts = state.selectedProducts.filter((pId) => pId !== id);
          }),
          
        setSelectedProducts: (ids) =>
          set((state) => {
            state.selectedProducts = ids;
          }),
          
        setProductFilters: (filters) =>
          set((state) => {
            Object.assign(state.productFilters, filters);
          }),
        
        // Lead actions
        setLeads: (leads) =>
          set((state) => {
            state.leads = leads;
          }),
          
        addLead: (lead) =>
          set((state) => {
            state.leads.push(lead);
          }),
          
        updateLead: (id, updates) =>
          set((state) => {
            const index = state.leads.findIndex((l) => l.id === id);
            if (index !== -1) {
              Object.assign(state.leads[index], updates, {
                updatedAt: new Date().toISOString(),
              });
            }
          }),
          
        deleteLead: (id) =>
          set((state) => {
            state.leads = state.leads.filter((l) => l.id !== id);
            state.selectedLeads = state.selectedLeads.filter((lId) => lId !== id);
          }),
          
        setSelectedLeads: (ids) =>
          set((state) => {
            state.selectedLeads = ids;
          }),
          
        setLeadFilters: (filters) =>
          set((state) => {
            Object.assign(state.leadFilters, filters);
          }),
        
        // Order actions
        setOrders: (orders) =>
          set((state) => {
            state.orders = orders;
          }),
          
        updateOrder: (id, updates) =>
          set((state) => {
            const index = state.orders.findIndex((o) => o.id === id);
            if (index !== -1) {
              Object.assign(state.orders[index], updates, {
                updatedAt: new Date().toISOString(),
              });
            }
          }),
          
        setSelectedOrders: (ids) =>
          set((state) => {
            state.selectedOrders = ids;
          }),
          
        setOrderFilters: (filters) =>
          set((state) => {
            Object.assign(state.orderFilters, filters);
          }),
        
        // Metrics actions
        setMetrics: (metrics) =>
          set((state) => {
            state.metrics = metrics;
          }),
        
        // Notification actions
        setNotifications: (notifications) =>
          set((state) => {
            state.notifications = notifications;
          }),
          
        markNotificationAsRead: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (notification) {
              notification.read = true;
            }
          }),
          
        addNotification: (notification) =>
          set((state) => {
            const newNotification = {
              ...notification,
              id: Date.now().toString(),
            };
            state.notifications.unshift(newNotification);
          }),
        
        // Profile actions
        setProfile: (profile) =>
          set((state) => {
            state.profile = profile;
          }),
          
        updateProfile: (updates) =>
          set((state) => {
            if (state.profile) {
              Object.assign(state.profile, updates);
            }
          }),
        
        // Utility actions
        clearFilters: () =>
          set((state) => {
            state.productFilters = initialState.productFilters;
            state.leadFilters = initialState.leadFilters;
            state.orderFilters = initialState.orderFilters;
          }),
          
        reset: () =>
          set((state) => {
            Object.assign(state, initialState);
          }),
      })),
      {
        name: 'seller-store',
        partialize: (state) => ({
          productFilters: state.productFilters,
          leadFilters: state.leadFilters,
          orderFilters: state.orderFilters,
          profile: state.profile,
        }),
      }
    ),
    { name: 'seller-store' }
  )
);

// Selectors
export const useSellerProducts = () => {
  const products = useSellerStore((state) => state.products);
  const filters = useSellerStore((state) => state.productFilters);
  const selectedProducts = useSellerStore((state) => state.selectedProducts);
  
  return {
    products,
    filters,
    selectedProducts,
    activeProducts: products.filter((p) => p.status === 'active'),
    lowStockProducts: products.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0),
    outOfStockProducts: products.filter((p) => p.stock === 0),
  };
};

export const useSellerLeads = () => {
  const leads = useSellerStore((state) => state.leads);
  const filters = useSellerStore((state) => state.leadFilters);
  const selectedLeads = useSellerStore((state) => state.selectedLeads);
  
  return {
    leads,
    filters,
    selectedLeads,
    newLeads: leads.filter((l) => l.status === 'new'),
    qualifiedLeads: leads.filter((l) => l.status === 'qualified'),
    hotLeads: leads.filter((l) => l.priority === 'urgent' || l.priority === 'high'),
  };
};

export const useSellerOrders = () => {
  const orders = useSellerStore((state) => state.orders);
  const filters = useSellerStore((state) => state.orderFilters);
  const selectedOrders = useSellerStore((state) => state.selectedOrders);
  
  return {
    orders,
    filters,
    selectedOrders,
    pendingOrders: orders.filter((o) => o.status === 'pending'),
    processingOrders: orders.filter((o) => o.status === 'processing'),
    shippedOrders: orders.filter((o) => o.status === 'shipped'),
  };
};

export const useSellerNotifications = () => {
  const notifications = useSellerStore((state) => state.notifications);
  
  return {
    notifications,
    unreadNotifications: notifications.filter((n) => !n.read),
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};

// Export types for use in components
export type { Product, Lead, Order, DashboardMetrics, Notification, SellerProfile };