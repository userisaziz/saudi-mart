import React, { Component, ErrorInfo } from 'react'
import { AlertCircle, RefreshCw, Home, Bug, FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      errorId: Math.random().toString(36).substr(2, 9)
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo, errorId: Math.random().toString(36).substr(2, 9) })
    
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: Math.random().toString(36).substr(2, 9)
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    }
    
    console.log('Error Report:', errorReport)
    
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('تم نسخ تقرير الخطأ إلى الحافظة'))
      .catch(() => console.log('Failed to copy error report'))
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-destructive">
                حدث خطأ غير متوقع
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                نعتذر، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert className="text-left">
                  <Bug className="h-4 w-4" />
                  <AlertDescription className="mt-2">
                    <details>
                      <summary className="cursor-pointer font-medium mb-2">
                        تفاصيل الخطأ (وضع التطوير)
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {this.state.error.toString()}
                      </pre>
                      {this.state.errorInfo && (
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40 mt-2">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              {/* Error ID */}
              <div className="text-center text-sm text-muted-foreground">
                معرف الخطأ: <code className="bg-muted px-2 py-1 rounded">{this.state.errorId}</code>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.location.reload()} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  إعادة تحميل الصفحة
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} className="gap-2">
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
                <Button variant="secondary" onClick={this.handleReportError} className="gap-2">
                  <FileText className="w-4 h-4" />
                  إرسال تقرير الخطأ
                </Button>
              </div>

              {/* Support Information */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <h4 className="font-medium">هل تحتاج مساعدة؟</h4>
                    <p className="text-sm text-muted-foreground">
                      تواصل مع فريق الدعم الفني مع ذكر معرف الخطأ أعلاه
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                      <span>البريد الإلكتروني: support@platform.sa</span>
                      <span className="hidden sm:inline">|</span>
                      <span>الهاتف: +966-11-123-4567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Simpler error fallback component for specific sections
export const ErrorFallback: React.FC<{
  error?: Error
  resetError?: () => void
  title?: string
  message?: string
}> = ({ 
  error, 
  resetError, 
  title = "حدث خطأ", 
  message = "تعذر تحميل هذا القسم" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-destructive">{title}</h3>
        <p className="text-muted-foreground mt-1">{message}</p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm">تفاصيل الخطأ</summary>
            <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
              {error.toString()}
            </pre>
          </details>
        )}
      </div>
      {resetError && (
        <Button onClick={resetError} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          المحاولة مرة أخرى
        </Button>
      )}
    </div>
  )
}

// Hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, resetError }
}

export default ErrorBoundary