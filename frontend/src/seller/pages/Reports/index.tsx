import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  DocumentChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Import shared UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface Report {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'customers' | 'products' | 'financial' | 'operational';
  lastGenerated?: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  size?: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'ready' | 'generating' | 'scheduled';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  category: string;
  estimatedTime: string;
  popularity: number;
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive sales analysis including revenue, orders, and performance trends',
    category: 'sales',
    lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    frequency: 'monthly',
    size: '2.4 MB',
    format: 'pdf',
    status: 'ready'
  },
  {
    id: '2',
    name: 'Customer Acquisition Report',
    description: 'Analysis of new customers, retention rates, and customer journey',
    category: 'customers',
    lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    frequency: 'weekly',
    size: '1.8 MB',
    format: 'excel',
    status: 'ready'
  },
  {
    id: '3',
    name: 'Inventory Status Report',
    description: 'Current stock levels, low stock alerts, and inventory turnover',
    category: 'products',
    frequency: 'daily',
    format: 'csv',
    status: 'generating'
  },
  {
    id: '4',
    name: 'Financial Summary',
    description: 'Revenue, expenses, profit margins, and payment status overview',
    category: 'financial',
    lastGenerated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    frequency: 'quarterly',
    size: '3.1 MB',
    format: 'pdf',
    status: 'ready'
  },
  {
    id: '5',
    name: 'Performance Dashboard Export',
    description: 'Complete dashboard metrics and KPIs for executive review',
    category: 'operational',
    frequency: 'weekly',
    format: 'excel',
    status: 'scheduled'
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Sales Performance Analysis',
    description: 'Detailed breakdown of sales by product, region, and time period',
    metrics: ['Revenue', 'Units Sold', 'Conversion Rate', 'Average Order Value'],
    category: 'Sales',
    estimatedTime: '3-5 minutes',
    popularity: 95
  },
  {
    id: '2',
    name: 'Customer Behavior Insights',
    description: 'Customer purchasing patterns, preferences, and loyalty metrics',
    metrics: ['Customer Lifetime Value', 'Purchase Frequency', 'Churn Rate', 'Segmentation'],
    category: 'Customers',
    estimatedTime: '5-7 minutes',
    popularity: 87
  },
  {
    id: '3',
    name: 'Product Performance Matrix',
    description: 'Individual product analysis with profitability and demand insights',
    metrics: ['Product Revenue', 'Profit Margin', 'Stock Turnover', 'Return Rate'],
    category: 'Products',
    estimatedTime: '4-6 minutes',
    popularity: 82
  },
  {
    id: '4',
    name: 'Financial Health Check',
    description: 'Complete financial overview with cash flow and expense analysis',
    metrics: ['Cash Flow', 'Profit & Loss', 'Outstanding Payments', 'Cost Analysis'],
    category: 'Financial',
    estimatedTime: '6-8 minutes',
    popularity: 78
  },
  {
    id: '5',
    name: 'Lead Conversion Analysis',
    description: 'Lead funnel performance and conversion optimization insights',
    metrics: ['Lead Sources', 'Conversion Rates', 'Sales Cycle', 'ROI by Channel'],
    category: 'Marketing',
    estimatedTime: '4-5 minutes',
    popularity: 91
  },
  {
    id: '6',
    name: 'Operational Efficiency Report',
    description: 'Process efficiency, response times, and operational KPIs',
    metrics: ['Response Time', 'Order Processing', 'Issue Resolution', 'Efficiency Score'],
    category: 'Operations',
    estimatedTime: '3-4 minutes',
    popularity: 74
  }
];

export const Reports: React.FC = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('existing');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [generating, setGenerating] = useState<string[]>([]);

  const getCategoryIcon = (category: Report['category'] | string) => {
    switch (category.toLowerCase()) {
      case 'sales':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'customers':
        return <UserGroupIcon className="w-5 h-5" />;
      case 'products':
        return <ShoppingBagIcon className="w-5 h-5" />;
      case 'financial':
        return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'operational':
      case 'operations':
        return <ArrowTrendingUpIcon className="w-5 h-5" />;
      default:
        return <DocumentChartBarIcon className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: Report['category'] | string) => {
    switch (category.toLowerCase()) {
      case 'sales':
        return 'text-blue-600 bg-blue-100';
      case 'customers':
        return 'text-green-600 bg-green-100';
      case 'products':
        return 'text-purple-600 bg-purple-100';
      case 'financial':
        return 'text-emerald-600 bg-emerald-100';
      case 'operational':
      case 'operations':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">{isRTL ? 'جاهز' : 'Ready'}</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800">{isRTL ? 'قيد الإنشاء' : 'Generating'}</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">{isRTL ? 'مجدول' : 'Scheduled'}</Badge>;
      default:
        return null;
    }
  };

  const generateReport = async (reportId: string) => {
    setGenerating(prev => [...prev, reportId]);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(prev => prev.filter(id => id !== reportId));
    }, 3000);
  };

  const downloadReport = (report: Report) => {
    // Simulate download
    console.log(`Downloading ${report.name}`);
  };

  const filteredReports = mockReports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  const filteredTemplates = reportTemplates.filter(template =>
    selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DocumentChartBarIcon className="w-7 h-7 mr-3 text-blue-600" />
            {isRTL ? 'التقارير المتقدمة' : 'Advanced Reports'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL 
              ? 'إنشاء وإدارة التقارير التفصيلية لأعمالك' 
              : 'Generate and manage detailed business reports and analytics'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{isRTL ? 'جدولة تقرير' : 'Schedule Report'}</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
            <DocumentChartBarIcon className="w-4 h-4" />
            <span>{isRTL ? 'تقرير جديد' : 'New Report'}</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'التقارير المكتملة' : 'Completed Reports'}</p>
                <p className="text-2xl font-semibold">{mockReports.filter(r => r.status === 'ready').length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DocumentChartBarIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'قيد الإنشاء' : 'Generating'}</p>
                <p className="text-2xl font-semibold text-yellow-600">{mockReports.filter(r => r.status === 'generating').length}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'مجدولة' : 'Scheduled'}</p>
                <p className="text-2xl font-semibold text-blue-600">{mockReports.filter(r => r.status === 'scheduled').length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'هذا الشهر' : 'This Month'}</p>
                <p className="text-2xl font-semibold text-purple-600">24</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <ArrowDownTrayIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="existing" className="flex items-center space-x-2">
            <DocumentChartBarIcon className="w-4 h-4" />
            <span>{isRTL ? 'التقارير الموجودة' : 'Existing Reports'}</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <ChartBarIcon className="w-4 h-4" />
            <span>{isRTL ? 'قوالب التقارير' : 'Report Templates'}</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4" />
            <span>{isRTL ? 'تقرير مخصص' : 'Custom Report'}</span>
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {isRTL ? 'تصفية:' : 'Filter:'}
                </span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                  <SelectItem value="sales">{isRTL ? 'المبيعات' : 'Sales'}</SelectItem>
                  <SelectItem value="customers">{isRTL ? 'العملاء' : 'Customers'}</SelectItem>
                  <SelectItem value="products">{isRTL ? 'المنتجات' : 'Products'}</SelectItem>
                  <SelectItem value="financial">{isRTL ? 'مالي' : 'Financial'}</SelectItem>
                  <SelectItem value="operational">{isRTL ? 'تشغيلي' : 'Operational'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</SelectItem>
                  <SelectItem value="last-30-days">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</SelectItem>
                  <SelectItem value="last-90-days">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</SelectItem>
                  <SelectItem value="last-year">{isRTL ? 'آخر سنة' : 'Last year'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Existing Reports */}
        <TabsContent value="existing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-full ${getCategoryColor(report.category)}`}>
                      {getCategoryIcon(report.category)}
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{isRTL ? 'التكرار:' : 'Frequency:'}</span>
                    <span className="capitalize">
                      {report.frequency === 'daily' ? (isRTL ? 'يومي' : 'Daily') :
                       report.frequency === 'weekly' ? (isRTL ? 'أسبوعي' : 'Weekly') :
                       report.frequency === 'monthly' ? (isRTL ? 'شهري' : 'Monthly') :
                       (isRTL ? 'ربع سنوي' : 'Quarterly')}
                    </span>
                  </div>
                  
                  {report.lastGenerated && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{isRTL ? 'آخر إنشاء:' : 'Last Generated:'}</span>
                      <span>
                        {report.lastGenerated.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {report.size && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{isRTL ? 'الحجم:' : 'Size:'}</span>
                      <span>{report.size}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{isRTL ? 'التنسيق:' : 'Format:'}</span>
                    <Badge variant="outline" className="text-xs">
                      {report.format.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    {report.status === 'ready' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center space-x-1"
                          onClick={() => downloadReport(report)}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          <span>{isRTL ? 'تحميل' : 'Download'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateReport(report.id)}
                          disabled={generating.includes(report.id)}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </>
                    ) : report.status === 'generating' ? (
                      <Button disabled size="sm" className="flex-1">
                        <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                        {isRTL ? 'قيد الإنشاء...' : 'Generating...'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => generateReport(report.id)}
                        disabled={generating.includes(report.id)}
                      >
                        {generating.includes(report.id) ? (
                          <>
                            <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                            {isRTL ? 'قيد الإنشاء...' : 'Generating...'}
                          </>
                        ) : (
                          <>
                            <DocumentChartBarIcon className="w-4 h-4 mr-2" />
                            {isRTL ? 'إنشاء' : 'Generate'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Report Templates */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-full ${getCategoryColor(template.category)}`}>
                      {getCategoryIcon(template.category)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-600">{template.popularity}%</span>
                      <div className="text-yellow-400">
                        {'★'.repeat(Math.ceil(template.popularity / 20))}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">
                      {isRTL ? 'المقاييس المضمنة:' : 'Included Metrics:'}
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.metrics.slice(0, 3).map((metric) => (
                        <Badge key={metric} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                      {template.metrics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.metrics.length - 3} {isRTL ? 'أكثر' : 'more'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{isRTL ? 'وقت الإنشاء المتوقع:' : 'Est. Generation Time:'}</span>
                    <span>{template.estimatedTime}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{isRTL ? 'الفئة:' : 'Category:'}</span>
                    <span>{template.category}</span>
                  </div>

                  <Button className="w-full mt-3">
                    {isRTL ? 'استخدام القالب' : 'Use Template'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Report Builder */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إنشاء تقرير مخصص' : 'Create Custom Report'}</CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'اختر المقاييس والفلاتر المطلوبة لإنشاء تقرير مخصص'
                  : 'Select the metrics and filters needed to create a custom report'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {isRTL ? 'اسم التقرير' : 'Report Name'}
                  </Label>
                  <Input 
                    placeholder={isRTL ? 'أدخل اسم التقرير' : 'Enter report name'} 
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {isRTL ? 'نوع التقرير' : 'Report Type'}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر نوع التقرير' : 'Select report type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">{isRTL ? 'تقرير المبيعات' : 'Sales Report'}</SelectItem>
                      <SelectItem value="customers">{isRTL ? 'تقرير العملاء' : 'Customer Report'}</SelectItem>
                      <SelectItem value="products">{isRTL ? 'تقرير المنتجات' : 'Product Report'}</SelectItem>
                      <SelectItem value="financial">{isRTL ? 'تقرير مالي' : 'Financial Report'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  {isRTL ? 'المقاييس المطلوبة' : 'Required Metrics'}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    'Revenue', 'Orders', 'Customers', 'Conversion Rate',
                    'Average Order Value', 'Profit Margin', 'Return Rate', 'Customer Lifetime Value'
                  ].map((metric) => (
                    <label key={metric} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {isRTL ? 'الفترة الزمنية' : 'Time Period'}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">{isRTL ? 'آخر 7 أيام' : 'Last 7 days'}</SelectItem>
                      <SelectItem value="last-30-days">{isRTL ? 'آخر 30 يوم' : 'Last 30 days'}</SelectItem>
                      <SelectItem value="last-90-days">{isRTL ? 'آخر 90 يوم' : 'Last 90 days'}</SelectItem>
                      <SelectItem value="custom">{isRTL ? 'مخصص' : 'Custom'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {isRTL ? 'تنسيق التصدير' : 'Export Format'}
                  </Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    {isRTL ? 'تكرار الإنشاء' : 'Generation Frequency'}
                  </Label>
                  <Select defaultValue="once">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">{isRTL ? 'مرة واحدة' : 'Once'}</SelectItem>
                      <SelectItem value="daily">{isRTL ? 'يومي' : 'Daily'}</SelectItem>
                      <SelectItem value="weekly">{isRTL ? 'أسبوعي' : 'Weekly'}</SelectItem>
                      <SelectItem value="monthly">{isRTL ? 'شهري' : 'Monthly'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline">
                  {isRTL ? 'معاينة' : 'Preview'}
                </Button>
                <Button>
                  {isRTL ? 'إنشاء التقرير' : 'Generate Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;