import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
} from 'lucide-react'

interface OrderAnalytics {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  topSellers: Array<{
    name: string
    orders: number
    revenue: number
  }>
  monthlySales: Array<{
    month: string
    orders: number
    revenue: number
  }>
  dailySales: Array<{
    date: string
    orders: number
    revenue: number
  }>
  ordersByStatus: Record<string, number>
  ordersByCity: Array<{
    city: string
    orders: number
    percentage: number
  }>
  revenueGrowth: number
  ordersGrowth: number
}

const mockAnalytics: OrderAnalytics = {
  totalOrders: 1247,
  totalRevenue: 156750.00,
  averageOrderValue: 125.74,
  completedOrders: 1089,
  pendingOrders: 89,
  cancelledOrders: 69,
  topProducts: [
    { name: 'جهاز كمبيوتر محمول', sales: 45, revenue: 112500.00 },
    { name: 'هاتف ذكي', sales: 78, revenue: 62400.00 },
    { name: 'سماعات لاسلكية', sales: 156, revenue: 31200.00 },
    { name: 'كاميرا رقمية', sales: 23, revenue: 28750.00 },
    { name: 'جهاز لوحي', sales: 34, revenue: 20400.00 }
  ],
  topSellers: [
    { name: 'متجر التقنية', orders: 234, revenue: 45600.00 },
    { name: 'مكتبة المعرفة', orders: 189, revenue: 28350.00 },
    { name: 'متجر المكتبيات', orders: 156, revenue: 31200.00 },
    { name: 'متجر الأزياء', orders: 145, revenue: 21750.00 },
    { name: 'متجر الرياضة', orders: 123, revenue: 18450.00 }
  ],
  monthlySales: [
    { month: 'يناير', orders: 98, revenue: 12250.00 },
    { month: 'فبراير', orders: 123, revenue: 15375.00 },
    { month: 'مارس', orders: 156, revenue: 19500.00 },
    { month: 'أبريل', orders: 134, revenue: 16750.00 },
    { month: 'مايو', orders: 189, revenue: 23625.00 },
    { month: 'يونيو', orders: 167, revenue: 20875.00 },
    { month: 'يوليو', orders: 145, revenue: 18125.00 },
    { month: 'أغسطس', orders: 178, revenue: 22250.00 },
    { month: 'سبتمبر', orders: 156, revenue: 19500.00 },
    { month: 'أكتوبر', orders: 134, revenue: 16750.00 },
    { month: 'نوفمبر', orders: 123, revenue: 15375.00 },
    { month: 'ديسمبر', orders: 98, revenue: 12250.00 }
  ],
  dailySales: [
    { date: '2024-01-15', orders: 12, revenue: 1500.00 },
    { date: '2024-01-16', orders: 15, revenue: 1875.00 },
    { date: '2024-01-17', orders: 18, revenue: 2250.00 },
    { date: '2024-01-18', orders: 14, revenue: 1750.00 },
    { date: '2024-01-19', orders: 16, revenue: 2000.00 },
    { date: '2024-01-20', orders: 20, revenue: 2500.00 },
    { date: '2024-01-21', orders: 22, revenue: 2750.00 }
  ],
  ordersByStatus: {
    completed: 1089,
    pending: 89,
    processing: 45,
    shipped: 34,
    cancelled: 69,
    returned: 23
  },
  ordersByCity: [
    { city: 'الرياض', orders: 387, percentage: 31.1 },
    { city: 'جدة', orders: 298, percentage: 23.9 },
    { city: 'الدمام', orders: 186, percentage: 14.9 },
    { city: 'مكة المكرمة', orders: 149, percentage: 12.0 },
    { city: 'المدينة المنورة', orders: 112, percentage: 9.0 },
    { city: 'أخرى', orders: 115, percentage: 9.2 }
  ],
  revenueGrowth: 15.8,
  ordersGrowth: 12.3
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800'
}

const statusLabels: Record<string, string> = {
  completed: 'مكتملة',
  pending: 'معلقة',
  processing: 'قيد المعالجة',
  shipped: 'مشحونة',
  cancelled: 'ملغاة',
  returned: 'مُرتجعة'
}

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('orders')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getGrowthIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">تحليلات الطلبات</h1>
          <p className="text-muted-foreground mt-1">
            إحصائيات ومقاييس الأداء للطلبات والمبيعات
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 أيام</SelectItem>
              <SelectItem value="30d">30 يوم</SelectItem>
              <SelectItem value="90d">90 يوم</SelectItem>
              <SelectItem value="1y">سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{formatNumber(mockAnalytics.totalOrders)}</p>
                <div className={`flex items-center gap-1 text-sm ${getGrowthColor(mockAnalytics.ordersGrowth)}`}>
                  {getGrowthIcon(mockAnalytics.ordersGrowth)}
                  <span>{formatPercentage(mockAnalytics.ordersGrowth)}</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold">{formatCurrency(mockAnalytics.totalRevenue)}</p>
                <div className={`flex items-center gap-1 text-sm ${getGrowthColor(mockAnalytics.revenueGrowth)}`}>
                  {getGrowthIcon(mockAnalytics.revenueGrowth)}
                  <span>{formatPercentage(mockAnalytics.revenueGrowth)}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط قيمة الطلب</p>
                <p className="text-2xl font-bold">{formatCurrency(mockAnalytics.averageOrderValue)}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>لكل طلب</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الطلبات المكتملة</p>
                <p className="text-2xl font-bold">{formatNumber(mockAnalytics.completedOrders)}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>{((mockAnalytics.completedOrders / mockAnalytics.totalOrders) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات حسب الحالة</CardTitle>
            <CardDescription>توزيع الطلبات على حالات مختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(mockAnalytics.ordersByStatus).map(([status, count]) => {
                const percentage = (count / mockAnalytics.totalOrders) * 100
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[status]}>
                        {statusLabels[status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {formatNumber(count)}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Orders by City */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات حسب المدينة</CardTitle>
            <CardDescription>توزيع الطلبات جغرافياً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.ordersByCity.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{city.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${city.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {formatNumber(city.orders)}
                    </span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {city.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنتجات</CardTitle>
            <CardDescription>المنتجات الأكثر مبيعاً</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>المبيعات</TableHead>
                  <TableHead>الإيرادات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAnalytics.topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatNumber(product.sales)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(product.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل البائعين</CardTitle>
            <CardDescription>البائعين الأكثر نشاطاً</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>البائع</TableHead>
                  <TableHead>الطلبات</TableHead>
                  <TableHead>الإيرادات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAnalytics.topSellers.map((seller, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">{seller.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatNumber(seller.orders)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(seller.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>المبيعات الشهرية</CardTitle>
          <CardDescription>تطور المبيعات والإيرادات على مدار السنة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {mockAnalytics.monthlySales.slice(0, 6).map((month, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground">{month.month}</p>
                    <p className="text-lg font-bold text-blue-600">{formatNumber(month.orders)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(month.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {mockAnalytics.monthlySales.slice(6, 12).map((month, index) => (
                <div key={index + 6} className="text-center">
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground">{month.month}</p>
                    <p className="text-lg font-bold text-green-600">{formatNumber(month.orders)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(month.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Daily Performance */}
      <Card>
        <CardHeader>
          <CardTitle>الأداء اليومي الأخير</CardTitle>
          <CardDescription>آخر 7 أيام من البيانات</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>الطلبات</TableHead>
                <TableHead>الإيرادات</TableHead>
                <TableHead>متوسط قيمة الطلب</TableHead>
                <TableHead>التغيير</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnalytics.dailySales.map((day, index) => {
                const avgOrderValue = day.revenue / day.orders
                const previousDay = mockAnalytics.dailySales[index - 1]
                const change = previousDay ? 
                  ((day.orders - previousDay.orders) / previousDay.orders) * 100 : 0

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(day.date).toLocaleDateString('ar-SA', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatNumber(day.orders)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(day.revenue)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(avgOrderValue)}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${getGrowthColor(change)}`}>
                        {getGrowthIcon(change)}
                        <span className="text-sm">
                          {change !== 0 ? formatPercentage(change) : '-'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}