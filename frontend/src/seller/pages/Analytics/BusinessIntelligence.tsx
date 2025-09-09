import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { MetricsCard } from '@/seller/components/ui/MetricsCard';
import { Chart } from '@/seller/components/ui/Chart';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TagIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon as ArrowTrendingUpSolidIcon,
  ArrowTrendingDownIcon as ArrowTrendingDownSolidIcon,
} from '@heroicons/react/24/solid';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    byMonth: Array<{ month: string; revenue: number; orders: number; customers: number }>;
    byCategory: Array<{ category: string; revenue: number; percentage: number }>;
    byRegion: Array<{ region: string; revenue: number; growth: number }>;
  };
  orders: {
    total: number;
    growth: number;
    averageValue: number;
    completionRate: number;
    byStatus: Array<{ status: string; count: number; percentage: number }>;
    byChannel: Array<{ channel: string; orders: number; revenue: number }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retentionRate: number;
    lifetime_value: number;
    bySegment: Array<{ segment: string; count: number; revenue: number }>;
    geography: Array<{ country: string; customers: number; revenue: number }>;
  };
  products: {
    totalViews: number;
    conversionRate: number;
    topPerformers: Array<{ name: string; sales: number; revenue: number; margin: number }>;
    underperformers: Array<{ name: string; views: number; sales: number; conversionRate: number }>;
    inventory: { inStock: number; lowStock: number; outOfStock: number; totalValue: number };
  };
  traffic: {
    totalVisitors: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    bySource: Array<{ source: string; visitors: number; conversions: number }>;
    byDevice: Array<{ device: string; visitors: number; percentage: number }>;
    byRegion: Array<{ region: string; visitors: number; sessions: number }>;
  };
  financial: {
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    expenses: { total: number; breakdown: Array<{ category: string; amount: number }> };
    cashFlow: Array<{ month: string; income: number; expenses: number; net: number }>;
  };
}

// Mock comprehensive analytics data
const mockAnalyticsData: AnalyticsData = {
  revenue: {
    total: 2450000,
    growth: 18.5,
    byMonth: [
      { month: 'Jan', revenue: 325000, orders: 87, customers: 45 },
      { month: 'Feb', revenue: 385000, orders: 102, customers: 52 },
      { month: 'Mar', revenue: 420000, orders: 115, customers: 58 },
      { month: 'Apr', revenue: 395000, orders: 98, customers: 49 },
      { month: 'May', revenue: 465000, orders: 128, customers: 67 },
      { month: 'Jun', revenue: 459000, orders: 125, customers: 63 }
    ],
    byCategory: [
      { category: 'Industrial Equipment', revenue: 980000, percentage: 40 },
      { category: 'Valves & Controls', revenue: 612500, percentage: 25 },
      { category: 'Electric Motors', revenue: 490000, percentage: 20 },
      { category: 'Hydraulic Systems', revenue: 245000, percentage: 10 },
      { category: 'Safety Equipment', revenue: 122500, percentage: 5 }
    ],
    byRegion: [
      { region: 'Riyadh', revenue: 1225000, growth: 22.3 },
      { region: 'Jeddah', revenue: 735000, growth: 15.8 },
      { region: 'Dammam', revenue: 367500, growth: 12.1 },
      { region: 'Mecca', revenue: 122500, growth: 8.5 }
    ]
  },
  orders: {
    total: 655,
    growth: 15.2,
    averageValue: 37404,
    completionRate: 94.2,
    byStatus: [
      { status: 'Completed', count: 617, percentage: 94.2 },
      { status: 'Processing', count: 25, percentage: 3.8 },
      { status: 'Pending', count: 8, percentage: 1.2 },
      { status: 'Cancelled', count: 5, percentage: 0.8 }
    ],
    byChannel: [
      { channel: 'Direct Website', orders: 425, revenue: 1592500 },
      { channel: 'B2B Marketplace', orders: 130, revenue: 486250 },
      { channel: 'Sales Team', orders: 75, revenue: 281250 },
      { channel: 'Partners', orders: 25, revenue: 93750 }
    ]
  },
  customers: {
    total: 342,
    new: 78,
    returning: 264,
    retentionRate: 77.2,
    lifetime_value: 71637,
    bySegment: [
      { segment: 'Enterprise', count: 45, revenue: 1470000 },
      { segment: 'SME', count: 178, revenue: 712000 },
      { segment: 'Government', count: 67, revenue: 201000 },
      { segment: 'Individual', count: 52, revenue: 67000 }
    ],
    geography: [
      { country: 'Saudi Arabia', customers: 298, revenue: 2085000 },
      { country: 'UAE', customers: 28, revenue: 245000 },
      { country: 'Kuwait', customers: 12, revenue: 98000 },
      { country: 'Bahrain', customers: 4, revenue: 22000 }
    ]
  },
  products: {
    totalViews: 45632,
    conversionRate: 4.8,
    topPerformers: [
      { name: 'Industrial Water Pump HP-2000', sales: 45, revenue: 675000, margin: 40 },
      { name: 'Hydraulic Cylinder 200mm', sales: 32, revenue: 272000, margin: 35 },
      { name: 'Safety Relief Valve 1000 PSI', sales: 67, revenue: 80400, margin: 45 }
    ],
    underperformers: [
      { name: 'Pressure Gauge Digital', views: 234, sales: 2, conversionRate: 0.85 },
      { name: 'Flow Meter Ultrasonic', views: 189, sales: 1, conversionRate: 0.53 }
    ],
    inventory: { inStock: 156, lowStock: 23, outOfStock: 8, totalValue: 3250000 }
  },
  traffic: {
    totalVisitors: 28945,
    uniqueVisitors: 18673,
    bounceRate: 34.2,
    avgSessionDuration: 4.35,
    bySource: [
      { source: 'Organic Search', visitors: 12567, conversions: 412 },
      { source: 'Direct', visitors: 8934, conversions: 298 },
      { source: 'Social Media', visitors: 4123, conversions: 89 },
      { source: 'Email', visitors: 2156, conversions: 156 },
      { source: 'Paid Ads', visitors: 1165, conversions: 78 }
    ],
    byDevice: [
      { device: 'Desktop', visitors: 18976, percentage: 65.6 },
      { device: 'Mobile', visitors: 7834, percentage: 27.1 },
      { device: 'Tablet', visitors: 2135, percentage: 7.3 }
    ],
    byRegion: [
      { region: 'Middle East', visitors: 22356, sessions: 34567 },
      { region: 'Europe', visitors: 4123, sessions: 5678 },
      { region: 'Asia', visitors: 1845, sessions: 2456 },
      { region: 'Others', visitors: 621, sessions: 889 }
    ]
  },
  financial: {
    grossProfit: 980000,
    netProfit: 735000,
    profitMargin: 30.0,
    expenses: {
      total: 245000,
      breakdown: [
        { category: 'Operations', amount: 98000 },
        { category: 'Marketing', amount: 73500 },
        { category: 'Staff', amount: 49000 },
        { category: 'Technology', amount: 24500 }
      ]
    },
    cashFlow: [
      { month: 'Jan', income: 325000, expenses: 89250, net: 235750 },
      { month: 'Feb', income: 385000, expenses: 96250, net: 288750 },
      { month: 'Mar', income: 420000, expenses: 105000, net: 315000 },
      { month: 'Apr', income: 395000, expenses: 98750, net: 296250 },
      { month: 'May', income: 465000, expenses: 116250, net: 348750 },
      { month: 'Jun', income: 459000, expenses: 114750, net: 344250 }
    ]
  }
};

export default function BusinessIntelligence() {
  const { t, isRTL } = useLanguage();
  const [data] = useState<AnalyticsData>(mockAnalyticsData);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous_period');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'orders', 'customers']);

  // Calculate period-over-period changes
  const getPeriodChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  // Format currency based on language
  const formatCurrency = (amount: number) => {
    return isRTL ? `${amount.toLocaleString()} ر.س` : `$${amount.toLocaleString()}`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'ذكاء الأعمال والتحليلات المتقدمة' : 'Business Intelligence & Advanced Analytics'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRTL ? 'رؤى شاملة وتحليلات متقدمة لاتخاذ قرارات مدروسة ونمو الأعمال' : 'Comprehensive insights and advanced analytics for data-driven decisions and business growth'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1m">{isRTL ? 'آخر شهر' : 'Last Month'}</option>
            <option value="3m">{isRTL ? 'آخر 3 أشهر' : 'Last 3 Months'}</option>
            <option value="6m">{isRTL ? 'آخر 6 أشهر' : 'Last 6 Months'}</option>
            <option value="1y">{isRTL ? 'آخر سنة' : 'Last Year'}</option>
          </select>
          <Button variant="outline" size="sm">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير التقرير' : 'Export Report'}
          </Button>
          <Button variant="outline" size="sm">
            <ShareIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'مشاركة' : 'Share'}
          </Button>
          <Button>
            <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'تخصيص' : 'Customize'}
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
          value={data.revenue.total}
          change={data.revenue.growth}
          changeType="increase"
          icon={CurrencyDollarIcon}
          iconColor="text-green-600"
          format="currency"
        />
        <MetricsCard
          title={isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
          value={data.orders.total}
          change={data.orders.growth}
          changeType="increase"
          icon={ShoppingBagIcon}
          iconColor="text-blue-600"
        />
        <MetricsCard
          title={isRTL ? 'العملاء النشطون' : 'Active Customers'}
          value={data.customers.total}
          change={12.8}
          changeType="increase"
          icon={UserGroupIcon}
          iconColor="text-purple-600"
        />
        <MetricsCard
          title={isRTL ? 'معدل التحويل' : 'Conversion Rate'}
          value={data.products.conversionRate}
          change={0.8}
          changeType="increase"
          icon={ArrowTrendingUpIcon}
          iconColor="text-orange-600"
          format="percentage"
        />
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="revenue">{isRTL ? 'الإيرادات' : 'Revenue'}</TabsTrigger>
          <TabsTrigger value="customers">{isRTL ? 'العملاء' : 'Customers'}</TabsTrigger>
          <TabsTrigger value="products">{isRTL ? 'المنتجات' : 'Products'}</TabsTrigger>
          <TabsTrigger value="marketing">{isRTL ? 'التسويق' : 'Marketing'}</TabsTrigger>
          <TabsTrigger value="financial">{isRTL ? 'المالية' : 'Financial'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Business Health Score */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                {isRTL ? 'مؤشر صحة الأعمال' : 'Business Health Score'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تقييم شامل لأداء عملك بناءً على المؤشرات الرئيسية' : 'Comprehensive assessment of your business performance based on key metrics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl font-bold text-green-600">87/100</div>
                <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                  {isRTL ? 'ممتاز' : 'Excellent'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{isRTL ? 'نمو الإيرادات' : 'Revenue Growth'}</span>
                    <span className="text-sm text-green-600">92/100</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{isRTL ? 'رضا العملاء' : 'Customer Satisfaction'}</span>
                    <span className="text-sm text-green-600">89/100</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{isRTL ? 'الكفاءة التشغيلية' : 'Operational Efficiency'}</span>
                    <span className="text-sm text-blue-600">83/100</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{isRTL ? 'الأداء المالي' : 'Financial Performance'}</span>
                    <span className="text-sm text-green-600">85/100</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'اتجاه الإيرادات' : 'Revenue Trend'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={data.revenue.byMonth}
                  type="area"
                  title=""
                  xKey="month"
                  yKey="revenue"
                  color="#10B981"
                  height={250}
                />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{isRTL ? 'متوسط النمو الشهري' : 'Avg Monthly Growth'}</span>
                  <span className="font-semibold text-green-600 flex items-center">
                    <ArrowTrendingUpSolidIcon className="w-4 h-4 mr-1" />
                    +{data.revenue.growth}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'تحليل العملاء' : 'Customer Analysis'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{isRTL ? 'إجمالي العملاء' : 'Total Customers'}</span>
                    <span className="font-semibold text-2xl">{data.customers.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{isRTL ? 'عملاء جدد' : 'New Customers'}</span>
                    <span className="font-semibold text-green-600">{data.customers.new}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{isRTL ? 'معدل الاحتفاظ' : 'Retention Rate'}</span>
                    <span className="font-semibold text-blue-600">{formatPercentage(data.customers.retentionRate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{isRTL ? 'القيمة الحياتية' : 'Lifetime Value'}</span>
                    <span className="font-semibold">{formatCurrency(data.customers.lifetime_value)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Progress value={data.customers.retentionRate} className="h-3" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{isRTL ? 'عملاء جدد' : 'New'}</span>
                      <span>{isRTL ? 'عملاء عائدون' : 'Returning'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'أداء المنتجات' : 'Product Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{formatPercentage(data.products.conversionRate)}</div>
                    <p className="text-sm text-gray-600">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</p>
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'إجمالي المشاهدات' : 'Total Views'}</span>
                      <span className="font-medium">{data.products.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'منتجات متوفرة' : 'In Stock'}</span>
                      <span className="font-medium text-green-600">{data.products.inventory.inStock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</span>
                      <span className="font-medium text-yellow-600">{data.products.inventory.lowStock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</span>
                      <span className="font-medium text-red-600">{data.products.inventory.outOfStock}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">{isRTL ? 'صحة المخزون' : 'Inventory Health'}</div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'أفضل المنتجات أداءً' : 'Top Performing Products'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.products.topPerformers.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {product.sales} {isRTL ? 'مبيعات' : 'sales'} • {formatPercentage(product.margin)} {isRTL ? 'هامش ربح' : 'margin'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(product.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الإيرادات حسب الفئة' : 'Revenue by Category'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={data.revenue.byCategory}
                  type="pie"
                  title=""
                  height={250}
                  colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          {/* Revenue Deep Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(data.revenue.total)}</div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                  +{formatPercentage(data.revenue.growth)} vs {isRTL ? 'الفترة السابقة' : 'previous period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.orders.averageValue)}</div>
                <p className="text-xs text-blue-500 mt-1 flex items-center">
                  <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                  +5.2% vs {isRTL ? 'الفترة السابقة' : 'previous period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'الربح الإجمالي' : 'Gross Profit'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(data.financial.grossProfit)}</div>
                <p className="text-xs text-purple-500 mt-1">
                  {formatPercentage(data.financial.profitMargin)} {isRTL ? 'هامش ربح' : 'margin'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'الربح الصافي' : 'Net Profit'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.financial.netProfit)}</div>
                <p className="text-xs text-orange-500 mt-1">
                  {formatPercentage((data.financial.netProfit / data.revenue.total) * 100)} {isRTL ? 'من الإيرادات' : 'of revenue'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'اتجاه الإيرادات الشهرية' : 'Monthly Revenue Trend'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'مقارنة الإيرادات والطلبات والعملاء عبر الأشهر' : 'Compare revenue, orders, and customers across months'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Chart
                  data={data.revenue.byMonth}
                  type="line"
                  title=""
                  xKey="month"
                  yKey="revenue"
                  color="#10B981"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الإيرادات حسب المنطقة' : 'Revenue by Region'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.revenue.byRegion.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region.region}</span>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(region.revenue)}</div>
                          <div className={`text-xs flex items-center ${
                            region.growth >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {region.growth >= 0 ? (
                              <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                            ) : (
                              <ArrowTrendingDownSolidIcon className="w-3 h-3 mr-1" />
                            )}
                            {formatPercentage(Math.abs(region.growth))}
                          </div>
                        </div>
                      </div>
                      <Progress value={(region.revenue / data.revenue.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Category and Channel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الإيرادات حسب الفئة' : 'Revenue by Category'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.revenue.byCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm text-gray-500">{formatPercentage(category.percentage)}</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(category.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الإيرادات حسب القناة' : 'Revenue by Channel'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.orders.byChannel.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{channel.channel}</h4>
                        <p className="text-sm text-gray-600">
                          {channel.orders} {isRTL ? 'طلب' : 'orders'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(channel.revenue)}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(channel.revenue / channel.orders)} {isRTL ? 'متوسط' : 'avg'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 mt-6">
          {/* Customer Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي العملاء' : 'Total Customers'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{data.customers.total}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.customers.new} {isRTL ? 'جديد هذا الشهر' : 'new this month'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'معدل الاحتفاظ' : 'Retention Rate'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatPercentage(data.customers.retentionRate)}</div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                  +2.3% vs {isRTL ? 'الفترة السابقة' : 'last period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'القيمة الحياتية للعميل' : 'Customer Lifetime Value'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(data.customers.lifetime_value)}</div>
                <p className="text-xs text-purple-500 mt-1">
                  {isRTL ? 'متوسط القيمة الحياتية' : 'Average lifetime value'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'العملاء العائدون' : 'Returning Customers'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{data.customers.returning}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercentage((data.customers.returning / data.customers.total) * 100)} {isRTL ? 'من إجمالي العملاء' : 'of total'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Segmentation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'تقسيم العملاء' : 'Customer Segmentation'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'توزيع العملاء والإيرادات حسب الشريحة' : 'Customer and revenue distribution by segment'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.customers.bySegment.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <div className="text-right">
                          <div className="font-semibold">{segment.count} {isRTL ? 'عميل' : 'customers'}</div>
                          <div className="text-sm text-green-600">{formatCurrency(segment.revenue)}</div>
                        </div>
                      </div>
                      <Progress value={(segment.count / data.customers.total) * 100} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {formatPercentage((segment.count / data.customers.total) * 100)} {isRTL ? 'من العملاء' : 'of customers'}, {formatPercentage((segment.revenue / data.revenue.total) * 100)} {isRTL ? 'من الإيرادات' : 'of revenue'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'التوزيع الجغرافي للعملاء' : 'Customer Geography'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.customers.geography.map((geo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{geo.country}</h4>
                          <p className="text-sm text-gray-600">{geo.customers} {isRTL ? 'عميل' : 'customers'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(geo.revenue)}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(geo.revenue / geo.customers)} {isRTL ? 'متوسط' : 'avg'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Behavior Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'تحليل سلوك العملاء' : 'Customer Behavior Analysis'}</CardTitle>
              <CardDescription>
                {isRTL ? 'رؤى حول كيفية تفاعل العملاء مع منتجاتك وخدماتك' : 'Insights into how customers interact with your products and services'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'معدلات الشراء' : 'Purchase Patterns'}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? 'مشتريات أسبوعية' : 'Weekly Purchases'}</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? 'مشتريات شهرية' : 'Monthly Purchases'}</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? 'مشتريات ربع سنوية' : 'Quarterly Purchases'}</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'قنوات التفضيل' : 'Preferred Channels'}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? 'الموقع الإلكتروني' : 'Website'}</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? 'فريق المبيعات' : 'Sales Team'}</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{isRTL ? 'الهاتف' : 'Phone'}</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'مقاييس المشاركة' : 'Engagement Metrics'}</h3>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">4.8</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'تقييم الرضا' : 'Satisfaction Score'}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">67%</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'معدل إعادة الشراء' : 'Repeat Purchase Rate'}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">8.2</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'نقاط الترشيح (NPS)' : 'Net Promoter Score'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6 mt-6">
          {/* Product Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي المشاهدات' : 'Total Views'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{data.products.totalViews.toLocaleString()}</div>
                <p className="text-xs text-blue-500 mt-1 flex items-center">
                  <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                  +12.5% vs {isRTL ? 'الفترة السابقة' : 'last period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatPercentage(data.products.conversionRate)}</div>
                <p className="text-xs text-green-500 mt-1">
                  +0.8% vs {isRTL ? 'الفترة السابقة' : 'last period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'منتجات متوفرة' : 'Products In Stock'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{data.products.inventory.inStock}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercentage((data.products.inventory.inStock / (data.products.inventory.inStock + data.products.inventory.outOfStock)) * 100)} {isRTL ? 'معدل التوفر' : 'availability'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'قيمة المخزون' : 'Inventory Value'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.products.inventory.totalValue)}</div>
                <p className="text-xs text-orange-500 mt-1">
                  +3.2% vs {isRTL ? 'الفترة السابقة' : 'last month'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Product Performance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  {isRTL ? 'أفضل المنتجات أداءً' : 'Top Performing Products'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'المنتجات الأكثر مبيعاً وربحية' : 'Best selling and most profitable products'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.products.topPerformers.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-green-700">#{index + 1}</span>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{product.sales} {isRTL ? 'مبيعات' : 'sales'}</span>
                          <span>{formatPercentage(product.margin)} {isRTL ? 'هامش ربح' : 'margin'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{formatCurrency(product.revenue)}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(product.revenue / product.sales)} {isRTL ? 'متوسط' : 'avg'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-orange-500" />
                  {isRTL ? 'منتجات تحتاج تحسين' : 'Products Need Improvement'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'منتجات ضعيفة الأداء تحتاج اهتمام' : 'Underperforming products that need attention'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.products.underperformers.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{product.views} {isRTL ? 'مشاهدة' : 'views'}</span>
                          <span>{product.sales} {isRTL ? 'مبيعات' : 'sales'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-600">{formatPercentage(product.conversionRate)}</div>
                        <div className="text-xs text-gray-500">{isRTL ? 'معدل التحويل' : 'conversion'}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">{isRTL ? 'توصيات التحسين' : 'Improvement Recommendations'}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• {isRTL ? 'تحسين أوصاف المنتجات والكلمات المفتاحية' : 'Improve product descriptions and keywords'}</p>
                      <p>• {isRTL ? 'إضافة صور عالية الجودة' : 'Add high-quality product images'}</p>
                      <p>• {isRTL ? 'مراجعة استراتيجية التسعير' : 'Review pricing strategy'}</p>
                      <p>• {isRTL ? 'تحسين موقع المنتجات في الفئات' : 'Optimize product placement in categories'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Status */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'حالة المخزون المتقدمة' : 'Advanced Inventory Status'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تحليل تفصيلي لحالة المخزون مع التوقعات والتحليلات' : 'Detailed inventory analysis with forecasting and analytics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{data.products.inventory.inStock}</div>
                  <p className="text-sm text-gray-600 mt-1">{isRTL ? 'منتجات متوفرة' : 'Products In Stock'}</p>
                  <div className="mt-2">
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-green-600 mt-1">85% {isRTL ? 'صحة المخزون' : 'stock health'}</p>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{data.products.inventory.lowStock}</div>
                  <p className="text-sm text-gray-600 mt-1">{isRTL ? 'مخزون منخفض' : 'Low Stock Items'}</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{data.products.inventory.outOfStock}</div>
                  <p className="text-sm text-gray-600 mt-1">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      {isRTL ? 'إعادة الطلب' : 'Reorder Now'}
                    </Button>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.products.inventory.totalValue)}</div>
                  <p className="text-sm text-gray-600 mt-1">{isRTL ? 'قيمة المخزون الإجمالية' : 'Total Inventory Value'}</p>
                  <div className="mt-2">
                    <p className="text-xs text-blue-600">+3.2% {isRTL ? 'نمو شهري' : 'monthly growth'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6 mt-6">
          {/* Traffic & Marketing Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي الزوار' : 'Total Visitors'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{data.traffic.totalVisitors.toLocaleString()}</div>
                <p className="text-xs text-blue-500 mt-1 flex items-center">
                  <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                  +18.2% vs {isRTL ? 'الفترة السابقة' : 'last period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'الزوار الفريدون' : 'Unique Visitors'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.traffic.uniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercentage((data.traffic.uniqueVisitors / data.traffic.totalVisitors) * 100)} {isRTL ? 'من إجمالي الزوار' : 'of total visitors'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'معدل الارتداد' : 'Bounce Rate'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatPercentage(data.traffic.bounceRate)}</div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowTrendingDownSolidIcon className="w-3 h-3 mr-1" />
                  -2.1% vs {isRTL ? 'الفترة السابقة' : 'last period'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'متوسط مدة الجلسة' : 'Avg Session Duration'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{data.traffic.avgSessionDuration} min</div>
                <p className="text-xs text-purple-500 mt-1">
                  +0.3 min vs {isRTL ? 'الفترة السابقة' : 'last period'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources and Device Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'مصادر الزيارات' : 'Traffic Sources'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'أداء قنوات التسويق المختلفة' : 'Performance of different marketing channels'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.traffic.bySource.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{source.source}</span>
                        <div className="text-right">
                          <div className="font-semibold">{source.visitors.toLocaleString()} {isRTL ? 'زائر' : 'visitors'}</div>
                          <div className="text-sm text-green-600">{source.conversions} {isRTL ? 'تحويلات' : 'conversions'}</div>
                        </div>
                      </div>
                      <Progress value={(source.visitors / data.traffic.totalVisitors) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatPercentage((source.visitors / data.traffic.totalVisitors) * 100)} {isRTL ? 'من الزوار' : 'of traffic'}</span>
                        <span>{formatPercentage((source.conversions / source.visitors) * 100)} {isRTL ? 'معدل التحويل' : 'conversion rate'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'توزيع الأجهزة' : 'Device Breakdown'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.traffic.byDevice.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {device.device === 'Desktop' && <ComputerDesktopIcon className="w-4 h-4 text-blue-600" />}
                          {device.device === 'Mobile' && <DevicePhoneMobileIcon className="w-4 h-4 text-blue-600" />}
                          {device.device === 'Tablet' && <ComputerDesktopIcon className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{device.device}</h4>
                          <p className="text-sm text-gray-600">{device.visitors.toLocaleString()} {isRTL ? 'زائر' : 'visitors'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{formatPercentage(device.percentage)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">{isRTL ? 'رؤى الجهاز' : 'Device Insights'}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• {isRTL ? 'المستخدمون على الأجهزة المحمولة لديهم معدل تحويل أعلى' : 'Mobile users have higher conversion rates'}</p>
                    <p>• {isRTL ? 'مستخدمو سطح المكتب يقضون وقتاً أطول في التصفح' : 'Desktop users spend more time browsing'}</p>
                    <p>• {isRTL ? 'حركة الأجهزة اللوحية تنمو بثبات' : 'Tablet traffic is growing steadily'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketing Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'أداء الحملات التسويقية' : 'Marketing Campaign Performance'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تحليل شامل لفعالية الحملات التسويقية وعائد الاستثمار' : 'Comprehensive analysis of marketing campaign effectiveness and ROI'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'أداء القنوات' : 'Channel Performance'}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-green-900">{isRTL ? 'البحث العضوي' : 'Organic Search'}</h4>
                        <p className="text-sm text-green-700">12,567 {isRTL ? 'زائر' : 'visitors'}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">3.3%</div>
                        <p className="text-xs text-green-500">{isRTL ? 'معدل التحويل' : 'conversion'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-blue-900">{isRTL ? 'الزيارات المباشرة' : 'Direct Traffic'}</h4>
                        <p className="text-sm text-blue-700">8,934 {isRTL ? 'زائر' : 'visitors'}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">3.3%</div>
                        <p className="text-xs text-blue-500">{isRTL ? 'معدل التحويل' : 'conversion'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-purple-900">{isRTL ? 'وسائل التواصل الاجتماعي' : 'Social Media'}</h4>
                        <p className="text-sm text-purple-700">4,123 {isRTL ? 'زائر' : 'visitors'}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-purple-600">2.2%</div>
                        <p className="text-xs text-purple-500">{isRTL ? 'معدل التحويل' : 'conversion'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'عائد الاستثمار' : 'Return on Investment'}</h3>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">450%</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'عائد استثمار إجمالي' : 'Total ROI'}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(85000)}</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'إجمالي الاستثمار' : 'Total Investment'}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(382500)}</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'الإيرادات المحققة' : 'Revenue Generated'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'توقعات النمو' : 'Growth Projections'}</h3>
                  <div className="space-y-3">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{isRTL ? 'الشهر القادم' : 'Next Month'}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{isRTL ? 'الزوار المتوقعون' : 'Expected Visitors'}</span>
                          <span className="font-medium">34,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{isRTL ? 'التحويلات المتوقعة' : 'Expected Conversions'}</span>
                          <span className="font-medium text-green-600">1,265</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{isRTL ? 'الربع القادم' : 'Next Quarter'}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{isRTL ? 'النمو المتوقع' : 'Expected Growth'}</span>
                          <span className="font-medium text-green-600">+28%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{isRTL ? 'الإيرادات المتوقعة' : 'Revenue Target'}</span>
                          <span className="font-medium">{formatCurrency(3140000)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6 mt-6">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'الربح الإجمالي' : 'Gross Profit'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(data.financial.grossProfit)}</div>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <ArrowTrendingUpSolidIcon className="w-3 h-3 mr-1" />
                  +{formatPercentage(data.financial.profitMargin)} {isRTL ? 'هامش ربح' : 'margin'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'الربح الصافي' : 'Net Profit'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.financial.netProfit)}</div>
                <p className="text-xs text-blue-500 mt-1">
                  {formatPercentage((data.financial.netProfit / data.revenue.total) * 100)} {isRTL ? 'من الإيرادات' : 'of revenue'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي المصاريف' : 'Total Expenses'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.financial.expenses.total)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercentage((data.financial.expenses.total / data.revenue.total) * 100)} {isRTL ? 'من الإيرادات' : 'of revenue'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{isRTL ? 'التدفق النقدي' : 'Cash Flow'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(data.financial.cashFlow[data.financial.cashFlow.length - 1].net)}
                </div>
                <p className="text-xs text-purple-500 mt-1">
                  {isRTL ? 'صافي التدفق هذا الشهر' : 'Net flow this month'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'تحليل التدفق النقدي' : 'Cash Flow Analysis'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'مقارنة الإيرادات والمصاريف والتدفق النقدي الصافي' : 'Compare income, expenses, and net cash flow'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Chart
                  data={data.financial.cashFlow}
                  type="line"
                  title=""
                  xKey="month"
                  yKey="net"
                  color="#8B5CF6"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'توزيع المصاريف' : 'Expense Breakdown'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={data.financial.expenses.breakdown.map(exp => ({ name: exp.category, value: exp.amount }))}
                  type="pie"
                  title=""
                  height={300}
                  colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
                />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Financial Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'التحليل المالي التفصيلي' : 'Detailed Financial Analysis'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تحليل شامل للأداء المالي مع المؤشرات الرئيسية' : 'Comprehensive financial performance analysis with key metrics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'هوامش الربح' : 'Profit Margins'}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{isRTL ? 'هامش الربح الإجمالي' : 'Gross Profit Margin'}</span>
                        <span className="font-semibold text-green-600">{formatPercentage(data.financial.profitMargin)}</span>
                      </div>
                      <Progress value={data.financial.profitMargin} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{isRTL ? 'هامش الربح الصافي' : 'Net Profit Margin'}</span>
                        <span className="font-semibold text-blue-600">{formatPercentage((data.financial.netProfit / data.revenue.total) * 100)}</span>
                      </div>
                      <Progress value={(data.financial.netProfit / data.revenue.total) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{isRTL ? 'هامش التشغيل' : 'Operating Margin'}</span>
                        <span className="font-semibold text-purple-600">25.2%</span>
                      </div>
                      <Progress value={25.2} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'تفصيل المصاريف' : 'Expense Details'}</h3>
                  <div className="space-y-3">
                    {data.financial.expenses.breakdown.map((expense, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{expense.category}</h4>
                          <p className="text-sm text-gray-600">
                            {formatPercentage((expense.amount / data.financial.expenses.total) * 100)} {isRTL ? 'من إجمالي المصاريف' : 'of total'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-orange-600">{formatCurrency(expense.amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">{isRTL ? 'مؤشرات الأداء المالي' : 'Financial KPIs'}</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">3.2x</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'نسبة السيولة' : 'Current Ratio'}</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">45 days</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'متوسط فترة التحصيل' : 'Avg Collection Period'}</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">2.8x</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'معدل دوران المخزون' : 'Inventory Turnover'}</p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">15.8%</div>
                      <p className="text-sm text-gray-600">{isRTL ? 'عائد على الأصول' : 'Return on Assets'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}