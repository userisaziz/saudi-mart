import React, { useState } from 'react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Progress,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui'
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Edit,
  Save,
  RefreshCw,
  Camera,
  Crown,
  TrendingUp,
  Award,
  Target,
  Activity,
  CreditCard,
  Lock,
} from 'lucide-react'

interface AccountInfo {
  id: string
  personalDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string
    joinDate: string
    lastLogin: string
  }
  accountStatus: {
    verified: boolean
    kycCompleted: boolean
    subscriptionPlan: 'basic' | 'premium' | 'enterprise'
    subscriptionExpiry: string
    profileCompleteness: number
    trustScore: number
  }
  businessMetrics: {
    totalOrders: number
    completedOrders: number
    customerRating: number
    responseTime: number
    activeProducts: number
    monthlyRevenue: number
  }
  preferences: {
    language: 'en' | 'ar'
    currency: 'SAR' | 'USD' | 'EUR'
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
  }
}

const mockAccountInfo: AccountInfo = {
  id: 'seller_001',
  personalDetails: {
    firstName: 'Ahmed',
    lastName: 'Al-Saudi',
    email: 'ahmed@industrial-solutions.sa',
    phone: '+966 11 234 5678',
    avatar: '/api/placeholder/120/120',
    joinDate: '2018-03-15',
    lastLogin: '2024-01-15T10:30:00Z'
  },
  accountStatus: {
    verified: true,
    kycCompleted: true,
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2024-12-31',
    profileCompleteness: 92,
    trustScore: 98
  },
  businessMetrics: {
    totalOrders: 1247,
    completedOrders: 1189,
    customerRating: 4.8,
    responseTime: 2.5,
    activeProducts: 156,
    monthlyRevenue: 45600
  },
  preferences: {
    language: 'en',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    emailNotifications: true,
    pushNotifications: true
  }
}

export const ProfileAccount: React.FC = () => {
  const { isRTL } = useLanguage()
  const [accountInfo, setAccountInfo] = useState<AccountInfo>(mockAccountInfo)
  const [activeTab, setActiveTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setEditing(false)
  }

  const getSubscriptionBadge = (plan: string) => {
    const badges = {
      basic: { color: 'bg-gray-100 text-gray-800', icon: User },
      premium: { color: 'bg-blue-100 text-blue-800', icon: Star },
      enterprise: { color: 'bg-purple-100 text-purple-800', icon: Crown }
    }
    return badges[plan as keyof typeof badges] || badges.basic
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: accountInfo.preferences.currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-3" />
            {isRTL ? 'معلومات الحساب' : 'Account Information'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'إدارة معلومات حسابك الشخصي والتجاري' : 'Manage your personal and business account details'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            <Edit className="h-4 w-4 mr-2" />
            {editing ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'تعديل' : 'Edit')}
          </Button>
          {editing && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
            </Button>
          )}
        </div>
      </div>

      {/* Account Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Trust Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'نقاط الثقة' : 'Trust Score'}
                </p>
                <div className="flex items-center mt-2">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-2xl font-bold text-green-600">
                    {accountInfo.accountStatus.trustScore}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">
                  {isRTL ? 'ممتاز' : 'Excellent'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completeness */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'اكتمال الملف' : 'Profile Complete'}
                </p>
                <span className="text-sm font-semibold text-blue-600">
                  {accountInfo.accountStatus.profileCompleteness}%
                </span>
              </div>
              <Progress 
                value={accountInfo.accountStatus.profileCompleteness} 
                className="h-2" 
              />
              <p className="text-xs text-gray-500">
                {100 - accountInfo.accountStatus.profileCompleteness}% {isRTL ? 'متبقي' : 'remaining'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'الاشتراك' : 'Subscription'}
                </p>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-lg font-semibold capitalize">
                    {accountInfo.accountStatus.subscriptionPlan}
                  </span>
                </div>
              </div>
              <Badge className={getSubscriptionBadge(accountInfo.accountStatus.subscriptionPlan).color}>
                {isRTL ? 'نشط' : 'Active'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">
                {isRTL ? 'حالة التحقق' : 'Verification Status'}
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  {accountInfo.accountStatus.verified ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  )}
                  <span className="text-sm">
                    {isRTL ? 'الحساب محقق' : 'Account Verified'}
                  </span>
                </div>
                <div className="flex items-center">
                  {accountInfo.accountStatus.kycCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  )}
                  <span className="text-sm">
                    {isRTL ? 'التحقق من الهوية' : 'KYC Completed'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="personal">{isRTL ? 'شخصي' : 'Personal'}</TabsTrigger>
          <TabsTrigger value="business">{isRTL ? 'تجاري' : 'Business'}</TabsTrigger>
          <TabsTrigger value="preferences">{isRTL ? 'التفضيلات' : 'Preferences'}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {isRTL ? 'ملخص الحساب' : 'Account Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={accountInfo.personalDetails.avatar} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {accountInfo.personalDetails.firstName.charAt(0)}
                      {accountInfo.personalDetails.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {accountInfo.personalDetails.firstName} {accountInfo.personalDetails.lastName}
                    </h3>
                    <p className="text-gray-600">{accountInfo.personalDetails.email}</p>
                    <p className="text-sm text-gray-500">
                      {isRTL ? 'عضو منذ' : 'Member since'} {formatDate(accountInfo.personalDetails.joinDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'آخر دخول' : 'Last login'}</span>
                    <span className="text-sm font-medium">
                      {new Date(accountInfo.personalDetails.lastLogin).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'انتهاء الاشتراك' : 'Subscription expires'}</span>
                    <span className="text-sm font-medium">
                      {formatDate(accountInfo.accountStatus.subscriptionExpiry)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'المنطقة الزمنية' : 'Timezone'}</span>
                    <span className="text-sm font-medium">{accountInfo.preferences.timezone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {isRTL ? 'أداء الأعمال' : 'Business Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {accountInfo.businessMetrics.totalOrders.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-xl font-bold text-green-600">
                        {accountInfo.businessMetrics.customerRating}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {isRTL ? 'تقييم العملاء' : 'Customer Rating'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {accountInfo.businessMetrics.activeProducts}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isRTL ? 'منتجات نشطة' : 'Active Products'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(accountInfo.businessMetrics.monthlyRevenue)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'معدل النجاح' : 'Success Rate'}</span>
                    <span className="font-semibold">
                      {((accountInfo.businessMetrics.completedOrders / accountInfo.businessMetrics.totalOrders) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{
                        width: `${(accountInfo.businessMetrics.completedOrders / accountInfo.businessMetrics.totalOrders) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <Camera className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'تغيير الصورة' : 'Update Photo'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <Lock className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'تغيير كلمة المرور' : 'Change Password'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <CreditCard className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'طرق الدفع' : 'Payment Methods'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center">
                  <Award className="h-5 w-5 mb-2" />
                  <span className="text-sm">{isRTL ? 'الشهادات' : 'Certifications'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'المعلومات الشخصية' : 'Personal Information'}</CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة بياناتك الشخصية ومعلومات الاتصال' : 'Manage your personal details and contact information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{isRTL ? 'الاسم الأول' : 'First Name'}</Label>
                  <Input
                    id="firstName"
                    value={accountInfo.personalDetails.firstName}
                    disabled={!editing}
                    onChange={(e) => setAccountInfo(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        firstName: e.target.value
                      }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{isRTL ? 'اسم العائلة' : 'Last Name'}</Label>
                  <Input
                    id="lastName"
                    value={accountInfo.personalDetails.lastName}
                    disabled={!editing}
                    onChange={(e) => setAccountInfo(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        lastName: e.target.value
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={accountInfo.personalDetails.email}
                      disabled={!editing}
                      className="pl-10"
                      onChange={(e) => setAccountInfo(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          email: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={accountInfo.personalDetails.phone}
                      disabled={!editing}
                      className="pl-10"
                      onChange={(e) => setAccountInfo(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          phone: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'المعلومات التجارية' : 'Business Information'}</CardTitle>
              <CardDescription>
                {isRTL ? 'عرض إحصائيات وأداء نشاطك التجاري' : 'View your business statistics and performance metrics'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                      </p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {accountInfo.businessMetrics.totalOrders.toLocaleString()}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        {isRTL ? 'معدل النجاح' : 'Success Rate'}
                      </p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {((accountInfo.businessMetrics.completedOrders / accountInfo.businessMetrics.totalOrders) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">
                        {isRTL ? 'وقت الاستجابة' : 'Response Time'}
                      </p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {accountInfo.businessMetrics.responseTime}h
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Monthly Revenue Chart Placeholder */}
              <div className="mt-6 p-6 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">
                  {isRTL ? 'الإيرادات الشهرية' : 'Monthly Revenue Trend'}
                </h4>
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    {isRTL ? 'مخطط الإيرادات سيظهر هنا' : 'Revenue chart will be displayed here'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'التفضيلات' : 'Account Preferences'}</CardTitle>
              <CardDescription>
                {isRTL ? 'تخصيص إعدادات حسابك وتفضيلاتك' : 'Customize your account settings and preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'اللغة المفضلة' : 'Preferred Language'}</Label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={accountInfo.preferences.language}
                    disabled={!editing}
                    onChange={(e) => setAccountInfo(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        language: e.target.value as 'en' | 'ar'
                      }
                    }))}
                  >
                    <option value="en">{isRTL ? 'الإنجليزية' : 'English'}</option>
                    <option value="ar">{isRTL ? 'العربية' : 'Arabic'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'العملة المفضلة' : 'Preferred Currency'}</Label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={accountInfo.preferences.currency}
                    disabled={!editing}
                    onChange={(e) => setAccountInfo(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        currency: e.target.value as 'SAR' | 'USD' | 'EUR'
                      }
                    }))}
                  >
                    <option value="SAR">SAR - {isRTL ? 'ريال سعودي' : 'Saudi Riyal'}</option>
                    <option value="USD">USD - {isRTL ? 'دولار أمريكي' : 'US Dollar'}</option>
                    <option value="EUR">EUR - {isRTL ? 'يورو' : 'Euro'}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isRTL ? 'المنطقة الزمنية' : 'Timezone'}</Label>
                <Input
                  value={accountInfo.preferences.timezone}
                  disabled={!editing}
                  onChange={(e) => setAccountInfo(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      timezone: e.target.value
                    }
                  }))}
                />
              </div>

              {/* Notification preferences would be handled in separate notifications section */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {isRTL ? 'لإدارة إعدادات الإشعارات، انتقل إلى قسم الإعدادات' : 'To manage notification preferences, go to Settings section'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileAccount