export interface KPIMetric {
  id: string
  title: string
  value: number | string
  previousValue?: number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'bytes'
  icon?: string
  color?: 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'gray'
  trend?: Array<{ date: string; value: number }>
  target?: number
  unit?: string
}

export interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'table' | 'list' | 'progress' | 'activity'
  title: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number; w: number; h: number }
  data: any
  refreshInterval?: number // minutes
  lastUpdated?: string
}

export interface DashboardLayout {
  id: string
  name: string
  isDefault?: boolean
  widgets: DashboardWidget[]
  createdAt: string
  updatedAt: string
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  services: Array<{
    name: string
    status: 'online' | 'offline' | 'degraded'
    responseTime?: number
    lastCheck: string
  }>
  resources: {
    cpu: number
    memory: number
    storage: number
    network: number
  }
  alerts: Array<{
    id: string
    level: 'info' | 'warning' | 'error' | 'critical'
    message: string
    timestamp: string
    resolved?: boolean
  }>
}

export interface ActivityFeed {
  id: string
  type: 'user_action' | 'system_event' | 'business_event' | 'security_event'
  title: string
  description: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
  timestamp: string
  severity?: 'low' | 'medium' | 'high'
}

export interface QuickStats {
  todayStats: {
    newUsers: number
    newOrders: number
    revenue: number
    productsListed: number
  }
  weekStats: {
    activeUsers: number
    totalOrders: number
    averageOrderValue: number
    conversionRate: number
  }
  monthStats: {
    userGrowth: number
    revenueGrowth: number
    productGrowth: number
    customerRetention: number
  }
}

export interface TopLists {
  topSellingProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    image?: string
  }>
  topPerformingSellers: Array<{
    id: string
    name: string
    businessName: string
    revenue: number
    orders: number
    rating: number
    avatar?: string
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    amount: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: string
  }>
  pendingVerifications: Array<{
    id: string
    businessName: string
    submittedAt: string
    priority: 'low' | 'normal' | 'high'
    documentsCount: number
  }>
}

class DashboardService {
  // Simulate API delay
  private delay(ms: number = 600): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get main KPI metrics
  async getKPIMetrics(): Promise<KPIMetric[]> {
    await this.delay()

    return [
      {
        id: 'total_revenue',
        title: 'Total Revenue',
        value: 2847650,
        previousValue: 2534820,
        change: 12.34,
        changeType: 'increase',
        format: 'currency',
        icon: '💰',
        color: 'green',
        trend: [
          { date: '2023-07', value: 2100000 },
          { date: '2023-08', value: 2200000 },
          { date: '2023-09', value: 2350000 },
          { date: '2023-10', value: 2500000 },
          { date: '2023-11', value: 2650000 },
          { date: '2023-12', value: 2847650 }
        ],
        target: 3000000
      },
      {
        id: 'total_users',
        title: 'Total Users',
        value: 15742,
        previousValue: 14538,
        change: 8.28,
        changeType: 'increase',
        format: 'number',
        icon: '👥',
        color: 'blue',
        trend: [
          { date: '2023-07', value: 12500 },
          { date: '2023-08', value: 13200 },
          { date: '2023-09', value: 13800 },
          { date: '2023-10', value: 14200 },
          { date: '2023-11', value: 14538 },
          { date: '2023-12', value: 15742 }
        ]
      },
      {
        id: 'active_sellers',
        title: 'Active Sellers',
        value: 3247,
        previousValue: 2986,
        change: 8.74,
        changeType: 'increase',
        format: 'number',
        icon: '🏪',
        color: 'green'
      },
      {
        id: 'products_listed',
        title: 'Products Listed',
        value: 8967,
        previousValue: 7834,
        change: 14.46,
        changeType: 'increase',
        format: 'number',
        icon: '📦',
        color: 'blue'
      },
      {
        id: 'pending_verifications',
        title: 'Pending Verifications',
        value: 47,
        previousValue: 52,
        change: -9.62,
        changeType: 'decrease',
        format: 'number',
        icon: '📋',
        color: 'yellow'
      },
      {
        id: 'average_order_value',
        title: 'Avg Order Value',
        value: 1547.30,
        previousValue: 1423.75,
        change: 8.68,
        changeType: 'increase',
        format: 'currency',
        icon: '🛒',
        color: 'green'
      },
      {
        id: 'conversion_rate',
        title: 'Conversion Rate',
        value: 3.82,
        previousValue: 3.64,
        change: 4.95,
        changeType: 'increase',
        format: 'percentage',
        icon: '📈',
        color: 'green',
        unit: '%'
      },
      {
        id: 'customer_retention',
        title: 'Customer Retention',
        value: 91.8,
        previousValue: 89.2,
        change: 2.91,
        changeType: 'increase',
        format: 'percentage',
        icon: '🔄',
        color: 'blue',
        unit: '%'
      },
      {
        id: 'system_uptime',
        title: 'System Uptime',
        value: 99.87,
        previousValue: 99.65,
        change: 0.22,
        changeType: 'increase',
        format: 'percentage',
        icon: '⚡',
        color: 'green',
        unit: '%'
      },
      {
        id: 'response_time',
        title: 'Avg Response Time',
        value: 245,
        previousValue: 287,
        change: -14.63,
        changeType: 'decrease',
        format: 'duration',
        icon: '⏱️',
        color: 'green',
        unit: 'ms'
      },
      {
        id: 'storage_used',
        title: 'Storage Used',
        value: 847.3,
        previousValue: 792.1,
        change: 6.97,
        changeType: 'increase',
        format: 'bytes',
        icon: '💾',
        color: 'blue',
        unit: 'GB'
      },
      {
        id: 'monthly_growth',
        title: 'Monthly Growth',
        value: 12.5,
        previousValue: 9.8,
        change: 27.55,
        changeType: 'increase',
        format: 'percentage',
        icon: '📊',
        color: 'green',
        unit: '%'
      }
    ]
  }

  // Get system health status
  async getSystemHealth(): Promise<SystemHealth> {
    await this.delay()

    return {
      status: 'healthy',
      uptime: 99.87,
      services: [
        {
          name: 'API Gateway',
          status: 'online',
          responseTime: 45,
          lastCheck: new Date(Date.now() - 30000).toISOString()
        },
        {
          name: 'Database',
          status: 'online',
          responseTime: 12,
          lastCheck: new Date(Date.now() - 30000).toISOString()
        },
        {
          name: 'Redis Cache',
          status: 'online',
          responseTime: 3,
          lastCheck: new Date(Date.now() - 30000).toISOString()
        },
        {
          name: 'File Storage',
          status: 'online',
          responseTime: 89,
          lastCheck: new Date(Date.now() - 30000).toISOString()
        },
        {
          name: 'Email Service',
          status: 'degraded',
          responseTime: 1250,
          lastCheck: new Date(Date.now() - 30000).toISOString()
        },
        {
          name: 'Payment Gateway',
          status: 'online',
          responseTime: 234,
          lastCheck: new Date(Date.now() - 30000).toISOString()
        }
      ],
      resources: {
        cpu: 67.8,
        memory: 72.3,
        storage: 45.2,
        network: 23.1
      },
      alerts: [
        {
          id: 'alert-1',
          level: 'warning',
          message: 'Email service response time above threshold',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: 'alert-2',
          level: 'info',
          message: 'Database backup completed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolved: true
        }
      ]
    }
  }

  // Get recent activity feed
  async getActivityFeed(limit: number = 20): Promise<ActivityFeed[]> {
    await this.delay()

    return [
      {
        id: 'activity-1',
        type: 'user_action',
        title: 'New User Registration',
        description: 'Sarah Johnson registered as a seller',
        user: {
          id: 'user-11',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32'
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        severity: 'low'
      },
      {
        id: 'activity-2',
        type: 'business_event',
        title: 'Large Order Placed',
        description: 'Order #ORD-2024-001234 for $15,750 placed by TechCorp Ltd',
        metadata: {
          orderId: 'ORD-2024-001234',
          amount: 15750,
          customer: 'TechCorp Ltd'
        },
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        severity: 'medium'
      },
      {
        id: 'activity-3',
        type: 'user_action',
        title: 'Business Verification Approved',
        description: 'FoodTech Innovations verification completed',
        user: {
          id: 'admin-1',
          name: 'Admin User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
        },
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        severity: 'low'
      },
      {
        id: 'activity-4',
        type: 'system_event',
        title: 'System Maintenance',
        description: 'Scheduled maintenance completed successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'low'
      },
      {
        id: 'activity-5',
        type: 'business_event',
        title: 'New Product Listed',
        description: 'Smart LED Bulbs listed by Emma Clark',
        user: {
          id: 'user-7',
          name: 'Emma Clark',
          avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32'
        },
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        severity: 'low'
      },
      {
        id: 'activity-6',
        type: 'security_event',
        title: 'Failed Login Attempts',
        description: '5 failed login attempts detected for user account',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        severity: 'high'
      },
      {
        id: 'activity-7',
        type: 'business_event',
        title: 'Payment Processed',
        description: 'Payment of $2,499.99 processed for order #ORD-2024-001235',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        severity: 'low'
      },
      {
        id: 'activity-8',
        type: 'user_action',
        title: 'Product Status Updated',
        description: 'Industrial Grade Bearings marked as out of stock',
        user: {
          id: 'user-10',
          name: 'James Taylor',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
        },
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        severity: 'medium'
      }
    ]
  }

  // Get quick stats for today/week/month
  async getQuickStats(): Promise<QuickStats> {
    await this.delay()

    return {
      todayStats: {
        newUsers: 23,
        newOrders: 47,
        revenue: 28450,
        productsListed: 12
      },
      weekStats: {
        activeUsers: 1247,
        totalOrders: 342,
        averageOrderValue: 1547.30,
        conversionRate: 3.82
      },
      monthStats: {
        userGrowth: 8.28,
        revenueGrowth: 12.34,
        productGrowth: 14.46,
        customerRetention: 91.8
      }
    }
  }

  // Get top lists (products, sellers, orders, etc.)
  async getTopLists(): Promise<TopLists> {
    await this.delay()

    return {
      topSellingProducts: [
        {
          id: 'prod-1',
          name: 'Professional Wireless Headphones',
          sales: 426,
          revenue: 127580,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64'
        },
        {
          id: 'prod-8',
          name: 'Professional Kitchen Equipment Set',
          sales: 50,
          revenue: 124975,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=64'
        },
        {
          id: 'prod-5',
          name: 'Industrial Grade Bearings',
          sales: 199,
          revenue: 89650,
          image: 'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=64'
        },
        {
          id: 'prod-4',
          name: 'Organic Cotton T-Shirts (Bulk)',
          sales: 540,
          revenue: 67500,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=64'
        },
        {
          id: 'prod-2',
          name: 'Smart Home Security Camera',
          sales: 239,
          revenue: 45475,
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=64'
        }
      ],
      topPerformingSellers: [
        {
          id: 'user-2',
          name: 'John Smith',
          businessName: 'Smith Electronics Ltd',
          revenue: 185475,
          orders: 156,
          rating: 4.8,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32'
        },
        {
          id: 'user-9',
          name: 'Anna Martinez',
          businessName: 'FoodTech Innovations',
          revenue: 145230,
          orders: 89,
          rating: 4.9,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32'
        },
        {
          id: 'user-7',
          name: 'Emma Clark',
          businessName: 'Clark Fashion House',
          revenue: 98750,
          orders: 342,
          rating: 4.7,
          avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32'
        },
        {
          id: 'user-10',
          name: 'James Taylor',
          businessName: 'Taylor Automotive Parts',
          revenue: 87450,
          orders: 123,
          rating: 4.6,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32'
        },
        {
          id: 'user-5',
          name: 'Lisa Wilson',
          businessName: 'GreenTech Solutions',
          revenue: 76890,
          orders: 67,
          rating: 4.5,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32'
        }
      ],
      recentOrders: [
        {
          id: 'order-1',
          orderNumber: 'ORD-2024-001234',
          customer: 'TechCorp Ltd',
          amount: 15750,
          status: 'processing',
          createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
        },
        {
          id: 'order-2',
          orderNumber: 'ORD-2024-001235',
          customer: 'Global Manufacturing Inc',
          amount: 2499.99,
          status: 'shipped',
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        },
        {
          id: 'order-3',
          orderNumber: 'ORD-2024-001236',
          customer: 'Fashion Retailers Co',
          amount: 675.50,
          status: 'delivered',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: 'order-4',
          orderNumber: 'ORD-2024-001237',
          customer: 'Security Solutions Ltd',
          amount: 1899.99,
          status: 'pending',
          createdAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'order-5',
          orderNumber: 'ORD-2024-001238',
          customer: 'Restaurant Supply Chain',
          amount: 5250.00,
          status: 'processing',
          createdAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString()
        }
      ],
      pendingVerifications: [
        {
          id: 'app-1',
          businessName: 'TechSolutions Inc',
          submittedAt: '2024-01-10T14:40:00Z',
          priority: 'normal',
          documentsCount: 3
        },
        {
          id: 'app-4',
          businessName: 'Advanced Robotics Corp',
          submittedAt: '2024-01-12T09:15:00Z',
          priority: 'high',
          documentsCount: 5
        },
        {
          id: 'app-5',
          businessName: 'Green Energy Systems',
          submittedAt: '2024-01-13T16:30:00Z',
          priority: 'normal',
          documentsCount: 4
        },
        {
          id: 'app-6',
          businessName: 'Healthcare Innovations Ltd',
          submittedAt: '2024-01-14T11:45:00Z',
          priority: 'low',
          documentsCount: 2
        }
      ]
    }
  }

  // Get default dashboard layout
  async getDefaultDashboardLayout(): Promise<DashboardLayout> {
    await this.delay()

    return {
      id: 'default-layout',
      name: 'Default Admin Dashboard',
      isDefault: true,
      widgets: [
        {
          id: 'kpi-overview',
          type: 'kpi',
          title: 'Key Performance Indicators',
          size: 'full',
          position: { x: 0, y: 0, w: 12, h: 2 },
          data: await this.getKPIMetrics()
        },
        {
          id: 'revenue-chart',
          type: 'chart',
          title: 'Revenue Trend',
          size: 'large',
          position: { x: 0, y: 2, w: 8, h: 4 },
          data: {
            type: 'line',
            data: [
              { month: 'Jan', revenue: 185000 },
              { month: 'Feb', revenue: 192000 },
              { month: 'Mar', revenue: 208000 },
              { month: 'Apr', revenue: 195000 },
              { month: 'May', revenue: 218000 },
              { month: 'Jun', revenue: 235000 },
              { month: 'Jul', revenue: 242000 },
              { month: 'Aug', revenue: 258000 },
              { month: 'Sep', revenue: 245000 },
              { month: 'Oct', revenue: 268000 },
              { month: 'Nov', revenue: 285000 },
              { month: 'Dec', revenue: 316650 }
            ]
          },
          refreshInterval: 30
        },
        {
          id: 'system-health',
          type: 'progress',
          title: 'System Health',
          size: 'medium',
          position: { x: 8, y: 2, w: 4, h: 4 },
          data: await this.getSystemHealth()
        },
        {
          id: 'recent-activity',
          type: 'activity',
          title: 'Recent Activity',
          size: 'medium',
          position: { x: 0, y: 6, w: 6, h: 6 },
          data: await this.getActivityFeed(10),
          refreshInterval: 5
        },
        {
          id: 'top-products',
          type: 'table',
          title: 'Top Selling Products',
          size: 'medium',
          position: { x: 6, y: 6, w: 6, h: 6 },
          data: (await this.getTopLists()).topSellingProducts
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  }

  // Get dashboard data summary (for quick overview)
  async getDashboardSummary(): Promise<{
    kpis: KPIMetric[]
    quickStats: QuickStats
    systemStatus: 'healthy' | 'warning' | 'critical'
    alertsCount: number
    activeUsersNow: number
  }> {
    await this.delay()

    const [kpis, quickStats, systemHealth] = await Promise.all([
      this.getKPIMetrics(),
      this.getQuickStats(),
      this.getSystemHealth()
    ])

    // Get only the most important KPIs for summary
    const summaryKPIs = kpis.slice(0, 6)

    return {
      kpis: summaryKPIs,
      quickStats,
      systemStatus: systemHealth.status,
      alertsCount: systemHealth.alerts.filter(alert => !alert.resolved).length,
      activeUsersNow: 1247
    }
  }

  // Export dashboard data
  async exportDashboardData(format: 'pdf' | 'excel' = 'pdf'): Promise<string> {
    await this.delay(3000) // Simulate export processing

    const exportId = `dashboard-${Date.now()}`
    const extension = format === 'excel' ? 'xlsx' : 'pdf'
    
    return `https://api.example.com/exports/dashboard/${exportId}.${extension}`
  }

  // Get notifications for dashboard
  async getDashboardNotifications(): Promise<Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    action?: {
      label: string
      url: string
    }
    timestamp: string
    read: boolean
  }>> {
    await this.delay(300)

    return [
      {
        id: 'notif-1',
        type: 'warning',
        title: 'High Server Load',
        message: 'Server CPU usage is at 78%. Consider scaling resources.',
        action: {
          label: 'View Details',
          url: '/admin/system/monitoring'
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 'notif-2',
        type: 'success',
        title: 'Monthly Target Achieved',
        message: 'Revenue target for this month has been exceeded by 12%.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 'notif-3',
        type: 'info',
        title: 'New Feature Available',
        message: 'Advanced analytics dashboard is now available.',
        action: {
          label: 'Learn More',
          url: '/admin/analytics'
        },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ]
  }

  // Refresh specific widget data
  async refreshWidgetData(widgetId: string): Promise<any> {
    await this.delay(200) // Fast refresh for individual widgets

    switch (widgetId) {
      case 'kpi-overview':
        return this.getKPIMetrics()
      case 'recent-activity':
        return this.getActivityFeed(10)
      case 'system-health':
        return this.getSystemHealth()
      case 'top-products':
        return (await this.getTopLists()).topSellingProducts
      case 'revenue-chart':
        return {
          type: 'line',
          data: [
            { month: 'Jan', revenue: 185000 },
            { month: 'Feb', revenue: 192000 },
            { month: 'Mar', revenue: 208000 },
            { month: 'Apr', revenue: 195000 },
            { month: 'May', revenue: 218000 },
            { month: 'Jun', revenue: 235000 },
            { month: 'Jul', revenue: 242000 },
            { month: 'Aug', revenue: 258000 },
            { month: 'Sep', revenue: 245000 },
            { month: 'Oct', revenue: 268000 },
            { month: 'Nov', revenue: 285000 },
            { month: 'Dec', revenue: 316650 }
          ]
        }
      default:
        throw new Error(`Unknown widget: ${widgetId}`)
    }
  }

  // Save custom dashboard layout
  async saveDashboardLayout(layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>): Promise<DashboardLayout> {
    await this.delay()

    const newLayout: DashboardLayout = {
      ...layout,
      id: `layout-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return newLayout
  }

  // Get performance benchmarks
  async getPerformanceBenchmarks(): Promise<{
    current: Record<string, number>
    targets: Record<string, number>
    industry: Record<string, number>
  }> {
    await this.delay()

    return {
      current: {
        conversionRate: 3.82,
        customerRetention: 91.8,
        averageOrderValue: 1547.30,
        systemUptime: 99.87,
        responseTime: 245,
        userGrowth: 8.28
      },
      targets: {
        conversionRate: 4.5,
        customerRetention: 95.0,
        averageOrderValue: 1800.00,
        systemUptime: 99.95,
        responseTime: 200,
        userGrowth: 10.0
      },
      industry: {
        conversionRate: 3.2,
        customerRetention: 85.5,
        averageOrderValue: 1342.50,
        systemUptime: 99.5,
        responseTime: 350,
        userGrowth: 6.8
      }
    }
  }
}

export const dashboardService = new DashboardService()