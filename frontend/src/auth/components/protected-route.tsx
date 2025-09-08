import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/contexts/auth-context'
import { LoadingSpinner } from '@/shared/components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredVerification?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredVerification = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'admin' ? '/admin' : '/seller'
    return <Navigate to={redirectPath} replace />
  }

  if (requiredVerification && !user.isVerified) {
    return <Navigate to="/auth/verify-email" replace />
  }

  return <>{children}</>
}