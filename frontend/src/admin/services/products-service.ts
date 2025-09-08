export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  categoryId: string
  categoryName: string
  sellerId: string
  sellerName: string
  sellerBusinessName: string
  images: string[]
  sku: string
  stock: number
  minOrderQuantity: number
  status: 'active' | 'inactive' | 'discontinued'
  verificationStatus: 'pending' | 'approved' | 'rejected'
  verificationNotes?: string
  isPromoted: boolean
  tags: string[]
  specifications: Record<string, string>
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
}

export interface ProductFilters {
  search?: string
  categoryId?: string
  sellerId?: string
  status?: Product['status']
  verificationStatus?: Product['verificationStatus']
  priceMin?: number
  priceMax?: number
  isPromoted?: boolean
  tags?: string[]
  createdFrom?: string
  createdTo?: string
}

export interface ProductListResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductStats {
  totalProducts: number
  activeProducts: number
  pendingApproval: number
  approvedProducts: number
  rejectedProducts: number
  promotedProducts: number
  newProductsThisMonth: number
  averagePrice: number
}

export interface ApprovalAction {
  productId: string
  action: 'approve' | 'reject'
  notes?: string
  adminId: string
  adminName: string
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Professional Wireless Headphones',
    description: 'High-quality noise-cancelling wireless headphones perfect for professional use and music enthusiasts.',
    price: 299.99,
    currency: 'USD',
    categoryId: 'cat-1',
    categoryName: 'Electronics > Audio',
    sellerId: 'user-2',
    sellerName: 'John Smith',
    sellerBusinessName: 'Smith Electronics Ltd',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'
    ],
    sku: 'WH-PRO-001',
    stock: 150,
    minOrderQuantity: 1,
    status: 'active',
    verificationStatus: 'approved',
    isPromoted: true,
    tags: ['wireless', 'noise-cancelling', 'professional', 'bluetooth'],
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Frequency Response': '20Hz - 20kHz'
    },
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z',
    approvedAt: '2023-12-05T00:00:00Z',
    approvedBy: 'Admin User'
  },
  {
    id: 'prod-2',
    name: 'Smart Home Security Camera',
    description: '4K WiFi security camera with night vision and motion detection for comprehensive home monitoring.',
    price: 189.99,
    currency: 'USD',
    categoryId: 'cat-1',
    categoryName: 'Electronics > Security',
    sellerId: 'user-2',
    sellerName: 'John Smith',
    sellerBusinessName: 'Smith Electronics Ltd',
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400'
    ],
    sku: 'CAM-SEC-001',
    stock: 75,
    minOrderQuantity: 1,
    status: 'active',
    verificationStatus: 'pending',
    isPromoted: false,
    tags: ['security', '4k', 'wifi', 'night-vision', 'smart-home'],
    specifications: {
      'Resolution': '4K Ultra HD',
      'Field of View': '110°',
      'Night Vision': 'Yes, up to 30ft',
      'Storage': 'Cloud & Local'
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Cloud-Based CRM Software License',
    description: 'Comprehensive CRM solution for small to medium businesses with advanced analytics and automation.',
    price: 49.99,
    currency: 'USD',
    categoryId: 'cat-2',
    categoryName: 'Software > Business',
    sellerId: 'user-3',
    sellerName: 'Sarah Davis',
    sellerBusinessName: 'TechSolutions Inc',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
    ],
    sku: 'CRM-SOFT-001',
    stock: 1000,
    minOrderQuantity: 1,
    status: 'active',
    verificationStatus: 'rejected',
    verificationNotes: 'License documentation incomplete',
    isPromoted: false,
    tags: ['software', 'crm', 'business', 'cloud', 'analytics'],
    specifications: {
      'License Type': 'Monthly Subscription',
      'Users': 'Up to 10 users',
      'Storage': '100GB',
      'Support': '24/7 Email & Chat'
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    rejectedAt: '2024-01-08T00:00:00Z',
    rejectedBy: 'Admin User',
    rejectionReason: 'License documentation incomplete'
  },
  {
    id: 'prod-4',
    name: 'Organic Cotton T-Shirts (Bulk)',
    description: 'Premium organic cotton t-shirts available in various colors and sizes. Perfect for retail or corporate use.',
    price: 12.50,
    currency: 'USD',
    categoryId: 'cat-3',
    categoryName: 'Fashion > Apparel',
    sellerId: 'user-7',
    sellerName: 'Emma Clark',
    sellerBusinessName: 'Clark Fashion House',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400'
    ],
    sku: 'TSHIRT-ORG-001',
    stock: 500,
    minOrderQuantity: 50,
    status: 'active',
    verificationStatus: 'approved',
    isPromoted: true,
    tags: ['organic', 'cotton', 'apparel', 'bulk', 'eco-friendly'],
    specifications: {
      'Material': '100% Organic Cotton',
      'Sizes': 'XS to XXL',
      'Colors': '12 Available',
      'Certification': 'GOTS Certified'
    },
    createdAt: '2023-11-20T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    approvedAt: '2023-11-25T00:00:00Z',
    approvedBy: 'Admin User'
  },
  {
    id: 'prod-5',
    name: 'Industrial Grade Bearings',
    description: 'High-precision steel bearings for industrial machinery and automotive applications.',
    price: 45.00,
    currency: 'USD',
    categoryId: 'cat-4',
    categoryName: 'Industrial > Components',
    sellerId: 'user-10',
    sellerName: 'James Taylor',
    sellerBusinessName: 'Taylor Automotive Parts',
    images: [
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400'
    ],
    sku: 'BEAR-IND-001',
    stock: 200,
    minOrderQuantity: 10,
    status: 'active',
    verificationStatus: 'approved',
    isPromoted: false,
    tags: ['industrial', 'bearings', 'automotive', 'machinery', 'steel'],
    specifications: {
      'Material': 'High-grade Steel',
      'Precision': 'ABEC-7',
      'Load Rating': '5000N',
      'Temperature Range': '-40°C to 150°C'
    },
    createdAt: '2023-10-15T00:00:00Z',
    updatedAt: '2023-11-01T00:00:00Z',
    approvedAt: '2023-10-20T00:00:00Z',
    approvedBy: 'Admin User'
  },
  {
    id: 'prod-6',
    name: 'Eco-Friendly Food Packaging',
    description: 'Biodegradable food packaging solutions made from sustainable materials.',
    price: 0.85,
    currency: 'USD',
    categoryId: 'cat-5',
    categoryName: 'Food & Beverage > Packaging',
    sellerId: 'user-9',
    sellerName: 'Anna Martinez',
    sellerBusinessName: 'FoodTech Innovations',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400'
    ],
    sku: 'PKG-ECO-001',
    stock: 10000,
    minOrderQuantity: 1000,
    status: 'active',
    verificationStatus: 'pending',
    isPromoted: false,
    tags: ['eco-friendly', 'packaging', 'biodegradable', 'sustainable', 'food-safe'],
    specifications: {
      'Material': 'Plant-based PLA',
      'Biodegradable': 'Yes, 180 days',
      'Food Safe': 'FDA Approved',
      'Sizes': 'Multiple options available'
    },
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Solar Panel System - Commercial Grade',
    description: 'High-efficiency solar panels suitable for commercial installations with 25-year warranty.',
    price: 1250.00,
    currency: 'USD',
    categoryId: 'cat-6',
    categoryName: 'Energy > Solar',
    sellerId: 'user-5',
    sellerName: 'Lisa Wilson',
    sellerBusinessName: 'GreenTech Solutions',
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400'
    ],
    sku: 'SOL-COM-001',
    stock: 50,
    minOrderQuantity: 5,
    status: 'inactive',
    verificationStatus: 'approved',
    isPromoted: false,
    tags: ['solar', 'renewable', 'commercial', 'energy', 'green-tech'],
    specifications: {
      'Power Output': '400W per panel',
      'Efficiency': '22.1%',
      'Warranty': '25 years',
      'Dimensions': '2000x1000x40mm'
    },
    createdAt: '2023-09-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    approvedAt: '2023-09-20T00:00:00Z',
    approvedBy: 'Admin User'
  },
  {
    id: 'prod-8',
    name: 'Professional Kitchen Equipment Set',
    description: 'Complete stainless steel kitchen equipment set for restaurants and commercial kitchens.',
    price: 2499.99,
    currency: 'USD',
    categoryId: 'cat-7',
    categoryName: 'Food Service > Equipment',
    sellerId: 'user-9',
    sellerName: 'Anna Martinez',
    sellerBusinessName: 'FoodTech Innovations',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1574493264962-67c8d94dde55?w=400'
    ],
    sku: 'KITCH-PRO-001',
    stock: 25,
    minOrderQuantity: 1,
    status: 'active',
    verificationStatus: 'approved',
    isPromoted: true,
    tags: ['kitchen', 'restaurant', 'commercial', 'stainless-steel', 'professional'],
    specifications: {
      'Material': 'Grade 316 Stainless Steel',
      'Includes': 'Prep tables, sinks, shelving',
      'Certification': 'NSF Certified',
      'Warranty': '3 years'
    },
    createdAt: '2023-08-10T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
    approvedAt: '2023-08-15T00:00:00Z',
    approvedBy: 'Admin User'
  }
]

class ProductsService {
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Filter products based on criteria
  private filterProducts(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        if (!product.name.toLowerCase().includes(searchTerm) &&
            !product.description.toLowerCase().includes(searchTerm) &&
            !product.sellerBusinessName.toLowerCase().includes(searchTerm) &&
            !product.sku.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      if (filters.categoryId && product.categoryId !== filters.categoryId) return false
      if (filters.sellerId && product.sellerId !== filters.sellerId) return false
      if (filters.status && product.status !== filters.status) return false
      if (filters.verificationStatus && product.verificationStatus !== filters.verificationStatus) return false
      if (filters.isPromoted !== undefined && product.isPromoted !== filters.isPromoted) return false
      
      if (filters.priceMin !== undefined && product.price < filters.priceMin) return false
      if (filters.priceMax !== undefined && product.price > filters.priceMax) return false

      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          product.tags.includes(tag.toLowerCase())
        )
        if (!hasMatchingTag) return false
      }

      if (filters.createdFrom) {
        const createdDate = new Date(product.createdAt)
        const fromDate = new Date(filters.createdFrom)
        if (createdDate < fromDate) return false
      }
      
      if (filters.createdTo) {
        const createdDate = new Date(product.createdAt)
        const toDate = new Date(filters.createdTo)
        if (createdDate > toDate) return false
      }

      return true
    })
  }

  // Get paginated products list
  async getProducts(
    page: number = 1,
    limit: number = 10,
    filters: ProductFilters = {}
  ): Promise<ProductListResponse> {
    await this.delay()

    const filteredProducts = this.filterProducts(mockProducts, filters)
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const data = filteredProducts.slice(startIndex, startIndex + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    await this.delay()
    return mockProducts.find(product => product.id === id) || null
  }

  // Create new product
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await this.delay()

    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockProducts.push(newProduct)
    return newProduct
  }

  // Update product
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await this.delay()

    const productIndex = mockProducts.findIndex(product => product.id === id)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    const updatedProduct = {
      ...mockProducts[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    mockProducts[productIndex] = updatedProduct
    return updatedProduct
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await this.delay()

    const productIndex = mockProducts.findIndex(product => product.id === id)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    mockProducts.splice(productIndex, 1)
  }

  // Approve product
  async approveProduct(action: ApprovalAction): Promise<Product> {
    await this.delay()

    const productIndex = mockProducts.findIndex(product => product.id === action.productId)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    const now = new Date().toISOString()

    if (action.action === 'approve') {
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        verificationStatus: 'approved',
        verificationNotes: action.notes,
        approvedAt: now,
        approvedBy: action.adminName,
        updatedAt: now
      }
    } else {
      mockProducts[productIndex] = {
        ...mockProducts[productIndex],
        verificationStatus: 'rejected',
        rejectionReason: action.notes || 'Product does not meet our standards',
        rejectedAt: now,
        rejectedBy: action.adminName,
        updatedAt: now
      }
    }

    return mockProducts[productIndex]
  }

  // Toggle product promotion status
  async togglePromotion(id: string): Promise<Product> {
    await this.delay()

    const productIndex = mockProducts.findIndex(product => product.id === id)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    mockProducts[productIndex].isPromoted = !mockProducts[productIndex].isPromoted
    mockProducts[productIndex].updatedAt = new Date().toISOString()

    return mockProducts[productIndex]
  }

  // Update product status
  async updateProductStatus(id: string, status: Product['status']): Promise<Product> {
    await this.delay()

    const productIndex = mockProducts.findIndex(product => product.id === id)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    mockProducts[productIndex].status = status
    mockProducts[productIndex].updatedAt = new Date().toISOString()

    return mockProducts[productIndex]
  }

  // Get product statistics
  async getProductStats(): Promise<ProductStats> {
    await this.delay()

    const totalProducts = mockProducts.length
    const activeProducts = mockProducts.filter(p => p.status === 'active').length
    const pendingApproval = mockProducts.filter(p => p.verificationStatus === 'pending').length
    const approvedProducts = mockProducts.filter(p => p.verificationStatus === 'approved').length
    const rejectedProducts = mockProducts.filter(p => p.verificationStatus === 'rejected').length
    const promotedProducts = mockProducts.filter(p => p.isPromoted).length

    // Calculate new products this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newProductsThisMonth = mockProducts.filter(p => 
      new Date(p.createdAt) >= thisMonth
    ).length

    // Calculate average price
    const totalPrice = mockProducts.reduce((sum, p) => sum + p.price, 0)
    const averagePrice = totalPrice / totalProducts

    return {
      totalProducts,
      activeProducts,
      pendingApproval,
      approvedProducts,
      rejectedProducts,
      promotedProducts,
      newProductsThisMonth,
      averagePrice
    }
  }

  // Bulk operations
  async bulkUpdateStatus(productIds: string[], status: Product['status']): Promise<Product[]> {
    await this.delay(1000)

    const updatedProducts: Product[] = []

    for (const id of productIds) {
      const productIndex = mockProducts.findIndex(product => product.id === id)
      if (productIndex !== -1) {
        mockProducts[productIndex].status = status
        mockProducts[productIndex].updatedAt = new Date().toISOString()
        updatedProducts.push(mockProducts[productIndex])
      }
    }

    return updatedProducts
  }

  async bulkApprove(productIds: string[], adminId: string, adminName: string): Promise<Product[]> {
    await this.delay(1000)

    const updatedProducts: Product[] = []
    const now = new Date().toISOString()

    for (const id of productIds) {
      const productIndex = mockProducts.findIndex(product => product.id === id)
      if (productIndex !== -1) {
        mockProducts[productIndex] = {
          ...mockProducts[productIndex],
          verificationStatus: 'approved',
          approvedAt: now,
          approvedBy: adminName,
          updatedAt: now
        }
        updatedProducts.push(mockProducts[productIndex])
      }
    }

    return updatedProducts
  }

  async bulkReject(productIds: string[], reason: string, adminId: string, adminName: string): Promise<Product[]> {
    await this.delay(1000)

    const updatedProducts: Product[] = []
    const now = new Date().toISOString()

    for (const id of productIds) {
      const productIndex = mockProducts.findIndex(product => product.id === id)
      if (productIndex !== -1) {
        mockProducts[productIndex] = {
          ...mockProducts[productIndex],
          verificationStatus: 'rejected',
          rejectionReason: reason,
          rejectedAt: now,
          rejectedBy: adminName,
          updatedAt: now
        }
        updatedProducts.push(mockProducts[productIndex])
      }
    }

    return updatedProducts
  }

  // Get products by seller
  async getProductsBySeller(sellerId: string, page: number = 1, limit: number = 10): Promise<ProductListResponse> {
    await this.delay()

    const sellerProducts = mockProducts.filter(p => p.sellerId === sellerId)
    const total = sellerProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const data = sellerProducts.slice(startIndex, startIndex + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Search products with advanced options
  async searchProducts(
    query: string,
    options: {
      fields?: ('name' | 'description' | 'sku' | 'tags')[]
      limit?: number
    } = {}
  ): Promise<Product[]> {
    await this.delay()

    const { fields = ['name', 'description', 'sku'], limit = 10 } = options
    const searchTerm = query.toLowerCase()

    const results = mockProducts.filter(product => {
      const matches = []
      
      if (fields.includes('name')) {
        matches.push(product.name.toLowerCase().includes(searchTerm))
      }
      
      if (fields.includes('description')) {
        matches.push(product.description.toLowerCase().includes(searchTerm))
      }
      
      if (fields.includes('sku')) {
        matches.push(product.sku.toLowerCase().includes(searchTerm))
      }

      if (fields.includes('tags')) {
        matches.push(product.tags.some(tag => tag.includes(searchTerm)))
      }

      return matches.some(Boolean)
    })

    return results.slice(0, limit)
  }

  // Get trending products (most promoted, highest stock, recent)
  async getTrendingProducts(limit: number = 5): Promise<Product[]> {
    await this.delay()

    return mockProducts
      .filter(p => p.status === 'active' && p.verificationStatus === 'approved')
      .sort((a, b) => {
        // Sort by promotion status, then by creation date
        if (a.isPromoted && !b.isPromoted) return -1
        if (!a.isPromoted && b.isPromoted) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, limit)
  }
}

export const productsService = new ProductsService()