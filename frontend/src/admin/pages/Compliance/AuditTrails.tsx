import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  User,
  Activity,
  Database,
  Lock,
  Unlock,
  Flag,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
  RefreshCw,
  Bell,
  Zap,
  Target,
  Award,
  Building,
  Globe,
  Scale
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

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: 'user_action' | 'system_event' | 'data_change' | 'security_event' | 'compliance_check';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  subcategory: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    ipAddress: string;
  };
  resource: {
    type: string;
    id: string;
    name: string;
  };
  action: string;
  description: string;
  descriptionAr: string;
  details: Record<string, any>;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  compliance: {
    frameworks: string[];
    risk_level: 'low' | 'medium' | 'high';
    requires_review: boolean;
    reviewed_by?: string;
    reviewed_at?: Date;
    review_notes?: string;
  };
  metadata: {
    session_id: string;
    user_agent: string;
    location?: string;
    device_info?: string;
  };
}

interface ComplianceFramework {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  requirements: string[];
  status: 'compliant' | 'non_compliant' | 'partial' | 'pending_review';
  lastAudit: Date;
  nextAudit: Date;
  score: number;
  criticalFindings: number;
}

export const AuditTrails: React.FC = () => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('audit-log');

  const mockAuditEvents: AuditEvent[] = [
    {
      id: 'AUD-001',
      timestamp: new Date('2024-01-22T14:30:00Z'),
      eventType: 'user_action',
      severity: 'medium',
      category: 'Contract Management',
      subcategory: 'Contract Creation',
      user: {
        id: 'U-001',
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@company.com',
        role: 'Procurement Manager',
        ipAddress: '192.168.1.100'
      },
      resource: {
        type: 'contract',
        id: 'CNT-2024-001',
        name: 'Industrial Equipment Supply Agreement'
      },
      action: 'CREATE_CONTRACT',
      description: 'Created new contract for industrial equipment supply',
      descriptionAr: 'إنشاء عقد جديد لتوريد المعدات الصناعية',
      details: {
        contract_value: 2500000,
        supplier: 'Saudi Industrial Solutions',
        approval_required: true
      },
      changes: [
        { field: 'status', oldValue: null, newValue: 'draft' },
        { field: 'value', oldValue: null, newValue: 2500000 }
      ],
      compliance: {
        frameworks: ['SOX', 'ISO 27001'],
        risk_level: 'medium',
        requires_review: true
      },
      metadata: {
        session_id: 'sess_12345',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        location: 'Riyadh, Saudi Arabia'
      }
    },
    {
      id: 'AUD-002',
      timestamp: new Date('2024-01-22T13:15:00Z'),
      eventType: 'security_event',
      severity: 'high',
      category: 'Authentication',
      subcategory: 'Failed Login',
      user: {
        id: 'U-002',
        name: 'Unknown User',
        email: 'suspicious@example.com',
        role: 'N/A',
        ipAddress: '203.0.113.50'
      },
      resource: {
        type: 'user_account',
        id: 'ACC-001',
        name: 'admin@company.com'
      },
      action: 'LOGIN_FAILED',
      description: 'Multiple failed login attempts detected',
      descriptionAr: 'تم اكتشاف محاولات دخول فاشلة متعددة',
      details: {
        attempts: 5,
        blocked: true,
        reason: 'Too many failed attempts'
      },
      compliance: {
        frameworks: ['ISO 27001', 'PCI DSS'],
        risk_level: 'high',
        requires_review: true
      },
      metadata: {
        session_id: 'sess_67890',
        user_agent: 'curl/7.68.0',
        location: 'Unknown'
      }
    },
    {
      id: 'AUD-003',
      timestamp: new Date('2024-01-22T12:00:00Z'),
      eventType: 'data_change',
      severity: 'low',
      category: 'Supplier Management',
      subcategory: 'Supplier Update',
      user: {
        id: 'U-003',
        name: 'Fatima Al-Zahra',
        email: 'fatima@company.com',
        role: 'Supplier Relations Manager',
        ipAddress: '192.168.1.105'
      },
      resource: {
        type: 'supplier',
        id: 'SUP-001',
        name: 'Saudi Industrial Solutions'
      },
      action: 'UPDATE_SUPPLIER_RATING',
      description: 'Updated supplier performance rating',
      descriptionAr: 'تحديث تقييم أداء المورد',
      details: {
        performance_category: 'Quality',
        previous_rating: 4.2,
        new_rating: 4.5
      },
      changes: [
        { field: 'quality_rating', oldValue: 4.2, newValue: 4.5 },
        { field: 'last_evaluated', oldValue: '2023-12-15', newValue: '2024-01-22' }
      ],
      compliance: {
        frameworks: ['Internal Quality Standards'],
        risk_level: 'low',
        requires_review: false
      },
      metadata: {
        session_id: 'sess_11111',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        location: 'Jeddah, Saudi Arabia'
      }
    }
  ];

  const mockComplianceFrameworks: ComplianceFramework[] = [
    {
      id: 'SOX',
      name: 'Sarbanes-Oxley Act',
      nameAr: 'قانون ساربانيس-أوكسلي',
      description: 'Financial reporting and corporate governance compliance',
      requirements: [
        'Financial controls documentation',
        'Audit trail maintenance',
        'Management certification',
        'Internal control assessment'
      ],
      status: 'compliant',
      lastAudit: new Date('2023-12-01'),
      nextAudit: new Date('2024-06-01'),
      score: 95,
      criticalFindings: 0
    },
    {
      id: 'ISO27001',
      name: 'ISO 27001',
      nameAr: 'آيزو 27001',
      description: 'Information security management systems',
      requirements: [
        'Security policy documentation',
        'Risk assessment procedures',
        'Access control management',
        'Incident response procedures'
      ],
      status: 'partial',
      lastAudit: new Date('2024-01-15'),
      nextAudit: new Date('2024-07-15'),
      score: 82,
      criticalFindings: 2
    },
    {
      id: 'GDPR',
      name: 'General Data Protection Regulation',
      nameAr: 'اللائحة العامة لحماية البيانات',
      description: 'Data protection and privacy compliance',
      requirements: [
        'Data processing documentation',
        'Consent management',
        'Data subject rights',
        'Privacy impact assessments'
      ],
      status: 'compliant',
      lastAudit: new Date('2023-11-20'),
      nextAudit: new Date('2024-05-20'),
      score: 88,
      criticalFindings: 1
    }
  ];

  const filteredEvents = useMemo(() => {
    return mockAuditEvents.filter(event => {
      const matchesSearch = 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.descriptionAr.includes(searchQuery) ||
        event.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.resource.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEventType = eventTypeFilter === 'all' || event.eventType === eventTypeFilter;
      const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesCompliance = complianceFilter === 'all' || 
        event.compliance.frameworks.some(f => f.toLowerCase().includes(complianceFilter.toLowerCase()));
      
      return matchesSearch && matchesEventType && matchesSeverity && matchesCategory && matchesCompliance;
    });
  }, [mockAuditEvents, searchQuery, eventTypeFilter, severityFilter, categoryFilter, complianceFilter]);

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
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
      <Badge className={`${colors[severity as keyof typeof colors]} hover:${colors[severity as keyof typeof colors]}`}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const getEventTypeBadge = (type: string) => {
    const colors = {
      user_action: 'bg-blue-100 text-blue-800',
      system_event: 'bg-purple-100 text-purple-800',
      data_change: 'bg-green-100 text-green-800',
      security_event: 'bg-red-100 text-red-800',
      compliance_check: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      user_action: isRTL ? 'إجراء مستخدم' : 'User Action',
      system_event: isRTL ? 'حدث نظام' : 'System Event',
      data_change: isRTL ? 'تغيير بيانات' : 'Data Change',
      security_event: isRTL ? 'حدث أمني' : 'Security Event',
      compliance_check: isRTL ? 'فحص امتثال' : 'Compliance Check'
    };

    return (
      <Badge className={`${colors[type as keyof typeof colors]} hover:${colors[type as keyof typeof colors]}`}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const getComplianceStatusBadge = (status: string) => {
    const colors = {
      compliant: 'bg-green-100 text-green-800',
      non_compliant: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
      pending_review: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      compliant: isRTL ? 'متوافق' : 'Compliant',
      non_compliant: isRTL ? 'غير متوافق' : 'Non-Compliant',
      partial: isRTL ? 'جزئي' : 'Partial',
      pending_review: isRTL ? 'قيد المراجعة' : 'Pending Review'
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} hover:${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  // Statistics
  const totalEvents = mockAuditEvents.length;
  const criticalEvents = mockAuditEvents.filter(e => e.severity === 'critical').length;
  const securityEvents = mockAuditEvents.filter(e => e.eventType === 'security_event').length;
  const complianceScore = mockComplianceFrameworks.reduce((sum, f) => sum + f.score, 0) / mockComplianceFrameworks.length;
  const requiresReview = mockAuditEvents.filter(e => e.compliance.requires_review).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'الامتثال ومسارات التدقيق' : 'Compliance & Audit Trails'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'مراقبة شاملة للامتثال ومسارات التدقيق الأمنية' : 'Comprehensive compliance monitoring and security audit trails'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isRTL ? 'تصدير السجل' : 'Export Log'}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {isRTL ? 'إعدادات المراقبة' : 'Monitoring Settings'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي الأحداث' : 'Total Events'}</p>
                <p className="text-2xl font-bold text-blue-600">{totalEvents}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'أحداث حرجة' : 'Critical Events'}</p>
                <p className="text-2xl font-bold text-red-600">{criticalEvents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'أحداث أمنية' : 'Security Events'}</p>
                <p className="text-2xl font-bold text-orange-600">{securityEvents}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'نقاط الامتثال' : 'Compliance Score'}</p>
                <p className="text-2xl font-bold text-green-600">{complianceScore.toFixed(0)}%</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'يتطلب مراجعة' : 'Requires Review'}</p>
                <p className="text-2xl font-bold text-purple-600">{requiresReview}</p>
              </div>
              <Flag className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-log">{isRTL ? 'سجل التدقيق' : 'Audit Log'}</TabsTrigger>
          <TabsTrigger value="compliance">{isRTL ? 'إطارات الامتثال' : 'Compliance Frameworks'}</TabsTrigger>
          <TabsTrigger value="reports">{isRTL ? 'التقارير' : 'Reports'}</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-log" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={isRTL ? 'البحث في أحداث التدقيق...' : 'Search audit events...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={isRTL ? 'نوع الحدث' : 'Event Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                    <SelectItem value="user_action">{isRTL ? 'إجراء مستخدم' : 'User Action'}</SelectItem>
                    <SelectItem value="system_event">{isRTL ? 'حدث نظام' : 'System Event'}</SelectItem>
                    <SelectItem value="data_change">{isRTL ? 'تغيير بيانات' : 'Data Change'}</SelectItem>
                    <SelectItem value="security_event">{isRTL ? 'حدث أمني' : 'Security Event'}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={isRTL ? 'الخطورة' : 'Severity'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Severity'}</SelectItem>
                    <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                    <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                    <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                    <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={isRTL ? 'الفترة' : 'Period'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">{isRTL ? 'يوم واحد' : '1 Day'}</SelectItem>
                    <SelectItem value="7d">{isRTL ? '7 أيام' : '7 Days'}</SelectItem>
                    <SelectItem value="30d">{isRTL ? '30 يوم' : '30 Days'}</SelectItem>
                    <SelectItem value="90d">{isRTL ? '90 يوم' : '90 Days'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'أحداث التدقيق' : 'Audit Events'} ({filteredEvents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? 'الوقت' : 'Timestamp'}</TableHead>
                    <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                    <TableHead>{isRTL ? 'الخطورة' : 'Severity'}</TableHead>
                    <TableHead>{isRTL ? 'المستخدم' : 'User'}</TableHead>
                    <TableHead>{isRTL ? 'الإجراء' : 'Action'}</TableHead>
                    <TableHead>{isRTL ? 'المورد' : 'Resource'}</TableHead>
                    <TableHead>{isRTL ? 'الامتثال' : 'Compliance'}</TableHead>
                    <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="text-sm">{event.timestamp.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{event.id}</div>
                      </TableCell>
                      <TableCell>{getEventTypeBadge(event.eventType)}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{event.user.name}</div>
                          <div className="text-xs text-gray-500">{event.user.role}</div>
                          <div className="text-xs text-gray-400">{event.user.ipAddress}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{event.action}</div>
                          <div className="text-xs text-gray-600">
                            {isRTL ? event.descriptionAr : event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{event.resource.name}</div>
                          <div className="text-xs text-gray-500">{event.resource.type}:{event.resource.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {event.compliance.frameworks.map((framework) => (
                            <Badge key={framework} variant="outline" className="text-xs mr-1">
                              {framework}
                            </Badge>
                          ))}
                          {event.compliance.requires_review && (
                            <div className="text-xs text-orange-600 flex items-center gap-1">
                              <Flag className="h-3 w-3" />
                              {isRTL ? 'يتطلب مراجعة' : 'Requires Review'}
                            </div>
                          )}
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
                              <FileText className="h-4 w-4 mr-2" />
                              {isRTL ? 'تصدير الحدث' : 'Export Event'}
                            </DropdownMenuItem>
                            {event.compliance.requires_review && (
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isRTL ? 'مراجعة' : 'Review'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {isRTL ? 'لم يتم العثور على أحداث تدقيق' : 'No audit events found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Frameworks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockComplianceFrameworks.map((framework) => (
              <Card key={framework.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{isRTL ? framework.nameAr : framework.name}</CardTitle>
                    {getComplianceStatusBadge(framework.status)}
                  </div>
                  <p className="text-sm text-gray-600">{framework.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'نقاط الامتثال' : 'Compliance Score'}</span>
                      <span className="text-sm font-bold">{framework.score}%</span>
                    </div>
                    <Progress value={framework.score} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'آخر تدقيق' : 'Last Audit'}</span>
                      <span>{framework.lastAudit.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{isRTL ? 'التدقيق التالي' : 'Next Audit'}</span>
                      <span>{framework.nextAudit.toLocaleDateString()}</span>
                    </div>
                    {framework.criticalFindings > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{isRTL ? 'نتائج حرجة' : 'Critical Findings'}</span>
                        <Badge variant="destructive" className="text-xs">
                          {framework.criticalFindings}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Compliance Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isRTL ? 'تقرير الامتثال الشامل' : 'Comprehensive Compliance Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تقرير شامل عن حالة الامتثال لجميع الإطارات' : 'Complete compliance status across all frameworks'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isRTL ? 'تقرير المخاطر الأمنية' : 'Security Risk Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تحليل المخاطر الأمنية والتهديدات المحتملة' : 'Security risk analysis and potential threats'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isRTL ? 'تقرير اتجاهات التدقيق' : 'Audit Trends Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'اتجاهات وأنماط أحداث التدقيق عبر الزمن' : 'Audit event trends and patterns over time'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isRTL ? 'تقرير نشاط المستخدمين' : 'User Activity Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تحليل مفصل لأنشطة المستخدمين والصلاحيات' : 'Detailed user activity and permissions analysis'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrails;