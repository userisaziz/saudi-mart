import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, AuthState, LoginRequest, RegisterRequest } from '@/auth/types'
import { authService } from '@/auth/services/auth-service'
import { LOCAL_STORAGE_KEYS } from '@/shared/utils/constants'

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_AUTH' }

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false,
      }
    
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      if (typeof window === 'undefined') {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
      const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
      const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER)

      if (token && refreshToken && userData) {
        const user = JSON.parse(userData)
        
        // Skip backend validation for dummy auth
        dispatch({
          type: 'SET_AUTH',
          payload: { user, token, refreshToken }
        })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Dummy login - bypass backend authentication
      const dummyUser: User = {
        id: credentials.email === 'admin@demo.com' ? '1' : '2',
        email: credentials.email,
        firstName: credentials.email === 'admin@demo.com' ? 'Admin' : 'Seller',
        lastName: 'User',
        role: credentials.email === 'admin@demo.com' ? 'admin' : 'seller',
        isVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        businessName: credentials.email === 'seller@demo.com' ? 'Demo Business' : undefined,
        verificationStatus: credentials.email === 'seller@demo.com' ? 'verified' : undefined
      }
      
      const dummyResponse = {
        user: dummyUser,
        token: 'dummy-token-' + Date.now(),
        refreshToken: 'dummy-refresh-token-' + Date.now()
      }
      
      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, dummyResponse.token)
        localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, dummyResponse.refreshToken)
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(dummyResponse.user))
      }
      
      dispatch({
        type: 'SET_AUTH',
        payload: {
          user: dummyResponse.user,
          token: dummyResponse.token,
          refreshToken: dummyResponse.refreshToken
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const response = await authService.register(data)
      
      // Store auth data
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(response.user))
      
      dispatch({
        type: 'SET_AUTH',
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = () => {
    clearAuthData()
    dispatch({ type: 'CLEAR_AUTH' })
  }

  const refreshAuth = async () => {
    if (!state.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await authService.refreshToken(state.refreshToken)
      
      // Update stored auth data
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, response.token)
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(response.user))
      
      dispatch({
        type: 'SET_AUTH',
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken
        }
      })
    } catch (error) {
      logout()
      throw error
    }
  }

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
    
    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData }
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser))
    }
  }

  const clearAuthData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    updateUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}