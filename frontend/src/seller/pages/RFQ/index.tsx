import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { DataTable } from '@/seller/components/ui/DataTable';
import { MetricsCard } from '@/seller/components/ui/MetricsCard';
import { FileUploader } from '@/seller/components/ui/FileUploader';
import {
  PlusIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  StarIcon,
  BanknotesIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';

// Types for RFQ Management
interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  titleAr: string;
  description: string;
  status: 'draft' | 'published' | 'responses_received' | 'under_evaluation' | 'awarded' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  budgetRange: {
    min: number;
    max: number;
    currency: 'SAR' | 'USD';
  };
  quotationDeadline: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  suppliersInvited: number;
  responsesReceived: number;
  documents: RFQDocument[];
  specifications: RFQSpecification[];
  selectedSuppliers: string[];
  awardedTo?: string;
  notes?: string;
}

interface RFQDocument {
  id: string;
  name: string;
  type: 'technical_drawing' | 'specification' | 'terms_conditions' | 'other';
  url: string;
  size: number;
  uploadedAt: string;
}

interface RFQSpecification {
  id: string;
  category: string;
  requirement: string;
  value: string;
  unit?: string;
  isMandatory: boolean;
}

interface Supplier {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  location: string;
  specializations: string[];
  rating: number;
  totalRFQs: number;
  completedRFQs: number;
  averageResponseTime: number; // in hours
  certifications: string[];
  isPreferred: boolean;
  lastActivity: string;
}

interface Quote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  currency: 'SAR' | 'USD';
  deliveryTime: number; // in days
  validityPeriod: number; // in days
  paymentTerms: string;
  status: 'pending' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedAt: string;
  documents: QuoteDocument[];
  lineItems: QuoteLineItem[];
  technicalCompliance: number; // percentage
  commercialScore: number; // percentage
  notes?: string;
}

interface QuoteDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  specifications: string;
}

interface RFQTemplate {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  description: string;
  specifications: RFQSpecification[];
  documents: string[];
  isActive: boolean;
  usageCount: number;
  lastUsed: string;
}

const RFQPage: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rfqs' | 'create' | 'suppliers' | 'quotes' | 'templates' | 'analytics'>('rfqs');
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [rfqTemplates, setRFQTemplates] = useState<RFQTemplate[]>([]);
  const [selectedRFQs, setSelectedRFQs] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedRFQForComparison, setSelectedRFQForComparison] = useState<string | null>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  // Mock data initialization
  useEffect(() => {
    const mockSuppliers: Supplier[] = [
      {
        id: 'SUP-001',
        name: 'Advanced Steel Industries',
        nameAr: 'صناعات الصلب المتقدمة',
        email: 'rfq@advancedsteel.com.sa',
        phone: '+966-11-4567890',
        location: 'Riyadh, Saudi Arabia',
        specializations: ['Steel Manufacturing', 'Industrial Components', 'Custom Fabrication'],
        rating: 4.8,
        totalRFQs: 125,
        completedRFQs: 118,
        averageResponseTime: 18,
        certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'SASO'],
        isPreferred: true,
        lastActivity: '2024-01-05'
      },
      {
        id: 'SUP-002',
        name: 'Gulf Precision Engineering',
        nameAr: 'الخليج للهندسة الدقيقة',
        email: 'quotes@gulfprecision.com',
        phone: '+966-13-7891234',
        location: 'Dammam, Saudi Arabia',
        specializations: ['Precision Manufacturing', 'CNC Machining', 'Quality Testing'],
        rating: 4.6,
        totalRFQs: 89,
        completedRFQs: 82,
        averageResponseTime: 24,
        certifications: ['ISO 9001', 'AS9100', 'NADCAP'],
        isPreferred: false,
        lastActivity: '2024-01-03'
      },
      {
        id: 'SUP-003',
        name: 'Arabian Manufacturing Solutions',
        nameAr: 'الحلول التصنيعية العربية',
        email: 'procurement@arabianmfg.com.sa',
        phone: '+966-12-5678901',
        location: 'Jeddah, Saudi Arabia',
        specializations: ['Industrial Equipment', 'Automation Systems', 'Maintenance Services'],
        rating: 4.4,
        totalRFQs: 156,
        completedRFQs: 142,
        averageResponseTime: 32,
        certifications: ['ISO 9001', 'IEC 61508', 'API'],
        isPreferred: true,
        lastActivity: '2024-01-04'
      }
    ];

    const mockRFQs: RFQ[] = [
      {
        id: 'RFQ-001',
        rfqNumber: 'RFQ-2024-001',
        title: 'Industrial Valve Supply Contract',
        titleAr: 'عقد توريد الصمامات الصناعية',
        description: 'Supply of high-pressure industrial valves for oil & gas applications',
        status: 'responses_received',
        priority: 'high',
        category: 'Industrial Equipment',
        budgetRange: {
          min: 150000,
          max: 300000,
          currency: 'SAR'
        },
        quotationDeadline: '2024-01-20',
        deliveryDate: '2024-02-15',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
        suppliersInvited: 5,
        responsesReceived: 3,
        documents: [
          {
            id: 'DOC-001',
            name: 'Technical Specifications.pdf',
            type: 'specification',
            url: '/documents/spec-001.pdf',
            size: 2048576,
            uploadedAt: '2024-01-01'
          }
        ],
        specifications: [
          {
            id: 'SPEC-001',
            category: 'Pressure Rating',
            requirement: 'Maximum Operating Pressure',
            value: '150 Bar',
            unit: 'Bar',
            isMandatory: true
          },
          {
            id: 'SPEC-002',
            category: 'Material',
            requirement: 'Body Material',
            value: 'Stainless Steel 316L',
            isMandatory: true
          }
        ],
        selectedSuppliers: ['SUP-001', 'SUP-002', 'SUP-003']
      },
      {
        id: 'RFQ-002',
        rfqNumber: 'RFQ-2024-002',
        title: 'Precision Machining Services',
        titleAr: 'خدمات التصنيع الدقيق',
        description: 'CNC machining services for custom industrial components',
        status: 'under_evaluation',
        priority: 'medium',
        category: 'Manufacturing Services',
        budgetRange: {
          min: 75000,
          max: 150000,
          currency: 'SAR'
        },
        quotationDeadline: '2024-01-15',
        deliveryDate: '2024-02-28',
        createdAt: '2023-12-28',
        updatedAt: '2024-01-08',
        suppliersInvited: 4,
        responsesReceived: 4,
        documents: [],
        specifications: [],
        selectedSuppliers: ['SUP-002', 'SUP-003']
      }
    ];

    const mockQuotes: Quote[] = [
      {
        id: 'QUO-001',
        rfqId: 'RFQ-001',
        supplierId: 'SUP-001',
        supplierName: 'Advanced Steel Industries',
        totalAmount: 275000,
        currency: 'SAR',
        deliveryTime: 45,
        validityPeriod: 60,
        paymentTerms: 'Net 30',
        status: 'submitted',
        submittedAt: '2024-01-12',
        documents: [],
        lineItems: [],
        technicalCompliance: 95,
        commercialScore: 88
      },
      {
        id: 'QUO-002',
        rfqId: 'RFQ-001',
        supplierId: 'SUP-002',
        supplierName: 'Gulf Precision Engineering',
        totalAmount: 295000,
        currency: 'SAR',
        deliveryTime: 50,
        validityPeriod: 45,
        paymentTerms: 'Net 45',
        status: 'submitted',
        submittedAt: '2024-01-14',
        documents: [],
        lineItems: [],
        technicalCompliance: 92,
        commercialScore: 85
      }
    ];

    const mockTemplates: RFQTemplate[] = [
      {
        id: 'TPL-001',
        name: 'Standard Industrial Equipment RFQ',
        nameAr: 'طلب عروض أسعار المعدات الصناعية القياسية',
        category: 'Industrial Equipment',
        description: 'Standard template for industrial equipment procurement',
        specifications: [],
        documents: [],
        isActive: true,
        usageCount: 15,
        lastUsed: '2024-01-01'
      }
    ];

    setRFQs(mockRFQs);
    setSuppliers(mockSuppliers);
    setQuotes(mockQuotes);
    setRFQTemplates(mockTemplates);
  }, []);

  // Table columns for RFQs
  const rfqColumns = [
    {
      key: 'rfqNumber',
      header: language === 'ar' ? 'رقم الطلب' : 'RFQ Number',
      sortable: true,
      render: (value: string, rfq: RFQ) => (
        <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {value}
        </div>
      )
    },
    {
      key: 'title',
      header: language === 'ar' ? 'العنوان' : 'Title',
      render: (value: string, rfq: RFQ) => (
        <div>
          <div className="font-medium">{language === 'ar' ? rfq.titleAr : rfq.title}</div>
          <div className="text-sm text-gray-500">{rfq.category}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => {
        const statusConfig = {
          draft: { color: 'gray', text: language === 'ar' ? 'مسودة' : 'Draft' },
          published: { color: 'blue', text: language === 'ar' ? 'منشور' : 'Published' },
          responses_received: { color: 'yellow', text: language === 'ar' ? 'تم استلام ردود' : 'Responses Received' },
          under_evaluation: { color: 'orange', text: language === 'ar' ? 'قيد التقييم' : 'Under Evaluation' },
          awarded: { color: 'green', text: language === 'ar' ? 'تم الترسية' : 'Awarded' },
          closed: { color: 'gray', text: language === 'ar' ? 'مغلق' : 'Closed' },
          cancelled: { color: 'red', text: language === 'ar' ? 'ملغي' : 'Cancelled' }
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${config.color}-100 text-${config.color}-800`}>
            {config.text}
          </span>
        );
      }
    },
    {
      key: 'priority',
      header: language === 'ar' ? 'الأولوية' : 'Priority',
      render: (value: string) => {
        const priorityConfig = {
          low: { color: 'green', text: language === 'ar' ? 'منخفضة' : 'Low' },
          medium: { color: 'yellow', text: language === 'ar' ? 'متوسطة' : 'Medium' },
          high: { color: 'orange', text: language === 'ar' ? 'عالية' : 'High' },
          urgent: { color: 'red', text: language === 'ar' ? 'عاجل' : 'Urgent' }
        };
        const config = priorityConfig[value as keyof typeof priorityConfig];
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${config.color}-100 text-${config.color}-800`}>
            {config.text}
          </span>
        );
      }
    },
    {
      key: 'responses',
      header: language === 'ar' ? 'الردود' : 'Responses',
      render: (value: any, rfq: RFQ) => (
        <div className="text-center">
          <div className="font-medium">{rfq.responsesReceived}/{rfq.suppliersInvited}</div>
          <div className="text-xs text-gray-500">
            {language === 'ar' ? 'رد/مدعو' : 'received/invited'}
          </div>
        </div>
      )
    },
    {
      key: 'budgetRange',
      header: language === 'ar' ? 'الميزانية' : 'Budget Range',
      render: (value: any, rfq: RFQ) => (
        <div className="text-sm">
          {new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
            style: 'currency',
            currency: rfq.budgetRange.currency,
            notation: 'compact'
          }).format(rfq.budgetRange.min)} - {new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
            style: 'currency',
            currency: rfq.budgetRange.currency,
            notation: 'compact'
          }).format(rfq.budgetRange.max)}
        </div>
      )
    },
    {
      key: 'quotationDeadline',
      header: language === 'ar' ? 'آخر موعد' : 'Deadline',
      sortable: true,
      render: (value: string) => {
        const deadline = new Date(value);
        const today = new Date();
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="text-sm">
            <div>{new Date(value).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</div>
            <div className={`text-xs ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-yellow-600' : 'text-gray-500'}`}>
              {daysLeft > 0 
                ? (language === 'ar' ? `${daysLeft} أيام متبقية` : `${daysLeft} days left`)
                : (language === 'ar' ? 'منتهي الصلاحية' : 'Expired')
              }
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: language === 'ar' ? 'الإجراءات' : 'Actions',
      render: (value: any, rfq: RFQ) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" title={language === 'ar' ? 'عرض' : 'View'}>
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-800" title={language === 'ar' ? 'تعديل' : 'Edit'}>
            <PencilIcon className="h-4 w-4" />
          </button>
          <button 
            className="text-purple-600 hover:text-purple-800" 
            title={language === 'ar' ? 'مقارنة العروض' : 'Compare Quotes'}
            onClick={() => setSelectedRFQForComparison(rfq.id)}
          >
            <ScaleIcon className="h-4 w-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-800" title={language === 'ar' ? 'نسخ' : 'Duplicate'}>
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Supplier columns
  const supplierColumns = [
    {
      key: 'name',
      header: language === 'ar' ? 'المورد' : 'Supplier',
      render: (value: string, supplier: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {language === 'ar' ? supplier.nameAr : supplier.name}
              {supplier.isPreferred && (
                <StarSolidIcon className="h-4 w-4 text-yellow-500" title={language === 'ar' ? 'مورد مفضل' : 'Preferred Supplier'} />
              )}
            </div>
            <div className="text-sm text-gray-500">{supplier.location}</div>
          </div>
        </div>
      )
    },
    {
      key: 'rating',
      header: language === 'ar' ? 'التقييم' : 'Rating',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarSolidIcon
                key={star}
                className={`h-4 w-4 ${star <= Math.floor(value) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">{value}</span>
        </div>
      )
    },
    {
      key: 'performance',
      header: language === 'ar' ? 'الأداء' : 'Performance',
      render: (value: any, supplier: Supplier) => (
        <div className="text-sm">
          <div>{supplier.completedRFQs}/{supplier.totalRFQs} RFQs</div>
          <div className="text-gray-500">
            {Math.round((supplier.completedRFQs / supplier.totalRFQs) * 100)}% {language === 'ar' ? 'نسبة الإنجاز' : 'completion'}
          </div>
        </div>
      )
    },
    {
      key: 'responseTime',
      header: language === 'ar' ? 'وقت الاستجابة' : 'Response Time',
      render: (value: number, supplier: Supplier) => (
        <div className="text-sm">
          <div className="font-medium">{supplier.averageResponseTime}h</div>
          <div className="text-gray-500">{language === 'ar' ? 'متوسط' : 'average'}</div>
        </div>
      )
    },
    {
      key: 'specializations',
      header: language === 'ar' ? 'التخصصات' : 'Specializations',
      render: (value: string[], supplier: Supplier) => (
        <div className="flex flex-wrap gap-1">
          {supplier.specializations.slice(0, 2).map((spec, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {spec}
            </span>
          ))}
          {supplier.specializations.length > 2 && (
            <span className="text-xs text-gray-500">+{supplier.specializations.length - 2}</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: language === 'ar' ? 'الإجراءات' : 'Actions',
      render: (value: any, supplier: Supplier) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" title={language === 'ar' ? 'عرض الملف' : 'View Profile'}>
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-800" title={language === 'ar' ? 'إرسال RFQ' : 'Send RFQ'}>
            <DocumentTextIcon className="h-4 w-4" />
          </button>
          <button className="text-purple-600 hover:text-purple-800" title={language === 'ar' ? 'راسل' : 'Message'}>
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Calculate metrics
  const rfqMetrics = {
    totalRFQs: rfqs.length,
    activeRFQs: rfqs.filter(r => ['published', 'responses_received', 'under_evaluation'].includes(r.status)).length,
    awaitingResponse: rfqs.filter(r => r.status === 'published').length,
    underEvaluation: rfqs.filter(r => r.status === 'under_evaluation').length,
    averageResponseTime: suppliers.reduce((sum, s) => sum + s.averageResponseTime, 0) / suppliers.length,
    totalSuppliers: suppliers.length,
    preferredSuppliers: suppliers.filter(s => s.isPreferred).length
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'إدارة طلبات عروض الأسعار' : 'Request for Quotation Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'ar' 
                ? 'إدارة شاملة لطلبات عروض الأسعار والموردين مع أدوات المقارنة والتحليل المتقدمة'
                : 'Comprehensive RFQ and supplier management with advanced comparison and analysis tools'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSupplierModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <UserGroupIcon className="h-5 w-5" />
              {language === 'ar' ? 'إدارة الموردين' : 'Manage Suppliers'}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              {language === 'ar' ? 'RFQ جديد' : 'New RFQ'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={language === 'ar' ? 'إجمالي RFQs' : 'Total RFQs'}
          value={rfqMetrics.totalRFQs.toString()}
          icon={ClipboardDocumentIcon}
          trend={{ value: 15, isPositive: true }}
          color="blue"
        />
        <MetricsCard
          title={language === 'ar' ? 'RFQs نشطة' : 'Active RFQs'}
          value={rfqMetrics.activeRFQs.toString()}
          icon={ArrowPathIcon}
          color="green"
        />
        <MetricsCard
          title={language === 'ar' ? 'قيد التقييم' : 'Under Evaluation'}
          value={rfqMetrics.underEvaluation.toString()}
          icon={ScaleIcon}
          color="orange"
        />
        <MetricsCard
          title={language === 'ar' ? 'متوسط وقت الاستجابة' : 'Avg Response Time'}
          value={`${Math.round(rfqMetrics.averageResponseTime)}h`}
          icon={ClockIcon}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'rfqs', label: language === 'ar' ? 'طلبات العروض' : 'RFQs', icon: ClipboardDocumentIcon },
              { key: 'create', label: language === 'ar' ? 'إنشاء RFQ' : 'Create RFQ', icon: PlusIcon },
              { key: 'suppliers', label: language === 'ar' ? 'الموردين' : 'Suppliers', icon: UserGroupIcon },
              { key: 'quotes', label: language === 'ar' ? 'العروض' : 'Quotes', icon: BanknotesIcon },
              { key: 'templates', label: language === 'ar' ? 'القوالب' : 'Templates', icon: DocumentTextIcon },
              { key: 'analytics', label: language === 'ar' ? 'التحليلات' : 'Analytics', icon: TrophyIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'rfqs' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              {selectedRFQs.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-800">
                      {language === 'ar' 
                        ? `تم تحديد ${selectedRFQs.length} RFQ`
                        : `${selectedRFQs.length} RFQs selected`
                      }
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        {language === 'ar' ? 'نشر' : 'Publish'}
                      </button>
                      <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                        {language === 'ar' ? 'إرسال للموردين' : 'Send to Suppliers'}
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        {language === 'ar' ? 'تصدير' : 'Export'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* RFQ Table */}
              <DataTable
                columns={rfqColumns}
                data={rfqs}
                searchPlaceholder={language === 'ar' ? 'البحث في RFQs...' : 'Search RFQs...'}
              />
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {language === 'ar' ? 'إنشاء طلب عرض أسعار جديد' : 'Create New RFQ'}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">
                        {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'عنوان RFQ' : 'RFQ Title'}
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={language === 'ar' ? 'أدخل عنوان طلب عرض السعر' : 'Enter RFQ title'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الفئة' : 'Category'}
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>{language === 'ar' ? 'اختر الفئة' : 'Select Category'}</option>
                            <option>Industrial Equipment</option>
                            <option>Manufacturing Services</option>
                            <option>Raw Materials</option>
                            <option>IT Services</option>
                            <option>Consulting</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الأولوية' : 'Priority'}
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                            <option>{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                            <option>{language === 'ar' ? 'عالية' : 'High'}</option>
                            <option>{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'آخر موعد للتقديم' : 'Quotation Deadline'}
                          </label>
                          <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'تاريخ التسليم المطلوب' : 'Required Delivery Date'}
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الوصف' : 'Description'}
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={language === 'ar' ? 'وصف تفصيلي لطلب عرض السعر' : 'Detailed description of the RFQ'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الميزانية الدنيا' : 'Min Budget'}
                          </label>
                          <div className="flex">
                            <select className="px-3 py-2 border border-gray-300 border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>SAR</option>
                              <option>USD</option>
                            </select>
                            <input
                              type="number"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الميزانية العليا' : 'Max Budget'}
                          </label>
                          <div className="flex">
                            <select className="px-3 py-2 border border-gray-300 border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>SAR</option>
                              <option>USD</option>
                            </select>
                            <input
                              type="number"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Specifications */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {language === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
                        </h3>
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          {language === 'ar' ? 'إضافة مواصفة' : 'Add Specification'}
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-md">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                            <div>{language === 'ar' ? 'الفئة' : 'Category'}</div>
                            <div>{language === 'ar' ? 'المتطلب' : 'Requirement'}</div>
                            <div>{language === 'ar' ? 'القيمة' : 'Value'}</div>
                            <div>{language === 'ar' ? 'الوحدة' : 'Unit'}</div>
                            <div>{language === 'ar' ? 'إلزامي' : 'Mandatory'}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-center py-8 text-gray-500">
                            {language === 'ar' ? 'لم يتم إضافة مواصفات بعد' : 'No specifications added yet'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {language === 'ar' ? 'المستندات المرفقة' : 'Attached Documents'}
                        </h3>
                        <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2">
                          <CloudArrowUpIcon className="h-4 w-4" />
                          {language === 'ar' ? 'رفع ملف' : 'Upload File'}
                        </button>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          {language === 'ar' 
                            ? 'اسحب وأفلت الملفات هنا أو انقر للتصفح'
                            : 'Drag and drop files here or click to browse'
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === 'ar' 
                            ? 'يدعم PDF, DOC, DOCX, XLS, XLSX, CAD - حتى 50MB'
                            : 'Supports PDF, DOC, DOCX, XLS, XLSX, CAD files - up to 50MB'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Supplier Selection */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {language === 'ar' ? 'اختيار الموردين' : 'Supplier Selection'}
                        </h3>
                        <div className="flex gap-2">
                          <button className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                            {language === 'ar' ? 'من المفضلة' : 'From Favorites'}
                          </button>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                            {language === 'ar' ? 'بحث موردين' : 'Search Suppliers'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="text-center py-12 text-gray-500 md:col-span-2 lg:col-span-3">
                          {language === 'ar' ? 'لم يتم اختيار موردين بعد' : 'No suppliers selected yet'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">
                        {language === 'ar' ? 'ملخص RFQ' : 'RFQ Summary'}
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                          <span className="text-gray-600">{language === 'ar' ? 'مسودة' : 'Draft'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'ar' ? 'المواصفات:' : 'Specifications:'}</span>
                          <span className="text-gray-600">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'ar' ? 'الملفات:' : 'Documents:'}</span>
                          <span className="text-gray-600">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === 'ar' ? 'الموردين:' : 'Suppliers:'}</span>
                          <span className="text-gray-600">0</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">
                        {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                      </h3>
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                          {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
                        </button>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          {language === 'ar' ? 'معاينة' : 'Preview'}
                        </button>
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                          {language === 'ar' ? 'نشر وإرسال' : 'Publish & Send'}
                        </button>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                          {language === 'ar' ? 'حفظ كقالب' : 'Save as Template'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">
                        {language === 'ar' ? 'نصائح لـ RFQ ناجح' : 'Tips for Successful RFQ'}
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• {language === 'ar' ? 'كن واضحاً في المواصفات' : 'Be clear in specifications'}</li>
                        <li>• {language === 'ar' ? 'حدد مواعيد واقعية' : 'Set realistic deadlines'}</li>
                        <li>• {language === 'ar' ? 'اختر موردين مؤهلين' : 'Select qualified suppliers'}</li>
                        <li>• {language === 'ar' ? 'أرفق الوثائق الضرورية' : 'Attach necessary documents'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {language === 'ar' ? 'إدارة الموردين' : 'Supplier Management'}
                </h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    {language === 'ar' ? 'إضافة مورد جديد' : 'Add New Supplier'}
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {language === 'ar' ? 'استيراد موردين' : 'Import Suppliers'}
                  </button>
                </div>
              </div>

              {/* Supplier Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{rfqMetrics.totalSuppliers}</div>
                  <div className="text-sm text-blue-800">{language === 'ar' ? 'إجمالي الموردين' : 'Total Suppliers'}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">{rfqMetrics.preferredSuppliers}</div>
                  <div className="text-sm text-yellow-800">{language === 'ar' ? 'موردين مفضلين' : 'Preferred Suppliers'}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length * 10) / 10}
                  </div>
                  <div className="text-sm text-green-800">{language === 'ar' ? 'متوسط التقييم' : 'Average Rating'}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(rfqMetrics.averageResponseTime)}h
                  </div>
                  <div className="text-sm text-purple-800">{language === 'ar' ? 'متوسط الاستجابة' : 'Avg Response Time'}</div>
                </div>
              </div>

              {/* Supplier Table */}
              <DataTable
                columns={supplierColumns}
                data={suppliers}
                searchPlaceholder={language === 'ar' ? 'البحث في الموردين...' : 'Search suppliers...'}
              />
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {language === 'ar' ? 'إدارة العروض' : 'Quote Management'}
                </h2>
                <button
                  onClick={() => setSelectedRFQForComparison('RFQ-001')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <ScaleIcon className="h-5 w-5" />
                  {language === 'ar' ? 'مقارنة العروض' : 'Compare Quotes'}
                </button>
              </div>

              {/* Quote Comparison */}
              {selectedRFQForComparison && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">
                      {language === 'ar' ? 'مقارنة عروض RFQ-2024-001' : 'Quote Comparison for RFQ-2024-001'}
                    </h3>
                    <button
                      onClick={() => setSelectedRFQForComparison(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left">
                            {language === 'ar' ? 'المعيار' : 'Criteria'}
                          </th>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <th key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              {quote.supplierName}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}
                          </td>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <td key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              {new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
                                style: 'currency',
                                currency: quote.currency
                              }).format(quote.totalAmount)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {language === 'ar' ? 'مدة التسليم' : 'Delivery Time'}
                          </td>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <td key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              {quote.deliveryTime} {language === 'ar' ? 'أيام' : 'days'}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {language === 'ar' ? 'مدة الصلاحية' : 'Validity Period'}
                          </td>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <td key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              {quote.validityPeriod} {language === 'ar' ? 'أيام' : 'days'}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {language === 'ar' ? 'الامتثال التقني' : 'Technical Compliance'}
                          </td>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <td key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${quote.technicalCompliance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{quote.technicalCompliance}%</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {language === 'ar' ? 'النتيجة التجارية' : 'Commercial Score'}
                          </td>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <td key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${quote.commercialScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{quote.commercialScore}%</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {language === 'ar' ? 'الإجراءات' : 'Actions'}
                          </td>
                          {quotes.filter(q => q.rfqId === selectedRFQForComparison).map((quote) => (
                            <td key={quote.id} className="border border-gray-200 px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                  {language === 'ar' ? 'قبول' : 'Accept'}
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                  {language === 'ar' ? 'رفض' : 'Reject'}
                                </button>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Individual Quotes */}
              <div className="grid gap-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{quote.supplierName}</h3>
                        <p className="text-sm text-gray-600">
                          {language === 'ar' ? 'لـ' : 'for'} {quote.rfqId} - {language === 'ar' ? 'تم التقديم في' : 'Submitted on'}{' '}
                          {new Date(quote.submittedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
                            style: 'currency',
                            currency: quote.currency
                          }).format(quote.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {quote.deliveryTime} {language === 'ar' ? 'أيام للتسليم' : 'days delivery'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">{language === 'ar' ? 'الامتثال التقني' : 'Technical Compliance'}</div>
                        <div className="text-lg font-medium">{quote.technicalCompliance}%</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">{language === 'ar' ? 'النتيجة التجارية' : 'Commercial Score'}</div>
                        <div className="text-lg font-medium">{quote.commercialScore}%</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-sm text-gray-600">{language === 'ar' ? 'شروط الدفع' : 'Payment Terms'}</div>
                        <div className="text-lg font-medium">{quote.paymentTerms}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                          {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                          {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                          {language === 'ar' ? 'قبول العرض' : 'Accept Quote'}
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                          {language === 'ar' ? 'رفض' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {language === 'ar' ? 'قوالب RFQ' : 'RFQ Templates'}
                </h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {language === 'ar' ? 'إنشاء قالب جديد' : 'Create New Template'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rfqTemplates.map((template) => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'ar' ? template.nameAr : template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {template.category}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive 
                          ? (language === 'ar' ? 'نشط' : 'Active')
                          : (language === 'ar' ? 'غير نشط' : 'Inactive')
                        }
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'مرات الاستخدام:' : 'Usage count:'}</span> {template.usageCount}
                      </div>
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'آخر استخدام:' : 'Last used:'}</span>{' '}
                        {new Date(template.lastUsed).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        {language === 'ar' ? 'استخدام' : 'Use Template'}
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'تحليلات RFQ' : 'RFQ Analytics'}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RFQ Status Distribution */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'توزيع حالات RFQ' : 'RFQ Status Distribution'}
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">{language === 'ar' ? 'رسم بياني للحالات' : 'Status Chart Placeholder'}</p>
                  </div>
                </div>

                {/* Response Rate Trends */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'اتجاهات معدل الاستجابة' : 'Response Rate Trends'}
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">{language === 'ar' ? 'رسم بياني للاتجاهات' : 'Trends Chart Placeholder'}</p>
                  </div>
                </div>

                {/* Top Performing Suppliers */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'أفضل الموردين أداء' : 'Top Performing Suppliers'}
                  </h3>
                  <div className="space-y-3">
                    {suppliers.slice(0, 5).map((supplier, index) => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                            {index + 1}
                          </div>
                          <span>{language === 'ar' ? supplier.nameAr : supplier.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarSolidIcon
                                key={star}
                                className={`h-4 w-4 ${star <= Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{supplier.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Savings Analysis */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'تحليل توفير التكاليف' : 'Cost Savings Analysis'}
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">SAR 285,000</div>
                      <div className="text-sm text-gray-600">
                        {language === 'ar' ? 'إجمالي التوفير هذا العام' : 'Total savings this year'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-medium">22%</div>
                        <div className="text-gray-600">{language === 'ar' ? 'متوسط التوفير' : 'Average Savings'}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-medium">18</div>
                        <div className="text-gray-600">{language === 'ar' ? 'RFQs موفرة' : 'Cost-saving RFQs'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQPage;