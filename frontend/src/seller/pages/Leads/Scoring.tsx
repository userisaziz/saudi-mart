import React, { useState } from 'react'
import { Star, TrendingUp, User, Building, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'

interface Lead {
  id: string
  name: string
  company: string
  score: number
  status: 'hot' | 'warm' | 'cold'
  lastActivity: string
  source: string
  estimatedValue: number
  factors: {
    engagement: number
    companySize: number
    budget: number
    timeline: number
  }
}

const mockLeads: Lead[] = [
  {
    id: 'LS001',
    name: 'أحمد محمد الأحمد',
    company: 'شركة الأحمد للصناعات',
    score: 92,
    status: 'hot',
    lastActivity: '2024-01-20',
    source: 'موقع الكتروني',
    estimatedValue: 50000,
    factors: {
      engagement: 95,
      companySize: 85,
      budget: 90,
      timeline: 98
    }
  },
  {
    id: 'LS002',
    name: 'فاطمة علي السعيد',
    company: 'مؤسسة السعيد التجارية',
    score: 78,
    status: 'warm',
    lastActivity: '2024-01-19',
    source: 'معرض تجاري',
    estimatedValue: 30000,
    factors: {
      engagement: 80,
      companySize: 70,
      budget: 75,
      timeline: 85
    }
  },
  {
    id: 'LS003',
    name: 'خالد سعد المطيري',
    company: 'شركة المطيري للمقاولات',
    score: 45,
    status: 'cold',
    lastActivity: '2024-01-15',
    source: 'وسائل التواصل',
    estimatedValue: 15000,
    factors: {
      engagement: 40,
      companySize: 60,
      budget: 35,
      timeline: 45
    }
  }
]

const getStatusBadge = (status: string, score: number) => {
  if (score >= 80) return <Badge className="bg-red-100 text-red-800">ساخن 🔥</Badge>
  if (score >= 60) return <Badge className="bg-orange-100 text-orange-800">دافئ ⚡</Badge>
  return <Badge className="bg-blue-100 text-blue-800">بارد ❄️</Badge>
}

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

export default function LeadScoringPage() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [sortBy, setSortBy] = useState<'score' | 'value'>('score')

  const sortedLeads = [...leads].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score
    return b.estimatedValue - a.estimatedValue
  })

  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0)
  const hotLeads = leads.filter(lead => lead.score >= 80).length
  const averageScore = leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقييم العملاء المحتملين</h1>
          <p className="text-gray-600">تحليل وترتيب العملاء حسب احتمالية الشراء</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={sortBy === 'score' ? 'default' : 'outline'}
            onClick={() => setSortBy('score')}
            size="sm"
          >
            حسب النقاط
          </Button>
          <Button 
            variant={sortBy === 'value' ? 'default' : 'outline'}
            onClick={() => setSortBy('value')}
            size="sm"
          >
            حسب القيمة
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي العملاء</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{leads.length}</div>
            <p className="text-xs text-muted-foreground text-right">عميل محتمل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">العملاء الساخنون</CardTitle>
            <Star className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-red-600">{hotLeads}</div>
            <p className="text-xs text-muted-foreground text-right">نقاط عالية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">القيمة المتوقعة</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-green-600">
              {formatSARCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground text-right">إجمالي الفرص</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">متوسط النقاط</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{Math.round(averageScore)}</div>
            <p className="text-xs text-muted-foreground text-right">من 100</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {sortedLeads.map((lead, index) => (
          <Card key={lead.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>{lead.company}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold">{lead.score}</span>
                    {getStatusBadge(lead.status, lead.score)}
                  </div>
                  <div className="text-sm text-gray-600">
                    القيمة المتوقعة: {formatSARCurrency(lead.estimatedValue)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-600">مستوى التفاعل</label>
                  <Progress value={lead.factors.engagement} className="mt-1" />
                  <span className="text-xs text-gray-500">{lead.factors.engagement}%</span>
                </div>
                <div>
                  <label className="text-xs text-gray-600">حجم الشركة</label>
                  <Progress value={lead.factors.companySize} className="mt-1" />
                  <span className="text-xs text-gray-500">{lead.factors.companySize}%</span>
                </div>
                <div>
                  <label className="text-xs text-gray-600">الميزانية</label>
                  <Progress value={lead.factors.budget} className="mt-1" />
                  <span className="text-xs text-gray-500">{lead.factors.budget}%</span>
                </div>
                <div>
                  <label className="text-xs text-gray-600">الجدول الزمني</label>
                  <Progress value={lead.factors.timeline} className="mt-1" />
                  <span className="text-xs text-gray-500">{lead.factors.timeline}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>المصدر: {lead.source}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>آخر نشاط: {lead.lastActivity}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">عرض التفاصيل</Button>
                  <Button size="sm">بدء المتابعة</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}