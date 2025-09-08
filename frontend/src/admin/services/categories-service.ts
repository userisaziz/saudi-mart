export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  children?: Category[]
  level: number
  isActive: boolean
  sortOrder: number
  icon?: string
  slug: string
  metadata: {
    productCount: number
    totalRevenue: number
    isPopular: boolean
    featured: boolean
  }
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface CategoryFilters {
  search?: string
  parentId?: string
  isActive?: boolean
  level?: number
  isPopular?: boolean
  featured?: boolean
  hasProducts?: boolean
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
  path: string[]
  fullPath: string
}

export interface CategoryStats {
  totalCategories: number
  activeCategories: number
  featuredCategories: number
  categoriesWithProducts: number
  averageProductsPerCategory: number
  maxDepth: number
  newCategoriesThisMonth: number
}

export interface CategoryListResponse {
  data: Category[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Mock category data with hierarchical structure
const mockCategories: Category[] = [
  // Level 0 - Root categories
  {
    id: 'cat-1',
    name: 'Electronics',
    description: 'Electronic devices and components',
    level: 0,
    isActive: true,
    sortOrder: 1,
    icon: '🔌',
    slug: 'electronics',
    metadata: {
      productCount: 245,
      totalRevenue: 125000,
      isPopular: true,
      featured: true
    },
    seo: {
      metaTitle: 'Electronics - Professional B2B Electronics',
      metaDescription: 'Find professional electronics, components, and devices for your business needs.',
      keywords: ['electronics', 'components', 'devices', 'b2b electronics']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-2',
    name: 'Software',
    description: 'Software solutions and licenses',
    level: 0,
    isActive: true,
    sortOrder: 2,
    icon: '💻',
    slug: 'software',
    metadata: {
      productCount: 89,
      totalRevenue: 75000,
      isPopular: true,
      featured: true
    },
    seo: {
      metaTitle: 'Software Solutions - Business Software & Licenses',
      metaDescription: 'Professional software solutions and licenses for businesses.',
      keywords: ['software', 'licenses', 'business software', 'saas']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-3',
    name: 'Fashion & Apparel',
    description: 'Clothing, accessories, and fashion items',
    level: 0,
    isActive: true,
    sortOrder: 3,
    icon: '👔',
    slug: 'fashion-apparel',
    metadata: {
      productCount: 156,
      totalRevenue: 45000,
      isPopular: false,
      featured: false
    },
    seo: {
      metaTitle: 'Fashion & Apparel - B2B Clothing Solutions',
      metaDescription: 'Wholesale fashion, apparel, and clothing for businesses.',
      keywords: ['fashion', 'apparel', 'clothing', 'wholesale fashion']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-4',
    name: 'Industrial & Manufacturing',
    description: 'Industrial equipment and manufacturing supplies',
    level: 0,
    isActive: true,
    sortOrder: 4,
    icon: '🏭',
    slug: 'industrial-manufacturing',
    metadata: {
      productCount: 312,
      totalRevenue: 280000,
      isPopular: true,
      featured: true
    },
    seo: {
      metaTitle: 'Industrial & Manufacturing - B2B Industrial Solutions',
      metaDescription: 'Industrial equipment, machinery, and manufacturing supplies.',
      keywords: ['industrial', 'manufacturing', 'machinery', 'industrial equipment']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-5',
    name: 'Food & Beverage',
    description: 'Food products and beverage supplies',
    level: 0,
    isActive: true,
    sortOrder: 5,
    icon: '🍽️',
    slug: 'food-beverage',
    metadata: {
      productCount: 78,
      totalRevenue: 35000,
      isPopular: false,
      featured: false
    },
    seo: {
      metaTitle: 'Food & Beverage - B2B Food Solutions',
      metaDescription: 'Wholesale food products and beverage supplies for businesses.',
      keywords: ['food', 'beverage', 'wholesale food', 'food supplies']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  
  // Level 1 - Electronics subcategories
  {
    id: 'cat-1-1',
    name: 'Audio & Video',
    description: 'Audio equipment, speakers, and video devices',
    parentId: 'cat-1',
    level: 1,
    isActive: true,
    sortOrder: 1,
    icon: '🎵',
    slug: 'audio-video',
    metadata: {
      productCount: 45,
      totalRevenue: 25000,
      isPopular: true,
      featured: false
    },
    seo: {
      metaTitle: 'Audio & Video Equipment - Professional AV Solutions',
      metaDescription: 'Professional audio and video equipment for business use.',
      keywords: ['audio', 'video', 'speakers', 'av equipment']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-1-2',
    name: 'Security Systems',
    description: 'Security cameras, alarms, and monitoring systems',
    parentId: 'cat-1',
    level: 1,
    isActive: true,
    sortOrder: 2,
    icon: '🔒',
    slug: 'security-systems',
    metadata: {
      productCount: 67,
      totalRevenue: 45000,
      isPopular: true,
      featured: true
    },
    seo: {
      metaTitle: 'Security Systems - Professional Security Equipment',
      metaDescription: 'Security cameras, alarms, and monitoring systems for businesses.',
      keywords: ['security', 'cameras', 'alarms', 'monitoring']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-1-3',
    name: 'Computer Hardware',
    description: 'Computers, components, and peripherals',
    parentId: 'cat-1',
    level: 1,
    isActive: true,
    sortOrder: 3,
    icon: '💾',
    slug: 'computer-hardware',
    metadata: {
      productCount: 133,
      totalRevenue: 55000,
      isPopular: true,
      featured: false
    },
    seo: {
      metaTitle: 'Computer Hardware - Professional Computing Solutions',
      metaDescription: 'Computers, components, and peripherals for business use.',
      keywords: ['computers', 'hardware', 'components', 'peripherals']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },

  // Level 1 - Software subcategories
  {
    id: 'cat-2-1',
    name: 'Business Software',
    description: 'CRM, ERP, and business management software',
    parentId: 'cat-2',
    level: 1,
    isActive: true,
    sortOrder: 1,
    icon: '📊',
    slug: 'business-software',
    metadata: {
      productCount: 34,
      totalRevenue: 45000,
      isPopular: true,
      featured: true
    },
    seo: {
      metaTitle: 'Business Software - CRM, ERP & Management Solutions',
      metaDescription: 'Professional business software including CRM, ERP, and management tools.',
      keywords: ['business software', 'crm', 'erp', 'management software']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-2-2',
    name: 'Design & Creative',
    description: 'Design software and creative tools',
    parentId: 'cat-2',
    level: 1,
    isActive: true,
    sortOrder: 2,
    icon: '🎨',
    slug: 'design-creative',
    metadata: {
      productCount: 28,
      totalRevenue: 18000,
      isPopular: false,
      featured: false
    },
    seo: {
      metaTitle: 'Design & Creative Software - Professional Creative Tools',
      metaDescription: 'Professional design software and creative tools for businesses.',
      keywords: ['design software', 'creative tools', 'graphics', 'design']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-2-3',
    name: 'Security Software',
    description: 'Antivirus, firewall, and security solutions',
    parentId: 'cat-2',
    level: 1,
    isActive: true,
    sortOrder: 3,
    icon: '🛡️',
    slug: 'security-software',
    metadata: {
      productCount: 27,
      totalRevenue: 12000,
      isPopular: true,
      featured: false
    },
    seo: {
      metaTitle: 'Security Software - Business Security Solutions',
      metaDescription: 'Antivirus, firewall, and security software for business protection.',
      keywords: ['security software', 'antivirus', 'firewall', 'cybersecurity']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },

  // Level 1 - Fashion subcategories
  {
    id: 'cat-3-1',
    name: 'Corporate Apparel',
    description: 'Professional clothing and uniforms',
    parentId: 'cat-3',
    level: 1,
    isActive: true,
    sortOrder: 1,
    icon: '👔',
    slug: 'corporate-apparel',
    metadata: {
      productCount: 89,
      totalRevenue: 28000,
      isPopular: false,
      featured: false
    },
    seo: {
      metaTitle: 'Corporate Apparel - Professional Business Clothing',
      metaDescription: 'Professional corporate apparel and uniforms for businesses.',
      keywords: ['corporate apparel', 'uniforms', 'business clothing', 'professional wear']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-3-2',
    name: 'Safety Wear',
    description: 'Safety clothing and protective equipment',
    parentId: 'cat-3',
    level: 1,
    isActive: true,
    sortOrder: 2,
    icon: '🦺',
    slug: 'safety-wear',
    metadata: {
      productCount: 67,
      totalRevenue: 17000,
      isPopular: true,
      featured: false
    },
    seo: {
      metaTitle: 'Safety Wear - Protective Clothing & Equipment',
      metaDescription: 'Safety clothing and protective equipment for workplace safety.',
      keywords: ['safety wear', 'protective clothing', 'safety equipment', 'workwear']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },

  // Level 1 - Industrial subcategories
  {
    id: 'cat-4-1',
    name: 'Components & Parts',
    description: 'Industrial components, parts, and supplies',
    parentId: 'cat-4',
    level: 1,
    isActive: true,
    sortOrder: 1,
    icon: '⚙️',
    slug: 'components-parts',
    metadata: {
      productCount: 178,
      totalRevenue: 150000,
      isPopular: true,
      featured: true
    },
    seo: {
      metaTitle: 'Industrial Components & Parts - B2B Industrial Supplies',
      metaDescription: 'Industrial components, parts, and supplies for manufacturing.',
      keywords: ['industrial components', 'parts', 'supplies', 'manufacturing']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-4-2',
    name: 'Heavy Machinery',
    description: 'Heavy industrial machinery and equipment',
    parentId: 'cat-4',
    level: 1,
    isActive: true,
    sortOrder: 2,
    icon: '🏗️',
    slug: 'heavy-machinery',
    metadata: {
      productCount: 45,
      totalRevenue: 130000,
      isPopular: false,
      featured: false
    },
    seo: {
      metaTitle: 'Heavy Machinery - Industrial Equipment Solutions',
      metaDescription: 'Heavy industrial machinery and equipment for construction and manufacturing.',
      keywords: ['heavy machinery', 'industrial equipment', 'construction', 'machinery']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },

  // Level 2 - Deeper nesting examples
  {
    id: 'cat-1-2-1',
    name: 'CCTV Cameras',
    description: 'Security cameras and surveillance equipment',
    parentId: 'cat-1-2',
    level: 2,
    isActive: true,
    sortOrder: 1,
    icon: '📹',
    slug: 'cctv-cameras',
    metadata: {
      productCount: 34,
      totalRevenue: 25000,
      isPopular: true,
      featured: false
    },
    seo: {
      metaTitle: 'CCTV Cameras - Professional Surveillance Solutions',
      metaDescription: 'Professional CCTV cameras and surveillance equipment.',
      keywords: ['cctv', 'cameras', 'surveillance', 'security cameras']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 'cat-1-2-2',
    name: 'Access Control',
    description: 'Access control systems and card readers',
    parentId: 'cat-1-2',
    level: 2,
    isActive: true,
    sortOrder: 2,
    icon: '🔑',
    slug: 'access-control',
    metadata: {
      productCount: 23,
      totalRevenue: 15000,
      isPopular: false,
      featured: false
    },
    seo: {
      metaTitle: 'Access Control Systems - Professional Security Access',
      metaDescription: 'Access control systems and card readers for business security.',
      keywords: ['access control', 'card readers', 'security access', 'door control']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
]

class CategoriesService {
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Build category tree structure
  private buildCategoryTree(categories: Category[], parentId?: string, path: string[] = []): CategoryTreeNode[] {
    return categories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(category => {
        const currentPath = [...path, category.name]
        const children = this.buildCategoryTree(categories, category.id, currentPath)
        
        return {
          ...category,
          children,
          path: currentPath,
          fullPath: currentPath.join(' > ')
        }
      })
  }

  // Filter categories based on criteria
  private filterCategories(categories: Category[], filters: CategoryFilters): Category[] {
    return categories.filter(category => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        if (!category.name.toLowerCase().includes(searchTerm) &&
            !category.description.toLowerCase().includes(searchTerm) &&
            !category.slug.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      if (filters.parentId !== undefined && category.parentId !== filters.parentId) return false
      if (filters.isActive !== undefined && category.isActive !== filters.isActive) return false
      if (filters.level !== undefined && category.level !== filters.level) return false
      if (filters.isPopular !== undefined && category.metadata.isPopular !== filters.isPopular) return false
      if (filters.featured !== undefined && category.metadata.featured !== filters.featured) return false
      if (filters.hasProducts !== undefined) {
        const hasProducts = category.metadata.productCount > 0
        if (hasProducts !== filters.hasProducts) return false
      }

      return true
    })
  }

  // Get category tree
  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    await this.delay()
    return this.buildCategoryTree(mockCategories)
  }

  // Get flat categories list with pagination
  async getCategories(
    page: number = 1,
    limit: number = 10,
    filters: CategoryFilters = {}
  ): Promise<CategoryListResponse> {
    await this.delay()

    const filteredCategories = this.filterCategories(mockCategories, filters)
    const total = filteredCategories.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const data = filteredCategories.slice(startIndex, startIndex + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<Category | null> {
    await this.delay()
    return mockCategories.find(category => category.id === id) || null
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await this.delay()
    return mockCategories.find(category => category.slug === slug) || null
  }

  // Get category path (breadcrumb)
  async getCategoryPath(id: string): Promise<Category[]> {
    await this.delay()
    
    const path: Category[] = []
    let currentId: string | undefined = id

    while (currentId) {
      const category = mockCategories.find(cat => cat.id === currentId)
      if (!category) break
      
      path.unshift(category)
      currentId = category.parentId
    }

    return path
  }

  // Get root categories (level 0)
  async getRootCategories(): Promise<Category[]> {
    await this.delay()
    return mockCategories
      .filter(cat => cat.level === 0)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  // Get children of a category
  async getCategoryChildren(parentId: string): Promise<Category[]> {
    await this.delay()
    return mockCategories
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  // Create new category
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    await this.delay()

    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockCategories.push(newCategory)
    return newCategory
  }

  // Update category
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    await this.delay()

    const categoryIndex = mockCategories.findIndex(category => category.id === id)
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }

    const updatedCategory = {
      ...mockCategories[categoryIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    mockCategories[categoryIndex] = updatedCategory
    return updatedCategory
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    await this.delay()

    // Check if category has children
    const hasChildren = mockCategories.some(cat => cat.parentId === id)
    if (hasChildren) {
      throw new Error('Cannot delete category with child categories')
    }

    const categoryIndex = mockCategories.findIndex(category => category.id === id)
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }

    mockCategories.splice(categoryIndex, 1)
  }

  // Toggle category status
  async toggleCategoryStatus(id: string): Promise<Category> {
    await this.delay()

    const categoryIndex = mockCategories.findIndex(category => category.id === id)
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }

    mockCategories[categoryIndex].isActive = !mockCategories[categoryIndex].isActive
    mockCategories[categoryIndex].updatedAt = new Date().toISOString()

    return mockCategories[categoryIndex]
  }

  // Reorder categories
  async reorderCategories(categoryIds: string[], parentId?: string): Promise<Category[]> {
    await this.delay(800)

    const updatedCategories: Category[] = []
    
    categoryIds.forEach((id, index) => {
      const categoryIndex = mockCategories.findIndex(cat => cat.id === id)
      if (categoryIndex !== -1) {
        mockCategories[categoryIndex].sortOrder = index + 1
        mockCategories[categoryIndex].updatedAt = new Date().toISOString()
        updatedCategories.push(mockCategories[categoryIndex])
      }
    })

    return updatedCategories
  }

  // Move category to different parent
  async moveCategory(id: string, newParentId?: string): Promise<Category> {
    await this.delay()

    const categoryIndex = mockCategories.findIndex(category => category.id === id)
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }

    // Prevent moving to self or descendant
    if (newParentId === id) {
      throw new Error('Cannot move category to itself')
    }

    // Update level based on new parent
    let newLevel = 0
    if (newParentId) {
      const newParent = mockCategories.find(cat => cat.id === newParentId)
      if (newParent) {
        newLevel = newParent.level + 1
      }
    }

    mockCategories[categoryIndex].parentId = newParentId
    mockCategories[categoryIndex].level = newLevel
    mockCategories[categoryIndex].updatedAt = new Date().toISOString()

    return mockCategories[categoryIndex]
  }

  // Get category statistics
  async getCategoryStats(): Promise<CategoryStats> {
    await this.delay()

    const totalCategories = mockCategories.length
    const activeCategories = mockCategories.filter(c => c.isActive).length
    const featuredCategories = mockCategories.filter(c => c.metadata.featured).length
    const categoriesWithProducts = mockCategories.filter(c => c.metadata.productCount > 0).length
    
    const totalProducts = mockCategories.reduce((sum, c) => sum + c.metadata.productCount, 0)
    const averageProductsPerCategory = totalProducts / totalCategories

    const maxDepth = Math.max(...mockCategories.map(c => c.level))

    // Calculate new categories this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newCategoriesThisMonth = mockCategories.filter(c => 
      new Date(c.createdAt) >= thisMonth
    ).length

    return {
      totalCategories,
      activeCategories,
      featuredCategories,
      categoriesWithProducts,
      averageProductsPerCategory,
      maxDepth,
      newCategoriesThisMonth
    }
  }

  // Search categories
  async searchCategories(
    query: string,
    options: {
      includeInactive?: boolean
      maxResults?: number
    } = {}
  ): Promise<Category[]> {
    await this.delay()

    const { includeInactive = false, maxResults = 10 } = options
    const searchTerm = query.toLowerCase()

    let categories = mockCategories
    if (!includeInactive) {
      categories = categories.filter(c => c.isActive)
    }

    const results = categories.filter(category => {
      return category.name.toLowerCase().includes(searchTerm) ||
             category.description.toLowerCase().includes(searchTerm) ||
             category.slug.toLowerCase().includes(searchTerm) ||
             category.seo.keywords?.some(keyword => 
               keyword.toLowerCase().includes(searchTerm)
             )
    })

    return results.slice(0, maxResults)
  }

  // Get popular categories
  async getPopularCategories(limit: number = 5): Promise<Category[]> {
    await this.delay()

    return mockCategories
      .filter(c => c.isActive && c.metadata.isPopular)
      .sort((a, b) => b.metadata.totalRevenue - a.metadata.totalRevenue)
      .slice(0, limit)
  }

  // Get featured categories
  async getFeaturedCategories(): Promise<Category[]> {
    await this.delay()

    return mockCategories
      .filter(c => c.isActive && c.metadata.featured)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  // Bulk operations
  async bulkUpdateStatus(categoryIds: string[], isActive: boolean): Promise<Category[]> {
    await this.delay(1000)

    const updatedCategories: Category[] = []

    for (const id of categoryIds) {
      const categoryIndex = mockCategories.findIndex(category => category.id === id)
      if (categoryIndex !== -1) {
        mockCategories[categoryIndex].isActive = isActive
        mockCategories[categoryIndex].updatedAt = new Date().toISOString()
        updatedCategories.push(mockCategories[categoryIndex])
      }
    }

    return updatedCategories
  }

  async bulkDelete(categoryIds: string[]): Promise<void> {
    await this.delay(1000)

    // Check if any category has children
    for (const id of categoryIds) {
      const hasChildren = mockCategories.some(cat => cat.parentId === id)
      if (hasChildren) {
        throw new Error(`Cannot delete category ${id} - it has child categories`)
      }
    }

    for (let i = mockCategories.length - 1; i >= 0; i--) {
      if (categoryIds.includes(mockCategories[i].id)) {
        mockCategories.splice(i, 1)
      }
    }
  }
}

export const categoriesService = new CategoriesService()