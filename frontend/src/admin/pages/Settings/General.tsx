import React, { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Monitor,
  Users,
  Shield,
  Bell,
  Mail,
  Smartphone,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Key,
  Clock,
  MapPin,
  DollarSign,
  Languages,
  Palette,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Trash2,
  Plus
} from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label
} from '@/shared/components/ui'
import { KPICard } from '@/shared/components/ui/kpi-card'

// Saudi-specific settings
const SAUDI_TIMEZONES = [
  { value: 'Asia/Riyadh', label: 'Saudi Arabia (UTC+3)' }
]

const CURRENCIES = [
  { value: 'SAR', label: 'Saudi Riyal (SAR)', symbol: 'SAR' },
  { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' }
]

const LANGUAGES = [
  { value: 'ar', label: 'Arabic', direction: 'rtl' },
  { value: 'en', label: 'English', direction: 'ltr' }
]

const USER_ROLES = [
  { value: 'admin', label: 'Administrator', permissions: ['all'] },
  { value: 'moderator', label: 'Moderator', permissions: ['users', 'products', 'verify'] },
  { value: 'support', label: 'Support Agent', permissions: ['users', 'tickets'] },
  { value: 'analyst', label: 'Data Analyst', permissions: ['analytics', 'reports'] }
]

const NOTIFICATION_TYPES = [
  { 
    key: 'system_alerts', 
    label: 'System Alerts', 
    description: 'Critical system notifications'
  },
  { 
    key: 'user_registrations', 
    label: 'User Registrations', 
    description: 'New user sign-ups'
  },
  { 
    key: 'verification_requests', 
    label: 'Verification Requests', 
    description: 'KYC and document verification'
  },
  { 
    key: 'payment_alerts', 
    label: 'Payment Alerts', 
    description: 'Payment and transaction notifications'
  },
  { 
    key: 'security_warnings', 
    label: 'Security Warnings', 
    description: 'Security breach attempts'
  },
  { 
    key: 'prayer_time_reminders', 
    label: 'Prayer Time Reminders', 
    description: 'Prayer time considerations for notifications'
  }
]

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]

interface SystemHealth {
  cpu: number
  memory: number
  disk: number
  database: number
  lastUpdated: string
  issues: {
    level: 'info' | 'warning' | 'error'
    message: string
    messageAr: string
    timestamp: string
  }[]
}

interface Settings {
  // System Settings
  siteName: string
  siteNameAr: string
  siteDescription: string
  siteDescriptionAr: string
  adminEmail: string
  supportEmail: string
  
  // Localization
  defaultLanguage: string
  supportedLanguages: string[]
  defaultTimezone: string
  defaultCurrency: string
  rtlSupport: boolean
  
  // UI/UX
  theme: string
  enableAnimations: boolean
  compactMode: boolean
  
  // Notifications
  emailNotifications: { [key: string]: boolean }
  pushNotifications: { [key: string]: boolean }
  smsNotifications: { [key: string]: boolean }
  notificationSound: boolean
  
  // Security
  twoFactorEnabled: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordComplexity: {
    minLength: number
    requireUppercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
  }
  
  // Saudi Specific
  halalCompliance: boolean
  sasoCompliance: boolean
  vatEnabled: boolean
  vatRate: number
  prayerTimeIntegration: boolean
  hijriCalendar: boolean
  
  // Performance
  cacheEnabled: boolean
  compressionEnabled: boolean
  cdnEnabled: boolean
  
  // Maintenance
  maintenanceMode: boolean
  maintenanceMessage: string
  maintenanceMessageAr: string
}

const mockSystemHealth: SystemHealth = {
  cpu: 45,
  memory: 67,
  disk: 23,
  database: 89,
  lastUpdated: '2024-09-05T10:30:00Z',
  issues: [
    {
      level: 'warning',
      message: 'High database connection count',
      timestamp: '2024-09-05T09:15:00Z'
    },
    {
      level: 'info',
      message: 'Cache cleared successfully',
      timestamp: '2024-09-05T08:20:00Z'
    }
  ]
}

const mockSettings: Settings = {
  siteName: 'Saudi E-Commerce Platform',
  siteDescription: 'Leading e-commerce platform in Saudi Arabia',
  adminEmail: 'admin@platform.sa',
  supportEmail: 'support@platform.sa',
  
  defaultLanguage: 'ar',
  supportedLanguages: ['ar', 'en'],
  defaultTimezone: 'Asia/Riyadh',
  defaultCurrency: 'SAR',
  rtlSupport: true,
  
  theme: 'system',
  enableAnimations: true,
  compactMode: false,
  
  emailNotifications: {
    system_alerts: true,
    user_registrations: true,
    verification_requests: true,
    payment_alerts: true,
    security_warnings: true,
    prayer_time_reminders: false
  },
  pushNotifications: {
    system_alerts: true,
    user_registrations: false,
    verification_requests: true,
    payment_alerts: true,
    security_warnings: true,
    prayer_time_reminders: true
  },
  smsNotifications: {
    system_alerts: true,
    user_registrations: false,
    verification_requests: false,
    payment_alerts: true,
    security_warnings: true,
    prayer_time_reminders: false
  },
  notificationSound: true,
  
  twoFactorEnabled: true,
  sessionTimeout: 120,
  maxLoginAttempts: 5,
  passwordComplexity: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true
  },
  
  halalCompliance: true,
  sasoCompliance: true,
  vatEnabled: true,
  vatRate: 15,
  prayerTimeIntegration: true,
  hijriCalendar: true,
  
  cacheEnabled: true,
  compressionEnabled: true,
  cdnEnabled: false,
  
  maintenanceMode: false,
  maintenanceMessage: 'System is under maintenance. Please try again later.',
}

const SystemHealthCard = ({ health }: { health: SystemHealth }) => {
  const getHealthColor = (value: number) => {
    if (value < 50) return 'text-success'
    if (value < 80) return 'text-warning'
    return 'text-destructive'
  }

  const getHealthBgColor = (value: number) => {
    if (value < 50) return 'bg-success'
    if (value < 80) return 'bg-warning'
    return 'bg-destructive'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">CPU Usage</span>
              <span className={`text-sm font-semibold ${getHealthColor(health.cpu)}`}>
                {health.cpu}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`rounded-full h-2 transition-all ${getHealthBgColor(health.cpu)}`}
                style={{ width: `${health.cpu}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Memory</span>
              <span className={`text-sm font-semibold ${getHealthColor(health.memory)}`}>
                {health.memory}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`rounded-full h-2 transition-all ${getHealthBgColor(health.memory)}`}
                style={{ width: `${health.memory}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Disk Usage</span>
              <span className={`text-sm font-semibold ${getHealthColor(health.disk)}`}>
                {health.disk}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`rounded-full h-2 transition-all ${getHealthBgColor(health.disk)}`}
                style={{ width: `${health.disk}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Database</span>
              <span className={`text-sm font-semibold ${getHealthColor(health.database)}`}>
                {health.database}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`rounded-full h-2 transition-all ${getHealthBgColor(health.database)}`}
                style={{ width: `${health.database}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">
            Recent Issues
          </div>
          <div className="space-y-2">
            {health.issues.map((issue, index) => (
              <div key={index} className="flex items-center space-x-2">
                {issue.level === 'error' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                {issue.level === 'warning' && <AlertTriangle className="h-4 w-4 text-warning" />}
                {issue.level === 'info' && <Info className="h-4 w-4 text-info" />}
                <div className="flex-1">
                  <p className="text-sm">{issue.message}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">{issue.messageAr}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(issue.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
          <span>Last updated: {new Date(health.lastUpdated).toLocaleString()}</span>
          <Button variant="outline" size="sm">
            <Activity className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const RolePermissionModal = ({ 
  isOpen, 
  onClose 
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Role & Permission Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {USER_ROLES.map((role, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{role.label}</CardTitle>
                    <p className="text-sm text-muted-foreground" dir="rtl">{role.labelAr}</p>
                  </div>
                  <Badge variant="outline">{role.permissions.length} permissions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {role.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="secondary">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>(mockSettings)
  const [systemHealth] = useState<SystemHealth>(mockSystemHealth)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  const handleSaveSettings = async () => {
    setSaveStatus('saving')
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved')
      setLoading(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const handleResetSettings = () => {
    setSettings(mockSettings)
  }

  const updateSettings = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateNestedSettings = (parent: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [key]: value
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure system preferences and administration settings
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* Save Status Alert */}
      {saveStatus === 'saved' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="CPU Usage"
              value={systemHealth.cpu}
              format="percentage"
              icon={Server}
              size="sm"
            />
            <KPICard
              title="Memory Usage"
              value={systemHealth.memory}
              format="percentage"
              icon={Database}
              size="sm"
            />
            <KPICard
              title="Disk Usage"
              value={systemHealth.disk}
              format="percentage"
              icon={Server}
              size="sm"
            />
            <KPICard
              title="Database Load"
              value={systemHealth.database}
              format="percentage"
              icon={Database}
              size="sm"
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <SystemHealthCard health={systemHealth} />
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="localization">
            <Globe className="h-4 w-4 mr-2" />
            Localization
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="saudi">
            <MapPin className="h-4 w-4 mr-2" />
            Saudi Settings
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Name (English)</Label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => updateSettings('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Site Name (Arabic)</Label>
                  <Input
                    value={settings.siteNameAr}
                    onChange={(e) => updateSettings('siteNameAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => updateSettings('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Arabic)</Label>
                  <Textarea
                    value={settings.siteDescriptionAr}
                    onChange={(e) => updateSettings('siteDescriptionAr', e.target.value)}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => updateSettings('adminEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSettings('supportEmail', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSettings('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_OPTIONS.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center space-x-2">
                            <theme.icon className="h-4 w-4" />
                            <span>{theme.label} - {theme.labelAr}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Animations</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.enableAnimations}
                      onCheckedChange={(checked) => updateSettings('enableAnimations', checked)}
                    />
                    <span className="text-sm">{settings.enableAnimations ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Compact Mode</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSettings('compactMode', checked)}
                    />
                    <span className="text-sm">{settings.compactMode ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(value) => updateSettings('defaultLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label} - {lang.labelAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.defaultTimezone} onValueChange={(value) => updateSettings('defaultTimezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SAUDI_TIMEZONES.map(tz => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label} - {tz.labelAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select value={settings.defaultCurrency} onValueChange={(value) => updateSettings('defaultCurrency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.symbol} {currency.label} - {currency.labelAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>RTL Support</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.rtlSupport}
                      onCheckedChange={(checked) => updateSettings('rtlSupport', checked)}
                    />
                    <span className="text-sm">{settings.rtlSupport ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Supported Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LANGUAGES.map(lang => (
                  <div key={lang.value} className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.supportedLanguages.includes(lang.value)}
                      onCheckedChange={(checked) => {
                        const updatedLanguages = checked 
                          ? [...settings.supportedLanguages, lang.value]
                          : settings.supportedLanguages.filter(l => l !== lang.value)
                        updateSettings('supportedLanguages', updatedLanguages)
                      }}
                    />
                    <Label className="flex items-center space-x-2">
                      <Languages className="h-4 w-4" />
                      <span>{lang.label} - {lang.labelAr}</span>
                      <Badge variant="outline">{lang.direction.toUpperCase()}</Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NOTIFICATION_TYPES.map(type => (
                  <div key={type.key} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.emailNotifications[type.key]}
                        onCheckedChange={(checked) => updateNestedSettings('emailNotifications', type.key, checked)}
                      />
                      <Label className="text-sm font-medium">{type.label}</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">{type.description}</p>
                    <p className="text-xs text-muted-foreground pl-6" dir="rtl">{type.descriptionAr}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Push Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NOTIFICATION_TYPES.map(type => (
                  <div key={type.key} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.pushNotifications[type.key]}
                        onCheckedChange={(checked) => updateNestedSettings('pushNotifications', type.key, checked)}
                      />
                      <Label className="text-sm font-medium">{type.label}</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">{type.description}</p>
                    <p className="text-xs text-muted-foreground pl-6" dir="rtl">{type.descriptionAr}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SMS Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>SMS Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NOTIFICATION_TYPES.map(type => (
                  <div key={type.key} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.smsNotifications[type.key]}
                        onCheckedChange={(checked) => updateNestedSettings('smsNotifications', type.key, checked)}
                      />
                      <Label className="text-sm font-medium">{type.label}</Label>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">{type.description}</p>
                    <p className="text-xs text-muted-foreground pl-6" dir="rtl">{type.descriptionAr}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={settings.notificationSound}
                  onCheckedChange={(checked) => updateSettings('notificationSound', checked)}
                />
                <Label className="flex items-center space-x-2">
                  {settings.notificationSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span>Notification Sound</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Authentication</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setRoleModalOpen(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Roles
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSettings('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSettings('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSettings('twoFactorEnabled', checked)}
                    />
                    <span className="text-sm">{settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Length</Label>
                  <Input
                    type="number"
                    value={settings.passwordComplexity.minLength}
                    onChange={(e) => updateNestedSettings('passwordComplexity', 'minLength', parseInt(e.target.value))}
                    min="4"
                    max="32"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Require Uppercase</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.passwordComplexity.requireUppercase}
                      onCheckedChange={(checked) => updateNestedSettings('passwordComplexity', 'requireUppercase', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Require Numbers</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.passwordComplexity.requireNumbers}
                      onCheckedChange={(checked) => updateNestedSettings('passwordComplexity', 'requireNumbers', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Require Symbols</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={settings.passwordComplexity.requireSymbols}
                      onCheckedChange={(checked) => updateNestedSettings('passwordComplexity', 'requireSymbols', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saudi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saudi Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Halal Compliance</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.halalCompliance}
                      onCheckedChange={(checked) => updateSettings('halalCompliance', checked)}
                    />
                    <span className="text-sm">{settings.halalCompliance ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>SASO Compliance</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.sasoCompliance}
                      onCheckedChange={(checked) => updateSettings('sasoCompliance', checked)}
                    />
                    <span className="text-sm">{settings.sasoCompliance ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>VAT Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VAT Enabled</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.vatEnabled}
                      onCheckedChange={(checked) => updateSettings('vatEnabled', checked)}
                    />
                    <span className="text-sm">{settings.vatEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>VAT Rate (%)</Label>
                  <Input
                    type="number"
                    value={settings.vatRate}
                    onChange={(e) => updateSettings('vatRate', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.1"
                    disabled={!settings.vatEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cultural Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prayer Time Integration</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.prayerTimeIntegration}
                      onCheckedChange={(checked) => updateSettings('prayerTimeIntegration', checked)}
                    />
                    <span className="text-sm">{settings.prayerTimeIntegration ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adjust notification timing to respect prayer times
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Hijri Calendar</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.hijriCalendar}
                      onCheckedChange={(checked) => updateSettings('hijriCalendar', checked)}
                    />
                    <span className="text-sm">{settings.hijriCalendar ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Display Hijri dates alongside Gregorian dates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cache Enabled</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => updateSettings('cacheEnabled', checked)}
                    />
                    <span className="text-sm">{settings.cacheEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Compression</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.compressionEnabled}
                      onCheckedChange={(checked) => updateSettings('compressionEnabled', checked)}
                    />
                    <span className="text-sm">{settings.compressionEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>CDN</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.cdnEnabled}
                      onCheckedChange={(checked) => updateSettings('cdnEnabled', checked)}
                    />
                    <span className="text-sm">{settings.cdnEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Maintenance Mode</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings('maintenanceMode', checked)}
                  />
                  <span className="text-sm">{settings.maintenanceMode ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              
              {settings.maintenanceMode && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Maintenance mode is enabled. The site will show a maintenance page to users.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maintenance Message (English)</Label>
                      <Textarea
                        value={settings.maintenanceMessage}
                        onChange={(e) => updateSettings('maintenanceMessage', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maintenance Message (Arabic)</Label>
                      <Textarea
                        value={settings.maintenanceMessageAr}
                        onChange={(e) => updateSettings('maintenanceMessageAr', e.target.value)}
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <div className="text-center">
                    <p className="font-medium">Export Data</p>
                    <p className="text-xs text-muted-foreground">Export Data</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  <div className="text-center">
                    <p className="font-medium">Import Data</p>
                    <p className="text-xs text-muted-foreground">Import Data</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Permission Modal */}
      <RolePermissionModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />
    </div>
  )
}