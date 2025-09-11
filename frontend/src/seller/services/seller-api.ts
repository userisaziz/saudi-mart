import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/shared/utils/constants';
import type { 
  Product, 
  Lead, 
  Order, 
  DashboardMetrics, 
  Notification, 
  SellerProfile 
} from '@/seller/stores/seller-store';

// API Response types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Request types
interface ProductCreateRequest {
  name: string;
  nameAr: string;
  sku: string;
  category: string;
  categoryAr: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  descriptionAr: string;
  tags: string[];
  images: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
}

interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  status?: 'active' | 'inactive' | 'draft';
}

interface LeadCreateRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  source: string;
  value: number;
  currency: string;
  products: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
}

interface LeadUpdateRequest extends Partial<LeadCreateRequest> {
  status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  nextFollowUp?: string;
  assignedTo?: string;
}

interface OrderUpdateRequest {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

interface BulkUpdateRequest {
  ids: string[];
  updates: Record<string, any>;
}

interface AnalyticsRequest {
  startDate: string;
  endDate: string;
  metrics: string[];
  groupBy?: 'day' | 'week' | 'month';
}

class SellerApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}/seller`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'An error occurred',
        code: error.response.data.code || 'UNKNOWN_ERROR',
        details: error.response.data.details,
      };
    }
    return {
      message: error.message || 'Network error',
      code: 'NETWORK_ERROR',
    };
  }

  // Dashboard & Analytics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await this.api.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
    return response.data.data;
  }

  async getAnalytics(params: AnalyticsRequest): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/analytics', { params });
    return response.data.data;
  }

  // Products API
  async getProducts(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    const response = await this.api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  }

  async createProduct(data: ProductCreateRequest): Promise<Product> {
    const response = await this.api.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  }

  async updateProduct(id: string, data: ProductUpdateRequest): Promise<Product> {
    const response = await this.api.patch<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  async bulkUpdateProducts(data: BulkUpdateRequest): Promise<void> {
    await this.api.patch('/products/bulk', data);
  }

  async duplicateProduct(id: string): Promise<Product> {
    const response = await this.api.post<ApiResponse<Product>>(`/products/${id}/duplicate`);
    return response.data.data;
  }

  async uploadProductImages(productId: string, files: FormData): Promise<string[]> {
    const response = await this.api.post<ApiResponse<string[]>>(
      `/products/${productId}/images`,
      files,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  async bulkUploadProducts(file: FormData): Promise<{ successful: number; failed: number; errors: any[] }> {
    const response = await this.api.post<ApiResponse<any>>('/products/bulk-upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Leads API
  async getLeads(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    priority?: string;
    source?: string;
    assignedTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Lead>> {
    const response = await this.api.get<PaginatedResponse<Lead>>('/leads', { params });
    return response.data;
  }

  async getLead(id: string): Promise<Lead> {
    const response = await this.api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  }

  async createLead(data: LeadCreateRequest): Promise<Lead> {
    const response = await this.api.post<ApiResponse<Lead>>('/leads', data);
    return response.data.data;
  }

  async updateLead(id: string, data: LeadUpdateRequest): Promise<Lead> {
    const response = await this.api.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data.data;
  }

  async deleteLead(id: string): Promise<void> {
    await this.api.delete(`/leads/${id}`);
  }

  async addLeadNote(id: string, note: string): Promise<Lead> {
    const response = await this.api.post<ApiResponse<Lead>>(`/leads/${id}/notes`, { note });
    return response.data.data;
  }

  async scheduleFollowUp(id: string, date: string, type: 'call' | 'email' | 'meeting', notes?: string): Promise<Lead> {
    const response = await this.api.post<ApiResponse<Lead>>(`/leads/${id}/follow-up`, {
      date,
      type,
      notes,
    });
    return response.data.data;
  }

  async convertLeadToOrder(id: string): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>(`/leads/${id}/convert`);
    return response.data.data;
  }

  // Orders API
  async getOrders(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Order>> {
    const response = await this.api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  }

  async updateOrder(id: string, data: OrderUpdateRequest): Promise<Order> {
    const response = await this.api.patch<ApiResponse<Order>>(`/orders/${id}`, data);
    return response.data.data;
  }

  async cancelOrder(id: string, reason: string): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
    return response.data.data;
  }

  async fulfillOrder(id: string, trackingNumber: string, carrier?: string): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>(`/orders/${id}/fulfill`, {
      trackingNumber,
      carrier,
    });
    return response.data.data;
  }

  async generateInvoice(id: string): Promise<{ invoiceUrl: string }> {
    const response = await this.api.post<ApiResponse<{ invoiceUrl: string }>>(`/orders/${id}/invoice`);
    return response.data.data;
  }

  async processRefund(id: string, amount: number, reason: string): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>(`/orders/${id}/refund`, {
      amount,
      reason,
    });
    return response.data.data;
  }

  // Notifications API
  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    const response = await this.api.get<PaginatedResponse<Notification>>('/notifications', { params });
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.api.patch(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.api.patch('/notifications/read-all');
  }

  async deleteNotification(id: string): Promise<void> {
    await this.api.delete(`/notifications/${id}`);
  }

  // Profile API
  async getProfile(): Promise<SellerProfile> {
    const response = await this.api.get<ApiResponse<SellerProfile>>('/profile');
    return response.data.data;
  }

  async updateProfile(data: Partial<SellerProfile>): Promise<SellerProfile> {
    const response = await this.api.patch<ApiResponse<SellerProfile>>('/profile', data);
    return response.data.data;
  }

  async uploadLogo(file: FormData): Promise<{ logoUrl: string }> {
    const response = await this.api.post<ApiResponse<{ logoUrl: string }>>('/profile/logo', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  async uploadDocuments(files: FormData): Promise<{ documentUrls: string[] }> {
    const response = await this.api.post<ApiResponse<{ documentUrls: string[] }>>('/profile/documents', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Reports API
  async getSalesReport(params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month';
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/reports/sales', { params });
    return response.data.data;
  }

  async getProductPerformanceReport(params: {
    startDate: string;
    endDate: string;
    productIds?: string[];
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/reports/products', { params });
    return response.data.data;
  }

  async getCustomerReport(params: {
    startDate: string;
    endDate: string;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/reports/customers', { params });
    return response.data.data;
  }

  // Communication API
  async sendEmail(data: {
    to: string[];
    subject: string;
    body: string;
    templateId?: string;
    leadId?: string;
  }): Promise<{ messageId: string }> {
    const response = await this.api.post<ApiResponse<{ messageId: string }>>('/communication/email', data);
    return response.data.data;
  }


  async getMessageTemplates(): Promise<Array<{ id: string; name: string; subject?: string; content: string; type: 'email' }>> {
    const response = await this.api.get<ApiResponse<any[]>>('/communication/templates');
    return response.data.data;
  }

  async createMessageTemplate(data: {
    name: string;
    subject?: string;
    content: string;
    type: 'email';
  }): Promise<{ id: string }> {
    const response = await this.api.post<ApiResponse<{ id: string }>>('/communication/templates', data);
    return response.data.data;
  }

  // Inventory API
  async updateStock(productId: string, quantity: number, reason?: string): Promise<Product> {
    const response = await this.api.patch<ApiResponse<Product>>(`/inventory/${productId}`, {
      quantity,
      reason,
    });
    return response.data.data;
  }

  async getStockMovements(params?: {
    productId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<any>> {
    const response = await this.api.get<PaginatedResponse<any>>('/inventory/movements', { params });
    return response.data;
  }

  async getStockAlerts(): Promise<Array<{ productId: string; productName: string; currentStock: number; threshold: number }>> {
    const response = await this.api.get<ApiResponse<any[]>>('/inventory/alerts');
    return response.data.data;
  }
}

// Create singleton instance
export const sellerApiService = new SellerApiService();

// Export types for components
export type {
  ProductCreateRequest,
  ProductUpdateRequest,
  LeadCreateRequest,
  LeadUpdateRequest,
  OrderUpdateRequest,
  BulkUpdateRequest,
  AnalyticsRequest,
  ApiResponse,
  PaginatedResponse,
  ApiError,
};