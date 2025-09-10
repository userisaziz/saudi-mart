import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  MoreHorizontal, 
  FolderTree, 
  Package, 
  Globe, 
  Users, 
  Calendar,
  Archive,
  ArchiveRestore,
  Settings
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'

interface Category {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  slug: string
  parentId: string | null
  parentName?: string
  level: number
  status: 'active' | 'inactive' | 'archived'
  productCount: number
  sellerCount: number
  createdBy: string
  createdByName: string
  createdDate: string
  updatedDate: string
  icon: string
  image?: string
  featured: boolean
  sortOrder: number
  seoTitle?: string
  seoDescription?: string
  attributes: string[]
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    nameAr: 'الإلكترونيات',
    description: 'Consumer and business electronics',
    descriptionAr: 'الإلكترونيات الاستهلاكية والتجارية',
    slug: 'electronics',
    parentId: null,
    level: 0,
    status: 'active',
    productCount: 1250,
    sellerCount: 85,
    createdBy: 'admin-001',
    createdByName: 'System Admin',
    createdDate: '2024-01-01T10:00:00Z',
    updatedDate: '2024-01-15T14:30:00Z',
    icon: 'smartphone',
    featured: true,
    sortOrder: 1,
    seoTitle: 'Electronics - Saudi B2B Marketplace',
    seoDescription: 'Find the best electronics for your business needs',
    attributes: ['Brand', 'Model', 'Warranty', 'Power Rating']
  },
  {
    id: '2',
    name: 'Smart Home Devices',
    nameAr: 'أجهزة المنزل الذكي',
    description: 'Internet-connected devices for home automation',
    descriptionAr: 'أجهزة متصلة بالإنترنت لأتمتة المنزل',
    slug: 'smart-home-devices',
    parentId: '1',
    parentName: 'Electronics',
    level: 1,
    status: 'active',
    productCount: 185,
    sellerCount: 12,
    createdBy: 'admin-001',
    createdByName: 'System Admin',
    createdDate: '2024-01-20T10:00:00Z',
    updatedDate: '2024-01-20T10:00:00Z',
    icon: 'home',
    featured: false,
    sortOrder: 1,
    attributes: ['Connectivity', 'Compatibility', 'Power Source']
  },
  {
    id: '3',
    name: 'Industrial Equipment',
    nameAr: 'المعدات الصناعية',
    description: 'Heavy machinery and industrial tools',
    descriptionAr: 'الآلات الثقيلة والأدوات الصناعية',
    slug: 'industrial-equipment',
    parentId: null,
    level: 0,
    status: 'active',
    productCount: 890,
    sellerCount: 42,
    createdBy: 'admin-002',
    createdByName: 'Category Manager',
    createdDate: '2024-01-05T09:00:00Z',
    updatedDate: '2024-01-18T16:20:00Z',
    icon: 'settings',
    featured: true,
    sortOrder: 2,
    attributes: ['Capacity', 'Power', 'Certification', 'Material']
  },
  {
    id: '4',
    name: 'Construction Tools',
    nameAr: 'أدوات البناء',
    description: 'Professional construction and building tools',
    descriptionAr: 'أدوات البناء والتشييد المهنية',
    slug: 'construction-tools',
    parentId: '3',
    parentName: 'Industrial Equipment',
    level: 1,
    status: 'active',
    productCount: 320,
    sellerCount: 18,
    createdBy: 'admin-002',
    createdByName: 'Category Manager',
    createdDate: '2024-01-10T11:00:00Z',
    updatedDate: '2024-01-16T09:45:00Z',
    icon: 'wrench',
    featured: false,
    sortOrder: 1,
    attributes: ['Tool Type', 'Material', 'Size', 'Safety Rating']
  },
  {
    id: '5',
    name: 'Medical Supplies',
    nameAr: 'المستلزمات الطبية',
    description: 'Healthcare and medical equipment',
    descriptionAr: 'معدات الرعاية الصحية والطبية',
    slug: 'medical-supplies',
    parentId: null,
    level: 0,
    status: 'active',
    productCount: 650,
    sellerCount: 25,
    createdBy: 'admin-003',
    createdByName: 'Medical Admin',
    createdDate: '2024-01-03T08:30:00Z',
    updatedDate: '2024-01-19T13:15:00Z',
    icon: 'heart-pulse',
    featured: true,
    sortOrder: 3,
    attributes: ['Certification', 'Sterility', 'Expiry Date', 'Usage Type']
  },
  {
    id: '6',
    name: 'Diagnostic Equipment',
    nameAr: 'معدات التشخيص',
    description: 'Medical diagnostic and monitoring devices',
    descriptionAr: 'أجهزة التشخيص والمراقبة الطبية',
    slug: 'diagnostic-equipment',
    parentId: '5',
    parentName: 'Medical Supplies',
    level: 1,
    status: 'active',
    productCount: 85,
    sellerCount: 8,
    createdBy: 'admin-003',
    createdByName: 'Medical Admin',
    createdDate: '2024-01-12T14:00:00Z',
    updatedDate: '2024-01-17T10:30:00Z',
    icon: 'stethoscope',
    featured: false,
    sortOrder: 1,
    attributes: ['Accuracy', 'Calibration', 'Display Type', 'Connectivity']
  },
  {
    id: '7',
    name: 'Office Supplies',
    nameAr: 'مستلزمات المكاتب',
    description: 'Business and office equipment',
    descriptionAr: 'معدات الأعمال والمكاتب',
    slug: 'office-supplies',
    parentId: null,
    level: 0,
    status: 'inactive',
    productCount: 420,
    sellerCount: 31,
    createdBy: 'admin-001',
    createdByName: 'System Admin',
    createdDate: '2024-01-08T12:00:00Z',
    updatedDate: '2024-01-21T11:20:00Z',
    icon: 'briefcase',
    featured: false,
    sortOrder: 4,
    attributes: ['Brand', 'Size', 'Color', 'Material']
  },
  {
    id: '8',
    name: 'Automotive Parts',
    nameAr: 'قطع غيار السيارات',
    description: 'Vehicle parts and automotive accessories',
    descriptionAr: 'قطع غيار المركبات وإكسسوارات السيارات',
    slug: 'automotive-parts',
    parentId: null,
    level: 0,
    status: 'archived',
    productCount: 75,
    sellerCount: 5,
    createdBy: 'admin-004',
    createdByName: 'Automotive Admin',
    createdDate: '2024-01-02T15:30:00Z',
    updatedDate: '2024-01-14T08:45:00Z',
    icon: 'car',
    featured: false,
    sortOrder: 5,
    attributes: ['Vehicle Make', 'Vehicle Model', 'Year', 'Part Number']
  }
]

export default function CategoriesList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryDetailsOpen, setCategoryDetailsOpen] = useState(false)

  const filteredCategories = mockCategories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nameAr.includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.descriptionAr.includes(searchTerm) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter
    const matchesLevel = levelFilter === 'all' || category.level.toString() === levelFilter
    
    return matchesSearch && matchesStatus && matchesLevel
  })

  const getStatusBadge = (status: Category['status']) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      inactive: { label: 'Inactive', variant: 'secondary' as const },
      archived: { label: 'Archived', variant: 'outline' as const }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getLevelBadge = (level: number) => {
    const levelConfig = {
      0: { label: 'Root', variant: 'default' as const },
      1: { label: 'Sub', variant: 'secondary' as const },
      2: { label: 'Child', variant: 'outline' as const }
    }
    
    const config = levelConfig[level as keyof typeof levelConfig] || { label: `Level ${level}`, variant: 'outline' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category)
    setCategoryDetailsOpen(true)
  }

  const stats = {
    total: mockCategories.length,
    active: mockCategories.filter(c => c.status === 'active').length,
    inactive: mockCategories.filter(c => c.status === 'inactive').length,
    archived: mockCategories.filter(c => c.status === 'archived').length,
    root: mockCategories.filter(c => c.level === 0).length,
    featured: mockCategories.filter(c => c.featured).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and their hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FolderTree className="w-4 h-4" />
            Tree View
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
            <div className="text-2xl font-bold text-orange-600">{stats.inactive}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Archived</CardTitle>
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Root Categories</CardTitle>
            <div className="text-2xl font-bold text-blue-600">{stats.root}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="0">Root Level</SelectItem>
                <SelectItem value="1">Sub Level</SelectItem>
                <SelectItem value="2">Child Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sellers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <FolderTree className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          {category.featured && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{category.nameAr}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.parentName ? (
                      <div className="flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{category.parentName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Root Category</span>
                    )}
                  </TableCell>
                  <TableCell>{getLevelBadge(category.level)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{category.productCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{category.sellerCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(category.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(category.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {category.createdByName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewCategory(category)}
                        className="gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FolderTree className="w-4 h-4 mr-2" />
                            View Subcategories
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="w-4 h-4 mr-2" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {category.status === 'archived' ? (
                            <DropdownMenuItem>
                              <ArchiveRestore className="w-4 h-4 mr-2" />
                              Restore Category
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archive Category
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Category
                          </DropdownMenuItem>
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

      {/* Category Details Dialog */}
      <Dialog open={categoryDetailsOpen} onOpenChange={setCategoryDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>
              {selectedCategory && `Manage ${selectedCategory.name} category settings and information`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCategory && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Name (English)</div>
                      <div className="text-base font-medium">{selectedCategory.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Name (Arabic)</div>
                      <div className="text-base font-medium">{selectedCategory.nameAr}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Description</div>
                      <div className="text-sm">{selectedCategory.description}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Description (Arabic)</div>
                      <div className="text-sm">{selectedCategory.descriptionAr}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Slug</div>
                      <div className="text-sm font-mono">{selectedCategory.slug}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Category Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedCategory.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Level:</span>
                      {getLevelBadge(selectedCategory.level)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Products:</span>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span className="font-medium">{selectedCategory.productCount}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Sellers:</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{selectedCategory.sellerCount}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Featured:</span>
                      <Badge variant={selectedCategory.featured ? 'default' : 'outline'}>
                        {selectedCategory.featured ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Sort Order:</span>
                      <span className="font-medium">{selectedCategory.sortOrder}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SEO Information */}
              {selectedCategory.seoTitle && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      SEO Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">SEO Title</div>
                      <div className="text-sm">{selectedCategory.seoTitle}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">SEO Description</div>
                      <div className="text-sm">{selectedCategory.seoDescription}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Category Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.attributes.map((attr, index) => (
                      <Badge key={index} variant="secondary">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Created By:</span>
                    <span className="text-sm">{selectedCategory.createdByName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Created Date:</span>
                    <span className="text-sm">
                      {new Date(selectedCategory.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Last Updated:</span>
                    <span className="text-sm">
                      {new Date(selectedCategory.updatedDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}