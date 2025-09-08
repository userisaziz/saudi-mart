import React from 'react'
import { Button } from '@/shared/components/ui'

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
        <p className="text-muted-foreground mt-2">
          Enter your email to receive reset instructions
        </p>
      </div>
      
      <div className="text-center p-8 text-muted-foreground">
        <p>Password reset form will be implemented here</p>
        <Button variant="outline" className="mt-4">
          Coming Soon
        </Button>
      </div>
    </div>
  )
}

export default ForgotPasswordPage