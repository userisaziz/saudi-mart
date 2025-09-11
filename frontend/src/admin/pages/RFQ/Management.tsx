import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ChevronDownIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BanknotesIcon,
  TrophyIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  FlagIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { AdminRFQ, AdminQuote, RFQStatus, Priority, ApprovalStage } from '@/admin/types/rfq-admin';

interface FilterOptions {
  status: RFQStatus | 'all';
  type: string;
  priority: Priority | 'all';
  approvalStage: ApprovalStage | 'all';
  department: string;
  dateRange: string;
  riskLevel: string;
  valueRange: string;
}

const mockAdminRFQs: AdminRFQ[] = [
  {
    id: 'RFQ-001',
    rfqNumber: 'RFQ-2024-001',
    title: 'Industrial Equipment Procurement for Riyadh Facility',
    titleAr: 'شراء المعدات الصناعية لمنشأة الرياض',
    description: 'Comprehensive procurement of industrial machinery and equipment for new manufacturing facility',
    descriptionAr: 'شراء شامل للآلات والمعدات الصناعية لمنشأة تصنيع جديدة',
    type: 'rfq',
    status: 'under_evaluation',
    priority: 'high',
    category: {
      id: 'industrial-machinery',
      nameEn: 'Industrial Machinery',
      nameAr: 'الآلات الصناعية',
      description: 'Heavy industrial machinery and equipment',
      level: 1,
      isActive: true,
      requiresPrequalification: true,
      minimumExperience: 5,
      requiredCertifications: ['ISO 9001', 'CE Marking'],
      estimatedDuration: 90,
      complexityLevel: 'complex',
    },
    requester: {
      id: 'USR-001',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@company.sa',
      department: 'Manufacturing',
      role: 'Procurement Manager',
      company: 'Saudi Industrial Corp',
      phone: '+966-11-4567890',
      location: 'RIYADH',
    },
    budget: {
      estimatedMin: 2000000,
      estimatedMax: 3500000,
      actualAwarded: undefined,
      currency: 'SAR',
      vatIncluded: true,
      paymentTerms: '30 days from delivery',
      budgetApproval: {
        approved: true,
        approvedBy: 'Finance Director',
        approvalDate: '2024-01-15',
        approvalAmount: 3500000,
      },
    },
    timeline: {
      createdAt: '2024-01-10T09:00:00Z',
      publishedAt: '2024-01-15T10:00:00Z',
      quotationDeadline: '2024-02-15T17:00:00Z',
      clarificationDeadline: '2024-02-10T17:00:00Z',
      evaluationStartDate: '2024-02-16T09:00:00Z',
      evaluationEndDate: '2024-02-28T17:00:00Z',
      deliveryDate: '2024-06-30T17:00:00Z',
      contractStartDate: '2024-03-15T09:00:00Z',
      contractEndDate: '2024-06-30T17:00:00Z',
      lastModified: '2024-02-18T14:30:00Z',
    },
    participants: {
      invitedSuppliers: ['SUP-001', 'SUP-002', 'SUP-003', 'SUP-004', 'SUP-005'],
      registeredSuppliers: ['SUP-001', 'SUP-002', 'SUP-003', 'SUP-004'],
      qualifiedSuppliers: ['SUP-001', 'SUP-002', 'SUP-003'],
      disqualifiedSuppliers: ['SUP-004'],
      responsesReceived: 3,
      shortlistedSuppliers: ['SUP-001', 'SUP-002'],
      awardedSupplier: undefined,
    },
    documents: [],
    specifications: [],
    technicalRequirements: [],
    complianceRequirements: [],
    evaluation: {
      criteria: [
        {
          id: 'EVAL-001',
          name: 'Technical Capability',
          nameAr: 'القدرة التقنية',
          description: 'Technical expertise and capability assessment',
          category: 'technical',
          weight: 40,
          scoringMethod: 'percentage',
          minScore: 0,
          maxScore: 100,
          passingScore: 70,
          subcriteria: [],
          evaluators: ['EVAL-001', 'EVAL-002'],
          notes: 'Focus on manufacturing quality and certifications',
        },
        {
          id: 'EVAL-002',
          name: 'Commercial Terms',
          nameAr: 'الشروط التجارية',
          description: 'Price competitiveness and commercial evaluation',
          category: 'commercial',
          weight: 35,
          scoringMethod: 'numeric',
          minScore: 0,
          maxScore: 100,
          passingScore: 60,
          subcriteria: [],
          evaluators: ['EVAL-003'],
        },
        {
          id: 'EVAL-003',
          name: 'Experience & References',
          nameAr: 'الخبرة والمراجع',
          description: 'Past experience and project references',
          category: 'experience',
          weight: 25,
          scoringMethod: 'percentage',
          minScore: 0,
          maxScore: 100,
          passingScore: 65,
          subcriteria: [],
          evaluators: ['EVAL-001', 'EVAL-004'],
        },
      ],
      methodology: 'best_value',
      passingScore: 65,
      weightings: {
        technical: 40,
        commercial: 35,
        experience: 25,
      },
      evaluators: ['EVAL-001', 'EVAL-002', 'EVAL-003', 'EVAL-004'],
      evaluationStatus: 'in_progress',
      clarifications: [],
    },
    approval: {
      currentStage: 'technical_review',
      approvalLevels: [
        {
          level: 1,
          name: 'Technical Review',
          approvers: ['TECH-001', 'TECH-002'],
          requiredApprovals: 2,
          timeoutDays: 5,
          escalationRules: ['Escalate to Department Head after 5 days'],
        },
        {
          level: 2,
          name: 'Commercial Review',
          approvers: ['COMM-001'],
          requiredApprovals: 1,
          timeoutDays: 3,
          escalationRules: ['Escalate to Procurement Director after 3 days'],
        },
        {
          level: 3,
          name: 'Management Approval',
          approvers: ['MGT-001', 'MGT-002'],
          requiredApprovals: 1,
          timeoutDays: 7,
          escalationRules: ['Escalate to CEO after 7 days'],
        },
      ],
      pendingWith: 'TECH-001',
      approvalHistory: [
        {
          id: 'APP-001',
          level: 1,
          action: 'approved',
          approver: 'TECH-002',
          timestamp: '2024-02-16T10:30:00Z',
          comments: 'Technical specifications are comprehensive and clear',
        },
      ],
      comments: 'Pending technical review completion',
    },
    riskAssessment: {
      level: 'medium',
      factors: [
        {
          id: 'RISK-001',
          type: 'schedule',
          description: 'Tight delivery timeline may impact quality',
          probability: 'medium',
          impact: 'moderate',
          riskScore: 6,
          mitigationPlan: 'Include quality checkpoints in delivery schedule',
          owner: 'Project Manager',
          status: 'assessed',
          lastReviewed: '2024-02-15T09:00:00Z',
        },
        {
          id: 'RISK-002',
          type: 'supplier',
          description: 'Limited number of qualified suppliers',
          probability: 'high',
          impact: 'major',
          riskScore: 8,
          mitigationPlan: 'Pre-qualify additional suppliers for future RFQs',
          owner: 'Procurement Manager',
          status: 'mitigated',
          lastReviewed: '2024-02-16T14:00:00Z',
        },
      ],
      mitigationStrategies: ['Supplier pre-qualification program', 'Quality assurance protocols'],
      assessedBy: 'Risk Management Team',
      assessmentDate: '2024-01-12T10:00:00Z',
      lastReviewDate: '2024-02-16T14:00:00Z',
    },
    communication: {
      clarificationRequests: [
        {
          id: 'CLR-001',
          supplierId: 'SUP-001',
          supplierName: 'Advanced Steel Industries',
          question: 'Can delivery be split into multiple phases?',
          category: 'technical',
          submittedAt: '2024-02-08T14:30:00Z',
          response: 'Yes, phased delivery is acceptable as per delivery schedule section 4.2',
          respondedBy: 'Technical Team',
          respondedAt: '2024-02-09T09:15:00Z',
          isPublic: true,
          priority: 'medium',
          status: 'answered',
        },
      ],
      announcements: [
        {
          id: 'ANN-001',
          type: 'deadline_extension',
          title: 'Deadline Extension Notice',
          titleAr: 'إشعار تمديد الموعد النهائي',
          message: 'Quotation deadline extended by 5 days due to clarification requests',
          messageAr: 'تم تمديد الموعد النهائي لتقديم العروض بـ 5 أيام بسبب طلبات التوضيح',
          publishedAt: '2024-02-10T16:00:00Z',
          publishedBy: 'Procurement Team',
          priority: 'medium',
          recipients: 'all',
          acknowledgmentRequired: false,
        },
      ],
      meetings: [],
      lastCommunication: '2024-02-18T11:30:00Z',
    },
    qualityChecks: {
      technicalReview: {
        status: 'in_progress',
        reviewer: 'TECH-001',
        reviewDate: '2024-02-16T09:00:00Z',
        score: 85,
        findings: ['Specifications are comprehensive', 'Minor clarifications needed'],
        recommendations: ['Include additional safety requirements'],
        approved: false,
        comments: 'Review in progress, expecting completion by EOD',
      },
      legalReview: {
        status: 'not_started',
        reviewer: 'LEGAL-001',
        findings: [],
        recommendations: [],
        approved: false,
      },
      complianceReview: {
        status: 'completed',
        reviewer: 'COMP-001',
        reviewDate: '2024-02-15T15:30:00Z',
        score: 95,
        findings: ['All regulatory requirements included'],
        recommendations: ['Consider additional certifications'],
        approved: true,
        comments: 'Fully compliant with Saudi regulations',
      },
      procurementReview: {
        status: 'completed',
        reviewer: 'PROC-001',
        reviewDate: '2024-02-14T11:00:00Z',
        score: 90,
        findings: ['Clear evaluation criteria', 'Appropriate budget allocation'],
        recommendations: ['Include sustainability criteria'],
        approved: true,
        comments: 'Procurement process follows best practices',
      },
    },
    analytics: {
      views: 234,
      downloads: 45,
      supplierEngagement: 80,
      averageResponseTime: 2.5,
      competitionLevel: 'medium',
      marketResponse: 'good',
    },
    compliance: {
      regulatoryRequirements: ['SASO Standards', 'Environmental Compliance', 'Safety Regulations'],
      auditTrail: [
        {
          id: 'AUDIT-001',
          timestamp: '2024-01-10T09:00:00Z',
          user: 'ahmed.rashid',
          action: 'RFQ Created',
          details: 'Initial RFQ draft created',
          severity: 'info',
        },
        {
          id: 'AUDIT-002',
          timestamp: '2024-01-15T10:00:00Z',
          user: 'system',
          action: 'RFQ Published',
          details: 'RFQ published to supplier portal',
          severity: 'info',
        },
      ],
      complianceScore: 95,
      lastAuditDate: '2024-02-01T10:00:00Z',
      certificationRequired: true,
    },
    integrations: {
      erpReference: 'ERP-REQ-2024-001',
      financialReference: 'FIN-APR-2024-001',
      projectReference: 'PRJ-RIYADH-2024',
    },
    metadata: {
      version: '2.1',
      template: 'industrial-equipment-template',
      tags: ['industrial', 'machinery', 'riyadh', 'high-priority'],
      language: 'both',
      confidentialityLevel: 'restricted',
    },
  },
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 border-gray-200',
  published: 'bg-blue-100 text-blue-800 border-blue-200',
  responses_received: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  under_evaluation: 'bg-purple-100 text-purple-800 border-purple-200',
  awarded: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  suspended: 'bg-orange-100 text-orange-800 border-orange-200',
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
  critical: 'bg-red-200 text-red-900 border-red-300',
};

const riskColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const AdminRFQManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [rfqs, setRFQs] = useState<AdminRFQ[]>(mockAdminRFQs);
  const [selectedRFQs, setSelectedRFQs] = useState<string[]>([]);
  const [filteredRFQs, setFilteredRFQs] = useState<AdminRFQ[]>([]);
  const [bulkActionModal, setBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | 'suspend' | 'archive' | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    status: 'all',
    type: 'all',
    priority: 'all',
    approvalStage: 'all',
    department: 'all',
    dateRange: 'all',
    riskLevel: 'all',
    valueRange: 'all',
  });
  const [sortBy, setSortBy] = useState<'created' | 'deadline' | 'value' | 'priority' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loadedCount, setLoadedCount] = useState(10);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalRFQs = rfqs.length;
    const activeRFQs = rfqs.filter(r => ['published', 'responses_received', 'under_evaluation'].includes(r.status)).length;
    const pendingApproval = rfqs.filter(r => r.approval.currentStage !== 'approved').length;
    const overDueEvaluation = rfqs.filter(r => {
      if (r.timeline.evaluationEndDate) {
        return new Date(r.timeline.evaluationEndDate) < new Date() && r.status === 'under_evaluation';
      }
      return false;
    }).length;
    const totalValue = rfqs.reduce((sum, r) => sum + r.budget.estimatedMax, 0);
    const highRiskRFQs = rfqs.filter(r => ['high', 'critical'].includes(r.riskAssessment.level)).length;
    
    return {
      totalRFQs,
      activeRFQs,
      pendingApproval,
      overDueEvaluation,
      totalValue,
      highRiskRFQs,
    };
  }, [rfqs]);

  // Filter and search logic
  const applyFiltersAndSearch = useMemo(() => {
    let filtered = [...rfqs];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(rfq =>
        rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfq.titleAr.includes(searchQuery) ||
        rfq.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfq.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rfq.requester.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (localFilters.status !== 'all') {
      filtered = filtered.filter(rfq => rfq.status === localFilters.status);
    }

    // Type filter
    if (localFilters.type !== 'all') {
      filtered = filtered.filter(rfq => rfq.type === localFilters.type);
    }

    // Priority filter
    if (localFilters.priority !== 'all') {
      filtered = filtered.filter(rfq => rfq.priority === localFilters.priority);
    }

    // Approval stage filter
    if (localFilters.approvalStage !== 'all') {
      filtered = filtered.filter(rfq => rfq.approval.currentStage === localFilters.approvalStage);
    }

    // Risk level filter
    if (localFilters.riskLevel !== 'all') {
      filtered = filtered.filter(rfq => rfq.riskAssessment.level === localFilters.riskLevel);
    }

    // Value range filter
    if (localFilters.valueRange !== 'all') {
      filtered = filtered.filter(rfq => {
        switch (localFilters.valueRange) {
          case 'under_1m':
            return rfq.budget.estimatedMax < 1000000;
          case '1m_5m':
            return rfq.budget.estimatedMax >= 1000000 && rfq.budget.estimatedMax < 5000000;
          case '5m_plus':
            return rfq.budget.estimatedMax >= 5000000;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof AdminRFQ];
      let bValue: any = b[sortBy as keyof AdminRFQ];

      if (sortBy === 'created') {
        aValue = new Date(a.timeline.createdAt).getTime();
        bValue = new Date(b.timeline.createdAt).getTime();
      } else if (sortBy === 'updated') {
        aValue = new Date(a.timeline.lastModified).getTime();
        bValue = new Date(b.timeline.lastModified).getTime();
      } else if (sortBy === 'deadline') {
        aValue = new Date(a.timeline.quotationDeadline).getTime();
        bValue = new Date(b.timeline.quotationDeadline).getTime();
      } else if (sortBy === 'value') {
        aValue = a.budget.estimatedMax;
        bValue = b.budget.estimatedMax;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [rfqs, searchQuery, localFilters, sortBy, sortOrder]);

  useEffect(() => {
    setFilteredRFQs(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  const handleSelectRFQ = (rfqId: string) => {
    const newSelected = selectedRFQs.includes(rfqId)
      ? selectedRFQs.filter(id => id !== rfqId)
      : [...selectedRFQs, rfqId];
    setSelectedRFQs(newSelected);
  };

  const handleSelectAll = () => {
    const visibleRFQIds = filteredRFQs.slice(0, loadedCount).map(r => r.id);
    const newSelected = selectedRFQs.length === visibleRFQIds.length ? [] : visibleRFQIds;
    setSelectedRFQs(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'medium':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'critical':
        return <FlagIcon className="w-4 h-4" />;
      default:
        return <InformationCircleIcon className="w-4 h-4" />;
    }
  };

  const displayedRFQs = filteredRFQs.slice(0, loadedCount);

  const loadMore = () => {
    setLoadedCount(prev => Math.min(prev + 10, filteredRFQs.length));
  };

  const clearFilters = () => {
    setLocalFilters({
      status: 'all',
      type: 'all',
      priority: 'all',
      approvalStage: 'all',
      department: 'all',
      dateRange: 'all',
      riskLevel: 'all',
      valueRange: 'all',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== 'all') || searchQuery.trim();

  // Bulk operations
  const handleBulkAction = (action: 'approve' | 'reject' | 'suspend' | 'archive') => {
    setBulkAction(action);
    setBulkActionModal(true);
  };

  const executeBulkAction = () => {
    if (!bulkAction || selectedRFQs.length === 0) return;
    
    switch (bulkAction) {
      case 'approve':
        // Update RFQs to approved status
        setRFQs(rfqs.map(r => 
          selectedRFQs.includes(r.id) 
            ? { ...r, approval: { ...r.approval, currentStage: 'approved' as ApprovalStage } }
            : r
        ));
        break;
      case 'suspend':
        setRFQs(rfqs.map(r => 
          selectedRFQs.includes(r.id) 
            ? { ...r, status: 'suspended' as RFQStatus }
            : r
        ));
        break;
      case 'archive':
        setRFQs(rfqs.filter(r => !selectedRFQs.includes(r.id)));
        break;
    }
    
    setSelectedRFQs([]);
    setBulkActionModal(false);
    setBulkAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ Management</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive oversight and management of all procurement requests ({filteredRFQs.length} of {rfqs.length} RFQs)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/rfq/analytics')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            Analytics
          </button>
          
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? <ListBulletIcon className="w-5 h-5" /> : <Squares2X2Icon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => navigate('/admin/rfq/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create RFQ
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total RFQs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRFQs}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeRFQs}</p>
            </div>
            <ArrowPathIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overDueEvaluation}</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highRiskRFQs}</p>
            </div>
            <FlagIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalValue)}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search RFQs, requesters, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Created Date</option>
            <option value="deadline">Deadline</option>
            <option value="value">Value</option>
            <option value="priority">Priority</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={localFilters.status}
                  onChange={(e) => setLocalFilters({...localFilters, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="responses_received">Responses Received</option>
                  <option value="under_evaluation">Under Evaluation</option>
                  <option value="awarded">Awarded</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={localFilters.priority}
                  onChange={(e) => setLocalFilters({...localFilters, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <select
                  value={localFilters.riskLevel}
                  onChange={(e) => setLocalFilters({...localFilters, riskLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value Range</label>
                <select
                  value={localFilters.valueRange}
                  onChange={(e) => setLocalFilters({...localFilters, valueRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Values</option>
                  <option value="under_1m">Under 1M SAR</option>
                  <option value="1m_5m">1M - 5M SAR</option>
                  <option value="5m_plus">5M+ SAR</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedRFQs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {selectedRFQs.length} RFQs selected
              </span>
              <button
                onClick={() => setSelectedRFQs([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Unselect All
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button 
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
              >
                Suspend
              </button>
              <button 
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded-md hover:bg-red-50 transition-colors"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFQ List/Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRFQs.length === displayedRFQs.length && displayedRFQs.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RFQ Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value & Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedRFQs.map((rfq) => {
                  const daysUntilDeadline = getDaysUntilDeadline(rfq.timeline.quotationDeadline);
                  return (
                    <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRFQs.includes(rfq.id)}
                          onChange={() => handleSelectRFQ(rfq.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{rfq.rfqNumber}</div>
                            <div className="text-sm text-gray-900 max-w-xs truncate">{rfq.title}</div>
                            <div className="text-xs text-gray-500">{rfq.category.nameEn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{rfq.requester.name}</div>
                            <div className="text-sm text-gray-500">{rfq.requester.department}</div>
                            <div className="text-xs text-gray-400">{rfq.requester.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[rfq.status]}`}>
                            {rfq.status.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[rfq.priority]}`}>
                            {rfq.priority.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-bold text-gray-900">{formatCurrency(rfq.budget.estimatedMax)}</div>
                          <div className="text-gray-500">Deadline: {formatDate(rfq.timeline.quotationDeadline)}</div>
                          <div className={`text-xs ${daysUntilDeadline <= 3 ? 'text-red-600' : daysUntilDeadline <= 7 ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Overdue'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium">{rfq.participants.responsesReceived}/{rfq.participants.invitedSuppliers.length} responses</div>
                          <div className="text-gray-500 text-xs">{rfq.approval.currentStage.replace('_', ' ')}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(rfq.participants.responsesReceived / rfq.participants.invitedSuppliers.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${riskColors[rfq.riskAssessment.level]}`}>
                          {getRiskIcon(rfq.riskAssessment.level)}
                          {rfq.riskAssessment.level.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/admin/rfq/details/${rfq.id}`)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/rfq/edit/${rfq.id}`)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/rfq/evaluate/${rfq.id}`)}
                            className="text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            <ScaleIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <EllipsisVerticalIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedRFQs.map((rfq) => {
              const daysUntilDeadline = getDaysUntilDeadline(rfq.timeline.quotationDeadline);
              return (
                <div key={rfq.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedRFQs.includes(rfq.id)}
                      onChange={() => handleSelectRFQ(rfq.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${riskColors[rfq.riskAssessment.level]}`}>
                      {getRiskIcon(rfq.riskAssessment.level)}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{rfq.rfqNumber}</h3>
                      <p className="text-xs text-gray-500 truncate">{rfq.title}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[rfq.status]}`}>
                        {rfq.status.replace('_', ' ')}
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[rfq.priority]}`}>
                        {rfq.priority}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900">{formatCurrency(rfq.budget.estimatedMax)}</div>
                      <div className="text-xs text-gray-500">{rfq.participants.responsesReceived}/{rfq.participants.invitedSuppliers.length} responses</div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      <div>{formatDate(rfq.timeline.quotationDeadline)}</div>
                      <div className={daysUntilDeadline <= 3 ? 'text-red-600' : daysUntilDeadline <= 7 ? 'text-yellow-600' : 'text-gray-500'}>
                        {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Overdue'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500">{rfq.requester.department}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => navigate(`/admin/rfq/details/${rfq.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/rfq/edit/${rfq.id}`)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/rfq/evaluate/${rfq.id}`)}
                          className="text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <ScaleIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {displayedRFQs.length < filteredRFQs.length && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More ({filteredRFQs.length - displayedRFQs.length} remaining)
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredRFQs.length === 0 && (
          <div className="p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Modal */}
      {bulkActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {bulkAction === 'approve' && 'Approve RFQs'}
                {bulkAction === 'suspend' && 'Suspend RFQs'}
                {bulkAction === 'archive' && 'Archive RFQs'}
              </h3>
              <button
                onClick={() => setBulkActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                {bulkAction === 'archive' 
                  ? `Are you sure you want to archive ${selectedRFQs.length} RFQs? This action cannot be undone.`
                  : `This action will affect ${selectedRFQs.length} selected RFQs.`
                }
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setBulkActionModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  bulkAction === 'archive' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : bulkAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {bulkAction === 'archive' ? 'Archive' : bulkAction === 'approve' ? 'Approve' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRFQManagement;