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
  Folder, 
  FolderOpen,
  Package, 
  Users, 
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Settings,
  Archive,
  ArchiveRestore
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/utils/cn'

interface CategoryNode {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  slug: string
  status: 'active' | 'inactive' | 'archived'
  productCount: number
  sellerCount: number
  level: number
  sortOrder: number
  featured: boolean
  icon: string
  children: CategoryNode[]
  parentId: string | null
  createdDate: string
  updatedDate: string
}

const mockCategoryTree: CategoryNode[] = [
  {
    id: '1',
    name: 'Electronics',
    nameAr: 'الإلكترونيات',
    description: 'Consumer and business electronics',
    descriptionAr: 'الإلكترونيات الاستهلاكية والتجارية',
    slug: 'electronics',
    status: 'active',
    productCount: 1250,
    sellerCount: 85,
    level: 0,
    sortOrder: 1,
    featured: true,
    icon: 'smartphone',
    parentId: null,
    createdDate: '2024-01-01T10:00:00Z',
    updatedDate: '2024-01-15T14:30:00Z',
    children: [
      {
        id: '2',
        name: 'Smart Home Devices',
        nameAr: 'أجهزة المنزل الذكي',
        description: 'Internet-connected devices for home automation',
        descriptionAr: 'أجهزة متصلة بالإنترنت لأتمتة المنزل',
        slug: 'smart-home-devices',
        status: 'active',
        productCount: 185,
        sellerCount: 12,
        level: 1,
        sortOrder: 1,
        featured: false,
        icon: 'home',
        parentId: '1',
        createdDate: '2024-01-20T10:00:00Z',
        updatedDate: '2024-01-20T10:00:00Z',
        children: [
          {
            id: '9',
            name: 'Smart Lighting',
            nameAr: 'الإضاءة الذكية',
            description: 'Smart LED bulbs and lighting systems',
            descriptionAr: 'لمبات LED الذكية وأنظمة الإضاءة',
            slug: 'smart-lighting',
            status: 'active',
            productCount: 45,
            sellerCount: 8,
            level: 2,
            sortOrder: 1,
            featured: false,
            icon: 'lightbulb',
            parentId: '2',
            createdDate: '2024-01-21T09:00:00Z',
            updatedDate: '2024-01-21T09:00:00Z',
            children: []
          },
          {
            id: '10',
            name: 'Smart Security',
            nameAr: 'الأمان الذكي',
            description: 'Smart cameras, doorbells, and security systems',
            descriptionAr: 'كاميرات ذكية وأجراس الأبواب وأنظمة الأمان',
            slug: 'smart-security',
            status: 'active',
            productCount: 78,
            sellerCount: 6,
            level: 2,
            sortOrder: 2,
            featured: false,
            icon: 'shield',
            parentId: '2',
            createdDate: '2024-01-21T10:30:00Z',
            updatedDate: '2024-01-21T10:30:00Z',
            children: []
          }
        ]
      },
      {
        id: '11',
        name: 'Computer Hardware',
        nameAr: 'عتاد الكمبيوتر',
        description: 'Computer components and peripherals',
        descriptionAr: 'مكونات الكمبيوتر والملحقات',
        slug: 'computer-hardware',
        status: 'active',
        productCount: 425,
        sellerCount: 32,
        level: 1,
        sortOrder: 2,
        featured: true,
        icon: 'cpu',
        parentId: '1',
        createdDate: '2024-01-10T14:00:00Z',
        updatedDate: '2024-01-18T11:20:00Z',
        children: []
      }
    ]
  },
  {
    id: '3',
    name: 'Industrial Equipment',
    nameAr: 'المعدات الصناعية',
    description: 'Heavy machinery and industrial tools',
    descriptionAr: 'الآلات الثقيلة والأدوات الصناعية',
    slug: 'industrial-equipment',
    status: 'active',
    productCount: 890,
    sellerCount: 42,
    level: 0,
    sortOrder: 2,
    featured: true,
    icon: 'settings',
    parentId: null,
    createdDate: '2024-01-05T09:00:00Z',
    updatedDate: '2024-01-18T16:20:00Z',
    children: [
      {
        id: '4',
        name: 'Construction Tools',
        nameAr: 'أدوات البناء',
        description: 'Professional construction and building tools',
        descriptionAr: 'أدوات البناء والتشييد المهنية',
        slug: 'construction-tools',
        status: 'active',
        productCount: 320,
        sellerCount: 18,
        level: 1,
        sortOrder: 1,
        featured: false,
        icon: 'wrench',
        parentId: '3',
        createdDate: '2024-01-10T11:00:00Z',
        updatedDate: '2024-01-16T09:45:00Z',
        children: []
      },
      {
        id: '12',
        name: 'Manufacturing Equipment',
        nameAr: 'معدات التصنيع',
        description: 'Industrial manufacturing machinery',
        descriptionAr: 'آلات التصنيع الصناعي',
        slug: 'manufacturing-equipment',
        status: 'active',
        productCount: 156,
        sellerCount: 12,
        level: 1,
        sortOrder: 2,
        featured: false,
        icon: 'factory',
        parentId: '3',
        createdDate: '2024-01-12T15:30:00Z',
        updatedDate: '2024-01-19T08:15:00Z',
        children: []
      }
    ]
  },
  {
    id: '5',
    name: 'Medical Supplies',
    nameAr: 'المستلزمات الطبية',
    description: 'Healthcare and medical equipment',
    descriptionAr: 'معدات الرعاية الصحية والطبية',
    slug: 'medical-supplies',
    status: 'active',
    productCount: 650,
    sellerCount: 25,
    level: 0,
    sortOrder: 3,
    featured: true,
    icon: 'heart-pulse',
    parentId: null,
    createdDate: '2024-01-03T08:30:00Z',
    updatedDate: '2024-01-19T13:15:00Z',
    children: [
      {
        id: '6',
        name: 'Diagnostic Equipment',
        nameAr: 'معدات التشخيص',
        description: 'Medical diagnostic and monitoring devices',
        descriptionAr: 'أجهزة التشخيص والمراقبة الطبية',
        slug: 'diagnostic-equipment',
        status: 'active',
        productCount: 85,
        sellerCount: 8,
        level: 1,
        sortOrder: 1,
        featured: false,
        icon: 'stethoscope',
        parentId: '5',
        createdDate: '2024-01-12T14:00:00Z',
        updatedDate: '2024-01-17T10:30:00Z',
        children: []
      }
    ]
  },
  {
    id: '7',
    name: 'Office Supplies',
    nameAr: 'مستلزمات المكاتب',
    description: 'Business and office equipment',
    descriptionAr: 'معدات الأعمال والمكاتب',
    slug: 'office-supplies',
    status: 'inactive',
    productCount: 420,
    sellerCount: 31,
    level: 0,
    sortOrder: 4,
    featured: false,
    icon: 'briefcase',
    parentId: null,
    createdDate: '2024-01-08T12:00:00Z',
    updatedDate: '2024-01-21T11:20:00Z',
    children: []
  }
]

export default function CategoryTree() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '3']))
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null)
  const [categoryDetailsOpen, setCategoryDetailsOpen] = useState(false)

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    const allNodeIds = new Set<string>()
    const collectIds = (nodes: CategoryNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          allNodeIds.add(node.id)
          collectIds(node.children)
        }
      })
    }
    collectIds(mockCategoryTree)
    setExpandedNodes(allNodeIds)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const getStatusBadge = (status: CategoryNode['status']) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      inactive: { label: 'Inactive', variant: 'secondary' as const },
      archived: { label: 'Archived', variant: 'outline' as const }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleViewCategory = (category: CategoryNode) => {
    setSelectedCategory(category)
    setCategoryDetailsOpen(true)
  }

  const filterCategories = (categories: CategoryNode[]): CategoryNode[] => {
    return categories.filter(category => {
      const matchesSearch = searchTerm === '' || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameAr.includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter
      
      return matchesSearch && matchesStatus
    }).map(category => ({
      ...category,
      children: filterCategories(category.children)
    }))
  }

  const renderCategoryNode = (category: CategoryNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(category.id)
    const hasChildren = category.children.length > 0
    const indentClass = `ml-${depth * 6}`

    return (
      <div key={category.id} className="select-none">
        <div 
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors",
            indentClass,
            category.status === 'inactive' && "opacity-60",
            category.status === 'archived' && "opacity-40"
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => toggleNode(category.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            
            <div className="flex items-center gap-2">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                ) : (
                  <Folder className="w-5 h-5 text-blue-500" />
                )
              ) : (
                <FolderTree className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">{category.name}</h3>
                {category.featured && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Featured
                  </Badge>
                )}
                {getStatusBadge(category.status)}
              </div>
              <p className="text-sm text-muted-foreground truncate">{category.nameAr}</p>
              <p className="text-xs text-muted-foreground truncate">{category.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{category.productCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{category.sellerCount}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewCategory(category)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Category
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subcategory
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Move Up
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Move Down
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
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-2 space-y-2">
            {category.children.map((child) => 
              renderCategoryNode(child, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  const filteredCategories = filterCategories(mockCategoryTree)

  const stats = {
    total: mockCategoryTree.reduce((acc, cat) => acc + 1 + cat.children.length, 0),
    active: mockCategoryTree.filter(cat => cat.status === 'active').length,
    rootCategories: mockCategoryTree.length,
    maxDepth: Math.max(...mockCategoryTree.map(cat => 
      cat.children.length > 0 ? 2 : 1
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Tree</h1>
          <p className="text-muted-foreground">Visual hierarchy of all product categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={collapseAll} className="gap-2">
            <FolderTree className="w-4 h-4" />
            Collapse All
          </Button>
          <Button variant="outline" onClick={expandAll} className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Expand All
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Root Categories</CardTitle>
            <div className="text-2xl font-bold text-blue-600">{stats.rootCategories}</div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Max Depth</CardTitle>
            <div className="text-2xl font-bold text-purple-600">{stats.maxDepth}</div>
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
          </div>
        </CardContent>
      </Card>

      {/* Category Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            Category Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => renderCategoryNode(category))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FolderTree className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No categories found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Details Dialog */}
      <Dialog open={categoryDetailsOpen} onOpenChange={setCategoryDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>
              {selectedCategory && `Details for ${selectedCategory.name} category`}
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
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Name</div>
                      <div className="font-medium">{selectedCategory.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Arabic Name</div>
                      <div className="font-medium">{selectedCategory.nameAr}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Description</div>
                      <div className="text-sm">{selectedCategory.description}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      {getStatusBadge(selectedCategory.status)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hierarchy & Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Level:</span>
                      <Badge variant="outline">Level {selectedCategory.level}</Badge>
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
                      <span className="text-sm font-medium text-muted-foreground">Sort Order:</span>
                      <span className="font-medium">{selectedCategory.sortOrder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Featured:</span>
                      <Badge variant={selectedCategory.featured ? 'default' : 'outline'}>
                        {selectedCategory.featured ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subcategories */}
              {selectedCategory.children.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FolderTree className="w-5 h-5" />
                      Subcategories ({selectedCategory.children.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedCategory.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Folder className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="font-medium">{child.name}</div>
                              <div className="text-sm text-muted-foreground">{child.nameAr}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                              {child.productCount} products
                            </div>
                            {getStatusBadge(child.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Audit Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Created:</span>
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
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Slug:</span>
                    <span className="text-sm font-mono">{selectedCategory.slug}</span>
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