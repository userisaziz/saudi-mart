import React, { useState } from 'react'
import { Calendar, Clock, Phone, Mail, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface FollowUpTask {
  id: string
  leadName: string
  company: string
  type: 'call' | 'email' | 'meeting' | 'demo'
  dueDate: string
  status: 'pending' | 'completed' | 'overdue'
  priority: 'high' | 'medium' | 'low'
  notes: string
}

const mockTasks: FollowUpTask[] = [
  {
    id: 'FU001',
    leadName: 'أحمد محمد الأحمد',
    company: 'شركة الأحمد للصناعات',
    type: 'call',
    dueDate: '2024-01-22',
    status: 'pending',
    priority: 'high',
    notes: 'متابعة عرض السعر للماكينة الصناعية'
  },
  {
    id: 'FU002', 
    leadName: 'فاطمة علي السعيد',
    company: 'مؤسسة السعيد التجارية',
    type: 'email',
    dueDate: '2024-01-23',
    status: 'completed',
    priority: 'medium',
    notes: 'إرسال الكتالوج والأسعار'
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'call': return <Phone className="w-4 h-4" />
    case 'email': return <Mail className="w-4 h-4" />
    case 'meeting': return <Calendar className="w-4 h-4" />
    case 'demo': return <MessageCircle className="w-4 h-4" />
    default: return <Clock className="w-4 h-4" />
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high': return <Badge className="bg-red-100 text-red-800">عالية</Badge>
    case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">متوسطة</Badge>
    case 'low': return <Badge className="bg-green-100 text-green-800">منخفضة</Badge>
    default: return <Badge>{priority}</Badge>
  }
}

export default function FollowUpPage() {
  const [tasks, setTasks] = useState<FollowUpTask[]>(mockTasks)

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">متابعة العملاء المحتملين</h1>
          <p className="text-gray-600">جدولة ومتابعة المهام مع العملاء</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="w-4 h-4 ml-2" />
          مهمة جديدة
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(task.type)}
                  <CardTitle className="text-lg">{task.leadName}</CardTitle>
                  {getPriorityBadge(task.priority)}
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <Badge>{task.status === 'completed' ? 'مكتملة' : 'معلقة'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600">{task.company}</p>
                <p className="text-sm">{task.notes}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>موعد التنفيذ: {task.dueDate}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">تعديل</Button>
                <Button size="sm" variant="outline">إكمال</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}