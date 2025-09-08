import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, Store } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { useAuth } from '@/auth/contexts/auth-context'

interface LocationState {
  from?: {
    pathname: string
  }
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as LocationState
  const from = state?.from?.pathname

  const handleDummyLogin = async (role: 'admin' | 'seller') => {
    setIsLoading(true)
    
    try {
      const dummyCredentials = {
        email: role === 'admin' ? 'admin@demo.com' : 'seller@demo.com',
        password: 'dummy123'
      }
      
      await login(dummyCredentials)
      
      // Navigate based on role
      const destination = from || (role === 'admin' ? '/admin' : '/seller')
      navigate(destination, { replace: true })
    } catch (error: any) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Demo Login</h2>
        <p className="text-muted-foreground mt-2">
          Choose your role to access the dashboard
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => handleDummyLogin('admin')}
          className="w-full h-16 text-left flex items-center justify-start space-x-4"
          variant="outline"
          loading={isLoading}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold text-lg">Login as Admin</div>
            <div className="text-sm text-muted-foreground">
              Access admin dashboard and manage users
            </div>
          </div>
        </Button>

        <Button
          onClick={() => handleDummyLogin('seller')}
          className="w-full h-16 text-left flex items-center justify-start space-x-4"
          variant="outline"
          loading={isLoading}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold text-lg">Login as Seller</div>
            <div className="text-sm text-muted-foreground">
              Access seller dashboard and manage products
            </div>
          </div>
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <strong>Demo Mode:</strong> Authentication is bypassed. Click any button above to login.
      </div>
    </div>
  )
}

export default LoginPage