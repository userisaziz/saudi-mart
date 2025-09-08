export interface User {
  id: string;
  email: string;
  fullName: string;
  arabicName: string;
  phone: string;
  role: 'admin' | 'customer' | 'seller';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  nationalId?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  lastLogin?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  businessInfo?: {
    name: string;
    arabicName: string;
    commercialRegister: string;
    taxNumber: string;
    category: string;
  };
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  currency: 'SAR';
  categoryId: string;
  sellerId: string;
  images: string[];
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  parentId?: string;
  icon?: string;
  image?: string;
  status: 'active' | 'inactive';
  productCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface Order {
  id: string;
  userId: string;
  sellerId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  totalAmount: number;
  currency: 'SAR';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'cod' | 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingMethod: 'standard' | 'express' | 'pickup';
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameAr: string;
  quantity: number;
  price: number;
  totalPrice: number;
  productImage?: string;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface VerificationDocument {
  id: string;
  userId: string;
  type: 'national_id' | 'commercial_register' | 'tax_certificate' | 'bank_certificate';
  status: 'pending' | 'approved' | 'rejected';
  documentUrl: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  expiryDate?: string;
}

export interface AdminNotification {
  id: string;
  type: 'user_registration' | 'product_submission' | 'order_placed' | 'verification_required' | 'system_alert';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  userId?: string;
  relatedId?: string;
}

export interface KPIData {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  pendingVerifications: number;
  monthlyGrowth: {
    users: number;
    products: number;
    revenue: number;
    orders: number;
  };
}

export interface ChartData {
  date: string;
  hijriDate: string;
  revenue: number;
  orders: number;
  users: number;
  products: number;
}

export interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  actionAr: string;
  resourceType: 'user' | 'product' | 'order' | 'category' | 'verification';
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminStats {
  today: {
    newUsers: number;
    newOrders: number;
    revenue: number;
    pendingVerifications: number;
  };
  thisWeek: {
    newUsers: number;
    newOrders: number;
    revenue: number;
    completedVerifications: number;
  };
  thisMonth: {
    newUsers: number;
    newOrders: number;
    revenue: number;
    totalVerifications: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  messageAr?: string;
  error?: string;
  errorAr?: string;
}

// Form interfaces
export interface UserFormData {
  email: string;
  fullName: string;
  arabicName: string;
  phone: string;
  role: User['role'];
  status: User['status'];
  nationalId?: string;
  address?: Partial<Address>;
}

export interface ProductFormData {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  categoryId: string;
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: Product['dimensions'];
  tags: string[];
  images: File[];
}

export interface CategoryFormData {
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  parentId?: string;
  status: Category['status'];
  order: number;
  icon?: string;
  image?: File;
}

// Enums for better type safety
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SELLER = 'seller'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum KYCStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECTED = 'rejected'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}