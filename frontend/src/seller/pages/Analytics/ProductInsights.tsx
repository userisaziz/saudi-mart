import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Package, Eye, ShoppingCart, Star, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'

interface ProductMetrics {
  id: string
  name: string
  nameAr: string
  category: string
  views: number
  sales: number
  revenue: number
  rating: number
  stock: number
  conversionRate: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

const mockProducts: ProductMetrics[] = [
  {
    id: 'P001',
    name: 'Industrial Machine A100',
    nameAr: 'ماكينة صناعية A100',
    category: 'Machinery',
    views: 1250,
    sales: 25,
    revenue: 375000,
    rating: 4.8,
    stock: 12,
    conversionRate: 2.0,
    trend: 'up',
    trendPercentage: 15.5
  },
  {
    id: 'P002',
    name: 'Industrial Parts Set',
    nameAr: 'مجموعة قطع غيار صناعية',
    category: 'Parts',
    views: 890,
    sales: 45,
    revenue: 67500,
    rating: 4.6,
    stock: 156,
    conversionRate: 5.1,
    trend: 'up',
    trendPercentage: 8.3
  },
  {
    id: 'P003',
    name: 'Precision Tools',
    nameAr: 'أدوات قياس دقيقة',
    category: 'Tools',
    views: 650,
    sales: 18,
    revenue: 27000,
    rating: 4.4,
    stock: 34,
    conversionRate: 2.8,
    trend: 'down',
    trendPercentage: -3.2
  }
]

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4 text-green-600" />
    case 'down':
      return <TrendingDown className="w-4 h-4 text-red-600" />
    default:
      return <TrendingUp className="w-4 h-4 text-gray-600" />
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'text-green-600'
    case 'down':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export default function ProductInsightsPage() {
  const [products, setProducts] = useState<ProductMetrics[]>(mockProducts)
  const [timeRange, setTimeRange] = useState('30days')
  const [sortBy, setSortBy] = useState('revenue')

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views
      case 'sales':
        return b.sales - a.sales
      case 'revenue':
        return b.revenue - a.revenue
      case 'rating':
        return b.rating - a.rating
      case 'conversion':
        return b.conversionRate - a.conversionRate
      default:
        return 0
    }
  })

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)
  const totalViews = products.reduce((sum, p) => sum + p.views, 0)
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0)
  const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">رؤى المنتجات</h1>
          <p className="text-gray-600">تحليل شامل لأداء المنتجات والمبيعات</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 3 أشهر</SelectItem>
              <SelectItem value="1year">آخر سنة</SelectItem>
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
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{formatSARCurrency(totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +12.5% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي المشاهدات</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +8.3% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي المبيعات</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{totalSales}</div>
            <div className="flex items-center text-xs text-purple-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +15.7% من الشهر الماضي
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">متوسط التقييم</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{averageRating.toFixed(1)}</div>
            <div className="flex items-center text-xs text-yellow-600 justify-end mt-1">
              <Star className="w-4 h-4 ml-1" />
              من 5 نجوم
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sorting Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">أداء المنتجات</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">الإيرادات</SelectItem>
                  <SelectItem value="views">المشاهدات</SelectItem>
                  <SelectItem value="sales">المبيعات</SelectItem>
                  <SelectItem value="rating">التقييم</SelectItem>
                  <SelectItem value="conversion">معدل التحويل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid gap-4">
        {sortedProducts.map((product, index) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{product.nameAr}</h3>
                      <p className="text-sm text-gray-600">{product.name}</p>
                      <Badge variant="outline" className="mt-1">{product.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {getTrendIcon(product.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(product.trend)}`}>
                      {product.trend === 'up' ? '+' : product.trend === 'down' ? '' : ''}{product.trendPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">الاتجاه</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-4 h-4 text-blue-600 ml-1" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{product.views.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">مشاهدة</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ShoppingCart className="w-4 h-4 text-green-600 ml-1" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{product.sales}</p>
                  <p className="text-xs text-green-600">مبيعة</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-600 ml-1" />
                  </div>
                  <p className="text-xl font-bold text-purple-600">{formatSARCurrency(product.revenue)}</p>
                  <p className="text-xs text-purple-600">إيرادات</p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 text-yellow-600 ml-1" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{product.rating}</p>
                  <p className="text-xs text-yellow-600">تقييم</p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Package className="w-4 h-4 text-orange-600 ml-1" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{product.stock}</p>
                  <p className="text-xs text-orange-600">متوفر</p>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-indigo-600 ml-1" />
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">{product.conversionRate}%</p>
                  <p className="text-xs text-indigo-600">تحويل</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span>معدل التحويل: {product.conversionRate}% ({product.sales} من {product.views} مشاهدة)</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 ml-1" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    تحسين الأداء
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نصائح لتحسين الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="border-r-4 border-blue-500 bg-blue-50 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">تحسين معدل التحويل</h4>
              <p className="text-blue-800 text-sm">
                المنتجات ذات معدل التحويل الأقل من 3% قد تحتاج إلى تحسين في الصور أو الوصف أو السعر
              </p>
            </div>
            <div className="border-r-4 border-green-500 bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-900 mb-2">زيادة المشاهدات</h4>
              <p className="text-green-800 text-sm">
                استخدم كلمات مفتاحية أكثر فعالية وحسّن من الوصف لزيادة ظهور منتجاتك في البحث
              </p>
            </div>
            <div className="border-r-4 border-orange-500 bg-orange-50 p-4 rounded">
              <h4 className="font-semibold text-orange-900 mb-2">إدارة المخزون</h4>
              <p className="text-orange-800 text-sm">
                المنتجات ذات المخزون المنخفض قد تفقد فرص مبيعات. تأكد من توفر مخزون كافي للمنتجات عالية الطلب
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}