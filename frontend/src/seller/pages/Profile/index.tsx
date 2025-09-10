import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui'
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Edit,
  FileText,
  Shield,
  Award,
  TrendingUp,
  Activity,
  Settings,
  Camera,
  ExternalLink,
} from 'lucide-react'

interface SellerProfile {
  id: string
  companyName: string
  companyNameAr: string
  contactName: string
  contactNameAr: string
  email: string
  phone: string
  website: string
  address: string
  addressAr: string
  city: string
  industry: string
  industryAr: string
  founded: string
  employees: string
  description: string
  descriptionAr: string
  logo: string
  coverImage: string
  rating: number
  totalOrders: number
  completedOrders: number
  responseTime: number
  joinDate: string
  lastActive: string
  verificationStatus: 'verified' | 'pending' | 'unverified'
  kycStatus: 'completed' | 'pending' | 'not_started'
  subscriptionPlan: 'basic' | 'premium' | 'enterprise'
  profileCompleteness: number
  documents: {
    commercialRegistration: boolean
    taxCertificate: boolean
    bankDetails: boolean
    identity: boolean
  }
}

const mockSellerProfile: SellerProfile = {
  id: '1',
  companyName: 'Industrial Solutions Ltd.',
  companyNameAr: 'شركة الحلول الصناعية المحدودة',
  contactName: 'Ahmed Al-Saudi',
  contactNameAr: 'أحمد السعودي',
  email: 'ahmed@industrial-solutions.sa',
  phone: '+966 11 234 5678',
  website: 'https://industrial-solutions.sa',
  address: '123 King Fahd Road, Riyadh',
  addressAr: '123 طريق الملك فهد، الرياض',
  city: 'Riyadh',
  industry: 'Industrial Equipment & Machinery',
  industryAr: 'المعدات والآلات الصناعية',
  founded: '2018',
  employees: '50-100',
  description: 'Leading supplier of industrial equipment and machinery in Saudi Arabia, serving manufacturing and construction industries with high-quality products and exceptional service.',
  descriptionAr: 'المورد الرائد للمعدات والآلات الصناعية في المملكة العربية السعودية، نخدم صناعات التصنيع والإنشاءات بمنتجات عالية الجودة وخدمة استثنائية.',
  logo: '/api/placeholder/120/120',
  coverImage: '/api/placeholder/800/200',
  rating: 4.8,
  totalOrders: 1247,
  completedOrders: 1189,
  responseTime: 2.5,
  joinDate: '2018-03-15',
  lastActive: '2024-01-15T10:30:00Z',
  verificationStatus: 'verified',
  kycStatus: 'completed',
  subscriptionPlan: 'premium',
  profileCompleteness: 92,
  documents: {
    commercialRegistration: true,
    taxCertificate: true,
    bankDetails: true,
    identity: true
  }
}

export const Profile: React.FC = () => {
  const { t, isRTL } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'unverified':
      case 'not_started':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-100'
      case 'premium':
        return 'text-blue-600 bg-blue-100'
      case 'basic':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getProfileItems = () => [
    {
      title: isRTL ? 'معلومات الشركة' : 'Company Information',
      description: isRTL ? 'تفاصيل الشركة الأساسية والتجارية' : 'Basic company and business details',
      href: '/seller/profile/company',
      icon: Building2,
      completed: true
    },
    {
      title: isRTL ? 'الوثائق' : 'Documents',
      description: isRTL ? 'السجل التجاري والوثائق المطلوبة' : 'Commercial registration and required documents',
      href: '/seller/profile/documents',
      icon: FileText,
      completed: Object.values(mockSellerProfile.documents).every(Boolean)
    },
    {
      title: isRTL ? 'جهات الاتصال' : 'Contacts',
      description: isRTL ? 'معلومات الاتصال والأشخاص المسؤولين' : 'Contact information and responsible persons',
      href: '/seller/profile/contacts',
      icon: Users,
      completed: true
    },
    {
      title: isRTL ? 'ساعات العمل' : 'Business Hours',
      description: isRTL ? 'أوقات العمل والتوفر' : 'Working hours and availability',
      href: '/seller/profile/hours',
      icon: Clock,
      completed: true
    }
  ]

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Cover Image */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
          {mockSellerProfile.coverImage && (
            <img 
              src={mockSellerProfile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isRTL ? 'تغيير الغلاف' : 'Change Cover'}
          </Button>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-6 left-6">
          <div className="flex items-end space-x-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={mockSellerProfile.logo} alt="Company Logo" />
              <AvatarFallback className="text-xl">
                {mockSellerProfile.companyName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
              <h1 className="text-xl font-bold text-gray-900">
                {isRTL ? mockSellerProfile.companyNameAr : mockSellerProfile.companyName}
              </h1>
              <p className="text-gray-600">
                {isRTL ? mockSellerProfile.industryAr : mockSellerProfile.industry}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(mockSellerProfile.verificationStatus)}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {isRTL ? 'محقق' : 'Verified'}
          </Badge>
          <Badge className={getSubscriptionColor(mockSellerProfile.subscriptionPlan)}>
            <Star className="h-3 w-3 mr-1" />
            {mockSellerProfile.subscriptionPlan.charAt(0).toUpperCase() + mockSellerProfile.subscriptionPlan.slice(1)}
          </Badge>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-semibold">{mockSellerProfile.rating}</span>
            <span className="mx-1">•</span>
            <span>{mockSellerProfile.totalOrders} {isRTL ? 'طلب' : 'orders'}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/seller/settings">
              <Settings className="h-4 w-4 mr-2" />
              {isRTL ? 'الإعدادات' : 'Settings'}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/seller/profile/company">
              <Edit className="h-4 w-4 mr-2" />
              {isRTL ? 'تحرير الملف' : 'Edit Profile'}
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="stats">{isRTL ? 'الإحصائيات' : 'Statistics'}</TabsTrigger>
          <TabsTrigger value="documents">{isRTL ? 'الوثائق' : 'Documents'}</TabsTrigger>
          <TabsTrigger value="activity">{isRTL ? 'النشاط' : 'Activity'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isRTL ? 'اكتمال الملف الشخصي' : 'Profile Completeness'}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {mockSellerProfile.profileCompleteness}%
                </span>
              </CardTitle>
              <CardDescription>
                {isRTL ? 'أكمل ملفك الشخصي لزيادة الثقة مع العملاء' : 'Complete your profile to increase trust with customers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={mockSellerProfile.profileCompleteness} className="h-3 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">{isRTL ? 'المعلومات الأساسية' : 'Basic Info'}</span>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">{isRTL ? 'الوثائق' : 'Documents'}</span>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">{isRTL ? 'التحقق' : 'Verification'}</span>
                </div>
                <div className="flex items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">{isRTL ? 'صور المنتجات' : 'Product Images'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {isRTL ? 'أضف المزيد من صور المنتجات لزيادة معدل الثقة بنسبة 8%' : 'Add more product images to increase trust score by 8%'}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {isRTL ? 'معلومات الشركة' : 'Company Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 mr-2">{isRTL ? 'الاسم:' : 'Contact:'}</span>
                  <span className="font-medium">
                    {isRTL ? mockSellerProfile.contactNameAr : mockSellerProfile.contactName}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 mr-2">{isRTL ? 'البريد:' : 'Email:'}</span>
                  <span className="font-medium">{mockSellerProfile.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 mr-2">{isRTL ? 'الهاتف:' : 'Phone:'}</span>
                  <span className="font-medium">{mockSellerProfile.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 mr-2">{isRTL ? 'العنوان:' : 'Address:'}</span>
                  <span className="font-medium">
                    {isRTL ? mockSellerProfile.addressAr : mockSellerProfile.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 mr-2">{isRTL ? 'الموقع:' : 'Website:'}</span>
                  <a 
                    href={mockSellerProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline flex items-center"
                  >
                    {mockSellerProfile.website}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {isRTL ? 'مؤشرات الأداء' : 'Performance Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {mockSellerProfile.totalOrders}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                    </div>
                    <div className="text-xs text-green-600 mt-1">+12% {isRTL ? 'هذا الشهر' : 'this month'}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {((mockSellerProfile.completedOrders / mockSellerProfile.totalOrders) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {isRTL ? 'معدل الإنجاز' : 'Success Rate'}
                    </div>
                    <div className="text-xs text-green-600 mt-1">{isRTL ? 'ممتاز' : 'Excellent'}</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {mockSellerProfile.responseTime}h
                    </div>
                    <div className="text-sm text-gray-600">
                      {isRTL ? 'وقت الاستجابة' : 'Response Time'}
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">{isRTL ? 'جيد' : 'Good'}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-2xl font-bold text-purple-600 ml-1">
                        {mockSellerProfile.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {isRTL ? 'التقييم' : 'Rating'}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">247 {isRTL ? 'تقييم' : 'reviews'}</div>
                  </div>
                </div>
                
                {/* Additional metrics */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</span>
                    <span className="font-semibold">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '32%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Sections */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'أقسام الملف الشخصي' : 'Profile Sections'}</CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة وتحديث أقسام ملفك الشخصي المختلفة' : 'Manage and update different sections of your profile'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getProfileItems().map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Link key={index} to={item.href}>
                      <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 text-blue-600 mr-3" />
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          {item.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {isRTL ? 'آخر نشاط' : 'Last Activity'}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatDate(mockSellerProfile.lastActive)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {isRTL ? 'تاريخ الانضمام' : 'Member Since'}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatDate(mockSellerProfile.joinDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {isRTL ? 'عدد الموظفين' : 'Employees'}
                    </p>
                    <p className="text-2xl font-bold">
                      {mockSellerProfile.employees}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {isRTL ? 'تأسست في' : 'Founded'}
                    </p>
                    <p className="text-2xl font-bold">
                      {mockSellerProfile.founded}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {isRTL ? 'حالة الوثائق' : 'Document Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {isRTL ? 'السجل التجاري' : 'Commercial Registration'}
                    </span>
                    {mockSellerProfile.documents.commercialRegistration ? (
                      <Badge className="text-green-600 bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مقبول' : 'Approved'}
                      </Badge>
                    ) : (
                      <Badge className="text-red-600 bg-red-100">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مطلوب' : 'Required'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {isRTL ? 'شهادة الضريبة' : 'Tax Certificate'}
                    </span>
                    {mockSellerProfile.documents.taxCertificate ? (
                      <Badge className="text-green-600 bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مقبول' : 'Approved'}
                      </Badge>
                    ) : (
                      <Badge className="text-red-600 bg-red-100">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مطلوب' : 'Required'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {isRTL ? 'التفاصيل المصرفية' : 'Bank Details'}
                    </span>
                    {mockSellerProfile.documents.bankDetails ? (
                      <Badge className="text-green-600 bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مقبول' : 'Approved'}
                      </Badge>
                    ) : (
                      <Badge className="text-red-600 bg-red-100">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مطلوب' : 'Required'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {isRTL ? 'إثبات الهوية' : 'Identity Verification'}
                    </span>
                    {mockSellerProfile.documents.identity ? (
                      <Badge className="text-green-600 bg-green-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مقبول' : 'Approved'}
                      </Badge>
                    ) : (
                      <Badge className="text-red-600 bg-red-100">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مطلوب' : 'Required'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button asChild>
                  <Link to="/seller/profile/documents">
                    <FileText className="h-4 w-4 mr-2" />
                    {isRTL ? 'إدارة الوثائق' : 'Manage Documents'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm">
                    {isRTL ? 'تم تحديث معلومات الشركة' : 'Company information updated'} - 
                    <span className="text-gray-500 mr-1">2 {isRTL ? 'ساعات مضت' : 'hours ago'}</span>
                  </span>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-sm">
                    {isRTL ? 'تم قبول طلب جديد' : 'New order received'} - 
                    <span className="text-gray-500 mr-1">5 {isRTL ? 'ساعات مضت' : 'hours ago'}</span>
                  </span>
                </div>
                
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  <span className="text-sm">
                    {isRTL ? 'تم تحديث كتالوج المنتجات' : 'Product catalog updated'} - 
                    <span className="text-gray-500 mr-1">1 {isRTL ? 'يوم مضى' : 'day ago'}</span>
                  </span>
                </div>
                
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                  <span className="text-sm">
                    {isRTL ? 'تم تجديد الاشتراك المميز' : 'Premium subscription renewed'} - 
                    <span className="text-gray-500 mr-1">3 {isRTL ? 'أيام مضت' : 'days ago'}</span>
                  </span>
                </div>
                
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                  <span className="text-sm">
                    {isRTL ? 'تم رفع وثائق جديدة' : 'New documents uploaded'} - 
                    <span className="text-gray-500 mr-1">1 {isRTL ? 'أسبوع مضى' : 'week ago'}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile