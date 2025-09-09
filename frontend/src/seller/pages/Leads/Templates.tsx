import React, { useState, useEffect } from 'react'
import { Plus, Edit, Copy, Trash2, Mail, MessageCircle, Search, Filter, Phone, Eye, Download, Upload, Star, MoreVertical, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface LeadTemplate {
  id: string
  name: string
  nameAr: string
  type: 'email' | 'whatsapp' | 'call_script' | 'sms'
  subject?: string
  content: string
  contentAr: string
  category: 'introduction' | 'follow_up' | 'proposal' | 'closing' | 'reminder' | 'thank_you'
  usageCount: number
  successRate?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
  variables: string[]
  industry?: string
  isFavorite: boolean
}

interface TemplateStats {
  total: number
  active: number
  mostUsed: string
  avgSuccessRate: number
  totalUsage: number
}

const mockTemplates: LeadTemplate[] = [
  {
    id: 'LT001',
    name: 'Initial Contact Email',
    nameAr: 'رسالة التواصل الأولى',
    type: 'email',
    subject: 'Introducing {{companyName}} Industrial Solutions',
    content: 'Dear {{customerName}},\n\nWe hope this email finds you well. My name is {{senderName}} from {{companyName}}, and I wanted to reach out regarding our industrial solutions that could benefit {{customerCompany}}.\n\nWe specialize in:\n- Industrial equipment and machinery\n- Custom manufacturing solutions\n- Technical consultation services\n\nWould you be interested in scheduling a brief call to discuss your current needs?\n\nBest regards,\n{{senderName}}\n{{senderTitle}}\n{{companyName}}',
    contentAr: 'عزيزي {{customerName}}،\n\nنأمل أن تكون بخير. اسمي {{senderName}} من شركة {{companyName}}، وأردت التواصل معكم بخصوص حلولنا الصناعية التي يمكن أن تفيد {{customerCompany}}.\n\nنحن متخصصون في:\n- المعدات والماكينات الصناعية\n- حلول التصنيع المخصصة\n- خدمات الاستشارات التقنية\n\nهل ترغب في جدولة مكالمة قصيرة لمناقشة احتياجاتكم الحالية؟\n\nمع أطيب التحيات،\n{{senderName}}\n{{senderTitle}}\n{{companyName}}',
    category: 'introduction',
    usageCount: 25,
    successRate: 18,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20',
    tags: ['B2B', 'Industrial', 'Introduction'],
    variables: ['customerName', 'companyName', 'senderName', 'customerCompany', 'senderTitle'],
    industry: 'Industrial',
    isFavorite: true
  },
  {
    id: 'LT002',
    name: 'Follow-up WhatsApp',
    nameAr: 'متابعة عبر الواتساب',
    type: 'whatsapp',
    content: '👋 Hi {{customerName}}!\n\nFollowing up on our conversation about {{topicDiscussed}}. I wanted to share some additional information that might be helpful:\n\n📈 {{keyBenefit1}}\n🔧 {{keyBenefit2}}\n✅ {{keyBenefit3}}\n\nWould you like to schedule a call this week to discuss further?\n\nThanks!\n{{senderName}} from {{companyName}}',
    contentAr: '👋 مرحباً {{customerName}}!\n\nمتابعة لمحادثتنا حول {{topicDiscussed}}. أردت مشاركة بعض المعلومات الإضافية التي قد تكون مفيدة:\n\n📈 {{keyBenefit1}}\n🔧 {{keyBenefit2}}\n✅ {{keyBenefit3}}\n\nهل ترغب في جدولة مكالمة هذا الأسبوع للمناقشة أكثر؟\n\nشكراً!\n{{senderName}} من {{companyName}}',
    category: 'follow_up',
    usageCount: 18,
    successRate: 24,
    isActive: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18',
    tags: ['WhatsApp', 'Follow-up', 'Casual'],
    variables: ['customerName', 'topicDiscussed', 'keyBenefit1', 'keyBenefit2', 'keyBenefit3', 'senderName', 'companyName'],
    isFavorite: false
  },
  {
    id: 'LT003',
    name: 'Proposal Follow-up',
    nameAr: 'متابعة عرض السعر',
    type: 'email',
    subject: 'Following up on our proposal - {{proposalNumber}}',
    content: 'Dear {{customerName}},\n\nI hope you had a chance to review our proposal ({{proposalNumber}}) for {{projectName}}.\n\nKey highlights of our offer:\n• Competitive pricing: {{totalAmount}}\n• Delivery timeline: {{deliveryTime}}\n• {{warrantyPeriod}} warranty included\n\nI would be happy to discuss any questions or modifications you might have. Are you available for a call this week?\n\nLooking forward to your feedback.\n\nBest regards,\n{{senderName}}',
    contentAr: 'عزيزي {{customerName}}،\n\nأتمنى أن تكون قد اطلعت على عرضنا ({{proposalNumber}}) لمشروع {{projectName}}.\n\nالنقاط الرئيسية في عرضنا:\n• أسعار تنافسية: {{totalAmount}}\n• مدة التسليم: {{deliveryTime}}\n• ضمان {{warrantyPeriod}} مشمول\n\nسأكون سعيداً لمناقشة أي أسئلة أو تعديلات قد تكون لديك. هل أنت متاح لمكالمة هذا الأسبوع؟\n\nفي انتظار تعليقك.\n\nمع أطيب التحيات،\n{{senderName}}',
    category: 'proposal',
    usageCount: 32,
    successRate: 35,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22',
    tags: ['Proposal', 'Follow-up', 'Sales'],
    variables: ['customerName', 'proposalNumber', 'projectName', 'totalAmount', 'deliveryTime', 'warrantyPeriod', 'senderName'],
    industry: 'General',
    isFavorite: true
  }
]

export default function LeadTemplatesPage() {
  const { t, isRTL } = useLanguage()
  const [templates, setTemplates] = useState<LeadTemplate[]>(mockTemplates)
  const [filteredTemplates, setFilteredTemplates] = useState<LeadTemplate[]>(mockTemplates)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<LeadTemplate | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<LeadTemplate>>({})

  // Calculate stats
  const stats: TemplateStats = {
    total: templates.length,
    active: templates.filter(t => t.isActive).length,
    mostUsed: templates.sort((a, b) => b.usageCount - a.usageCount)[0]?.name || 'N/A',
    avgSuccessRate: Math.round(templates.reduce((sum, t) => sum + (t.successRate || 0), 0) / templates.length),
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0)
  }

  // Filter templates
  useEffect(() => {
    let filtered = templates

    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.nameAr.includes(searchQuery) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(template => template.type === typeFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(template => template.category === categoryFilter)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, typeFilter, categoryFilter])

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.nameAr && newTemplate.content && newTemplate.type) {
      const template: LeadTemplate = {
        id: `LT${String(templates.length + 1).padStart(3, '0')}`,
        name: newTemplate.name,
        nameAr: newTemplate.nameAr,
        type: newTemplate.type as any,
        subject: newTemplate.subject,
        content: newTemplate.content,
        contentAr: newTemplate.contentAr || '',
        category: newTemplate.category || 'introduction',
        usageCount: 0,
        successRate: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: newTemplate.tags || [],
        variables: extractVariables(newTemplate.content || ''),
        industry: newTemplate.industry,
        isFavorite: false
      }
      setTemplates(prev => [template, ...prev])
      setNewTemplate({})
      setIsCreateOpen(false)
    }
  }

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/{{(.*?)}}/g) || []
    return matches.map(match => match.replace(/[{}]/g, ''))
  }

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ))
  }

  const duplicateTemplate = (template: LeadTemplate) => {
    const newTemplate: LeadTemplate = {
      ...template,
      id: `LT${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      nameAr: `${template.nameAr} (نسخة)`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTemplates(prev => [newTemplate, ...prev])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />
      case 'whatsapp': return <MessageCircle className="w-5 h-5 text-green-600" />
      case 'call_script': return <Phone className="w-5 h-5 text-orange-600" />
      case 'sms': return <MessageCircle className="w-5 h-5 text-purple-600" />
      default: return <MessageCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getCategoryBadge = (category: string, isRTL: boolean) => {
    const categoryConfig = {
      introduction: { color: 'bg-blue-100 text-blue-800', text: isRTL ? 'تعريف' : 'Introduction' },
      follow_up: { color: 'bg-green-100 text-green-800', text: isRTL ? 'متابعة' : 'Follow-up' },
      proposal: { color: 'bg-purple-100 text-purple-800', text: isRTL ? 'عرض سعر' : 'Proposal' },
      closing: { color: 'bg-orange-100 text-orange-800', text: isRTL ? 'إغلاق' : 'Closing' },
      reminder: { color: 'bg-yellow-100 text-yellow-800', text: isRTL ? 'تذكير' : 'Reminder' },
      thank_you: { color: 'bg-pink-100 text-pink-800', text: isRTL ? 'شكر' : 'Thank You' }
    }
    const config = categoryConfig[category as keyof typeof categoryConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'قوالب التواصل' : 'Communication Templates'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'قوالب جاهزة وفعالة للتواصل مع العملاء المحتملين' : 'Ready-to-use templates for effective lead communication'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'قالب جديد' : 'New Template'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
              <DialogHeader>
                <DialogTitle>{isRTL ? 'إنشاء قالب جديد' : 'Create New Template'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {isRTL ? 'اسم القالب (عربي)' : 'Template Name (Arabic)'}
                    </label>
                    <Input 
                      value={newTemplate.nameAr || ''}
                      onChange={(e) => setNewTemplate(prev => ({...prev, nameAr: e.target.value}))}
                      placeholder={isRTL ? 'أدخل اسم القالب بالعربية' : 'Enter template name in Arabic'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {isRTL ? 'اسم القالب (إنجليزي)' : 'Template Name (English)'}
                    </label>
                    <Input 
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
                      placeholder={isRTL ? 'أدخل اسم القالب بالإنجليزية' : 'Enter template name in English'}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {isRTL ? 'نوع القالب' : 'Template Type'}
                    </label>
                    <Select value={newTemplate.type} onValueChange={(value) => setNewTemplate(prev => ({...prev, type: value as any}))}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر نوع القالب' : 'Select template type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">{isRTL ? 'بريد إلكتروني' : 'Email'}</SelectItem>
                        <SelectItem value="whatsapp">{isRTL ? 'واتساب' : 'WhatsApp'}</SelectItem>
                        <SelectItem value="call_script">{isRTL ? 'نص مكالمة' : 'Call Script'}</SelectItem>
                        <SelectItem value="sms">{isRTL ? 'رسالة نصية' : 'SMS'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {isRTL ? 'فئة القالب' : 'Template Category'}
                    </label>
                    <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate(prev => ({...prev, category: value as any}))}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر فئة القالب' : 'Select template category'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="introduction">{isRTL ? 'تعريف' : 'Introduction'}</SelectItem>
                        <SelectItem value="follow_up">{isRTL ? 'متابعة' : 'Follow-up'}</SelectItem>
                        <SelectItem value="proposal">{isRTL ? 'عرض سعر' : 'Proposal'}</SelectItem>
                        <SelectItem value="closing">{isRTL ? 'إغلاق' : 'Closing'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {newTemplate.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {isRTL ? 'موضوع الرسالة' : 'Email Subject'}
                    </label>
                    <Input 
                      value={newTemplate.subject || ''}
                      onChange={(e) => setNewTemplate(prev => ({...prev, subject: e.target.value}))}
                      placeholder={isRTL ? 'أدخل موضوع البريد الإلكتروني' : 'Enter email subject'}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isRTL ? 'محتوى القالب' : 'Template Content'}
                  </label>
                  <Textarea 
                    value={newTemplate.content || ''}
                    onChange={(e) => setNewTemplate(prev => ({...prev, content: e.target.value}))}
                    placeholder={isRTL ? 'أدخل محتوى القالب. استخدم {{variableName}} للمتغيرات' : 'Enter template content. Use {{variableName}} for variables'}
                    rows={8}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    {isRTL ? 'إنشاء القالب' : 'Create Template'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">{isRTL ? 'إجمالي القوالب' : 'Total Templates'}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-green-800">{isRTL ? 'قوالب نشطة' : 'Active Templates'}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.totalUsage}</div>
          <div className="text-sm text-purple-800">{isRTL ? 'إجمالي الاستخدام' : 'Total Usage'}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{stats.avgSuccessRate}%</div>
          <div className="text-sm text-orange-800">{isRTL ? 'متوسط النجاح' : 'Avg Success Rate'}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-xl font-bold text-yellow-600">{templates.filter(t => t.isFavorite).length}</div>
          <div className="text-sm text-yellow-800">{isRTL ? 'قوالب مفضلة' : 'Favorite Templates'}</div>
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
                placeholder={isRTL ? 'البحث في القوالب...' : 'Search templates...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'النوع' : 'Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
              <SelectItem value="email">{isRTL ? 'بريد إلكتروني' : 'Email'}</SelectItem>
              <SelectItem value="whatsapp">{isRTL ? 'واتساب' : 'WhatsApp'}</SelectItem>
              <SelectItem value="call_script">{isRTL ? 'نص مكالمة' : 'Call Script'}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={isRTL ? 'الفئة' : 'Category'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
              <SelectItem value="introduction">{isRTL ? 'تعريف' : 'Introduction'}</SelectItem>
              <SelectItem value="follow_up">{isRTL ? 'متابعة' : 'Follow-up'}</SelectItem>
              <SelectItem value="proposal">{isRTL ? 'عرض سعر' : 'Proposal'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(template.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{isRTL ? template.nameAr : template.name}</CardTitle>
                      {template.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{isRTL ? template.name : template.nameAr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(template.category, isRTL)}
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{template.usageCount}</span>
                    </div>
                    {template.successRate && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-green-600">{template.successRate}%</span>
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedTemplate(template)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {isRTL ? 'عرض' : 'View'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleFavorite(template.id)}>
                        <Star className={`w-4 h-4 mr-2 ${template.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                        {template.isFavorite ? (isRTL ? 'إزالة من المفضلة' : 'Remove Favorite') : (isRTL ? 'إضافة للمفضلة' : 'Add Favorite')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        {isRTL ? 'نسخ' : 'Duplicate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.subject && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {isRTL ? 'الموضوع:' : 'Subject:'}
                    </label>
                    <p className="text-sm bg-gray-50 p-2 rounded mt-1">{template.subject}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {isRTL ? 'المحتوى:' : 'Content:'}
                  </label>
                  <div className="text-sm bg-gray-50 p-3 rounded mt-1 max-h-32 overflow-y-auto">
                    <p className="whitespace-pre-line">{isRTL ? template.contentAr : template.content}</p>
                  </div>
                </div>
                {template.variables.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {isRTL ? 'المتغيرات:' : 'Variables:'}
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map((variable, index) => (
                        <code key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {`{{${variable}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    {isRTL ? 'تعديل' : 'Edit'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template)}>
                    <Copy className="w-4 h-4 mr-1" />
                    {isRTL ? 'نسخ' : 'Copy'}
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    {isRTL ? 'استخدام' : 'Use'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isRTL ? 'لا توجد قوالب' : 'No templates found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? (isRTL ? 'لا توجد قوالب تطابق بحثك' : 'No templates match your search')
              : (isRTL ? 'ابدأ بإنشاء قالب جديد للتواصل مع عملائك' : 'Start by creating your first communication template')
            }
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'إنشاء قالب جديد' : 'Create New Template'}
          </Button>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{isRTL ? selectedTemplate.nameAr : selectedTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getTypeIcon(selectedTemplate.type)}
                {getCategoryBadge(selectedTemplate.category, isRTL)}
                <Badge variant="outline">
                  {isRTL ? `استُخدم ${selectedTemplate.usageCount} مرة` : `Used ${selectedTemplate.usageCount} times`}
                </Badge>
                {selectedTemplate.successRate && (
                  <Badge className="bg-green-100 text-green-800">
                    {isRTL ? `معدل النجاح: ${selectedTemplate.successRate}%` : `Success: ${selectedTemplate.successRate}%`}
                  </Badge>
                )}
              </div>
              {selectedTemplate.subject && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'موضوع الرسالة:' : 'Email Subject:'}
                  </h4>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p>{selectedTemplate.subject}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'المحتوى (عربي):' : 'Content (Arabic):'}
                  </h4>
                  <div className="bg-gray-50 p-3 rounded border h-64 overflow-y-auto">
                    <p className="whitespace-pre-line">{selectedTemplate.contentAr}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'المحتوى (إنجليزي):' : 'Content (English):'}
                  </h4>
                  <div className="bg-gray-50 p-3 rounded border h-64 overflow-y-auto">
                    <p className="whitespace-pre-line">{selectedTemplate.content}</p>
                  </div>
                </div>
              </div>
              {selectedTemplate.variables.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'المتغيرات المتاحة:' : 'Available Variables:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable, index) => (
                      <code key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                        {`{{${variable}}}`}
                      </code>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  {isRTL ? 'إغلاق' : 'Close'}
                </Button>
                <Button onClick={() => duplicateTemplate(selectedTemplate)}>
                  <Copy className="w-4 h-4 mr-2" />
                  {isRTL ? 'نسخ القالب' : 'Duplicate Template'}
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  {isRTL ? 'استخدام القالب' : 'Use Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}