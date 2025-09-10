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
} from '@/shared/components/ui'
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Phone,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
  DollarSign,
} from 'lucide-react'

interface ShippingOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  city: string
  postalCode: string
  shippingMethod: 'standard' | 'express' | 'overnight' | 'pickup'
  trackingNumber?: string
  carrier: 'dhl' | 'fedex' | 'aramex' | 'smsa' | 'local'
  status: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed_delivery' | 'returned'
  estimatedDelivery: string
  actualDelivery?: string
  shippingCost: number
  weight: number
  dimensions: string
  items: Array<{
    name: string
    quantity: number
    sku: string
  }>
  sellerName: string
  shippedAt?: string
  createdAt: string
  lastUpdate: string
  deliveryAttempts: number
  notes?: string
}

const mockShippingOrders: ShippingOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'أحمد محمد',
    customerPhone: '+966501234567',
    customerAddress: 'شارع الملك فهد، حي النخيل، الرياض',
    city: 'الرياض',
    postalCode: '12345',
    shippingMethod: 'express',
    trackingNumber: 'DHL123456789',
    carrier: 'dhl',
    status: 'in_transit',
    estimatedDelivery: '2024-01-15',
    shippingCost: 25.00,
    weight: 1.2,
    dimensions: '30x20x10 cm',
    items: [
      { name: 'جهاز كمبيوتر محمول', quantity: 1, sku: 'LAPTOP-001' },
      { name: 'ماوس لاسلكي', quantity: 1, sku: 'MOUSE-001' }
    ],
    sellerName: 'متجر التقنية',
    shippedAt: '2024-01-12T10:30:00Z',
    createdAt: '2024-01-10T14:20:00Z',
    lastUpdate: '2024-01-13T16:45:00Z',
    deliveryAttempts: 0,
    notes: 'عنوان صحيح، العميل متاح'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'فاطمة علي',
    customerPhone: '+966509876543',
    customerAddress: 'طريق الملك عبدالله، حي المروج، جدة',
    city: 'جدة',
    postalCode: '54321',
    shippingMethod: 'standard',
    trackingNumber: 'FDX987654321',
    carrier: 'fedex',
    status: 'out_for_delivery',
    estimatedDelivery: '2024-01-14',
    shippingCost: 15.00,
    weight: 0.5,
    dimensions: '25x15x5 cm',
    items: [
      { name: 'كتاب طبخ', quantity: 2, sku: 'BOOK-001' }
    ],
    sellerName: 'مكتبة المعرفة',
    shippedAt: '2024-01-11T09:15:00Z',
    createdAt: '2024-01-09T11:30:00Z',
    lastUpdate: '2024-01-14T08:20:00Z',
    deliveryAttempts: 0
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'خالد السعد',
    customerPhone: '+966502468135',
    customerAddress: 'شارع الأمير سلطان، حي الحمراء، الدمام',
    city: 'الدمام',
    postalCode: '67890',
    shippingMethod: 'overnight',
    trackingNumber: 'ARM456789123',
    carrier: 'aramex',
    status: 'failed_delivery',
    estimatedDelivery: '2024-01-13',
    shippingCost: 35.00,
    weight: 2.1,
    dimensions: '40x30x15 cm',
    items: [
      { name: 'طابعة ليزر', quantity: 1, sku: 'PRINTER-001' }
    ],
    sellerName: 'متجر المكتبيات',
    shippedAt: '2024-01-12T14:00:00Z',
    createdAt: '2024-01-11T16:45:00Z',
    lastUpdate: '2024-01-13T17:30:00Z',
    deliveryAttempts: 2,
    notes: 'العميل غير متاح، محاولة إعادة التوصيل'
  }
]

const statusConfig = {
  preparing: { label: 'جاري التحضير', labelEn: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'تم الشحن', labelEn: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  in_transit: { label: 'في الطريق', labelEn: 'In Transit', color: 'bg-yellow-100 text-yellow-800', icon: MapPin },
  out_for_delivery: { label: 'خارج للتوصيل', labelEn: 'Out for Delivery', color: 'bg-orange-100 text-orange-800', icon: Truck },
  delivered: { label: 'تم التوصيل', labelEn: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed_delivery: { label: 'فشل التوصيل', labelEn: 'Failed Delivery', color: 'bg-red-100 text-red-800', icon: XCircle },
  returned: { label: 'مُرتجع', labelEn: 'Returned', color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
}

const carrierConfig = {
  dhl: { name: 'DHL', trackingUrl: 'https://www.dhl.com/sa-en/home/tracking.html?tracking-id=' },
  fedex: { name: 'FedEx', trackingUrl: 'https://www.fedex.com/sa-english/tracking.html?trackingnumber=' },
  aramex: { name: 'Aramex', trackingUrl: 'https://www.aramex.com/sa/en/track/shipments?tracking_number=' },
  smsa: { name: 'SMSA', trackingUrl: 'https://www.smsa.com.sa/ar/tracking/?track=' },
  local: { name: 'Local Delivery', trackingUrl: '#' }
}

const Shipping: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [carrierFilter, setCarrierFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null)

  const filteredOrders = useMemo(() => {
    return mockShippingOrders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.city.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const matchesCarrier = carrierFilter === 'all' || order.carrier === carrierFilter
      
      return matchesSearch && matchesStatus && matchesCarrier
    })
  }, [searchTerm, statusFilter, carrierFilter])

  const getOrderStats = () => {
    const stats = {
      total: mockShippingOrders.length,
      preparing: 0,
      shipped: 0,
      inTransit: 0,
      outForDelivery: 0,
      delivered: 0,
      failedDelivery: 0
    }

    mockShippingOrders.forEach(order => {
      switch (order.status) {
        case 'preparing': stats.preparing++; break
        case 'shipped': stats.shipped++; break
        case 'in_transit': stats.inTransit++; break
        case 'out_for_delivery': stats.outForDelivery++; break
        case 'delivered': stats.delivered++; break
        case 'failed_delivery': stats.failedDelivery++; break
      }
    })

    return stats
  }

  const stats = getOrderStats()

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

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الشحن</h1>
          <p className="text-muted-foreground mt-1">
            متابعة وإدارة حالة شحن الطلبات
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">قيد التحضير</p>
                <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
              </div>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">في الطريق</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inTransit}</p>
              </div>
              <MapPin className="h-4 w-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">خارج للتوصيل</p>
                <p className="text-2xl font-bold text-orange-600">{stats.outForDelivery}</p>
              </div>
              <Truck className="h-4 w-4 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">تم التوصيل</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">فشل التوصيل</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedDelivery}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-red-600" />
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
                  placeholder="البحث برقم الطلب، اسم العميل، رقم التتبع..."
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
                <SelectItem value="preparing">جاري التحضير</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="in_transit">في الطريق</SelectItem>
                <SelectItem value="out_for_delivery">خارج للتوصيل</SelectItem>
                <SelectItem value="delivered">تم التوصيل</SelectItem>
                <SelectItem value="failed_delivery">فشل التوصيل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية بشركة الشحن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الشركات</SelectItem>
                <SelectItem value="dhl">DHL</SelectItem>
                <SelectItem value="fedex">FedEx</SelectItem>
                <SelectItem value="aramex">Aramex</SelectItem>
                <SelectItem value="smsa">SMSA</SelectItem>
                <SelectItem value="local">التوصيل المحلي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>طلبات الشحن ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead>شركة الشحن</TableHead>
                <TableHead>رقم التتبع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التوصيل المتوقع</TableHead>
                <TableHead>التكلفة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {carrierConfig[order.carrier].name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.trackingNumber ? (
                        <a
                          href={`${carrierConfig[order.carrier].trackingUrl}${order.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-mono text-sm"
                        >
                          {order.trackingNumber}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[order.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.estimatedDelivery)}</TableCell>
                    <TableCell>{order.shippingCost.toFixed(2)} ر.س</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto" dir="rtl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الشحن - {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                              معلومات مفصلة عن حالة الشحن والتوصيل
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedOrder && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                                <TabsTrigger value="tracking">التتبع</TabsTrigger>
                                <TabsTrigger value="items">المنتجات</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Customer Info */}
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
                                        <p className="mt-1">{selectedOrder.customerName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">رقم الهاتف</label>
                                        <p className="mt-1">{selectedOrder.customerPhone}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">العنوان</label>
                                        <p className="mt-1">{selectedOrder.customerAddress}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedOrder.city} - {selectedOrder.postalCode}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Shipping Info */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        معلومات الشحن
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">شركة الشحن</label>
                                        <p className="mt-1">
                                          <Badge variant="outline">
                                            {carrierConfig[selectedOrder.carrier].name}
                                          </Badge>
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">رقم التتبع</label>
                                        <p className="mt-1 font-mono">{selectedOrder.trackingNumber || 'غير متوفر'}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">طريقة الشحن</label>
                                        <p className="mt-1 capitalize">{selectedOrder.shippingMethod}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">الوزن والأبعاد</label>
                                        <p className="mt-1">{selectedOrder.weight} كجم - {selectedOrder.dimensions}</p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Order Status */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        حالة الطلب
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">الحالة الحالية</label>
                                        <div className="mt-1">
                                          <Badge className={statusConfig[selectedOrder.status].color}>
                                            {statusConfig[selectedOrder.status].label}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">التوصيل المتوقع</label>
                                        <p className="mt-1">{formatDate(selectedOrder.estimatedDelivery)}</p>
                                      </div>
                                      {selectedOrder.actualDelivery && (
                                        <div>
                                          <label className="text-sm font-medium">التوصيل الفعلي</label>
                                          <p className="mt-1">{formatDate(selectedOrder.actualDelivery)}</p>
                                        </div>
                                      )}
                                      <div>
                                        <label className="text-sm font-medium">محاولات التوصيل</label>
                                        <p className="mt-1">{selectedOrder.deliveryAttempts}</p>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Seller & Cost Info */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        معلومات إضافية
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div>
                                        <label className="text-sm font-medium">البائع</label>
                                        <p className="mt-1">{selectedOrder.sellerName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">تكلفة الشحن</label>
                                        <p className="mt-1">{selectedOrder.shippingCost.toFixed(2)} ر.س</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">تاريخ الشحن</label>
                                        <p className="mt-1">
                                          {selectedOrder.shippedAt 
                                            ? formatDateTime(selectedOrder.shippedAt)
                                            : 'لم يتم الشحن بعد'
                                          }
                                        </p>
                                      </div>
                                      {selectedOrder.notes && (
                                        <div>
                                          <label className="text-sm font-medium">ملاحظات</label>
                                          <p className="mt-1 text-sm bg-muted p-2 rounded">{selectedOrder.notes}</p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="tracking" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>تتبع الشحنة</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div>
                                          <p className="font-medium">تم إنشاء الطلب</p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatDateTime(selectedOrder.createdAt)}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {selectedOrder.shippedAt && (
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                                          <Truck className="h-5 w-5 text-blue-600" />
                                          <div>
                                            <p className="font-medium">تم الشحن</p>
                                            <p className="text-sm text-muted-foreground">
                                              {formatDateTime(selectedOrder.shippedAt)}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                                        <Clock className="h-5 w-5 text-gray-600" />
                                        <div>
                                          <p className="font-medium">آخر تحديث</p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatDateTime(selectedOrder.lastUpdate)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              
                              <TabsContent value="items" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>منتجات الطلب</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">رمز المنتج: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-medium">الكمية: {item.quantity}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
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

export default Shipping