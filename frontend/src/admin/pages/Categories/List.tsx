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
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  DollarSign,
  ShoppingCart,
  ExternalLink
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

interface Product {
  id: string
  name: string
  nameAr: string
  sku: string
  price: number
  currency: string
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  sellerName: string
  sellerId: string
  images: string[]
  createdDate: string
  rating: number
  reviewCount: number
  categoryId: string
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    nameAr: 'Electronics',
    description: 'Consumer and business electronics',
    descriptionAr: 'Consumer and business electronics',
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
    nameAr: 'Smart Home Devices',
    description: 'Internet-connected devices for home automation',
    descriptionAr: 'Internet-connected devices for home automation',
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
    nameAr: 'Industrial Equipment',
    description: 'Heavy machinery and industrial tools',
    descriptionAr: 'Heavy machinery and industrial tools',
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
    nameAr: 'Construction Tools',
    description: 'Professional construction and building tools',
    descriptionAr: 'Professional construction and building tools',
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
    nameAr: 'Medical Supplies',
    description: 'Healthcare and medical equipment',
    descriptionAr: 'Healthcare and medical equipment',
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
    nameAr: 'Diagnostic Equipment',
    description: 'Medical diagnostic and monitoring devices',
    descriptionAr: 'Medical diagnostic and monitoring devices',
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
    nameAr: 'Office Supplies',
    description: 'Business and office equipment',
    descriptionAr: 'Business and office equipment',
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
    nameAr: 'Automotive Parts',
    description: 'Vehicle parts and automotive accessories',
    descriptionAr: 'Vehicle parts and automotive accessories',
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

const mockProducts: Product[] = [
  // Electronics category products
  {
    id: 'P001',
    name: 'iPhone 15 Pro',
    nameAr: 'iPhone 15 Pro',
    sku: 'APL-IP15P-256',
    price: 4999,
    currency: 'SAR',
    stock: 25,
    status: 'active',
    sellerName: 'TechStore KSA',
    sellerId: 'S001',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200'],
    createdDate: '2024-01-15T10:00:00Z',
    rating: 4.8,
    reviewCount: 124,
    categoryId: '1'
  },
  {
    id: 'P002',
    name: 'Samsung Galaxy S24',
    nameAr: 'Samsung Galaxy S24',
    sku: 'SAM-GS24-128',
    price: 3299,
    currency: 'SAR',
    stock: 15,
    status: 'active',
    sellerName: 'ElectroMax',
    sellerId: 'S002',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200'],
    createdDate: '2024-01-18T14:30:00Z',
    rating: 4.6,
    reviewCount: 89,
    categoryId: '1'
  },
  // Smart Home Devices
  {
    id: 'P003',
    name: 'Smart Security Camera',
    nameAr: 'Smart Security Camera',
    sku: 'SMT-CAM-001',
    price: 899,
    currency: 'SAR',
    stock: 40,
    status: 'active',
    sellerName: 'SmartHome Solutions',
    sellerId: 'S003',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200'],
    createdDate: '2024-01-20T09:15:00Z',
    rating: 4.4,
    reviewCount: 56,
    categoryId: '2'
  },
  // Industrial Equipment
  {
    id: 'P004',
    name: 'Industrial Drill Press',
    nameAr: 'Industrial Drill Press',
    sku: 'IND-DRL-500',
    price: 12500,
    currency: 'SAR',
    stock: 5,
    status: 'active',
    sellerName: 'Industrial Tools KSA',
    sellerId: 'S004',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200'],
    createdDate: '2024-01-12T11:20:00Z',
    rating: 4.9,
    reviewCount: 23,
    categoryId: '3'
  },
  {
    id: 'P005',
    name: 'Hydraulic Pump',
    nameAr: 'Hydraulic Pump',
    sku: 'HYD-PMP-2000',
    price: 8750,
    currency: 'SAR',
    stock: 8,
    status: 'active',
    sellerName: 'Heavy Machinery Co',
    sellerId: 'S005',
    images: ['https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=200'],
    createdDate: '2024-01-14T16:45:00Z',
    rating: 4.7,
    reviewCount: 31,
    categoryId: '3'
  },
  // Construction Tools
  {
    id: 'P006',
    name: 'Professional Concrete Mixer',
    nameAr: 'Professional Concrete Mixer',
    sku: 'CON-MIX-350',
    price: 4200,
    currency: 'SAR',
    stock: 12,
    status: 'active',
    sellerName: 'BuildPro Equipment',
    sellerId: 'S006',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200'],
    createdDate: '2024-01-16T13:30:00Z',
    rating: 4.5,
    reviewCount: 18,
    categoryId: '4'
  },
  // Medical Supplies
  {
    id: 'P007',
    name: 'Digital Blood Pressure Monitor',
    nameAr: 'Digital Blood Pressure Monitor',
    sku: 'MED-BP-001',
    price: 650,
    currency: 'SAR',
    stock: 30,
    status: 'active',
    sellerName: 'MediCare Supplies',
    sellerId: 'S007',
    images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200'],
    createdDate: '2024-01-19T10:15:00Z',
    rating: 4.6,
    reviewCount: 42,
    categoryId: '5'
  },
  // Diagnostic Equipment
  {
    id: 'P008',
    name: 'Ultrasound Scanner',
    nameAr: 'Ultrasound Scanner',
    sku: 'MED-US-PRO',
    price: 45000,
    currency: 'SAR',
    stock: 2,
    status: 'active',
    sellerName: 'Advanced Medical Tech',
    sellerId: 'S008',
    images: ['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200'],
    createdDate: '2024-01-17T14:20:00Z',
    rating: 4.9,
    reviewCount: 12,
    categoryId: '6'
  }
]

export default function CategoriesList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryDetailsOpen, setCategoryDetailsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productDetailsOpen, setProductDetailsOpen] = useState(false)

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

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getProductsForCategory = (categoryId: string) => {
    return mockProducts.filter(product => product.categoryId === categoryId)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductDetailsOpen(true)
  }

  const getProductStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      inactive: { label: 'Inactive', variant: 'secondary' as const },
      out_of_stock: { label: 'Out of Stock', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
    }).format(amount)
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
              {filteredCategories.map((category) => {
                const categoryProducts = getProductsForCategory(category.id)
                const isExpanded = expandedCategories.has(category.id)
                
                return (
                  <React.Fragment key={category.id}>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                            onClick={() => toggleCategoryExpansion(category.id)}
                            disabled={categoryProducts.length === 0}
                          >
                            {categoryProducts.length > 0 ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )
                            ) : null}
                          </Button>
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
                          {categoryProducts.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({categoryProducts.length} shown)
                            </span>
                          )}
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
                    
                    {/* Expanded Products Section */}
                    {isExpanded && categoryProducts.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="p-0 bg-muted/20">
                          <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                              <Package className="w-4 h-4" />
                              Products in {category.name} ({categoryProducts.length})
                            </div>
                            <div className="grid gap-3">
                              {categoryProducts.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between p-3 bg-background rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                      {product.images[0] ? (
                                        <img
                                          src={product.images[0]}
                                          alt={product.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{product.name}</span>
                                        {getProductStatusBadge(product.status)}
                                      </div>
                                      <div className="text-sm text-muted-foreground">{product.nameAr}</div>
                                      <div className="text-xs text-muted-foreground">
                                        SKU: {product.sku} • by {product.sellerName}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <div className="font-medium text-lg">
                                        {formatCurrency(product.price, product.currency)}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Stock: {product.stock}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span>{product.rating}</span>
                                        <span className="text-muted-foreground">({product.reviewCount})</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewProduct(product)}
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
                                            Edit Product
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            View on Store
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            View Orders
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Product
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
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

      {/* Product Details Dialog */}
      <Dialog open={productDetailsOpen} onOpenChange={setProductDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              {selectedProduct && `View and manage ${selectedProduct.name} product information`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Header */}
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedProduct.images[0] ? (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                    {getProductStatusBadge(selectedProduct.status)}
                  </div>
                  <p className="text-muted-foreground">{selectedProduct.nameAr}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>SKU: {selectedProduct.sku}</span>
                    <span>•</span>
                    <span>by {selectedProduct.sellerName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-muted-foreground">({selectedProduct.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Product Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Product Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Status:</span>
                      {getProductStatusBadge(selectedProduct.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Stock:</span>
                      <span className={`font-medium ${selectedProduct.stock < 10 ? 'text-destructive' : 'text-foreground'}`}>
                        {selectedProduct.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Price:</span>
                      <span className="font-medium">{formatCurrency(selectedProduct.price, selectedProduct.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Created:</span>
                      <span className="text-sm">
                        {new Date(selectedProduct.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Seller:</span>
                      <span className="font-medium">{selectedProduct.sellerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Seller ID:</span>
                      <span className="text-sm font-mono">{selectedProduct.sellerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedProduct.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Reviews:</span>
                      <span className="font-medium">{selectedProduct.reviewCount}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Store
                </Button>
                <Button>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}