import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  BarChart3,
  Package,
  TrendingUp,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Globe,
  Users,
  DollarSign,
  Calendar,
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tag,
  TreePine,
  Grid3X3,
  List,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Badge } from '@/shared/components/ui/badge'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs'
import { Progress } from '@/shared/components/ui/progress'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'

interface Category {
  id: string
  name: string
  nameAr: string
  description?: string
  descriptionAr?: string
  parentId?: string
  children?: Category[]
  isActive: boolean
  productsCount: number
  sellersCount: number
  revenue: number
  growth: number
  popularity: number
  icon?: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'pending' | 'archived'
  featured: boolean
  seoKeywords?: string[]
  commission: number
}

interface CategoryStats {
  totalCategories: number
  activeCategories: number
  pendingRequests: number
  totalRevenue: number
  growthRate: number
  topPerforming: Category[]
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics & Technology',
    nameAr: 'Electronics and Technology',
    description: 'Consumer electronics, computers, and technology products',
    descriptionAr: 'Consumer electronics, computers, and technology products',
    isActive: true,
    productsCount: 1250,
    sellersCount: 89,
    revenue: 2450000,
    growth: 15.8,
    popularity: 95,
    status: 'active',
    featured: true,
    commission: 5.5,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-10',
    seoKeywords: ['electronics', 'technology', 'gadgets', 'computers'],
    children: [
      {
        id: '1-1',
        name: 'Smartphones',
        nameAr: 'Smartphones',
        parentId: '1',
        isActive: true,
        productsCount: 340,
        sellersCount: 45,
        revenue: 890000,
        growth: 22.3,
        popularity: 98,
        status: 'active',
        featured: true,
        commission: 6.0,
        createdAt: '2023-02-01',
        updatedAt: '2024-01-08'
      },
      {
        id: '1-2',
        name: 'Laptops & Computers',
        nameAr: 'Laptops & Desktop Computers',
        parentId: '1',
        isActive: true,
        productsCount: 280,
        sellersCount: 32,
        revenue: 650000,
        growth: 18.7,
        popularity: 87,
        status: 'active',
        featured: false,
        commission: 5.0,
        createdAt: '2023-02-01',
        updatedAt: '2024-01-08'
      }
    ]
  },
  {
    id: '2',
    name: 'Fashion & Apparel',
    nameAr: 'Fashion & Apparel',
    description: 'Clothing, accessories, and fashion items',
    descriptionAr: 'Clothing, accessories, and fashion items',
    isActive: true,
    productsCount: 890,
    sellersCount: 156,
    revenue: 1850000,
    growth: 12.4,
    popularity: 92,
    status: 'active',
    featured: true,
    commission: 8.0,
    createdAt: '2023-01-20',
    updatedAt: '2024-01-09',
    seoKeywords: ['fashion', 'clothing', 'apparel', 'style'],
    children: [
      {
        id: '2-1',
        name: "Men's Clothing",
        nameAr: "Men's Clothing",
        parentId: '2',
        isActive: true,
        productsCount: 420,
        sellersCount: 78,
        revenue: 920000,
        growth: 14.2,
        popularity: 89,
        status: 'active',
        featured: true,
        commission: 8.5,
        createdAt: '2023-02-15',
        updatedAt: '2024-01-07'
      }
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    nameAr: 'Home & Garden',
    description: 'Home improvement, furniture, and garden supplies',
    descriptionAr: 'Home improvement, furniture, and garden supplies',
    isActive: true,
    productsCount: 650,
    sellersCount: 112,
    revenue: 1200000,
    growth: 8.9,
    popularity: 78,
    status: 'active',
    featured: false,
    commission: 6.5,
    createdAt: '2023-03-01',
    updatedAt: '2024-01-05',
    seoKeywords: ['home', 'garden', 'furniture', 'decoration']
  },
  {
    id: '4',
    name: 'Automotive',
    nameAr: 'Automotive',
    description: 'Car parts, accessories, and automotive products',
    descriptionAr: 'Car parts, accessories, and automotive products',
    isActive: false,
    productsCount: 45,
    sellersCount: 12,
    revenue: 180000,
    growth: -5.2,
    popularity: 45,
    status: 'inactive',
    featured: false,
    commission: 4.0,
    createdAt: '2023-04-10',
    updatedAt: '2023-12-20',
    seoKeywords: ['automotive', 'cars', 'parts', 'accessories']
  }
]

const mockStats: CategoryStats = {
  totalCategories: 156,
  activeCategories: 142,
  pendingRequests: 8,
  totalRevenue: 5680000,
  growthRate: 13.2,
  topPerforming: mockCategories.slice(0, 3)
}

export default function CategoryManagement() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['1', '2']))

  // Filter categories based on search and status
  const filteredCategories = useMemo(() => {
    return mockCategories.filter(category => {
      const matchesSearch = searchTerm === '' || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameAr.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getStatusColor = (status: Category['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archived': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const CategoryCard: React.FC<{ category: Category; level?: number }> = ({ category, level = 0 }) => (
    <Card className="mb-3 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" style={{ marginLeft: `${level * 20}px` }}>
            {category.children && category.children.length > 0 && (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {category.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">
                  {isRTL ? category.nameAr : category.name}
                </h3>
                <Badge className={getStatusColor(category.status)}>
                  {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                </Badge>
                {category.featured && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Tag className="h-3 w-3 mr-1" />
                    {isRTL ? 'Featured' : 'Featured'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isRTL ? category.descriptionAr : category.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Metrics */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{category.productsCount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">{isRTL ? 'Products' : 'Products'}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{category.sellersCount}</span>
                </div>
                <p className="text-xs text-gray-500">{isRTL ? 'Sellers' : 'Sellers'}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">${(category.revenue / 1000).toFixed(0)}K</span>
                </div>
                <p className="text-xs text-gray-500">{isRTL ? 'Revenue' : 'Revenue'}</p>
              </div>
              
              <div className="text-center">
                <div className={`flex items-center space-x-1 ${getGrowthColor(category.growth)}`}>
                  {category.growth > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : category.growth < 0 ? (
                    <ArrowDownRight className="h-4 w-4" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  <span className="font-medium">{Math.abs(category.growth)}%</span>
                </div>
                <p className="text-xs text-gray-500">{isRTL ? 'Growth' : 'Growth'}</p>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{isRTL ? 'Actions' : 'Actions'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setSelectedCategory(category)
                  setIsEditModalOpen(true)
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isRTL ? 'Edit' : 'Edit'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {isRTL ? 'View Analytics' : 'View Analytics'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  {isRTL ? 'View Products' : 'View Products'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isRTL ? 'Delete' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
      
      {/* Child Categories */}
      {expandedCategories.has(category.id) && category.children && (
        <div className="ml-6 border-l border-gray-200 pl-4">
          {category.children.map(child => (
            <CategoryCard key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </Card>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'Category Management' : 'Category Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL ? 'Manage and organize product categories in your marketplace' : 'Manage and organize product categories in your marketplace'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {isRTL ? 'Export' : 'Export'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            {isRTL ? 'Import' : 'Import'}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {isRTL ? 'Add Category' : 'Add Category'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              {isRTL ? 'Total Categories' : 'Total Categories'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCategories}</div>
            <Progress value={(mockStats.activeCategories / mockStats.totalCategories) * 100} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {mockStats.activeCategories} {isRTL ? 'active' : 'active'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {isRTL ? 'Active Categories' : 'Active Categories'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.activeCategories}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +5.2% {isRTL ? 'from last month' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {isRTL ? 'Pending Requests' : 'Pending Requests'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockStats.pendingRequests}</div>
            <p className="text-xs text-yellow-600 mt-1">
              {isRTL ? 'Need review' : 'Need review'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {isRTL ? 'Total Revenue' : 'Total Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(mockStats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{mockStats.growthRate}% {isRTL ? 'growth' : 'growth'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              {isRTL ? 'Performance' : 'Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <p className="text-xs text-gray-500 mt-1">
              {isRTL ? 'Avg popularity' : 'Avg popularity'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={isRTL ? 'Search categories...' : 'Search categories...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={isRTL ? 'Filter by status' : 'Filter by status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'All Status' : 'All Status'}</SelectItem>
                  <SelectItem value="active">{isRTL ? 'Active' : 'Active'}</SelectItem>
                  <SelectItem value="inactive">{isRTL ? 'Inactive' : 'Inactive'}</SelectItem>
                  <SelectItem value="pending">{isRTL ? 'Pending' : 'Pending'}</SelectItem>
                  <SelectItem value="archived">{isRTL ? 'Archived' : 'Archived'}</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'tree' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tree')}
                  className="rounded-r-none"
                >
                  <TreePine className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none border-x"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category List */}
      <div className="space-y-4">
        {filteredCategories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {isRTL ? 'Add New Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{isRTL ? 'Basic Info' : 'Basic Info'}</TabsTrigger>
              <TabsTrigger value="settings">{isRTL ? 'Settings' : 'Settings'}</TabsTrigger>
              <TabsTrigger value="seo">{isRTL ? 'SEO' : 'SEO'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? 'Name (English)' : 'Name (English)'}</label>
                  <Input placeholder="Enter category name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? 'Name (Arabic)' : 'Name (Arabic)'}</label>
                  <Input placeholder="Enter category name in Arabic" dir="rtl" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? 'Description (English)' : 'Description (English)'}</label>
                  <Textarea placeholder="Enter category description" rows={3} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? 'Description (Arabic)' : 'Description (Arabic)'}</label>
                  <Textarea placeholder="Enter category description in Arabic" dir="rtl" rows={3} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{isRTL ? 'Parent Category' : 'Parent Category'}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'Select parent category' : 'Select parent category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{isRTL ? 'No parent category' : 'No parent category'}</SelectItem>
                    {mockCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {isRTL ? category.nameAr : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? 'Commission Rate (%)' : 'Commission Rate (%)'}</label>
                  <Input type="number" placeholder="0.00" step="0.01" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isRTL ? 'Status' : 'Status'}</label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{isRTL ? 'Active' : 'Active'}</SelectItem>
                      <SelectItem value="inactive">{isRTL ? 'Inactive' : 'Inactive'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="featured" className="rounded" />
                <label htmlFor="featured" className="text-sm font-medium">
                  {isRTL ? 'Featured category' : 'Featured category'}
                </label>
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{isRTL ? 'SEO Keywords' : 'SEO Keywords'}</label>
                <Input placeholder={isRTL ? 'keyword1, keyword2, keyword3' : 'keyword1, keyword2, keyword3'} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{isRTL ? 'Meta Description' : 'Meta Description'}</label>
                <Textarea 
                  placeholder={isRTL ? 'Brief description for search engines' : 'Brief description for search engines'} 
                  rows={3} 
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              {isRTL ? 'Cancel' : 'Cancel'}
            </Button>
            <Button onClick={() => setIsCreateModalOpen(false)}>
              {isRTL ? 'Create Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}