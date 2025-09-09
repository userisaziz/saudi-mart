import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Phone, Mail, MessageCircle, CheckCircle, AlertCircle, Filter, Search, Plus, MoreVertical, User, Building, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { useLanguage } from '@/shared/contexts/LanguageContext'

interface FollowUpTask {
  id: string
  leadId: string
  leadName: string
  company: string
  phone?: string
  email?: string
  type: 'call' | 'email' | 'meeting' | 'demo' | 'whatsapp'
  dueDate: string
  dueTime: string
  status: 'pending' | 'completed' | 'overdue' | 'in_progress'
  priority: 'high' | 'medium' | 'low'
  notes: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  result?: string
  nextFollowUp?: string
}

interface TaskStats {
  total: number
  pending: number
  completed: number
  overdue: number
  today: number
}

const mockTasks: FollowUpTask[] = [
  {
    id: 'FU001',
    leadId: 'LEAD001',
    leadName: 'أحمد محمد الأحمد',
    company: 'شركة الأحمد للصناعات',
    phone: '+966501234567',
    email: 'ahmed@alahmadindustries.com',
    type: 'call',
    dueDate: '2024-01-22',
    dueTime: '10:30',
    status: 'pending',
    priority: 'high',
    notes: 'متابعة عرض السعر للماكينة الصناعية - تفاصيل الشحن والتركيب',
    assignedTo: 'سالم الأحمد',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21'
  },
  {
    id: 'FU002', 
    leadId: 'LEAD002',
    leadName: 'فاطمة علي السعيد',
    company: 'مؤسسة السعيد التجارية',
    phone: '+966507654321',
    email: 'fatima@alsaeedtrading.com',
    type: 'email',
    dueDate: '2024-01-23',
    dueTime: '14:00',
    status: 'completed',
    priority: 'medium',
    notes: 'إرسال الكتالوج والأسعار',
    assignedTo: 'نورا خالد',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-22',
    completedAt: '2024-01-22',
    result: 'تم إرسال الكتالوج وطلبت اجتماع للمناقشة'
  },
  {
    id: 'FU003',
    leadId: 'LEAD003',
    leadName: 'محمد سعد الخالدي',
    company: 'مجموعة الخالدي القابضة',
    phone: '+966503456789',
    email: 'mohammed@alkhaldigroup.com',
    type: 'meeting',
    dueDate: '2024-01-21',
    dueTime: '11:00',
    status: 'overdue',
    priority: 'high',
    notes: 'اجتماع لمناقشة المشروع الجديد - قاعة المؤتمرات الرئيسية',
    assignedTo: 'أحمد العلي',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20'
  },
  {
    id: 'FU004',
    leadId: 'LEAD004',
    leadName: 'سارة أحمد المطيري',
    company: 'شركة المطيري للخدمات اللوجستية',
    phone: '+966509876543',
    email: 'sara@almutairilogistics.com',
    type: 'whatsapp',
    dueDate: '2024-01-24',
    dueTime: '09:00',
    status: 'pending',
    priority: 'medium',
    notes: 'متابعة طلب عرض أسعار خدمات الشحن',
    assignedTo: 'ليلى محمد',
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21'
  },
  {
    id: 'FU005',
    leadId: 'LEAD005',
    leadName: 'خالد بن عبدالله',
    company: 'مصنع عبدالله للمعادن',
    phone: '+966505432167',
    email: 'khalid@abdullahmetals.com',
    type: 'demo',
    dueDate: '2024-01-25',
    dueTime: '15:30',
    status: 'pending',
    priority: 'high',
    notes: 'عرض تقديمي للمنتجات الجديدة - يحتاج ترجمة فورية',
    assignedTo: 'سالم الأحمد',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  },
  {
    id: 'FU006',
    leadId: 'LEAD006',
    leadName: 'منى سليم الدوسري',
    company: 'شركة الدوسري للتجارة العامة',
    phone: '+966504567890',
    email: 'mona@aldosaritrading.com',
    type: 'call',
    dueDate: '2024-01-22',
    dueTime: '16:00',
    status: 'in_progress',
    priority: 'medium',
    notes: 'مناقشة شروط الدفع والتسليم',
    assignedTo: 'نورا خالد',
    createdAt: '2024-01-21',
    updatedAt: '2024-01-22'
  }
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'call': return <Phone className="w-4 h-4 text-blue-600" />
    case 'email': return <Mail className="w-4 h-4 text-green-600" />
    case 'meeting': return <Calendar className="w-4 h-4 text-purple-600" />
    case 'demo': return <MessageCircle className="w-4 h-4 text-orange-600" />
    case 'whatsapp': return <MessageCircle className="w-4 h-4 text-green-600" />
    default: return <Clock className="w-4 h-4 text-gray-600" />
  }
}

const getPriorityBadge = (priority: string, isRTL: boolean) => {
  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-800', text: isRTL ? 'عالية' : 'High' },
    medium: { color: 'bg-yellow-100 text-yellow-800', text: isRTL ? 'متوسطة' : 'Medium' },
    low: { color: 'bg-green-100 text-green-800', text: isRTL ? 'منخفضة' : 'Low' }
  }
  const config = priorityConfig[priority as keyof typeof priorityConfig]
  return <Badge className={config.color}>{config.text}</Badge>
}

export default function FollowUpPage() {
  const { t, isRTL } = useLanguage()
  const [tasks, setTasks] = useState<FollowUpTask[]>(mockTasks)
  const [filteredTasks, setFilteredTasks] = useState<FollowUpTask[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<FollowUpTask | null>(null)
  const [newTask, setNewTask] = useState<Partial<FollowUpTask>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Calculate stats
  const stats: TaskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    today: tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length
  }

  // Filter tasks
  useEffect(() => {
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(task => task.type === typeFilter)
    }

    setFilteredTasks(filtered)
    setCurrentPage(1)
  }, [tasks, searchQuery, statusFilter, priorityFilter, typeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage)

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString() }
        : task
    ))
  }

  const handleCreateTask = () => {
    if (newTask.leadName && newTask.type && newTask.dueDate) {
      const task: FollowUpTask = {
        id: `FU${String(tasks.length + 1).padStart(3, '0')}`,
        leadId: `LEAD${String(tasks.length + 1).padStart(3, '0')}`,
        leadName: newTask.leadName,
        company: newTask.company || '',
        phone: newTask.phone,
        email: newTask.email,
        type: newTask.type as any,
        dueDate: newTask.dueDate,
        dueTime: newTask.dueTime || '09:00',
        status: 'pending',
        priority: newTask.priority || 'medium',
        notes: newTask.notes || '',
        assignedTo: newTask.assignedTo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks(prev => [task, ...prev])
      setNewTask({})
      setShowCreateModal(false)
    }
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'متابعة العملاء المحتملين' : 'Lead Follow-up Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'جدولة ومتابعة المهام مع العملاء المحتملين' : 'Schedule and track follow-up tasks with potential customers'}
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? 'مهمة جديدة' : 'New Task'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{isRTL ? 'إنشاء مهمة متابعة جديدة' : 'Create New Follow-up Task'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'اسم العميل المحتمل' : 'Lead Name'}
                  </label>
                  <Input 
                    value={newTask.leadName || ''}
                    onChange={(e) => setNewTask(prev => ({...prev, leadName: e.target.value}))}
                    placeholder={isRTL ? 'أدخل اسم العميل' : 'Enter lead name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'اسم الشركة' : 'Company'}
                  </label>
                  <Input 
                    value={newTask.company || ''}
                    onChange={(e) => setNewTask(prev => ({...prev, company: e.target.value}))}
                    placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'نوع المهمة' : 'Task Type'}
                  </label>
                  <Select value={newTask.type} onValueChange={(value) => setNewTask(prev => ({...prev, type: value as any}))}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر نوع المهمة' : 'Select task type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">{isRTL ? 'مكالمة هاتفية' : 'Phone Call'}</SelectItem>
                      <SelectItem value="email">{isRTL ? 'بريد إلكتروني' : 'Email'}</SelectItem>
                      <SelectItem value="meeting">{isRTL ? 'اجتماع' : 'Meeting'}</SelectItem>
                      <SelectItem value="demo">{isRTL ? 'عرض تقديمي' : 'Demo'}</SelectItem>
                      <SelectItem value="whatsapp">{isRTL ? 'واتساب' : 'WhatsApp'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'الأولوية' : 'Priority'}
                  </label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({...prev, priority: value as any}))}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر الأولوية' : 'Select priority'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                      <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                      <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'تاريخ التنفيذ' : 'Due Date'}
                  </label>
                  <Input 
                    type="date"
                    value={newTask.dueDate || ''}
                    onChange={(e) => setNewTask(prev => ({...prev, dueDate: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'وقت التنفيذ' : 'Due Time'}
                  </label>
                  <Input 
                    type="time"
                    value={newTask.dueTime || ''}
                    onChange={(e) => setNewTask(prev => ({...prev, dueTime: e.target.value}))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {isRTL ? 'ملاحظات' : 'Notes'}
                </label>
                <Textarea 
                  value={newTask.notes || ''}
                  onChange={(e) => setNewTask(prev => ({...prev, notes: e.target.value}))}
                  placeholder={isRTL ? 'أدخل تفاصيل المهمة والملاحظات' : 'Enter task details and notes'}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleCreateTask}>
                  {isRTL ? 'إنشاء المهمة' : 'Create Task'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">{isRTL ? 'إجمالي المهام' : 'Total Tasks'}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-800">{isRTL ? 'معلقة' : 'Pending'}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-800">{isRTL ? 'مكتملة' : 'Completed'}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-red-800">{isRTL ? 'متأخرة' : 'Overdue'}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.today}</div>
          <div className="text-sm text-purple-800">{isRTL ? 'اليوم' : 'Today'}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                className="pl-10"
                placeholder={isRTL ? 'البحث في المهام...' : 'Search tasks...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
              <SelectItem value="pending">{isRTL ? 'معلقة' : 'Pending'}</SelectItem>
              <SelectItem value="completed">{isRTL ? 'مكتملة' : 'Completed'}</SelectItem>
              <SelectItem value="overdue">{isRTL ? 'متأخرة' : 'Overdue'}</SelectItem>
              <SelectItem value="in_progress">{isRTL ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'الأولوية' : 'Priority'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الأولويات' : 'All Priorities'}</SelectItem>
              <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
              <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
              <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'النوع' : 'Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
              <SelectItem value="call">{isRTL ? 'مكالمة' : 'Call'}</SelectItem>
              <SelectItem value="email">{isRTL ? 'بريد إلكتروني' : 'Email'}</SelectItem>
              <SelectItem value="meeting">{isRTL ? 'اجتماع' : 'Meeting'}</SelectItem>
              <SelectItem value="demo">{isRTL ? 'عرض تقديمي' : 'Demo'}</SelectItem>
              <SelectItem value="whatsapp">{isRTL ? 'واتساب' : 'WhatsApp'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {paginatedTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(task.type)}
                  <div>
                    <CardTitle className="text-lg">{task.leadName}</CardTitle>
                    <p className="text-sm text-gray-600">{task.company}</p>
                  </div>
                  {getPriorityBadge(task.priority, isRTL)}
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : task.status === 'overdue' ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : task.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                  {getStatusBadge(task.status, isRTL)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  {task.phone && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{task.phone}</span>
                    </div>
                  )}
                  {task.email && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{task.email}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm">{task.notes}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{isRTL ? 'التاريخ:' : 'Date:'} {task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{isRTL ? 'الوقت:' : 'Time:'} {task.dueTime}</span>
                  </div>
                  {task.assignedTo && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{isRTL ? 'مُكلف:' : 'Assigned:'} {task.assignedTo}</span>
                    </div>
                  )}
                </div>
                {task.result && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <p className="text-sm text-green-800">
                      <strong>{isRTL ? 'النتيجة:' : 'Result:'}</strong> {task.result}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  {isRTL ? 'تعديل' : 'Edit'}
                </Button>
                {task.status !== 'completed' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCompleteTask(task.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    {isRTL ? 'إكمال' : 'Complete'}
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  {isRTL ? 'عرض' : 'View'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isRTL ? 'لا توجد مهام متابعة' : 'No follow-up tasks'}
          </h3>
          <p className="text-gray-500 mb-6">
            {isRTL ? 'ابدأ بإنشاء مهمة متابعة جديدة مع عملائك المحتملين' : 'Start by creating a new follow-up task with your leads'}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'إنشاء مهمة جديدة' : 'Create New Task'}
          </Button>
        </div>
      )}
    </div>
  )
}

const getStatusBadge = (status: string, isRTL: boolean) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: isRTL ? 'معلقة' : 'Pending' },
    completed: { color: 'bg-green-100 text-green-800', text: isRTL ? 'مكتملة' : 'Completed' },
    overdue: { color: 'bg-red-100 text-red-800', text: isRTL ? 'متأخرة' : 'Overdue' },
    in_progress: { color: 'bg-blue-100 text-blue-800', text: isRTL ? 'قيد التنفيذ' : 'In Progress' }
  }
  const config = statusConfig[status as keyof typeof statusConfig]
  return <Badge className={config.color}>{config.text}</Badge>
}