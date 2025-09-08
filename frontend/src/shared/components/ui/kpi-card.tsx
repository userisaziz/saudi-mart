import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { cn } from '@/shared/utils/cn'

interface KPICardProps {
  title: string
  titleAr?: string
  value: string | number
  previousValue?: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  trend?: Array<{ label: string; value: number }>
  currency?: 'SAR' | 'USD' | 'EUR'
  locale?: 'en' | 'ar'
  format?: 'number' | 'currency' | 'percentage'
  precision?: number
  className?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const formatValue = (
  value: string | number,
  format: 'number' | 'currency' | 'percentage' = 'number',
  currency: 'SAR' | 'USD' | 'EUR' = 'SAR',
  locale: 'en' | 'ar' = 'en',
  precision: number = 0
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '0'
  
  const isArabic = locale === 'ar'
  const localeCode = isArabic ? 'ar-SA' : 'en-US'
  
  switch (format) {
    case 'currency':
      const currencyCode = currency === 'SAR' ? 'SAR' : currency
      const formatted = new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(numValue)
      
      // For Arabic, we might want to add the currency symbol differently
      if (isArabic && currency === 'SAR') {
        return `${numValue.toLocaleString('ar-SA', { minimumFractionDigits: precision })} ريال`
      }
      return formatted
      
    case 'percentage':
      return new Intl.NumberFormat(localeCode, {
        style: 'percent',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(numValue / 100)
      
    default:
      return new Intl.NumberFormat(localeCode, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(numValue)
  }
}

const getChangeIcon = (changeType?: 'increase' | 'decrease' | 'neutral') => {
  switch (changeType) {
    case 'increase':
      return TrendingUp
    case 'decrease':
      return TrendingDown
    default:
      return Minus
  }
}

const getChangeColor = (changeType?: 'increase' | 'decrease' | 'neutral') => {
  switch (changeType) {
    case 'increase':
      return 'text-success'
    case 'decrease':
      return 'text-destructive'
    default:
      return 'text-muted-foreground'
  }
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  titleAr,
  value,
  previousValue,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  currency = 'SAR',
  locale = 'en',
  format = 'number',
  precision = 0,
  className,
  loading = false,
  size = 'md'
}) => {
  const isArabic = locale === 'ar'
  const displayTitle = isArabic && titleAr ? titleAr : title
  
  const formattedValue = formatValue(value, format, currency, locale, precision)
  const formattedChange = change ? Math.abs(change) : 0
  
  const ChangeIcon = getChangeIcon(changeType)
  const changeColorClass = getChangeColor(changeType)
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  }
  
  const textSizes = {
    sm: {
      title: 'text-sm',
      value: 'text-2xl',
      change: 'text-xs'
    },
    md: {
      title: 'text-sm',
      value: 'text-3xl',
      change: 'text-sm'
    },
    lg: {
      title: 'text-base',
      value: 'text-4xl',
      change: 'text-base'
    }
  }

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className={sizeClasses[size]}>
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
            {Icon && <div className="h-8 w-8 bg-muted rounded"></div>}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("hover:shadow-medium transition-all duration-200", className)}>
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center justify-between space-x-4 rtl:space-x-reverse">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={cn(
                "font-medium text-muted-foreground truncate",
                textSizes[size].title
              )}>
                {displayTitle}
              </p>
              {trend && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {isArabic ? 'اتجاه' : 'Trend'}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <p className={cn(
                "font-bold text-foreground",
                textSizes[size].value,
                isArabic && "font-arabic"
              )}>
                {formattedValue}
              </p>
              
              {change !== undefined && (
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <ChangeIcon className={cn("h-4 w-4", changeColorClass)} />
                  <span className={cn(
                    "font-medium",
                    textSizes[size].change,
                    changeColorClass
                  )}>
                    {formatValue(formattedChange, format === 'currency' ? 'number' : format, currency, locale, 1)}
                    {format === 'currency' && format !== 'percentage' && '%'}
                  </span>
                  <span className={cn(
                    "text-muted-foreground",
                    textSizes[size].change
                  )}>
                    {isArabic ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {Icon && (
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          )}
        </div>
        
        {/* Mini trend chart placeholder */}
        {trend && trend.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-end justify-between h-8 space-x-1">
              {trend.slice(-7).map((point, index) => (
                <div
                  key={index}
                  className="bg-primary/20 rounded-sm flex-1 transition-all duration-200 hover:bg-primary/30"
                  style={{ 
                    height: `${Math.max((point.value / Math.max(...trend.map(p => p.value))) * 100, 10)}%` 
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isArabic ? 'آخر 7 أيام' : 'Last 7 days'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized KPI Cards for common Saudi admin dashboard metrics
export const RevenueKPICard: React.FC<Omit<KPICardProps, 'format' | 'currency'>> = (props) => (
  <KPICard {...props} format="currency" currency="SAR" />
)

export const UserKPICard: React.FC<Omit<KPICardProps, 'format'>> = (props) => (
  <KPICard {...props} format="number" />
)

export const PercentageKPICard: React.FC<Omit<KPICardProps, 'format'>> = (props) => (
  <KPICard {...props} format="percentage" />
)