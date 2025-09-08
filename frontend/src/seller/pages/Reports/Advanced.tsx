import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Chart } from '../../components/ui/Chart';
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PrinterIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

interface ReportData {
  id: string;
  name: string;
  category: 'sales' | 'products' | 'customers' | 'orders' | 'inventory' | 'performance';
  type: 'chart' | 'table' | 'summary';
  timeRange: string;
  data: any[];
  generatedAt: string;
  status: 'ready' | 'generating' | 'error';
}

const mockReportData: ReportData[] = [
  {
    id: '1',
    name: 'Sales Performance Analysis',
    category: 'sales',
    type: 'chart',
    timeRange: 'Last 30 days',
    data: [
      { name: 'Week 1', revenue: 25000, orders: 45, customers: 32 },
      { name: 'Week 2', revenue: 32000, orders: 58, customers: 41 },
      { name: 'Week 3', revenue: 28000, orders: 52, customers: 38 },
      { name: 'Week 4', revenue: 35000, orders: 62, customers: 47 },
    ],
    generatedAt: '2024-03-19T10:30:00Z',
    status: 'ready',
  },
  {
    id: '2',
    name: 'Top Products by Revenue',
    category: 'products',
    type: 'table',
    timeRange: 'Last 90 days',
    data: [
      { product: 'Industrial Steel Pipes', revenue: 125000, quantity: 280, margin: 32.5 },
      { product: 'LED Panel Systems', revenue: 89000, quantity: 1200, margin: 28.7 },
      { product: 'Hydraulic Components', revenue: 76000, quantity: 95, margin: 41.2 },
      { product: 'Safety Equipment', revenue: 54000, quantity: 450, margin: 35.8 },
      { product: 'Electric Motors', revenue: 42000, quantity: 68, margin: 38.9 },
    ],
    generatedAt: '2024-03-19T09:15:00Z',
    status: 'ready',
  },
  {
    id: '3',
    name: 'Customer Segmentation Report',
    category: 'customers',
    type: 'summary',
    timeRange: 'Current period',
    data: [
      { segment: 'VIP Customers', count: 23, revenue: 285000, percentage: 45.2 },
      { segment: 'Regular Customers', count: 156, revenue: 198000, percentage: 31.4 },
      { segment: 'New Customers', count: 89, revenue: 87000, percentage: 13.8 },
      { segment: 'Inactive Customers', count: 67, revenue: 61000, percentage: 9.6 },
    ],
    generatedAt: '2024-03-19T08:45:00Z',
    status: 'ready',
  },
];

const AdvancedReports: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [reportFilters, setReportFilters] = useState({
    category: 'all',
    timeRange: '30d',
    type: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Real-time metrics
  const realTimeMetrics = {
    todayRevenue: 12450,
    todayOrders: 23,
    activeUsers: 156,
    conversionRate: 3.2,
    averageOrderValue: 542,
    inventoryTurnover: 4.8,
    customerSatisfaction: 4.7,
    returnRate: 1.3,
  };

  // Performance indicators
  const performanceData = [
    { 
      metric: 'Revenue Growth', 
      value: '+12.5%', 
      trend: 'up', 
      comparison: 'vs last month',
      status: 'positive'
    },
    { 
      metric: 'Order Volume', 
      value: '+8.3%', 
      trend: 'up', 
      comparison: 'vs last month',
      status: 'positive'
    },
    { 
      metric: 'Customer Acquisition', 
      value: '-2.1%', 
      trend: 'down', 
      comparison: 'vs last month',
      status: 'negative'
    },
    { 
      metric: 'Average Order Value', 
      value: '+4.7%', 
      trend: 'up', 
      comparison: 'vs last month',
      status: 'positive'
    },
  ];

  const filteredReports = useMemo(() => {
    let filtered = mockReportData;

    if (reportFilters.category !== 'all') {
      filtered = filtered.filter(report => report.category === reportFilters.category);
    }

    if (reportFilters.type !== 'all') {
      filtered = filtered.filter(report => report.type === reportFilters.type);
    }

    return filtered;
  }, [reportFilters]);

  const handleGenerateReport = async (reportType: string) => {
    setGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(false);
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Implement export functionality
    console.log(`Exporting report as ${format}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales':
        return CurrencyDollarIcon;
      case 'products':
        return ShoppingBagIcon;
      case 'customers':
        return UserGroupIcon;
      case 'orders':
        return DocumentTextIcon;
      case 'inventory':
        return TruckIcon;
      case 'performance':
        return ChartBarIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive business intelligence and performance analytics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={reportFilters.timeRange}
            onChange={(e) => setReportFilters({...reportFilters, timeRange: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={() => handleGenerateReport('custom')}
            disabled={generatingReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {generatingReport ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <DocumentTextIcon className="w-4 h-4" />
            )}
            Generate Report
          </button>
        </div>
      </div>

      {/* Real-time Dashboard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Real-time Performance</h2>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live data • Updated now
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Today's Revenue</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(realTimeMetrics.todayRevenue)}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Today's Orders</p>
                <p className="text-2xl font-bold text-green-900">{realTimeMetrics.todayOrders}</p>
              </div>
              <ShoppingBagIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Users</p>
                <p className="text-2xl font-bold text-purple-900">{realTimeMetrics.activeUsers}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-orange-900">{realTimeMetrics.conversionRate}%</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceData.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.metric}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-lg font-bold ${
                      item.status === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.value}
                    </span>
                    {item.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.comparison}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
            <select
              value={reportFilters.category}
              onChange={(e) => setReportFilters({...reportFilters, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="sales">Sales</option>
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="orders">Orders</option>
              <option value="inventory">Inventory</option>
              <option value="performance">Performance</option>
            </select>

            <select
              value={reportFilters.type}
              onChange={(e) => setReportFilters({...reportFilters, type: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="chart">Charts</option>
              <option value="table">Tables</option>
              <option value="summary">Summaries</option>
            </select>
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const IconComponent = getCategoryIcon(report.category);
            return (
              <div 
                key={report.id} 
                className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.timeRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'ready' ? 'bg-green-100 text-green-800' :
                      report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status === 'ready' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                      {report.status === 'generating' && <ClockIcon className="w-3 h-3 mr-1" />}
                      {report.status === 'error' && <ExclamationTriangleIcon className="w-3 h-3 mr-1" />}
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Generated: {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                  
                  {/* Preview based on report type */}
                  {report.type === 'chart' && (
                    <div className="h-32 bg-white rounded border flex items-center justify-center">
                      <ChartBarIcon className="w-8 h-8 text-gray-300" />
                      <span className="text-gray-500 ml-2">Chart Preview</span>
                    </div>
                  )}
                  
                  {report.type === 'table' && (
                    <div className="bg-white rounded border p-3">
                      <div className="space-y-2">
                        {report.data.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-gray-600 truncate">{Object.values(item)[0]}</span>
                            <span className="font-medium">{formatCurrency(Object.values(item)[1] as number)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.type === 'summary' && (
                    <div className="bg-white rounded border p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Total Items</span>
                          <div className="font-medium">{report.data.length}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Categories</span>
                          <div className="font-medium">{new Set(report.data.map(item => Object.keys(item)[0])).size}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    report.category === 'sales' ? 'bg-green-100 text-green-800' :
                    report.category === 'products' ? 'bg-blue-100 text-blue-800' :
                    report.category === 'customers' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.category}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => handleExportReport('pdf')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Export to PDF</h3>
              <p className="text-sm text-gray-500">Download formatted report</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleExportReport('excel')}
          className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Export to Excel</h3>
              <p className="text-sm text-gray-500">Download spreadsheet</p>
            </div>
          </div>
        </button>

        <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Schedule Reports</h3>
              <p className="text-sm text-gray-500">Automate report generation</p>
            </div>
          </div>
        </button>

        <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShareIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Share Dashboard</h3>
              <p className="text-sm text-gray-500">Create shareable links</p>
            </div>
          </div>
        </button>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReport.name}</h2>
                  <p className="text-gray-600">{selectedReport.timeRange} • Generated {new Date(selectedReport.generatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleExportReport('pdf')}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Export
                  </button>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Report Content */}
              <div className="space-y-6">
                {selectedReport.type === 'chart' && (
                  <Chart
                    data={selectedReport.data}
                    type="bar"
                    title={selectedReport.name}
                    xKey="name"
                    yKey="revenue"
                    color="#3B82F6"
                    height={400}
                  />
                )}
                
                {selectedReport.type === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(selectedReport.data[0] || {}).map(key => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedReport.data.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4 text-sm text-gray-900">
                                {typeof value === 'number' && cellIndex > 0 ? formatNumber(value) : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {selectedReport.type === 'summary' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedReport.data.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-medium text-gray-900 mb-2">{item.segment}</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-500">Count:</span>
                            <span className="ml-2 font-semibold">{formatNumber(item.count)}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Revenue:</span>
                            <span className="ml-2 font-semibold">{formatCurrency(item.revenue)}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Share:</span>
                            <span className="ml-2 font-semibold">{item.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReports;