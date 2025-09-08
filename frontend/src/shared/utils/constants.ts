export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
} as const

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'B2B CRM',
  VERSION: '1.0.0',
  DESCRIPTION: 'B2B CRM Dashboard'
} as const

export const FILE_CONFIG = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf').split(','),
  UPLOAD_CHUNK_SIZE: 1024 * 1024 // 1MB chunks
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    VERIFICATION: '/admin/verification'
  },
  
  // Seller routes  
  SELLER: {
    DASHBOARD: '/seller',
    PRODUCTS: '/seller/products',
    LEADS: '/seller/leads',
    PROFILE: '/seller/profile',
    ANALYTICS: '/seller/analytics',
    MESSAGES: '/seller/messages'
  }
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  SUPPORT: 'support'
} as const

export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
} as const

export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost'
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
} as const

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  LANGUAGE: 'language'
} as const

export const SESSION_STORAGE_KEYS = {
  FORM_DATA: 'form_data',
  SEARCH_FILTERS: 'search_filters',
  TABLE_SORT: 'table_sort'
} as const