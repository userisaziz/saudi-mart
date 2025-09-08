import React, { useState } from 'react'
import { Search, Filter, Eye, Download, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
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

interface Return {
  id: string
  orderId: string
  customerName: string
  productName: string
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'
  returnDate: string
  refundAmount: number
  notes?: string
}

const mockReturns: Return[] = [
  {
    id: 'RET001',
    orderId: 'ORD001234',
    customerName: 'أحمد محمد',
    productName: 'مكائن صناعية - طراز A100',
    reason: 'عيب في المنتج',
    status: 'pending',
    returnDate: '2024-01-20',
    refundAmount: 2500,
    notes: 'العميل يشكو من عطل في المحرك'
  },
  {
    id: 'RET002',
    orderId: 'ORD001235',
    customerName: 'فاطمة علي',
    productName: 'قطع غيار صناعية',
    reason: 'منتج غير مطابق للمواصفات',
    status: 'approved',
    returnDate: '2024-01-19',
    refundAmount: 850,
    notes: 'تمت الموافقة على الاستبدال'
  },
  {
    id: 'RET003',
    orderId: 'ORD001236',
    customerName: 'خالد سعد',
    productName: 'أدوات قياس',
    reason: 'تغيير رأي العميل',
    status: 'rejected',
    returnDate: '2024-01-18',
    refundAmount: 450,
    notes: 'تم تجاوز فترة الإرجاع المسموح بها'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد الانتظار</Badge>
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">موافق عليه</Badge>
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مرفوض</Badge>
    case 'processing':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">قيد المعالجة</Badge>
    case 'completed':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">مكتمل</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'rejected':
      return <XCircle className="w-4 h-4 text-red-600" />
    case 'processing':
      return <RefreshCw className="w-4 h-4 text-blue-600" />
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-purple-600" />
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-600" />
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

export default function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>(mockReturns)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null)

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.customerName.includes(searchTerm) ||
                         returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.productName.includes(searchTerm)
    const matchesStatus = selectedStatus === 'all' || returnItem.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (returnId: string, newStatus: Return['status']) => {
    setReturns(returns.map(ret => 
      ret.id === returnId ? { ...ret, status: newStatus } : ret
    ))
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المرتجعات</h1>
          <p className="text-gray-600">تتبع ومعالجة طلبات إرجاع المنتجات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المرتجعات</p>
              <p className="text-2xl font-bold text-gray-900">{returns.length}</p>
              <p className="text-xs text-blue-600">هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">
                {returns.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-xs text-yellow-600">يحتاج مراجعة</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المعتمدة</p>
              <p className="text-2xl font-bold text-gray-900">
                {returns.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-xs text-green-600">تمت الموافقة</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المبالغ المردودة</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatSARCurrency(returns.reduce((sum, ret) => sum + ret.refundAmount, 0))}
              </p>
              <p className="text-xs text-red-600">هذا الشهر</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
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
              placeholder="البحث في المرتجعات..."
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
            <option value="approved">موافق عليه</option>
            <option value="rejected">مرفوض</option>
            <option value="processing">قيد المعالجة</option>
            <option value="completed">مكتمل</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم المرتجع</TableHead>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المنتج</TableHead>
              <TableHead className="text-right">السبب</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ الطلب</TableHead>
              <TableHead className="text-right">المبلغ المردود</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReturns.map((returnItem) => (
              <TableRow key={returnItem.id}>
                <TableCell className="font-medium text-right">{returnItem.id}</TableCell>
                <TableCell className="text-right">{returnItem.orderId}</TableCell>
                <TableCell className="text-right">{returnItem.customerName}</TableCell>
                <TableCell className="text-right">{returnItem.productName}</TableCell>
                <TableCell className="text-right">{returnItem.reason}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(returnItem.status)}
                    {getStatusBadge(returnItem.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatDate(returnItem.returnDate)}</TableCell>
                <TableCell className="text-right font-medium text-red-600">
                  {formatSARCurrency(returnItem.refundAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReturn(returnItem)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل المرتجع</DialogTitle>
                        </DialogHeader>
                        {selectedReturn && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">رقم المرتجع</label>
                                <p className="text-lg font-semibold">{selectedReturn.id}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">رقم الطلب</label>
                                <p className="text-lg">{selectedReturn.orderId}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600">العميل</label>
                                <p>{selectedReturn.customerName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">المبلغ المردود</label>
                                <p className="font-semibold text-red-600">
                                  {formatSARCurrency(selectedReturn.refundAmount)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-600">المنتج</label>
                              <p className="mt-1">{selectedReturn.productName}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-600">سبب الإرجاع</label>
                              <p className="mt-1">{selectedReturn.reason}</p>
                            </div>

                            {selectedReturn.notes && (
                              <div>
                                <label className="text-sm font-medium text-gray-600">ملاحظات</label>
                                <p className="mt-1 text-sm text-gray-700">{selectedReturn.notes}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">الحالة:</span>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(selectedReturn.status)}
                                  {getStatusBadge(selectedReturn.status)}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedReturn(null)}
                              >
                                إغلاق
                              </Button>
                              {selectedReturn.status === 'pending' && (
                                <>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      handleStatusChange(selectedReturn.id, 'rejected')
                                      setSelectedReturn(null)
                                    }}
                                  >
                                    رفض
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleStatusChange(selectedReturn.id, 'approved')
                                      setSelectedReturn(null)
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    موافقة
                                  </Button>
                                </>
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
                        {returnItem.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(returnItem.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4 ml-2" />
                              موافقة
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(returnItem.id, 'rejected')}
                            >
                              <XCircle className="w-4 h-4 ml-2" />
                              رفض
                            </DropdownMenuItem>
                          </>
                        )}
                        {returnItem.status === 'approved' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(returnItem.id, 'processing')}
                          >
                            <RefreshCw className="w-4 h-4 ml-2" />
                            بدء المعالجة
                          </DropdownMenuItem>
                        )}
                        {returnItem.status === 'processing' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(returnItem.id, 'completed')}
                          >
                            <CheckCircle className="w-4 h-4 ml-2" />
                            إكمال
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
              عرض 1 إلى {filteredReturns.length} من أصل {returns.length} مرتجع
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