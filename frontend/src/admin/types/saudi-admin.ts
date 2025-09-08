// Saudi-specific admin types and interfaces

export interface SaudiUser {
  id: string;
  email: string;
  phone: string;
  nationalId?: string; // Saudi National ID
  iqamaNumber?: string; // Iqama number for expats
  name: {
    ar: string; // Arabic name
    en: string; // English name
  };
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  verificationLevel: VerificationLevel;
  businessInfo?: SaudiBusinessInfo;
  addresses: SaudiAddress[];
  preferences: {
    language: 'ar' | 'en';
    timezone: string; // Saudi timezone
    prayerTimeNotifications: boolean;
    hijriCalendar: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface SaudiBusinessInfo {
  commercialRegistration: string; // CR number
  vatNumber?: string; // VAT certificate number
  businessNameAr: string;
  businessNameEn: string;
  businessType: BusinessType;
  samaLicense?: string; // SAMA financial license
  establishmentCard?: string;
  isActive: boolean;
  verificationStatus: BusinessVerificationStatus;
}

export interface SaudiAddress {
  id: string;
  type: 'home' | 'business' | 'warehouse';
  buildingNumber: string;
  streetName: {
    ar: string;
    en: string;
  };
  district: {
    ar: string;
    en: string;
  };
  city: {
    ar: string;
    en: string;
  };
  region: SaudiRegion;
  postalCode: string;
  additionalNumber: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface SaudiProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: {
    amount: number;
    currency: 'SAR';
    vatIncluded: boolean;
  };
  category: SaudiCategory;
  seller: {
    id: string;
    name: string;
    verificationStatus: VerificationLevel;
  };
  images: ProductImage[];
  specifications: ProductSpecification[];
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    location: string;
  };
  compliance: {
    saudiStandards: boolean; // SASO standards
    halalCertified?: boolean;
    importLicense?: string;
    customsCode?: string;
  };
  verificationStatus: ProductVerificationStatus;
  adminNotes?: AdminNote[];
  createdAt: string;
  updatedAt: string;
}

export interface SaudiCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  parentId?: string;
  level: number;
  children?: SaudiCategory[];
  isActive: boolean;
  requiresVerification: boolean;
  sasoCompliant: boolean; // Saudi Standards, Metrology and Quality Org
  icon?: string;
  displayOrder: number;
  seoData: {
    slugAr: string;
    slugEn: string;
    metaTitleAr?: string;
    metaTitleEn?: string;
    metaDescriptionAr?: string;
    metaDescriptionEn?: string;
  };
  analytics: {
    productCount: number;
    activeProducts: number;
    totalRevenue: number;
    avgPrice: number;
  };
}

export interface KYCDocument {
  id: string;
  userId: string;
  type: SaudiDocumentType;
  status: DocumentStatus;
  frontImage: string;
  backImage?: string;
  extractedData: ExtractedDocumentData;
  verificationNotes?: AdminNote[];
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  expiryDate?: string;
}

export interface AdminLead {
  id: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    city: string;
    region: SaudiRegion;
  };
  productInterest: {
    productId: string;
    productName: string;
    category: string;
    priceRange?: {
      min: number;
      max: number;
    };
  };
  conversation: LeadMessage[];
  assignedTo?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  score: number;
  tags: string[];
  followUpDate?: string;
  lastContactDate?: string;
  notes: AdminNote[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    pendingVerifications: number;
    totalRevenue: {
      amount: number;
      currency: 'SAR';
    };
    monthlyGrowth: number;
  };
  revenue: {
    daily: RevenueDataPoint[];
    monthly: RevenueDataPoint[];
    yearly: RevenueDataPoint[];
    byRegion: RegionRevenueData[];
    byCategory: CategoryRevenueData[];
  };
  users: {
    registrations: UserRegistrationData[];
    engagement: UserEngagementData[];
    demographics: UserDemographicsData;
    verification: VerificationStatsData[];
  };
  products: {
    performance: ProductPerformanceData[];
    categories: CategoryPerformanceData[];
    verification: ProductVerificationData[];
    inventory: InventoryData[];
  };
}

// Enums
export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  SUPPORT = 'support',
  SELLER = 'seller',
  BUYER = 'buyer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum VerificationLevel {
  UNVERIFIED = 'unverified',
  EMAIL_VERIFIED = 'email_verified',
  PHONE_VERIFIED = 'phone_verified',
  IDENTITY_VERIFIED = 'identity_verified',
  BUSINESS_VERIFIED = 'business_verified',
  FULLY_VERIFIED = 'fully_verified'
}

export enum BusinessType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
  PARTNERSHIP = 'partnership',
  LLC = 'llc',
  CORPORATION = 'corporation'
}

export enum BusinessVerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INCOMPLETE = 'incomplete'
}

export enum SaudiRegion {
  RIYADH = 'riyadh',
  MAKKAH = 'makkah',
  EASTERN = 'eastern',
  ASIR = 'asir',
  JAZAN = 'jazan',
  MADINAH = 'madinah',
  QASSIM = 'qassim',
  HAIL = 'hail',
  TABUK = 'tabuk',
  NORTHERN_BORDERS = 'northern_borders',
  NAJRAN = 'najran',
  AL_BAHAH = 'al_bahah',
  AL_JAWF = 'al_jawf'
}

export enum SaudiDocumentType {
  NATIONAL_ID = 'national_id',
  IQAMA = 'iqama',
  COMMERCIAL_REGISTRATION = 'commercial_registration',
  VAT_CERTIFICATE = 'vat_certificate',
  SAMA_LICENSE = 'sama_license',
  ESTABLISHMENT_CARD = 'establishment_card',
  BUSINESS_LICENSE = 'business_license'
}

export enum DocumentStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum ProductVerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_INFO = 'requires_info'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL_SENT = 'proposal_sent',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum LeadSource {
  WEBSITE = 'website',
  PHONE = 'phone',
  EMAIL = 'email',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  ADVERTISEMENT = 'advertisement'
}

// Supporting interfaces
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductSpecification {
  nameAr: string;
  nameEn: string;
  valueAr: string;
  valueEn: string;
  unit?: string;
}

export interface AdminNote {
  id: string;
  content: string;
  adminId: string;
  adminName: string;
  createdAt: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface ExtractedDocumentData {
  documentNumber: string;
  fullName?: string;
  nationality?: string;
  dateOfBirth?: string;
  expiryDate?: string;
  issueDate?: string;
  [key: string]: any;
}

export interface LeadMessage {
  id: string;
  senderId: string;
  senderType: 'customer' | 'admin';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface RevenueDataPoint {
  date: string;
  amount: number;
  transactions: number;
}

export interface RegionRevenueData {
  region: SaudiRegion;
  amount: number;
  percentage: number;
}

export interface CategoryRevenueData {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface UserRegistrationData {
  date: string;
  count: number;
  verified: number;
}

export interface UserEngagementData {
  date: string;
  activeUsers: number;
  sessionDuration: number;
}

export interface UserDemographicsData {
  byAge: { range: string; count: number }[];
  byRegion: { region: SaudiRegion; count: number }[];
  byVerificationLevel: { level: VerificationLevel; count: number }[];
}

export interface VerificationStatsData {
  date: string;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ProductPerformanceData {
  productId: string;
  productName: string;
  views: number;
  sales: number;
  revenue: number;
}

export interface CategoryPerformanceData {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalSales: number;
  totalRevenue: number;
}

export interface ProductVerificationData {
  date: string;
  pending: number;
  approved: number;
  rejected: number;
}

export interface InventoryData {
  productId: string;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  reorderLevel: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}