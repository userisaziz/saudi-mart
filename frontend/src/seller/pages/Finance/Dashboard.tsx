import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Banknote,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  RefreshCw,
  Eye,
  Download,
  Filter,
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PaymentRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'overdue';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash' | 'check';
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
  currency: string;
}

interface FinancialMetrics {
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  monthlyGrowth: number;
  averagePaymentTime: number;
  totalTransactions: number;
}

const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-0001',
    customerName: 'Saudi Industries Company',
    amount: 80125,
    status: 'paid',
    paymentMethod: 'bank_transfer',
    dueDate: '2024-03-20T00:00:00Z',
    paidDate: '2024-03-18T14:30:00Z',
    invoiceNumber: 'INV-2024-0001',
    currency: 'SAR',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0002',
    customerName: 'Nakheel Commercial Group',
    amount: 135000,
    status: 'pending',
    paymentMethod: 'credit_card',
    dueDate: '2024-03-25T00:00:00Z',
    invoiceNumber: 'INV-2024-0002',
    currency: 'SAR',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-0003',
    customerName: 'Advanced Technology Solutions',
    amount: 98500,
    status: 'overdue',
    paymentMethod: 'bank_transfer',
    dueDate: '2024-03-10T00:00:00Z',
    invoiceNumber: 'INV-2024-0003',
    currency: 'SAR',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-0004',
    customerName: 'Industrial Innovation Company',
    amount: 45000,
    status: 'paid',
    paymentMethod: 'check',
    dueDate: '2024-03-15T00:00:00Z',
    paidDate: '2024-03-14T11:20:00Z',
    invoiceNumber: 'INV-2024-0004',
    currency: 'SAR',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-0005',
    customerName: 'Global Trading Limited',
    amount: 67000,
    status: 'failed',
    paymentMethod: 'credit_card',
    dueDate: '2024-03-22T00:00:00Z',
    invoiceNumber: 'INV-2024-0005',
    currency: 'SAR',
  },
];

const monthlyRevenueData = [
  { month: 'January', revenue: 450000, payments: 320000 },
  { month: 'February', revenue: 520000, payments: 480000 },
  { month: 'March', revenue: 680000, payments: 620000 },
  { month: 'April', revenue: 590000, payments: 550000 },
  { month: 'May', revenue: 720000, payments: 690000 },
  { month: 'June', revenue: 650000, payments: 580000 },
];

const paymentMethodsData = [
  { name: 'Bank Transfer', value: 45, color: '#3B82F6' },
  { name: 'Credit Card', value: 30, color: '#EF4444' },
  { name: 'Check', value: 15, color: '#10B981' },
  { name: 'Cash', value: 10, color: '#F59E0B' },
];

const statusColors = {
  paid: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200',
};

const FinanceDashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [payments] = useState<PaymentRecord[]>(mockPayments);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const metrics: FinancialMetrics = {
    totalRevenue: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overduePayments: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    monthlyGrowth: 15.3,
    averagePaymentTime: 12,
    totalTransactions: payments.length,
  };

  const filteredPayments = statusFilter === 'all' 
    ? payments 
    : payments.filter(p => p.status === statusFilter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    return t(`paymentStatus.${status}`, status);
  };

  const getPaymentMethodText = (method: string) => {
    const methodKey = method.replace('_', '');
    return t(`paymentMethod.${methodKey}`, method);
  };

  const getPeriodText = (period: string) => {
    return t(`finance.${period}`, period);
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('finance.title', 'Finance Dashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('finance.subtitle', 'Track revenue, payments, and financial reports')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">{getPeriodText('week')}</option>
            <option value="month">{getPeriodText('month')}</option>
            <option value="quarter">{getPeriodText('quarter')}</option>
            <option value="year">{getPeriodText('year')}</option>
          </select>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('finance.exportReport', 'Export Report')}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('finance.totalRevenue', 'Total Revenue')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+{metrics.monthlyGrowth}%</span>
                <span className="text-sm text-gray-500">{t('finance.fromLastMonth', 'from last month')}</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Banknote className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('finance.pendingPayments', 'Pending Payments')}</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(metrics.pendingPayments)}</p>
              <p className="text-sm text-gray-500 mt-2">
                {payments.filter(p => p.status === 'pending').length} {t('finance.transactions', 'transactions')}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('finance.overduePayments', 'Overdue Payments')}</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(metrics.overduePayments)}</p>
              <p className="text-sm text-gray-500 mt-2">
                {payments.filter(p => p.status === 'overdue').length} {t('finance.transactions', 'transactions')}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('finance.averagePaymentTime', 'Average Payment Time')}</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.averagePaymentTime} {t('finance.days', 'days')}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">-2 {t('finance.days', 'days')}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('finance.revenueOverTime', 'Revenue Over Time')}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">{t('finance.revenue', 'Revenue')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{t('finance.payments', 'Payments')}</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(value as number), 
                    name === 'revenue' ? t('finance.revenue', 'Revenue') : t('finance.payments', 'Payments')
                  ]}
                  labelStyle={{ color: '#374151' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="payments"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('finance.paymentMethods', 'Payment Methods')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {paymentMethodsData.map((method) => (
              <div key={method.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                  <span className="text-gray-700">{method.name}</span>
                </div>
                <span className="font-medium text-gray-900">{method.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('finance.recentTransactions', 'Recent Transactions')}</h3>
            
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('finance.allStatuses', 'All Statuses')}</option>
                <option value="paid">{t('paymentStatus.paid', 'Paid')}</option>
                <option value="pending">{t('paymentStatus.pending', 'Pending')}</option>
                <option value="overdue">{t('paymentStatus.overdue', 'Overdue')}</option>
                <option value="failed">{t('paymentStatus.failed', 'Failed')}</option>
              </select>
              
              <button className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.invoiceNumber', 'Invoice Number')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.customer', 'Customer')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.amount', 'Amount')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.status', 'Status')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.paymentMethod', 'Payment Method')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.dueDate', 'Due Date')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('finance.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.customerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[payment.status]}`}>
                      {getStatusIcon(payment.status)}
                      <span>{getStatusText(payment.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentMethodText(payment.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(payment.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      {payment.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;