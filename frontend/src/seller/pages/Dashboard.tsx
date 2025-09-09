import React, { useState, useEffect } from 'react';
import { RealtimeDashboard } from '../components/ui/RealtimeDashboard';
import { MetricsCard } from '../components/ui/MetricsCard';
import { Chart } from '../components/ui/Chart';
import { useSellerStore } from '../stores/seller-store';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Progress } from '@/shared/components/ui/progress';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  TruckIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  mockMetrics,
  mockRevenueData,
  mockOrdersData,
  mockCategoryData,
  mockLeadSourceData,
  mockLeads,
  mockProducts,
} from '../data/mockData';

export const Dashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState<'realtime' | 'classic' | 'advanced'>('advanced');
  const [dashboardTab, setDashboardTab] = useState('overview');
  const { metrics, setMetrics } = useSellerStore();
  const { t, isRTL } = useLanguage();
  
  // Initialize store with mock data
  useEffect(() => {
    if (!metrics) {
      setMetrics({
        totalRevenue: mockMetrics.totalRevenue,
        totalOrders: mockMetrics.totalOrders,
        totalProducts: mockProducts.length,
        totalLeads: mockLeads.length,
        averageOrderValue: mockMetrics.averageOrderValue,
        conversionRate: mockMetrics.conversionRate,
        revenueGrowth: mockMetrics.revenueGrowth,
        ordersGrowth: mockMetrics.ordersGrowth,
        activeProducts: mockProducts.filter(p => p.status === 'active').length,
        lowStockProducts: mockProducts.filter(p => p.stock < 10).length,
        outOfStockProducts: mockProducts.filter(p => p.stock === 0).length,
        newLeads: mockLeads.filter(l => l.status === 'new').length,
        qualifiedLeads: mockLeads.filter(l => l.status === 'qualified').length,
        pendingOrders: 12,
        shippedOrders: 45,
      });
    }
  }, [metrics, setMetrics]);
  
  // Calculate additional metrics
  const lowStockProducts = mockProducts.filter(p => p.stock < 10);
  const activeLeads = mockLeads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status));
  const recentLeads = mockLeads.slice(0, 5);
  const todaysRevenue = 12450;
  const todaysOrders = 15;
  const pendingTasks = 8;
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Return real-time dashboard if selected
  if (viewMode === 'realtime') {
    return <RealtimeDashboard />;
  }

  // Return advanced dashboard if selected
  if (viewMode === 'advanced') {
    return (
      <div className="space-y-6">
        {/* Enhanced Page Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <h1 className="text-3xl font-bold text-gray-900">
                {isRTL ? 'لوحة تحكم البائع المتقدمة' : 'Advanced Seller Dashboard'}
              </h1>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title={isRTL ? 'تحديث البيانات' : 'Refresh data'}
              >
                <ArrowPathIcon className={`w-5 h-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              {isRTL ? 'نظرة شاملة على أداء عملك مع رؤى تفصيلية وتحليلات متقدمة' : 'Comprehensive business performance overview with detailed insights and advanced analytics'}
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 ${isRTL ? 'sm:space-x-reverse sm:space-x-3' : 'sm:space-x-3'}`}>
            {/* View Mode Selector */}
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as any)}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : ''}`}
            >
              <option value="advanced">{isRTL ? 'متقدم' : 'Advanced'}</option>
              <option value="realtime">{isRTL ? 'الوقت الفعلي' : 'Real-time'}</option>
              <option value="classic">{isRTL ? 'كلاسيكي' : 'Classic'}</option>
            </select>
            
            {/* Time Range Selector */}
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : ''}`}
            >
              <option value="24h">{isRTL ? 'آخر 24 ساعة' : 'Last 24 hours'}</option>
              <option value="7d">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</option>
              <option value="30d">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</option>
              <option value="90d">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</option>
            </select>
          </div>
        </div>

        {/* Advanced Dashboard Tabs */}
        <Tabs value={dashboardTab} onValueChange={setDashboardTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="sales">{isRTL ? 'المبيعات' : 'Sales'}</TabsTrigger>
            <TabsTrigger value="inventory">{isRTL ? 'المخزون' : 'Inventory'}</TabsTrigger>
            <TabsTrigger value="performance">{isRTL ? 'الأداء' : 'Performance'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                    {isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isRTL ? `${(metrics?.totalRevenue || 0).toLocaleString()} ر.س` : `$${(metrics?.totalRevenue || 0).toLocaleString()}`}
                  </div>
                  <p className="text-xs text-green-500 mt-1">+{mockMetrics.revenueGrowth}% vs last month</p>
                  <Progress value={75} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <ShoppingBagIcon className="w-4 h-4 mr-2" />
                    {isRTL ? 'الطلبات النشطة' : 'Active Orders'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{metrics?.totalOrders || 0}</div>
                  <p className="text-xs text-blue-500 mt-1">+{mockMetrics.ordersGrowth}% vs last month</p>
                  <Progress value={65} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    {isRTL ? 'عملاء جدد' : 'New Customers'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{metrics?.newLeads || 0}</div>
                  <p className="text-xs text-orange-500 mt-1">+15% vs last month</p>
                  <Progress value={45} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    {isRTL ? 'معدل التحويل' : 'Conversion Rate'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{metrics?.conversionRate || 0}%</div>
                  <p className="text-xs text-purple-500 mt-1">+{mockMetrics.conversionGrowth}% vs last month</p>
                  <Progress value={85} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Business Goals Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'أهداف الأعمال' : 'Business Goals'}</CardTitle>
                  <CardDescription>{isRTL ? 'تقدمك نحو الأهداف الشهرية' : 'Your progress towards monthly targets'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'هدف الإيرادات' : 'Revenue Target'}</span>
                      <span className="text-sm text-gray-500">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{isRTL ? 'ر.س 150,000 من أصل 200,000' : '$150,000 of $200,000'}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'هدف الطلبات' : 'Orders Target'}</span>
                      <span className="text-sm text-gray-500">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{isRTL ? '120 من أصل 200 طلب' : '120 of 200 orders'}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'هدف العملاء الجدد' : 'New Customers Target'}</span>
                      <span className="text-sm text-gray-500">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{isRTL ? '45 من أصل 100 عميل' : '45 of 100 customers'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'نشاطات حديثة' : 'Recent Activity'}</CardTitle>
                  <CardDescription>{isRTL ? 'آخر الأحداث في حسابك' : 'Latest events in your account'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-gray-500">Order #ORD-2024-001 - $2,500</p>
                        <p className="text-xs text-gray-400">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Product updated</p>
                        <p className="text-xs text-gray-500">Industrial Pump HP-3000 inventory updated</p>
                        <p className="text-xs text-gray-400">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert</p>
                        <p className="text-xs text-gray-500">Valve PC-4IN running low (8 units left)</p>
                        <p className="text-xs text-gray-400">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New lead generated</p>
                        <p className="text-xs text-gray-500">ABC Manufacturing inquiry</p>
                        <p className="text-xs text-gray-400">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart
                data={mockRevenueData}
                type="area"
                title={isRTL ? 'اتجاه الإيرادات' : 'Revenue Trend'}
                xKey="name"
                yKey="value"
                color="#10B981"
              />
              <Chart
                data={mockOrdersData}
                type="bar"
                title={isRTL ? 'الطلبات حسب الشهر' : 'Orders by Month'}
                xKey="name"
                yKey="value"
                color="#3B82F6"
              />
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6 mt-6">
            {/* Sales Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{isRTL ? 'المبيعات اليوم' : 'Today\'s Sales'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {isRTL ? `${todaysRevenue.toLocaleString()} ر.س` : `$${todaysRevenue.toLocaleString()}`}
                  </div>
                  <p className="text-sm text-green-500 mt-1">+12.5% vs yesterday</p>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">{isRTL ? 'الطلبات: ' : 'Orders: '}{todaysOrders}</div>
                    <div className="text-sm text-gray-600">{isRTL ? 'متوسط قيمة الطلب: ' : 'AOV: '}
                      {isRTL ? `${(todaysRevenue / todaysOrders).toFixed(0)} ر.س` : `$${(todaysRevenue / todaysOrders).toFixed(0)}`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{isRTL ? 'أفضل المنتجات' : 'Top Products'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {isRTL ? product.nameAr : product.name}
                          </p>
                          <p className="text-xs text-gray-500">{product.sales} sales</p>
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {isRTL ? `${(product.sales * product.price).toLocaleString()} ر.س` : `$${(product.sales * product.price).toLocaleString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{isRTL ? 'الفئات الأعلى' : 'Top Categories'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart
                    data={mockCategoryData}
                    type="pie"
                    title=""
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Detailed Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'تحليل المبيعات التفصيلي' : 'Detailed Sales Analysis'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={mockRevenueData}
                  type="line"
                  title=""
                  xKey="name"
                  yKey="value"
                  color="#3B82F6"
                  height={300}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6 mt-6">
            {/* Inventory Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي المنتجات' : 'Total Products'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.totalProducts || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">{metrics?.activeProducts || 0} active</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{metrics?.lowStockProducts || 0}</div>
                  <p className="text-xs text-yellow-500 mt-1">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{metrics?.outOfStockProducts || 0}</div>
                  <p className="text-xs text-red-500 mt-1">Urgent action needed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'قيمة المخزون' : 'Inventory Value'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isRTL ? `${(285000).toLocaleString()} ر.س` : `$${(285000).toLocaleString()}`}
                  </div>
                  <p className="text-xs text-green-500 mt-1">+5.2% vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-600" />
                  {isRTL ? 'تنبيهات المخزون' : 'Stock Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {isRTL ? product.nameAr : product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isRTL ? 'الفئة: ' : 'Category: '}{isRTL ? product.categoryAr : product.category}
                        </p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-yellow-600">
                          {product.stock} {isRTL ? 'متبقي' : 'left'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isRTL ? 'الحد الأدنى: ' : 'Min: '}{product.lowStockThreshold}
                        </p>
                        <Button size="sm" variant="outline" className="mt-1">
                          {isRTL ? 'إعادة طلب' : 'Reorder'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</span>
                    <span className="text-lg font-bold text-purple-600">{metrics?.conversionRate || 0}%</span>
                  </div>
                  <Progress value={metrics?.conversionRate || 0} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}</span>
                    <span className="text-lg font-bold text-green-600">
                      {isRTL ? `${metrics?.averageOrderValue || 0} ر.س` : `$${metrics?.averageOrderValue || 0}`}
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{isRTL ? 'رضا العملاء' : 'Customer Satisfaction'}</span>
                    <span className="text-lg font-bold text-blue-600">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{isRTL ? 'وقت معالجة الطلب' : 'Order Processing Time'}</span>
                    <span className="text-lg font-bold text-orange-600">2.3 hrs</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'اتجاهات الأداء' : 'Performance Trends'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Chart
                    data={[
                      { name: 'Jan', conversion: 3.2, satisfaction: 4.6, processing: 2.8 },
                      { name: 'Feb', conversion: 3.8, satisfaction: 4.7, processing: 2.5 },
                      { name: 'Mar', conversion: 4.1, satisfaction: 4.8, processing: 2.3 },
                      { name: 'Apr', conversion: 3.9, satisfaction: 4.7, processing: 2.4 },
                      { name: 'May', conversion: 4.3, satisfaction: 4.8, processing: 2.2 },
                      { name: 'Jun', conversion: 4.5, satisfaction: 4.9, processing: 2.1 }
                    ]}
                    type="line"
                    title=""
                    xKey="name"
                    yKey="conversion"
                    color="#8B5CF6"
                    height={250}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Comparison with Industry Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'مقارنة مع معايير الصناعة' : 'Industry Benchmark Comparison'}</CardTitle>
                <CardDescription>{isRTL ? 'كيف تقارن مع منافسيك' : 'How you compare with your competitors'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</span>
                      <div className="text-sm">
                        <span className="font-semibold text-purple-600">{metrics?.conversionRate || 0}%</span>
                        <span className="text-gray-500 ml-2">(Industry: 3.2%)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={metrics?.conversionRate || 0} className="h-3" />
                      <div className="absolute top-0 left-[32%] w-0.5 h-3 bg-red-400"></div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">📈 Above industry average</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'رضا العملاء' : 'Customer Satisfaction'}</span>
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">4.8/5</span>
                        <span className="text-gray-500 ml-2">(Industry: 4.3/5)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={96} className="h-3" />
                      <div className="absolute top-0 left-[86%] w-0.5 h-3 bg-red-400"></div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">📈 Significantly above average</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'وقت معالجة الطلب' : 'Order Processing Time'}</span>
                      <div className="text-sm">
                        <span className="font-semibold text-orange-600">2.3 hrs</span>
                        <span className="text-gray-500 ml-2">(Industry: 4.5 hrs)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={80} className="h-3" />
                      <div className="absolute top-0 right-[10%] w-0.5 h-3 bg-red-400"></div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">📈 Much faster than average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <h1 className="text-2xl font-bold text-gray-900">
                {isRTL ? 'نظرة عامة على لوحة التحكم' : 'Dashboard Overview'}
              </h1>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title={isRTL ? 'تحديث البيانات' : 'Refresh data'}
              >
                <ArrowPathIcon className={`w-5 h-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              {isRTL ? 'مرحباً بك! إليك ما يحدث مع عملك.' : 'Welcome back! Here\'s what\'s happening with your business.'}
            </p>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} mt-3 text-sm text-gray-500`}>
              <span className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                <CalendarDaysIcon className="w-4 h-4" />
                <span>
                  {isRTL ? `آخر تحديث: ${new Date().toLocaleTimeString('ar-SA')}` : `Last updated: ${new Date().toLocaleTimeString()}`}
                </span>
              </span>
            </div>
          </div>
          
          <div className={`flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 ${isRTL ? 'sm:space-x-reverse sm:space-x-3' : 'sm:space-x-3'}`}>
            {/* Time Range Selector */}
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : ''}`}
            >
              <option value="24h">{isRTL ? 'آخر 24 ساعة' : 'Last 24 hours'}</option>
              <option value="7d">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</option>
              <option value="30d">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</option>
              <option value="90d">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</option>
            </select>
            
            <button className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <PlusIcon className="w-5 h-5" />
              <span>{isRTL ? 'إجراء سريع' : 'Quick Action'}</span>
            </button>
          </div>
        </div>
        
        {/* Today's Summary Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-blue-600 font-medium">
                  {isRTL ? 'إيرادات اليوم' : 'Today\'s Revenue'}
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {isRTL ? `${todaysRevenue.toLocaleString()} ر.س` : `$${todaysRevenue.toLocaleString()}`}
                </p>
              </div>
              <div className="h-8 w-px bg-blue-200"></div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-blue-600 font-medium">
                  {isRTL ? 'طلبات اليوم' : 'Today\'s Orders'}
                </p>
                <p className="text-2xl font-bold text-blue-900">{todaysOrders}</p>
              </div>
              <div className="h-8 w-px bg-blue-200"></div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-blue-600 font-medium">
                  {isRTL ? 'المهام المعلقة' : 'Pending Tasks'}
                </p>
                <p className="text-2xl font-bold text-blue-900">{pendingTasks}</p>
              </div>
            </div>
            <div className={isRTL ? 'text-left' : 'text-right'}>
              <p className="text-sm text-blue-600">
                {isRTL ? 'الأداء مقارنة بالأمس' : 'Performance vs yesterday'}
              </p>
              <p className="text-lg font-semibold text-green-600">+12.5%</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title={isRTL ? "إجمالي الإيرادات" : "Total Revenue"}
            value={metrics?.totalRevenue || 0}
            change={mockMetrics.revenueGrowth}
            changeType={mockMetrics.revenueGrowth > 0 ? 'increase' : 'decrease'}
            icon={CurrencyDollarIcon}
            iconColor="text-green-600"
            format="currency"
          />
          <MetricsCard
            title={isRTL ? "إجمالي الطلبات" : "Total Orders"}
            value={metrics?.totalOrders || 0}
            change={mockMetrics.ordersGrowth}
            changeType={mockMetrics.ordersGrowth > 0 ? 'increase' : 'decrease'}
            icon={ShoppingBagIcon}
            iconColor="text-blue-600"
          />
          <MetricsCard
            title={isRTL ? "متوسط قيمة الطلب" : "Average Order Value"}
            value={metrics?.averageOrderValue || 0}
            change={mockMetrics.aovGrowth}
            changeType={mockMetrics.aovGrowth > 0 ? 'increase' : 'decrease'}
            icon={ChartBarIcon}
            iconColor="text-purple-600"
            format="currency"
          />
          <MetricsCard
            title={isRTL ? "معدل التحويل" : "Conversion Rate"}
            value={metrics?.conversionRate || 0}
            change={mockMetrics.conversionGrowth}
            changeType={mockMetrics.conversionGrowth > 0 ? 'increase' : 'decrease'}
            icon={ArrowTrendingUpIcon}
            iconColor="text-orange-600"
            format="percentage"
          />
        </div>
        
        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <EyeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics?.totalProducts || 0}</p>
            <p className="text-sm text-gray-600">{isRTL ? 'المنتجات' : 'Products'}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics?.totalLeads || 0}</p>
            <p className="text-sm text-gray-600">{isRTL ? 'العملاء المحتملون' : 'Leads'}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics?.pendingOrders || 0}</p>
            <p className="text-sm text-gray-600">{isRTL ? 'معلق' : 'Pending'}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TruckIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics?.shippedOrders || 0}</p>
            <p className="text-sm text-gray-600">{isRTL ? 'تم الشحن' : 'Shipped'}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics?.lowStockProducts || 0}</p>
            <p className="text-sm text-gray-600">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FunnelIcon className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics?.qualifiedLeads || 0}</p>
            <p className="text-sm text-gray-600">{isRTL ? 'مؤهل' : 'Qualified'}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            data={mockRevenueData}
            type="area"
            title="Revenue Trend"
            xKey="name"
            yKey="value"
            color="#10B981"
          />
          <Chart
            data={mockOrdersData}
            type="bar"
            title="Orders by Month"
            xKey="name"
            yKey="value"
            color="#3B82F6"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            data={mockCategoryData}
            type="pie"
            title="Sales by Category"
            height={300}
          />
          <Chart
            data={mockLeadSourceData}
            type="pie"
            title="Lead Sources"
            height={300}
            colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
          />
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Leads
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {activeLeads.length} Active
                </span>
              </div>
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        lead.status === 'qualified'
                          ? 'bg-green-100 text-green-800'
                          : lead.status === 'contacted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        ${lead.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href="/seller/leads/inbox"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all leads →
                </a>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-orange-600" />
                  Stock Alerts
                </h3>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  {lowStockProducts.length} Low
                </span>
              </div>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">
                        {product.stock} left
                      </p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href="/seller/products/inventory"
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  Manage inventory →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <PlusIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Add New Product</p>
                      <p className="text-xs text-gray-500">Create a new product listing</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Follow Up Leads</p>
                      <p className="text-xs text-gray-500">Contact pending leads</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ChartBarIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">View Analytics</p>
                      <p className="text-xs text-gray-500">Check performance metrics</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;