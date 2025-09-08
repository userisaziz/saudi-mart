import React from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { BarChart3 } from 'lucide-react'

interface BarChartProps {
  data: any[]
  title?: string
  titleAr?: string
  height?: number
  bars: {
    key: string
    name: string
    nameAr?: string
    color: string
  }[]
  xAxisKey: string
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  currency?: 'SAR' | 'USD' | 'EUR'
  locale?: 'en' | 'ar'
  formatType?: 'number' | 'currency' | 'percentage'
  loading?: boolean
  orientation?: 'vertical' | 'horizontal'
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
              className="w-3 h-3 rounded-sm" 
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

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  titleAr,
  height = 300,
  bars,
  xAxisKey,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  currency = 'SAR',
  locale = 'en',
  formatType = 'number',
  loading = false,
  orientation = 'vertical'
}) => {
  const isArabic = locale === 'ar'
  const displayTitle = isArabic && titleAr ? titleAr : title

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>{displayTitle}</span>
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
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>{displayTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />}
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
              type={orientation === 'horizontal' ? 'number' : 'category'}
              tickFormatter={orientation === 'horizontal' ? 
                (value) => formatValue(value, formatType, currency, locale) : 
                undefined
              }
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
              type={orientation === 'horizontal' ? 'category' : 'number'}
              tickFormatter={orientation === 'vertical' ? 
                (value) => formatValue(value, formatType, currency, locale) : 
                undefined
              }
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
            {bars.map((bar, index) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                fill={bar.color}
                name={isArabic && bar.nameAr ? bar.nameAr : bar.name}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}