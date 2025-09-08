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
  Zap,
  Target,
  Bell,
  ExternalLink
} from 'lucide-react'
import { dashboardService } from '@/admin/services/dashboard-service'
import { mockDataService } from '@/admin/services/mock-data'
import type { KPIMetric, ActivityFeed, TopLists } from '@/admin/services/dashboard-service'
import type { SaudiUser, SaudiProduct, AdminLead } from '@/admin/types/saudi-admin'

// Chart color schemes
const CHART_COLORS = {
  primary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  secondary: '#6b7280',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  orange: '#f97316'
}

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalProducts: number
  pendingVerifications: number
  totalRevenue: number
  monthlyGrowth: number
  usersByRegion: Array<{ region: string, count: number }>
  productsByCategory: Array<{ category: string, count: number }>
  recentRegistrations: Array<{ date: string, count: number }>
}

const EnhancedAdminDashboard: React.FC = () => {
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([])
  const [topLists, setTopLists] = useState<TopLists | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setError(null)
      const [kpis, activities, lists, analytics] = await Promise.all([
        dashboardService.getKPIMetrics(),
        dashboardService.getActivityFeed(10),
        dashboardService.getTopLists(),
        mockDataService.getAnalyticsOverview()
      ])

      setKpiMetrics(kpis)
      setActivityFeed(activities)
      setTopLists(lists)
      setDashboardStats(analytics)
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

  // Prepare chart data
  const revenueUserChartData = kpiMetrics
    .find(kpi => kpi.id === 'total_revenue')?.trend?.map((item, index) => {
      const userTrend = kpiMetrics.find(kpi => kpi.id === 'total_users')?.trend?.[index]
      return {
        month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
        revenue: item.value,
        users: userTrend?.value || 0
      }
    }) || []

  const regionDistributionData = dashboardStats?.usersByRegion.map(item => ({
    name: item.region.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count,
    color: CHART_COLORS.primary
  })) || []

  const categoryPerformanceData = dashboardStats?.productsByCategory
    .filter(item => item.count > 0)
    .slice(0, 8)
    .map((item, index) => ({
      name: item.category,
      products: item.count,
      color: Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]
    })) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
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
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your B2B CRM platform • Last updated {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Time Range Filter */}
          <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
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
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
          <Badge variant="outline" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            {timeRange} view
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Primary KPIs */}
          <RevenueKPICard
            title="Total Revenue"
            value={dashboardStats?.totalRevenue || 0}
            change={dashboardStats?.monthlyGrowth || 0}
            changeType="increase"
            icon={DollarSign}
            className="border-l-4 border-l-green-500"
          />
          
          <UserKPICard
            title="Total Users"
            value={dashboardStats?.totalUsers || 0}
            change={12.5}
            changeType="increase"
            icon={Users}
            className="border-l-4 border-l-blue-500"
          />
          
          <UserKPICard
            title="Active Sellers"
            value={dashboardStats?.activeUsers || 0}
            change={8.2}
            changeType="increase"
            icon={Store}
            className="border-l-4 border-l-purple-500"
          />
          
          <UserKPICard
            title="Products Listed"
            value={dashboardStats?.totalProducts || 0}
            change={15.3}
            changeType="increase"
            icon={Package}
            className="border-l-4 border-l-orange-500"
          />

          {/* Secondary KPIs */}
          <UserKPICard
            title="Pending Verifications"
            value={dashboardStats?.pendingVerifications || 0}
            change={-5.2}
            changeType="decrease"
            icon={FileCheck}
            className="border-l-4 border-l-yellow-500"
          />
          
          <PercentageKPICard
            title="Conversion Rate"
            value={3.82}
            change={4.1}
            changeType="increase"
            icon={BarChart3}
            className="border-l-4 border-l-teal-500"
          />
          
          <RevenueKPICard
            title="Avg Order Value"
            value={1547.30}
            change={8.7}
            changeType="increase"
            icon={ShoppingCart}
            className="border-l-4 border-l-indigo-500"
          />
          
          <PercentageKPICard
            title="System Uptime"
            value={99.87}
            change={0.2}
            changeType="increase"
            icon={Zap}
            className="border-l-4 border-l-green-400"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue & Users Combined Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Revenue & User Growth</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.3%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueUserChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value: number, name) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                      name === 'revenue' ? 'Revenue' : 'Users'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="users" 
                    stroke={CHART_COLORS.primary} 
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Users by Region</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionDistributionData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {regionDistributionData.slice(0, 6).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={Object.values(CHART_COLORS)[index % Object.keys(CHART_COLORS).length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Users']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Products by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip formatter={(value: number) => [value, 'Products']} />
                  <Bar dataKey="products" radius={[0, 4, 4, 0]}>
                    {categoryPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Registration Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardStats?.recentRegistrations || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [value, 'Registrations']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke={CHART_COLORS.purple} 
                    fill={`${CHART_COLORS.purple}20`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Bell className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activityFeed.map((activity) => {
                const severityColors = {
                  high: 'text-red-500 bg-red-50',
                  medium: 'text-yellow-500 bg-yellow-50',
                  low: 'text-green-500 bg-green-50'
                }
                const colorClass = severityColors[activity.severity || 'low']
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        </div>
                        {activity.severity === 'high' && (
                          <Badge variant="destructive" className="ml-2">Urgent</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        {activity.user && (
                          <p className="text-xs text-muted-foreground">
                            by {activity.user.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions & Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
              >
                <UserPlus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Add User</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-green-50 hover:border-green-200 transition-colors group"
              >
                <CheckCircle className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Approve</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-purple-50 hover:border-purple-200 transition-colors group"
              >
                <Plus className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Add Product</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-orange-50 hover:border-orange-200 transition-colors group"
              >
                <BarChart3 className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Analytics</span>
              </Button>
            </div>

            {/* Pending Tasks with Enhanced UI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Pending Tasks</h4>
                <Button variant="ghost" size="sm" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Manage
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-sm">Business Verifications</p>
                      <p className="text-xs text-amber-600">High priority pending</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    {dashboardStats?.pendingVerifications || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Product Approvals</p>
                      <p className="text-xs text-blue-600">Review required</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">156</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-medium text-sm">User Reports</p>
                      <p className="text-xs text-red-600">Urgent attention needed</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-700">8</Badge>
                </div>
              </div>
            </div>

            {/* System Health Indicator */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">System Health</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Healthy
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">99.87%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">245ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists with Enhanced Design */}
      {topLists && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Top Selling Products</span>
              </CardTitle>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLists.topSellingProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <Badge variant="outline" className="text-xs">Popular</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-green-600">
                        ${product.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Sellers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Top Performing Sellers</span>
              </CardTitle>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLists.topPerformingSellers.slice(0, 5).map((seller, index) => (
                  <div key={seller.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/30">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{seller.businessName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">{seller.orders} orders</p>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">★</span>
                          <span className="text-xs text-muted-foreground">{seller.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-green-600">
                        ${seller.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">revenue</p>
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

export default EnhancedAdminDashboard