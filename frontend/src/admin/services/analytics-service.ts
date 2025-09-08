export interface TimeSeriesDataPoint {
  date: string
  value: number
  label?: string
}

export interface CategoryDataPoint {
  category: string
  value: number
  percentage?: number
  color?: string
}

export interface ComparisonDataPoint {
  period: string
  current: number
  previous: number
  growth?: number
}

export interface RevenueAnalytics {
  totalRevenue: number
  revenueGrowth: number
  monthlyRevenue: TimeSeriesDataPoint[]
  revenueByCategory: CategoryDataPoint[]
  revenueComparison: ComparisonDataPoint[]
  averageOrderValue: number
  recurringRevenue: number
}

export interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  userGrowth: number
  newUsersDaily: TimeSeriesDataPoint[]
  usersByRole: CategoryDataPoint[]
  userRetention: TimeSeriesDataPoint[]
  verificationRate: number
  averageSessionDuration: number
}

export interface ProductAnalytics {
  totalProducts: number
  activeProducts: number
  productGrowth: number
  productsByCategory: CategoryDataPoint[]
  productApprovalRate: number
  topPerformingProducts: Array<{
    id: string
    name: string
    revenue: number
    orders: number
    rating: number
  }>
  inventoryTurnover: number
  averageProductViews: number
}

export interface SalesAnalytics {
  totalOrders: number
  orderGrowth: number
  dailyOrders: TimeSeriesDataPoint[]
  ordersByStatus: CategoryDataPoint[]
  salesByRegion: CategoryDataPoint[]
  conversionRate: number
  averageOrderProcessingTime: number
  repeatCustomerRate: number
}

export interface TrafficAnalytics {
  totalViews: number
  uniqueVisitors: number
  bounceRate: number
  pageViews: TimeSeriesDataPoint[]
  trafficSources: CategoryDataPoint[]
  topPages: Array<{
    page: string
    views: number
    uniqueViews: number
    averageTime: number
  }>
  deviceBreakdown: CategoryDataPoint[]
  geographicDistribution: CategoryDataPoint[]
}

export interface PerformanceMetrics {
  systemUptime: number
  averageResponseTime: number
  errorRate: number
  serverLoad: TimeSeriesDataPoint[]
  apiCallsPerDay: TimeSeriesDataPoint[]
  databasePerformance: {
    queryTime: number
    connections: number
    storage: number
  }
}

export interface DateRange {
  startDate: string
  endDate: string
}

export interface AnalyticsFilters {
  dateRange?: DateRange
  category?: string
  region?: string
  userRole?: string
  productStatus?: string
}

// Generate mock time series data
function generateTimeSeriesData(
  days: number, 
  baseValue: number, 
  variance: number = 0.2,
  trend: number = 0
): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = []
  const endDate = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    
    // Add trend and random variance
    const trendValue = baseValue + (trend * (days - i))
    const randomVariance = (Math.random() - 0.5) * variance * baseValue
    const value = Math.max(0, Math.round(trendValue + randomVariance))
    
    data.push({
      date: date.toISOString().split('T')[0],
      value
    })
  }
  
  return data
}

// Generate mock category data
function generateCategoryData(categories: string[], total: number): CategoryDataPoint[] {
  const data: CategoryDataPoint[] = []
  let remaining = total
  
  categories.forEach((category, index) => {
    const isLast = index === categories.length - 1
    const value = isLast 
      ? remaining 
      : Math.floor(Math.random() * (remaining / (categories.length - index)))
    
    remaining -= value
    
    data.push({
      category,
      value,
      percentage: (value / total) * 100,
      color: `hsl(${(index * 360) / categories.length}, 70%, 50%)`
    })
  })
  
  return data.sort((a, b) => b.value - a.value)
}

class AnalyticsService {
  // Simulate API delay
  private delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get revenue analytics
  async getRevenueAnalytics(filters: AnalyticsFilters = {}): Promise<RevenueAnalytics> {
    await this.delay()

    const totalRevenue = 2847650
    const revenueGrowth = 12.5

    const monthlyRevenue = [
      { date: '2023-01', value: 185000 },
      { date: '2023-02', value: 192000 },
      { date: '2023-03', value: 208000 },
      { date: '2023-04', value: 195000 },
      { date: '2023-05', value: 218000 },
      { date: '2023-06', value: 235000 },
      { date: '2023-07', value: 242000 },
      { date: '2023-08', value: 258000 },
      { date: '2023-09', value: 245000 },
      { date: '2023-10', value: 268000 },
      { date: '2023-11', value: 285000 },
      { date: '2023-12', value: 316650 }
    ]

    const revenueByCategory = generateCategoryData([
      'Industrial & Manufacturing',
      'Electronics',
      'Software',
      'Fashion & Apparel',
      'Food & Beverage',
      'Energy & Environment'
    ], totalRevenue)

    const revenueComparison: ComparisonDataPoint[] = [
      { period: 'Q1 2023', current: 585000, previous: 520000, growth: 12.5 },
      { period: 'Q2 2023', current: 648000, previous: 610000, growth: 6.2 },
      { period: 'Q3 2023', current: 745000, previous: 695000, growth: 7.2 },
      { period: 'Q4 2023', current: 869650, previous: 745000, growth: 16.7 }
    ]

    return {
      totalRevenue,
      revenueGrowth,
      monthlyRevenue,
      revenueByCategory,
      revenueComparison,
      averageOrderValue: 1547.30,
      recurringRevenue: 421850
    }
  }

  // Get user analytics
  async getUserAnalytics(filters: AnalyticsFilters = {}): Promise<UserAnalytics> {
    await this.delay()

    const totalUsers = 15742
    const activeUsers = 12896
    const userGrowth = 8.3

    const newUsersDaily = generateTimeSeriesData(30, 45, 0.3, 1.2)

    const usersByRole = generateCategoryData([
      'Sellers',
      'Support Staff',
      'Administrators'
    ], totalUsers)

    const userRetention = [
      { date: '2023-01', value: 85.2 },
      { date: '2023-02', value: 87.1 },
      { date: '2023-03', value: 86.8 },
      { date: '2023-04', value: 88.5 },
      { date: '2023-05', value: 89.2 },
      { date: '2023-06', value: 88.7 },
      { date: '2023-07', value: 90.1 },
      { date: '2023-08', value: 89.8 },
      { date: '2023-09', value: 91.3 },
      { date: '2023-10', value: 90.7 },
      { date: '2023-11', value: 92.1 },
      { date: '2023-12', value: 91.8 }
    ]

    return {
      totalUsers,
      activeUsers,
      userGrowth,
      newUsersDaily,
      usersByRole,
      userRetention,
      verificationRate: 78.5,
      averageSessionDuration: 24.7 // minutes
    }
  }

  // Get product analytics
  async getProductAnalytics(filters: AnalyticsFilters = {}): Promise<ProductAnalytics> {
    await this.delay()

    const totalProducts = 8967
    const activeProducts = 7234
    const productGrowth = 15.2

    const productsByCategory = generateCategoryData([
      'Industrial & Manufacturing',
      'Electronics',
      'Software',
      'Fashion & Apparel',
      'Food & Beverage',
      'Energy & Environment'
    ], totalProducts)

    const topPerformingProducts = [
      {
        id: 'prod-1',
        name: 'Professional Wireless Headphones',
        revenue: 127580,
        orders: 426,
        rating: 4.8
      },
      {
        id: 'prod-8',
        name: 'Professional Kitchen Equipment Set',
        revenue: 124975,
        orders: 50,
        rating: 4.9
      },
      {
        id: 'prod-5',
        name: 'Industrial Grade Bearings',
        revenue: 89650,
        orders: 199,
        rating: 4.6
      },
      {
        id: 'prod-4',
        name: 'Organic Cotton T-Shirts (Bulk)',
        revenue: 67500,
        orders: 540,
        rating: 4.7
      },
      {
        id: 'prod-2',
        name: 'Smart Home Security Camera',
        revenue: 45475,
        orders: 239,
        rating: 4.5
      }
    ]

    return {
      totalProducts,
      activeProducts,
      productGrowth,
      productsByCategory,
      productApprovalRate: 87.3,
      topPerformingProducts,
      inventoryTurnover: 4.2,
      averageProductViews: 156
    }
  }

  // Get sales analytics
  async getSalesAnalytics(filters: AnalyticsFilters = {}): Promise<SalesAnalytics> {
    await this.delay()

    const totalOrders = 18567
    const orderGrowth = 22.1

    const dailyOrders = generateTimeSeriesData(30, 62, 0.25, 0.8)

    const ordersByStatus = [
      { category: 'Completed', value: 14854, percentage: 80.0, color: '#22c55e' },
      { category: 'Processing', value: 1857, percentage: 10.0, color: '#f59e0b' },
      { category: 'Shipped', value: 1113, percentage: 6.0, color: '#3b82f6' },
      { category: 'Cancelled', value: 557, percentage: 3.0, color: '#ef4444' },
      { category: 'Refunded', value: 186, percentage: 1.0, color: '#8b5cf6' }
    ]

    const salesByRegion = generateCategoryData([
      'North America',
      'Europe',
      'Asia Pacific',
      'Latin America',
      'Middle East & Africa'
    ], totalOrders)

    return {
      totalOrders,
      orderGrowth,
      dailyOrders,
      ordersByStatus,
      salesByRegion,
      conversionRate: 3.8,
      averageOrderProcessingTime: 2.4, // hours
      repeatCustomerRate: 34.7
    }
  }

  // Get traffic analytics
  async getTrafficAnalytics(filters: AnalyticsFilters = {}): Promise<TrafficAnalytics> {
    await this.delay()

    const totalViews = 456789
    const uniqueVisitors = 34567
    const bounceRate = 42.3

    const pageViews = generateTimeSeriesData(30, 15226, 0.2, 250)

    const trafficSources = [
      { category: 'Direct', value: 156789, percentage: 34.3, color: '#22c55e' },
      { category: 'Search Engines', value: 137025, percentage: 30.0, color: '#3b82f6' },
      { category: 'Social Media', value: 91358, percentage: 20.0, color: '#f59e0b' },
      { category: 'Referrals', value: 45679, percentage: 10.0, color: '#8b5cf6' },
      { category: 'Email', value: 22715, percentage: 5.0, color: '#ef4444' },
      { category: 'Other', value: 3223, percentage: 0.7, color: '#6b7280' }
    ]

    const topPages = [
      { page: '/dashboard', views: 45678, uniqueViews: 23456, averageTime: 4.2 },
      { page: '/products', views: 38567, uniqueViews: 28934, averageTime: 5.8 },
      { page: '/users', views: 27891, uniqueViews: 18234, averageTime: 3.5 },
      { page: '/analytics', views: 19456, uniqueViews: 12678, averageTime: 6.7 },
      { page: '/verification', views: 15234, uniqueViews: 9876, averageTime: 4.9 }
    ]

    const deviceBreakdown = [
      { category: 'Desktop', value: 273473, percentage: 59.9, color: '#22c55e' },
      { category: 'Mobile', value: 137025, percentage: 30.0, color: '#3b82f6' },
      { category: 'Tablet', value: 46291, percentage: 10.1, color: '#f59e0b' }
    ]

    const geographicDistribution = generateCategoryData([
      'United States',
      'United Kingdom',
      'Germany',
      'Canada',
      'France',
      'Australia',
      'Japan',
      'Brazil',
      'India',
      'Other'
    ], uniqueVisitors)

    return {
      totalViews,
      uniqueVisitors,
      bounceRate,
      pageViews,
      trafficSources,
      topPages,
      deviceBreakdown,
      geographicDistribution
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(filters: AnalyticsFilters = {}): Promise<PerformanceMetrics> {
    await this.delay()

    const systemUptime = 99.87
    const averageResponseTime = 245 // ms
    const errorRate = 0.13

    const serverLoad = generateTimeSeriesData(24, 65, 0.15, 0) // Last 24 hours
    const apiCallsPerDay = generateTimeSeriesData(30, 125000, 0.1, 1500)

    const databasePerformance = {
      queryTime: 12.5, // ms
      connections: 47,
      storage: 847.3 // GB
    }

    return {
      systemUptime,
      averageResponseTime,
      errorRate,
      serverLoad,
      apiCallsPerDay,
      databasePerformance
    }
  }

  // Get conversion funnel data
  async getConversionFunnel(): Promise<Array<{ stage: string; users: number; conversionRate?: number }>> {
    await this.delay()

    return [
      { stage: 'Visitors', users: 34567 },
      { stage: 'Signed Up', users: 5234, conversionRate: 15.1 },
      { stage: 'Profile Completed', users: 4187, conversionRate: 80.0 },
      { stage: 'First Product Listed', users: 3245, conversionRate: 77.5 },
      { stage: 'First Sale', users: 2156, conversionRate: 66.4 },
      { stage: 'Repeat Customer', users: 1847, conversionRate: 85.7 }
    ]
  }

  // Get cohort analysis
  async getCohortAnalysis(): Promise<{
    periods: string[]
    cohorts: Array<{
      cohort: string
      size: number
      retention: number[]
    }>
  }> {
    await this.delay()

    const periods = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6']
    
    const cohorts = [
      {
        cohort: '2023-06',
        size: 456,
        retention: [100, 78.5, 65.2, 58.1, 52.7, 49.8, 47.2]
      },
      {
        cohort: '2023-07',
        size: 523,
        retention: [100, 81.2, 68.7, 61.4, 56.3, 52.8, 50.1]
      },
      {
        cohort: '2023-08',
        size: 612,
        retention: [100, 79.8, 66.9, 60.2, 55.1, 51.6]
      },
      {
        cohort: '2023-09',
        size: 578,
        retention: [100, 82.5, 69.4, 62.8, 57.9]
      },
      {
        cohort: '2023-10',
        size: 634,
        retention: [100, 80.1, 67.3, 61.1]
      },
      {
        cohort: '2023-11',
        size: 689,
        retention: [100, 83.2, 70.8]
      },
      {
        cohort: '2023-12',
        size: 742,
        retention: [100, 85.1]
      }
    ]

    return { periods, cohorts }
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<{
    activeUsers: number
    currentOrders: number
    serverLoad: number
    responseTime: number
    recentActivity: Array<{
      id: string
      type: 'order' | 'signup' | 'verification' | 'product_listed'
      description: string
      timestamp: string
      user?: string
    }>
  }> {
    await this.delay(200) // Faster for real-time data

    const recentActivity = [
      {
        id: 'activity-1',
        type: 'order' as const,
        description: 'New order #ORD-2024-001234',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        user: 'John Smith'
      },
      {
        id: 'activity-2',
        type: 'signup' as const,
        description: 'New user registration',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user: 'Sarah Johnson'
      },
      {
        id: 'activity-3',
        type: 'verification' as const,
        description: 'Business verification approved',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        user: 'Mike Wilson'
      },
      {
        id: 'activity-4',
        type: 'product_listed' as const,
        description: 'New product listed: Smart LED Bulbs',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        user: 'Emma Clark'
      },
      {
        id: 'activity-5',
        type: 'order' as const,
        description: 'Order #ORD-2024-001235 completed',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user: 'Robert Brown'
      }
    ]

    return {
      activeUsers: 1247,
      currentOrders: 23,
      serverLoad: 67.8,
      responseTime: 234,
      recentActivity
    }
  }

  // Export analytics data
  async exportAnalyticsData(
    type: 'revenue' | 'users' | 'products' | 'sales' | 'traffic',
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters: AnalyticsFilters = {}
  ): Promise<string> {
    await this.delay(2000) // Simulate export processing

    const exportId = `analytics-${type}-${Date.now()}`
    const extension = format === 'excel' ? 'xlsx' : format
    
    return `https://api.example.com/exports/analytics/${exportId}.${extension}`
  }

  // Get custom dashboard data
  async getCustomDashboardData(widgets: string[]): Promise<Record<string, any>> {
    await this.delay(1200)

    const data: Record<string, any> = {}

    for (const widget of widgets) {
      switch (widget) {
        case 'revenue_chart':
          data[widget] = (await this.getRevenueAnalytics()).monthlyRevenue
          break
        case 'user_growth':
          data[widget] = (await this.getUserAnalytics()).newUsersDaily
          break
        case 'top_products':
          data[widget] = (await this.getProductAnalytics()).topPerformingProducts
          break
        case 'order_status':
          data[widget] = (await this.getSalesAnalytics()).ordersByStatus
          break
        case 'traffic_sources':
          data[widget] = (await this.getTrafficAnalytics()).trafficSources
          break
        default:
          data[widget] = null
      }
    }

    return data
  }

  // Get comparative analytics (current vs previous period)
  async getComparativeAnalytics(
    metric: 'revenue' | 'users' | 'orders' | 'products',
    period: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<{
    current: number
    previous: number
    growth: number
    trend: 'up' | 'down' | 'stable'
  }> {
    await this.delay()

    const mockData = {
      revenue: { current: 316650, previous: 285000, growth: 11.1 },
      users: { current: 742, previous: 689, growth: 7.7 },
      orders: { current: 1876, previous: 1654, growth: 13.4 },
      products: { current: 234, previous: 198, growth: 18.2 }
    }

    const data = mockData[metric]
    const trend = data.growth > 5 ? 'up' : data.growth < -5 ? 'down' : 'stable'

    return {
      ...data,
      trend
    }
  }
}

export const analyticsService = new AnalyticsService()