import React, { useState } from 'react'
import { Search, Filter, Download, Send, Eye, Plus, Calendar, FileText, DollarSign } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  amount: number
  dueDate: string
  issueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2024-001',
    customerName: 'أحمد محمد الأحمد',
    amount: 15000,
    dueDate: '2024-02-15',
    issueDate: '2024-01-15',
    status: 'sent',
    items: [
      { name: 'ماكينة صناعية A100', quantity: 1, price: 15000 }
    ]
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-2024-002',
    customerName: 'فاطمة علي السعيد',
    amount: 8500,
    dueDate: '2024-02-20',
    issueDate: '2024-01-20',
    status: 'paid',
    items: [
      { name: 'قطع غيار متنوعة', quantity: 5, price: 1700 }
    ]
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800">مسودة</Badge>
    case 'sent':
      return <Badge className="bg-blue-100 text-blue-800">مُرسلة</Badge>
    case 'paid':
      return <Badge className="bg-green-100 text-green-800">مدفوعة</Badge>
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800">متأخرة</Badge>
    case 'cancelled':
      return <Badge className="bg-gray-100 text-gray-800">ملغية</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الفواتير</h1>
          <p className="text-gray-600">إنشاء وإدارة وتتبع الفواتير</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 ml-2" />
          فاتورة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الفواتير</p>
              <p className="text-2xl font-bold text-gray-900">{formatSARCurrency(totalAmount)}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المبالغ المدفوعة</p>
              <p className="text-2xl font-bold text-green-600">{formatSARCurrency(paidAmount)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المبالغ المعلقة</p>
              <p className="text-2xl font-bold text-orange-600">{formatSARCurrency(pendingAmount)}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">عدد الفواتير</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="البحث في الفواتير..." className="pr-10 text-right" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              تصفية
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الفاتورة</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">تاريخ الإصدار</TableHead>
              <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium text-right">{invoice.invoiceNumber}</TableCell>
                <TableCell className="text-right">{invoice.customerName}</TableCell>
                <TableCell className="text-right font-semibold">{formatSARCurrency(invoice.amount)}</TableCell>
                <TableCell className="text-right">{invoice.issueDate}</TableCell>
                <TableCell className="text-right">{invoice.dueDate}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل الفاتورة</DialogTitle>
                        </DialogHeader>
                        {selectedInvoice && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">رقم الفاتورة</label>
                                <p className="text-lg font-semibold">{selectedInvoice.invoiceNumber}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">العميل</label>
                                <p>{selectedInvoice.customerName}</p>
                              </div>
                            </div>
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">تفاصيل البنود</h4>
                              {selectedInvoice.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-2">
                                  <span>{item.name}</span>
                                  <span>{formatSARCurrency(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="border-t pt-2 flex justify-between font-bold">
                                <span>الإجمالي</span>
                                <span>{formatSARCurrency(selectedInvoice.amount)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}