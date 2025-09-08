import React, { useState } from 'react'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Store, 
  CreditCard, 
  Truck, 
  Eye,
  EyeOff,
  Save,
  MapPin,
  Clock,
  Phone,
  Mail,
  Building,
  FileText,
  Palette,
  Upload
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Switch } from '@/shared/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'

export default function SellerSettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: 'Ahmed',
    lastName: 'Al-Rashid',
    email: 'ahmed@company.sa',
    phone: '+966 50 123 4567',
    avatar: '',
    
    // Business settings
    businessName: 'Al-Rashid Trading Company',
    businessType: 'LLC',
    crNumber: '1010123456',
    vatNumber: '123456789012345',
    businessDescription: 'Leading supplier of electronic goods and accessories in Saudi Arabia.',
    website: 'https://alrashidtrading.sa',
    
    // Address settings
    street: 'King Fahd Road',
    city: 'Riyadh',
    district: 'Olaya',
    postalCode: '11564',
    country: 'Saudi Arabia',
    
    // Security settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notification settings
    emailNotifications: true,
    smsNotifications: true,
    orderNotifications: true,
    leadNotifications: true,
    marketingEmails: false,
    
    // Shop settings
    shopName: 'Al-Rashid Electronics',
    shopDescription: 'Quality electronics and accessories',
    shopLogo: '',
    shopBanner: '',
    shopTheme: 'blue',
    
    // Business hours
    businessHours: {
      sunday: { isOpen: true, open: '09:00', close: '18:00' },
      monday: { isOpen: true, open: '09:00', close: '18:00' },
      tuesday: { isOpen: true, open: '09:00', close: '18:00' },
      wednesday: { isOpen: true, open: '09:00', close: '18:00' },
      thursday: { isOpen: true, open: '09:00', close: '18:00' },
      friday: { isOpen: false, open: '14:00', close: '18:00' },
      saturday: { isOpen: true, open: '09:00', close: '18:00' },
    },
    
    // Payment settings
    bankName: 'Saudi National Bank',
    accountNumber: '123456789',
    iban: 'SA1234567890123456789',
    beneficiaryName: 'Ahmed Al-Rashid',
    
    // Shipping settings
    defaultShippingCost: '25',
    freeShippingThreshold: '200',
    processingTime: '1-2',
    returnPolicy: '30 days return policy'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleBusinessHourChange = (day: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
  }

  const handleSave = () => {
    // Save settings logic
    console.log('Saving settings:', settings)
  }

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your seller profile and business settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile" className="flex items-center gap-1">
            <User className="w-3 h-3" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1">
            <Building className="w-3 h-3" />
            Business
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="w-3 h-3" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex items-center gap-1">
            <Store className="w-3 h-3" />
            Shop
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Shipping
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a professional profile photo. Max 5MB.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Your business address for shipping and legal purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={settings.street}
                    onChange={(e) => handleSettingChange('street', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => handleSettingChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={settings.district}
                    onChange={(e) => handleSettingChange('district', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={settings.postalCode}
                    onChange={(e) => handleSettingChange('postalCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={settings.country} onValueChange={(value) => handleSettingChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="UAE">United Arab Emirates</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Legal business details and registration information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => handleSettingChange('businessName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={settings.businessType} onValueChange={(value) => handleSettingChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                      <SelectItem value="Individual">Individual Establishment</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="crNumber">CR Number</Label>
                  <Input
                    id="crNumber"
                    value={settings.crNumber}
                    onChange={(e) => handleSettingChange('crNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input
                    id="vatNumber"
                    value={settings.vatNumber}
                    onChange={(e) => handleSettingChange('vatNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleSettingChange('website', e.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={settings.businessDescription}
                    onChange={(e) => handleSettingChange('businessDescription', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your operating hours for customer visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day, index) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label className="font-medium">{dayLabels[index]}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.businessHours[day].isOpen}
                      onCheckedChange={(checked) => handleBusinessHourChange(day, 'isOpen', checked)}
                    />
                    <span className="text-sm">
                      {settings.businessHours[day].isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  {settings.businessHours[day].isOpen && (
                    <>
                      <div>
                        <Input
                          type="time"
                          value={settings.businessHours[day].open}
                          onChange={(e) => handleBusinessHourChange(day, 'open', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <span>to</span>
                      <div>
                        <Input
                          type="time"
                          value={settings.businessHours[day].close}
                          onChange={(e) => handleBusinessHourChange(day, 'close', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={settings.newPassword}
                      onChange={(e) => handleSettingChange('newPassword', e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={settings.confirmPassword}
                    onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Secure your account with SMS verification
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">New orders, cancellations, payments</p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lead Notifications</Label>
                    <p className="text-sm text-muted-foreground">New leads and inquiries</p>
                  </div>
                  <Switch
                    checked={settings.leadNotifications}
                    onCheckedChange={(checked) => handleSettingChange('leadNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Tips, updates, and promotional content</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shop Settings */}
        <TabsContent value="shop" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shop Appearance</CardTitle>
              <CardDescription>Customize how your shop appears to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={settings.shopName}
                  onChange={(e) => handleSettingChange('shopName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="shopDescription">Shop Description</Label>
                <Textarea
                  id="shopDescription"
                  value={settings.shopDescription}
                  onChange={(e) => handleSettingChange('shopDescription', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Shop Logo</Label>
                  <div className="mt-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label>Shop Banner</Label>
                  <div className="mt-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Banner
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200x300px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="shopTheme">Shop Theme</Label>
                <Select value={settings.shopTheme} onValueChange={(value) => handleSettingChange('shopTheme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Details</CardTitle>
              <CardDescription>Your bank account information for receiving payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={settings.bankName}
                    onChange={(e) => handleSettingChange('bankName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={settings.accountNumber}
                    onChange={(e) => handleSettingChange('accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={settings.iban}
                    onChange={(e) => handleSettingChange('iban', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                  <Input
                    id="beneficiaryName"
                    value={settings.beneficiaryName}
                    onChange={(e) => handleSettingChange('beneficiaryName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
              <CardDescription>Set your shipping rates and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultShippingCost">Default Shipping Cost (SAR)</Label>
                  <Input
                    id="defaultShippingCost"
                    value={settings.defaultShippingCost}
                    onChange={(e) => handleSettingChange('defaultShippingCost', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (SAR)</Label>
                  <Input
                    id="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleSettingChange('freeShippingThreshold', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="processingTime">Processing Time (days)</Label>
                  <Input
                    id="processingTime"
                    value={settings.processingTime}
                    onChange={(e) => handleSettingChange('processingTime', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  value={settings.returnPolicy}
                  onChange={(e) => handleSettingChange('returnPolicy', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}