import React from 'react'
import { Button } from '@/shared/components/ui'

const RegisterPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground mt-2">
          Join our platform to start managing your business
        </p>
      </div>
      
      <div className="text-center p-8 text-muted-foreground">
        <p>Registration form will be implemented here</p>
        <Button variant="outline" className="mt-4">
          Coming Soon
        </Button>
      </div>
    </div>
  )
}

export default RegisterPage