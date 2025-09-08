import React, { useState } from 'react'
import { Search, Filter, Eye, Package, Truck, MapPin, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'

interface Shipment {
  id: string
  orderId: string
  customerName: string
  customerAddress: string
  city: string
  productName: string
  trackingNumber?: string
  carrier: string
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  shippingDate: string
  estimatedDelivery: string
  actualDelivery?: string
  shippingCost: number
  weight: number
}

const mockShipments: Shipment[] = [
  {
    id: 'SH001',
    orderId: 'ORD001234',
    customerName: 'Ahmed Mohammed Al-Ahmad',
    customerAddress: 'شارع الملك فهد، حي العليا',
    city: 'الرياض',
    productName: 'مكائن صناعية - طراز A100',
    trackingNumber: 'TR123456789',
    carrier: 'البريد السعودي',
    status: 'in_transit',
    shippingDate: '2024-01-18',
    estimatedDelivery: '2024-01-22',
    shippingCost: 120,
    weight: 25.5
  },
  {
    id: 'SH002',
    orderId: 'ORD001235',
    customerName: 'فاطمة علي السعيد',
    customerAddress: 'طريق الملك عبدالعزيز، حي النهضة',
    city: 'جدة',
    productName: 'قطع غيار صناعية متنوعة',
    trackingNumber: 'TR123456790',
    carrier: 'أرامكس',
    status: 'delivered',
    shippingDate: '2024-01-15',
    estimatedDelivery: '2024-01-19',
    actualDelivery: '2024-01-19',
    shippingCost: 85,
    weight: 12.3
  },
  {
    id: 'SH003',
    orderId: 'ORD001236',
    customerName: 'خالد سعد المطيري',
    customerAddress: 'شارع الأمير سلطان، حي الفيصلية',
    city: 'الدمام',
    productName: 'أدوات قياس دقيقة',
    carrier: 'فيدكس',
    status: 'pending',
    shippingDate: '2024-01-20',
    estimatedDelivery: '2024-01-24',
    shippingCost: 150,
    weight: 8.7
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد الانتظار</Badge>
    case 'picked_up':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">تم الاستلام</Badge>
    case 'in_transit':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">في الطريق</Badge>
    case 'out_for_delivery':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">خارج للتوصيل</Badge>
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">تم التوصيل</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">فشل التوصيل</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />
    case 'picked_up':
      return <Package className="w-4 h-4 text-blue-600" />
    case 'in_transit':
      return <Truck className="w-4 h-4 text-purple-600" />
    case 'out_for_delivery':
      return <MapPin className="w-4 h-4 text-orange-600" />
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'failed':
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    default:
      return <Package className="w-4 h-4 text-gray-600" />
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

const getCarrierLogo = (carrier: string) => {
  const logos: { [key: string]: string } = {
    'البريد السعودي': '📮',
    'أرامكس': '📦',
    'فيدكس': '✈️',
    'دي إتش إل': '🚚',
    'سمسا': '🏃‍♂️'
  }
  return logos[carrier] || '📦'
}

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.customerName.includes(searchTerm) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.productName.includes(searchTerm)
    const matchesStatus = selectedStatus === 'all' || shipment.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (shipmentId: string, newStatus: Shipment['status']) => {
    setShipments(shipments.map(ship => 
      ship.id === shipmentId ? { ...ship, status: newStatus } : ship
    ))
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الشحن والتوصيل</h1>
          <p className="text-gray-600">تتبع ومراقبة جميع شحنات المنتجات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Package className="w-4 h-4" />
            شحنة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الشحنات</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
              <p className="text-xs text-blue-600">هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">في الطريق</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'in_transit').length}
              </p>
              <p className="text-xs text-purple-600">قيد التوصيل</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">تم التوصيل</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'delivered').length}
              </p>
              <p className="text-xs text-green-600">مكتمل</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">تكلفة الشحن</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatSARCurrency(shipments.reduce((sum, ship) => sum + ship.shippingCost, 0))}
              </p>
              <p className="text-xs text-orange-600">هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
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
              placeholder="البحث في الشحنات..."
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
            <option value="pending">قيد الانتظار</option>
            <option value="picked_up">تم الاستلام</option>
            <option value="in_transit">في الطريق</option>
            <option value="out_for_delivery">خارج للتوصيل</option>
            <option value="delivered">تم التوصيل</option>
            <option value="failed">فشل التوصيل</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الشحنة</TableHead>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المدينة</TableHead>
              <TableHead className="text-right">شركة الشحن</TableHead>
              <TableHead className="text-right">رقم التتبع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">التوصيل المتوقع</TableHead>
              <TableHead className="text-right">التكلفة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium text-right">{shipment.id}</TableCell>
                <TableCell className="text-right">{shipment.orderId}</TableCell>
                <TableCell className="text-right">{shipment.customerName}</TableCell>
                <TableCell className="text-right">{shipment.city}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCarrierLogo(shipment.carrier)}</span>
                    <span>{shipment.carrier}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {shipment.trackingNumber || 'غير محدد'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(shipment.status)}
                    {getStatusBadge(shipment.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatDate(shipment.estimatedDelivery)}</TableCell>
                <TableCell className="text-right font-medium text-blue-600">
                  {formatSARCurrency(shipment.shippingCost)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل الشحنة</DialogTitle>
                        </DialogHeader>
                        {selectedShipment && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">معلومات الشحنة</h3>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">رقم الشحنة</label>
                                    <p className="text-lg font-semibold">{selectedShipment.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">رقم الطلب</label>
                                    <p>{selectedShipment.orderId}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">رقم التتبع</label>
                                    <p className="font-mono text-sm">
                                      {selectedShipment.trackingNumber || 'غير محدد'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">شركة الشحن</label>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{getCarrierLogo(selectedShipment.carrier)}</span>
                                      <span>{selectedShipment.carrier}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">معلومات العميل</h3>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">اسم العميل</label>
                                    <p>{selectedShipment.customerName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">العنوان</label>
                                    <p>{selectedShipment.customerAddress}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">المدينة</label>
                                    <p>{selectedShipment.city}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg mb-4">معلومات المنتج</h3>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{selectedShipment.productName}</p>
                                <div className="mt-2 flex gap-6 text-sm text-gray-600">
                                  <span>الوزن: {selectedShipment.weight} كجم</span>
                                  <span>التكلفة: {formatSARCurrency(selectedShipment.shippingCost)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg mb-4">تتبع الشحنة</h3>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    {getStatusIcon(selectedShipment.status)}
                                    {getStatusBadge(selectedShipment.status)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {selectedShipment.status === 'delivered' && selectedShipment.actualDelivery
                                      ? `تم التوصيل في: ${formatDate(selectedShipment.actualDelivery)}`
                                      : `التوصيل المتوقع: ${formatDate(selectedShipment.estimatedDelivery)}`
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedShipment(null)}
                              >
                                إغلاق
                              </Button>
                              {selectedShipment.trackingNumber && (
                                <Button variant="outline" className="bg-blue-50">
                                  تتبع الشحنة
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-right">
                        {shipment.status === 'pending' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'picked_up')}
                          >
                            <Package className="w-4 h-4 ml-2" />
                            تم الاستلام
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'picked_up' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'in_transit')}
                          >
                            <Truck className="w-4 h-4 ml-2" />
                            في الطريق
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'in_transit' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'out_for_delivery')}
                          >
                            <MapPin className="w-4 h-4 ml-2" />
                            خارج للتوصيل
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'out_for_delivery' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'delivered')}
                          >
                            <CheckCircle className="w-4 h-4 ml-2" />
                            تم التوصيل
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              عرض 1 إلى {filteredShipments.length} من أصل {shipments.length} شحنة
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
    </div>
  )
}