import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { DataTable } from '@/seller/components/ui/DataTable';
import { MetricsCard } from '@/seller/components/ui/MetricsCard';
import { Chart } from '@/seller/components/ui/Chart';
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowRightIcon,
  EyeIcon,
  PencilIcon,
  PrinterIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon as ClockSolidIcon,
} from '@heroicons/react/24/solid';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameAr: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

interface Customer {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  company?: string;
  companyAr?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  customerType: 'individual' | 'business' | 'government';
  creditLimit?: number;
  paymentTerms?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: 'SAR' | 'USD';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'check' | 'credit';
  shippingMethod: 'standard' | 'express' | 'overnight' | 'pickup';
  trackingNumber?: string;
  notes?: string;
  internalNotes?: string;
  createdBy: string;
  assignedTo?: string;
  tags: string[];
  workflow: {
    currentStep: number;
    completedSteps: number[];
    totalSteps: number;
  };
  timeline: Array<{
    id: string;
    action: string;
    actionAr: string;
    timestamp: string;
    user: string;
    details?: string;
    automated?: boolean;
  }>;
}

// Mock data for comprehensive order management
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust-1',
      name: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      email: 'ahmed@company.sa',
      phone: '+966 50 123 4567',
      company: 'Al-Rashid Industries',
      companyAr: 'صناعات الراشد',
      address: {
        street: '123 King Fahd Road',
        city: 'Riyadh',
        state: 'Riyadh Province',
        country: 'Saudi Arabia',
        postalCode: '11564'
      },
      customerType: 'business',
      creditLimit: 100000,
      paymentTerms: 'Net 30'
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Industrial Water Pump HP-2000',
        productNameAr: 'مضخة مياه صناعية عالية الضغط HP-2000',
        sku: 'PUMP-HP-2000',
        quantity: 2,
        unitPrice: 15000,
        totalPrice: 30000
      }
    ],
    status: 'processing',
    priority: 'high',
    orderDate: '2024-03-15T10:30:00Z',
    expectedDelivery: '2024-03-25T12:00:00Z',
    subtotal: 30000,
    tax: 4500,
    shipping: 500,
    discount: 0,
    total: 35000,
    currency: 'SAR',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    shippingMethod: 'standard',
    trackingNumber: 'TRK-123456789',
    notes: 'Customer requested expedited processing',
    createdBy: 'system',
    assignedTo: 'sales-rep-1',
    tags: ['priority', 'large-order'],
    workflow: {
      currentStep: 3,
      completedSteps: [1, 2, 3],
      totalSteps: 6
    },
    timeline: [
      {
        id: 'timeline-1',
        action: 'Order received',
        actionAr: 'تم استلام الطلب',
        timestamp: '2024-03-15T10:30:00Z',
        user: 'Customer',
        automated: true
      },
      {
        id: 'timeline-2',
        action: 'Payment confirmed',
        actionAr: 'تم تأكيد الدفع',
        timestamp: '2024-03-15T11:00:00Z',
        user: 'Payment Gateway',
        automated: true
      },
      {
        id: 'timeline-3',
        action: 'Order assigned to warehouse',
        actionAr: 'تم تخصيص الطلب للمستودع',
        timestamp: '2024-03-15T11:30:00Z',
        user: 'Sales Manager',
        automated: false
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust-2',
      name: 'Fatima Al-Zahra',
      nameAr: 'فاطمة الزهراء',
      email: 'fatima@constructco.sa',
      phone: '+966 55 987 6543',
      company: 'Saudi Construction Co.',
      companyAr: 'شركة البناء السعودية',
      address: {
        street: '456 Olaya Street',
        city: 'Riyadh',
        state: 'Riyadh Province',
        country: 'Saudi Arabia',
        postalCode: '11442'
      },
      customerType: 'business',
      creditLimit: 200000,
      paymentTerms: 'Net 15'
    },
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Hydraulic Cylinder 200mm Bore',
        productNameAr: 'أسطوانة هيدروليكية قطر 200 ملم',
        sku: 'CYL-HYD-200MM',
        quantity: 5,
        unitPrice: 8500,
        totalPrice: 42500
      },
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Safety Relief Valve 1000 PSI',
        productNameAr: 'صمام أمان وتخفيف الضغط 1000 رطل',
        sku: 'VALVE-SAFETY-1000',
        quantity: 10,
        unitPrice: 1200,
        totalPrice: 12000
      }
    ],
    status: 'shipped',
    priority: 'normal',
    orderDate: '2024-03-12T14:15:00Z',
    expectedDelivery: '2024-03-20T16:00:00Z',
    subtotal: 54500,
    tax: 8175,
    shipping: 750,
    discount: 2500,
    total: 60925,
    currency: 'SAR',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    shippingMethod: 'express',
    trackingNumber: 'TRK-987654321',
    assignedTo: 'sales-rep-2',
    tags: ['bulk-order', 'construction'],
    workflow: {
      currentStep: 5,
      completedSteps: [1, 2, 3, 4, 5],
      totalSteps: 6
    },
    timeline: [
      {
        id: 'timeline-4',
        action: 'Order received',
        actionAr: 'تم استلام الطلب',
        timestamp: '2024-03-12T14:15:00Z',
        user: 'Customer',
        automated: true
      },
      {
        id: 'timeline-5',
        action: 'Order shipped',
        actionAr: 'تم شحن الطلب',
        timestamp: '2024-03-16T09:00:00Z',
        user: 'Warehouse Manager',
        details: 'Shipped via Express Logistics'
      }
    ]
  }
];

const orderSteps = [
  { id: 1, name: 'Order Received', nameAr: 'استلام الطلب' },
  { id: 2, name: 'Payment Confirmed', nameAr: 'تأكيد الدفع' },
  { id: 3, name: 'Processing', nameAr: 'قيد المعالجة' },
  { id: 4, name: 'Packaging', nameAr: 'التغليف' },
  { id: 5, name: 'Shipped', nameAr: 'تم الشحن' },
  { id: 6, name: 'Delivered', nameAr: 'تم التسليم' }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  returned: 'bg-orange-100 text-orange-800 border-orange-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export default function OrderWorkflow() {
  const { t, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate metrics
  const metrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    averageOrderValue: orders.reduce((sum, o) => sum + o.total, 0) / orders.length,
    urgentOrders: orders.filter(o => o.priority === 'urgent').length,
    overdueOrders: orders.filter(o => new Date(o.expectedDelivery) < new Date() && o.status !== 'delivered').length
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Chart data
  const ordersByStatus = Object.keys(statusColors).map(status => ({
    name: status.replace('_', ' '),
    value: orders.filter(o => o.status === status).length
  }));

  const revenueByMonth = [
    { name: 'Jan', revenue: 125000, orders: 45 },
    { name: 'Feb', revenue: 142000, orders: 52 },
    { name: 'Mar', revenue: 156000, orders: 48 },
    { name: 'Apr', revenue: 168000, orders: 56 },
    { name: 'May', revenue: 175000, orders: 61 },
    { name: 'Jun', revenue: 189000, orders: 58 }
  ];

  const WorkflowStep: React.FC<{ step: any; isActive: boolean; isCompleted: boolean; isLast: boolean }> = ({ 
    step, isActive, isCompleted, isLast 
  }) => (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
        isCompleted 
          ? 'bg-green-500 border-green-500 text-white' 
          : isActive 
          ? 'bg-blue-500 border-blue-500 text-white' 
          : 'bg-white border-gray-300 text-gray-400'
      }`}>
        {isCompleted ? <CheckCircleSolidIcon className="w-5 h-5" /> : step.id}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium ${
          isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
        }`}>
          {isRTL ? step.nameAr : step.name}
        </p>
      </div>
      {!isLast && (
        <ArrowRightIcon className={`w-4 h-4 mx-4 ${
          isCompleted ? 'text-green-400' : 'text-gray-300'
        }`} />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'إدارة سير العمل للطلبات' : 'Order Workflow Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRTL ? 'إدارة شاملة للطلبات مع أتمتة سير العمل والتتبع المتقدم' : 'Comprehensive order management with workflow automation and advanced tracking'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <FunnelIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}
          </Button>
          <Button variant="outline" size="sm">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'تقرير' : 'Report'}
          </Button>
          <Button>
            <ShoppingBagIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'طلب جديد' : 'New Order'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
          value={metrics.totalOrders}
          change={12}
          changeType="increase"
          icon={ShoppingBagIcon}
          iconColor="text-blue-600"
        />
        <MetricsCard
          title={isRTL ? 'قيد المعالجة' : 'Processing'}
          value={metrics.processingOrders}
          change={8}
          changeType="increase"
          icon={ClockIcon}
          iconColor="text-purple-600"
        />
        <MetricsCard
          title={isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
          value={metrics.totalRevenue}
          change={15.5}
          changeType="increase"
          icon={CurrencyDollarIcon}
          iconColor="text-green-600"
          format="currency"
        />
        <MetricsCard
          title={isRTL ? 'متوسط قيمة الطلب' : 'Average Order Value'}
          value={Number(metrics.averageOrderValue.toFixed(0))}
          change={5.2}
          changeType="increase"
          icon={ArrowTrendingUpIcon}
          iconColor="text-orange-600"
          format="currency"
        />
      </div>

      {/* Alert Cards */}
      {(metrics.urgentOrders > 0 || metrics.overdueOrders > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {metrics.urgentOrders > 0 && (
            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  {isRTL ? 'طلبات عاجلة' : 'Urgent Orders'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{metrics.urgentOrders}</div>
                <p className="text-xs text-red-600 mt-1">
                  {isRTL ? 'يحتاج اهتمام فوري' : 'Need immediate attention'}
                </p>
              </CardContent>
            </Card>
          )}
          
          {metrics.overdueOrders > 0 && (
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  {isRTL ? 'طلبات متأخرة' : 'Overdue Orders'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{metrics.overdueOrders}</div>
                <p className="text-xs text-orange-600 mt-1">
                  {isRTL ? 'تجاوزت الموعد المتوقع' : 'Past expected delivery'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="dashboard">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</TabsTrigger>
          <TabsTrigger value="orders">{isRTL ? 'الطلبات' : 'Orders'}</TabsTrigger>
          <TabsTrigger value="workflow">{isRTL ? 'سير العمل' : 'Workflow'}</TabsTrigger>
          <TabsTrigger value="analytics">{isRTL ? 'التحليلات' : 'Analytics'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          {/* Recent Orders Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{isRTL ? 'الطلبات الأخيرة' : 'Recent Orders'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'shipped' ? 'bg-blue-500' :
                          order.status === 'processing' ? 'bg-purple-500' :
                          order.status === 'pending' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium">{order.orderNumber}</h4>
                          <p className="text-sm text-gray-600">
                            {isRTL ? order.customer.nameAr : order.customer.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {isRTL ? `${order.total.toLocaleString()} ر.س` : `$${order.total.toLocaleString()}`}
                        </p>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'توزيع حالة الطلبات' : 'Order Status Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={ordersByStatus}
                  type="pie"
                  title=""
                  height={250}
                  colors={['#FEF3C7', '#DBEAFE', '#E0E7FF', '#C7D2FE', '#D1FAE5', '#FEE2E2']}
                />
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'اتجاه الإيرادات' : 'Revenue Trend'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={revenueByMonth}
                  type="area"
                  title=""
                  xKey="name"
                  yKey="revenue"
                  color="#10B981"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'مقاييس الأداء' : 'Performance Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل الإنجاز في الوقت المحدد' : 'On-Time Delivery Rate'}</span>
                      <span className="text-lg font-bold text-green-600">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل رضا العملاء' : 'Customer Satisfaction'}</span>
                      <span className="text-lg font-bold text-blue-600">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'متوسط وقت المعالجة' : 'Average Processing Time'}</span>
                      <span className="text-lg font-bold text-purple-600">2.3 days</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل إرجاع الطلبات' : 'Order Return Rate'}</span>
                      <span className="text-lg font-bold text-orange-600">2.1%</span>
                    </div>
                    <Progress value={21} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 lg:w-96">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={isRTL ? 'البحث في الطلبات...' : 'Search orders...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
                <option value="pending">{isRTL ? 'معلق' : 'Pending'}</option>
                <option value="confirmed">{isRTL ? 'مؤكد' : 'Confirmed'}</option>
                <option value="processing">{isRTL ? 'قيد المعالجة' : 'Processing'}</option>
                <option value="shipped">{isRTL ? 'تم الشحن' : 'Shipped'}</option>
                <option value="delivered">{isRTL ? 'تم التسليم' : 'Delivered'}</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">{isRTL ? 'كل الأولويات' : 'All Priorities'}</option>
                <option value="urgent">{isRTL ? 'عاجل' : 'Urgent'}</option>
                <option value="high">{isRTL ? 'عالي' : 'High'}</option>
                <option value="normal">{isRTL ? 'عادي' : 'Normal'}</option>
                <option value="low">{isRTL ? 'منخفض' : 'Low'}</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'الطلبات' : 'Orders'} ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-blue-600">{order.orderNumber}</h3>
                          <Badge className={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                          <Badge className={priorityColors[order.priority]}>
                            {order.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              {isRTL ? order.customer.nameAr : order.customer.name}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? order.customer.companyAr : order.customer.company}
                            </p>
                            <div className="flex items-center text-gray-500 mt-1">
                              <EnvelopeIcon className="w-3 h-3 mr-1" />
                              {order.customer.email}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <PhoneIcon className="w-3 h-3 mr-1" />
                              {order.customer.phone}
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-700 mb-1">
                              {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'العناصر:' : 'Items:'} {order.items.length}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'تاريخ الطلب:' : 'Order Date:'} {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'التسليم المتوقع:' : 'Expected:'} {new Date(order.expectedDelivery).toLocaleDateString()}
                            </p>
                            {order.trackingNumber && (
                              <p className="text-gray-600">
                                {isRTL ? 'رقم التتبع:' : 'Tracking:'} {order.trackingNumber}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-700 mb-1">
                              {isRTL ? 'المبلغ الإجمالي' : 'Total Amount'}
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {isRTL ? `${order.total.toLocaleString()} ر.س` : `$${order.total.toLocaleString()}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {isRTL ? 'حالة الدفع:' : 'Payment:'} 
                              <span className={`ml-1 ${
                                order.paymentStatus === 'paid' ? 'text-green-600' : 
                                order.paymentStatus === 'pending' ? 'text-yellow-600' : 
                                'text-red-600'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {isRTL ? 'تقدم الطلب' : 'Order Progress'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {order.workflow.completedSteps.length}/{order.workflow.totalSteps} {isRTL ? 'مكتملة' : 'completed'}
                        </span>
                      </div>
                      <Progress 
                        value={(order.workflow.completedSteps.length / order.workflow.totalSteps) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'عرض' : 'View'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <PencilIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <PrinterIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'طباعة' : 'Print'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'رسالة' : 'Message'}
                        </Button>
                      </div>
                      
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button size="sm">
                          {isRTL ? 'تحديث الحالة' : 'Update Status'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? 'لم يتم العثور على طلبات' : 'No orders found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isRTL ? 'حاول تعديل معايير البحث أو الفلاتر' : 'Try adjusting your search criteria or filters'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6 mt-6">
          {/* Workflow Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إعداد سير العمل' : 'Workflow Configuration'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تخصيص مراحل سير عمل الطلبات وقواعد الأتمتة' : 'Customize order workflow stages and automation rules'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Workflow Steps */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isRTL ? 'مراحل سير العمل' : 'Workflow Steps'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {orderSteps.map((step, index) => (
                      <WorkflowStep
                        key={step.id}
                        step={step}
                        isActive={false}
                        isCompleted={false}
                        isLast={index === orderSteps.length - 1}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Automation Rules */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {isRTL ? 'قواعد الأتمتة' : 'Automation Rules'}
                  </h3>
                  <div className="space-y-4">
                    <Card className="border border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900 mb-1">
                              {isRTL ? 'تأكيد الدفع التلقائي' : 'Automatic Payment Confirmation'}
                            </h4>
                            <p className="text-sm text-blue-700">
                              {isRTL ? 'ينتقل الطلب تلقائياً لمرحلة المعالجة عند تأكيد الدفع' : 'Orders automatically move to processing when payment is confirmed'}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-purple-200 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-purple-900 mb-1">
                              {isRTL ? 'إشعارات التأخير' : 'Delay Notifications'}
                            </h4>
                            <p className="text-sm text-purple-700">
                              {isRTL ? 'إشعار تلقائي للعملاء إذا تأخر الطلب عن الموعد المتوقع' : 'Automatic customer notification if order is delayed beyond expected date'}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-orange-900 mb-1">
                              {isRTL ? 'تحديث المخزون التلقائي' : 'Automatic Inventory Update'}
                            </h4>
                            <p className="text-sm text-orange-700">
                              {isRTL ? 'خصم المنتجات من المخزون تلقائياً عند تأكيد الطلب' : 'Automatically deduct products from inventory when order is confirmed'}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'سير العمل النشط' : 'Active Workflows'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-blue-600">{order.orderNumber}</h4>
                        <p className="text-sm text-gray-600">
                          {isRTL ? order.customer.nameAr : order.customer.name}
                        </p>
                      </div>
                      <Badge className={priorityColors[order.priority]}>
                        {order.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {orderSteps.map((step, index) => (
                        <WorkflowStep
                          key={step.id}
                          step={step}
                          isActive={order.workflow.currentStep === step.id}
                          isCompleted={order.workflow.completedSteps.includes(step.id)}
                          isLast={index === orderSteps.length - 1}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {isRTL ? 'آخر تحديث:' : 'Last updated:'} {new Date(order.timeline[order.timeline.length - 1]?.timestamp).toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        </Button>
                        <Button size="sm">
                          {isRTL ? 'المرحلة التالية' : 'Next Stage'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Analytics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'اتجاه الإيرادات والطلبات' : 'Revenue & Orders Trend'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={revenueByMonth}
                  type="line"
                  title=""
                  xKey="name"
                  yKey="revenue"
                  color="#3B82F6"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'توزيع حالة الطلبات' : 'Order Status Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={ordersByStatus}
                  type="pie"
                  title=""
                  height={300}
                  colors={['#FEF3C7', '#DBEAFE', '#E0E7FF', '#C7D2FE', '#D1FAE5', '#FEE2E2']}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'متوسط أوقات المعالجة' : 'Average Processing Times'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'تأكيد الطلب' : 'Order Confirmation'}</span>
                      <span className="text-sm font-medium">15 min</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'معالجة الدفع' : 'Payment Processing'}</span>
                      <span className="text-sm font-medium">2.3 hrs</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'التحضير والتغليف' : 'Preparation & Packaging'}</span>
                      <span className="text-sm font-medium">1.8 days</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'الشحن' : 'Shipping'}</span>
                      <span className="text-sm font-medium">3.2 days</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'مقاييس الجودة' : 'Quality Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">94%</div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'معدل الإنجاز في الموعد' : 'On-Time Delivery Rate'}
                    </p>
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'طلبات مكتملة' : 'Orders Completed'}</span>
                      <span className="font-medium">{metrics.deliveredOrders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'معدل الإرجاع' : 'Return Rate'}</span>
                      <span className="font-medium">2.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'رضا العملاء' : 'Customer Satisfaction'}</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'معدل إعادة الشراء' : 'Repeat Purchase Rate'}</span>
                      <span className="font-medium">67%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'توقعات الأداء' : 'Performance Forecast'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {isRTL ? '+23%' : '+23%'}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {isRTL ? 'نمو متوقع للشهر القادم' : 'Expected growth next month'}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'طلبات متوقعة' : 'Expected Orders'}</span>
                      <span className="font-medium">87</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'إيرادات متوقعة' : 'Expected Revenue'}</span>
                      <span className="font-medium">
                        {isRTL ? '2,150,000 ر.س' : '$2,150,000'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'عملاء جدد متوقعون' : 'Expected New Customers'}</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'متوسط قيمة الطلب المتوقعة' : 'Expected AOV'}</span>
                      <span className="font-medium">
                        {isRTL ? '24,700 ر.س' : '$24,700'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {isRTL ? 'تفاصيل الطلب' : 'Order Details'} - {selectedOrder.orderNumber}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  <XCircleIcon className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Order Timeline */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {isRTL ? 'تاريخ الطلب' : 'Order Timeline'}
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.timeline.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {event.automated ? (
                            <ArrowPathIcon className="w-4 h-4 text-blue-600" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {isRTL ? event.actionAr : event.action}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {isRTL ? 'بواسطة' : 'by'} {event.user} • {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.details && (
                            <p className="text-sm text-gray-700 mt-1">{event.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {isRTL ? 'عناصر الطلب' : 'Order Items'}
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {isRTL ? item.productNameAr : item.productName}
                          </h4>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {item.quantity} × {isRTL ? `${item.unitPrice.toLocaleString()} ر.س` : `$${item.unitPrice.toLocaleString()}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isRTL ? 'الإجمالي:' : 'Total:'} {isRTL ? `${item.totalPrice.toLocaleString()} ر.س` : `$${item.totalPrice.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {isRTL ? 'معلومات العميل' : 'Customer Information'}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><strong>{isRTL ? 'الاسم:' : 'Name:'}</strong> {isRTL ? selectedOrder.customer.nameAr : selectedOrder.customer.name}</p>
                      <p><strong>{isRTL ? 'الشركة:' : 'Company:'}</strong> {isRTL ? selectedOrder.customer.companyAr : selectedOrder.customer.company}</p>
                      <p><strong>{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</strong> {selectedOrder.customer.email}</p>
                      <p><strong>{isRTL ? 'الهاتف:' : 'Phone:'}</strong> {selectedOrder.customer.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>{isRTL ? 'العنوان:' : 'Address:'}</strong></p>
                      <div className="text-sm text-gray-600 ml-4">
                        <p>{selectedOrder.customer.address.street}</p>
                        <p>{selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}</p>
                        <p>{selectedOrder.customer.address.country} {selectedOrder.customer.address.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}