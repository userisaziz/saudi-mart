import React, { useState, useEffect } from 'react';
import { RealtimeDashboard } from '../components/ui/RealtimeDashboard';
import { MetricsCard } from '../components/ui/MetricsCard';
import { Chart } from '../components/ui/Chart';
import { useSellerStore } from '../stores/seller-store';
import { useLanguage } from '@/shared/contexts/LanguageContext';
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
  const [viewMode, setViewMode] = useState<'realtime' | 'classic'>('realtime');
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

        {/* Quick Stats and Alerts */}
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