import React, { useState } from 'react'
import { Plus, Edit, Trash2, Phone, Mail, User, Building, MapPin } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'

interface Contact {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  mobile?: string
  isPrimary: boolean
  type: 'internal' | 'customer' | 'supplier' | 'partner'
}

const mockContacts: Contact[] = [
  {
    id: 'C001',
    name: 'أحمد محمد الأحمد',
    position: 'مدير المبيعات',
    department: 'المبيعات والتسويق',
    email: 'ahmed@company.com',
    phone: '+966112345678',
    mobile: '+966501234567',
    isPrimary: true,
    type: 'internal'
  },
  {
    id: 'C002',
    name: 'فاطمة علي السعيد',
    position: 'مديرة الشراء',
    department: 'المشتريات',
    email: 'fatima@client.com',
    phone: '+966112345679',
    mobile: '+966502345678',
    isPrimary: false,
    type: 'customer'
  },
  {
    id: 'C003',
    name: 'خالد سعد المطيري',
    position: 'مسؤول التوريد',
    department: 'العمليات',
    email: 'khalid@supplier.com',
    phone: '+966112345680',
    isPrimary: false,
    type: 'supplier'
  }
]

const getTypeBadge = (type: string) => {
  const typeMap: { [key: string]: { label: string; color: string } } = {
    internal: { label: 'داخلي', color: 'bg-blue-100 text-blue-800' },
    customer: { label: 'عميل', color: 'bg-green-100 text-green-800' },
    supplier: { label: 'مورد', color: 'bg-purple-100 text-purple-800' },
    partner: { label: 'شريك', color: 'bg-orange-100 text-orange-800' }
  }
  const typeInfo = typeMap[type] || typeMap.internal
  return <Badge className={`${typeInfo.color} hover:${typeInfo.color}`}>{typeInfo.label}</Badge>
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts.filter(contact => 
    contact.name.includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.includes(searchTerm)
  )

  const contactsByType = contacts.reduce((acc, contact) => {
    acc[contact.type] = (acc[contact.type] || 0) + 1
    return acc
  }, {} as { [key: string]: number })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">دليل جهات الاتصال</h1>
          <p className="text-gray-600">إدارة جهات الاتصال للعملاء والموردين والشركاء</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              جهة اتصال جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة جهة اتصال جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="الاسم الكامل" className="text-right" />
                <Input placeholder="المنصب" className="text-right" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="القسم" className="text-right" />
                <select className="px-3 py-2 border border-gray-300 rounded-md text-right">
                  <option value="internal">داخلي</option>
                  <option value="customer">عميل</option>
                  <option value="supplier">مورد</option>
                  <option value="partner">شريك</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="البريد الإلكتروني" />
                <Input placeholder="رقم الهاتف" className="text-right" />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  إلغاء
                </Button>
                <Button>إضافة جهة الاتصال</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(contactsByType).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  {getTypeBadge(type)}
                  <p className="text-2xl font-bold mt-1">{count}</p>
                </div>
                <User className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="البحث في جهات الاتصال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      {contact.isPrimary && (
                        <Badge className="bg-yellow-100 text-yellow-800">جهة اتصال أساسية</Badge>
                      )}
                    </div>
                    <p className="text-gray-600">{contact.position}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{contact.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeBadge(contact.type)}
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                </div>
                {contact.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${contact.mobile}`} className="text-blue-600 hover:underline">
                      {contact.mobile} (جوال)
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 ml-1" />
                  إرسال رسالة
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 ml-1" />
                  اتصال
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}