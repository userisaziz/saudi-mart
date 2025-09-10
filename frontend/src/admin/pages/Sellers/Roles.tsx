import React, { useState, useEffect } from 'react'
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Settings,
  Lock,
  Unlock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Switch } from '@/shared/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useLanguage } from '@/shared/contexts/LanguageContext'

interface Permission {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  category: string
  categoryAr: string
}

interface Role {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  permissions: string[]
  isActive: boolean
  isSystem: boolean
  userCount: number
  createdAt: string
  updatedAt: string
}

const mockPermissions: Permission[] = [
  {
    id: 'products_view',
    name: 'View Products',
    nameAr: 'عرض المنتجات',
    description: 'View all products',
    descriptionAr: 'عرض جميع المنتجات',
    category: 'Products',
    categoryAr: 'المنتجات'
  },
  {
    id: 'products_create',
    name: 'Create Products',
    nameAr: 'إنشاء المنتجات',
    description: 'Create new products',
    descriptionAr: 'إنشاء منتجات جديدة',
    category: 'Products',
    categoryAr: 'المنتجات'
  },
  {
    id: 'products_edit',
    name: 'Edit Products',
    nameAr: 'تعديل المنتجات',
    description: 'Edit existing products',
    descriptionAr: 'تعديل المنتجات الموجودة',
    category: 'Products',
    categoryAr: 'المنتجات'
  },
  {
    id: 'products_delete',
    name: 'Delete Products',
    nameAr: 'حذف المنتجات',
    description: 'Delete products',
    descriptionAr: 'حذف المنتجات',
    category: 'Products',
    categoryAr: 'المنتجات'
  },
  {
    id: 'orders_view',
    name: 'View Orders',
    nameAr: 'عرض الطلبات',
    description: 'View all orders',
    descriptionAr: 'عرض جميع الطلبات',
    category: 'Orders',
    categoryAr: 'الطلبات'
  },
  {
    id: 'orders_manage',
    name: 'Manage Orders',
    nameAr: 'إدارة الطلبات',
    description: 'Manage order status and fulfillment',
    descriptionAr: 'إدارة حالة الطلبات والتنفيذ',
    category: 'Orders',
    categoryAr: 'الطلبات'
  },
  {
    id: 'analytics_view',
    name: 'View Analytics',
    nameAr: 'عرض التحليلات',
    description: 'View analytics and reports',
    descriptionAr: 'عرض التحليلات والتقارير',
    category: 'Analytics',
    categoryAr: 'التحليلات'
  },
  {
    id: 'profile_edit',
    name: 'Edit Profile',
    nameAr: 'تعديل الملف الشخصي',
    description: 'Edit company profile',
    descriptionAr: 'تعديل ملف الشركة',
    category: 'Profile',
    categoryAr: 'الملف الشخصي'
  }
]

const mockRoles: Role[] = [
  {
    id: 'ROLE-001',
    name: 'Admin',
    nameAr: 'مدير',
    description: 'Full access to all seller features',
    descriptionAr: 'وصول كامل لجميع ميزات البائع',
    permissions: ['products_view', 'products_create', 'products_edit', 'products_delete', 'orders_view', 'orders_manage', 'analytics_view', 'profile_edit'],
    isActive: true,
    isSystem: true,
    userCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ROLE-002',
    name: 'Manager',
    nameAr: 'مدير',
    description: 'Manage products and orders',
    descriptionAr: 'إدارة المنتجات والطلبات',
    permissions: ['products_view', 'products_create', 'products_edit', 'orders_view', 'orders_manage', 'analytics_view'],
    isActive: true,
    isSystem: false,
    userCount: 12,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'ROLE-003',
    name: 'Sales Rep',
    nameAr: 'مندوب مبيعات',
    description: 'View products and manage orders',
    descriptionAr: 'عرض المنتجات وإدارة الطلبات',
    permissions: ['products_view', 'orders_view', 'orders_manage'],
    isActive: true,
    isSystem: false,
    userCount: 25,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
]

const SellerRolesPage: React.FC = () => {
  const { t, isRTL } = useLanguage()
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(mockRoles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter roles
  useEffect(() => {
    let filtered = roles

    if (searchQuery) {
      filtered = filtered.filter(role => 
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.nameAr.includes(searchQuery) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRoles(filtered)
    setCurrentPage(1)
  }, [roles, searchQuery])

  // Pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage)

  const handleToggleRole = (roleId: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, isActive: !role.isActive }
        : role
    ))
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPermissionsByCategory = () => {
    const categories = Array.from(new Set(mockPermissions.map(p => p.category)))
    return categories.map(category => ({
      name: category,
      nameAr: mockPermissions.find(p => p.category === category)?.categoryAr || category,
      permissions: mockPermissions.filter(p => p.category === category)
    }))
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'إدارة الأدوار - البائعين' : 'Seller Role Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة أدوار وصلاحيات البائعين' : 'Manage seller roles and permissions'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsCreateEditOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? 'إضافة دور' : 'Add Role'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي الأدوار' : 'Total Roles'}</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'الأدوار النشطة' : 'Active Roles'}</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'أدوار النظام' : 'System Roles'}</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.isSystem).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي المستخدمين' : 'Total Users'}</p>
                <p className="text-2xl font-bold">{roles.reduce((sum, r) => sum + r.userCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-10"
                  placeholder={isRTL ? 'البحث في الأدوار...' : 'Search roles...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'اسم الدور' : 'Role Name'}</TableHead>
                <TableHead>{isRTL ? 'الوصف' : 'Description'}</TableHead>
                <TableHead>{isRTL ? 'الصلاحيات' : 'Permissions'}</TableHead>
                <TableHead>{isRTL ? 'المستخدمين' : 'Users'}</TableHead>
                <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isRTL ? 'آخر تحديث' : 'Last Updated'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {role.isSystem && <Shield className="w-4 h-4 text-blue-500" />}
                      <div>
                        <div className="font-medium">{isRTL ? role.nameAr : role.name}</div>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs">
                            {isRTL ? 'دور النظام' : 'System Role'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{isRTL ? role.descriptionAr : role.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">{role.permissions.length}</Badge>
                      <span className="text-sm text-gray-500">
                        {isRTL ? 'صلاحية' : 'permissions'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={role.isActive}
                        onCheckedChange={() => handleToggleRole(role.id)}
                        disabled={role.isSystem}
                      />
                      <span className={`text-sm ${role.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {role.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(role.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedRole(role)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setEditingRole(role)
                            setIsCreateEditOpen(true)
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            {isRTL ? 'تعديل' : 'Edit'}
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {isRTL ? 'حذف' : 'Delete'}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Role Details Modal */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {isRTL ? selectedRole.nameAr : selectedRole.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Role Info */}
              <div className="flex items-center gap-4">
                <Badge variant={selectedRole.isActive ? 'default' : 'secondary'}>
                  {selectedRole.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                </Badge>
                {selectedRole.isSystem && (
                  <Badge variant="outline">
                    {isRTL ? 'دور النظام' : 'System Role'}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedRole.userCount}</p>
                      <p className="text-sm text-gray-600">{isRTL ? 'مستخدم' : 'Users'}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedRole.permissions.length}</p>
                      <p className="text-sm text-gray-600">{isRTL ? 'صلاحية' : 'Permissions'}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Settings className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm font-medium">{isRTL ? 'تاريخ الإنشاء' : 'Created'}</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedRole.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'الصلاحيات' : 'Permissions'}</CardTitle>
                  <CardDescription>
                    {isRTL ? selectedRole.descriptionAr : selectedRole.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPermissionsByCategory().map((category) => {
                      const rolePermissions = selectedRole.permissions
                      const categoryPermissions = category.permissions.filter(p => 
                        rolePermissions.includes(p.id)
                      )
                      
                      if (categoryPermissions.length === 0) return null

                      return (
                        <div key={category.name} className="space-y-2">
                          <h4 className="font-medium text-gray-900">
                            {isRTL ? category.nameAr : category.name}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {isRTL ? permission.nameAr : permission.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {isRTL ? permission.descriptionAr : permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Role Modal */}
      <Dialog open={isCreateEditOpen} onOpenChange={(open) => {
        setIsCreateEditOpen(open)
        if (!open) setEditingRole(null)
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {editingRole 
                ? (isRTL ? 'تعديل الدور' : 'Edit Role')
                : (isRTL ? 'إضافة دور جديد' : 'Add New Role')
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{isRTL ? 'اسم الدور (إنجليزي)' : 'Role Name (English)'}</Label>
                  <Input id="name" placeholder={isRTL ? 'أدخل اسم الدور' : 'Enter role name'} />
                </div>
                <div>
                  <Label htmlFor="nameAr">{isRTL ? 'اسم الدور (عربي)' : 'Role Name (Arabic)'}</Label>
                  <Input id="nameAr" placeholder={isRTL ? 'أدخل اسم الدور بالعربية' : 'Enter Arabic role name'} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                  <Textarea id="description" placeholder={isRTL ? 'أدخل وصف الدور' : 'Enter role description'} />
                </div>
                <div>
                  <Label htmlFor="descriptionAr">{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                  <Textarea id="descriptionAr" placeholder={isRTL ? 'أدخل وصف الدور بالعربية' : 'Enter Arabic role description'} />
                </div>
              </div>
            </div>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الصلاحيات' : 'Permissions'}</CardTitle>
                <CardDescription>
                  {isRTL ? 'اختر الصلاحيات لهذا الدور' : 'Select permissions for this role'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getPermissionsByCategory().map((category) => (
                    <div key={category.name} className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {isRTL ? category.nameAr : category.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox id={permission.id} />
                            <div className="flex-1">
                              <Label htmlFor={permission.id} className="text-sm font-medium">
                                {isRTL ? permission.nameAr : permission.name}
                              </Label>
                              <p className="text-xs text-gray-600 mt-1">
                                {isRTL ? permission.descriptionAr : permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateEditOpen(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button>
                {editingRole 
                  ? (isRTL ? 'تحديث الدور' : 'Update Role')
                  : (isRTL ? 'إنشاء الدور' : 'Create Role')
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SellerRolesPage