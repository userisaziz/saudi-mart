import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  ShoppingBag,
  DollarSign,
  Clock,
  Star,
  Target,
  Award,
  Filter,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Chart } from './Chart';

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  customerSince: string;
  segment: 'vip' | 'regular' | 'new' | 'at_risk';
  satisfaction: number;
  avatar?: string;
  notes: string;
}

interface CustomerSegment {
  segment: string;
  segmentAr: string;
  count: number;
  revenue: number;
  percentage: number;
  growth: number;
  color: string;
}

export const CustomerInsights: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState('90d');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('totalSpent');

  // Mock customer data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Ahmed Al-Mahmoud',
      company: 'Saudi Industrial Corp',
      email: 'ahmed@saudicorp.sa',
      phone: '+966501234567',
      location: 'Riyadh, Saudi Arabia',
      totalOrders: 24,
      totalSpent: 125000,
      averageOrderValue: 5208,
      lastOrderDate: '2024-01-15',
      customerSince: '2023-03-10',
      segment: 'vip',
      satisfaction: 4.9,
      notes: 'High-value customer, prefers bulk orders'
    },
    {
      id: '2',
      name: 'Fatima Al-Zahra',
      company: 'Advanced Tech Solutions',
      email: 'fatima@advtech.sa',
      phone: '+966502345678',
      location: 'Jeddah, Saudi Arabia',
      totalOrders: 18,
      totalSpent: 89000,
      averageOrderValue: 4944,
      lastOrderDate: '2024-01-12',
      customerSince: '2023-05-15',
      segment: 'vip',
      satisfaction: 4.7,
      notes: 'Electronics specialist, loyal customer'
    },
    {
      id: '3',
      name: 'Mohammed Al-Rashid',
      company: 'Construction Plus',
      email: 'm.rashid@constplus.sa',
      phone: '+966503456789',
      location: 'Dammam, Saudi Arabia',
      totalOrders: 12,
      totalSpent: 45000,
      averageOrderValue: 3750,
      lastOrderDate: '2024-01-08',
      customerSince: '2023-08-20',
      segment: 'regular',
      satisfaction: 4.3,
      notes: 'Construction materials, seasonal orders'
    },
    {
      id: '4',
      name: 'Norah Al-Saud',
      company: 'Retail Innovations',
      email: 'norah@retailinnov.sa',
      phone: '+966504567890',
      location: 'Riyadh, Saudi Arabia',
      totalOrders: 8,
      totalSpent: 28000,
      averageOrderValue: 3500,
      lastOrderDate: '2023-12-20',
      customerSince: '2023-11-01',
      segment: 'at_risk',
      satisfaction: 3.8,
      notes: 'Has not ordered recently, follow up needed'
    },
    {
      id: '5',
      name: 'Khalid Al-Otaibi',
      company: 'Future Manufacturing',
      email: 'khalid@futuremfg.sa',
      phone: '+966505678901',
      location: 'Mecca, Saudi Arabia',
      totalOrders: 3,
      totalSpent: 12000,
      averageOrderValue: 4000,
      lastOrderDate: '2024-01-10',
      customerSince: '2024-01-05',
      segment: 'new',
      satisfaction: 4.5,
      notes: 'New customer, showing good potential'
    }
  ];

  const customerSegments: CustomerSegment[] = [
    {
      segment: 'vip',
      segmentAr: 'عملاء مميزون',
      count: 28,
      revenue: 450000,
      percentage: 65,
      growth: 18.5,
      color: '#8B5CF6'
    },
    {
      segment: 'regular',
      segmentAr: 'عملاء عاديون',
      count: 156,
      revenue: 280000,
      percentage: 25,
      growth: 12.3,
      color: '#3B82F6'
    },
    {
      segment: 'new',
      segmentAr: 'عملاء جدد',
      count: 45,
      revenue: 85000,
      percentage: 8,
      growth: 35.7,
      color: '#10B981'
    },
    {
      segment: 'at_risk',
      segmentAr: 'عملاء معرضون للمغادرة',
      count: 23,
      revenue: 15000,
      percentage: 2,
      growth: -8.9,
      color: '#EF4444'
    }
  ];

  const filteredCustomers = useMemo(() => {
    let filtered = customers;
    
    if (segmentFilter !== 'all') {
      filtered = filtered.filter(customer => customer.segment === segmentFilter);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        case 'averageOrderValue':
          return b.averageOrderValue - a.averageOrderValue;
        case 'satisfaction':
          return b.satisfaction - a.satisfaction;
        default:
          return 0;
      }
    });
  }, [segmentFilter, sortBy]);

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const averageOrderValue = customers.reduce((sum, customer) => sum + customer.averageOrderValue, 0) / customers.length;
  const averageSatisfaction = customers.reduce((sum, customer) => sum + customer.satisfaction, 0) / customers.length;

  // Chart data for customer trends
  const customerTrendData = [
    { month: isRTL ? 'يناير' : 'Jan', newCustomers: 12, totalRevenue: 85000 },
    { month: isRTL ? 'فبراير' : 'Feb', newCustomers: 18, totalRevenue: 98000 },
    { month: isRTL ? 'مارس' : 'Mar', newCustomers: 15, totalRevenue: 112000 },
    { month: isRTL ? 'أبريل' : 'Apr', newCustomers: 22, totalRevenue: 127000 },
    { month: isRTL ? 'مايو' : 'May', newCustomers: 25, totalRevenue: 145000 },
    { month: isRTL ? 'يونيو' : 'Jun', newCustomers: 19, totalRevenue: 138000 },
  ];

  const getSegmentColor = (segment: string) => {
    const segmentInfo = customerSegments.find(s => s.segment === segment);
    return segmentInfo?.color || '#6B7280';
  };

  const getSegmentBadge = (segment: string) => {
    const colors = {
      vip: 'bg-purple-100 text-purple-800 border-purple-200',
      regular: 'bg-blue-100 text-blue-800 border-blue-200',
      new: 'bg-green-100 text-green-800 border-green-200',
      at_risk: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      vip: isRTL ? 'مميز' : 'VIP',
      regular: isRTL ? 'عادي' : 'Regular',
      new: isRTL ? 'جديد' : 'New',
      at_risk: isRTL ? 'معرض للمغادرة' : 'At Risk'
    };
    
    return (
      <Badge className={`${colors[segment as keyof typeof colors]} text-xs font-medium`}>
        {labels[segment as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'رؤى العملاء' : 'Customer Insights'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'تحليل شامل لقاعدة العملاء وسلوكهم' : 'Comprehensive analysis of customer base and behavior'}
          </p>
        </div>
        
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">{isRTL ? '30 يوم' : '30 days'}</SelectItem>
              <SelectItem value="90d">{isRTL ? '90 يوم' : '90 days'}</SelectItem>
              <SelectItem value="1y">{isRTL ? 'سنة' : '1 year'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع العملاء' : 'All Customers'}</SelectItem>
              <SelectItem value="vip">{isRTL ? 'عملاء مميزون' : 'VIP'}</SelectItem>
              <SelectItem value="regular">{isRTL ? 'عملاء عاديون' : 'Regular'}</SelectItem>
              <SelectItem value="new">{isRTL ? 'عملاء جدد' : 'New'}</SelectItem>
              <SelectItem value="at_risk">{isRTL ? 'معرضون للمغادرة' : 'At Risk'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Download className="h-4 w-4" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isRTL ? 'إجمالي العملاء' : 'Total Customers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +18.2% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              {isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(averageOrderValue).toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +5.7% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Star className="h-4 w-4" />
              {isRTL ? 'متوسط الرضا' : 'Average Satisfaction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSatisfaction.toFixed(1)}/5</div>
            <div className="flex text-yellow-400 mt-1">
              {'★'.repeat(Math.floor(averageSatisfaction))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isRTL ? 'شرائح العملاء' : 'Customer Segments'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerSegments.map((segment) => (
              <div key={segment.segment} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {isRTL ? segment.segmentAr : segment.segment.toUpperCase()}
                  </span>
                  <Badge
                    variant={segment.growth > 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {segment.growth > 0 ? '+' : ''}{segment.growth}%
                  </Badge>
                </div>
                <Progress
                  value={segment.percentage}
                  className="h-2"
                  style={{ '--progress-background': segment.color } as any}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{segment.count} {isRTL ? 'عميل' : 'customers'}</span>
                  <span>${segment.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {isRTL ? 'اتجاه العملاء الجدد' : 'New Customer Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={customerTrendData}
              type="line"
              xKey="month"
              yKeys={['newCustomers']}
              colors={['#10B981']}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {isRTL ? 'اتجاه الإيرادات' : 'Revenue Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={customerTrendData}
              type="bar"
              xKey="month"
              yKeys={['totalRevenue']}
              colors={['#3B82F6']}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {isRTL ? 'قائمة العملاء' : 'Customer List'}
            </CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">{isRTL ? 'إجمالي الإنفاق' : 'Total Spent'}</SelectItem>
                <SelectItem value="totalOrders">{isRTL ? 'عدد الطلبات' : 'Total Orders'}</SelectItem>
                <SelectItem value="averageOrderValue">{isRTL ? 'متوسط قيمة الطلب' : 'Avg Order Value'}</SelectItem>
                <SelectItem value="satisfaction">{isRTL ? 'الرضا' : 'Satisfaction'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{customer.name}</h3>
                    {getSegmentBadge(customer.segment)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {customer.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {customer.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{customer.totalOrders} {isRTL ? 'طلب' : 'orders'}</span>
                    <span>{isRTL ? 'عميل منذ' : 'Customer since'} {new Date(customer.customerSince).toLocaleDateString()}</span>
                    <span>{isRTL ? 'آخر طلب' : 'Last order'} {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Customer Metrics */}
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-lg font-semibold">
                    ${customer.totalSpent.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {isRTL ? 'متوسط' : 'Avg'} ${customer.averageOrderValue.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-sm">{customer.satisfaction}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};