import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Workflow,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Building,
  Package,
  Target,
  TrendingUp,
  Download,
  Upload,
  Bell,
  MessageSquare,
  ShoppingCart,
  Zap,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Progress } from '@/shared/components/ui/progress';

interface ProcurementWorkflow {
  id: string;
  title: string;
  titleAr: string;
  type: 'rfq' | 'rfp' | 'tender' | 'framework' | 'direct_purchase';
  status: 'draft' | 'published' | 'evaluation' | 'negotiation' | 'awarded' | 'cancelled' | 'completed';
  category: string;
  department: string;
  requester: {
    name: string;
    email: string;
    department: string;
  };
  value: {
    estimated: number;
    actual?: number;
    currency: string;
  };
  timeline: {
    created: Date;
    published?: Date;
    deadline: Date;
    awarded?: Date;
    completed?: Date;
  };
  participants: {
    suppliers: number;
    responses: number;
    qualified: number;
  };
  approval: {
    stage: string;
    level: number;
    approvedBy?: string[];
    pendingWith?: string;
    comments?: string;
  };
  documents: string[];
  specifications: {
    technical: boolean;
    commercial: boolean;
    compliance: boolean;
  };
  evaluation: {
    criteria: string[];
    weights: Record<string, number>;
    progress: number;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: 'low' | 'medium' | 'high';
}

export const ProcurementWorkflows: React.FC = () => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('active');

  const mockWorkflows: ProcurementWorkflow[] = [
    {
      id: 'PRW-001',
      title: 'Industrial Equipment Procurement',
      titleAr: 'شراء المعدات الصناعية',
      type: 'rfq',
      status: 'evaluation',
      category: 'Industrial Machinery',
      department: 'Manufacturing',
      requester: {
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@company.com',
        department: 'Production'
      },
      value: {
        estimated: 2500000,
        currency: 'SAR'
      },
      timeline: {
        created: new Date('2024-01-10'),
        published: new Date('2024-01-15'),
        deadline: new Date('2024-02-15'),
      },
      participants: {
        suppliers: 12,
        responses: 8,
        qualified: 5
      },
      approval: {
        stage: 'Technical Evaluation',
        level: 2,
        approvedBy: ['Sarah Ahmed', 'Mohammed Al-Mahmoud'],
        pendingWith: 'Technical Committee'
      },
      documents: ['specifications.pdf', 'terms_conditions.pdf', 'evaluation_criteria.pdf'],
      specifications: {
        technical: true,
        commercial: true,
        compliance: true
      },
      evaluation: {
        criteria: ['Price', 'Quality', 'Delivery Time', 'After Sales Support'],
        weights: { price: 40, quality: 30, delivery: 20, support: 10 },
        progress: 65
      },
      priority: 'high',
      riskLevel: 'medium'
    },
    {
      id: 'PRW-002',
      title: 'Construction Materials Framework Agreement',
      titleAr: 'اتفاقية إطار عمل مواد البناء',
      type: 'framework',
      status: 'negotiation',
      category: 'Construction Materials',
      department: 'Infrastructure',
      requester: {
        name: 'Fatima Al-Zahra',
        email: 'fatima@company.com',
        department: 'Construction'
      },
      value: {
        estimated: 5000000,
        actual: 4750000,
        currency: 'SAR'
      },
      timeline: {
        created: new Date('2023-12-01'),
        published: new Date('2023-12-10'),
        deadline: new Date('2024-01-30'),
        awarded: new Date('2024-01-25')
      },
      participants: {
        suppliers: 8,
        responses: 6,
        qualified: 3
      },
      approval: {
        stage: 'Contract Negotiation',
        level: 3,
        approvedBy: ['Legal Team', 'Procurement Director'],
        pendingWith: 'Finance Director'
      },
      documents: ['framework_specs.pdf', 'pricing_schedule.pdf', 'contract_template.pdf'],
      specifications: {
        technical: true,
        commercial: true,
        compliance: true
      },
      evaluation: {
        criteria: ['Price', 'Quality Certifications', 'Supply Capacity', 'Geographic Coverage'],
        weights: { price: 35, quality: 25, capacity: 25, coverage: 15 },
        progress: 90
      },
      priority: 'critical',
      riskLevel: 'low'
    },
    {
      id: 'PRW-003',
      title: 'IT Services Tender',
      titleAr: 'مناقصة خدمات تكنولوجيا المعلومات',
      type: 'tender',
      status: 'published',
      category: 'IT Services',
      department: 'IT',
      requester: {
        name: 'Omar Hassan',
        email: 'omar@company.com',
        department: 'Information Technology'
      },
      value: {
        estimated: 1200000,
        currency: 'SAR'
      },
      timeline: {
        created: new Date('2024-01-20'),
        published: new Date('2024-01-22'),
        deadline: new Date('2024-02-22'),
      },
      participants: {
        suppliers: 15,
        responses: 3,
        qualified: 0
      },
      approval: {
        stage: 'Published',
        level: 1,
        approvedBy: ['IT Director'],
        comments: 'Awaiting supplier responses'
      },
      documents: ['technical_requirements.pdf', 'service_levels.pdf'],
      specifications: {
        technical: true,
        commercial: true,
        compliance: false
      },
      evaluation: {
        criteria: ['Technical Capability', 'Cost', 'Experience', 'Local Presence'],
        weights: { technical: 40, cost: 30, experience: 20, presence: 10 },
        progress: 10
      },
      priority: 'medium',
      riskLevel: 'medium'
    }
  ];

  const filteredWorkflows = useMemo(() => {
    return mockWorkflows.filter(workflow => {
      const matchesSearch = 
        workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.titleAr.includes(searchQuery) ||
        workflow.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      const matchesType = typeFilter === 'all' || workflow.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || workflow.priority === priorityFilter;
      const matchesDepartment = departmentFilter === 'all' || workflow.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDepartment;
    });
  }, [mockWorkflows, searchQuery, statusFilter, typeFilter, priorityFilter, departmentFilter]);

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      evaluation: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-purple-100 text-purple-800',
      awarded: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-emerald-100 text-emerald-800'
    };

    const labels = {
      draft: isRTL ? 'مسودة' : 'Draft',
      published: isRTL ? 'منشور' : 'Published',
      evaluation: isRTL ? 'تحت التقييم' : 'Evaluation',
      negotiation: isRTL ? 'تفاوض' : 'Negotiation',
      awarded: isRTL ? 'تم الترسية' : 'Awarded',
      cancelled: isRTL ? 'ملغي' : 'Cancelled',
      completed: isRTL ? 'مكتمل' : 'Completed'
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} hover:${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      rfq: 'bg-blue-100 text-blue-800',
      rfp: 'bg-purple-100 text-purple-800',
      tender: 'bg-green-100 text-green-800',
      framework: 'bg-orange-100 text-orange-800',
      direct_purchase: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      rfq: isRTL ? 'طلب عرض سعر' : 'RFQ',
      rfp: isRTL ? 'طلب اقتراح' : 'RFP',
      tender: isRTL ? 'مناقصة' : 'Tender',
      framework: isRTL ? 'إطار عمل' : 'Framework',
      direct_purchase: isRTL ? 'شراء مباشر' : 'Direct Purchase'
    };

    return (
      <Badge className={`${colors[type as keyof typeof colors]} hover:${colors[type as keyof typeof colors]}`}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    const labels = {
      low: isRTL ? 'منخفض' : 'Low',
      medium: isRTL ? 'متوسط' : 'Medium',
      high: isRTL ? 'عالي' : 'High',
      critical: isRTL ? 'حرج' : 'Critical'
    };

    return (
      <Badge className={`${colors[priority as keyof typeof colors]} hover:${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDaysRemaining = (deadline: Date) => {
    const days = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Statistics
  const totalWorkflows = mockWorkflows.length;
  const activeWorkflows = mockWorkflows.filter(w => !['completed', 'cancelled'].includes(w.status)).length;
  const pendingEvaluation = mockWorkflows.filter(w => w.status === 'evaluation').length;
  const totalValue = mockWorkflows.reduce((sum, w) => sum + w.value.estimated, 0);
  const avgResponseRate = mockWorkflows.reduce((sum, w) => sum + (w.participants.responses / w.participants.suppliers * 100), 0) / mockWorkflows.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'تدفقات عمل المشتريات' : 'Procurement Workflows'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة شاملة لعمليات المشتريات والمناقصات' : 'Comprehensive procurement and tendering process management'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isRTL ? 'تقرير الأداء' : 'Performance Report'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? 'تدفق عمل جديد' : 'New Workflow'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي التدفقات' : 'Total Workflows'}</p>
                <p className="text-2xl font-bold text-blue-600">{totalWorkflows}</p>
              </div>
              <Workflow className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'نشط' : 'Active'}</p>
                <p className="text-2xl font-bold text-green-600">{activeWorkflows}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'تحت التقييم' : 'Under Evaluation'}</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingEvaluation}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue, 'SAR')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'معدل الاستجابة' : 'Response Rate'}</p>
                <p className="text-2xl font-bold text-orange-600">{avgResponseRate.toFixed(0)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={isRTL ? 'البحث في تدفقات العمل...' : 'Search workflows...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
                <SelectItem value="published">{isRTL ? 'منشور' : 'Published'}</SelectItem>
                <SelectItem value="evaluation">{isRTL ? 'تحت التقييم' : 'Evaluation'}</SelectItem>
                <SelectItem value="negotiation">{isRTL ? 'تفاوض' : 'Negotiation'}</SelectItem>
                <SelectItem value="awarded">{isRTL ? 'تم الترسية' : 'Awarded'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'النوع' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                <SelectItem value="rfq">{isRTL ? 'طلب عرض سعر' : 'RFQ'}</SelectItem>
                <SelectItem value="rfp">{isRTL ? 'طلب اقتراح' : 'RFP'}</SelectItem>
                <SelectItem value="tender">{isRTL ? 'مناقصة' : 'Tender'}</SelectItem>
                <SelectItem value="framework">{isRTL ? 'إطار عمل' : 'Framework'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الأولوية' : 'Priority'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Priority'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'تدفقات العمل' : 'Workflows'} ({filteredWorkflows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'المعرف' : 'ID'}</TableHead>
                <TableHead>{isRTL ? 'العنوان' : 'Title'}</TableHead>
                <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isRTL ? 'القيمة المتوقعة' : 'Estimated Value'}</TableHead>
                <TableHead>{isRTL ? 'المشاركون' : 'Participants'}</TableHead>
                <TableHead>{isRTL ? 'التقدم' : 'Progress'}</TableHead>
                <TableHead>{isRTL ? 'الأولوية' : 'Priority'}</TableHead>
                <TableHead>{isRTL ? 'الموعد النهائي' : 'Deadline'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <div className="font-mono text-sm font-medium">{workflow.id}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{isRTL ? workflow.titleAr : workflow.title}</div>
                      <div className="text-sm text-gray-500">{workflow.category}</div>
                      <div className="text-xs text-gray-400">{workflow.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(workflow.type)}</TableCell>
                  <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                  <TableCell>
                    <div className="font-bold">{formatCurrency(workflow.value.estimated, workflow.value.currency)}</div>
                    {workflow.value.actual && (
                      <div className="text-xs text-gray-500">
                        {isRTL ? 'الفعلي:' : 'Actual:'} {formatCurrency(workflow.value.actual, workflow.value.currency)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {workflow.participants.suppliers} {isRTL ? 'موردين' : 'suppliers'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {workflow.participants.responses} {isRTL ? 'ردود' : 'responses'} 
                        ({workflow.participants.qualified} {isRTL ? 'مؤهل' : 'qualified'})
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={workflow.evaluation.progress} className="w-16 h-2" />
                      <span className="text-sm font-medium">{workflow.evaluation.progress}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{workflow.approval.stage}</div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(workflow.priority)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{workflow.timeline.deadline.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {getDaysRemaining(workflow.timeline.deadline)} {isRTL ? 'أيام متبقية' : 'days left'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{isRTL ? 'الإجراءات' : 'Actions'}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {isRTL ? 'إرسال إشعار' : 'Send Notification'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          {isRTL ? 'تحميل الوثائق' : 'Download Documents'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {workflow.status === 'draft' && (
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            {isRTL ? 'نشر' : 'Publish'}
                          </DropdownMenuItem>
                        )}
                        {['published', 'evaluation'].includes(workflow.status) && (
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            {isRTL ? 'إيقاف مؤقت' : 'Pause'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {isRTL ? 'لم يتم العثور على تدفقات عمل' : 'No workflows found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcurementWorkflows;