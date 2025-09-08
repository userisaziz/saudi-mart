import React from 'react'
import { Outlet } from 'react-router-dom'
import { Card, CardContent } from '@/shared/components/ui'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">B2B CRM</h1>
          <p className="text-muted-foreground mt-2">
            Manage your business relationships
          </p>
        </div>
        
        <Card className="shadow-medium">
          <CardContent className="p-6">
            <Outlet />
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>&copy; 2024 B2B CRM. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}