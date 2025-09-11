import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Activity, 
  Download, 
  Calendar, 
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  MapPin,
  Clock,
  Target,
  Eye,
  MousePointer,
  ShoppingCart,
  UserCheck,
  Package,
  AlertCircle
} from 'lucide-react'
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  LoadingSpinner
} from '@/shared/components/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'

// Mock data for Saudi regions
const saudiRegions = [
  { name: 'Riyadh' },
  { name: 'Makkah' },
  { name: 'Eastern Province' },
  { name: 'Asir' },
  { name: 'Tabuk' },
  { name: 'Qassim' },
  { name: 'Hail' },
  { name: 'Madinah' },
  { name: 'Al Baha' },
  { name: 'Northern Border' },
  { name: 'Jazan' },
  { name: 'Najran' },
  { name: 'Al Jawf' }
]

const revenueData = [
  { month: 'January', monthAr: 'يناير', revenue: 450000, orders: 1250, customers: 890 },
  { month: 'February', monthAr: 'فبراير', revenue: 520000, orders: 1450, customers: 1020 },
  { month: 'March', monthAr: 'مارس', revenue: 480000, orders: 1320, customers: 945 },
  { month: 'April', monthAr: 'أبريل', revenue: 610000, orders: 1680, customers: 1180 },
  { month: 'May', monthAr: 'مايو', revenue: 680000, orders: 1850, customers: 1320 },
  { month: 'June', monthAr: 'يونيو', revenue: 750000, orders: 2050, customers: 1450 }
]

const topCategories = [
  { name: 'المواد الغذائية والمشروبات', nameEn: 'Food & Beverages', revenue: 285000, percentage: 38 },
  { name: 'الملابس والأزياء', nameEn: 'Fashion & Clothing', revenue: 195000, percentage: 26 },
  { name: 'الإلكترونيات', nameEn: 'Electronics', revenue: 150000, percentage: 20 },
  { name: 'المنزل والحديقة', nameEn: 'Home & Garden', revenue: 120000, percentage: 16 }
]

const regionalData = [
  { region: 'Riyadh', regionAr: 'الرياض', revenue: 180000, users: 2450, percentage: 24 },
  { region: 'Jeddah', regionAr: 'جدة', revenue: 165000, users: 2180, percentage: 22 },
  { region: 'Dammam', regionAr: 'الدمام', revenue: 120000, users: 1650, percentage: 16 },
  { region: 'Makkah', regionAr: 'مكة المكرمة', revenue: 95000, users: 1320, percentage: 13 },
  { region: 'Madinah', regionAr: 'المدينة المنورة', revenue: 85000, users: 1180, percentage: 11 },
  { region: 'Other Regions', regionAr: 'مناطق أخرى', revenue: 105000, users: 1420, percentage: 14 }
]

// Enhanced analytics data with real-time capabilities
const CHART_COLORS = {
  primary: '#0ea5e9',
  success: '#22c55e', 
  warning: '#f59e0b',
  danger: '#ef4444',
  secondary: '#6b7280',
  purple: '#8b5cf6',
  orange: '#f97316',
  pink: '#ec4899'
}

const trafficSourceData = [
  { source: 'Organic Search', sourceAr: 'البحث العضوي', visitors: 45230, percentage: 35.2, growth: 12.3 },
  { source: 'Social Media', sourceAr: 'وسائل التواصل', visitors: 28450, percentage: 22.1, growth: -3.2 },
  { source: 'Paid Ads', sourceAr: 'إعلانات مدفوعة', visitors: 19680, percentage: 15.3, growth: 28.5 },
  { source: 'Direct Access', sourceAr: 'الدخول المباشر', visitors: 22140, percentage: 17.2, growth: 5.7 },
  { source: 'Referrals', sourceAr: 'المراجع', visitors: 13200, percentage: 10.2, growth: 8.9 }
]

const hourlyTrafficData = [
  { hour: '00:00', visitors: 120, orders: 5 },
  { hour: '02:00', visitors: 80, orders: 2 },
  { hour: '04:00', visitors: 60, orders: 1 },
  { hour: '06:00', visitors: 180, orders: 8 },
  { hour: '08:00', visitors: 420, orders: 25 },
  { hour: '10:00', visitors: 680, orders: 45 },
  { hour: '12:00', visitors: 850, orders: 62 },
  { hour: '14:00', visitors: 920, orders: 78 },
  { hour: '16:00', visitors: 780, orders: 58 },
  { hour: '18:00', visitors: 650, orders: 42 },
  { hour: '20:00', visitors: 520, orders: 35 },
  { hour: '22:00', visitors: 380, orders: 18 }
]

const deviceAnalytics = [
  { device: 'Mobile', deviceAr: 'المحمول', users: 15420, percentage: 68.2, orders: 890 },
  { device: 'Desktop', deviceAr: 'سطح المكتب', users: 5680, percentage: 25.1, orders: 456 },
  { device: 'Tablet', deviceAr: 'الجهاز اللوحي', users: 1520, percentage: 6.7, orders: 78 }
]

const topProducts = [
  { name: 'هاتف سامسونج جالاكسي', nameEn: 'Samsung Galaxy Phone', sales: 245, revenue: 368000, growth: 15.2 },
  { name: 'لابتوب ديل', nameEn: 'Dell Laptop', sales: 189, revenue: 283500, growth: -2.1 },
  { name: 'كاميرا كانون', nameEn: 'Canon Camera', sales: 156, revenue: 234000, growth: 22.8 },
  { name: 'سماعات آبل', nameEn: 'Apple Headphones', sales: 312, revenue: 187200, growth: 8.5 }
]

const competitorAnalysis = [
  { name: 'Competitor A', nameAr: 'المنافس أ', marketShare: 28.5, trend: 'up', performance: 'strong' },
  { name: 'Competitor B', nameAr: 'المنافس ب', marketShare: 22.1, trend: 'down', performance: 'weak' },
  { name: 'Competitor C', nameAr: 'المنافس ج', marketShare: 18.3, trend: 'stable', performance: 'moderate' },
  { name: 'Our Platform', nameAr: 'منصتنا', marketShare: 31.1, trend: 'up', performance: 'excellent' }
]

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ar-SA').format(num)
}

const formatPercentage = (percentage: number) => {
  return `${percentage}%`
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const totalRevenue = 750000
  const totalOrders = 2050
  const totalCustomers = 1450
  const conversionRate = 3.2
  const avgOrderValue = 366
  const cartAbandonmentRate = 68.5
  const newCustomers = 456
  const returningCustomers = 994
  const bounceRate = 42.3
  const sessionDuration = 245 // seconds

  const revenueGrowth = 12.5
  const orderGrowth = 8.3
  const customerGrowth = 15.7
  const trafficGrowth = 18.9

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting analytics data as ${format}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into platform performance and market trends</p>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Last updated: 5 minutes ago</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>Live: 1,234 visitors</span>
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {saudiRegions.map(region => (
                <SelectItem key={region.name} value={region.name}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
              <SelectItem value="custom">Custom period</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="default"
            className="gap-2"
            onClick={() => handleExport('pdf')}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{formatSARCurrency(totalRevenue)}</p>
                </div>
                <div className="flex items-center mt-1 space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{revenueGrowth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{formatNumber(totalOrders)}</p>
                <div className="flex items-center mt-1 space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{orderGrowth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{formatNumber(totalCustomers)}</p>
                <div className="flex items-center mt-1 space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{customerGrowth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <div className="flex items-center mt-1 space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+1.2%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                <p className="text-2xl font-bold">{formatSARCurrency(avgOrderValue)}</p>
                <div className="flex items-center mt-1 space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+5.8%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-pink-100">
                <ShoppingBag className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Traffic Growth</p>
                <p className="text-2xl font-bold">+{trafficGrowth}%</p>
                <div className="flex items-center mt-1 space-x-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">High</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-teal-100">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full max-w-3xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue and Orders Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Sales Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'revenue' ? formatSARCurrency(value as number) : formatNumber(value as number),
                          name === 'revenue' ? 'Revenue' : 'Orders'
                        ]}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill={CHART_COLORS.primary} name="revenue" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke={CHART_COLORS.success} strokeWidth={3} name="orders" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Sales by Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={topCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="name"
                      >
                        {topCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatSARCurrency(value as number), 'Revenue']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Performance by Region</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regionalData.map((region, index) => (
                  <div key={region.region} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{region.region}</h4>
                      <Badge variant="secondary">{region.percentage}%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-medium">{formatSARCurrency(region.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Users:</span>
                        <span className="font-medium">{formatNumber(region.users)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          {/* Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSourceData.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{source.source}</span>
                          <Badge variant={source.growth > 0 ? 'default' : 'destructive'}>
                            {source.growth > 0 ? '+' : ''}{source.growth}%
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{formatNumber(source.visitors)}</span>
                          <span className="text-muted-foreground text-sm">({source.percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={hourlyTrafficData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="visitors" fill={CHART_COLORS.primary} name="Visitors" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke={CHART_COLORS.success} strokeWidth={2} name="Orders" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deviceAnalytics.map((device, index) => (
                  <div key={device.device} className="p-6 border rounded-lg text-center hover:bg-accent transition-colors">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: Object.values(CHART_COLORS)[index] + '20' }}>
                      <MousePointer className="w-8 h-8" style={{ color: Object.values(CHART_COLORS)[index] }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{device.device}</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{formatNumber(device.users)}</div>
                      <div className="text-sm text-muted-foreground">{device.percentage}% of users</div>
                      <div className="text-sm">{formatNumber(device.orders)} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Best-Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">{formatNumber(product.sales)}</span>
                        <span className="text-sm text-muted-foreground">sales</span>
                      </div>
                      <div className="text-sm font-medium">{formatSARCurrency(product.revenue)}</div>
                      <div className="flex items-center space-x-1">
                        {product.growth > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-600" />
                        )}
                        <span className={`text-xs ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competition Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAnalysis.map((competitor, index) => (
                  <div key={competitor.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        competitor.name === 'منصتنا' ? 'bg-primary/20' : 'bg-gray-100'
                      }`}>
                        <BarChart3 className={`w-6 h-6 ${
                          competitor.name === 'منصتنا' ? 'text-primary' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{competitor.name}</h4>
                        <p className="text-sm text-muted-foreground">Market Share: {competitor.marketShare}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        competitor.performance === 'excellent' ? 'default' :
                        competitor.performance === 'strong' ? 'secondary' :
                        competitor.performance === 'moderate' ? 'outline' : 'destructive'
                      }>
                        {competitor.performance === 'excellent' ? 'Excellent' :
                         competitor.performance === 'strong' ? 'Strong' :
                         competitor.performance === 'moderate' ? 'Moderate' : 'Weak'}
                      </Badge>
                      <div className="flex items-center mt-2 space-x-1">
                        {competitor.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : competitor.trend === 'down' ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {competitor.trend === 'up' ? 'Rising' : 
                           competitor.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs with placeholder content */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Detailed sales analysis and trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Comprehensive analysis of customer behavior and preferences</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}