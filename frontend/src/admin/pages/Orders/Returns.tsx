import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@/shared/components/ui'
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Download,
  RefreshCw,
  User,
  Package,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  Camera,
} from 'lucide-react'

interface ReturnOrder {
  id: string
  orderNumber: string
  returnNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  itemName: string
  itemSku: string
  itemQuantity: number
  itemPrice: number
  returnReason: 'defective' | 'not_as_described' | 'wrong_item' | 'changed_mind' | 'damaged_shipping' | 'quality_issues'
  returnType: 'refund' | 'exchange' | 'store_credit'
  status: 'requested' | 'approved' | 'rejected' | 'item_received' | 'inspecting' | 'processed' | 'refund_issued' | 'exchange_sent'
  requestDate: string
  approvalDate?: string
  completionDate?: string
  refundAmount?: number
  sellerName: string
  customerNotes: string
  adminNotes?: string
  images?: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  originalOrderDate: string
  shippingCost: number
  restockFee?: number
}

const mockReturnOrders: ReturnOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    returnNumber: 'RET-2024-001',
    customerName: 'أحمد محمد',
    customerPhone: '+966501234567',
    customerEmail: 'ahmed@example.com',
    itemName: 'جهاز كمبيوتر محمول',
    itemSku: 'LAPTOP-001',
    itemQuantity: 1,
    itemPrice: 2500.00,
    returnReason: 'defective',
    returnType: 'refund',
    status: 'inspecting',
    requestDate: '2024-01-15T10:30:00Z',
    approvalDate: '2024-01-16T14:20:00Z',
    refundAmount: 2500.00,
    sellerName: 'متجر التقنية',
    customerNotes: 'الجهاز لا يعمل بشكل صحيح، الشاشة لا تعرض أي شيء',
    adminNotes: 'تم استلام المنتج، جاري الفحص',
    images: ['image1.jpg', 'image2.jpg'],
    priority: 'high',
    originalOrderDate: '2024-01-10T14:20:00Z',
    shippingCost: 25.00
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    returnNumber: 'RET-2024-002',
    customerName: 'فاطمة علي',
    customerPhone: '+966509876543',
    customerEmail: 'fatima@example.com',
    itemName: 'كتاب طبخ',
    itemSku: 'BOOK-001',
    itemQuantity: 1,
    itemPrice: 75.00,
    returnReason: 'not_as_described',
    returnType: 'exchange',
    status: 'requested',
    requestDate: '2024-01-16T09:15:00Z',
    sellerName: 'مكتبة المعرفة',
    customerNotes: 'الكتاب مختلف عن الوصف المذكور في الموقع',
    priority: 'medium',
    originalOrderDate: '2024-01-09T11:30:00Z',
    shippingCost: 15.00
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    returnNumber: 'RET-2024-003',
    customerName: 'خالد السعد',
    customerPhone: '+966502468135',
    customerEmail: 'khalid@example.com',
    itemName: 'طابعة ليزر',
    itemSku: 'PRINTER-001',
    itemQuantity: 1,
    itemPrice: 800.00,
    returnReason: 'damaged_shipping',
    returnType: 'refund',
    status: 'refund_issued',
    requestDate: '2024-01-14T16:45:00Z',
    approvalDate: '2024-01-15T10:30:00Z',
    completionDate: '2024-01-18T14:00:00Z',
    refundAmount: 800.00,
    sellerName: 'متجر المكتبيات',
    customerNotes: 'وصلت الطابعة مكسورة بسبب سوء التعبئة',
    adminNotes: 'تم إصدار استرداد كامل للعميل',
    images: ['damage1.jpg', 'damage2.jpg', 'damage3.jpg'],
    priority: 'urgent',
    originalOrderDate: '2024-01-11T16:45:00Z',
    shippingCost: 35.00
  }
]

const statusConfig = {
  requested: { label: 'مطلوب', labelEn: 'Requested', color: 'bg-blue-100 text-blue-800', icon: AlertTriangle },
  approved: { label: 'موافق عليه', labelEn: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'مرفوض', labelEn: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  item_received: { label: 'تم استلام المنتج', labelEn: 'Item Received', color: 'bg-purple-100 text-purple-800', icon: Package },
  inspecting: { label: 'قيد الفحص', labelEn: 'Inspecting', color: 'bg-orange-100 text-orange-800', icon: Eye },
  processed: { label: 'تم المعالجة', labelEn: 'Processed', color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle },
  refund_issued: { label: 'تم الاسترداد', labelEn: 'Refund Issued', color: 'bg-green-100 text-green-800', icon: DollarSign },
  exchange_sent: { label: 'تم إرسال البديل', labelEn: 'Exchange Sent', color: 'bg-cyan-100 text-cyan-800', icon: RotateCcw }
}

const reasonConfig = {
  defective: { label: 'معيب', labelEn: 'Defective' },
  not_as_described: { label: 'مختلف عن الوصف', labelEn: 'Not as Described' },
  wrong_item: { label: 'منتج خاطئ', labelEn: 'Wrong Item' },
  changed_mind: { label: 'تغيير الرأي', labelEn: 'Changed Mind' },
  damaged_shipping: { label: 'تضرر أثناء الشحن', labelEn: 'Damaged in Shipping' },
  quality_issues: { label: 'مشاكل في الجودة', labelEn: 'Quality Issues' }
}

const priorityConfig = {
  low: { label: 'منخفضة', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'متوسطة', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'عالية', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: 'عاجلة', color: 'bg-red-100 text-red-800' }
}

const Returns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [reasonFilter, setReasonFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedReturn, setSelectedReturn] = useState<ReturnOrder | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const filteredReturns = useMemo(() => {
    return mockReturnOrders.filter(returnOrder => {
      const matchesSearch = 
        returnOrder.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnOrder.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnOrder.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || returnOrder.status === statusFilter
      const matchesReason = reasonFilter === 'all' || returnOrder.returnReason === reasonFilter
      const matchesPriority = priorityFilter === 'all' || returnOrder.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesReason && matchesPriority
    })
  }, [searchTerm, statusFilter, reasonFilter, priorityFilter])

  const getReturnStats = () => {
    const stats = {
      total: mockReturnOrders.length,
      requested: 0,
      approved: 0,
      rejected: 0,
      inspecting: 0,
      processed: 0,
      refundIssued: 0,
      totalRefundAmount: 0
    }

    mockReturnOrders.forEach(returnOrder => {
      switch (returnOrder.status) {
        case 'requested': stats.requested++; break
        case 'approved': stats.approved++; break
        case 'rejected': stats.rejected++; break
        case 'inspecting': stats.inspecting++; break
        case 'processed': stats.processed++; break
        case 'refund_issued': 
          stats.refundIssued++
          stats.totalRefundAmount += returnOrder.refundAmount || 0
          break
      }
    })

    return stats
  }

  const stats = getReturnStats()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleApprove = (returnOrder: ReturnOrder) => {
    console.log('Approving return:', returnOrder.returnNumber)
  }

  const handleReject = (returnOrder: ReturnOrder) => {
    console.log('Rejecting return:', returnOrder.returnNumber)
  }

  const handleProcessRefund = (returnOrder: ReturnOrder) => {
    console.log('Processing refund:', returnOrder.returnNumber)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المرتجعات</h1>
          <p className="text-muted-foreground mt-1">
            متابعة وإدارة طلبات الإرجاع والاسترداد
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي المرتجعات</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">طلبات جديدة</p>
                <p className="text-2xl font-bold text-blue-600">{stats.requested}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">قيد الفحص</p>
                <p className="text-2xl font-bold text-orange-600">{stats.inspecting}</p>
              </div>
              <Eye className="h-4 w-4 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">تم الاسترداد</p>
                <p className="text-2xl font-bold text-green-600">{stats.refundIssued}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">مجموع المبالغ</p>
                <p className="text-xl font-bold text-green-600">{stats.totalRefundAmount.toFixed(2)} ر.س</p>
              </div>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">مرفوضة</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث برقم الطلب، اسم العميل، رقم الإرجاع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="requested">مطلوب</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="item_received">تم استلام المنتج</SelectItem>
                <SelectItem value="inspecting">قيد الفحص</SelectItem>
                <SelectItem value="processed">تم المعالجة</SelectItem>
                <SelectItem value="refund_issued">تم الاسترداد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية بالسبب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأسباب</SelectItem>
                <SelectItem value="defective">معيب</SelectItem>
                <SelectItem value="not_as_described">مختلف عن الوصف</SelectItem>
                <SelectItem value="wrong_item">منتج خاطئ</SelectItem>
                <SelectItem value="changed_mind">تغيير الرأي</SelectItem>
                <SelectItem value="damaged_shipping">تضرر أثناء الشحن</SelectItem>
                <SelectItem value="quality_issues">مشاكل في الجودة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="urgent">عاجلة</SelectItem>
                <SelectItem value="high">عالية</SelectItem>
                <SelectItem value="medium">متوسطة</SelectItem>
                <SelectItem value="low">منخفضة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>طلبات الإرجاع ({filteredReturns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الإرجاع</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>السبب</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الطلب</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.map((returnOrder) => {
                const StatusIcon = statusConfig[returnOrder.status].icon
                return (
                  <TableRow key={returnOrder.id}>
                    <TableCell className="font-medium">{returnOrder.returnNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{returnOrder.customerName}</div>
                        <div className="text-sm text-muted-foreground">{returnOrder.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{returnOrder.itemName}</div>
                        <div className="text-sm text-muted-foreground">كمية: {returnOrder.itemQuantity}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {reasonConfig[returnOrder.returnReason].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{returnOrder.itemPrice.toFixed(2)} ر.س</TableCell>
                    <TableCell>
                      <Badge className={priorityConfig[returnOrder.priority].color}>
                        {priorityConfig[returnOrder.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[returnOrder.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[returnOrder.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(returnOrder.requestDate)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReturn(returnOrder)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto" dir="rtl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الإرجاع - {returnOrder.returnNumber}</DialogTitle>
                              <DialogDescription>
                                معلومات مفصلة عن طلب الإرجاع
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedReturn && (
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">التفاصيل</TabsTrigger>
                                  <TabsTrigger value="customer">العميل</TabsTrigger>
                                  <TabsTrigger value="product">المنتج</TabsTrigger>
                                  <TabsTrigger value="actions">الإجراءات</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="details" className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Return Info */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <RotateCcw className="h-5 w-5" />
                                          معلومات الإرجاع
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <label className="text-sm font-medium">رقم الإرجاع</label>
                                          <p className="mt-1 font-mono">{selectedReturn.returnNumber}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">رقم الطلب الأصلي</label>
                                          <p className="mt-1 font-mono">{selectedReturn.orderNumber}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">نوع الإرجاع</label>
                                          <p className="mt-1 capitalize">{selectedReturn.returnType}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">سبب الإرجاع</label>
                                          <p className="mt-1">
                                            <Badge variant="outline">
                                              {reasonConfig[selectedReturn.returnReason].label}
                                            </Badge>
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">الأولوية</label>
                                          <div className="mt-1">
                                            <Badge className={priorityConfig[selectedReturn.priority].color}>
                                              {priorityConfig[selectedReturn.priority].label}
                                            </Badge>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Status & Timeline */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <Calendar className="h-5 w-5" />
                                          الحالة والتوقيت
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <label className="text-sm font-medium">الحالة الحالية</label>
                                          <div className="mt-1">
                                            <Badge className={statusConfig[selectedReturn.status].color}>
                                              {statusConfig[selectedReturn.status].label}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">تاريخ الطلب</label>
                                          <p className="mt-1">{formatDateTime(selectedReturn.requestDate)}</p>
                                        </div>
                                        {selectedReturn.approvalDate && (
                                          <div>
                                            <label className="text-sm font-medium">تاريخ الموافقة</label>
                                            <p className="mt-1">{formatDateTime(selectedReturn.approvalDate)}</p>
                                          </div>
                                        )}
                                        {selectedReturn.completionDate && (
                                          <div>
                                            <label className="text-sm font-medium">تاريخ الإنجاز</label>
                                            <p className="mt-1">{formatDateTime(selectedReturn.completionDate)}</p>
                                          </div>
                                        )}
                                        <div>
                                          <label className="text-sm font-medium">تاريخ الطلب الأصلي</label>
                                          <p className="mt-1">{formatDate(selectedReturn.originalOrderDate)}</p>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Notes */}
                                    <Card className="md:col-span-2">
                                      <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                          <MessageSquare className="h-5 w-5" />
                                          الملاحظات
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium">ملاحظات العميل</label>
                                          <div className="mt-1 p-3 bg-muted rounded-md">
                                            <p className="text-sm">{selectedReturn.customerNotes}</p>
                                          </div>
                                        </div>
                                        {selectedReturn.adminNotes && (
                                          <div>
                                            <label className="text-sm font-medium">ملاحظات الإدارة</label>
                                            <div className="mt-1 p-3 bg-blue-50 rounded-md">
                                              <p className="text-sm">{selectedReturn.adminNotes}</p>
                                            </div>
                                          </div>
                                        )}
                                        {selectedReturn.images && selectedReturn.images.length > 0 && (
                                          <div>
                                            <label className="text-sm font-medium">الصور المرفقة</label>
                                            <div className="mt-1 flex gap-2">
                                              {selectedReturn.images.map((image, index) => (
                                                <div key={index} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                  <Camera className="h-6 w-6 text-gray-400" />
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                </TabsContent>
                                
                                <TabsContent value="customer" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        معلومات العميل
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">الاسم</label>
                                        <p className="mt-1">{selectedReturn.customerName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">رقم الهاتف</label>
                                        <p className="mt-1">{selectedReturn.customerPhone}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">البريد الإلكتروني</label>
                                        <p className="mt-1">{selectedReturn.customerEmail}</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="product" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        معلومات المنتج
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">اسم المنتج</label>
                                        <p className="mt-1">{selectedReturn.itemName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">رمز المنتج</label>
                                        <p className="mt-1 font-mono">{selectedReturn.itemSku}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">الكمية</label>
                                        <p className="mt-1">{selectedReturn.itemQuantity}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">السعر</label>
                                        <p className="mt-1">{selectedReturn.itemPrice.toFixed(2)} ر.س</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">البائع</label>
                                        <p className="mt-1">{selectedReturn.sellerName}</p>
                                      </div>
                                      {selectedReturn.refundAmount && (
                                        <div>
                                          <label className="text-sm font-medium">مبلغ الاسترداد</label>
                                          <p className="mt-1 font-semibold text-green-600">
                                            {selectedReturn.refundAmount.toFixed(2)} ر.س
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="actions" className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>إجراءات الإدارة</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">إضافة ملاحظة إدارية</label>
                                        <Textarea
                                          value={adminNotes}
                                          onChange={(e) => setAdminNotes(e.target.value)}
                                          placeholder="أدخل ملاحظاتك هنا..."
                                          className="mt-1"
                                        />
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        {selectedReturn.status === 'requested' && (
                                          <>
                                            <Button
                                              onClick={() => handleApprove(selectedReturn)}
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              موافقة
                                            </Button>
                                            <Button
                                              onClick={() => handleReject(selectedReturn)}
                                              variant="destructive"
                                            >
                                              <XCircle className="h-4 w-4 mr-2" />
                                              رفض
                                            </Button>
                                          </>
                                        )}
                                        
                                        {selectedReturn.status === 'approved' && (
                                          <Button
                                            onClick={() => handleProcessRefund(selectedReturn)}
                                            className="bg-blue-600 hover:bg-blue-700"
                                          >
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            معالجة الاسترداد
                                          </Button>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>

                        {returnOrder.status === 'requested' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(returnOrder)}
                              className="bg-green-600 hover:bg-green-700 text-xs"
                            >
                              موافقة
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(returnOrder)}
                              className="text-xs"
                            >
                              رفض
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Returns