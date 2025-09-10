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
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui'
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Camera,
  Save,
  Lock,
  Mail,
  Phone,
  MapPin,
  Building2,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
} from 'lucide-react'

interface AccountSettings {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string
    jobTitle: string
    department: string
  }
  companyInfo: {
    companyName: string
    companyNameAr: string
    website: string
    description: string
    descriptionAr: string
    address: string
    addressAr: string
    city: string
    country: string
    postalCode: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    orderUpdates: boolean
    marketingEmails: boolean
    weeklyReports: boolean
    systemAlerts: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'verified_buyers'
    showContactInfo: boolean
    showBusinessHours: boolean
    allowDirectMessages: boolean
  }
  security: {
    twoFactorEnabled: boolean
    loginNotifications: boolean
    passwordLastChanged: string
  }
}

const mockAccountSettings: AccountSettings = {
  personalInfo: {
    firstName: 'Ahmed',
    lastName: 'Al-Saudi',
    email: 'ahmed@industrial-solutions.sa',
    phone: '+966 11 234 5678',
    avatar: '/api/placeholder/120/120',
    jobTitle: 'Sales Manager',
    department: 'Sales & Business Development'
  },
  companyInfo: {
    companyName: 'Industrial Solutions Ltd.',
    companyNameAr: 'شركة الحلول الصناعية المحدودة',
    website: 'https://industrial-solutions.sa',
    description: 'Leading supplier of industrial equipment and machinery in Saudi Arabia.',
    descriptionAr: 'المورد الرائد للمعدات والآلات الصناعية في المملكة العربية السعودية.',
    address: '123 King Fahd Road',
    addressAr: '123 طريق الملك فهد',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    postalCode: '12345'
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    systemAlerts: true
  },
  privacy: {
    profileVisibility: 'public',
    showContactInfo: true,
    showBusinessHours: true,
    allowDirectMessages: true
  },
  security: {
    twoFactorEnabled: false,
    loginNotifications: true,
    passwordLastChanged: '2024-01-15'
  }
}

export const ProfileSettings: React.FC = () => {
  const { isRTL } = useLanguage()
  const [activeTab, setActiveTab] = useState('personal')
  const [settings, setSettings] = useState<AccountSettings>(mockAccountSettings)
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const updatePersonalInfo = (field: keyof AccountSettings['personalInfo'], value: string) => {
    setSettings(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const updateCompanyInfo = (field: keyof AccountSettings['companyInfo'], value: string) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const updateNotifications = (field: keyof AccountSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const updatePrivacy = (field: keyof AccountSettings['privacy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const updateSecurity = (field: keyof AccountSettings['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setUnsavedChanges(false)
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="h-6 w-6 mr-3" />
            {isRTL ? 'إعدادات الملف الشخصي' : 'Profile Settings'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'إدارة معلومات حسابك وتفضيلاتك' : 'Manage your account information and preferences'}
          </p>
        </div>
        
        {unsavedChanges && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              {isRTL ? 'تغييرات غير محفوظة' : 'Unsaved changes'}
            </Badge>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">{isRTL ? 'شخصي' : 'Personal'}</TabsTrigger>
          <TabsTrigger value="company">{isRTL ? 'الشركة' : 'Company'}</TabsTrigger>
          <TabsTrigger value="notifications">{isRTL ? 'الإشعارات' : 'Notifications'}</TabsTrigger>
          <TabsTrigger value="privacy">{isRTL ? 'الخصوصية' : 'Privacy'}</TabsTrigger>
          <TabsTrigger value="security">{isRTL ? 'الأمان' : 'Security'}</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'قم بتحديث معلوماتك الشخصية وبيانات الاتصال' : 'Update your personal details and contact information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={settings.personalInfo.avatar} alt="Profile" />
                  <AvatarFallback className="text-xl">
                    {settings.personalInfo.firstName.charAt(0)}
                    {settings.personalInfo.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    {isRTL ? 'تغيير الصورة' : 'Change Photo'}
                  </Button>
                  <p className="text-sm text-gray-600">
                    {isRTL ? 'JPG، PNG أو GIF. الحد الأقصى 2MB' : 'JPG, PNG or GIF. Max size 2MB'}
                  </p>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{isRTL ? 'الاسم الأول' : 'First Name'}</Label>
                  <Input
                    id="firstName"
                    value={settings.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    placeholder={isRTL ? 'أدخل الاسم الأول' : 'Enter first name'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{isRTL ? 'اسم العائلة' : 'Last Name'}</Label>
                  <Input
                    id="lastName"
                    value={settings.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                    placeholder={isRTL ? 'أدخل اسم العائلة' : 'Enter last name'}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={settings.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="pl-10"
                      placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
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
                      value={settings.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="pl-10"
                      placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                    />
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</Label>
                  <Input
                    id="jobTitle"
                    value={settings.personalInfo.jobTitle}
                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    placeholder={isRTL ? 'أدخل المسمى الوظيفي' : 'Enter job title'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{isRTL ? 'القسم' : 'Department'}</Label>
                  <Input
                    id="department"
                    value={settings.personalInfo.department}
                    onChange={(e) => updatePersonalInfo('department', e.target.value)}
                    placeholder={isRTL ? 'أدخل القسم' : 'Enter department'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Information */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                {isRTL ? 'معلومات الشركة' : 'Company Information'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة بيانات شركتك وملفها التجاري' : 'Manage your company details and business profile'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{isRTL ? 'اسم الشركة (إنجليزي)' : 'Company Name (English)'}</Label>
                  <Input
                    id="companyName"
                    value={settings.companyInfo.companyName}
                    onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
                    placeholder="Enter company name in English"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNameAr">{isRTL ? 'اسم الشركة (عربي)' : 'Company Name (Arabic)'}</Label>
                  <Input
                    id="companyNameAr"
                    value={settings.companyInfo.companyNameAr}
                    onChange={(e) => updateCompanyInfo('companyNameAr', e.target.value)}
                    placeholder="أدخل اسم الشركة بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">{isRTL ? 'الموقع الإلكتروني' : 'Website'}</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="website"
                    type="url"
                    value={settings.companyInfo.website}
                    onChange={(e) => updateCompanyInfo('website', e.target.value)}
                    className="pl-10"
                    placeholder="https://company.com"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description">{isRTL ? 'وصف الشركة (إنجليزي)' : 'Company Description (English)'}</Label>
                  <textarea
                    id="description"
                    value={settings.companyInfo.description}
                    onChange={(e) => updateCompanyInfo('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="Describe your company and services in English"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">{isRTL ? 'وصف الشركة (عربي)' : 'Company Description (Arabic)'}</Label>
                  <textarea
                    id="descriptionAr"
                    value={settings.companyInfo.descriptionAr}
                    onChange={(e) => updateCompanyInfo('descriptionAr', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="اكتب وصف الشركة والخدمات بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {isRTL ? 'عنوان الشركة' : 'Company Address'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">{isRTL ? 'العنوان (إنجليزي)' : 'Address (English)'}</Label>
                    <Input
                      id="address"
                      value={settings.companyInfo.address}
                      onChange={(e) => updateCompanyInfo('address', e.target.value)}
                      placeholder="Enter address in English"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressAr">{isRTL ? 'العنوان (عربي)' : 'Address (Arabic)'}</Label>
                    <Input
                      id="addressAr"
                      value={settings.companyInfo.addressAr}
                      onChange={(e) => updateCompanyInfo('addressAr', e.target.value)}
                      placeholder="أدخل العنوان بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{isRTL ? 'المدينة' : 'City'}</Label>
                    <Input
                      id="city"
                      value={settings.companyInfo.city}
                      onChange={(e) => updateCompanyInfo('city', e.target.value)}
                      placeholder={isRTL ? 'أدخل المدينة' : 'Enter city'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{isRTL ? 'البلد' : 'Country'}</Label>
                    <Select
                      value={settings.companyInfo.country}
                      onValueChange={(value) => updateCompanyInfo('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر البلد' : 'Select country'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Saudi Arabia">{isRTL ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</SelectItem>
                        <SelectItem value="UAE">{isRTL ? 'الإمارات العربية المتحدة' : 'UAE'}</SelectItem>
                        <SelectItem value="Kuwait">{isRTL ? 'الكويت' : 'Kuwait'}</SelectItem>
                        <SelectItem value="Qatar">{isRTL ? 'قطر' : 'Qatar'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{isRTL ? 'الرمز البريدي' : 'Postal Code'}</Label>
                    <Input
                      id="postalCode"
                      value={settings.companyInfo.postalCode}
                      onChange={(e) => updateCompanyInfo('postalCode', e.target.value)}
                      placeholder={isRTL ? 'أدخل الرمز البريدي' : 'Enter postal code'}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                {isRTL ? 'إعدادات الإشعارات' : 'Notification Settings'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'اختر كيف ومتى تريد تلقي الإشعارات' : 'Choose how and when you want to receive notifications'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تلقي الإشعارات عبر البريد الإلكتروني' : 'Receive notifications via email'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateNotifications('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'إشعارات الرسائل النصية' : 'SMS Notifications'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تلقي الإشعارات عبر الرسائل النصية' : 'Receive notifications via SMS'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateNotifications('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'تحديثات الطلبات' : 'Order Updates'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'إشعارات حول حالة الطلبات الجديدة والتحديثات' : 'Notifications about new orders and status updates'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) => updateNotifications('orderUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'رسائل التسويق' : 'Marketing Emails'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تلقي رسائل ترويجية ونصائح تسويقية' : 'Receive promotional emails and marketing tips'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => updateNotifications('marketingEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'التقارير الأسبوعية' : 'Weekly Reports'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تقارير أسبوعية عن أداء المبيعات والإحصائيات' : 'Weekly performance reports and analytics'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => updateNotifications('weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'تنبيهات النظام' : 'System Alerts'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'إشعارات حول مشاكل النظام والصيانة' : 'Important system notifications and maintenance alerts'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateNotifications('systemAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                {isRTL ? 'إعدادات الخصوصية' : 'Privacy Settings'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تحكم في مستوى رؤية ملفك الشخصي ومشاركة المعلومات' : 'Control your profile visibility and information sharing'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    {isRTL ? 'رؤية الملف الشخصي' : 'Profile Visibility'}
                  </Label>
                  <p className="text-sm text-gray-600 mb-3">
                    {isRTL ? 'من يمكنه رؤية ملفك الشخصي؟' : 'Who can see your profile?'}
                  </p>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value: 'public' | 'private' | 'verified_buyers') => 
                      updatePrivacy('profileVisibility', value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        {isRTL ? 'عام - يمكن للجميع رؤيته' : 'Public - Visible to everyone'}
                      </SelectItem>
                      <SelectItem value="verified_buyers">
                        {isRTL ? 'المشترين المعتمدين فقط' : 'Verified buyers only'}
                      </SelectItem>
                      <SelectItem value="private">
                        {isRTL ? 'خاص - مخفي عن الجميع' : 'Private - Hidden from everyone'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'إظهار معلومات الاتصال' : 'Show Contact Information'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'السماح للآخرين برؤية بريدك الإلكتروني ورقم الهاتف' : 'Allow others to see your email and phone number'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showContactInfo}
                    onCheckedChange={(checked) => updatePrivacy('showContactInfo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'إظهار ساعات العمل' : 'Show Business Hours'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'عرض ساعات العمل في ملفك الشخصي' : 'Display your business hours on your profile'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showBusinessHours}
                    onCheckedChange={(checked) => updatePrivacy('showBusinessHours', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'السماح بالرسائل المباشرة' : 'Allow Direct Messages'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'السماح للمشترين بإرسال رسائل مباشرة إليك' : 'Allow buyers to send you direct messages'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowDirectMessages}
                    onCheckedChange={(checked) => updatePrivacy('allowDirectMessages', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {isRTL ? 'إعدادات الأمان' : 'Security Settings'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة أمان حسابك وكلمات المرور' : 'Manage your account security and passwords'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'كلمة المرور' : 'Password'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? `آخر تغيير: ${new Date(settings.security.passwordLastChanged).toLocaleDateString('ar-SA')}` : 
                       `Last changed: ${new Date(settings.security.passwordLastChanged).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                  </Button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'إضافة طبقة أمان إضافية لحسابك' : 'Add an extra layer of security to your account'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.security.twoFactorEnabled ? "default" : "secondary"}>
                      {settings.security.twoFactorEnabled ? 
                        (isRTL ? 'مفعل' : 'Enabled') : 
                        (isRTL ? 'غير مفعل' : 'Disabled')
                      }
                    </Badge>
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSecurity('twoFactorEnabled', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Login Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      {isRTL ? 'إشعارات تسجيل الدخول' : 'Login Notifications'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {isRTL ? 'تلقي إشعار عند تسجيل دخول جديد لحسابك' : 'Get notified when someone logs into your account'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginNotifications}
                    onCheckedChange={(checked) => updateSecurity('loginNotifications', checked)}
                  />
                </div>
              </div>

              {/* Account Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium text-red-600">
                        {isRTL ? 'حذف الحساب' : 'Delete Account'}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'حذف دائم لحسابك وجميع البيانات' : 'Permanently delete your account and all data'}
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isRTL ? 'حذف الحساب' : 'Delete Account'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileSettings