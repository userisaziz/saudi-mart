export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'seller' | 'support'
  avatar?: string
  isVerified: boolean
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
  
  // Seller specific fields
  businessName?: string
  businessType?: string
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  
  // Admin specific fields
  permissions?: string[]
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: 'seller'
  businessName?: string
  businessType?: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}