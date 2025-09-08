import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  LoadingSpinner
} from '@/shared/components/ui'
import { KPICard, RevenueKPICard, UserKPICard, PercentageKPICard } from '@/shared/components/ui/kpi-card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
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
import {
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  Package,
  DollarSign,
  FileCheck,
  ShoppingCart,
  Activity,
  AlertCircle,
  Eye,
  RefreshCw,
  Download,
  Settings,
  UserPlus,
  Plus,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Zap
} from 'lucide-react'
import { dashboardService } from '@/admin/services/dashboard-service'
import { mockDataService } from '@/admin/services/mock-data'
import type { KPIMetric, ActivityFeed, TopLists } from '@/admin/services/dashboard-service'

// Chart color schemes
const CHART_COLORS = {
  primary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  secondary: '#6b7280'
}

// Format values based on type
const formatValue = (value: number | string, format?: string, unit?: string): string => {
  if (typeof value === 'string') return value

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value)
    case 'percentage':
      return `${value}${unit || '%'}`
    case 'duration':
      return `${value}${unit || 'ms'}`
    case 'bytes':
      return `${value}${unit || 'GB'}`
    default:
      return new Intl.NumberFormat('en-US').format(value)
  }
}

// Get trend icon based on change type
const getTrendIcon = (changeType?: 'increase' | 'decrease' | 'neutral', size: number = 16) => {
  switch (changeType) {
    case 'increase':
      return <TrendingUp className={`w-${size/4} h-${size/4} text-green-500`} />
    case 'decrease':
      return <TrendingDown className={`w-${size/4} h-${size/4} text-red-500`} />
    default:
      return null
  }
}

// Get KPI icon based on ID
const getKPIIcon = (id: string) => {
  const iconMap: Record<string, React.ElementType> = {
    total_revenue: DollarSign,
    total_users: Users,
    active_sellers: Store,
    products_listed: Package,
    pending_verifications: FileCheck,
    average_order_value: ShoppingCart,
    conversion_rate: BarChart3,
    customer_retention: RefreshCw,
    system_uptime: Activity,
    response_time: Clock,
    storage_used: Package,
    monthly_growth: TrendingUp
  }
  
  return iconMap[id] || Activity
}

// Activity type icons
const getActivityIcon = (type: string) => {
  const iconMap: Record<string, React.ElementType> = {
    user_action: UserPlus,
    business_event: ShoppingCart,
    system_event: Settings,
    security_event: AlertCircle
  }
  
  return iconMap[type] || Activity
}

const AdminDashboard: React.FC = () => {
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([])
  const [topLists, setTopLists] = useState<TopLists | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setError(null)
      const [kpis, activities, lists] = await Promise.all([
        dashboardService.getKPIMetrics(),
        dashboardService.getActivityFeed(8),
        dashboardService.getTopLists()
      ])

      setKpiMetrics(kpis)
      setActivityFeed(activities)
      setTopLists(lists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
  }

  // Chart data preparations
  const revenueChartData = kpiMetrics
    .find(kpi => kpi.id === 'total_revenue')?.trend?.map(item => ({
      month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
      revenue: item.value
    })) || []

  const userGrowthData = kpiMetrics
    .find(kpi => kpi.id === 'total_users')?.trend?.map(item => ({
      month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
      users: item.value
    })) || []

  const productStatusData = [
    { name: 'Active', value: 8967, color: CHART_COLORS.success },
    { name: 'Pending', value: 234, color: CHART_COLORS.warning },
    { name: 'Rejected', value: 89, color: CHART_COLORS.danger },
    { name: 'Draft', value: 156, color: CHART_COLORS.secondary }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-900">Error loading dashboard</h3>
          <p className="text-red-600">{error}</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your B2B CRM platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpiMetrics.slice(0, 8).map((kpi) => {
          const Icon = getKPIIcon(kpi.id)
          const changeColor = kpi.changeType === 'increase' ? 'text-green-600' : 
                             kpi.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
          
          return (
            <Card key={kpi.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-${kpi.color}-100`}>
                    <Icon className={`w-4 h-4 text-${kpi.color}-600`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatValue(kpi.value, kpi.format, kpi.unit)}
                  </div>
                  {kpi.change !== undefined && (
                    <div className="flex items-center space-x-1 text-sm">
                      {getTrendIcon(kpi.changeType)}
                      <span className={changeColor}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground">from last month</span>
                    </div>
                  )}
                  {kpi.target && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`bg-${kpi.color}-600 h-1.5 rounded-full transition-all`}
                        style={{ width: `${Math.min((Number(kpi.value) / kpi.target) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={CHART_COLORS.primary} 
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Product Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Products']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="lg:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>User Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Users']} />
                  <Bar dataKey="users" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                const severityColor = activity.severity === 'high' ? 'text-red-500' :
                                    activity.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full bg-gray-100 ${severityColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <UserPlus className="w-6 h-6 text-blue-600" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm">Approve</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <Plus className="w-6 h-6 text-purple-600" />
                <span className="text-sm">Add Product</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>

            {/* Pending Tasks */}
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-sm">Pending Tasks</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Business Verifications</p>
                    <p className="text-xs text-muted-foreground">23 pending review</p>
                  </div>
                  <Badge variant="secondary">23</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">Product Approvals</p>
                    <p className="text-xs text-muted-foreground">156 awaiting approval</p>
                  </div>
                  <Badge variant="secondary">156</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">User Reports</p>
                    <p className="text-xs text-muted-foreground">8 unresolved reports</p>
                  </div>
                  <Badge variant="destructive">8</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      {topLists && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Top Selling Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLists.topSellingProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatValue(product.revenue, 'currency')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Sellers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Top Performing Sellers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLists.topPerformingSellers.slice(0, 5).map((seller, index) => (
                  <div key={seller.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{seller.businessName}</p>
                      <p className="text-xs text-muted-foreground">{seller.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatValue(seller.revenue, 'currency')}</p>
                      <p className="text-xs text-muted-foreground">{seller.rating}/5.0</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard