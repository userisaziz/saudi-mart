import React, { useState } from 'react'
import { 
  ChartBarIcon, 
  DocumentCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  EyeIcon,
  ChartPieIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface RFQMetrics {
  totalRFQs: number
  activeRFQs: number
  completedRFQs: number
  cancelledRFQs: number
  totalValue: number
  averageValue: number
  averageResponseTime: number
  supplierParticipation: number
  successRate: number
  timeToCompletion: number
}

interface RFQTrend {
  period: string
  rfqCount: number
  totalValue: number
  averageSuppliers: number
  completionRate: number
}

interface CategoryAnalytics {
  category: string
  categoryAr: string
  rfqCount: number
  totalValue: number
  averageSuppliers: number
  successRate: number
  trend: 'up' | 'down' | 'stable'
}

interface SupplierAnalytics {
  supplierId: string
  supplierName: string
  supplierNameAr: string
  participationCount: number
  winRate: number
  averageScore: number
  totalValueWon: number
  responseTime: number
  rating: number
}

interface RiskAnalytics {
  category: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  count: number
  percentage: number
  description: string
}

const RFQAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'trends' | 'suppliers' | 'categories' | 'risks'>('overview')

  // Mock data
  const metrics: RFQMetrics = {
    totalRFQs: 145,
    activeRFQs: 23,
    completedRFQs: 98,
    cancelledRFQs: 24,
    totalValue: 45750000,
    averageValue: 315517,
    averageResponseTime: 3.2,
    supplierParticipation: 4.8,
    successRate: 67.6,
    timeToCompletion: 18.5
  }

  const trends: RFQTrend[] = [
    { period: 'Jan 2024', rfqCount: 18, totalValue: 5200000, averageSuppliers: 4.2, completionRate: 72 },
    { period: 'Feb 2024', rfqCount: 22, totalValue: 6800000, averageSuppliers: 5.1, completionRate: 68 },
    { period: 'Mar 2024', rfqCount: 19, totalValue: 4900000, averageSuppliers: 4.7, completionRate: 74 },
    { period: 'Apr 2024', rfqCount: 25, totalValue: 7200000, averageSuppliers: 5.3, completionRate: 65 },
    { period: 'May 2024', rfqCount: 21, totalValue: 5800000, averageSuppliers: 4.9, completionRate: 71 },
    { period: 'Jun 2024', rfqCount: 28, totalValue: 8400000, averageSuppliers: 5.8, completionRate: 69 }
  ]

  const categoryAnalytics: CategoryAnalytics[] = [
    {
      category: 'Office Supplies',
      categoryAr: 'مستلزمات المكاتب',
      rfqCount: 28,
      totalValue: 3200000,
      averageSuppliers: 6.2,
      successRate: 82,
      trend: 'up'
    },
    {
      category: 'IT Equipment',
      categoryAr: 'معدات تقنية المعلومات',
      rfqCount: 35,
      totalValue: 12500000,
      averageSuppliers: 4.8,
      successRate: 71,
      trend: 'stable'
    },
    {
      category: 'Construction Materials',
      categoryAr: 'مواد البناء',
      rfqCount: 18,
      totalValue: 8900000,
      averageSuppliers: 3.4,
      successRate: 65,
      trend: 'down'
    },
    {
      category: 'Professional Services',
      categoryAr: 'الخدمات المهنية',
      rfqCount: 22,
      totalValue: 5400000,
      averageSuppliers: 5.1,
      successRate: 78,
      trend: 'up'
    },
    {
      category: 'Manufacturing Equipment',
      categoryAr: 'معدات التصنيع',
      rfqCount: 15,
      totalValue: 15200000,
      averageSuppliers: 2.8,
      successRate: 58,
      trend: 'stable'
    }
  ]

  const supplierAnalytics: SupplierAnalytics[] = [
    {
      supplierId: 's1',
      supplierName: 'Al-Riyadh Office Solutions',
      supplierNameAr: 'حلول مكاتب الرياض',
      participationCount: 45,
      winRate: 28.9,
      averageScore: 87.3,
      totalValueWon: 4200000,
      responseTime: 2.1,
      rating: 4.6
    },
    {
      supplierId: 's2',
      supplierName: 'Tech Solutions Pro',
      supplierNameAr: 'حلول التقنية المحترفة',
      participationCount: 38,
      winRate: 31.6,
      averageScore: 89.1,
      totalValueWon: 6800000,
      responseTime: 1.8,
      rating: 4.8
    },
    {
      supplierId: 's3',
      supplierName: 'Construction Masters',
      supplierNameAr: 'أساتذة البناء',
      participationCount: 22,
      winRate: 36.4,
      averageScore: 91.2,
      totalValueWon: 8900000,
      responseTime: 3.2,
      rating: 4.7
    },
    {
      supplierId: 's4',
      supplierName: 'Industrial Equipment Co.',
      supplierNameAr: 'شركة المعدات الصناعية',
      participationCount: 28,
      winRate: 25.0,
      averageScore: 83.5,
      totalValueWon: 3200000,
      responseTime: 4.1,
      rating: 4.3
    }
  ]

  const riskAnalytics: RiskAnalytics[] = [
    {
      category: 'High Value RFQs',
      riskLevel: 'high',
      count: 8,
      percentage: 5.5,
      description: 'RFQs with value exceeding 1M SAR requiring additional oversight'
    },
    {
      category: 'Limited Supplier Pool',
      riskLevel: 'medium',
      count: 15,
      percentage: 10.3,
      description: 'RFQs with fewer than 3 qualified suppliers'
    },
    {
      category: 'Overdue Evaluations',
      riskLevel: 'critical',
      count: 3,
      percentage: 2.1,
      description: 'RFQ evaluations past their deadline'
    },
    {
      category: 'Single Source',
      riskLevel: 'high',
      count: 6,
      percentage: 4.1,
      description: 'RFQs with only one responsive supplier'
    },
    {
      category: 'Repeat Cancellations',
      riskLevel: 'medium',
      count: 12,
      percentage: 8.3,
      description: 'Suppliers with multiple cancelled bids'
    }
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDownIcon className="h-4 w-4 text-red-500" />
      default: return <span className="h-4 w-4 text-gray-400">→</span>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">RFQ Analytics & Reports</h1>
          <p className="text-sm text-gray-600">تحليلات وتقارير طلبات عروض الأسعار</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom range</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', nameAr: 'نظرة عامة', icon: ChartBarIcon },
              { id: 'trends', name: 'Trends', nameAr: 'الاتجاهات', icon: TrendingUpIcon },
              { id: 'suppliers', name: 'Suppliers', nameAr: 'الموردين', icon: UserGroupIcon },
              { id: 'categories', name: 'Categories', nameAr: 'الفئات', icon: ChartPieIcon },
              { id: 'risks', name: 'Risk Analysis', nameAr: 'تحليل المخاطر', icon: ExclamationTriangleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnalyticsView(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  analyticsView === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                <span className="text-xs text-gray-400 block">{tab.nameAr}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {analyticsView === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentCheckIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total RFQs</p>
                      <p className="text-2xl font-semibold text-gray-900">{metrics.totalRFQs}</p>
                      <p className="text-xs text-gray-600">{metrics.activeRFQs} active</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Value</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
                      <p className="text-xs text-gray-600">Avg: {formatCurrency(metrics.averageValue)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserGroupIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Supplier Participation</p>
                      <p className="text-2xl font-semibold text-gray-900">{metrics.supplierParticipation}</p>
                      <p className="text-xs text-gray-600">Average per RFQ</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Success Rate</p>
                      <p className="text-2xl font-semibold text-gray-900">{metrics.successRate}%</p>
                      <p className="text-xs text-gray-600">{metrics.timeToCompletion} days avg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">RFQ Status Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(metrics.completedRFQs / metrics.totalRFQs) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{metrics.completedRFQs}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(metrics.activeRFQs / metrics.totalRFQs) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{metrics.activeRFQs}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cancelled</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(metrics.cancelledRFQs / metrics.totalRFQs) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{metrics.cancelledRFQs}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="text-sm font-medium">{metrics.averageResponseTime} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Time to Completion</span>
                      <span className="text-sm font-medium">{metrics.timeToCompletion} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Supplier Participation</span>
                      <span className="text-sm font-medium">{metrics.supplierParticipation} avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-green-600">{metrics.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {analyticsView === 'trends' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">RFQ Trends Over Time</h3>
              
              {/* Trend Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">RFQ Volume</h4>
                  <div className="space-y-2">
                    {trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{trend.period}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(trend.rfqCount / 30) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8">{trend.rfqCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Total Value</h4>
                  <div className="space-y-2">
                    {trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{trend.period}</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(trend.totalValue / 10000000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{formatCurrency(trend.totalValue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Completion Rate Trend */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Completion Rate Trend</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Period</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">RFQs</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Value</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Avg Suppliers</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.map((trend, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 text-sm text-gray-900">{trend.period}</td>
                          <td className="py-2 text-sm text-gray-900">{trend.rfqCount}</td>
                          <td className="py-2 text-sm text-gray-900">{formatCurrency(trend.totalValue)}</td>
                          <td className="py-2 text-sm text-gray-900">{trend.averageSuppliers}</td>
                          <td className="py-2 text-sm">
                            <span className={`font-medium ${trend.completionRate >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                              {trend.completionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {analyticsView === 'categories' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Category Performance Analysis</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RFQ Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Suppliers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Success Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryAnalytics.map((category, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.category}</div>
                            <div className="text-sm text-gray-500">{category.categoryAr}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.rfqCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.totalValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.averageSuppliers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${category.successRate >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                            {category.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTrendIcon(category.trend)}
                            <span className="ml-1 text-sm text-gray-600 capitalize">{category.trend}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {analyticsView === 'suppliers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Top Performing Suppliers</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">By Win Rate</h4>
                  <div className="space-y-3">
                    {supplierAnalytics
                      .sort((a, b) => b.winRate - a.winRate)
                      .slice(0, 5)
                      .map((supplier, index) => (
                      <div key={supplier.supplierId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{supplier.supplierName}</div>
                            <div className="text-xs text-gray-500">{supplier.participationCount} participations</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">{supplier.winRate}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">By Total Value Won</h4>
                  <div className="space-y-3">
                    {supplierAnalytics
                      .sort((a, b) => b.totalValueWon - a.totalValueWon)
                      .slice(0, 5)
                      .map((supplier, index) => (
                      <div key={supplier.supplierId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{supplier.supplierName}</div>
                            <div className="text-xs text-gray-500">Score: {supplier.averageScore}</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{formatCurrency(supplier.totalValueWon)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Supplier Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Won
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {supplierAnalytics.map((supplier) => (
                      <tr key={supplier.supplierId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{supplier.supplierName}</div>
                            <div className="text-sm text-gray-500">{supplier.supplierNameAr}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {supplier.participationCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">{supplier.winRate}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {supplier.averageScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(supplier.totalValueWon)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {supplier.responseTime} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{supplier.rating}</span>
                            <span className="ml-1 text-yellow-400">★</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {analyticsView === 'risks' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Risk Analysis</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {riskAnalytics.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{risk.category}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(risk.riskLevel)}`}>
                        {risk.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{risk.count}</span>
                      <span className="text-sm text-gray-500">{risk.percentage}% of total</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Risk Summary */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Risk Distribution</h4>
                <div className="space-y-3">
                  {['critical', 'high', 'medium', 'low'].map((level) => {
                    const riskCount = riskAnalytics.filter(r => r.riskLevel === level).reduce((sum, r) => sum + r.count, 0)
                    const totalRisks = riskAnalytics.reduce((sum, r) => sum + r.count, 0)
                    const percentage = totalRisks > 0 ? (riskCount / totalRisks) * 100 : 0
                    
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(level)}`}>
                          {level.toUpperCase()}
                        </span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${
                                level === 'critical' ? 'bg-red-500' :
                                level === 'high' ? 'bg-orange-500' :
                                level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{riskCount} ({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RFQAnalytics