import { apiClient } from '@/shared/services/api-client'
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from '@/auth/types'

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return response.data
  }

  async validateToken(token: string): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.user
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data)
    return response.data
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', data)
    return response.data
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>('/auth/profile', data)
    return response.data
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post<{ avatarUrl: string }>('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/verify-email', { token })
    return response.data
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/resend-verification')
    return response.data
  }

  // Business verification for sellers
  async submitBusinessVerification(data: {
    businessDocument: File
    identityDocument: File
    additionalInfo?: string
  }): Promise<{ message: string }> {
    const formData = new FormData()
    formData.append('businessDocument', data.businessDocument)
    formData.append('identityDocument', data.identityDocument)
    if (data.additionalInfo) {
      formData.append('additionalInfo', data.additionalInfo)
    }

    const response = await apiClient.post<{ message: string }>('/auth/business-verification', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  async getVerificationStatus(): Promise<{
    status: 'pending' | 'verified' | 'rejected'
    submittedAt?: string
    reviewedAt?: string
    rejectionReason?: string
  }> {
    const response = await apiClient.get('/auth/verification-status')
    return response.data
  }
}

export const authService = new AuthService()