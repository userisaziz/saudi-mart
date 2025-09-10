import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
  Star,
  Zap,
  Award,
  Users,
  Building2,
  FileText,
  Shield,
  CreditCard,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Package,
  Settings,
  Eye,
  Edit,
} from 'lucide-react'

interface CompletionTask {
  id: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  category: 'basic' | 'business' | 'verification' | 'advanced'
  priority: 'high' | 'medium' | 'low'
  status: 'completed' | 'in_progress' | 'not_started'
  estimatedTime: string
  points: number
  path: string
  icon: any
  benefits: string[]
  benefitsAr: string[]
  prerequisites?: string[]
}

interface CompletionStats {
  overallScore: number
  totalPoints: number
  earnedPoints: number
  completedTasks: number
  totalTasks: number
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  nextLevelPoints: number
  trustScore: number
}

const mockCompletionTasks: CompletionTask[] = [
  {
    id: 'basic_profile',
    title: 'Complete Basic Profile',
    titleAr: 'إكمال الملف الأساسي',
    description: 'Add your personal information, photo, and contact details',
    descriptionAr: 'أضف معلوماتك الشخصية والصورة وتفاصيل الاتصال',
    category: 'basic',
    priority: 'high',
    status: 'completed',
    estimatedTime: '5 minutes',
    points: 100,
    path: '/seller/profile/account',
    icon: Users,
    benefits: ['Professional appearance', 'Customer trust'],
    benefitsAr: ['مظهر مهني', 'ثقة العملاء']
  },
  {
    id: 'company_info',
    title: 'Add Company Information',
    titleAr: 'إضافة معلومات الشركة',
    description: 'Complete your business details, registration, and industry information',
    descriptionAr: 'أكمل تفاصيل عملك والتسجيل ومعلومات الصناعة',
    category: 'business',
    priority: 'high',
    status: 'completed',
    estimatedTime: '15 minutes',
    points: 200,
    path: '/seller/profile/business',
    icon: Building2,
    benefits: ['Business credibility', 'Higher search ranking'],
    benefitsAr: ['مصداقية الأعمال', 'ترتيب أعلى في البحث']
  },
  {
    id: 'verification_docs',
    title: 'Upload Verification Documents',
    titleAr: 'رفع وثائق التحقق',
    description: 'Upload required business and identity verification documents',
    descriptionAr: 'ارفع الوثائق المطلوبة للتحقق من الأعمال والهوية',
    category: 'verification',
    priority: 'high',
    status: 'completed',
    estimatedTime: '30 minutes',
    points: 300,
    path: '/seller/profile/verification',
    icon: Shield,
    benefits: ['Verified badge', 'Higher trust score', 'Access to premium features'],
    benefitsAr: ['شارة محقق', 'نقاط ثقة أعلى', 'الوصول للميزات المميزة']
  },
  {
    id: 'payment_setup',
    title: 'Setup Payment Methods',
    titleAr: 'إعداد طرق الدفع',
    description: 'Configure your bank account and payment preferences',
    descriptionAr: 'قم بتكوين حسابك المصرفي وتفضيلات الدفع',
    category: 'business',
    priority: 'high',
    status: 'completed',
    estimatedTime: '10 minutes',
    points: 150,
    path: '/seller/profile/banking',
    icon: CreditCard,
    benefits: ['Fast payments', 'Automatic settlements'],
    benefitsAr: ['دفعات سريعة', 'تسويات تلقائية']
  },
  {
    id: 'product_catalog',
    title: 'Add Products to Catalog',
    titleAr: 'إضافة منتجات للكتالوج',
    description: 'Upload at least 5 products with descriptions and images',
    descriptionAr: 'ارفع 5 منتجات على الأقل مع الأوصاف والصور',
    category: 'business',
    priority: 'high',
    status: 'in_progress',
    estimatedTime: '45 minutes',
    points: 250,
    path: '/seller/products/add',
    icon: Package,
    benefits: ['Start selling', 'Product visibility'],
    benefitsAr: ['ابدأ البيع', 'ظهور المنتجات']
  },
  {
    id: 'business_hours',
    title: 'Set Business Hours',
    titleAr: 'تحديد ساعات العمل',
    description: 'Configure your availability and business operating hours',
    descriptionAr: 'قم بتكوين ساعات عملك ومواعيد التوفر',
    category: 'business',
    priority: 'medium',
    status: 'completed',
    estimatedTime: '5 minutes',
    points: 75,
    path: '/seller/profile/hours',
    icon: Clock,
    benefits: ['Clear expectations', 'Better customer service'],
    benefitsAr: ['توقعات واضحة', 'خدمة عملاء أفضل']
  },
  {
    id: 'company_logo',
    title: 'Upload Company Logo',
    titleAr: 'رفع شعار الشركة',
    description: 'Add your professional company logo and branding',
    descriptionAr: 'أضف شعار شركتك المهني والعلامة التجارية',
    category: 'basic',
    priority: 'medium',
    status: 'not_started',
    estimatedTime: '3 minutes',
    points: 100,
    path: '/seller/profile/company',
    icon: Camera,
    benefits: ['Brand recognition', 'Professional look'],
    benefitsAr: ['تعرف على العلامة التجارية', 'مظهر مهني']
  },
  {
    id: 'quality_certs',
    title: 'Add Quality Certifications',
    titleAr: 'إضافة شهادات الجودة',
    description: 'Upload ISO, industry certifications, and quality standards',
    descriptionAr: 'ارفع شهادات ISO وشهادات الصناعة ومعايير الجودة',
    category: 'advanced',
    priority: 'medium',
    status: 'not_started',
    estimatedTime: '20 minutes',
    points: 200,
    path: '/seller/profile/certifications',
    icon: Award,
    benefits: ['Premium badge', 'Quality assurance', 'Competitive advantage'],
    benefitsAr: ['شارة مميزة', 'ضمان الجودة', 'ميزة تنافسية']
  },
  {
    id: 'social_media',
    title: 'Connect Social Media',
    titleAr: 'ربط وسائل التواصل',
    description: 'Link your social media profiles for better reach',
    descriptionAr: 'اربط حسابات وسائل التواصل الاجتماعي لوصول أفضل',
    category: 'advanced',
    priority: 'low',
    status: 'not_started',
    estimatedTime: '8 minutes',
    points: 50,
    path: '/seller/profile/social',
    icon: Globe,
    benefits: ['Wider reach', 'Brand presence'],
    benefitsAr: ['وصول أوسع', 'حضور العلامة التجارية']
  },
  {
    id: 'shipping_methods',
    title: 'Configure Shipping Methods',
    titleAr: 'تكوين طرق الشحن',
    description: 'Set up shipping options and delivery preferences',
    descriptionAr: 'قم بإعداد خيارات الشحن وتفضيلات التسليم',
    category: 'business',
    priority: 'medium',
    status: 'not_started',
    estimatedTime: '15 minutes',
    points: 150,
    path: '/seller/settings/shipping',
    icon: MapPin,
    benefits: ['Clear delivery terms', 'Customer satisfaction'],
    benefitsAr: ['شروط تسليم واضحة', 'رضا العملاء']
  }
]

const mockCompletionStats: CompletionStats = {
  overallScore: 75,
  totalPoints: 1375,
  earnedPoints: 1025,
  completedTasks: 6,
  totalTasks: 10,
  level: 'intermediate',
  nextLevelPoints: 1200,
  trustScore: 88
}

export const ProfileCompletion: React.FC = () => {
  const { isRTL } = useLanguage()
  const [completionStats] = useState<CompletionStats>(mockCompletionStats)
  const [tasks] = useState<CompletionTask[]>(mockCompletionTasks)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: isRTL ? 'الكل' : 'All', nameAr: 'الكل' },
    { id: 'basic', name: isRTL ? 'أساسي' : 'Basic', nameAr: 'أساسي' },
    { id: 'business', name: isRTL ? 'تجاري' : 'Business', nameAr: 'تجاري' },
    { id: 'verification', name: isRTL ? 'التحقق' : 'Verification', nameAr: 'التحقق' },
    { id: 'advanced', name: isRTL ? 'متقدم' : 'Advanced', nameAr: 'متقدم' }
  ]

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'not_started':
        return 'text-gray-600 bg-gray-100 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />
      case 'in_progress':
        return <Clock className="h-5 w-5" />
      case 'not_started':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getLevelInfo = (level: string) => {
    const levels = {
      beginner: { 
        name: isRTL ? 'مبتدئ' : 'Beginner', 
        color: 'text-gray-600', 
        icon: Users,
        minPoints: 0,
        maxPoints: 500
      },
      intermediate: { 
        name: isRTL ? 'متوسط' : 'Intermediate', 
        color: 'text-blue-600', 
        icon: TrendingUp,
        minPoints: 500,
        maxPoints: 1000
      },
      advanced: { 
        name: isRTL ? 'متقدم' : 'Advanced', 
        color: 'text-purple-600', 
        icon: Star,
        minPoints: 1000,
        maxPoints: 1500
      },
      expert: { 
        name: isRTL ? 'خبير' : 'Expert', 
        color: 'text-gold-600', 
        icon: Trophy,
        minPoints: 1500,
        maxPoints: 2000
      }
    }
    return levels[level as keyof typeof levels] || levels.beginner
  }

  const currentLevelInfo = getLevelInfo(completionStats.level)

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Target className="h-6 w-6 mr-3" />
            {isRTL ? 'تتبع اكتمال الملف' : 'Profile Completion Tracking'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'تتبع تقدمك نحو إكمال ملف شخصي احترافي' : 'Track your progress towards a complete professional profile'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={`${currentLevelInfo.color} bg-opacity-10 border-current`}>
            <currentLevelInfo.icon className="h-3 w-3 mr-1" />
            {currentLevelInfo.name}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'النقاط الإجمالية' : 'Total Score'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {completionStats.earnedPoints}/{completionStats.totalPoints}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <Progress 
                value={(completionStats.earnedPoints / completionStats.totalPoints) * 100} 
                className="h-2" 
              />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round((completionStats.earnedPoints / completionStats.totalPoints) * 100)}% {isRTL ? 'مكتمل' : 'complete'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'المهام المكتملة' : 'Completed Tasks'}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {completionStats.completedTasks}/{completionStats.totalTasks}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress 
                value={(completionStats.completedTasks / completionStats.totalTasks) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'مستوى الثقة' : 'Trust Level'}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="text-2xl font-bold text-purple-600">
                    {completionStats.trustScore}
                  </span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'للمستوى التالي' : 'To Next Level'}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.max(0, completionStats.nextLevelPoints - completionStats.earnedPoints)}
                </p>
                <p className="text-xs text-gray-500">
                  {isRTL ? 'نقطة' : 'points'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="tasks">{isRTL ? 'المهام' : 'Tasks'}</TabsTrigger>
          <TabsTrigger value="rewards">{isRTL ? 'المكافآت' : 'Rewards'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <currentLevelInfo.icon className="h-5 w-5 mr-2" />
                {isRTL ? `مستوى ${currentLevelInfo.name}` : `${currentLevelInfo.name} Level`}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تقدمك الحالي ومتطلبات المستوى التالي' : 'Your current progress and next level requirements'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {isRTL ? 'التقدم في المستوى الحالي' : 'Current level progress'}
                </span>
                <span className="font-semibold">
                  {completionStats.earnedPoints - currentLevelInfo.minPoints}/{currentLevelInfo.maxPoints - currentLevelInfo.minPoints} 
                  {' '}{isRTL ? 'نقطة' : 'points'}
                </span>
              </div>
              <Progress 
                value={((completionStats.earnedPoints - currentLevelInfo.minPoints) / (currentLevelInfo.maxPoints - currentLevelInfo.minPoints)) * 100} 
                className="h-3" 
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{currentLevelInfo.name}</span>
                <span>
                  {Math.max(0, currentLevelInfo.maxPoints - completionStats.earnedPoints)} {isRTL ? 'نقطة للمستوى التالي' : 'points to next level'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'المهام ذات الأولوية' : 'Priority Tasks'}</CardTitle>
              <CardDescription>
                {isRTL ? 'المهام عالية الأولوية التي ينبغي إكمالها أولاً' : 'High-priority tasks that should be completed first'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks
                  .filter(task => task.priority === 'high' && task.status !== 'completed')
                  .slice(0, 3)
                  .map((task) => {
                    const Icon = task.icon
                    return (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-50 rounded-lg">
                            <Icon className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {isRTL ? task.titleAr : task.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              +{task.points} {isRTL ? 'نقطة' : 'points'} • {task.estimatedTime}
                            </p>
                          </div>
                        </div>
                        <Button asChild>
                          <Link to={task.path}>
                            {isRTL ? 'ابدأ' : 'Start'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                {isRTL ? 'الإنجازات الأخيرة' : 'Recent Achievements'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks
                  .filter(task => task.status === 'completed')
                  .slice(0, 4)
                  .map((task) => {
                    const Icon = task.icon
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <Icon className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <span className="font-medium text-green-800">
                            {isRTL ? task.titleAr : task.title}
                          </span>
                          <span className="text-sm text-green-600 ml-2">
                            +{task.points} {isRTL ? 'نقطة' : 'points'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          {/* Category Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2">
                      {category.id === 'all' 
                        ? tasks.length 
                        : tasks.filter(task => task.category === category.id).length
                      }
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const Icon = task.icon
              return (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getStatusColor(task.status)}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {isRTL ? task.titleAr : task.title}
                            </h3>
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1 capitalize">{task.status}</span>
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {isRTL ? task.descriptionAr : task.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              <span>+{task.points} {isRTL ? 'نقطة' : 'points'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{task.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              <span>{task.category}</span>
                            </div>
                          </div>
                          
                          {/* Task Benefits */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-900">
                              {isRTL ? 'الفوائد:' : 'Benefits:'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(isRTL ? task.benefitsAr : task.benefits).map((benefit, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {task.status === 'completed' ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={task.path}>
                              <Eye className="h-4 w-4 mr-2" />
                              {isRTL ? 'عرض' : 'View'}
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link to={task.path}>
                              {task.status === 'in_progress' ? (
                                <Edit className="h-4 w-4 mr-2" />
                              ) : (
                                <ArrowRight className="h-4 w-4 mr-2" />
                              )}
                              {task.status === 'in_progress' 
                                ? (isRTL ? 'متابعة' : 'Continue')
                                : (isRTL ? 'ابدأ' : 'Start')
                              }
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          {/* Level Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                {isRTL ? 'مستويات المكافآت' : 'Reward Levels'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'المكافآت والمزايا لكل مستوى إنجاز' : 'Rewards and benefits for each achievement level'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  level: 'beginner',
                  points: '0-500',
                  rewards: ['Basic seller access', 'Email support', 'Standard listing'],
                  rewardsAr: ['وصول البائع الأساسي', 'دعم البريد الإلكتروني', 'إدراج قياسي']
                },
                {
                  level: 'intermediate',
                  points: '500-1000',
                  rewards: ['Verified badge', 'Priority support', 'Featured listings'],
                  rewardsAr: ['شارة محقق', 'دعم أولوية', 'قوائم مميزة']
                },
                {
                  level: 'advanced',
                  points: '1000-1500',
                  rewards: ['Premium badge', 'Advanced analytics', 'Priority search results'],
                  rewardsAr: ['شارة مميزة', 'تحليلات متقدمة', 'نتائج بحث أولوية']
                },
                {
                  level: 'expert',
                  points: '1500+',
                  rewards: ['Expert badge', 'Dedicated support', 'Enterprise features'],
                  rewardsAr: ['شارة خبير', 'دعم مخصص', 'ميزات المؤسسات']
                }
              ].map((level) => {
                const levelInfo = getLevelInfo(level.level)
                const isCurrentLevel = level.level === completionStats.level
                
                return (
                  <div 
                    key={level.level} 
                    className={`p-4 rounded-lg border-2 ${
                      isCurrentLevel 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <levelInfo.icon className={`h-6 w-6 ${levelInfo.color}`} />
                        <div>
                          <h4 className={`font-semibold ${levelInfo.color}`}>
                            {levelInfo.name}
                          </h4>
                          <p className="text-sm text-gray-600">{level.points} {isRTL ? 'نقطة' : 'points'}</p>
                        </div>
                      </div>
                      {isCurrentLevel && (
                        <Badge className="bg-blue-600 text-white">
                          {isRTL ? 'المستوى الحالي' : 'Current Level'}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {(isRTL ? level.rewardsAr : level.rewards).map((reward, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className={`h-4 w-4 ${levelInfo.color}`} />
                          <span className="text-sm">{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Progress Incentives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                {isRTL ? 'حوافز التقدم' : 'Progress Incentives'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">
                      {isRTL ? 'مكافأة الإكمال' : 'Completion Bonus'}
                    </h4>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    {isRTL ? 'احصل على 200 نقطة إضافية عند إكمال جميع المهام' : 'Get 200 bonus points for completing all tasks'}
                  </p>
                  <Progress value={(completionStats.completedTasks / completionStats.totalTasks) * 100} className="h-2" />
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-6 w-6 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">
                      {isRTL ? 'مكافأة الجودة' : 'Quality Bonus'}
                    </h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    {isRTL ? 'مكافآت إضافية للمهام عالية الجودة والتحقق المتقدم' : 'Extra rewards for high-quality tasks and advanced verification'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileCompletion