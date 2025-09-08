import React, { useState } from 'react'
import { Search, Filter, Download, CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'

interface Payment {
  id: string
  invoiceNumber: string
  customerName: string
  amount: number
  paymentDate: string
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash' | 'check'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  transactionId?: string
  notes?: string
}

const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    invoiceNumber: 'INV-2024-001',
    customerName: 'أحمد محمد الأحمد',
    amount: 15000,
    paymentDate: '2024-01-20',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    transactionId: 'TXN123456789',
    notes: 'تم الدفع عبر التحويل البنكي'
  },
  {
    id: 'PAY002',
    invoiceNumber: 'INV-2024-002',
    customerName: 'فاطمة علي السعيد',
    amount: 8500,
    paymentDate: '2024-01-21',
    paymentMethod: 'credit_card',
    status: 'completed',
    transactionId: 'TXN123456790'
  },
  {
    id: 'PAY003',
    invoiceNumber: 'INV-2024-003',
    customerName: 'خالد سعد المطيري',
    amount: 12000,
    paymentDate: '2024-01-22',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    notes: 'في انتظار تأكيد البنك'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">قيد الانتظار</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">فاشل</Badge>
    case 'refunded':
      return <Badge className="bg-purple-100 text-purple-800">مُسترد</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />
    case 'failed':
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    case 'refunded':
      return <AlertTriangle className="w-4 h-4 text-purple-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-600" />
  }
}

const getPaymentMethodLabel = (method: string) => {
  const methods: { [key: string]: string } = {
    bank_transfer: 'تحويل بنكي',
    credit_card: 'بطاقة ائتمان',
    cash: 'نقدي',
    check: 'شيك'
  }
  return methods[method] || method
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'bank_transfer':
      return '🏦'
    case 'credit_card':
      return '💳'
    case 'cash':
      return '💵'
    case 'check':
      return '📄'
    default:
      return '💰'
  }
}

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.includes(searchTerm) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const completedPayments = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المدفوعات</h1>
          <p className="text-gray-600">تتبع ومراقبة جميع المدفوعات الواردة</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المدفوعات</p>
              <p className="text-2xl font-bold text-gray-900">{formatSARCurrency(totalPayments)}</p>
              <p className="text-xs text-blue-600">هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المدفوعات المكتملة</p>
              <p className="text-2xl font-bold text-green-900">{formatSARCurrency(completedPayments)}</p>
              <p className="text-xs text-green-600">تم التأكيد</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-yellow-900">{formatSARCurrency(pendingPayments)}</p>
              <p className="text-xs text-yellow-600">تحت المراجعة</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">عدد المعاملات</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              <p className="text-xs text-purple-600">معاملة</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في المدفوعات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-right"
          >
            <option value="all">جميع الحالات</option>
            <option value="completed">مكتمل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="failed">فاشل</option>
            <option value="refunded">مُسترد</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الفاتورة</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">طريقة الدفع</TableHead>
              <TableHead className="text-right">تاريخ الدفع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">رقم المعاملة</TableHead>
              <TableHead className="text-right">الملاحظات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium text-right">{payment.invoiceNumber}</TableCell>
                <TableCell className="text-right">{payment.customerName}</TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {formatSARCurrency(payment.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                    <span>{getPaymentMethodLabel(payment.paymentMethod)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatDate(payment.paymentDate)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    {getStatusBadge(payment.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {payment.transactionId || 'غير متاح'}
                </TableCell>
                <TableCell className="text-right text-sm text-gray-600">
                  {payment.notes || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              عرض 1 إلى {filteredPayments.length} من أصل {payments.length} مدفوعة
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                السابق
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                التالي
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">ملخص طرق الدفع</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(
            payments.reduce((acc, payment) => {
              if (payment.status === 'completed') {
                acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount
              }
              return acc
            }, {} as { [key: string]: number })
          ).map(([method, amount]) => (
            <div key={method} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getPaymentMethodIcon(method)}</span>
                <span className="font-medium">{getPaymentMethodLabel(method)}</span>
              </div>
              <p className="text-lg font-bold text-green-600">
                {formatSARCurrency(amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}