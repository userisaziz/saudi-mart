import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, Building, User, MapPin, Shield, Mail, Phone, Hash, CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
import { 
  SaudiUser, 
  UserRole, 
  UserStatus, 
  VerificationLevel,
  SaudiRegion,
  BusinessType,
  BusinessVerificationStatus,
  SaudiBusinessInfo,
  SaudiAddress
} from '@/admin/types/saudi-admin';
import { UsersService } from '@/admin/services/users.service';

interface BuyerFormData {
  // Personal Information
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string;
  nationalId?: string;
  iqamaNumber?: string;
  
  // Business Information (optional for buyers)
  isBusinessAccount: boolean;
  businessNameAr?: string;
  businessNameEn?: string;
  commercialRegistration?: string;
  vatNumber?: string;
  businessType?: BusinessType;
  
  // Address Information
  addressType: 'home' | 'business';
  buildingNumber: string;
  streetNameAr: string;
  streetNameEn: string;
  districtAr: string;
  districtEn: string;
  cityAr: string;
  cityEn: string;
  region: SaudiRegion;
  postalCode: string;
  additionalNumber: string;
  
  // Account Settings
  status: UserStatus;
  verificationLevel: VerificationLevel;
  language: 'ar' | 'en';
  prayerTimeNotifications: boolean;
  hijriCalendar: boolean;
  
  // Admin Notes
  adminNotes?: string;
}

const BuyersCreateEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<SaudiUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BuyerFormData>();

  const watchIsBusinessAccount = watch('isBusinessAccount');

  useEffect(() => {
    if (isEditing) {
      loadUser();
    } else {
      // Set default values for new buyers
      setValue('status', UserStatus.ACTIVE);
      setValue('verificationLevel', VerificationLevel.UNVERIFIED);
      setValue('language', 'ar');
      setValue('prayerTimeNotifications', true);
      setValue('hijriCalendar', true);
      setValue('addressType', 'home');
      setValue('isBusinessAccount', false);
    }
  }, [id, isEditing, setValue]);

  const loadUser = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const user = await UsersService.getUserById(id);
      if (user) {
        setCurrentUser(user);
        populateFormWithUserData(user);
      } else {
        setError('Buyer not found');
      }
    } catch (err) {
      setError('Failed to load buyer information');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateFormWithUserData = (user: SaudiUser) => {
    setValue('nameAr', user.name.ar);
    setValue('nameEn', user.name.en);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('nationalId', user.nationalId || '');
    setValue('iqamaNumber', user.iqamaNumber || '');
    
    setValue('isBusinessAccount', !!user.businessInfo);
    if (user.businessInfo) {
      setValue('businessNameAr', user.businessInfo.businessNameAr);
      setValue('businessNameEn', user.businessInfo.businessNameEn);
      setValue('commercialRegistration', user.businessInfo.commercialRegistration);
      setValue('vatNumber', user.businessInfo.vatNumber || '');
      setValue('businessType', user.businessInfo.businessType);
    }
    
    if (user.addresses.length > 0) {
      const address = user.addresses[0];
      setValue('addressType', address.type);
      setValue('buildingNumber', address.buildingNumber);
      setValue('streetNameAr', address.streetName.ar);
      setValue('streetNameEn', address.streetName.en);
      setValue('districtAr', address.district.ar);
      setValue('districtEn', address.district.en);
      setValue('cityAr', address.city.ar);
      setValue('cityEn', address.city.en);
      setValue('region', address.region);
      setValue('postalCode', address.postalCode);
      setValue('additionalNumber', address.additionalNumber);
    }
    
    setValue('status', user.status);
    setValue('verificationLevel', user.verificationLevel);
    setValue('language', user.preferences.language);
    setValue('prayerTimeNotifications', user.preferences.prayerTimeNotifications);
    setValue('hijriCalendar', user.preferences.hijriCalendar);
  };

  const onSubmit = async (data: BuyerFormData) => {
    setSaveLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const userData: Partial<SaudiUser> = {
        name: {
          ar: data.nameAr,
          en: data.nameEn
        },
        email: data.email,
        phone: data.phone,
        nationalId: data.nationalId || undefined,
        iqamaNumber: data.iqamaNumber || undefined,
        role: UserRole.BUYER,
        status: data.status,
        verificationLevel: data.verificationLevel,
        businessInfo: data.isBusinessAccount ? {
          businessNameAr: data.businessNameAr!,
          businessNameEn: data.businessNameEn!,
          commercialRegistration: data.commercialRegistration!,
          vatNumber: data.vatNumber,
          businessType: data.businessType!,
          isActive: true,
          verificationStatus: BusinessVerificationStatus.PENDING
        } : undefined,
        addresses: [{
          id: isEditing ? currentUser?.addresses[0]?.id || 'new' : 'new',
          type: data.addressType,
          buildingNumber: data.buildingNumber,
          streetName: {
            ar: data.streetNameAr,
            en: data.streetNameEn
          },
          district: {
            ar: data.districtAr,
            en: data.districtEn
          },
          city: {
            ar: data.cityAr,
            en: data.cityEn
          },
          region: data.region,
          postalCode: data.postalCode,
          additionalNumber: data.additionalNumber,
          isDefault: true
        }],
        preferences: {
          language: data.language,
          timezone: 'Asia/Riyadh',
          prayerTimeNotifications: data.prayerTimeNotifications,
          hijriCalendar: data.hijriCalendar
        }
      };

      let result;
      if (isEditing && id) {
        result = await UsersService.updateUser(id, userData);
      } else {
        result = await UsersService.createUser(userData);
      }

      if (result) {
        setSuccess(isEditing ? 'Buyer updated successfully!' : 'Buyer created successfully!');
        if (!isEditing) {
          // Redirect to edit mode after creation
          navigate(`/admin/buyers/${result.id}/edit`);
        }
      }
    } catch (err) {
      setError('Failed to save buyer information');
      console.error('Error saving user:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/buyers')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Buyers
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Buyer' : 'Create New Buyer'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing 
                ? `Update buyer account information and settings`
                : 'Create a new buyer account in the system'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && currentUser && (
            <Badge variant={currentUser.status === UserStatus.ACTIVE ? 'default' : 'secondary'}>
              {currentUser.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
              <Building className="h-4 w-4" />
              Business Info
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Shield className="h-4 w-4" />
              Account Settings
            </TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Enter the buyer's personal details and identification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameAr">Arabic Name *</Label>
                    <Input
                      id="nameAr"
                      {...register('nameAr', { required: 'Arabic name is required' })}
                      placeholder="الاسم بالعربية"
                      className="text-right"
                      dir="rtl"
                    />
                    {errors.nameAr && (
                      <p className="text-sm text-destructive">{errors.nameAr.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">English Name *</Label>
                    <Input
                      id="nameEn"
                      {...register('nameEn', { required: 'English name is required' })}
                      placeholder="Name in English"
                    />
                    {errors.nameEn && (
                      <p className="text-sm text-destructive">{errors.nameEn.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="buyer@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\+966[0-9]{9}$/,
                          message: 'Enter valid Saudi phone number (+966xxxxxxxxx)'
                        }
                      })}
                      placeholder="+966501234567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      National ID (Saudi Citizens)
                    </Label>
                    <Input
                      id="nationalId"
                      {...register('nationalId', {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'National ID must be 10 digits'
                        }
                      })}
                      placeholder="1234567890"
                      maxLength={10}
                    />
                    {errors.nationalId && (
                      <p className="text-sm text-destructive">{errors.nationalId.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="iqamaNumber" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Iqama Number (Residents)
                    </Label>
                    <Input
                      id="iqamaNumber"
                      {...register('iqamaNumber', {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Iqama number must be 10 digits'
                        }
                      })}
                      placeholder="2234567890"
                      maxLength={10}
                    />
                    {errors.iqamaNumber && (
                      <p className="text-sm text-destructive">{errors.iqamaNumber.message}</p>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Note: Either National ID (for Saudi citizens) or Iqama Number (for residents) should be provided for verification purposes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Information */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Optional business account settings for corporate buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="isBusinessAccount">Business Account</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable if this is a business or corporate buyer account
                    </p>
                  </div>
                  <Switch
                    id="isBusinessAccount"
                    {...register('isBusinessAccount')}
                    onCheckedChange={(checked) => setValue('isBusinessAccount', checked)}
                  />
                </div>

                {watchIsBusinessAccount && (
                  <div className="space-y-6 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessNameAr">Business Name (Arabic) *</Label>
                        <Input
                          id="businessNameAr"
                          {...register('businessNameAr', { 
                            required: watchIsBusinessAccount ? 'Business name in Arabic is required' : false 
                          })}
                          placeholder="اسم الشركة بالعربية"
                          className="text-right"
                          dir="rtl"
                        />
                        {errors.businessNameAr && (
                          <p className="text-sm text-destructive">{errors.businessNameAr.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessNameEn">Business Name (English) *</Label>
                        <Input
                          id="businessNameEn"
                          {...register('businessNameEn', { 
                            required: watchIsBusinessAccount ? 'Business name in English is required' : false 
                          })}
                          placeholder="Company Name in English"
                        />
                        {errors.businessNameEn && (
                          <p className="text-sm text-destructive">{errors.businessNameEn.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="commercialRegistration">Commercial Registration *</Label>
                        <Input
                          id="commercialRegistration"
                          {...register('commercialRegistration', { 
                            required: watchIsBusinessAccount ? 'Commercial registration is required' : false,
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'CR must be 10 digits'
                            }
                          })}
                          placeholder="1234567890"
                          maxLength={10}
                        />
                        {errors.commercialRegistration && (
                          <p className="text-sm text-destructive">{errors.commercialRegistration.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vatNumber">VAT Number</Label>
                        <Input
                          id="vatNumber"
                          {...register('vatNumber', {
                            pattern: {
                              value: /^[0-9]{15}$/,
                              message: 'VAT number must be 15 digits'
                            }
                          })}
                          placeholder="300123456789003"
                          maxLength={15}
                        />
                        {errors.vatNumber && (
                          <p className="text-sm text-destructive">{errors.vatNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select onValueChange={(value) => setValue('businessType', value as BusinessType)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BusinessType.INDIVIDUAL}>Individual</SelectItem>
                          <SelectItem value={BusinessType.COMPANY}>Company</SelectItem>
                          <SelectItem value={BusinessType.PARTNERSHIP}>Partnership</SelectItem>
                          <SelectItem value={BusinessType.LLC}>LLC</SelectItem>
                          <SelectItem value={BusinessType.CORPORATION}>Corporation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Information */}
          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
                <CardDescription>
                  Primary address for the buyer account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="addressType">Address Type</Label>
                  <Select onValueChange={(value) => setValue('addressType', value as 'home' | 'business')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select address type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Address</SelectItem>
                      <SelectItem value="business">Business Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buildingNumber">Building Number *</Label>
                    <Input
                      id="buildingNumber"
                      {...register('buildingNumber', { required: 'Building number is required' })}
                      placeholder="1234"
                    />
                    {errors.buildingNumber && (
                      <p className="text-sm text-destructive">{errors.buildingNumber.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalNumber">Additional Number *</Label>
                    <Input
                      id="additionalNumber"
                      {...register('additionalNumber', { required: 'Additional number is required' })}
                      placeholder="5678"
                    />
                    {errors.additionalNumber && (
                      <p className="text-sm text-destructive">{errors.additionalNumber.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      {...register('postalCode', { 
                        required: 'Postal code is required',
                        pattern: {
                          value: /^[0-9]{5}$/,
                          message: 'Postal code must be 5 digits'
                        }
                      })}
                      placeholder="12345"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streetNameAr">Street Name (Arabic) *</Label>
                    <Input
                      id="streetNameAr"
                      {...register('streetNameAr', { required: 'Street name in Arabic is required' })}
                      placeholder="اسم الشارع"
                      className="text-right"
                      dir="rtl"
                    />
                    {errors.streetNameAr && (
                      <p className="text-sm text-destructive">{errors.streetNameAr.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="streetNameEn">Street Name (English) *</Label>
                    <Input
                      id="streetNameEn"
                      {...register('streetNameEn', { required: 'Street name in English is required' })}
                      placeholder="Street Name"
                    />
                    {errors.streetNameEn && (
                      <p className="text-sm text-destructive">{errors.streetNameEn.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="districtAr">District (Arabic) *</Label>
                    <Input
                      id="districtAr"
                      {...register('districtAr', { required: 'District in Arabic is required' })}
                      placeholder="اسم الحي"
                      className="text-right"
                      dir="rtl"
                    />
                    {errors.districtAr && (
                      <p className="text-sm text-destructive">{errors.districtAr.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="districtEn">District (English) *</Label>
                    <Input
                      id="districtEn"
                      {...register('districtEn', { required: 'District in English is required' })}
                      placeholder="District Name"
                    />
                    {errors.districtEn && (
                      <p className="text-sm text-destructive">{errors.districtEn.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cityAr">City (Arabic) *</Label>
                    <Input
                      id="cityAr"
                      {...register('cityAr', { required: 'City in Arabic is required' })}
                      placeholder="اسم المدينة"
                      className="text-right"
                      dir="rtl"
                    />
                    {errors.cityAr && (
                      <p className="text-sm text-destructive">{errors.cityAr.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cityEn">City (English) *</Label>
                    <Input
                      id="cityEn"
                      {...register('cityEn', { required: 'City in English is required' })}
                      placeholder="City Name"
                    />
                    {errors.cityEn && (
                      <p className="text-sm text-destructive">{errors.cityEn.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select onValueChange={(value) => setValue('region', value as SaudiRegion)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SaudiRegion.RIYADH}>Riyadh - الرياض</SelectItem>
                      <SelectItem value={SaudiRegion.MAKKAH}>Makkah - مكة المكرمة</SelectItem>
                      <SelectItem value={SaudiRegion.EASTERN}>Eastern Province - المنطقة الشرقية</SelectItem>
                      <SelectItem value={SaudiRegion.ASIR}>Asir - عسير</SelectItem>
                      <SelectItem value={SaudiRegion.JAZAN}>Jazan - جازان</SelectItem>
                      <SelectItem value={SaudiRegion.MADINAH}>Madinah - المدينة المنورة</SelectItem>
                      <SelectItem value={SaudiRegion.QASSIM}>Qassim - القصيم</SelectItem>
                      <SelectItem value={SaudiRegion.HAIL}>Hail - حائل</SelectItem>
                      <SelectItem value={SaudiRegion.TABUK}>Tabuk - تبوك</SelectItem>
                      <SelectItem value={SaudiRegion.NORTHERN_BORDERS}>Northern Borders - الحدود الشمالية</SelectItem>
                      <SelectItem value={SaudiRegion.NAJRAN}>Najran - نجران</SelectItem>
                      <SelectItem value={SaudiRegion.AL_BAHAH}>Al Bahah - الباحة</SelectItem>
                      <SelectItem value={SaudiRegion.AL_JAWF}>Al Jawf - الجوف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Configure account status, verification level, and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Account Status</Label>
                    <Select onValueChange={(value) => setValue('status', value as UserStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                        <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                        <SelectItem value={UserStatus.PENDING}>Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verificationLevel">Verification Level</Label>
                    <Select onValueChange={(value) => setValue('verificationLevel', value as VerificationLevel)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={VerificationLevel.UNVERIFIED}>Unverified</SelectItem>
                        <SelectItem value={VerificationLevel.EMAIL_VERIFIED}>Email Verified</SelectItem>
                        <SelectItem value={VerificationLevel.PHONE_VERIFIED}>Phone Verified</SelectItem>
                        <SelectItem value={VerificationLevel.IDENTITY_VERIFIED}>Identity Verified</SelectItem>
                        <SelectItem value={VerificationLevel.BUSINESS_VERIFIED}>Business Verified</SelectItem>
                        <SelectItem value={VerificationLevel.FULLY_VERIFIED}>Fully Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>User Preferences</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select onValueChange={(value) => setValue('language', value as 'ar' | 'en')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">Arabic - العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="prayerTimeNotifications">Prayer Time Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send prayer time reminders to the user
                      </p>
                    </div>
                    <Switch
                      id="prayerTimeNotifications"
                      {...register('prayerTimeNotifications')}
                      onCheckedChange={(checked) => setValue('prayerTimeNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="hijriCalendar">Hijri Calendar</Label>
                      <p className="text-sm text-muted-foreground">
                        Use Islamic calendar alongside Gregorian calendar
                      </p>
                    </div>
                    <Switch
                      id="hijriCalendar"
                      {...register('hijriCalendar')}
                      onCheckedChange={(checked) => setValue('hijriCalendar', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    {...register('adminNotes')}
                    placeholder="Add any administrative notes about this buyer account..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/buyers')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveLoading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {saveLoading 
                  ? (isEditing ? 'Updating...' : 'Creating...')
                  : (isEditing ? 'Update Buyer' : 'Create Buyer')
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default BuyersCreateEdit;