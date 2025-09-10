import React, { useState } from 'react'
import { Plus, Edit, Copy, Trash2, Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'

interface LeadTemplate {
  id: string
  name: string
  nameAr: string
  type: 'email' | 'whatsapp' | 'call_script'
  subject?: string
  content: string
  contentAr: string
  category: 'introduction' | 'follow_up' | 'proposal' | 'closing'
  usageCount: number
}

const mockTemplates: LeadTemplate[] = [
  {
    id: 'LT001',
    name: 'Initial Contact Email',
    nameAr: 'رسالة التواصل الأولى',
    type: 'email',
    subject: 'Introducing our industrial solutions',
    content: 'Dear {{customerName}}, We hope this email finds you well...',
    contentAr: 'عزيزي {{customerName}}، نأمل أن تكون بخير...',
    category: 'introduction',
    usageCount: 25
  },
  {
    id: 'LT002',
    name: 'Follow-up WhatsApp',
    nameAr: 'متابعة عبر الواتساب',
    type: 'whatsapp',
    content: 'Hi {{customerName}}, Following up on our conversation...',
    contentAr: 'مرحباً {{customerName}}، متابعة لمحادثتنا...',
    category: 'follow_up',
    usageCount: 18
  }
]

export default function LeadTemplatesPage() {
  const [templates, setTemplates] = useState<LeadTemplate[]>(mockTemplates)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قوالب التواصل</h1>
          <p className="text-gray-600">قوالب جاهزة للتواصل مع العملاء المحتملين</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              قالب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء قالب جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="اسم القالب (عربي)" className="text-right" />
                <Input placeholder="Template name (English)" />
              </div>
              <Textarea placeholder="محتوى القالب..." className="text-right" rows={6} />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  إلغاء
                </Button>
                <Button>إنشاء القالب</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {template.type === 'email' ? <Mail className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                  <div>
                    <CardTitle>{template.nameAr}</CardTitle>
                    <p className="text-sm text-gray-600">{template.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{template.category === 'introduction' ? 'تعريف' : 'متابعة'}</Badge>
                  <span className="text-sm text-gray-500">استُخدم {template.usageCount} مرة</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.subject && (
                  <div>
                    <label className="text-sm font-medium">الموضوع:</label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{template.subject}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">المحتوى:</label>
                  <div className="text-sm bg-gray-50 p-3 rounded space-y-2">
                    <p>{template.contentAr}</p>
                    <hr />
                    <p className="text-gray-600">{template.content}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4 ml-1" />
                    نسخ
                  </Button>
                  <Button size="sm" variant="outline">
                    استخدام
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}