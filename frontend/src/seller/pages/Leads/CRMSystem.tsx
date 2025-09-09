import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { MetricsCard } from '@/seller/components/ui/MetricsCard';
import { Chart } from '@/seller/components/ui/Chart';
import {
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BellIcon,
  TagIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  FireIcon,
  LightBulbIcon,
  HandRaisedIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  FireIcon as FireSolidIcon,
} from '@heroicons/react/24/solid';

interface Lead {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  company?: string;
  companyAr?: string;
  position?: string;
  positionAr?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'hot';
  source: 'website' | 'social' | 'referral' | 'cold_call' | 'email' | 'event' | 'partnership';
  assignedTo?: string;
  potentialValue: number;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  notes: string;
  tags: string[];
  address?: {
    street: string;
    city: string;
    country: string;
  };
  industry: string;
  employeeCount?: string;
  website?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
  interactions: Array<{
    id: string;
    type: 'call' | 'email' | 'meeting' | 'note' | 'proposal';
    subject: string;
    content: string;
    timestamp: string;
    outcome?: 'positive' | 'neutral' | 'negative';
  }>;
  products: string[];
  requirements?: string;
  budget?: number;
  decisionMakers?: string[];
  competitorInfo?: string;
  leadScore: number;
  engagementLevel: 'low' | 'medium' | 'high';
}

interface Pipeline {
  stage: string;
  stageAr: string;
  count: number;
  value: number;
  probability: number;
  averageTime: number;
}

// Mock comprehensive lead data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    email: 'ahmed.rashid@constructco.sa',
    phone: '+966 50 123 4567',
    company: 'Al-Rashid Construction',
    companyAr: 'إنشاءات الراشد',
    position: 'Chief Engineering Officer',
    positionAr: 'مدير الهندسة التنفيذي',
    status: 'negotiation',
    priority: 'hot',
    source: 'referral',
    assignedTo: 'Sales Rep 1',
    potentialValue: 450000,
    probability: 85,
    expectedCloseDate: '2024-04-15T00:00:00Z',
    createdAt: '2024-02-10T10:00:00Z',
    lastContactDate: '2024-03-14T14:30:00Z',
    nextFollowUp: '2024-03-18T09:00:00Z',
    notes: 'Very interested in our industrial pumps. Budget approved. Decision expected by end of March.',
    tags: ['construction', 'large-deal', 'hot-lead'],
    address: {
      street: '123 King Fahd Road',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    },
    industry: 'Construction',
    employeeCount: '500-1000',
    website: 'https://constructco.sa',
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/constructco'
    },
    interactions: [
      {
        id: 'int-1',
        type: 'call',
        subject: 'Initial Discovery Call',
        content: 'Discussed current equipment needs and pain points. Very positive response.',
        timestamp: '2024-02-10T10:00:00Z',
        outcome: 'positive'
      },
      {
        id: 'int-2',
        type: 'proposal',
        subject: 'Technical Proposal Submitted',
        content: 'Submitted comprehensive proposal for HP-2000 pumps with installation package.',
        timestamp: '2024-03-01T15:00:00Z',
        outcome: 'positive'
      },
      {
        id: 'int-3',
        type: 'meeting',
        subject: 'Site Visit and Demo',
        content: 'Conducted on-site demonstration. Engineering team very impressed.',
        timestamp: '2024-03-14T14:30:00Z',
        outcome: 'positive'
      }
    ],
    products: ['Industrial Water Pump HP-2000', 'Installation Package'],
    requirements: 'High-capacity pumps for new construction project',
    budget: 500000,
    decisionMakers: ['Ahmed Al-Rashid (CEO)', 'Sara Al-Mahmoud (CFO)'],
    competitorInfo: 'Comparing with TechFlow and HydroSystems',
    leadScore: 92,
    engagementLevel: 'high'
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    nameAr: 'فاطمة الزهراء',
    email: 'f.alzahra@oiltech.sa',
    phone: '+966 55 987 6543',
    company: 'Saudi Oil Technologies',
    companyAr: 'تقنيات النفط السعودية',
    position: 'Procurement Manager',
    positionAr: 'مدير المشتريات',
    status: 'qualified',
    priority: 'high',
    source: 'website',
    assignedTo: 'Sales Rep 2',
    potentialValue: 280000,
    probability: 65,
    expectedCloseDate: '2024-05-20T00:00:00Z',
    createdAt: '2024-02-25T11:15:00Z',
    lastContactDate: '2024-03-10T16:45:00Z',
    nextFollowUp: '2024-03-20T10:00:00Z',
    notes: 'Looking for reliable hydraulic systems for oil field operations. Technical specifications review in progress.',
    tags: ['oil-gas', 'procurement', 'hydraulics'],
    address: {
      street: '456 Industrial City',
      city: 'Dammam',
      country: 'Saudi Arabia'
    },
    industry: 'Oil & Gas',
    employeeCount: '1000+',
    website: 'https://oiltech.sa',
    interactions: [
      {
        id: 'int-4',
        type: 'email',
        subject: 'Product Inquiry Response',
        content: 'Sent detailed specifications and pricing for hydraulic systems.',
        timestamp: '2024-02-25T11:15:00Z',
        outcome: 'neutral'
      },
      {
        id: 'int-5',
        type: 'call',
        subject: 'Technical Discussion',
        content: 'Discussed technical requirements and compliance standards.',
        timestamp: '2024-03-10T16:45:00Z',
        outcome: 'positive'
      }
    ],
    products: ['Hydraulic Cylinder 200mm Bore', 'Pressure Control Valves'],
    requirements: 'Hydraulic systems for oil drilling equipment',
    budget: 350000,
    decisionMakers: ['Fatima Al-Zahra (Procurement)', 'Omar Al-Said (Technical)'],
    leadScore: 78,
    engagementLevel: 'medium'
  },
  {
    id: '3',
    name: 'Mohammad Al-Qasim',
    nameAr: 'محمد القاسم',
    email: 'm.qasim@manufacturing.sa',
    phone: '+966 53 456 7890',
    company: 'Al-Qasim Manufacturing',
    companyAr: 'صناعات القاسم',
    position: 'Operations Director',
    positionAr: 'مدير العمليات',
    status: 'contacted',
    priority: 'medium',
    source: 'cold_call',
    assignedTo: 'Sales Rep 1',
    potentialValue: 125000,
    probability: 35,
    expectedCloseDate: '2024-06-30T00:00:00Z',
    createdAt: '2024-03-01T09:30:00Z',
    lastContactDate: '2024-03-05T11:00:00Z',
    nextFollowUp: '2024-03-22T14:00:00Z',
    notes: 'Interested in electric motors for manufacturing line upgrade. Still in early evaluation phase.',
    tags: ['manufacturing', 'motors', 'evaluation'],
    address: {
      street: '789 Industrial Zone',
      city: 'Jeddah',
      country: 'Saudi Arabia'
    },
    industry: 'Manufacturing',
    employeeCount: '200-500',
    interactions: [
      {
        id: 'int-6',
        type: 'call',
        subject: 'Cold Outreach',
        content: 'Initial contact to introduce our electric motor solutions.',
        timestamp: '2024-03-01T09:30:00Z',
        outcome: 'neutral'
      },
      {
        id: 'int-7',
        type: 'email',
        subject: 'Follow-up Information',
        content: 'Sent product catalog and case studies.',
        timestamp: '2024-03-05T11:00:00Z',
        outcome: 'neutral'
      }
    ],
    products: ['Three-Phase Electric Motor 50HP'],
    requirements: 'Energy-efficient motors for production equipment',
    budget: 150000,
    decisionMakers: ['Mohammad Al-Qasim (Operations)', 'Layla Al-Harbi (Finance)'],
    leadScore: 58,
    engagementLevel: 'low'
  }
];

const pipelineData: Pipeline[] = [
  { stage: 'New', stageAr: 'جديد', count: 45, value: 2250000, probability: 10, averageTime: 3 },
  { stage: 'Contacted', stageAr: 'تم التواصل', count: 28, value: 1680000, probability: 25, averageTime: 7 },
  { stage: 'Qualified', stageAr: 'مؤهل', count: 18, value: 1440000, probability: 45, averageTime: 14 },
  { stage: 'Proposal', stageAr: 'عرض', count: 12, value: 1200000, probability: 65, averageTime: 21 },
  { stage: 'Negotiation', stageAr: 'تفاوض', count: 8, value: 960000, probability: 85, averageTime: 35 },
  { stage: 'Won', stageAr: 'فوز', count: 23, value: 2070000, probability: 100, averageTime: 45 }
];

const statusColors = {
  new: 'bg-gray-100 text-gray-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-green-100 text-green-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-purple-100 text-purple-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  hot: 'bg-red-100 text-red-800'
};

const sourceIcons = {
  website: '🌐',
  social: '📱',
  referral: '👥',
  cold_call: '📞',
  email: '📧',
  event: '🎯',
  partnership: '🤝'
};

export default function CRMSystem() {
  const { t, isRTL } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate CRM metrics
  const metrics = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => ['qualified', 'proposal', 'negotiation'].includes(l.status)).length,
    hotLeads: leads.filter(l => l.priority === 'hot').length,
    totalValue: leads.reduce((sum, l) => sum + l.potentialValue, 0),
    weightedValue: leads.reduce((sum, l) => sum + (l.potentialValue * l.probability / 100), 0),
    averageLeadScore: leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length,
    conversionRate: (leads.filter(l => l.status === 'won').length / leads.length) * 100,
    averageDealSize: leads.reduce((sum, l) => sum + l.potentialValue, 0) / leads.length
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  // Chart data
  const leadSourceData = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([source, count]) => ({ name: source, value: count }));

  const conversionFunnelData = pipelineData.map(stage => ({
    stage: isRTL ? stage.stageAr : stage.stage,
    leads: stage.count,
    value: stage.value,
    probability: stage.probability
  }));

  const formatCurrency = (amount: number) => {
    return isRTL ? `${amount.toLocaleString()} ر.س` : `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'نظام إدارة علاقات العملاء المتقدم' : 'Advanced CRM & Lead Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRTL ? 'إدارة شاملة للعملاء المحتملين مع تتبع متقدم وأتمتة المبيعات' : 'Comprehensive lead management with advanced tracking and sales automation'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'تقرير المبيعات' : 'Sales Report'}
          </Button>
          <Button variant="outline" size="sm">
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'تحديث البيانات' : 'Refresh'}
          </Button>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'عميل محتمل جديد' : 'New Lead'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={isRTL ? 'إجمالي العملاء المحتملين' : 'Total Leads'}
          value={metrics.totalLeads}
          change={12}
          changeType="increase"
          icon={UserGroupIcon}
          iconColor="text-blue-600"
        />
        <MetricsCard
          title={isRTL ? 'عملاء مؤهلون' : 'Qualified Leads'}
          value={metrics.qualifiedLeads}
          change={8}
          changeType="increase"
          icon={CheckCircleIcon}
          iconColor="text-green-600"
        />
        <MetricsCard
          title={isRTL ? 'القيمة المرجحة' : 'Weighted Pipeline Value'}
          value={metrics.weightedValue}
          change={15.5}
          changeType="increase"
          icon={CurrencyDollarIcon}
          iconColor="text-green-600"
          format="currency"
        />
        <MetricsCard
          title={isRTL ? 'متوسط نقاط العميل' : 'Avg Lead Score'}
          value={Number(metrics.averageLeadScore.toFixed(0))}
          change={5.2}
          changeType="increase"
          icon={StarIcon}
          iconColor="text-yellow-600"
        />
      </div>

      {/* CRM System Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="pipeline">{isRTL ? 'خط الأنابيب' : 'Pipeline'}</TabsTrigger>
          <TabsTrigger value="leads">{isRTL ? 'العملاء المحتملون' : 'Leads'}</TabsTrigger>
          <TabsTrigger value="activities">{isRTL ? 'الأنشطة' : 'Activities'}</TabsTrigger>
          <TabsTrigger value="analytics">{isRTL ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          <TabsTrigger value="automation">{isRTL ? 'الأتمتة' : 'Automation'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="space-y-6 mt-6">
          {/* Sales Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
                {isRTL ? 'نظرة عامة على خط المبيعات' : 'Sales Pipeline Overview'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تتبع تقدم العملاء المحتملين عبر مراحل المبيعات المختلفة' : 'Track lead progression through different sales stages'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {pipelineData.map((stage, index) => (
                  <Card key={stage.stage} className={`border-2 ${
                    index === pipelineData.length - 1 ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-700 text-center">
                        {isRTL ? stage.stageAr : stage.stage}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{stage.count}</div>
                      <div className="text-sm font-semibold text-green-600 mb-2">
                        {formatCurrency(stage.value)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stage.probability}% {isRTL ? 'احتمالية' : 'probability'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stage.averageTime} {isRTL ? 'يوم متوسط' : 'days avg'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pipeline Flow Visualization */}
              <div className="mt-6 flex items-center justify-center space-x-2">
                {pipelineData.slice(0, -1).map((stage, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      stage.count > 20 ? 'bg-green-500' : stage.count > 10 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {stage.count}
                    </div>
                    <ArrowRightIcon className="w-6 h-6 text-gray-400 mx-2" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-green-500">
                  {pipelineData[pipelineData.length - 1].count}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hot Leads Alert */}
          {metrics.hotLeads > 0 && (
            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <FireSolidIcon className="w-5 h-5 mr-2" />
                  {isRTL ? 'عملاء محتملون عاجلون' : 'Hot Leads Requiring Attention'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.filter(l => l.priority === 'hot').slice(0, 3).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">
                          {isRTL ? lead.nameAr : lead.name}
                        </h4>
                        <p className="text-sm text-red-700">
                          {isRTL ? lead.companyAr : lead.company} • {formatCurrency(lead.potentialValue)}
                        </p>
                        <p className="text-xs text-red-600">
                          {isRTL ? 'المتابعة التالية:' : 'Next follow-up:'} {new Date(lead.nextFollowUp!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'اتصال' : 'Call'}
                        </Button>
                        <Button size="sm">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'عرض' : 'View'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pipeline Conversion Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'مسار التحويل' : 'Conversion Funnel'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                data={conversionFunnelData}
                type="bar"
                title=""
                xKey="stage"
                yKey="leads"
                color="#3B82F6"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 lg:w-96">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={isRTL ? 'البحث في العملاء المحتملين...' : 'Search leads...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                {isRTL ? 'فلاتر' : 'Filters'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
                <option value="new">{isRTL ? 'جديد' : 'New'}</option>
                <option value="contacted">{isRTL ? 'تم التواصل' : 'Contacted'}</option>
                <option value="qualified">{isRTL ? 'مؤهل' : 'Qualified'}</option>
                <option value="proposal">{isRTL ? 'عرض' : 'Proposal'}</option>
                <option value="negotiation">{isRTL ? 'تفاوض' : 'Negotiation'}</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">{isRTL ? 'كل الأولويات' : 'All Priorities'}</option>
                <option value="hot">{isRTL ? 'عاجل' : 'Hot'}</option>
                <option value="high">{isRTL ? 'عالي' : 'High'}</option>
                <option value="medium">{isRTL ? 'متوسط' : 'Medium'}</option>
                <option value="low">{isRTL ? 'منخفض' : 'Low'}</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'المصدر' : 'Lead Source'}
                    </label>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">{isRTL ? 'كل المصادر' : 'All Sources'}</option>
                      <option value="website">{isRTL ? 'الموقع' : 'Website'}</option>
                      <option value="social">{isRTL ? 'وسائل التواصل' : 'Social Media'}</option>
                      <option value="referral">{isRTL ? 'إحالة' : 'Referral'}</option>
                      <option value="cold_call">{isRTL ? 'اتصال بارد' : 'Cold Call'}</option>
                      <option value="email">{isRTL ? 'بريد إلكتروني' : 'Email'}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'الصناعة' : 'Industry'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{isRTL ? 'كل الصناعات' : 'All Industries'}</option>
                      <option value="construction">{isRTL ? 'البناء' : 'Construction'}</option>
                      <option value="oil_gas">{isRTL ? 'النفط والغاز' : 'Oil & Gas'}</option>
                      <option value="manufacturing">{isRTL ? 'التصنيع' : 'Manufacturing'}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'نطاق القيمة' : 'Value Range'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{isRTL ? 'كل القيم' : 'All Values'}</option>
                      <option value="0-50000">$0 - $50,000</option>
                      <option value="50000-200000">$50,000 - $200,000</option>
                      <option value="200000+">$200,000+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'المسؤول' : 'Assigned To'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{isRTL ? 'جميع المسؤولين' : 'All Reps'}</option>
                      <option value="rep1">{isRTL ? 'مندوب مبيعات 1' : 'Sales Rep 1'}</option>
                      <option value="rep2">{isRTL ? 'مندوب مبيعات 2' : 'Sales Rep 2'}</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    {isRTL ? 'إعادة تعيين' : 'Reset'}
                  </Button>
                  <Button size="sm">
                    {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leads List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'العملاء المحتملون' : 'Leads'} ({filteredLeads.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {isRTL ? lead.nameAr : lead.name}
                          </h3>
                          {lead.priority === 'hot' && (
                            <FireSolidIcon className="w-5 h-5 text-red-500" />
                          )}
                          <Badge className={statusColors[lead.status]}>
                            {lead.status}
                          </Badge>
                          <Badge className={priorityColors[lead.priority]}>
                            {lead.priority}
                          </Badge>
                          <span className="text-lg" title={lead.source}>
                            {sourceIcons[lead.source]}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              {isRTL ? lead.companyAr : lead.company}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? lead.positionAr : lead.position}
                            </p>
                            <div className="flex items-center text-gray-500 mt-1 space-x-2">
                              <EnvelopeIcon className="w-3 h-3" />
                              <span>{lead.email}</span>
                            </div>
                            <div className="flex items-center text-gray-500 space-x-2">
                              <PhoneIcon className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-700 mb-1">
                              {isRTL ? 'تفاصيل الفرصة' : 'Opportunity Details'}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'القيمة المحتملة:' : 'Value:'} {formatCurrency(lead.potentialValue)}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'الاحتمالية:' : 'Probability:'} {lead.probability}%
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'الإغلاق المتوقع:' : 'Expected close:'} {new Date(lead.expectedCloseDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                              {isRTL ? 'نقاط العميل:' : 'Lead score:'} 
                              <span className={`ml-1 font-semibold ${
                                lead.leadScore >= 80 ? 'text-green-600' :
                                lead.leadScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {lead.leadScore}/100
                              </span>
                            </p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-gray-700 mb-1">
                              {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
                            </p>
                            {lead.interactions.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600">
                                  {lead.interactions[lead.interactions.length - 1].subject}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(lead.interactions[lead.interactions.length - 1].timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {lead.nextFollowUp && (
                              <p className="text-sm text-blue-600 mt-2">
                                {isRTL ? 'المتابعة التالية:' : 'Next follow-up:'} {new Date(lead.nextFollowUp).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lead Score and Engagement */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {isRTL ? 'نقاط العميل ومستوى التفاعل' : 'Lead Score & Engagement'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {lead.leadScore}/100 • {lead.engagementLevel} {isRTL ? 'تفاعل' : 'engagement'}
                        </span>
                      </div>
                      <Progress value={lead.leadScore} className="h-2" />
                    </div>
                    
                    {/* Tags */}
                    {lead.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <TagIcon className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'اتصال' : 'Call'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <EnvelopeIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'بريد إلكتروني' : 'Email'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'موعد' : 'Schedule'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead)}>
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'عرض' : 'View'}
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {isRTL ? 'مسؤول:' : 'Assigned to:'} {lead.assignedTo || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredLeads.length === 0 && (
                <div className="text-center py-12">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? 'لم يتم العثور على عملاء محتملين' : 'No leads found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isRTL ? 'حاول تعديل معايير البحث أو الفلاتر' : 'Try adjusting your search criteria or filters'}
                  </p>
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {isRTL ? 'إضافة عميل محتمل جديد' : 'Add New Lead'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6 mt-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'الأنشطة الأخيرة' : 'Recent Activities'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تتبع جميع التفاعلات مع العملاء المحتملين' : 'Track all interactions with leads'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.flatMap(lead => 
                  lead.interactions.map(interaction => ({ ...interaction, lead }))
                ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10).map((activity) => (
                  <div key={`${activity.lead.id}-${activity.id}`} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'call' ? 'bg-blue-100' :
                      activity.type === 'email' ? 'bg-green-100' :
                      activity.type === 'meeting' ? 'bg-purple-100' :
                      activity.type === 'proposal' ? 'bg-orange-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'call' && <PhoneIcon className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'email' && <EnvelopeIcon className="w-4 h-4 text-green-600" />}
                      {activity.type === 'meeting' && <CalendarIcon className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'proposal' && <DocumentTextIcon className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                        <div className="flex items-center space-x-2">
                          {activity.outcome && (
                            <Badge className={
                              activity.outcome === 'positive' ? 'bg-green-100 text-green-800' :
                              activity.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {activity.outcome}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.content}</p>
                      <p className="text-xs text-gray-500">
                        {isRTL ? 'مع' : 'with'} {isRTL ? activity.lead.nameAr : activity.lead.name} ({isRTL ? activity.lead.companyAr : activity.lead.company})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-orange-600" />
                {isRTL ? 'المهام القادمة' : 'Upcoming Tasks'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leads.filter(l => l.nextFollowUp).sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime()).slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-900">
                        {isRTL ? 'متابعة مع' : 'Follow up with'} {isRTL ? lead.nameAr : lead.name}
                      </h4>
                      <p className="text-sm text-yellow-700">
                        {isRTL ? lead.companyAr : lead.company} • {formatCurrency(lead.potentialValue)}
                      </p>
                      <p className="text-xs text-yellow-600">
                        {new Date(lead.nextFollowUp!).toLocaleDateString()} {new Date(lead.nextFollowUp!).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <PhoneIcon className="w-4 h-4 mr-1" />
                        {isRTL ? 'اتصال' : 'Call'}
                      </Button>
                      <Button size="sm">
                        {isRTL ? 'تم' : 'Done'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* CRM Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'مصادر العملاء المحتملين' : 'Lead Sources'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={leadSourceData}
                  type="pie"
                  title=""
                  height={300}
                  colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'اتجاه التحويل' : 'Conversion Trends'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={[
                    { month: 'Jan', leads: 45, conversions: 8 },
                    { month: 'Feb', leads: 52, conversions: 12 },
                    { month: 'Mar', leads: 48, conversions: 9 },
                    { month: 'Apr', leads: 61, conversions: 15 },
                    { month: 'May', leads: 58, conversions: 13 },
                    { month: 'Jun', leads: 67, conversions: 18 }
                  ]}
                  type="line"
                  title=""
                  xKey="month"
                  yKey="conversions"
                  color="#10B981"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'معدلات الأداء' : 'Performance Rates'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</span>
                      <span className="text-lg font-bold text-green-600">{metrics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.conversionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل الاستجابة' : 'Response Rate'}</span>
                      <span className="text-lg font-bold text-blue-600">73.2%</span>
                    </div>
                    <Progress value={73.2} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل التأهيل' : 'Qualification Rate'}</span>
                      <span className="text-lg font-bold text-purple-600">45.8%</span>
                    </div>
                    <Progress value={45.8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'المقاييس الزمنية' : 'Time Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <p className="text-sm text-gray-600">{isRTL ? 'متوسط أيام الإغلاق' : 'Avg Days to Close'}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">4.2</div>
                    <p className="text-sm text-gray-600">{isRTL ? 'متوسط اللمسات للإغلاق' : 'Avg Touches to Close'}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.3</div>
                    <p className="text-sm text-gray-600">{isRTL ? 'ساعات متوسط الاستجابة' : 'Avg Response Time (hrs)'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'قيمة الخط الأنبوب' : 'Pipeline Value'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(metrics.totalValue)}
                    </div>
                    <p className="text-sm text-gray-600">{isRTL ? 'إجمالي قيمة الخط' : 'Total Pipeline Value'}</p>
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'القيمة المرجحة' : 'Weighted Value'}</span>
                      <span className="font-medium">{formatCurrency(metrics.weightedValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'متوسط حجم الصفقة' : 'Avg Deal Size'}</span>
                      <span className="font-medium">{formatCurrency(metrics.averageDealSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'الصفقات المتوقعة' : 'Forecast This Quarter'}</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(metrics.weightedValue * 1.2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6 mt-6">
          {/* Automation Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-600" />
                {isRTL ? 'قواعد الأتمتة النشطة' : 'Active Automation Rules'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'أتمتة المهام والمتابعات لتحسين كفاءة فريق المبيعات' : 'Automate tasks and follow-ups to improve sales team efficiency'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-green-900 mb-1">
                          {isRTL ? 'تذكير المتابعة التلقائي' : 'Automatic Follow-up Reminders'}
                        </h4>
                        <p className="text-sm text-green-700">
                          {isRTL ? 'يرسل تذكيرات تلقائية قبل موعد المتابعة بـ 24 ساعة' : 'Sends automatic reminders 24 hours before follow-up appointments'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-green-600">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          {isRTL ? 'مفعل للعملاء عالي الأولوية' : 'Enabled for high-priority leads'}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-1">
                          {isRTL ? 'تحديث نقاط العميل' : 'Lead Score Updates'}
                        </h4>
                        <p className="text-sm text-blue-700">
                          {isRTL ? 'يحدث نقاط العميل تلقائياً بناءً على الأنشطة والتفاعلات' : 'Automatically updates lead scores based on activities and interactions'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-blue-600">
                          <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                          {isRTL ? 'محدث في الوقت الفعلي' : 'Updated in real-time'}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-900 mb-1">
                          {isRTL ? 'تخصيص العملاء المحتملين' : 'Lead Assignment'}
                        </h4>
                        <p className="text-sm text-purple-700">
                          {isRTL ? 'يخصص العملاء الجدد تلقائياً بناءً على المنطقة والصناعة' : 'Automatically assigns new leads based on territory and industry'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-purple-600">
                          <UserGroupIcon className="w-3 h-3 mr-1" />
                          {isRTL ? 'توزيع متوازن' : 'Balanced distribution'}
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-orange-900 mb-1">
                          {isRTL ? 'تنبيهات العملاء الباردين' : 'Cold Lead Alerts'}
                        </h4>
                        <p className="text-sm text-orange-700">
                          {isRTL ? 'ينبه عندما لم يتم التواصل مع العميل لأكثر من 14 يوم' : 'Alerts when a lead hasn\'t been contacted for more than 14 days'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-orange-600">
                          <BellIcon className="w-3 h-3 mr-1" />
                          {isRTL ? '23 عميل يحتاج متابعة' : '23 leads need attention'}
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'قوالب البريد الإلكتروني' : 'Email Templates'}</CardTitle>
              <CardDescription>
                {isRTL ? 'قوالب جاهزة لمراحل المبيعات المختلفة' : 'Pre-built templates for different sales stages'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'رسالة الترحيب الأولى' : 'Initial Welcome Email'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {isRTL ? 'للعملاء الجدد المسجلين من الموقع' : 'For new leads from website registration'}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'معاينة' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'تعديل' : 'Edit'}
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'متابعة بعد العرض' : 'Post-Demo Follow-up'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {isRTL ? 'للمتابعة بعد عرض المنتج' : 'For following up after product demonstration'}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'معاينة' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'تعديل' : 'Edit'}
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'عرض الأسعار' : 'Pricing Proposal'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {isRTL ? 'لإرسال عروض الأسعار المخصصة' : 'For sending customized pricing proposals'}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'معاينة' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'تعديل' : 'Edit'}
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {isRTL ? 'إعادة التفعيل' : 'Re-engagement'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {isRTL ? 'لإعادة تفعيل العملاء الباردين' : 'For re-activating cold leads'}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'معاينة' : 'Preview'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="w-4 h-4 mr-1" />
                      {isRTL ? 'تعديل' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {isRTL ? 'تفاصيل العميل المحتمل' : 'Lead Details'} - {isRTL ? selectedLead.nameAr : selectedLead.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                  <XCircleIcon className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Lead Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">{isRTL ? 'معلومات الاتصال' : 'Contact Information'}</h3>
                    <div className="space-y-2">
                      <p><strong>{isRTL ? 'الاسم:' : 'Name:'}</strong> {isRTL ? selectedLead.nameAr : selectedLead.name}</p>
                      <p><strong>{isRTL ? 'الشركة:' : 'Company:'}</strong> {isRTL ? selectedLead.companyAr : selectedLead.company}</p>
                      <p><strong>{isRTL ? 'المنصب:' : 'Position:'}</strong> {isRTL ? selectedLead.positionAr : selectedLead.position}</p>
                      <p><strong>{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</strong> {selectedLead.email}</p>
                      <p><strong>{isRTL ? 'الهاتف:' : 'Phone:'}</strong> {selectedLead.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">{isRTL ? 'تفاصيل الفرصة' : 'Opportunity Details'}</h3>
                    <div className="space-y-2">
                      <p><strong>{isRTL ? 'القيمة المحتملة:' : 'Potential Value:'}</strong> {formatCurrency(selectedLead.potentialValue)}</p>
                      <p><strong>{isRTL ? 'الاحتمالية:' : 'Probability:'}</strong> {selectedLead.probability}%</p>
                      <p><strong>{isRTL ? 'الحالة:' : 'Status:'}</strong> <Badge className={statusColors[selectedLead.status]}>{selectedLead.status}</Badge></p>
                      <p><strong>{isRTL ? 'الأولوية:' : 'Priority:'}</strong> <Badge className={priorityColors[selectedLead.priority]}>{selectedLead.priority}</Badge></p>
                      <p><strong>{isRTL ? 'نقاط العميل:' : 'Lead Score:'}</strong> {selectedLead.leadScore}/100</p>
                    </div>
                  </div>
                </div>

                {/* Interaction History */}
                <div>
                  <h3 className="font-semibold mb-3">{isRTL ? 'تاريخ التفاعلات' : 'Interaction History'}</h3>
                  <div className="space-y-3">
                    {selectedLead.interactions.map((interaction) => (
                      <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{interaction.subject}</h4>
                          <div className="flex items-center space-x-2">
                            {interaction.outcome && (
                              <Badge className={
                                interaction.outcome === 'positive' ? 'bg-green-100 text-green-800' :
                                interaction.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {interaction.outcome}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(interaction.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{interaction.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products of Interest */}
                {selectedLead.products.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">{isRTL ? 'المنتجات المهتم بها' : 'Products of Interest'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.products.map((product) => (
                        <Badge key={product} variant="secondary">{product}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="font-semibold mb-3">{isRTL ? 'الملاحظات' : 'Notes'}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedLead.notes}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}