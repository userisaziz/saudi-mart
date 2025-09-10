import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Package,
  Truck,
  DollarSign,
  Calendar,
  User,
  RefreshCw,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Textarea } from '@/shared/components/ui/textarea'
import { useLanguage } from '@/shared/contexts/LanguageContext'

interface OrderItem {
  id: string
  productName: string
  productNameAr: string
  quantity: number
  price: number
  totalPrice: number
  sku: string
  category: string
}

interface PendingOrder {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  sellerId: string
  sellerName: string
  sellerPhone: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  status: 'pending_payment' | 'payment_verified' | 'pending_seller_approval' | 'pending_stock_confirmation' | 'pending_documentation'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  pendingSince: string
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  orderDate: string
  expectedDelivery?: string
  notes?: string
  adminNotes?: string
  lastActivity: string
  requiresAction: boolean
  actionType?: string
  currency: 'SAR' | 'USD'
}

const mockPendingOrders: PendingOrder[] = [
  {
    id: 'ORD-2024-001',
    orderNumber: 'ORD-2024-001',
    customerId: 'CUST-001',
    customerName: 'أحمد محمد الأحمد',
    customerEmail: 'ahmed@example.com',
    customerPhone: '+966501234567',
    sellerId: 'SELL-001',
    sellerName: 'شركة الأحمد للصناعات',
    sellerPhone: '+966507654321',
    items: [
      {
        id: 'ITM-001',
        productName: 'Industrial Steel Pipe',
        productNameAr: 'أنبوب صلب صناعي',
        quantity: 50,
        price: 250,
        totalPrice: 12500,
        sku: 'ISP-001',
        category: 'Industrial Materials'
      }
    ],
    subtotal: 12500,
    tax: 1875,
    shippingCost: 500,
    total: 14875,
    status: 'pending_payment',
    priority: 'high',
    pendingSince: '2024-01-15T10:30:00Z',
    paymentMethod: 'Bank Transfer',
    shippingAddress: {
      street: 'شارع الملك فهد، حي العليا',
      city: 'الرياض',
      region: 'منطقة الرياض',
      postalCode: '12211',
      country: 'السعودية'
    },
    orderDate: '2024-01-15T08:15:00Z',
    expectedDelivery: '2024-01-25',
    notes: 'عاجل - مطلوب للمشروع الحكومي',
    lastActivity: '2024-01-15T10:30:00Z',
    requiresAction: true,
    actionType: 'payment_verification',
    currency: 'SAR'
  },
  {
    id: 'ORD-2024-002',
    orderNumber: 'ORD-2024-002',
    customerId: 'CUST-002',
    customerName: 'فاطمة علي السعيد',
    customerEmail: 'fatima@example.com',
    customerPhone: '+966502345678',
    sellerId: 'SELL-002',
    sellerName: 'مصنع السعيد للمعادن',
    sellerPhone: '+966508765432',
    items: [
      {
        id: 'ITM-002',
        productName: 'LED Panel System',
        productNameAr: 'نظام لوحات LED',
        quantity: 20,
        price: 450,
        totalPrice: 9000,
        sku: 'LED-002',
        category: 'Lighting Systems'
      }
    ],
    subtotal: 9000,
    tax: 1350,
    shippingCost: 300,
    total: 10650,
    status: 'pending_seller_approval',
    priority: 'medium',
    pendingSince: '2024-01-14T14:20:00Z',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      street: 'طريق الدمام السريع',
      city: 'الدمام',
      region: 'المنطقة الشرقية',
      postalCode: '31422',
      country: 'السعودية'
    },
    orderDate: '2024-01-14T12:10:00Z',
    expectedDelivery: '2024-01-28',
    lastActivity: '2024-01-14T14:20:00Z',
    requiresAction: true,
    actionType: 'seller_approval',
    currency: 'SAR'
  }
]

const PendingOrdersPage: React.FC = () => {
  const { t, isRTL } = useLanguage()
  const [orders, setOrders] = useState<PendingOrder[]>(mockPendingOrders)
  const [filteredOrders, setFilteredOrders] = useState<PendingOrder[]>(mockPendingOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  // Filter orders
  useEffect(() => {
    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter)
    }

    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [orders, searchQuery, statusFilter, priorityFilter])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const handleApproveOrder = async (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'payment_verified' as const, requiresAction: false }
        : order
    ))
  }

  const handleRejectOrder = async (orderId: string, reason: string) => {
    // In real app, this would update the order status to rejected
    console.log(`Rejecting order ${orderId} with reason: ${reason}`)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: { color: 'bg-yellow-100 text-yellow-800', text: isRTL ? 'انتظار الدفع' : 'Pending Payment' },
      payment_verified: { color: 'bg-blue-100 text-blue-800', text: isRTL ? 'تم التحقق من الدفع' : 'Payment Verified' },
      pending_seller_approval: { color: 'bg-orange-100 text-orange-800', text: isRTL ? 'انتظار موافقة البائع' : 'Pending Seller Approval' },
      pending_stock_confirmation: { color: 'bg-purple-100 text-purple-800', text: isRTL ? 'انتظار تأكيد المخزون' : 'Pending Stock Confirmation' },
      pending_documentation: { color: 'bg-red-100 text-red-800', text: isRTL ? 'انتظار الوثائق' : 'Pending Documentation' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_payment
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-green-100 text-green-800', text: isRTL ? 'منخفضة' : 'Low' },
      medium: { color: 'bg-blue-100 text-blue-800', text: isRTL ? 'متوسطة' : 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', text: isRTL ? 'عالية' : 'High' },
      urgent: { color: 'bg-red-100 text-red-800', text: isRTL ? 'عاجل' : 'Urgent' }
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate metrics
  const metrics = {
    total: filteredOrders.length,
    requiresAction: filteredOrders.filter(o => o.requiresAction).length,
    highPriority: filteredOrders.filter(o => o.priority === 'high' || o.priority === 'urgent').length,
    avgValue: filteredOrders.length > 0 ? filteredOrders.reduce((sum, o) => sum + o.total, 0) / filteredOrders.length : 0
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'الطلبات المعلقة' : 'Pending Orders'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة ومراجعة الطلبات التي تتطلب اتخاذ إجراء' : 'Manage and review orders that require action'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي الطلبات المعلقة' : 'Total Pending'}</p>
                <p className="text-2xl font-bold">{metrics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'تتطلب إجراء' : 'Requires Action'}</p>
                <p className="text-2xl font-bold text-red-600">{metrics.requiresAction}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'أولوية عالية' : 'High Priority'}</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'متوسط القيمة' : 'Avg Value'}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.avgValue, 'SAR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-10"
                  placeholder={isRTL ? 'البحث في الطلبات...' : 'Search orders...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="pending_payment">{isRTL ? 'انتظار الدفع' : 'Pending Payment'}</SelectItem>
                <SelectItem value="payment_verified">{isRTL ? 'تم التحقق من الدفع' : 'Payment Verified'}</SelectItem>
                <SelectItem value="pending_seller_approval">{isRTL ? 'انتظار موافقة البائع' : 'Pending Seller Approval'}</SelectItem>
                <SelectItem value="pending_stock_confirmation">{isRTL ? 'انتظار تأكيد المخزون' : 'Pending Stock'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الأولوية' : 'Priority'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأولويات' : 'All Priority'}</SelectItem>
                <SelectItem value="urgent">{isRTL ? 'عاجل' : 'Urgent'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'رقم الطلب' : 'Order #'}</TableHead>
                <TableHead>{isRTL ? 'العميل' : 'Customer'}</TableHead>
                <TableHead>{isRTL ? 'البائع' : 'Seller'}</TableHead>
                <TableHead>{isRTL ? 'المبلغ' : 'Amount'}</TableHead>
                <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isRTL ? 'الأولوية' : 'Priority'}</TableHead>
                <TableHead>{isRTL ? 'معلق منذ' : 'Pending Since'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} className={order.requiresAction ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {order.requiresAction && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      {order.orderNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.sellerName}</div>
                      <div className="text-sm text-gray-500">{order.sellerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.total, order.currency)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(order.priority)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.pendingSince)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                      {order.status === 'pending_payment' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveOrder(order.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {isRTL ? 'تأكيد' : 'Approve'}
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            {isRTL ? 'اتصال بالعميل' : 'Call Customer'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            {isRTL ? 'إرسال بريد' : 'Send Email'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            {isRTL ? 'رفض الطلب' : 'Reject Order'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedOrder.requiresAction && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                {isRTL ? `تفاصيل الطلب ${selectedOrder.orderNumber}` : `Order Details - ${selectedOrder.orderNumber}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status and Priority */}
              <div className="flex gap-4">
                {getStatusBadge(selectedOrder.status)}
                {getPriorityBadge(selectedOrder.priority)}
                {selectedOrder.requiresAction && (
                  <Badge className="bg-red-100 text-red-800">
                    {isRTL ? 'يتطلب إجراء' : 'Requires Action'}
                  </Badge>
                )}
              </div>

              {/* Customer & Seller Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {isRTL ? 'معلومات العميل' : 'Customer Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {isRTL ? 'معلومات البائع' : 'Seller Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{selectedOrder.sellerName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.sellerPhone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'عناصر الطلب' : 'Order Items'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isRTL ? 'المنتج' : 'Product'}</TableHead>
                        <TableHead>{isRTL ? 'الكمية' : 'Quantity'}</TableHead>
                        <TableHead>{isRTL ? 'السعر' : 'Price'}</TableHead>
                        <TableHead>{isRTL ? 'الإجمالي' : 'Total'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{isRTL ? item.productNameAr : item.productName}</p>
                              <p className="text-sm text-gray-600">{item.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price, selectedOrder.currency)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.totalPrice, selectedOrder.currency)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Order Summary */}
                  <div className="mt-6 border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span>{formatCurrency(selectedOrder.subtotal, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'الضريبة:' : 'Tax:'}</span>
                      <span>{formatCurrency(selectedOrder.tax, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'الشحن:' : 'Shipping:'}</span>
                      <span>{formatCurrency(selectedOrder.shippingCost, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                      <span>{formatCurrency(selectedOrder.total, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                {selectedOrder.status === 'pending_payment' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveOrder(selectedOrder.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isRTL ? 'تأكيد الدفع' : 'Confirm Payment'}
                  </Button>
                )}
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  {isRTL ? 'اتصال بالعميل' : 'Call Customer'}
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  {isRTL ? 'إرسال بريد' : 'Send Email'}
                </Button>
                <Button variant="outline" className="text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  {isRTL ? 'رفض الطلب' : 'Reject Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default PendingOrdersPage