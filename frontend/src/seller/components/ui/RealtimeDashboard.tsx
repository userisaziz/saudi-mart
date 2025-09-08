import React, { useState, useEffect, useMemo } from 'react';
import { MetricsCard } from './MetricsCard';
import { Chart } from './Chart';
import { useSellerStore } from '../stores/seller-store';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
  Clock,
  Target,
  Activity,
  Eye,
  Bell,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

// Types
interface DashboardMetrics {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  totalProducts: number;
  activeProducts: number;
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
  responseTime: number;
  revenueGrowth: number;
  ordersGrowth: number;
  leadsGrowth: number;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface RecentActivity {
  id: string;
  type: 'order' | 'lead' | 'product' | 'customer';
  title: string;
  description: string;
  timestamp: string;
  value?: number;
  status?: string;
}

export const RealtimeDashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock real-time data - in production this would come from WebSocket/API
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 125340,
    todayRevenue: 8250,
    totalOrders: 486,
    todayOrders: 12,
    totalProducts: 248,
    activeProducts: 234,
    totalLeads: 89,
    newLeads: 15,
    conversionRate: 24.5,
    averageOrderValue: 257,
    customerSatisfaction: 4.8,
    responseTime: 2.3,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    leadsGrowth: 15.7,
  });

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      type: 'warning',
      title: isRTL ? 'مخزون منخفض' : 'Low Stock Alert',
      message: isRTL ? '5 منتجات تحتاج إلى تجديد المخزون' : '5 products need inventory replenishment',
      timestamp: '5m ago',
      priority: 'high'
    },
    {
      id: '2',
      type: 'info',
      title: isRTL ? 'عروض أسعار جديدة' : 'New Quote Requests',
      message: isRTL ? '3 طلبات عروض أسعار في انتظار الرد' : '3 quote requests awaiting response',
      timestamp: '15m ago',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'success',
      title: isRTL ? 'طلب جديد' : 'New Order',
      message: isRTL ? 'طلب بقيمة 12,500 ريال تم تأكيده' : 'Order worth $12,500 confirmed',
      timestamp: '1h ago',
      priority: 'medium'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'order',
      title: isRTL ? 'طلب جديد #ORD-001' : 'New Order #ORD-001',
      description: isRTL ? 'شركة الصناعات السعودية' : 'Saudi Industries Company',
      timestamp: '2m ago',
      value: 15000,
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'lead',
      title: isRTL ? 'عميل محتمل جديد' : 'New Lead',
      description: isRTL ? 'محمد أحمد - شركة التقنية المتقدمة' : 'Ahmed Mohammed - Advanced Tech Co.',
      timestamp: '8m ago',
      value: 25000,
      status: 'qualified'
    },
    {
      id: '3',
      type: 'product',
      title: isRTL ? 'مشاهدة منتج' : 'Product View',
      description: isRTL ? 'أنابيب الصلب الصناعية' : 'Industrial Steel Pipes',
      timestamp: '12m ago',
      status: 'viewed'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metric updates
      setMetrics(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 500),
        todayOrders: prev.todayOrders + (Math.random() > 0.8 ? 1 : 0),
        newLeads: prev.newLeads + (Math.random() > 0.9 ? 1 : 0),
      }));
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
    setLastUpdated(new Date());
  };

  // Chart data
  const revenueData = useMemo(() => [
    { name: isRTL ? 'السبت' : 'Sat', revenue: 12000, orders: 15 },
    { name: isRTL ? 'الأحد' : 'Sun', revenue: 18500, orders: 22 },
    { name: isRTL ? 'الاثنين' : 'Mon', revenue: 15200, orders: 19 },
    { name: isRTL ? 'الثلاثاء' : 'Tue', revenue: 22100, orders: 28 },
    { name: isRTL ? 'الأربعاء' : 'Wed', revenue: 19800, orders: 25 },
    { name: isRTL ? 'الخميس' : 'Thu', revenue: 25600, orders: 32 },
    { name: isRTL ? 'الجمعة' : 'Fri', revenue: metrics.todayRevenue, orders: metrics.todayOrders },
  ], [metrics, isRTL]);

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'order': return ShoppingBag;
      case 'lead': return Users;
      case 'product': return Eye;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with Real-time Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'لوحة التحكم المباشرة' : 'Real-time Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'آخر تحديث: ' : 'Last updated: '}
            {lastUpdated.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US')}
          </p>
        </div>
        
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">{isRTL ? 'اليوم' : 'Today'}</SelectItem>
              <SelectItem value="7d">{isRTL ? '7 أيام' : '7 days'}</SelectItem>
              <SelectItem value="30d">{isRTL ? '30 يوم' : '30 days'}</SelectItem>
              <SelectItem value="90d">{isRTL ? '90 يوم' : '90 days'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          
          <Button variant="outline" size="sm" className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Download className="h-4 w-4" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={isRTL ? 'الإيرادات اليوم' : "Today's Revenue"}
          value={metrics.todayRevenue}
          change={metrics.revenueGrowth}
          changeType="increase"
          icon={DollarSign}
          iconColor="text-green-600"
          format="currency"
        />
        
        <MetricsCard
          title={isRTL ? 'الطلبات اليوم' : "Today's Orders"}
          value={metrics.todayOrders}
          change={metrics.ordersGrowth}
          changeType="increase"
          icon={ShoppingBag}
          iconColor="text-blue-600"
        />
        
        <MetricsCard
          title={isRTL ? 'العملاء المحتملون الجدد' : 'New Leads'}
          value={metrics.newLeads}
          change={metrics.leadsGrowth}
          changeType="increase"
          icon={Users}
          iconColor="text-purple-600"
        />
        
        <MetricsCard
          title={isRTL ? 'معدل التحويل' : 'Conversion Rate'}
          value={metrics.conversionRate}
          change={2.3}
          changeType="increase"
          icon={Target}
          iconColor="text-orange-600"
          format="percentage"
        />
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${metrics.averageOrderValue}</span>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +4.2% {isRTL ? 'من الأسبوع الماضي' : 'from last week'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {isRTL ? 'رضا العملاء' : 'Customer Satisfaction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metrics.customerSatisfaction}/5</span>
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(metrics.customerSatisfaction))}
              </div>
            </div>
            <Progress value={(metrics.customerSatisfaction / 5) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {isRTL ? 'وقت الاستجابة' : 'Response Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metrics.responseTime}h</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-green-600 mt-1">
              -15% {isRTL ? 'تحسن' : 'improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {isRTL ? 'المنتجات النشطة' : 'Active Products'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metrics.activeProducts}</span>
              <Activity className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={(metrics.activeProducts / metrics.totalProducts) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="h-5 w-5" />
              {isRTL ? 'اتجاه الإيرادات' : 'Revenue Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={revenueData}
              type="line"
              xKey="name"
              yKeys={['revenue']}
              colors={['#3B82F6']}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Bell className="h-5 w-5" />
                {isRTL ? 'التنبيهات' : 'Alerts'}
                <Badge variant="secondary">{alerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <span className="text-xs opacity-75">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-75">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Activity className="h-5 w-5" />
                {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.slice(0, 4).map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};