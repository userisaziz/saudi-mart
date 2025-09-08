import React, { useState } from 'react'
import { MessageCircle, Send, Users, Settings, BarChart3, Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface WhatsAppMessage {
  id: string
  customerName: string
  customerPhone: string
  message: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  type: 'text' | 'image' | 'document' | 'template'
  isFromCustomer: boolean
}

interface WhatsAppTemplate {
  id: string
  name: string
  nameAr: string
  content: string
  contentAr: string
  variables: string[]
  category: 'marketing' | 'utility' | 'authentication'
  status: 'approved' | 'pending' | 'rejected'
}

const mockMessages: WhatsAppMessage[] = [
  {
    id: 'WM001',
    customerName: 'أحمد محمد',
    customerPhone: '+966501234567',
    message: 'السلام عليكم، أريد الاستفسار عن الماكينة الصناعية',
    timestamp: '2024-01-20T10:30:00Z',
    status: 'read',
    type: 'text',
    isFromCustomer: true
  },
  {
    id: 'WM002',
    customerName: 'أحمد محمد',
    customerPhone: '+966501234567',
    message: 'وعليكم السلام، نعم متوفرة. السعر 15,000 ريال',
    timestamp: '2024-01-20T10:35:00Z',
    status: 'delivered',
    type: 'text',
    isFromCustomer: false
  },
  {
    id: 'WM003',
    customerName: 'فاطمة علي',
    customerPhone: '+966502345678',
    message: 'متى سيصل الطلب؟',
    timestamp: '2024-01-20T11:15:00Z',
    status: 'sent',
    type: 'text',
    isFromCustomer: true
  }
]

const mockTemplates: WhatsAppTemplate[] = [
  {
    id: 'WT001',
    name: 'Order Confirmation',
    nameAr: 'تأكيد الطلب',
    content: 'Dear {{customer_name}}, your order {{order_number}} has been confirmed!',
    contentAr: 'عزيزي {{customer_name}}، تم تأكيد طلبك رقم {{order_number}}!',
    variables: ['customer_name', 'order_number'],
    category: 'utility',
    status: 'approved'
  },
  {
    id: 'WT002',
    name: 'Shipping Update',
    nameAr: 'تحديث الشحن',
    content: 'Your order {{order_number}} is on its way! Tracking: {{tracking_number}}',
    contentAr: 'طلبك رقم {{order_number}} في الطريق إليك! رقم التتبع: {{tracking_number}}',
    variables: ['order_number', 'tracking_number'],
    category: 'utility',
    status: 'approved'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'sent':
      return <Clock className="w-4 h-4 text-gray-600" />
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-blue-600" />
    case 'read':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'failed':
      return <AlertCircle className="w-4 h-4 text-red-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'sent':
      return <Badge className="bg-gray-100 text-gray-800">مُرسل</Badge>
    case 'delivered':
      return <Badge className="bg-blue-100 text-blue-800">تم التوصيل</Badge>
    case 'read':
      return <Badge className="bg-green-100 text-green-800">مقروء</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">فشل</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function WhatsAppIntegrationPage() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>(mockMessages)
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(mockTemplates)
  const [activeTab, setActiveTab] = useState<'messages' | 'templates' | 'settings' | 'analytics'>('messages')
  const [newMessage, setNewMessage] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false)
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)

  const [templateForm, setTemplateForm] = useState({
    name: '',
    nameAr: '',
    content: '',
    contentAr: '',
    category: 'utility' as WhatsAppTemplate['category']
  })

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCustomer) {
      const message: WhatsAppMessage = {
        id: `WM${String(messages.length + 1).padStart(3, '0')}`,
        customerName: selectedCustomer,
        customerPhone: '+966501234567', // This would be from customer data
        message: newMessage,
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'text',
        isFromCustomer: false
      }
      setMessages([...messages, message])
      setNewMessage('')
      setIsSendMessageOpen(false)
    }
  }

  const handleCreateTemplate = () => {
    const template: WhatsAppTemplate = {
      id: `WT${String(templates.length + 1).padStart(3, '0')}`,
      ...templateForm,
      variables: [],
      status: 'pending'
    }
    setTemplates([...templates, template])
    setIsCreateTemplateOpen(false)
    setTemplateForm({
      name: '',
      nameAr: '',
      content: '',
      contentAr: '',
      category: 'utility'
    })
  }

  const uniqueCustomers = [...new Set(messages.map(m => m.customerName))]
  const totalMessages = messages.length
  const unreadMessages = messages.filter(m => m.isFromCustomer && m.status !== 'read').length

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تكامل واتساب للأعمال</h1>
          <p className="text-gray-600">إدارة المحادثات والرسائل التلقائية عبر واتساب</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsSendMessageOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="w-4 h-4 ml-2" />
            رسالة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي الرسائل</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{totalMessages}</div>
            <p className="text-xs text-muted-foreground text-right">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">رسائل غير مقروءة</CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-orange-600">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground text-right">تحتاج رد</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">العملاء النشطين</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{uniqueCustomers.length}</div>
            <p className="text-xs text-muted-foreground text-right">محادثة نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">القوالب المعتمدة</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">
              {templates.filter(t => t.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground text-right">قالب جاهز</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              المحادثات
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              القوالب
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              التحليلات
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الإعدادات
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">المحادثات الأخيرة</h3>
                <Button 
                  onClick={() => setIsSendMessageOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <Send className="w-4 h-4 ml-2" />
                  إرسال رسالة
                </Button>
              </div>

              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromCustomer ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromCustomer
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.isFromCustomer ? message.customerName : 'أنت'}
                        </span>
                        <span className="text-xs opacity-75">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      {!message.isFromCustomer && (
                        <div className="flex items-center justify-end mt-1">
                          {getStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">قوالب الرسائل</h3>
                <Button 
                  onClick={() => setIsCreateTemplateOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  قالب جديد
                </Button>
              </div>

              <div className="grid gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{template.nameAr}</h4>
                        <p className="text-sm text-gray-500">{template.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          template.status === 'approved' ? 'bg-green-100 text-green-800' :
                          template.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {template.status === 'approved' ? 'معتمد' : 
                           template.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
                        </Badge>
                        <Badge variant="outline">
                          {template.category === 'utility' ? 'مساعدة' :
                           template.category === 'marketing' ? 'تسويقي' : 'مصادقة'}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className="mb-2">
                        <span className="font-medium">العربية: </span>
                        {template.contentAr}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">English: </span>
                        {template.content}
                      </div>
                    </div>
                    {template.variables.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">المتغيرات: </span>
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="outline" className="text-xs ml-1">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">تحليلات واتساب</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">معدل الاستجابة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">95%</div>
                    <p className="text-sm text-gray-600">متوسط الرد خلال 15 دقيقة</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">الرسائل اليومية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">24</div>
                    <p className="text-sm text-gray-600">متوسط الرسائل في اليوم</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">إعدادات واتساب</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 ml-2" />
                    <span className="text-yellow-800">
                      يجب ربط حساب واتساب للأعمال لاستخدام هذه الميزات
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">الردود التلقائية</h4>
                      <p className="text-sm text-gray-600">تفعيل الردود التلقائية خارج ساعات العمل</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">إشعارات الرسائل الجديدة</h4>
                      <p className="text-sm text-gray-600">تلقي إشعارات للرسائل الواردة</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">رسالة الترحيب التلقائية</h4>
                    <Textarea
                      placeholder="أدخل رسالة الترحيب..."
                      defaultValue="أهلاً بك! شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن."
                      className="text-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Message Modal */}
      <Dialog open={isSendMessageOpen} onOpenChange={setIsSendMessageOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إرسال رسالة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">العميل</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">الرسالة</label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="text-right"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSendMessageOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 ml-2" />
                إرسال
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Template Modal */}
      <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء قالب جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">اسم القالب (عربي)</label>
                <Input
                  value={templateForm.nameAr}
                  onChange={(e) => setTemplateForm({...templateForm, nameAr: e.target.value})}
                  placeholder="أدخل اسم القالب بالعربية"
                  className="text-right"
                />
              </div>
              <div>
                <label className="text-sm font-medium">اسم القالب (إنجليزي)</label>
                <Input
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                  placeholder="Enter template name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">فئة القالب</label>
              <Select 
                value={templateForm.category} 
                onValueChange={(value) => setTemplateForm({...templateForm, category: value as WhatsAppTemplate['category']})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utility">مساعدة</SelectItem>
                  <SelectItem value="marketing">تسويقي</SelectItem>
                  <SelectItem value="authentication">مصادقة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">محتوى الرسالة (عربي)</label>
                <Textarea
                  value={templateForm.contentAr}
                  onChange={(e) => setTemplateForm({...templateForm, contentAr: e.target.value})}
                  placeholder="أدخل محتوى الرسالة بالعربية..."
                  className="text-right"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">محتوى الرسالة (إنجليزي)</label>
                <Textarea
                  value={templateForm.content}
                  onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                  placeholder="Enter message content in English..."
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 يمكنك استخدام المتغيرات مثل {"{{customer_name}}"} و {"{{order_number}}"} في الرسالة
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700">
                إنشاء القالب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}