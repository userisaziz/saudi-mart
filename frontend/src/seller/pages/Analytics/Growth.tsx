import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Chart } from '../../components/ui/Chart';
import { MetricsCard } from '../../components/ui/MetricsCard';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export const AnalyticsGrowth: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const growthMetrics = {
    revenue: {
      current: 125000,
      previous: 98000,
      growth: 27.6
    },
    orders: {
      current: 486,
      previous: 412,
      growth: 18.0
    },
    customers: {
      current: 328,
      previous: 295,
      growth: 11.2
    },
    avgOrderValue: {
      current: 257,
      previous: 238,
      growth: 8.0
    }
  };

  const revenueGrowthData = [
    { name: 'Jan', current: 65000, previous: 58000 },
    { name: 'Feb', current: 78000, previous: 62000 },
    { name: 'Mar', current: 125000, previous: 98000 },
    { name: 'Apr', current: 142000, previous: 105000 },
    { name: 'May', current: 165000, previous: 118000 },
    { name: 'Jun', current: 188000, previous: 142000 },
  ];

  const ordersGrowthData = [
    { name: 'Jan', current: 145, previous: 132 },
    { name: 'Feb', current: 198, previous: 156 },
    { name: 'Mar', current: 486, previous: 412 },
    { name: 'Apr', current: 523, previous: 445 },
    { name: 'May', current: 578, previous: 467 },
    { name: 'Jun', current: 642, previous: 512 },
  ];

  const customerAcquisitionData = [
    { name: 'Week 1', newCustomers: 23, returningCustomers: 45 },
    { name: 'Week 2', newCustomers: 31, returningCustomers: 52 },
    { name: 'Week 3', newCustomers: 28, returningCustomers: 48 },
    { name: 'Week 4', newCustomers: 35, returningCustomers: 58 },
  ];

  const geographicGrowthData = [
    { region: 'North America', growth: 32.5, revenue: 75000 },
    { region: 'Europe', growth: 28.2, revenue: 45000 },
    { region: 'Asia Pacific', growth: 18.7, revenue: 25000 },
    { region: 'Latin America', growth: 15.3, revenue: 15000 },
    { region: 'Middle East', growth: 12.1, revenue: 8000 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('analytics.growth.title', 'Growth Analytics')}</h1>
          <p className="text-gray-600">{t('analytics.growth.subtitle', 'Track your business growth and performance trends')}</p>
        </div>
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">{t('analytics.timeRange.7d', 'Last 7 days')}</option>
              <option value="30d">{t('analytics.timeRange.30d', 'Last 30 days')}</option>
              <option value="90d">{t('analytics.timeRange.90d', 'Last 90 days')}</option>
              <option value="1y">{t('analytics.timeRange.1y', 'Last year')}</option>
            </select>
          </div>
        </div>

        {/* Growth Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title={t('analytics.growth.revenueGrowth', 'Revenue Growth')}
            value={formatCurrency(growthMetrics.revenue.current)}
            change={growthMetrics.revenue.growth}
            changeType="increase"
            icon={CurrencyDollarIcon}
            iconColor="text-green-600"
            format="currency"
          />
          <MetricsCard
            title={t('analytics.growth.ordersGrowth', 'Orders Growth')}
            value={growthMetrics.orders.current}
            change={growthMetrics.orders.growth}
            changeType="increase"
            icon={ShoppingBagIcon}
            iconColor="text-blue-600"
          />
          <MetricsCard
            title={t('analytics.growth.customerGrowth', 'Customer Growth')}
            value={growthMetrics.customers.current}
            change={growthMetrics.customers.growth}
            changeType="increase"
            icon={UserGroupIcon}
            iconColor="text-purple-600"
          />
          <MetricsCard
            title={t('analytics.growth.aovGrowth', 'AOV Growth')}
            value={formatCurrency(growthMetrics.avgOrderValue.current)}
            change={growthMetrics.avgOrderValue.growth}
            changeType="increase"
            icon={ChartBarIcon}
            iconColor="text-orange-600"
            format="currency"
          />
        </div>

        {/* Revenue and Orders Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.growth.revenueGrowthTrend', 'Revenue Growth Trend')}</h3>
            <Chart
              data={revenueGrowthData}
              type="line"
              xKey="name"
              yKey="current"
              secondaryYKey="previous"
              color="#10B981"
              secondaryColor="#6B7280"
              height={300}
            />
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{t('analytics.growth.currentPeriod', 'Current Period')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-600">{t('analytics.growth.previousPeriod', 'Previous Period')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.growth.ordersGrowthTrend', 'Orders Growth Trend')}</h3>
            <Chart
              data={ordersGrowthData}
              type="bar"
              xKey="name"
              yKey="current"
              color="#3B82F6"
              height={300}
            />
          </div>
        </div>

        {/* Customer Acquisition and Geographic Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.growth.customerAcquisition', 'Customer Acquisition')}</h3>
            <Chart
              data={customerAcquisitionData}
              type="area"
              xKey="name"
              yKey="newCustomers"
              secondaryYKey="returningCustomers"
              color="#8B5CF6"
              secondaryColor="#10B981"
              height={300}
            />
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">{t('analytics.growth.newCustomers', 'New Customers')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{t('analytics.growth.returningCustomers', 'Returning Customers')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.growth.geographicGrowth', 'Geographic Growth')}</h3>
            <div className="space-y-4">
              {geographicGrowthData.map((item) => (
                <div key={item.region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.region}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(item.revenue)} {t('analytics.growth.revenue', 'revenue')}</div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      item.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.growth >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span>{formatGrowth(item.growth)}</span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(item.growth, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Insights */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('analytics.growth.insights', 'Growth Insights & Recommendations')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">{t('analytics.growth.strongPerformance', 'Strong Performance')}</span>
              </div>
              <p className="text-sm text-green-700">
                {t('analytics.growth.strongPerformanceDesc', 'Revenue growth of {growth} is excellent. Continue current marketing strategies.').replace('{growth}', formatGrowth(growthMetrics.revenue.growth))}
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">{t('analytics.growth.customerAcquisition', 'Customer Acquisition')}</span>
              </div>
              <p className="text-sm text-blue-700">
                {t('analytics.growth.customerAcquisitionDesc', 'Focus on customer retention strategies to maintain the {growth} growth rate.').replace('{growth}', formatGrowth(growthMetrics.customers.growth))}
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBarIcon className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">{t('analytics.growth.aovOptimization', 'AOV Optimization')}</span>
              </div>
              <p className="text-sm text-orange-700">
                {t('analytics.growth.aovOptimizationDesc', 'Consider upselling strategies to further improve the average order value growth.')}
              </p>
            </div>
          </div>
        </div>

        {/* Growth Comparison Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.growth.periodComparison', 'Period Comparison')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.growth.metric', 'Metric')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.growth.currentPeriod', 'Current Period')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analytics.growth.previousPeriod', 'Previous Period')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {t('analytics.growth.totalRevenue', 'Total Revenue')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(growthMetrics.revenue.current)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(growthMetrics.revenue.previous)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {formatGrowth(growthMetrics.revenue.growth)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {t('analytics.growth.totalOrders', 'Total Orders')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {growthMetrics.orders.current.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {growthMetrics.orders.previous.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {formatGrowth(growthMetrics.orders.growth)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {t('analytics.growth.newCustomersTable', 'New Customers')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {growthMetrics.customers.current.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {growthMetrics.customers.previous.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {formatGrowth(growthMetrics.customers.growth)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsGrowth;