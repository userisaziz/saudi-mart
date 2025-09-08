import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { API_CONFIG, LOCAL_STORAGE_KEYS } from '@/shared/utils/constants'

export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  timestamp: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  code?: string
  statusCode: number
}

class ApiClient {
  private instance: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.instance = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add request timestamp for logging
        config.metadata = { startTime: Date.now() }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          })
        }

        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata) {
          const duration = Date.now() - response.config.metadata.startTime
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
            status: response.status,
            data: response.data,
          })
        }

        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Log error in development
        if (import.meta.env.DEV) {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          })
        }

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshTokens()
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.instance(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthFailure()
            return Promise.reject(refreshError)
          }
        }

        // Handle other errors
        return Promise.reject(this.normalizeError(error))
      }
    )
  }

  private async refreshTokens(): Promise<string | null> {
    // Prevent multiple refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    if (!refreshToken) {
      this.handleAuthFailure()
      return null
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken)
    
    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}/auth/refresh`,
      { refreshToken },
      { timeout: 10000 }
    )

    const { token, refreshToken: newRefreshToken, user } = response.data

    // Update stored tokens
    localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token)
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user))

    return token
  }

  private handleAuthFailure() {
    // Clear auth data
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)

    // Redirect to login if not already there
    if (!window.location.pathname.startsWith('/auth')) {
      window.location.href = '/auth/login'
    }
  }

  private normalizeError(error: AxiosError): ApiError {
    const response = error.response

    if (response?.data) {
      return {
        message: (response.data as any).message || 'An error occurred',
        errors: (response.data as any).errors,
        code: (response.data as any).code,
        statusCode: response.status,
      }
    }

    // Network or other errors
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. Please try again.',
        statusCode: 408,
      }
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      }
    }

    return {
      message: error.message || 'An unexpected error occurred',
      statusCode: response?.status || 0,
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config)
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config)
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config)
  }

  // File upload helper
  async uploadFile<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
    additionalData?: Record<string, any>
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })
    }

    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  }

  // Download helper
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Cancel request helper
  createCancelToken() {
    return axios.CancelToken.source()
  }

  // Check if error is a cancel error
  isCancel(error: any): boolean {
    return axios.isCancel(error)
  }
}

export const apiClient = new ApiClient()

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}