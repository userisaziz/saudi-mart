import React, { useState } from 'react'
import { Search, Plus, Edit, Trash2, Copy, Eye, Mail, Send, Filter } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface EmailTemplate {
  id: string
  name: string
  nameAr: string
  subject: string
  subjectAr: string
  content: string
  contentAr: string
  type: 'welcome' | 'order_confirmation' | 'shipping' | 'follow_up' | 'promotional' | 'custom'
  isActive: boolean
  lastUsed?: string
  usageCount: number
  createdAt: string
  variables: string[]
}

const mockTemplates: EmailTemplate[] = [
  {
    id: 'T001',
    name: 'Welcome New Customer',
    nameAr: 'ترحيب بالعميل الجديد',
    subject: 'Welcome to Industrial Solutions!',
    subjectAr: 'أهلاً بك في الحلول الصناعية!',
    content: 'Dear {{customerName}}, Welcome to our platform! We are excited to have you with us.',
    contentAr: 'عزيزي {{customerName}}، أهلاً بك في منصتنا! نحن سعداء بانضمامك إلينا.',
    type: 'welcome',
    isActive: true,
    lastUsed: '2024-01-18',
    usageCount: 45,
    createdAt: '2024-01-01',
    variables: ['customerName', 'companyName', 'loginLink']
  },
  {
    id: 'T002',
    name: 'Order Confirmation',
    nameAr: 'تأكيد الطلب',
    subject: 'Order Confirmation - {{orderNumber}}',
    subjectAr: 'تأكيد الطلب - {{orderNumber}}',
    content: 'Dear {{customerName}}, Your order {{orderNumber}} has been confirmed. Total amount: {{totalAmount}}',
    contentAr: 'عزيزي {{customerName}}، تم تأكيد طلبك رقم {{orderNumber}}. إجمالي المبلغ: {{totalAmount}}',
    type: 'order_confirmation',
    isActive: true,
    lastUsed: '2024-01-20',
    usageCount: 128,
    createdAt: '2024-01-01',
    variables: ['customerName', 'orderNumber', 'totalAmount', 'orderDate', 'deliveryAddress']
  },
  {
    id: 'T003',
    name: 'Shipping Notification',
    nameAr: 'إشعار الشحن',
    subject: 'Your order is on the way!',
    subjectAr: 'طلبك في الطريق إليك!',
    content: 'Dear {{customerName}}, Your order {{orderNumber}} has been shipped. Tracking: {{trackingNumber}}',
    contentAr: 'عزيزي {{customerName}}، تم شحن طلبك رقم {{orderNumber}}. رقم التتبع: {{trackingNumber}}',
    type: 'shipping',
    isActive: true,
    lastUsed: '2024-01-19',
    usageCount: 89,
    createdAt: '2024-01-01',
    variables: ['customerName', 'orderNumber', 'trackingNumber', 'estimatedDelivery', 'carrierName']
  },
  {
    id: 'T004',
    name: 'Follow-up Email',
    nameAr: 'رسالة متابعة',
    subject: 'How was your experience?',
    subjectAr: 'كيف كانت تجربتك معنا؟',
    content: 'Dear {{customerName}}, We would love to hear about your experience with {{productName}}.',
    contentAr: 'عزيزي {{customerName}}، نود أن نسمع عن تجربتك مع {{productName}}.',
    type: 'follow_up',
    isActive: false,
    lastUsed: '2024-01-15',
    usageCount: 23,
    createdAt: '2024-01-01',
    variables: ['customerName', 'productName', 'orderNumber', 'reviewLink']
  }
]

const getTypeBadge = (type: string) => {
  const typeMap = {
    welcome: { label: 'ترحيب', color: 'bg-blue-100 text-blue-800' },
    order_confirmation: { label: 'تأكيد طلب', color: 'bg-green-100 text-green-800' },
    shipping: { label: 'شحن', color: 'bg-purple-100 text-purple-800' },
    follow_up: { label: 'متابعة', color: 'bg-orange-100 text-orange-800' },
    promotional: { label: 'ترويجي', color: 'bg-pink-100 text-pink-800' },
    custom: { label: 'مخصص', color: 'bg-gray-100 text-gray-800' }
  }
  
  const typeInfo = typeMap[type as keyof typeof typeMap] || typeMap.custom
  return <Badge className={`${typeInfo.color} hover:${typeInfo.color}`}>{typeInfo.label}</Badge>
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    subject: '',
    subjectAr: '',
    content: '',
    contentAr: '',
    type: 'custom' as EmailTemplate['type'],
    isActive: true,
    variables: [] as string[]
  })

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.nameAr.includes(searchTerm) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subjectAr.includes(searchTerm)
    const matchesType = selectedType === 'all' || template.type === selectedType
    
    return matchesSearch && matchesType
  })

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `T${String(templates.length + 1).padStart(3, '0')}`,
      ...formData,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }
    setTemplates([...templates, newTemplate])
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      nameAr: template.nameAr,
      subject: template.subject,
      subjectAr: template.subjectAr,
      content: template.content,
      contentAr: template.contentAr,
      type: template.type,
      isActive: template.isActive,
      variables: template.variables
    })
    setIsCreateModalOpen(true)
  }

  const handleUpdateTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, ...formData }
          : t
      ))
      setIsCreateModalOpen(false)
      setSelectedTemplate(null)
      resetForm()
    }
  }

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القالب؟')) {
      setTemplates(templates.filter(t => t.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ))
  }

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: `T${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} - نسخة`,
      nameAr: `${template.nameAr} - نسخة`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      lastUsed: undefined
    }
    setTemplates([...templates, duplicated])
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      subject: '',
      subjectAr: '',
      content: '',
      contentAr: '',
      type: 'custom',
      isActive: true,
      variables: []
    })
  }

  const previewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewModalOpen(true)
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قوالب الرسائل الإلكترونية</h1>
          <p className="text-gray-600">إنشاء وإدارة قوالب الرسائل الإلكترونية المخصصة</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedTemplate(null)
            resetForm()
            setIsCreateModalOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 ml-2" />
          قالب جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي القوالب</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              <p className="text-xs text-blue-600">قالب متاح</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">القوالب النشطة</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.isActive).length}
              </p>
              <p className="text-xs text-green-600">قيد الاستخدام</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الاستخدامات</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + t.usageCount, 0)}
              </p>
              <p className="text-xs text-purple-600">رسالة مرسلة</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الأكثر استخداماً</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...templates.map(t => t.usageCount))}
              </p>
              <p className="text-xs text-orange-600">استخدام</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Copy className="w-6 h-6 text-orange-600" />
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
              placeholder="البحث في القوالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-right"
          >
            <option value="all">جميع الأنواع</option>
            <option value="welcome">ترحيب</option>
            <option value="order_confirmation">تأكيد طلب</option>
            <option value="shipping">شحن</option>
            <option value="follow_up">متابعة</option>
            <option value="promotional">ترويجي</option>
            <option value="custom">مخصص</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">اسم القالب</TableHead>
              <TableHead className="text-right">الموضوع</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">عدد الاستخدامات</TableHead>
              <TableHead className="text-right">آخر استخدام</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{template.nameAr}</p>
                    <p className="text-sm text-gray-500">{template.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{template.subjectAr}</p>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(template.type)}</TableCell>
                <TableCell>
                  <Badge 
                    className={template.isActive 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {template.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{template.usageCount}</TableCell>
                <TableCell className="text-right">
                  {template.lastUsed ? formatDate(template.lastUsed) : 'لم يُستخدم'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => previewTemplate(template)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-right">
                        <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(template.id)}>
                          <Send className="w-4 h-4 ml-2" />
                          {template.isActive ? 'إلغاء تفعيل' : 'تفعيل'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'تعديل القالب' : 'إنشاء قالب جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">اسم القالب (عربي) *</label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="أدخل اسم القالب بالعربية"
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-sm font-medium">اسم القالب (إنجليزي) *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter template name in English"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">نوع القالب *</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as EmailTemplate['type'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">ترحيب</SelectItem>
                  <SelectItem value="order_confirmation">تأكيد طلب</SelectItem>
                  <SelectItem value="shipping">شحن</SelectItem>
                  <SelectItem value="follow_up">متابعة</SelectItem>
                  <SelectItem value="promotional">ترويجي</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">الموضوع (عربي) *</label>
                <Input
                  value={formData.subjectAr}
                  onChange={(e) => setFormData({ ...formData, subjectAr: e.target.value })}
                  placeholder="أدخل موضوع الرسالة بالعربية"
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-sm font-medium">الموضوع (إنجليزي) *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter subject in English"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">محتوى الرسالة (عربي) *</label>
                <Textarea
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  placeholder="أدخل محتوى الرسالة بالعربية... استخدم {{variable}} للمتغيرات"
                  className="text-right"
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">محتوى الرسالة (إنجليزي) *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter message content in English... Use {{variable}} for variables"
                  rows={6}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                قالب نشط
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={selectedTemplate ? handleUpdateTemplate : handleCreateTemplate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {selectedTemplate ? 'تحديث' : 'إنشاء'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>معاينة القالب</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">الموضوع:</h3>
                <p className="text-lg">{selectedTemplate.subjectAr}</p>
                <p className="text-sm text-gray-600">{selectedTemplate.subject}</p>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold mb-4">محتوى الرسالة:</h3>
                <div className="prose max-w-none">
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">النسخة العربية:</h4>
                    <div className="whitespace-pre-wrap text-right">{selectedTemplate.contentAr}</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">النسخة الإنجليزية:</h4>
                    <div className="whitespace-pre-wrap">{selectedTemplate.content}</div>
                  </div>
                </div>
              </div>

              {selectedTemplate.variables.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">المتغيرات المتاحة:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <Badge key={variable} className="bg-yellow-200 text-yellow-800">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                  إغلاق
                </Button>
                <Button 
                  onClick={() => handleEditTemplate(selectedTemplate)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}