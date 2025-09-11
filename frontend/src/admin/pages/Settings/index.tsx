import React, { useState } from 'react'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Mail, 
  Smartphone, 
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Palette,
  Zap,
  Activity,
  HardDrive,
  Cloud,
  Key,
  Wifi,
  Server,
  BarChart3,
  FileText,
  Download
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
import { Progress } from '@/shared/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'

export default function AdminSettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    // Profile settings
    name: 'Ahmed Al-Rashid',
    email: 'admin@saudiplatform.com',
    phone: '+966 50 123 4567',
    avatar: '',
    title: 'System Administrator',
    department: 'IT Operations',
    
    // Security settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    sessionTimeout: '4',
    passwordExpiry: '90',
    allowMultipleSessions: false,
    requireStrongPasswords: true,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    userNotifications: true,
    systemAlerts: true,
    maintenanceAlerts: true,
    securityAlerts: true,
    
    // System settings
    defaultLanguage: 'ar',
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',
    currency: 'SAR',
    theme: 'light',
    enableDarkMode: false,
    enableRTL: true,
    
    // Performance settings
    cacheEnabled: true,
    compressionEnabled: true,
    cdnEnabled: true,
    
    // Email settings
    smtpHost: 'smtp.saudiplatform.com',
    smtpPort: '587',
    smtpUser: 'noreply@saudiplatform.com',
    smtpPassword: '',
    emailEncryption: 'tls',
    
    // Backup settings
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '30',
    backupLocation: 'cloud',
    compressionLevel: 'medium'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      console.log('Settings saved successfully:', settings)
    }, 2000)
  }

  const systemHealth = {
    uptime: '99.98%',
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45,
    activeUsers: 1247,
    totalTransactions: 15678
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">System Settings</h1>
                <p className="text-blue-100 text-lg">Configure your admin panel and system preferences</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className="bg-white/20 text-white border-white/20">
                    <Activity className="w-4 h-4 mr-2" />
                    System Health: {systemHealth.uptime}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/20">
                    <User className="w-4 h-4 mr-2" />
                    {systemHealth.activeUsers} Active Users
                  </Badge>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Settings className="w-16 h-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">CPU Usage</p>
                  <p className="text-2xl font-bold text-green-700">{systemHealth.cpuUsage}%</p>
                </div>
                <Monitor className="w-8 h-8 text-green-600" />
              </div>
              <Progress value={systemHealth.cpuUsage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Memory</p>
                  <p className="text-2xl font-bold text-blue-700">{systemHealth.memoryUsage}%</p>
                </div>
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <Progress value={systemHealth.memoryUsage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Storage</p>
                  <p className="text-2xl font-bold text-purple-700">{systemHealth.diskUsage}%</p>
                </div>
                <HardDrive className="w-8 h-8 text-purple-600" />
              </div>
              <Progress value={systemHealth.diskUsage} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Transactions</p>
                  <p className="text-2xl font-bold text-orange-700">{systemHealth.totalTransactions.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Tabs */}
        <Card className="border-0 shadow-xl">
          <Tabs defaultValue="profile" className="w-full">
            <div className="border-b bg-gray-50/50 rounded-t-xl">
              <TabsList className="h-auto p-2 bg-transparent gap-1">
                <TabsTrigger value="profile" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Security</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">System</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </TabsTrigger>
                <TabsTrigger value="backup" className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Database className="w-5 h-5" />
                  <span className="font-medium">Backup</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="text-center">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      <CardTitle className="text-xl">{settings.name}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">{settings.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center space-y-2">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Account Verified
                        </Badge>
                        <p className="text-sm text-gray-600">{settings.department}</p>
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Change Avatar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal information and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={settings.name}
                            onChange={(e) => handleSettingChange('name', e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            value={settings.title}
                            onChange={(e) => handleSettingChange('title', e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleSettingChange('email', e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={settings.phone}
                            onChange={(e) => handleSettingChange('phone', e.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={settings.department}
                            onChange={(e) => handleSettingChange('department', e.target.value)}
                            className="h-11"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enhanced Security Settings */}
              <TabsContent value="security" className="space-y-8 mt-0">
                <Alert className="border-amber-200 bg-amber-50">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Security Notice</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Keep your account secure by using strong passwords and enabling two-factor authentication.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                      </CardTitle>
                      <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            value={settings.currentPassword}
                            onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
                            className="h-11 pr-10"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={settings.newPassword}
                            onChange={(e) => handleSettingChange('newPassword', e.target.value)}
                            className="h-11 pr-10"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={settings.confirmPassword}
                          onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Session Timeout (hours)</Label>
                          <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Hour</SelectItem>
                              <SelectItem value="2">2 Hours</SelectItem>
                              <SelectItem value="4">4 Hours</SelectItem>
                              <SelectItem value="8">8 Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Password Expiry (days)</Label>
                          <Select value={settings.passwordExpiry} onValueChange={(value) => handleSettingChange('passwordExpiry', value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 Days</SelectItem>
                              <SelectItem value="60">60 Days</SelectItem>
                              <SelectItem value="90">90 Days</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Advanced Security
                      </CardTitle>
                      <CardDescription>Configure additional security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label>Two-Factor Authentication</Label>
                            {settings.twoFactorEnabled ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Disabled
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Secure your account with two-factor authentication
                          </p>
                        </div>
                        <Switch
                          checked={settings.twoFactorEnabled}
                          onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Allow Multiple Sessions</Label>
                            <p className="text-sm text-gray-600">Allow login from multiple devices</p>
                          </div>
                          <Switch
                            checked={settings.allowMultipleSessions}
                            onCheckedChange={(checked) => handleSettingChange('allowMultipleSessions', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Require Strong Passwords</Label>
                            <p className="text-sm text-gray-600">Enforce complex password requirements</p>
                          </div>
                          <Switch
                            checked={settings.requireStrongPasswords}
                            onCheckedChange={(checked) => handleSettingChange('requireStrongPasswords', checked)}
                          />
                        </div>
                      </div>

                      {settings.twoFactorEnabled && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Authenticator App</span>
                          </div>
                          <p className="text-sm text-green-700 mb-3">
                            Use an authenticator app to generate verification codes
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-100">
                              <Key className="w-4 h-4 mr-2" />
                              Show QR Code
                            </Button>
                            <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-100">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reset Codes
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enhanced Notifications */}
              <TabsContent value="notifications" className="space-y-8 mt-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Channels
                    </CardTitle>
                    <CardDescription>Choose how you want to receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div>
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-gray-600">Receive via email</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Monitor className="w-5 h-5 text-green-600" />
                            <div>
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-gray-600">Browser notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-purple-600" />
                            <div>
                              <Label>SMS Notifications</Label>
                              <p className="text-sm text-gray-600">Text messages</p>
                            </div>
                          </div>
                          <Switch
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Notification Types</CardTitle>
                    <CardDescription>Configure which types of notifications you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Business Notifications</h4>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Order Notifications</Label>
                            <p className="text-sm text-gray-600">New orders, cancellations, refunds</p>
                          </div>
                          <Switch
                            checked={settings.orderNotifications}
                            onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>User Notifications</Label>
                            <p className="text-sm text-gray-600">New registrations, verification requests</p>
                          </div>
                          <Switch
                            checked={settings.userNotifications}
                            onCheckedChange={(checked) => handleSettingChange('userNotifications', checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">System Notifications</h4>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>System Alerts</Label>
                            <p className="text-sm text-gray-600">System errors, performance issues</p>
                          </div>
                          <Switch
                            checked={settings.systemAlerts}
                            onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Security Alerts</Label>
                            <p className="text-sm text-gray-600">Security threats, login attempts</p>
                          </div>
                          <Switch
                            checked={settings.securityAlerts}
                            onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Maintenance Alerts</Label>
                            <p className="text-sm text-gray-600">Scheduled maintenance windows</p>
                          </div>
                          <Switch
                            checked={settings.maintenanceAlerts}
                            onCheckedChange={(checked) => handleSettingChange('maintenanceAlerts', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced System Settings */}
              <TabsContent value="system" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Regional Settings
                      </CardTitle>
                      <CardDescription>Configure language, timezone, and regional preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Default Language</Label>
                          <Select value={settings.defaultLanguage} onValueChange={(value) => handleSettingChange('defaultLanguage', value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ar">العربية (Arabic)</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                              <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                              <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                              <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currency">Default Currency</Label>
                          <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Interface Preferences</h4>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Enable Dark Mode</Label>
                            <p className="text-sm text-gray-600">Use dark theme for better visibility</p>
                          </div>
                          <Switch
                            checked={settings.enableDarkMode}
                            onCheckedChange={(checked) => handleSettingChange('enableDarkMode', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Right-to-Left Layout</Label>
                            <p className="text-sm text-gray-600">Enable RTL for Arabic interface</p>
                          </div>
                          <Switch
                            checked={settings.enableRTL}
                            onCheckedChange={(checked) => handleSettingChange('enableRTL', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Performance Settings
                      </CardTitle>
                      <CardDescription>Optimize system performance and caching</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <Label>Enable Caching</Label>
                            <p className="text-sm text-gray-600">Improve performance with smart caching</p>
                          </div>
                          <Switch
                            checked={settings.cacheEnabled}
                            onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                          <div>
                            <Label>Enable Compression</Label>
                            <p className="text-sm text-gray-600">Compress responses to reduce bandwidth</p>
                          </div>
                          <Switch
                            checked={settings.compressionEnabled}
                            onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                          <div>
                            <Label>Enable CDN</Label>
                            <p className="text-sm text-gray-600">Use Content Delivery Network for static assets</p>
                          </div>
                          <Switch
                            checked={settings.cdnEnabled}
                            onCheckedChange={(checked) => handleSettingChange('cdnEnabled', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Cache Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Hit Rate</span>
                            <span className="font-semibold text-green-600">94.2%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Cache Size</span>
                            <span className="font-semibold">2.4 GB</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Requests/min</span>
                            <span className="font-semibold">1,247</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Clear Cache
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enhanced Email Settings */}
              <TabsContent value="email" className="space-y-8 mt-0">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      SMTP Configuration
                    </CardTitle>
                    <CardDescription>Configure email server settings for system notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">SMTP Host</Label>
                        <Input
                          id="smtp-host"
                          value={settings.smtpHost}
                          onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                          placeholder="smtp.example.com"
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">SMTP Port</Label>
                        <Input
                          id="smtp-port"
                          value={settings.smtpPort}
                          onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                          placeholder="587"
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">SMTP Username</Label>
                        <Input
                          id="smtp-user"
                          value={settings.smtpUser}
                          onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
                          placeholder="noreply@example.com"
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="smtp-password">SMTP Password</Label>
                        <Input
                          id="smtp-password"
                          type="password"
                          value={settings.smtpPassword}
                          onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Email Encryption</Label>
                        <Select value={settings.emailEncryption} onValueChange={(value) => handleSettingChange('emailEncryption', value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        Test Connection
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send Test Email
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        View Email Templates
                      </Button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Email Status</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600">Sent Today:</span>
                          <span className="font-semibold ml-2">127</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Queue:</span>
                          <span className="font-semibold ml-2">3</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Failed:</span>
                          <span className="font-semibold ml-2 text-red-600">2</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Success Rate:</span>
                          <span className="font-semibold ml-2 text-green-600">98.4%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Backup Settings */}
              <TabsContent value="backup" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Backup Configuration
                      </CardTitle>
                      <CardDescription>Configure automatic backups and data retention policies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <Label>Automatic Backup</Label>
                          <p className="text-sm text-gray-600">Enable scheduled system backups</p>
                        </div>
                        <Switch
                          checked={settings.autoBackup}
                          onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                        />
                      </div>
                      
                      {settings.autoBackup && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Backup Frequency</Label>
                              <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                                <SelectTrigger className="h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Retention Period (days)</Label>
                              <Input
                                value={settings.retentionPeriod}
                                onChange={(e) => handleSettingChange('retentionPeriod', e.target.value)}
                                placeholder="30"
                                className="h-11"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Backup Location</Label>
                              <Select value={settings.backupLocation} onValueChange={(value) => handleSettingChange('backupLocation', value)}>
                                <SelectTrigger className="h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="local">Local Storage</SelectItem>
                                  <SelectItem value="cloud">Cloud Storage</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Compression Level</Label>
                              <Select value={settings.compressionLevel} onValueChange={(value) => handleSettingChange('compressionLevel', value)}>
                                <SelectTrigger className="h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex flex-wrap gap-3">
                            <Button className="flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Create Backup Now
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                              <RefreshCw className="w-4 h-4" />
                              Restore from Backup
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download Backup
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="w-5 h-5" />
                        Backup Status
                      </CardTitle>
                      <CardDescription>Monitor backup history and storage usage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-3">Last Backup</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-600">Date:</span>
                              <span className="font-semibold">2024-01-21 03:00 AM</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600">Size:</span>
                              <span className="font-semibold">2.4 GB</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600">Status:</span>
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Success
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Storage Usage</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Backup Storage</span>
                              <span className="font-semibold">15.7 GB / 50 GB</span>
                            </div>
                            <Progress value={31.4} className="h-2" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Recent Backups</h4>
                          <div className="space-y-2">
                            {[
                              { date: '2024-01-21', size: '2.4 GB', status: 'success' },
                              { date: '2024-01-20', size: '2.3 GB', status: 'success' },
                              { date: '2024-01-19', size: '2.5 GB', status: 'success' },
                              { date: '2024-01-18', size: '2.2 GB', status: 'failed' },
                            ].map((backup, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium">{backup.date}</span>
                                <span className="text-sm text-gray-600">{backup.size}</span>
                                <Badge className={backup.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                  {backup.status === 'success' ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                  )}
                                  {backup.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Enhanced Save Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="px-8 py-3 h-auto text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            {saving ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}