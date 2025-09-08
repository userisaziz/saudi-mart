import React from 'react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LineChartProps {
  data: any[]
  title?: string
  titleAr?: string
  height?: number
  lines: {
    key: string
    name: string
    nameAr?: string
    color: string
    strokeWidth?: number
  }[]
  xAxisKey: string
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  currency?: 'SAR' | 'USD' | 'EUR'
  locale?: 'en' | 'ar'
  formatType?: 'number' | 'currency' | 'percentage'
  loading?: boolean
  trend?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
}

const formatValue = (value: number, formatType: 'number' | 'currency' | 'percentage', currency: string, locale: string) => {
  const isArabic = locale === 'ar'
  const localeCode = isArabic ? 'ar-SA' : 'en-US'
  
  switch (formatType) {
    case 'currency':
      return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    case 'percentage':
      return `${value.toFixed(1)}%`
    default:
      return new Intl.NumberFormat(localeCode).format(value)
  }
}

const CustomTooltip = ({ active, payload, label, formatType = 'number', currency = 'SAR', locale = 'en' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {formatValue(entry.value, formatType, currency, locale)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  titleAr,
  height = 300,
  lines,
  xAxisKey,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  currency = 'SAR',
  locale = 'en',
  formatType = 'number',
  loading = false,
  trend
}) => {
  const isArabic = locale === 'ar'
  const displayTitle = isArabic && titleAr ? titleAr : title

  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-success" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground'
    
    switch (trend.type) {
      case 'increase':
        return 'text-success'
      case 'decrease':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{displayTitle}</span>
            {trend && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-72 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{displayTitle}</span>
          {trend && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => formatValue(value, formatType, currency, locale)}
            />
            {showTooltip && (
              <Tooltip 
                content={
                  <CustomTooltip 
                    formatType={formatType} 
                    currency={currency} 
                    locale={locale} 
                  />
                }
              />
            )}
            {showLegend && <Legend />}
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                name={isArabic && line.nameAr ? line.nameAr : line.name}
                dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}