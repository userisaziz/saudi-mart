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
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui'
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Users,
  Calendar,
  Award,
  Briefcase,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  RefreshCw,
  Plus,
  X,
  FileText,
  Camera,
  Star,
  Shield,
  Target,
  Truck,
  Package,
} from 'lucide-react'

interface BusinessDetails {
  companyInfo: {
    legalName: string
    tradeName: string
    legalNameAr: string
    tradeNameAr: string
    registrationNumber: string
    taxId: string
    establishedYear: string
    legalForm: string
    industry: string
    subIndustry: string
    description: string
    descriptionAr: string
    logo: string
    coverImage: string
  }
  contactInfo: {
    primaryEmail: string
    secondaryEmail: string
    primaryPhone: string
    secondaryPhone: string
    website: string
    socialMedia: {
      linkedin: string
      twitter: string
      facebook: string
      instagram: string
    }
  }
  addressInfo: {
    headquarters: {
      address: string
      addressAr: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    warehouses: Array<{
      id: string
      name: string
      address: string
      city: string
      isMain: boolean
    }>
    serviceAreas: string[]
  }
  operationalInfo: {
    employeeCount: string
    annualRevenue: string
    businessHours: {
      [key: string]: {
        open: string
        close: string
        isOpen: boolean
      }
    }
    paymentMethods: string[]
    currencies: string[]
    languages: string[]
  }
  certifications: Array<{
    id: string
    name: string
    issuedBy: string
    issuedDate: string
    expiryDate?: string
    verified: boolean
  }>
  bankingInfo: {
    bankName: string
    accountNumber: string
    iban: string
    swiftCode: string
    verified: boolean
  }
}

const mockBusinessDetails: BusinessDetails = {
  companyInfo: {
    legalName: 'Industrial Solutions Limited Company',
    tradeName: 'Industrial Solutions Ltd.',
    legalNameAr: 'شركة الحلول الصناعية المحدودة',
    tradeNameAr: 'الحلول الصناعية المحدودة',
    registrationNumber: 'RC-1234567890',
    taxId: 'TAX-9876543210',
    establishedYear: '2018',
    legalForm: 'Limited Liability Company',
    industry: 'Manufacturing & Industrial Equipment',
    subIndustry: 'Industrial Machinery & Equipment',
    description: 'Leading supplier of industrial equipment and machinery in Saudi Arabia, serving manufacturing and construction industries with high-quality products and exceptional service.',
    descriptionAr: 'المورد الرائد للمعدات والآلات الصناعية في المملكة العربية السعودية، نخدم صناعات التصنيع والإنشاءات بمنتجات عالية الجودة وخدمة استثنائية.',
    logo: '/api/placeholder/120/120',
    coverImage: '/api/placeholder/800/200'
  },
  contactInfo: {
    primaryEmail: 'info@industrial-solutions.sa',
    secondaryEmail: 'sales@industrial-solutions.sa',
    primaryPhone: '+966 11 234 5678',
    secondaryPhone: '+966 50 123 4567',
    website: 'https://industrial-solutions.sa',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/industrial-solutions',
      twitter: 'https://twitter.com/industrialsolutions',
      facebook: 'https://facebook.com/industrialsolutions',
      instagram: 'https://instagram.com/industrialsolutions'
    }
  },
  addressInfo: {
    headquarters: {
      address: '123 King Fahd Road, Al Olaya District',
      addressAr: '123 طريق الملك فهد، حي العليا',
      city: 'Riyadh',
      state: 'Riyadh Province',
      postalCode: '12345',
      country: 'Saudi Arabia'
    },
    warehouses: [
      {
        id: '1',
        name: 'Main Warehouse - Riyadh',
        address: '456 Industrial City, Riyadh',
        city: 'Riyadh',
        isMain: true
      },
      {
        id: '2',
        name: 'Jeddah Distribution Center',
        address: '789 Port Area, Jeddah',
        city: 'Jeddah',
        isMain: false
      }
    ],
    serviceAreas: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina']
  },
  operationalInfo: {
    employeeCount: '50-100',
    annualRevenue: '10M-50M SAR',
    businessHours: {
      sunday: { open: '08:00', close: '17:00', isOpen: true },
      monday: { open: '08:00', close: '17:00', isOpen: true },
      tuesday: { open: '08:00', close: '17:00', isOpen: true },
      wednesday: { open: '08:00', close: '17:00', isOpen: true },
      thursday: { open: '08:00', close: '17:00', isOpen: true },
      friday: { open: '00:00', close: '00:00', isOpen: false },
      saturday: { open: '09:00', close: '13:00', isOpen: true }
    },
    paymentMethods: ['Bank Transfer', 'Cash', 'Credit Card', 'Check'],
    currencies: ['SAR', 'USD'],
    languages: ['Arabic', 'English']
  },
  certifications: [
    {
      id: '1',
      name: 'ISO 9001:2015',
      issuedBy: 'International Organization for Standardization',
      issuedDate: '2023-01-15',
      expiryDate: '2026-01-15',
      verified: true
    },
    {
      id: '2',
      name: 'SABER Certificate',
      issuedBy: 'Saudi Standards Organization',
      issuedDate: '2023-06-01',
      expiryDate: '2024-06-01',
      verified: true
    }
  ],
  bankingInfo: {
    bankName: 'Saudi National Bank',
    accountNumber: '****-****-****-1234',
    iban: 'SA80 1000 0000 0000 0000 1234',
    swiftCode: 'SNBSARI1',
    verified: true
  }
}

export const ProfileBusinessDetails: React.FC = () => {
  const { isRTL } = useLanguage()
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>(mockBusinessDetails)
  const [activeTab, setActiveTab] = useState('company')
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setEditing(null)
  }

  const addWarehouse = () => {
    const newWarehouse = {
      id: Date.now().toString(),
      name: '',
      address: '',
      city: '',
      isMain: false
    }
    setBusinessDetails(prev => ({
      ...prev,
      addressInfo: {
        ...prev.addressInfo,
        warehouses: [...prev.addressInfo.warehouses, newWarehouse]
      }
    }))
  }

  const removeWarehouse = (id: string) => {
    setBusinessDetails(prev => ({
      ...prev,
      addressInfo: {
        ...prev.addressInfo,
        warehouses: prev.addressInfo.warehouses.filter(w => w.id !== id)
      }
    }))
  }

  const updateCompanyInfo = (field: keyof BusinessDetails['companyInfo'], value: string) => {
    setBusinessDetails(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }))
  }

  const formatCurrency = (amount: string) => {
    return amount
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-6 w-6 mr-3" />
            {isRTL ? 'تفاصيل الأعمال' : 'Business Details'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'إدارة معلومات شركتك التجارية والتشغيلية' : 'Manage your company business and operational information'}
          </p>
        </div>
        
        {editing && (
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setEditing(null)}>
              <X className="h-4 w-4 mr-2" />
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
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

      {/* Business Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'سنوات العمل' : 'Years in Business'}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Date().getFullYear() - parseInt(businessDetails.companyInfo.establishedYear)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'عدد الموظفين' : 'Employee Count'}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {businessDetails.operationalInfo.employeeCount}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'الإيرادات السنوية' : 'Annual Revenue'}
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {businessDetails.operationalInfo.annualRevenue}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'الشهادات' : 'Certifications'}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {businessDetails.certifications.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">{isRTL ? 'الشركة' : 'Company'}</TabsTrigger>
          <TabsTrigger value="contact">{isRTL ? 'الاتصال' : 'Contact'}</TabsTrigger>
          <TabsTrigger value="address">{isRTL ? 'العنوان' : 'Address'}</TabsTrigger>
          <TabsTrigger value="operations">{isRTL ? 'العمليات' : 'Operations'}</TabsTrigger>
          <TabsTrigger value="certifications">{isRTL ? 'الشهادات' : 'Certificates'}</TabsTrigger>
          <TabsTrigger value="banking">{isRTL ? 'البنكية' : 'Banking'}</TabsTrigger>
        </TabsList>

        {/* Company Information */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {isRTL ? 'معلومات الشركة' : 'Company Information'}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditing(editing === 'company' ? null : 'company')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editing === 'company' ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'تعديل' : 'Edit')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">
                    {isRTL ? 'شعار الشركة' : 'Company Logo'}
                  </Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {businessDetails.companyInfo.logo ? (
                        <img 
                          src={businessDetails.companyInfo.logo} 
                          alt="Company Logo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    {editing === 'company' && (
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        {isRTL ? 'تغيير الشعار' : 'Change Logo'}
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">
                    {isRTL ? 'صورة الغلاف' : 'Cover Image'}
                  </Label>
                  <div className="mt-2">
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {businessDetails.companyInfo.coverImage ? (
                        <img 
                          src={businessDetails.companyInfo.coverImage} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    {editing === 'company' && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <Camera className="h-4 w-4 mr-2" />
                        {isRTL ? 'تغيير الغلاف' : 'Change Cover'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Legal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'الاسم القانوني (إنجليزي)' : 'Legal Name (English)'}</Label>
                  <Input
                    value={businessDetails.companyInfo.legalName}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('legalName', e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الاسم القانوني (عربي)' : 'Legal Name (Arabic)'}</Label>
                  <Input
                    value={businessDetails.companyInfo.legalNameAr}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('legalNameAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'الاسم التجاري (إنجليزي)' : 'Trade Name (English)'}</Label>
                  <Input
                    value={businessDetails.companyInfo.tradeName}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('tradeName', e.target.value)}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الاسم التجاري (عربي)' : 'Trade Name (Arabic)'}</Label>
                  <Input
                    value={businessDetails.companyInfo.tradeNameAr}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('tradeNameAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Registration Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'رقم السجل التجاري' : 'Registration Number'}</Label>
                  <Input
                    value={businessDetails.companyInfo.registrationNumber}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('registrationNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الرقم الضريبي' : 'Tax ID'}</Label>
                  <Input
                    value={businessDetails.companyInfo.taxId}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('taxId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'سنة التأسيس' : 'Established Year'}</Label>
                  <Input
                    value={businessDetails.companyInfo.establishedYear}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('establishedYear', e.target.value)}
                  />
                </div>
              </div>

              {/* Industry Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'الصناعة الرئيسية' : 'Primary Industry'}</Label>
                  <Input
                    value={businessDetails.companyInfo.industry}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('industry', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'الصناعة الفرعية' : 'Sub Industry'}</Label>
                  <Input
                    value={businessDetails.companyInfo.subIndustry}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('subIndustry', e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'وصف الشركة (إنجليزي)' : 'Company Description (English)'}</Label>
                  <textarea
                    value={businessDetails.companyInfo.description}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    rows={4}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'وصف الشركة (عربي)' : 'Company Description (Arabic)'}</Label>
                  <textarea
                    value={businessDetails.companyInfo.descriptionAr}
                    disabled={editing !== 'company'}
                    onChange={(e) => updateCompanyInfo('descriptionAr', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditing(editing === 'contact' ? null : 'contact')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editing === 'contact' ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'تعديل' : 'Edit')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'البريد الإلكتروني الرئيسي' : 'Primary Email'}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      value={businessDetails.contactInfo.primaryEmail}
                      disabled={editing !== 'contact'}
                      className="pl-10"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'البريد الإلكتروني الثانوي' : 'Secondary Email'}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      value={businessDetails.contactInfo.secondaryEmail}
                      disabled={editing !== 'contact'}
                      className="pl-10"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'رقم الهاتف الرئيسي' : 'Primary Phone'}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="tel"
                      value={businessDetails.contactInfo.primaryPhone}
                      disabled={editing !== 'contact'}
                      className="pl-10"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'رقم الهاتف الثانوي' : 'Secondary Phone'}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="tel"
                      value={businessDetails.contactInfo.secondaryPhone}
                      disabled={editing !== 'contact'}
                      className="pl-10"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label>{isRTL ? 'الموقع الإلكتروني' : 'Website'}</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="url"
                    value={businessDetails.contactInfo.website}
                    disabled={editing !== 'contact'}
                    className="pl-10"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'وسائل التواصل الاجتماعي' : 'Social Media'}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">LinkedIn</Label>
                    <Input
                      value={businessDetails.contactInfo.socialMedia.linkedin}
                      disabled={editing !== 'contact'}
                      placeholder="https://linkedin.com/company/..."
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Twitter</Label>
                    <Input
                      value={businessDetails.contactInfo.socialMedia.twitter}
                      disabled={editing !== 'contact'}
                      placeholder="https://twitter.com/..."
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Facebook</Label>
                    <Input
                      value={businessDetails.contactInfo.socialMedia.facebook}
                      disabled={editing !== 'contact'}
                      placeholder="https://facebook.com/..."
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Instagram</Label>
                    <Input
                      value={businessDetails.contactInfo.socialMedia.instagram}
                      disabled={editing !== 'contact'}
                      placeholder="https://instagram.com/..."
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Information */}
        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {isRTL ? 'معلومات العنوان' : 'Address Information'}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditing(editing === 'address' ? null : 'address')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editing === 'address' ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'تعديل' : 'Edit')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Headquarters */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'المقر الرئيسي' : 'Headquarters'}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'العنوان (إنجليزي)' : 'Address (English)'}</Label>
                    <Input
                      value={businessDetails.addressInfo.headquarters.address}
                      disabled={editing !== 'address'}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'العنوان (عربي)' : 'Address (Arabic)'}</Label>
                    <Input
                      value={businessDetails.addressInfo.headquarters.addressAr}
                      disabled={editing !== 'address'}
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>{isRTL ? 'المدينة' : 'City'}</Label>
                    <Input
                      value={businessDetails.addressInfo.headquarters.city}
                      disabled={editing !== 'address'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'المنطقة' : 'State/Province'}</Label>
                    <Input
                      value={businessDetails.addressInfo.headquarters.state}
                      disabled={editing !== 'address'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'الرمز البريدي' : 'Postal Code'}</Label>
                    <Input
                      value={businessDetails.addressInfo.headquarters.postalCode}
                      disabled={editing !== 'address'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'البلد' : 'Country'}</Label>
                    <Input
                      value={businessDetails.addressInfo.headquarters.country}
                      disabled={editing !== 'address'}
                    />
                  </div>
                </div>
              </div>

              {/* Warehouses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    {isRTL ? 'المستودعات' : 'Warehouses'}
                  </Label>
                  {editing === 'address' && (
                    <Button variant="outline" size="sm" onClick={addWarehouse}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isRTL ? 'إضافة مستودع' : 'Add Warehouse'}
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {businessDetails.addressInfo.warehouses.map((warehouse, index) => (
                    <div key={warehouse.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">
                            {isRTL ? `مستودع ${index + 1}` : `Warehouse ${index + 1}`}
                          </span>
                          {warehouse.isMain && (
                            <Badge className="bg-blue-100 text-blue-800">
                              {isRTL ? 'رئيسي' : 'Main'}
                            </Badge>
                          )}
                        </div>
                        {editing === 'address' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeWarehouse(warehouse.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{isRTL ? 'اسم المستودع' : 'Warehouse Name'}</Label>
                          <Input
                            value={warehouse.name}
                            disabled={editing !== 'address'}
                            placeholder={isRTL ? 'اسم المستودع' : 'Warehouse name'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? 'العنوان' : 'Address'}</Label>
                          <Input
                            value={warehouse.address}
                            disabled={editing !== 'address'}
                            placeholder={isRTL ? 'عنوان المستودع' : 'Warehouse address'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? 'المدينة' : 'City'}</Label>
                          <Input
                            value={warehouse.city}
                            disabled={editing !== 'address'}
                            placeholder={isRTL ? 'المدينة' : 'City'}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'مناطق الخدمة' : 'Service Areas'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {businessDetails.addressInfo.serviceAreas.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
                {editing === 'address' && (
                  <p className="text-sm text-gray-600">
                    {isRTL ? 'أضف أو احذف مناطق الخدمة' : 'Add or remove service areas'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations */}
        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  {isRTL ? 'المعلومات التشغيلية' : 'Operational Information'}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditing(editing === 'operations' ? null : 'operations')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editing === 'operations' ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'تعديل' : 'Edit')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Hours */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'ساعات العمل' : 'Business Hours'}
                </Label>
                <div className="space-y-3">
                  {Object.entries(businessDetails.operationalInfo.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={hours.isOpen}
                          disabled={editing !== 'operations'}
                        />
                        <span className="font-medium capitalize">
                          {isRTL ? 
                            ({ sunday: 'الأحد', monday: 'الإثنين', tuesday: 'الثلاثاء', wednesday: 'الأربعاء', thursday: 'الخميس', friday: 'الجمعة', saturday: 'السبت' }[day as keyof typeof businessDetails.operationalInfo.businessHours]) :
                            day
                          }
                        </span>
                      </div>
                      {hours.isOpen ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={hours.open}
                            disabled={editing !== 'operations'}
                            className="w-24"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={hours.close}
                            disabled={editing !== 'operations'}
                            className="w-24"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {isRTL ? 'مغلق' : 'Closed'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'طرق الدفع المقبولة' : 'Accepted Payment Methods'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {businessDetails.operationalInfo.paymentMethods.map((method, index) => (
                    <Badge key={index} variant="outline">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Currencies */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'العملات المدعومة' : 'Supported Currencies'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {businessDetails.operationalInfo.currencies.map((currency, index) => (
                    <Badge key={index} variant="outline">
                      {currency}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {isRTL ? 'اللغات المدعومة' : 'Supported Languages'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {businessDetails.operationalInfo.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications */}
        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {isRTL ? 'الشهادات والتصاريح' : 'Certifications & Licenses'}
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? 'إضافة شهادة' : 'Add Certificate'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessDetails.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{cert.name}</h4>
                          {cert.verified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {isRTL ? 'معتمد' : 'Verified'}
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              {isRTL ? 'قيد المراجعة' : 'Pending'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{cert.issuedBy}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">
                              {isRTL ? 'تاريخ الإصدار:' : 'Issued Date:'}
                            </span>
                            <span className="ml-1">
                              {new Date(cert.issuedDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                            </span>
                          </div>
                          {cert.expiryDate && (
                            <div>
                              <span className="text-gray-500">
                                {isRTL ? 'تاريخ الانتهاء:' : 'Expiry Date:'}
                              </span>
                              <span className="ml-1">
                                {new Date(cert.expiryDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          {isRTL ? 'عرض' : 'View'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Information */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {isRTL ? 'المعلومات المصرفية' : 'Banking Information'}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {businessDetails.bankingInfo.verified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      {isRTL ? 'محقق' : 'Verified'}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {isRTL ? 'يتطلب التحقق' : 'Requires Verification'}
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    {isRTL ? 'تعديل' : 'Edit'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'اسم البنك' : 'Bank Name'}</Label>
                  <Input value={businessDetails.bankingInfo.bankName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'رقم الحساب' : 'Account Number'}</Label>
                  <Input value={businessDetails.bankingInfo.accountNumber} disabled />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{isRTL ? 'رقم الآيبان' : 'IBAN'}</Label>
                  <Input value={businessDetails.bankingInfo.iban} disabled dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>{isRTL ? 'رمز السويفت' : 'SWIFT Code'}</Label>
                  <Input value={businessDetails.bankingInfo.swiftCode} disabled dir="ltr" />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {isRTL ? 'أمان المعلومات المصرفية' : 'Banking Information Security'}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {isRTL ? 
                        'جميع المعلومات المصرفية محمية بتشفير عالي المستوى ولا تظهر بالكامل لأسباب أمنية.' :
                        'All banking information is protected with high-level encryption and partially hidden for security purposes.'
                      }
                    </p>
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

export default ProfileBusinessDetails