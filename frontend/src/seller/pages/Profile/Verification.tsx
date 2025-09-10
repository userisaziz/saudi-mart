import React, { useState } from 'react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui'
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Upload,
  Download,
  Eye,
  RefreshCw,
  User,
  Building2,
  CreditCard,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  Zap,
  Star,
  Lock,
  Unlock,
  TrendingUp,
} from 'lucide-react'

interface VerificationStep {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  status: 'completed' | 'pending' | 'rejected' | 'not_started'
  required: boolean
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  documents?: VerificationDocument[]
  benefits: string[]
  benefitsAr: string[]
}

interface VerificationDocument {
  id: string
  name: string
  nameAr: string
  type: string
  status: 'uploaded' | 'verified' | 'rejected' | 'required'
  uploadedDate?: string
  rejectedReason?: string
  rejectedReasonAr?: string
  fileSize?: string
  fileType?: string
}

interface VerificationStatus {
  overallStatus: 'verified' | 'pending' | 'partial' | 'unverified'
  completionPercentage: number
  trustScore: number
  verificationLevel: 'basic' | 'standard' | 'premium' | 'enterprise'
  lastUpdated: string
  steps: VerificationStep[]
  benefits: {
    current: string[]
    next: string[]
  }
}

const mockVerificationStatus: VerificationStatus = {
  overallStatus: 'partial',
  completionPercentage: 85,
  trustScore: 92,
  verificationLevel: 'standard',
  lastUpdated: '2024-01-15T10:30:00Z',
  steps: [
    {
      id: 'email',
      title: 'Email Verification',
      titleAr: 'التحقق من البريد الإلكتروني',
      description: 'Verify your email address to receive important notifications',
      descriptionAr: 'تحقق من عنوان بريدك الإلكتروني لتلقي الإشعارات المهمة',
      status: 'completed',
      required: true,
      priority: 'high',
      estimatedTime: '2 minutes',
      benefits: ['Receive order notifications', 'Enable two-factor authentication'],
      benefitsAr: ['تلقي إشعارات الطلبات', 'تفعيل المصادقة الثنائية']
    },
    {
      id: 'phone',
      title: 'Phone Number Verification',
      titleAr: 'التحقق من رقم الهاتف',
      description: 'Verify your phone number for SMS notifications and account security',
      descriptionAr: 'تحقق من رقم هاتفك للحصول على إشعارات SMS وأمان الحساب',
      status: 'completed',
      required: true,
      priority: 'high',
      estimatedTime: '3 minutes',
      benefits: ['SMS notifications', 'Account recovery options'],
      benefitsAr: ['إشعارات الرسائل النصية', 'خيارات استرداد الحساب']
    },
    {
      id: 'identity',
      title: 'Identity Verification (KYC)',
      titleAr: 'التحقق من الهوية',
      description: 'Upload government-issued ID for identity verification',
      descriptionAr: 'ارفع هوية حكومية للتحقق من الهوية',
      status: 'completed',
      required: true,
      priority: 'high',
      estimatedTime: '10 minutes',
      documents: [
        {
          id: '1',
          name: 'National ID',
          nameAr: 'الهوية الوطنية',
          type: 'identity',
          status: 'verified',
          uploadedDate: '2024-01-10',
          fileSize: '2.1 MB',
          fileType: 'PDF'
        }
      ],
      benefits: ['Higher trust score', 'Access to premium features'],
      benefitsAr: ['نقاط ثقة أعلى', 'الوصول للميزات المميزة']
    },
    {
      id: 'business',
      title: 'Business Registration',
      titleAr: 'السجل التجاري',
      description: 'Upload your commercial registration certificate',
      descriptionAr: 'ارفع شهادة السجل التجاري الخاص بك',
      status: 'completed',
      required: true,
      priority: 'high',
      estimatedTime: '15 minutes',
      documents: [
        {
          id: '2',
          name: 'Commercial Registration',
          nameAr: 'السجل التجاري',
          type: 'business',
          status: 'verified',
          uploadedDate: '2024-01-12',
          fileSize: '3.5 MB',
          fileType: 'PDF'
        }
      ],
      benefits: ['Legal business recognition', 'Higher order limits'],
      benefitsAr: ['اعتراف قانوني بالأعمال', 'حدود طلبات أعلى']
    },
    {
      id: 'tax',
      title: 'Tax Registration',
      titleAr: 'التسجيل الضريبي',
      description: 'Upload tax registration certificate',
      descriptionAr: 'ارفع شهادة التسجيل الضريبي',
      status: 'completed',
      required: true,
      priority: 'high',
      estimatedTime: '10 minutes',
      documents: [
        {
          id: '3',
          name: 'Tax Certificate',
          nameAr: 'الشهادة الضريبية',
          type: 'tax',
          status: 'verified',
          uploadedDate: '2024-01-13',
          fileSize: '1.8 MB',
          fileType: 'PDF'
        }
      ],
      benefits: ['Tax compliance', 'Government contract eligibility'],
      benefitsAr: ['الامتثال الضريبي', 'أهلية العقود الحكومية']
    },
    {
      id: 'banking',
      title: 'Banking Information',
      titleAr: 'المعلومات المصرفية',
      description: 'Verify your bank account for payments',
      descriptionAr: 'تحقق من حسابك المصرفي للدفعات',
      status: 'completed',
      required: true,
      priority: 'high',
      estimatedTime: '20 minutes',
      documents: [
        {
          id: '4',
          name: 'Bank Statement',
          nameAr: 'كشف الحساب المصرفي',
          type: 'banking',
          status: 'verified',
          uploadedDate: '2024-01-14',
          fileSize: '2.7 MB',
          fileType: 'PDF'
        }
      ],
      benefits: ['Fast payments', 'Automatic settlements'],
      benefitsAr: ['دفعات سريعة', 'تسويات تلقائية']
    },
    {
      id: 'quality',
      title: 'Quality Certifications',
      titleAr: 'شهادات الجودة',
      description: 'Upload quality management certificates (ISO, etc.)',
      descriptionAr: 'ارفع شهادات إدارة الجودة (ISO وغيرها)',
      status: 'pending',
      required: false,
      priority: 'medium',
      estimatedTime: '30 minutes',
      documents: [
        {
          id: '5',
          name: 'ISO 9001 Certificate',
          nameAr: 'شهادة ISO 9001',
          type: 'quality',
          status: 'required',
        }
      ],
      benefits: ['Premium seller badge', 'Higher search ranking'],
      benefitsAr: ['شارة بائع مميز', 'ترتيب أعلى في البحث']
    },
    {
      id: 'insurance',
      title: 'Business Insurance',
      titleAr: 'التأمين التجاري',
      description: 'Upload business insurance certificates',
      descriptionAr: 'ارفع شهادات التأمين التجاري',
      status: 'not_started',
      required: false,
      priority: 'low',
      estimatedTime: '15 minutes',
      benefits: ['Risk protection', 'Enterprise-level features'],
      benefitsAr: ['حماية من المخاطر', 'ميزات مستوى المؤسسات']
    }
  ],
  benefits: {
    current: [
      'Verified seller badge',
      'Higher trust score',
      'Priority customer support',
      'Access to premium features'
    ],
    next: [
      'Premium seller badge',
      'Enterprise features access',
      'Dedicated account manager',
      'Priority in search results'
    ]
  }
}

export const ProfileVerification: React.FC = () => {
  const { isRTL } = useLanguage()
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(mockVerificationStatus)
  const [activeTab, setActiveTab] = useState('overview')
  const [uploading, setUploading] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'not_started':
      case 'required':
        return 'text-gray-600 bg-gray-100 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-5 w-5" />
      case 'pending':
        return <Clock className="h-5 w-5" />
      case 'rejected':
        return <X className="h-5 w-5" />
      case 'not_started':
      case 'required':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleFileUpload = async (stepId: string) => {
    setUploading(stepId)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(null)
  }

  const getVerificationLevelBadge = (level: string) => {
    const levels = {
      basic: { color: 'bg-gray-100 text-gray-800', icon: User },
      standard: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      premium: { color: 'bg-purple-100 text-purple-800', icon: Star },
      enterprise: { color: 'bg-gold-100 text-gold-800', icon: Award }
    }
    return levels[level as keyof typeof levels] || levels.basic
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 mr-3" />
            {isRTL ? 'حالة التحقق' : 'Verification Status'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'إدارة عملية التحقق من حسابك والوثائق المطلوبة' : 'Manage your account verification process and required documents'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={getVerificationLevelBadge(verificationStatus.verificationLevel).color}>
            <Star className="h-3 w-3 mr-1" />
            {verificationStatus.verificationLevel.charAt(0).toUpperCase() + verificationStatus.verificationLevel.slice(1)}
          </Badge>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {isRTL ? 'تحديث الحالة' : 'Refresh Status'}
          </Button>
        </div>
      </div>

      {/* Verification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'نسبة الاكتمال' : 'Completion Rate'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {verificationStatus.completionPercentage}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <Progress value={verificationStatus.completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'نقاط الثقة' : 'Trust Score'}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="text-2xl font-bold text-green-600">
                    {verificationStatus.trustScore}
                  </span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'الخطوات المكتملة' : 'Completed Steps'}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {verificationStatus.steps.filter(s => s.status === 'completed').length}
                  <span className="text-lg text-gray-400">
                    /{verificationStatus.steps.length}
                  </span>
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'الحالة العامة' : 'Overall Status'}
                </p>
                <div className="flex items-center mt-2">
                  {getStatusIcon(verificationStatus.overallStatus)}
                  <span className="text-lg font-bold ml-2 capitalize">
                    {verificationStatus.overallStatus}
                  </span>
                </div>
              </div>
              <Badge className={getStatusColor(verificationStatus.overallStatus)}>
                {verificationStatus.overallStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="steps">{isRTL ? 'خطوات التحقق' : 'Verification Steps'}</TabsTrigger>
          <TabsTrigger value="documents">{isRTL ? 'الوثائق' : 'Documents'}</TabsTrigger>
          <TabsTrigger value="benefits">{isRTL ? 'المزايا' : 'Benefits'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                {isRTL ? 'المزايا الحالية' : 'Current Benefits'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'المزايا التي حصلت عليها من خلال التحقق' : 'Benefits you have unlocked through verification'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verificationStatus.benefits.current.map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Level Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                {isRTL ? 'المزايا التالية' : 'Next Level Benefits'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'المزايا التي ستحصل عليها عند إكمال التحقق' : 'Benefits you will unlock with complete verification'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verificationStatus.benefits.next.map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Lock className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-blue-800 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-purple-900">
                      {isRTL ? 'اكتمل التحقق للحصول على المزايا المميزة' : 'Complete Verification for Premium Benefits'}
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      {isRTL ? 
                        'أكمل جميع خطوات التحقق للحصول على شارة البائع المميز والوصول للميزات المتقدمة' :
                        'Complete all verification steps to unlock premium seller badge and advanced features'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <Upload className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'رفع وثيقة' : 'Upload Document'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <Eye className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'مراجعة الوثائق' : 'Review Documents'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <RefreshCw className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'تحديث الحالة' : 'Update Status'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <Mail className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'الدعم الفني' : 'Contact Support'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Steps */}
        <TabsContent value="steps" className="space-y-6">
          <div className="space-y-4">
            {verificationStatus.steps.map((step) => (
              <Card key={step.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {isRTL ? step.titleAr : step.title}
                          </h3>
                          {step.required && (
                            <Badge variant="destructive" className="text-xs">
                              {isRTL ? 'مطلوب' : 'Required'}
                            </Badge>
                          )}
                          <Badge variant="outline" className={getPriorityColor(step.priority)}>
                            {step.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {isRTL ? step.descriptionAr : step.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{step.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              {(isRTL ? step.benefitsAr : step.benefits).length} {isRTL ? 'فوائد' : 'benefits'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {step.status === 'completed' ? (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {isRTL ? 'عرض' : 'View'}
                        </Button>
                      ) : step.status === 'not_started' ? (
                        <Button size="sm" onClick={() => handleFileUpload(step.id)}>
                          {uploading === step.id ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          {uploading === step.id ? 
                            (isRTL ? 'جاري الرفع...' : 'Uploading...') :
                            (isRTL ? 'ابدأ' : 'Start')
                          }
                        </Button>
                      ) : step.status === 'pending' ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {isRTL ? 'قيد المراجعة' : 'Under Review'}
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm" className="text-red-600">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {isRTL ? 'إعادة رفع' : 'Re-upload'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Step Benefits */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {isRTL ? 'فوائد هذه الخطوة:' : 'Benefits of this step:'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(isRTL ? step.benefitsAr : step.benefits).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Documents for this step */}
                  {step.documents && step.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-900">
                        {isRTL ? 'الوثائق المطلوبة:' : 'Required Documents:'}
                      </h4>
                      {step.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600" />
                            <div>
                              <span className="font-medium">
                                {isRTL ? doc.nameAr : doc.name}
                              </span>
                              {doc.uploadedDate && (
                                <p className="text-xs text-gray-500">
                                  {isRTL ? 'تم الرفع في' : 'Uploaded on'} {new Date(doc.uploadedDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                                  {doc.fileSize && ` • ${doc.fileSize} • ${doc.fileType}`}
                                </p>
                              )}
                              {doc.rejectedReason && (
                                <p className="text-xs text-red-600 mt-1">
                                  {isRTL ? doc.rejectedReasonAr : doc.rejectedReason}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                            {doc.status === 'verified' && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                {isRTL ? 'تحميل' : 'Download'}
                              </Button>
                            )}
                            {doc.status === 'required' && (
                              <Button size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                {isRTL ? 'رفع' : 'Upload'}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {isRTL ? 'جميع الوثائق' : 'All Documents'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'عرض وإدارة جميع الوثائق المرفوعة' : 'View and manage all uploaded documents'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationStatus.steps
                  .filter(step => step.documents && step.documents.length > 0)
                  .map(step => 
                    step.documents?.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getStatusColor(doc.status)}`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {isRTL ? doc.nameAr : doc.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>{doc.fileSize} • {doc.fileType}</span>
                              {doc.uploadedDate && (
                                <span>
                                  {new Date(doc.uploadedDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{doc.status}</span>
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              {isRTL ? 'عرض' : 'View'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {isRTL ? 'تحميل' : 'Download'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verification Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {isRTL ? 'مستويات التحقق' : 'Verification Levels'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Basic</span>
                    </div>
                    <span className="text-sm text-gray-500">0-25%</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {isRTL ? 'حساب أساسي' : 'Basic account access'}</li>
                    <li>• {isRTL ? 'دعم عبر البريد الإلكتروني' : 'Email support'}</li>
                  </ul>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Standard</span>
                      <Badge className="bg-blue-600 text-white text-xs">Current</Badge>
                    </div>
                    <span className="text-sm text-blue-600">26-75%</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {isRTL ? 'شارة البائع المحقق' : 'Verified seller badge'}</li>
                    <li>• {isRTL ? 'دعم أولوية' : 'Priority support'}</li>
                    <li>• {isRTL ? 'حدود طلبات أعلى' : 'Higher order limits'}</li>
                  </ul>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Premium</span>
                    </div>
                    <span className="text-sm text-purple-600">76-95%</span>
                  </div>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• {isRTL ? 'شارة البائع المميز' : 'Premium seller badge'}</li>
                    <li>• {isRTL ? 'أولوية في نتائج البحث' : 'Priority in search results'}</li>
                    <li>• {isRTL ? 'ميزات متقدمة' : 'Advanced features'}</li>
                  </ul>
                </div>

                <div className="p-4 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Enterprise</span>
                    </div>
                    <span className="text-sm text-yellow-600">96-100%</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• {isRTL ? 'مدير حساب مخصص' : 'Dedicated account manager'}</li>
                    <li>• {isRTL ? 'ميزات مستوى المؤسسات' : 'Enterprise-level features'}</li>
                    <li>• {isRTL ? 'دعم فني 24/7' : '24/7 technical support'}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Progress Roadmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {isRTL ? 'خارطة الطريق' : 'Progress Roadmap'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {verificationStatus.completionPercentage}%
                    </div>
                    <p className="text-blue-800 font-medium mb-3">
                      {isRTL ? 'مكتمل' : 'Complete'}
                    </p>
                    <Progress value={verificationStatus.completionPercentage} className="h-3 mb-4" />
                    <p className="text-sm text-blue-700">
                      {100 - verificationStatus.completionPercentage}% {isRTL ? 'متبقي للوصول للمستوى التالي' : 'remaining to next level'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">
                      {isRTL ? 'الخطوات التالية المقترحة:' : 'Suggested Next Steps:'}
                    </h4>
                    {verificationStatus.steps
                      .filter(step => step.status === 'not_started' || step.status === 'pending')
                      .slice(0, 3)
                      .map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">
                              {isRTL ? step.titleAr : step.title}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {step.estimatedTime}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(step.priority)}>
                            {step.priority}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileVerification