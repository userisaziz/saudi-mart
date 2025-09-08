import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { 
  SaudiUser, 
  UserRole, 
  UserStatus, 
  VerificationLevel,
  SaudiRegion,
  BusinessType,
  BusinessVerificationStatus 
} from '@/admin/types/saudi-admin';
import { UsersService } from '@/admin/services/users.service';

export default function CreateEditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Basic Information
    email: '',
    phone: '',
    nationalId: '',
    iqamaNumber: '',
    nameAr: '',
    nameEn: '',
    role: UserRole.BUYER,
    status: UserStatus.PENDING,
    
    // Business Information
    hasBusinessInfo: false,
    commercialRegistration: '',
    vatNumber: '',
    businessNameAr: '',
    businessNameEn: '',
    businessType: BusinessType.INDIVIDUAL,
    samaLicense: '',
    establishmentCard: '',
    
    // Address Information
    buildingNumber: '',
    streetNameAr: '',
    streetNameEn: '',
    districtAr: '',
    districtEn: '',
    cityAr: '',
    cityEn: '',
    region: SaudiRegion.RIYADH,
    postalCode: '',
    additionalNumber: '',
    
    // Preferences
    language: 'ar' as 'ar' | 'en',
    prayerTimeNotifications: true,
    hijriCalendar: true
  });

  useEffect(() => {
    if (isEdit && id) {
      loadUser(id);
    }
  }, [isEdit, id]);

  const loadUser = async (userId: string) => {
    setLoading(true);
    try {
      const user = await UsersService.getUserById(userId);
      if (user) {
        setFormData({
          email: user.email,
          phone: user.phone,
          nationalId: user.nationalId || '',
          iqamaNumber: user.iqamaNumber || '',
          nameAr: user.name.ar,
          nameEn: user.name.en,
          role: user.role,
          status: user.status,
          
          hasBusinessInfo: Boolean(user.businessInfo),
          commercialRegistration: user.businessInfo?.commercialRegistration || '',
          vatNumber: user.businessInfo?.vatNumber || '',
          businessNameAr: user.businessInfo?.businessNameAr || '',
          businessNameEn: user.businessInfo?.businessNameEn || '',
          businessType: user.businessInfo?.businessType || BusinessType.INDIVIDUAL,
          samaLicense: user.businessInfo?.samaLicense || '',
          establishmentCard: user.businessInfo?.establishmentCard || '',
          
          buildingNumber: user.addresses[0]?.buildingNumber || '',
          streetNameAr: user.addresses[0]?.streetName.ar || '',
          streetNameEn: user.addresses[0]?.streetName.en || '',
          districtAr: user.addresses[0]?.district.ar || '',
          districtEn: user.addresses[0]?.district.en || '',
          cityAr: user.addresses[0]?.city.ar || '',
          cityEn: user.addresses[0]?.city.en || '',
          region: user.addresses[0]?.region || SaudiRegion.RIYADH,
          postalCode: user.addresses[0]?.postalCode || '',
          additionalNumber: user.addresses[0]?.additionalNumber || '',
          
          language: user.preferences.language,
          prayerTimeNotifications: user.preferences.prayerTimeNotifications,
          hijriCalendar: user.preferences.hijriCalendar
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.nameAr) newErrors.nameAr = 'الاسم باللغة العربية مطلوب';
    if (!formData.nameEn) newErrors.nameEn = 'الاسم باللغة الإنجليزية مطلوب';

    // Saudi ID validation
    if (!formData.nationalId && !formData.iqamaNumber) {
      newErrors.identity = 'يجب إدخال رقم الهوية الوطنية أو الإقامة';
    }

    // Business information validation
    if (formData.hasBusinessInfo) {
      if (!formData.commercialRegistration) {
        newErrors.commercialRegistration = 'السجل التجاري مطلوب للأعمال';
      }
      if (!formData.businessNameAr) {
        newErrors.businessNameAr = 'اسم الشركة باللغة العربية مطلوب';
      }
      if (!formData.businessNameEn) {
        newErrors.businessNameEn = 'اسم الشركة باللغة الإنجليزية مطلوب';
      }
    }

    // Address validation
    if (!formData.buildingNumber) newErrors.buildingNumber = 'رقم المبنى مطلوب';
    if (!formData.streetNameAr) newErrors.streetNameAr = 'اسم الشارع باللغة العربية مطلوب';
    if (!formData.cityAr) newErrors.cityAr = 'اسم المدينة باللغة العربية مطلوب';
    if (!formData.postalCode) newErrors.postalCode = 'الرمز البريدي مطلوب';
    if (!formData.additionalNumber) newErrors.additionalNumber = 'الرقم الإضافي مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const userData: Partial<SaudiUser> = {
        email: formData.email,
        phone: formData.phone,
        nationalId: formData.nationalId || undefined,
        iqamaNumber: formData.iqamaNumber || undefined,
        name: {
          ar: formData.nameAr,
          en: formData.nameEn
        },
        role: formData.role,
        status: formData.status,
        businessInfo: formData.hasBusinessInfo ? {
          commercialRegistration: formData.commercialRegistration,
          vatNumber: formData.vatNumber || undefined,
          businessNameAr: formData.businessNameAr,
          businessNameEn: formData.businessNameEn,
          businessType: formData.businessType,
          samaLicense: formData.samaLicense || undefined,
          establishmentCard: formData.establishmentCard || undefined,
          isActive: true,
          verificationStatus: BusinessVerificationStatus.PENDING
        } : undefined,
        addresses: [{
          id: '1',
          type: 'home' as const,
          buildingNumber: formData.buildingNumber,
          streetName: {
            ar: formData.streetNameAr,
            en: formData.streetNameEn || formData.streetNameAr
          },
          district: {
            ar: formData.districtAr,
            en: formData.districtEn || formData.districtAr
          },
          city: {
            ar: formData.cityAr,
            en: formData.cityEn || formData.cityAr
          },
          region: formData.region,
          postalCode: formData.postalCode,
          additionalNumber: formData.additionalNumber,
          isDefault: true
        }],
        preferences: {
          language: formData.language,
          timezone: 'Asia/Riyadh',
          prayerTimeNotifications: formData.prayerTimeNotifications,
          hijriCalendar: formData.hijriCalendar
        }
      };

      if (isEdit && id) {
        await UsersService.updateUser(id, userData);
      } else {
        await UsersService.createUser(userData);
      }

      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'حدث خطأ أثناء حفظ البيانات' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4" />
          العودة
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'تحديث بيانات المستخدم' : 'إنشاء حساب مستخدم جديد'}
          </p>
        </div>
      </div>

      {errors.submit && (
        <Alert variant="destructive">
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
            <TabsTrigger value="business">بيانات الأعمال</TabsTrigger>
            <TabsTrigger value="address">العنوان</TabsTrigger>
            <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>البيانات الأساسية</CardTitle>
                <CardDescription>معلومات المستخدم الأساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="user@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+966501234567"
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">الاسم (عربي) *</Label>
                    <Input
                      id="nameAr"
                      value={formData.nameAr}
                      onChange={(e) => handleInputChange('nameAr', e.target.value)}
                      placeholder="أحمد محمد"
                      dir="rtl"
                    />
                    {errors.nameAr && <p className="text-sm text-red-500">{errors.nameAr}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameEn">الاسم (إنجليزي) *</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => handleInputChange('nameEn', e.target.value)}
                      placeholder="Ahmed Mohammed"
                      dir="ltr"
                    />
                    {errors.nameEn && <p className="text-sm text-red-500">{errors.nameEn}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">رقم الهوية الوطنية</Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="iqamaNumber">رقم الإقامة</Label>
                    <Input
                      id="iqamaNumber"
                      value={formData.iqamaNumber}
                      onChange={(e) => handleInputChange('iqamaNumber', e.target.value)}
                      placeholder="2234567890"
                    />
                  </div>
                </div>

                {errors.identity && <p className="text-sm text-red-500">{errors.identity}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">الدور</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value: UserRole) => handleInputChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.BUYER}>مشتري</SelectItem>
                        <SelectItem value={UserRole.SELLER}>بائع</SelectItem>
                        <SelectItem value={UserRole.SUPPORT}>دعم فني</SelectItem>
                        <SelectItem value={UserRole.MODERATOR}>مشرف</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>مدير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: UserStatus) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserStatus.PENDING}>في الانتظار</SelectItem>
                        <SelectItem value={UserStatus.ACTIVE}>نشط</SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>غير نشط</SelectItem>
                        <SelectItem value={UserStatus.SUSPENDED}>موقوف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>بيانات الأعمال</CardTitle>
                <CardDescription>معلومات الأعمال والشركة (اختياري)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="hasBusinessInfo"
                    checked={formData.hasBusinessInfo}
                    onCheckedChange={(checked) => handleInputChange('hasBusinessInfo', checked)}
                  />
                  <Label htmlFor="hasBusinessInfo">لديه معلومات أعمال</Label>
                </div>

                {formData.hasBusinessInfo && (
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="commercialRegistration">السجل التجاري *</Label>
                        <Input
                          id="commercialRegistration"
                          value={formData.commercialRegistration}
                          onChange={(e) => handleInputChange('commercialRegistration', e.target.value)}
                          placeholder="CR-1234567890"
                        />
                        {errors.commercialRegistration && 
                          <p className="text-sm text-red-500">{errors.commercialRegistration}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vatNumber">رقم الضريبة المضافة</Label>
                        <Input
                          id="vatNumber"
                          value={formData.vatNumber}
                          onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                          placeholder="VAT-300123456789"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessNameAr">اسم الشركة (عربي) *</Label>
                        <Input
                          id="businessNameAr"
                          value={formData.businessNameAr}
                          onChange={(e) => handleInputChange('businessNameAr', e.target.value)}
                          placeholder="شركة التجارة المحدودة"
                          dir="rtl"
                        />
                        {errors.businessNameAr && 
                          <p className="text-sm text-red-500">{errors.businessNameAr}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessNameEn">اسم الشركة (إنجليزي) *</Label>
                        <Input
                          id="businessNameEn"
                          value={formData.businessNameEn}
                          onChange={(e) => handleInputChange('businessNameEn', e.target.value)}
                          placeholder="Trading Company Ltd"
                          dir="ltr"
                        />
                        {errors.businessNameEn && 
                          <p className="text-sm text-red-500">{errors.businessNameEn}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">نوع الشركة</Label>
                        <Select 
                          value={formData.businessType} 
                          onValueChange={(value: BusinessType) => handleInputChange('businessType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={BusinessType.INDIVIDUAL}>فردي</SelectItem>
                            <SelectItem value={BusinessType.COMPANY}>شركة</SelectItem>
                            <SelectItem value={BusinessType.PARTNERSHIP}>شراكة</SelectItem>
                            <SelectItem value={BusinessType.LLC}>شركة محدودة</SelectItem>
                            <SelectItem value={BusinessType.CORPORATION}>مؤسسة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="samaLicense">ترخيص ساما</Label>
                        <Input
                          id="samaLicense"
                          value={formData.samaLicense}
                          onChange={(e) => handleInputChange('samaLicense', e.target.value)}
                          placeholder="SAMA-123456"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="establishmentCard">بطاقة المنشأة</Label>
                        <Input
                          id="establishmentCard"
                          value={formData.establishmentCard}
                          onChange={(e) => handleInputChange('establishmentCard', e.target.value)}
                          placeholder="EST-789012"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>عنوان المستخدم</CardTitle>
                <CardDescription>العنوان الوطني السعودي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buildingNumber">رقم المبنى *</Label>
                    <Input
                      id="buildingNumber"
                      value={formData.buildingNumber}
                      onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                      placeholder="1234"
                    />
                    {errors.buildingNumber && 
                      <p className="text-sm text-red-500">{errors.buildingNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">الرمز البريدي *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="12345"
                    />
                    {errors.postalCode && 
                      <p className="text-sm text-red-500">{errors.postalCode}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNumber">الرقم الإضافي *</Label>
                    <Input
                      id="additionalNumber"
                      value={formData.additionalNumber}
                      onChange={(e) => handleInputChange('additionalNumber', e.target.value)}
                      placeholder="5678"
                    />
                    {errors.additionalNumber && 
                      <p className="text-sm text-red-500">{errors.additionalNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streetNameAr">اسم الشارع (عربي) *</Label>
                    <Input
                      id="streetNameAr"
                      value={formData.streetNameAr}
                      onChange={(e) => handleInputChange('streetNameAr', e.target.value)}
                      placeholder="شارع الملك فهد"
                      dir="rtl"
                    />
                    {errors.streetNameAr && 
                      <p className="text-sm text-red-500">{errors.streetNameAr}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="streetNameEn">اسم الشارع (إنجليزي)</Label>
                    <Input
                      id="streetNameEn"
                      value={formData.streetNameEn}
                      onChange={(e) => handleInputChange('streetNameEn', e.target.value)}
                      placeholder="King Fahd Street"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="districtAr">الحي (عربي)</Label>
                    <Input
                      id="districtAr"
                      value={formData.districtAr}
                      onChange={(e) => handleInputChange('districtAr', e.target.value)}
                      placeholder="العليا"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="districtEn">الحي (إنجليزي)</Label>
                    <Input
                      id="districtEn"
                      value={formData.districtEn}
                      onChange={(e) => handleInputChange('districtEn', e.target.value)}
                      placeholder="Al Olaya"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cityAr">المدينة (عربي) *</Label>
                    <Input
                      id="cityAr"
                      value={formData.cityAr}
                      onChange={(e) => handleInputChange('cityAr', e.target.value)}
                      placeholder="الرياض"
                      dir="rtl"
                    />
                    {errors.cityAr && <p className="text-sm text-red-500">{errors.cityAr}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cityEn">المدينة (إنجليزي)</Label>
                    <Input
                      id="cityEn"
                      value={formData.cityEn}
                      onChange={(e) => handleInputChange('cityEn', e.target.value)}
                      placeholder="Riyadh"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">المنطقة</Label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(value: SaudiRegion) => handleInputChange('region', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SaudiRegion.RIYADH}>الرياض</SelectItem>
                        <SelectItem value={SaudiRegion.MAKKAH}>مكة المكرمة</SelectItem>
                        <SelectItem value={SaudiRegion.EASTERN}>المنطقة الشرقية</SelectItem>
                        <SelectItem value={SaudiRegion.ASIR}>عسير</SelectItem>
                        <SelectItem value={SaudiRegion.JAZAN}>جازان</SelectItem>
                        <SelectItem value={SaudiRegion.MADINAH}>المدينة المنورة</SelectItem>
                        <SelectItem value={SaudiRegion.QASSIM}>القصيم</SelectItem>
                        <SelectItem value={SaudiRegion.HAIL}>حائل</SelectItem>
                        <SelectItem value={SaudiRegion.TABUK}>تبوك</SelectItem>
                        <SelectItem value={SaudiRegion.NORTHERN_BORDERS}>الحدود الشمالية</SelectItem>
                        <SelectItem value={SaudiRegion.NAJRAN}>نجران</SelectItem>
                        <SelectItem value={SaudiRegion.AL_BAHAH}>الباحة</SelectItem>
                        <SelectItem value={SaudiRegion.AL_JAWF}>الجوف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تفضيلات المستخدم</CardTitle>
                <CardDescription>الإعدادات والتفضيلات الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">اللغة المفضلة</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value: 'ar' | 'en') => handleInputChange('language', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="prayerTimeNotifications"
                      checked={formData.prayerTimeNotifications}
                      onCheckedChange={(checked) => handleInputChange('prayerTimeNotifications', checked)}
                    />
                    <Label htmlFor="prayerTimeNotifications">تنبيهات أوقات الصلاة</Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="hijriCalendar"
                      checked={formData.hijriCalendar}
                      onCheckedChange={(checked) => handleInputChange('hijriCalendar', checked)}
                    />
                    <Label htmlFor="hijriCalendar">التقويم الهجري</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/users')}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            إلغاء
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEdit ? 'تحديث' : 'إنشاء'} المستخدم
          </Button>
        </div>
      </form>
    </div>
  );
}