import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, Eye, Edit, Shield, Ban } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { SaudiUser, UserRole, UserStatus, VerificationLevel, SaudiRegion } from '@/admin/types/saudi-admin';
import { UsersService } from '@/admin/services/users.service';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useLanguage } from '@/shared/contexts/LanguageContext';

export default function UsersList() {
  const [users, setUsers] = useState<SaudiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    verificationLevel: '',
    region: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    byRole: {} as Record<UserRole, number>,
    byRegion: {} as Record<SaudiRegion, number>,
    recentRegistrations: 0
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, searchTerm, filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await UsersService.getUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        role: filters.role as UserRole || undefined,
        status: filters.status as UserStatus || undefined,
        verificationLevel: filters.verificationLevel as VerificationLevel || undefined,
        region: filters.region as SaudiRegion || undefined
      });

      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const userStats = await UsersService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      await UsersService.toggleUserStatus(userId);
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      [UserStatus.ACTIVE]: { label: 'Active', variant: 'default' as const },
      [UserStatus.INACTIVE]: { label: 'Inactive', variant: 'secondary' as const },
      [UserStatus.SUSPENDED]: { label: 'Suspended', variant: 'destructive' as const },
      [UserStatus.PENDING]: { label: 'Pending', variant: 'outline' as const }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getVerificationBadge = (level: VerificationLevel) => {
    const verificationConfig = {
      [VerificationLevel.UNVERIFIED]: { label: 'Unverified', variant: 'destructive' as const },
      [VerificationLevel.EMAIL_VERIFIED]: { label: 'Email Verified', variant: 'secondary' as const },
      [VerificationLevel.PHONE_VERIFIED]: { label: 'Phone Verified', variant: 'outline' as const },
      [VerificationLevel.IDENTITY_VERIFIED]: { label: 'Identity Verified', variant: 'default' as const },
      [VerificationLevel.BUSINESS_VERIFIED]: { label: 'Business Verified', variant: 'default' as const },
      [VerificationLevel.FULLY_VERIFIED]: { label: 'Fully Verified', variant: 'default' as const }
    };

    const config = verificationConfig[level];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      [UserRole.ADMIN]: { label: 'Admin', variant: 'destructive' as const },
      [UserRole.SUPER_ADMIN]: { label: 'Super Admin', variant: 'destructive' as const },
      [UserRole.MODERATOR]: { label: 'Moderator', variant: 'secondary' as const },
      [UserRole.SUPPORT]: { label: 'Support', variant: 'outline' as const },
      [UserRole.SELLER]: { label: 'Seller', variant: 'default' as const },
      [UserRole.BUYER]: { label: 'Buyer', variant: 'outline' as const }
    };

    const config = roleConfig[role];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const StatsCard = ({ title, value, subtitle }: { title: string; value: number; subtitle?: string }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and identity verification</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats.total} />
        <StatsCard title="Active Users" value={stats.active} />
        <StatsCard title="Verified Users" value={stats.verified} />
        <StatsCard 
          title="Recent Registrations" 
          value={stats.recentRegistrations} 
          subtitle="Last 7 days" 
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>مدير</SelectItem>
                  <SelectItem value={UserRole.SELLER}>بائع</SelectItem>
                  <SelectItem value={UserRole.BUYER}>مشتري</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value={UserStatus.ACTIVE}>نشط</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE}>غير نشط</SelectItem>
                  <SelectItem value={UserStatus.SUSPENDED}>موقوف</SelectItem>
                  <SelectItem value={UserStatus.PENDING}>في الانتظار</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>
            عرض {users.length} من إجمالي {totalUsers} مستخدم
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التحقق</TableHead>
                  <TableHead className="text-right">المنطقة</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">آخر دخول</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                          <AvatarFallback>{user.name.ar.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name.ar}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{getVerificationBadge(user.verificationLevel)}</TableCell>
                    <TableCell>
                      {user.addresses.length > 0 && (
                        <span className="text-sm">
                          {user.addresses[0].city.ar}, {user.addresses[0].region}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: ar })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.lastLoginAt ? (
                        <span className="text-sm">
                          {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true, locale: ar })}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">لم يسجل دخول</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-right">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Shield className="h-4 w-4" />
                            إدارة الأدوار
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleStatusToggle(user.id)}
                          >
                            <Ban className="h-4 w-4" />
                            {user.status === UserStatus.ACTIVE ? 'إيقاف' : 'تفعيل'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalUsers > itemsPerPage && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, totalUsers)} من إجمالي {totalUsers} مستخدم
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(totalUsers / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === Math.ceil(totalUsers / itemsPerPage) || 
                      Math.abs(page - currentPage) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalUsers / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(totalUsers / itemsPerPage)}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}