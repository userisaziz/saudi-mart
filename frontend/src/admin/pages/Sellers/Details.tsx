import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  CreditCard,
  FileText,
  AlertTriangle,
  Edit,
  MoreVertical,
  Ban,
  Unlock,
  UserCheck,
  Activity,
  MessageSquare,
  History,
  Download,
  Eye,
  Star
} from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  Progress
} from '@/shared/components/ui'
import {
  SaudiUser,
  UserRole,
  UserStatus,
  VerificationLevel,
  SaudiRegion,
  BusinessVerificationStatus,
  AdminNote
} from '@/admin/types/saudi-admin'
import { UsersService } from '@/admin/services/users.service'
import { formatDistanceToNow, format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface UserActivity {
  id: string
  type: 'login' | 'logout' | 'purchase' | 'profile_update' | 'verification' | 'support_ticket'
  description: string
  descriptionAr: string
  timestamp: string
  metadata?: any
}

interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string
  accountAge: number
  loginCount: number
  supportTickets: number
}

const mockUserActivity: UserActivity[] = [
  {
    id: '1',
    type: 'login',
    description: 'Logged in from Riyadh',
    descriptionAr: 'Logged in from Riyadh',
    timestamp: '2024-02-23T08:30:00Z'
  },
  {
    id: '2',
    type: 'purchase',
    description: 'Placed order #ORD-2024-001234',
    descriptionAr: 'Placed order #ORD-2024-001234',
    timestamp: '2024-02-22T14:15:00Z',
    metadata: { orderId: 'ORD-2024-001234', amount: 1250.00 }
  },
  {
    id: '3',
    type: 'profile_update',
    description: 'Updated business information',
    descriptionAr: 'Updated business information',
    timestamp: '2024-02-20T16:45:00Z'
  },
  {
    id: '4',
    type: 'verification',
    description: 'Business verification approved',
    descriptionAr: 'Business verification approved',
    timestamp: '2024-02-15T10:20:00Z'
  }
]

const mockUserStats: UserStats = {
  totalOrders: 23,
  totalSpent: 45750.50,
  averageOrderValue: 1989.15,
  lastOrderDate: '2024-02-22T14:15:00Z',
  accountAge: 45,
  loginCount: 127,
  supportTickets: 2
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<SaudiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [userActivity, setUserActivity] = useState<UserActivity[]>(mockUserActivity)
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadUserDetails(id)
    }
  }, [id])

  const loadUserDetails = async (userId: string) => {
    setLoading(true)
    try {
      const userData = await UsersService.getUserById(userId)
      setUser(userData)
    } catch (error) {
      console.error('Error loading user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!user) return
    
    setActionLoading(true)
    try {
      await UsersService.toggleUserStatus(user.id)
      setUser(prev => prev ? {
        ...prev,
        status: prev.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE
      } : null)
    } catch (error) {
      console.error('Error toggling user status:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      [UserStatus.ACTIVE]: { label: 'Active', variant: 'default' as const, icon: CheckCircle },
      [UserStatus.INACTIVE]: { label: 'Inactive', variant: 'secondary' as const, icon: XCircle },
      [UserStatus.SUSPENDED]: { label: 'Suspended', variant: 'destructive' as const, icon: Ban },
      [UserStatus.PENDING]: { label: 'Pending', variant: 'outline' as const, icon: Clock }
    }

    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getVerificationBadge = (level: VerificationLevel) => {
    const verificationConfig = {
      [VerificationLevel.UNVERIFIED]: { label: 'Unverified', variant: 'destructive' as const },
      [VerificationLevel.EMAIL_VERIFIED]: { label: 'Email Verified', variant: 'secondary' as const },
      [VerificationLevel.PHONE_VERIFIED]: { label: 'Phone Verified', variant: 'outline' as const },
      [VerificationLevel.IDENTITY_VERIFIED]: { label: 'Identity Verified', variant: 'default' as const },
      [VerificationLevel.BUSINESS_VERIFIED]: { label: 'Business Verified', variant: 'default' as const },
      [VerificationLevel.FULLY_VERIFIED]: { label: 'Fully Verified', variant: 'default' as const }
    }

    const config = verificationConfig[level]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getVerificationProgress = (level: VerificationLevel): number => {
    const progressMap = {
      [VerificationLevel.UNVERIFIED]: 0,
      [VerificationLevel.EMAIL_VERIFIED]: 20,
      [VerificationLevel.PHONE_VERIFIED]: 40,
      [VerificationLevel.IDENTITY_VERIFIED]: 60,
      [VerificationLevel.BUSINESS_VERIFIED]: 80,
      [VerificationLevel.FULLY_VERIFIED]: 100
    }
    return progressMap[level]
  }

  const getActivityIcon = (type: UserActivity['type']) => {
    const iconMap = {
      login: Activity,
      logout: Activity,
      purchase: CreditCard,
      profile_update: Edit,
      verification: Shield,
      support_ticket: MessageSquare
    }
    return iconMap[type]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium">المستخدم غير موجود</h3>
          <p className="text-muted-foreground">لم يتم العثور على المستخدم المطلوب</p>
        </div>
        <Button onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          العودة للقائمة
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
          <div>
            <h1 className="text-3xl font-bold">تفاصيل المستخدم</h1>
            <p className="text-muted-foreground">عرض وإدارة بيانات المستخدم</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-right">
              <DropdownMenuItem
                onClick={handleStatusToggle}
                disabled={actionLoading}
              >
                {user.status === UserStatus.ACTIVE ? (
                  <>
                    <Ban className="h-4 w-4 ml-2" />
                    إيقاف الحساب
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 ml-2" />
                    تفعيل الحساب
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 ml-2" />
                إرسال رسالة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="h-4 w-4 ml-2" />
                سجل التغييرات
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                <AvatarFallback className="text-lg">{user.name.ar.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{user.name.ar}</h2>
                <p className="text-lg text-muted-foreground">{user.name.en}</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">الدور</p>
                <Badge variant="outline">{user.role === UserRole.SELLER ? 'بائع' : user.role === UserRole.BUYER ? 'مشتري' : 'إداري'}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">الحالة</p>
                {getStatusBadge(user.status)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">التحقق</p>
                {getVerificationBadge(user.verificationLevel)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                <p className="text-sm">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{userStats.totalOrders}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإنفاق</p>
                <p className="text-2xl font-bold">{userStats.totalSpent.toLocaleString()} ﷼</p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط الطلب</p>
                <p className="text-2xl font-bold">{userStats.averageOrderValue.toLocaleString()} ﷼</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">عدد تسجيلات الدخول</p>
                <p className="text-2xl font-bold">{userStats.loginCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger value="business">معلومات الأعمال</TabsTrigger>
          <TabsTrigger value="verification">التحقق</TabsTrigger>
          <TabsTrigger value="activity">النشاط</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>البيانات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">الاسم (عربي)</p>
                    <p className="mt-1">{user.name.ar}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">الاسم (إنجليزي)</p>
                    <p className="mt-1">{user.name.en}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</p>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">رقم الهاتف</p>
                    <p className="mt-1">{user.phone}</p>
                  </div>
                </div>

                {user.nationalId && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">رقم الهوية الوطنية</p>
                    <p className="mt-1">{user.nationalId}</p>
                  </div>
                )}

                {user.iqamaNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">رقم الإقامة</p>
                    <p className="mt-1">{user.iqamaNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>العنوان</CardTitle>
              </CardHeader>
              <CardContent>
                {user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {user.addresses.map((address, index) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            {address.type === 'home' ? 'منزل' : address.type === 'business' ? 'عمل' : 'مستودع'}
                          </Badge>
                          {address.isDefault && (
                            <Badge variant="default">افتراضي</Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>{address.buildingNumber} - {address.streetName.ar}</p>
                          <p>{address.district.ar}، {address.city.ar}</p>
                          <p>{address.region} {address.postalCode}-{address.additionalNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">لا توجد عناوين مسجلة</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          {user.businessInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الشركة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">اسم الشركة (عربي)</p>
                      <p className="mt-1">{user.businessInfo.businessNameAr}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">اسم الشركة (إنجليزي)</p>
                      <p className="mt-1">{user.businessInfo.businessNameEn}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">نوع الشركة</p>
                    <p className="mt-1">
                      {user.businessInfo.businessType === 'individual' ? 'فردي' :
                       user.businessInfo.businessType === 'company' ? 'شركة' :
                       user.businessInfo.businessType === 'llc' ? 'شركة محدودة' : 'أخرى'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">حالة التحقق</p>
                    <Badge 
                      variant={
                        user.businessInfo.verificationStatus === BusinessVerificationStatus.APPROVED ? 'default' :
                        user.businessInfo.verificationStatus === BusinessVerificationStatus.PENDING ? 'outline' :
                        user.businessInfo.verificationStatus === BusinessVerificationStatus.REJECTED ? 'destructive' :
                        'secondary'
                      }
                      className="mt-1"
                    >
                      {user.businessInfo.verificationStatus === BusinessVerificationStatus.APPROVED ? 'معتمد' :
                       user.businessInfo.verificationStatus === BusinessVerificationStatus.PENDING ? 'قيد المراجعة' :
                       user.businessInfo.verificationStatus === BusinessVerificationStatus.REJECTED ? 'مرفوض' :
                       'غير مكتمل'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>التراخيص والمستندات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">السجل التجاري</p>
                    <p className="mt-1">{user.businessInfo.commercialRegistration}</p>
                  </div>

                  {user.businessInfo.vatNumber && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">رقم ضريبة القيمة المضافة</p>
                      <p className="mt-1">{user.businessInfo.vatNumber}</p>
                    </div>
                  )}

                  {user.businessInfo.samaLicense && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ترخيص ساما</p>
                      <p className="mt-1">{user.businessInfo.samaLicense}</p>
                    </div>
                  )}

                  {user.businessInfo.establishmentCard && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">بطاقة المنشأة</p>
                      <p className="mt-1">{user.businessInfo.establishmentCard}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد معلومات أعمال</h3>
                  <p className="text-muted-foreground">لم يقم المستخدم بإضافة معلومات الأعمال بعد</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>حالة التحقق</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">مستوى التحقق الحالي</h3>
                  <p className="text-sm text-muted-foreground">
                    {getVerificationProgress(user.verificationLevel)}% مكتمل
                  </p>
                </div>
                {getVerificationBadge(user.verificationLevel)}
              </div>

              <Progress value={getVerificationProgress(user.verificationLevel)} className="w-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">تحقق البريد الإلكتروني</span>
                    {user.verificationLevel !== VerificationLevel.UNVERIFIED ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.verificationLevel !== VerificationLevel.UNVERIFIED ? 'تم التحقق' : 'لم يتم التحقق'}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">تحقق رقم الهاتف</span>
                    {[VerificationLevel.PHONE_VERIFIED, VerificationLevel.IDENTITY_VERIFIED, 
                      VerificationLevel.BUSINESS_VERIFIED, VerificationLevel.FULLY_VERIFIED].includes(user.verificationLevel) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[VerificationLevel.PHONE_VERIFIED, VerificationLevel.IDENTITY_VERIFIED, 
                      VerificationLevel.BUSINESS_VERIFIED, VerificationLevel.FULLY_VERIFIED].includes(user.verificationLevel) 
                      ? 'تم التحقق' : 'لم يتم التحقق'}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">تحقق الهوية</span>
                    {[VerificationLevel.IDENTITY_VERIFIED, VerificationLevel.BUSINESS_VERIFIED, 
                      VerificationLevel.FULLY_VERIFIED].includes(user.verificationLevel) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[VerificationLevel.IDENTITY_VERIFIED, VerificationLevel.BUSINESS_VERIFIED, 
                      VerificationLevel.FULLY_VERIFIED].includes(user.verificationLevel) 
                      ? 'تم التحقق' : 'لم يتم التحقق'}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">تحقق الأعمال</span>
                    {[VerificationLevel.BUSINESS_VERIFIED, VerificationLevel.FULLY_VERIFIED].includes(user.verificationLevel) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[VerificationLevel.BUSINESS_VERIFIED, VerificationLevel.FULLY_VERIFIED].includes(user.verificationLevel) 
                      ? 'تم التحقق' : 'لم يتم التحقق'}
                  </p>
                </div>
              </div>

              {user.verificationLevel !== VerificationLevel.FULLY_VERIFIED && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    هذا المستخدم لم يكمل عملية التحقق بالكامل. قد تحتاج إلى مراجعة المستندات المطلوبة.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {userActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type)
                    return (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                        <div className="p-2 bg-muted rounded-full">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-sm">{activity.descriptionAr}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ar })}
                          </p>
                        </div>
                        {activity.metadata && (
                          <Badge variant="outline" className="text-xs">
                            {activity.metadata.amount ? `${activity.metadata.amount.toLocaleString()} ﷼` : ''}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التفضيلات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">اللغة المفضلة</p>
                  <p className="mt-1">{user.preferences.language === 'ar' ? 'العربية' : 'الإنجليزية'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المنطقة الزمنية</p>
                  <p className="mt-1">{user.preferences.timezone}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">إعدادات الإشعارات</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تنبيهات أوقات الصلاة</span>
                    <Badge variant={user.preferences.prayerTimeNotifications ? 'default' : 'secondary'}>
                      {user.preferences.prayerTimeNotifications ? 'مفعل' : 'معطل'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">التقويم الهجري</span>
                    <Badge variant={user.preferences.hijriCalendar ? 'default' : 'secondary'}>
                      {user.preferences.hijriCalendar ? 'مفعل' : 'معطل'}
                    </Badge>
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