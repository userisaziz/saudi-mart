import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  TrendingUp,
  ShoppingBag,
  Star,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Ban,
  UserCheck
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
import { Progress } from '@/shared/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  SaudiUser, 
  UserRole, 
  UserStatus, 
  VerificationLevel,
  SaudiRegion,
  BusinessVerificationStatus
} from '@/admin/types/saudi-admin';
import { UsersService } from '@/admin/services/users.service';
import { formatDistanceToNow, format } from 'date-fns';
import { ar } from 'date-fns/locale';

// Mock order data for demonstration
interface BuyerOrder {
  id: string;
  orderNumber: string;
  sellerName: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  itemCount: number;
}

const mockOrders: BuyerOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    sellerName: 'Al-Farisi Trading Company',
    totalAmount: 1250.00,
    status: 'delivered',
    orderDate: '2024-02-20T10:30:00Z',
    itemCount: 3
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    sellerName: 'Modern Electronics Limited',
    totalAmount: 850.50,
    status: 'shipped',
    orderDate: '2024-02-18T14:15:00Z',
    itemCount: 2
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    sellerName: 'Saudi Technology Solutions',
    totalAmount: 2100.75,
    status: 'confirmed',
    orderDate: '2024-02-15T09:20:00Z',
    itemCount: 5
  }
];

const BuyersDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [buyer, setBuyer] = useState<SaudiUser | null>(null);
  const [orders] = useState<BuyerOrder[]>(mockOrders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadBuyer();
    } else {
      setError('Buyer ID not provided');
      setLoading(false);
    }
  }, [id]);

  const loadBuyer = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const user = await UsersService.getUserById(id);
      if (user) {
        setBuyer(user);
      } else {
        setError('Buyer not found');
      }
    } catch (err) {
      setError('Failed to load buyer information');
      console.error('Error loading buyer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!buyer || !id) return;
    
    setActionLoading(true);
    try {
      const updatedUser = await UsersService.toggleUserStatus(id);
      if (updatedUser) {
        setBuyer(updatedUser);
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      [UserStatus.ACTIVE]: { label: 'Active', variant: 'default' as const, icon: CheckCircle },
      [UserStatus.INACTIVE]: { label: 'Inactive', variant: 'secondary' as const, icon: Clock },
      [UserStatus.SUSPENDED]: { label: 'Suspended', variant: 'destructive' as const, icon: XCircle },
      [UserStatus.PENDING]: { label: 'Pending', variant: 'outline' as const, icon: AlertCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getVerificationBadge = (level: VerificationLevel) => {
    const verificationConfig = {
      [VerificationLevel.UNVERIFIED]: { label: 'Unverified', variant: 'destructive' as const, progress: 0 },
      [VerificationLevel.EMAIL_VERIFIED]: { label: 'Email Verified', variant: 'secondary' as const, progress: 20 },
      [VerificationLevel.PHONE_VERIFIED]: { label: 'Phone Verified', variant: 'outline' as const, progress: 40 },
      [VerificationLevel.IDENTITY_VERIFIED]: { label: 'Identity Verified', variant: 'default' as const, progress: 60 },
      [VerificationLevel.BUSINESS_VERIFIED]: { label: 'Business Verified', variant: 'default' as const, progress: 80 },
      [VerificationLevel.FULLY_VERIFIED]: { label: 'Fully Verified', variant: 'default' as const, progress: 100 }
    };

    const config = verificationConfig[level];
    return { badge: <Badge variant={config.variant}>{config.label}</Badge>, progress: config.progress };
  };

  const getOrderStatusBadge = (status: BuyerOrder['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'outline' as const },
      confirmed: { label: 'Confirmed', variant: 'secondary' as const },
      shipped: { label: 'Shipped', variant: 'default' as const },
      delivered: { label: 'Delivered', variant: 'default' as const },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getBusinessVerificationBadge = (status: BusinessVerificationStatus) => {
    const statusConfig = {
      [BusinessVerificationStatus.PENDING]: { label: 'Pending', variant: 'outline' as const },
      [BusinessVerificationStatus.UNDER_REVIEW]: { label: 'Under Review', variant: 'secondary' as const },
      [BusinessVerificationStatus.APPROVED]: { label: 'Approved', variant: 'default' as const },
      [BusinessVerificationStatus.REJECTED]: { label: 'Rejected', variant: 'destructive' as const },
      [BusinessVerificationStatus.INCOMPLETE]: { label: 'Incomplete', variant: 'destructive' as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Buyer not found'}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/buyers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Buyers
        </Button>
      </div>
    );
  }

  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const verificationData = getVerificationBadge(buyer.verificationLevel);

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
            <h1 className="text-3xl font-bold">Buyer Profile</h1>
            <p className="text-muted-foreground">
              Complete buyer information and account activity
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(buyer.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate(`/admin/buyers/${id}/edit`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <UserCheck className="h-4 w-4" />
                Manage Verification
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleStatusToggle}
                disabled={actionLoading}
                className="gap-2"
              >
                {buyer.status === UserStatus.ACTIVE ? (
                  <>
                    <Ban className="h-4 w-4" />
                    Suspend Account
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Activate Account
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://avatar.vercel.sh/${buyer.email}`} />
                  <AvatarFallback className="text-lg">{buyer.name.ar.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{buyer.name.en}</h3>
                  <p className="text-lg text-muted-foreground" dir="rtl">{buyer.name.ar}</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{buyer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{buyer.phone}</p>
                  </div>
                </div>

                {buyer.nationalId && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">National ID</p>
                      <p className="font-medium">{buyer.nationalId}</p>
                    </div>
                  </div>
                )}

                {buyer.iqamaNumber && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Iqama Number</p>
                      <p className="font-medium">{buyer.iqamaNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {format(new Date(buyer.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {buyer.lastLoginAt 
                        ? formatDistanceToNow(new Date(buyer.lastLoginAt), { addSuffix: true })
                        : 'Never logged in'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Address</p>
                    {buyer.addresses.length > 0 ? (
                      <div className="space-y-1">
                        <p className="font-medium">{buyer.addresses[0].city.en}</p>
                        <p className="text-sm text-muted-foreground">
                          {buyer.addresses[0].district.en}, {buyer.addresses[0].region}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No address provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status & Stats */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {verificationData.badge}
                <span className="text-sm text-muted-foreground">
                  {verificationData.progress}%
                </span>
              </div>
              <Progress value={verificationData.progress} className="h-2" />
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Email Verified</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Phone Verified</span>
                  {buyer.verificationLevel !== VerificationLevel.UNVERIFIED ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Identity Verified</span>
                  {[VerificationLevel.IDENTITY_VERIFIED, VerificationLevel.BUSINESS_VERIFIED, VerificationLevel.FULLY_VERIFIED].includes(buyer.verificationLevel) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Account Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Orders</span>
                </div>
                <span className="font-semibold">{orders.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Completed Orders</span>
                </div>
                <span className="font-semibold">{completedOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Spent</span>
                </div>
                <span className="font-semibold">SAR {totalOrderValue.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Buyer Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">4.8</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business" className="gap-2">
            <Building className="h-4 w-4" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="address" className="gap-2">
            <MapPin className="h-4 w-4" />
            Address Details
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Order History
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Shield className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Business Information */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Corporate account details and business verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {buyer.businessInfo ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name (Arabic)</p>
                        <p className="font-medium text-right" dir="rtl">{buyer.businessInfo.businessNameAr}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name (English)</p>
                        <p className="font-medium">{buyer.businessInfo.businessNameEn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Business Type</p>
                        <p className="font-medium capitalize">{buyer.businessInfo.businessType}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Commercial Registration</p>
                        <p className="font-medium">{buyer.businessInfo.commercialRegistration}</p>
                      </div>
                      {buyer.businessInfo.vatNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">VAT Number</p>
                          <p className="font-medium">{buyer.businessInfo.vatNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Verification Status</p>
                        {getBusinessVerificationBadge(buyer.businessInfo.verificationStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">This is an individual buyer account</p>
                  <p className="text-sm text-muted-foreground">No business information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Details */}
        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                Complete address details for the buyer account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {buyer.addresses.length > 0 ? (
                <div className="space-y-6">
                  {buyer.addresses.map((address, index) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium capitalize">{address.type} Address</span>
                          {address.isDefault && (
                            <Badge variant="outline">Default</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Street (Arabic)</p>
                            <p className="font-medium text-right" dir="rtl">{address.streetName.ar}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Street (English)</p>
                            <p className="font-medium">{address.streetName.en}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">District</p>
                            <p className="font-medium">{address.district.en} - {address.district.ar}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Building & Additional Numbers</p>
                            <p className="font-medium">{address.buildingNumber} - {address.additionalNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">City & Region</p>
                            <p className="font-medium">{address.city.en}, {address.region}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Postal Code</p>
                            <p className="font-medium">{address.postalCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No address information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Order History */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Complete purchase history and order details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.sellerName}</TableCell>
                        <TableCell>{order.itemCount} items</TableCell>
                        <TableCell>SAR {order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                  <p className="text-sm text-muted-foreground">This buyer hasn't made any purchases yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Account settings and user preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Language</p>
                    <p className="font-medium">
                      {buyer.preferences.language === 'ar' ? 'Arabic (English)' : 'English'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timezone</p>
                    <p className="font-medium">{buyer.preferences.timezone}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prayer Time Notifications</span>
                    <Badge variant={buyer.preferences.prayerTimeNotifications ? 'default' : 'secondary'}>
                      {buyer.preferences.prayerTimeNotifications ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hijri Calendar</span>
                    <Badge variant={buyer.preferences.hijriCalendar ? 'default' : 'secondary'}>
                      {buyer.preferences.hijriCalendar ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyersDetails;