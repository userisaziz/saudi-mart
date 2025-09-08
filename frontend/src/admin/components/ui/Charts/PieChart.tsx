import React from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { PieChart as PieChartIcon } from 'lucide-react'

interface PieChartProps {
  data: any[]
  title?: string
  titleAr?: string
  height?: number
  dataKey: string
  nameKey: string
  colors: string[]
  showLegend?: boolean
  showTooltip?: boolean
  currency?: 'SAR' | 'USD' | 'EUR'
  locale?: 'en' | 'ar'
  formatType?: 'number' | 'currency' | 'percentage'
  loading?: boolean
  innerRadius?: number
  outerRadius?: number
  showLabels?: boolean
  showPercentage?: boolean
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

const CustomTooltip = ({ active, payload, formatType = 'number', currency = 'SAR', locale = 'en', showPercentage = true }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.name}</p>
        <div className="flex items-center space-x-2 mt-1">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: data.color }}
          />
          <span className="text-sm">
            {formatValue(data.value, formatType, currency, locale)}
            {showPercentage && ` (${data.payload.percentage?.toFixed(1)}%)`}
          </span>
        </div>
      </div>
    )
  }
  return null
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, showLabels, showPercentage }: any) => {
  if (!showLabels && !showPercentage) return null
  
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {showPercentage ? `${(percent * 100).toFixed(0)}%` : name}
    </text>
  )
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  titleAr,
  height = 300,
  dataKey,
  nameKey,
  colors,
  showLegend = true,
  showTooltip = true,
  currency = 'SAR',
  locale = 'en',
  formatType = 'number',
  loading = false,
  innerRadius = 0,
  outerRadius = 80,
  showLabels = false,
  showPercentage = true
}) => {
  const isArabic = locale === 'ar'
  const displayTitle = isArabic && titleAr ? titleAr : title

  // Calculate percentages
  const total = data.reduce((sum, entry) => sum + entry[dataKey], 0)
  const dataWithPercentages = data.map(entry => ({
    ...entry,
    percentage: (entry[dataKey] / total) * 100
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5" />
            <span>{displayTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-72 bg-muted rounded-full mx-auto w-72"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PieChartIcon className="h-5 w-5" />
          <span>{displayTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={dataWithPercentages}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels || showPercentage ? 
                (props) => renderCustomLabel({...props, showLabels, showPercentage}) : 
                false
              }
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip 
                content={
                  <CustomTooltip 
                    formatType={formatType} 
                    currency={currency} 
                    locale={locale}
                    showPercentage={showPercentage}
                  />
                }
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload?.percentage?.toFixed(1)}%)
                  </span>
                )}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
        
        {/* Custom Legend for better Arabic support */}
        {showLegend && isArabic && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {dataWithPercentages.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="truncate" dir="rtl">
                  {entry[nameKey]} ({entry.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}