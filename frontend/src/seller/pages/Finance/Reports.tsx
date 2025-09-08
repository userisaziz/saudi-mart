import React, { useState } from 'react'
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, FileText, BarChart3 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

const mockFinancialData = {
  totalRevenue: 125000,
  totalExpenses: 45000,
  netProfit: 80000,
  monthlyGrowth: 15.5,
  yearlyGrowth: 23.2,
  topProducts: [
    { name: 'ماكينة صناعية A100', revenue: 45000 },
    { name: 'قطع غيار متنوعة', revenue: 32000 },
    { name: 'أدوات قياس', revenue: 28000 }
  ],
  monthlyData: [
    { month: 'يناير', revenue: 18000, expenses: 7000 },
    { month: 'فبراير', revenue: 22000, expenses: 8500 },
    { month: 'مارس', revenue: 25000, expenses: 9200 },
    { month: 'أبريل', revenue: 28000, expenses: 10300 },
    { month: 'مايو', revenue: 32000, expenses: 10000 }
  ]
}

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState('6months')
  const [reportType, setReportType] = useState('overview')

  const data = mockFinancialData

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير المالية</h1>
          <p className="text-gray-600">تحليل شامل للأداء المالي والإيرادات</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">الشهر الماضي</SelectItem>
              <SelectItem value="3months">آخر 3 أشهر</SelectItem>
              <SelectItem value="6months">آخر 6 أشهر</SelectItem>
              <SelectItem value="1year">السنة الماضية</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي الإيرادات</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{formatSARCurrency(data.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +{data.monthlyGrowth}% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي المصروفات</CardTitle>
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{formatSARCurrency(data.totalExpenses)}</div>
            <div className="flex items-center text-xs text-red-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +8.2% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">صافي الربح</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-green-600">
              {formatSARCurrency(data.netProfit)}
            </div>
            <div className="flex items-center text-xs text-green-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +{data.yearlyGrowth}% من السنة الماضية
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">هامش الربح</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">
              {((data.netProfit / data.totalRevenue) * 100).toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-green-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              صحي جداً
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">الإيرادات والمصروفات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-between gap-2 px-4">
              {data.monthlyData.map((month, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="flex gap-1 items-end h-48">
                    <div 
                      className="bg-blue-500 rounded-t-sm w-6 min-h-[20px] flex items-end justify-center text-white text-xs font-medium"
                      style={{ 
                        height: `${(month.revenue / Math.max(...data.monthlyData.map(d => d.revenue))) * 180}px` 
                      }}
                    >
                    </div>
                    <div 
                      className="bg-red-400 rounded-t-sm w-6 min-h-[10px]"
                      style={{ 
                        height: `${(month.expenses / Math.max(...data.monthlyData.map(d => d.revenue))) * 180}px` 
                      }}
                    >
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    {month.month}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>الإيرادات</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span>المصروفات</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">أعلى المنتجات إيراداً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-right">{product.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatSARCurrency(product.revenue)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((product.revenue / data.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تقارير مفصلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span>تقرير الأرباح والخسائر</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>تحليل التدفق النقدي</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>تقرير النمو</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">خيارات التصدير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير Excel
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              تقرير مجدول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}