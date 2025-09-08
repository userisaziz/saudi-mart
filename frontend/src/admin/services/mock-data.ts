// Comprehensive mock data service for admin dashboard
import {
  SaudiUser,
  SaudiProduct,
  SaudiCategory,
  AdminLead,
  KYCDocument,
  UserRole,
  UserStatus,
  VerificationLevel,
  BusinessType,
  BusinessVerificationStatus,
  SaudiRegion,
  SaudiDocumentType,
  DocumentStatus,
  ProductVerificationStatus,
  LeadStatus,
  LeadPriority,
  LeadSource
} from '@/admin/types/saudi-admin'

// Generate realistic Saudi names
const saudiNames = {
  male: {
    ar: ['محمد', 'أحمد', 'عبدالله', 'عبدالرحمن', 'سعد', 'فهد', 'خالد', 'عبدالعزيز', 'سلطان', 'نواف'],
    en: ['Mohammed', 'Ahmed', 'Abdullah', 'Abdulrahman', 'Saad', 'Fahd', 'Khalid', 'Abdulaziz', 'Sultan', 'Nawaf']
  },
  female: {
    ar: ['فاطمة', 'عائشة', 'مريم', 'خديجة', 'نورا', 'سارة', 'أمل', 'هند', 'ريم', 'لمى'],
    en: ['Fatima', 'Aisha', 'Maryam', 'Khadija', 'Nora', 'Sara', 'Amal', 'Hind', 'Reem', 'Lama']
  }
}

const saudiCities = {
  ar: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الطائف', 'تبوك', 'بريدة', 'خميس مشيط', 'حائل'],
  en: ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Taif', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hail']
}

const businessNames = {
  ar: ['شركة التقنية المتقدمة', 'مؤسسة التجارة الرقمية', 'شركة الحلول الذكية', 'مجموعة الابتكار', 'شركة المستقبل التجاري'],
  en: ['Advanced Technology Co.', 'Digital Commerce Est.', 'Smart Solutions Ltd.', 'Innovation Group', 'Future Commerce Co.']
}

const productNames = {
  ar: ['أجهزة ذكية', 'معدات صناعية', 'منتجات تقنية', 'أدوات طبية', 'مواد بناء', 'أجهزة كهربائية', 'معدات مكتبية'],
  en: ['Smart Devices', 'Industrial Equipment', 'Tech Products', 'Medical Tools', 'Construction Materials', 'Electrical Appliances', 'Office Equipment']
}

// Utility functions
const randomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}
const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number, decimals: number = 2): number => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

class AdminMockDataService {
  private users: SaudiUser[] = []
  private products: SaudiProduct[] = []
  private categories: SaudiCategory[] = []
  private leads: AdminLead[] = []
  private kycDocuments: KYCDocument[] = []

  constructor() {
    this.generateMockData()
  }

  private generateMockData() {
    this.generateUsers()
    this.generateCategories()
    this.generateProducts()
    this.generateLeads()
    this.generateKYCDocuments()
  }

  private generateUsers() {
    const roles = [UserRole.SELLER, UserRole.BUYER, UserRole.ADMIN, UserRole.MODERATOR]
    const statuses = [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED, UserStatus.PENDING]
    const verificationLevels = [
      VerificationLevel.UNVERIFIED,
      VerificationLevel.EMAIL_VERIFIED,
      VerificationLevel.PHONE_VERIFIED,
      VerificationLevel.IDENTITY_VERIFIED,
      VerificationLevel.BUSINESS_VERIFIED,
      VerificationLevel.FULLY_VERIFIED
    ]
    const businessTypes = [BusinessType.INDIVIDUAL, BusinessType.COMPANY, BusinessType.LLC, BusinessType.CORPORATION]
    const regions = Object.values(SaudiRegion)

    for (let i = 0; i < 500; i++) {
      const gender = Math.random() > 0.7 ? 'female' : 'male'
      const nameIndex = randomNumber(0, saudiNames[gender].ar.length - 1)
      const cityIndex = randomNumber(0, saudiCities.ar.length - 1)
      const role = randomElement(roles)
      const isBusinessUser = role === UserRole.SELLER && Math.random() > 0.3

      const user: SaudiUser = {
        id: `user_${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+966${randomNumber(500000000, 599999999)}`,
        nationalId: Math.random() > 0.8 ? undefined : `${randomNumber(1000000000, 1999999999)}`,
        iqamaNumber: Math.random() > 0.7 ? `${randomNumber(2000000000, 2999999999)}` : undefined,
        name: {
          ar: saudiNames[gender].ar[nameIndex],
          en: saudiNames[gender].en[nameIndex]
        },
        role,
        status: randomElement(statuses),
        isVerified: Math.random() > 0.2,
        verificationLevel: randomElement(verificationLevels),
        businessInfo: isBusinessUser ? {
          commercialRegistration: `CR${randomNumber(1000000000, 1999999999)}`,
          vatNumber: Math.random() > 0.5 ? `VAT${randomNumber(100000000000000, 199999999999999)}` : undefined,
          businessNameAr: randomElement(businessNames.ar),
          businessNameEn: randomElement(businessNames.en),
          businessType: randomElement(businessTypes),
          samaLicense: Math.random() > 0.8 ? `SAMA${randomNumber(10000, 99999)}` : undefined,
          establishmentCard: `EST${randomNumber(10000000, 99999999)}`,
          isActive: Math.random() > 0.1,
          verificationStatus: randomElement(Object.values(BusinessVerificationStatus))
        } : undefined,
        addresses: [{
          id: `addr_${i + 1}`,
          type: 'home',
          buildingNumber: `${randomNumber(1, 9999)}`,
          streetName: {
            ar: `شارع ${randomNumber(1, 100)}`,
            en: `Street ${randomNumber(1, 100)}`
          },
          district: {
            ar: `حي ${randomNumber(1, 50)}`,
            en: `District ${randomNumber(1, 50)}`
          },
          city: {
            ar: saudiCities.ar[cityIndex],
            en: saudiCities.en[cityIndex]
          },
          region: randomElement(regions),
          postalCode: `${randomNumber(10000, 99999)}`,
          additionalNumber: `${randomNumber(1000, 9999)}`,
          coordinates: {
            lat: randomFloat(16.0, 32.0, 6),
            lng: randomFloat(34.0, 55.0, 6)
          },
          isDefault: true
        }],
        preferences: {
          language: Math.random() > 0.3 ? 'ar' : 'en',
          timezone: 'Asia/Riyadh',
          prayerTimeNotifications: Math.random() > 0.5,
          hijriCalendar: Math.random() > 0.6
        },
        createdAt: randomDate(new Date('2023-01-01'), new Date()),
        updatedAt: randomDate(new Date('2023-06-01'), new Date()),
        lastLoginAt: Math.random() > 0.2 ? randomDate(new Date('2024-01-01'), new Date()) : undefined
      }

      this.users.push(user)
    }
  }

  private generateCategories() {
    const rootCategories = [
      { ar: 'الإلكترونيات', en: 'Electronics' },
      { ar: 'المعدات الصناعية', en: 'Industrial Equipment' },
      { ar: 'السيارات', en: 'Automotive' },
      { ar: 'المنسوجات', en: 'Textiles' },
      { ar: 'الأغذية', en: 'Food & Beverages' },
      { ar: 'الرعاية الصحية', en: 'Healthcare' },
      { ar: 'البناء', en: 'Construction' },
      { ar: 'الطاقة', en: 'Energy' }
    ]

    const subCategories = [
      { ar: 'هواتف ذكية', en: 'Smartphones' },
      { ar: 'أجهزة كمبيوتر', en: 'Computers' },
      { ar: 'معدات التصنيع', en: 'Manufacturing Equipment' },
      { ar: 'أدوات كهربائية', en: 'Power Tools' },
      { ar: 'قطع غيار', en: 'Spare Parts' },
      { ar: 'اكسسوارات', en: 'Accessories' }
    ]

    // Create root categories
    rootCategories.forEach((cat, index) => {
      const category: SaudiCategory = {
        id: `cat_${index + 1}`,
        nameAr: cat.ar,
        nameEn: cat.en,
        descriptionAr: `وصف ${cat.ar}`,
        descriptionEn: `Description for ${cat.en}`,
        parentId: undefined,
        level: 0,
        children: [],
        isActive: Math.random() > 0.1,
        requiresVerification: Math.random() > 0.5,
        sasoCompliant: Math.random() > 0.3,
        icon: `icon-${index + 1}`,
        displayOrder: index,
        seoData: {
          slugAr: cat.ar.replace(/\s+/g, '-'),
          slugEn: cat.en.toLowerCase().replace(/\s+/g, '-'),
          metaTitleAr: `${cat.ar} - متجر B2B`,
          metaTitleEn: `${cat.en} - B2B Store`,
          metaDescriptionAr: `تسوق ${cat.ar} بأفضل الأسعار`,
          metaDescriptionEn: `Shop ${cat.en} at best prices`
        },
        analytics: {
          productCount: randomNumber(10, 200),
          activeProducts: randomNumber(5, 150),
          totalRevenue: randomFloat(10000, 500000),
          avgPrice: randomFloat(100, 5000)
        }
      }
      this.categories.push(category)
    })

    // Create subcategories
    subCategories.forEach((subCat, index) => {
      const parentCategory = randomElement(this.categories)
      const category: SaudiCategory = {
        id: `subcat_${index + 1}`,
        nameAr: subCat.ar,
        nameEn: subCat.en,
        descriptionAr: `وصف ${subCat.ar}`,
        descriptionEn: `Description for ${subCat.en}`,
        parentId: parentCategory.id,
        level: 1,
        children: [],
        isActive: Math.random() > 0.05,
        requiresVerification: Math.random() > 0.6,
        sasoCompliant: Math.random() > 0.4,
        displayOrder: index,
        seoData: {
          slugAr: subCat.ar.replace(/\s+/g, '-'),
          slugEn: subCat.en.toLowerCase().replace(/\s+/g, '-'),
          metaTitleAr: `${subCat.ar} - ${parentCategory.nameAr}`,
          metaTitleEn: `${subCat.en} - ${parentCategory.nameEn}`
        },
        analytics: {
          productCount: randomNumber(5, 50),
          activeProducts: randomNumber(2, 40),
          totalRevenue: randomFloat(5000, 100000),
          avgPrice: randomFloat(50, 2000)
        }
      }
      this.categories.push(category)
    })
  }

  private generateProducts() {
    const verificationStatuses = Object.values(ProductVerificationStatus)
    
    for (let i = 0; i < 1000; i++) {
      const seller = randomElement(this.users.filter(u => u.role === UserRole.SELLER))
      const category = randomElement(this.categories)
      const nameIndex = randomNumber(0, productNames.ar.length - 1)

      const product: SaudiProduct = {
        id: `prod_${i + 1}`,
        nameAr: `${productNames.ar[nameIndex]} ${randomNumber(1, 100)}`,
        nameEn: `${productNames.en[nameIndex]} ${randomNumber(1, 100)}`,
        descriptionAr: `وصف تفصيلي للمنتج ${productNames.ar[nameIndex]}`,
        descriptionEn: `Detailed description for ${productNames.en[nameIndex]}`,
        price: {
          amount: randomFloat(10, 10000),
          currency: 'SAR',
          vatIncluded: Math.random() > 0.5
        },
        category,
        seller: {
          id: seller.id,
          name: seller.businessInfo?.businessNameEn || seller.name.en,
          verificationStatus: seller.verificationLevel
        },
        images: Array.from({ length: randomNumber(1, 5) }, (_, idx) => ({
          id: `img_${i}_${idx}`,
          url: `https://images.unsplash.com/photo-${1500000000000 + i + idx}?w=400`,
          alt: `Product image ${idx + 1}`,
          isPrimary: idx === 0,
          order: idx
        })),
        specifications: Array.from({ length: randomNumber(2, 6) }, (_, idx) => ({
          nameAr: `المواصفة ${idx + 1}`,
          nameEn: `Specification ${idx + 1}`,
          valueAr: `القيمة ${idx + 1}`,
          valueEn: `Value ${idx + 1}`,
          unit: Math.random() > 0.5 ? 'cm' : undefined
        })),
        inventory: {
          quantity: randomNumber(0, 1000),
          lowStockThreshold: randomNumber(5, 50),
          location: randomElement(saudiCities.en)
        },
        compliance: {
          saudiStandards: Math.random() > 0.2,
          halalCertified: Math.random() > 0.7,
          importLicense: Math.random() > 0.6 ? `IMP${randomNumber(100000, 999999)}` : undefined,
          customsCode: Math.random() > 0.5 ? `${randomNumber(10000000, 99999999)}` : undefined
        },
        verificationStatus: randomElement(verificationStatuses),
        adminNotes: Math.random() > 0.7 ? [{
          id: `note_${i}`,
          content: 'Product requires additional documentation',
          adminId: 'admin_1',
          adminName: 'Admin User',
          createdAt: randomDate(new Date('2024-01-01'), new Date()),
          type: 'warning'
        }] : undefined,
        createdAt: randomDate(new Date('2023-01-01'), new Date()),
        updatedAt: randomDate(new Date('2023-06-01'), new Date())
      }

      this.products.push(product)
    }
  }

  private generateLeads() {
    const leadStatuses = Object.values(LeadStatus)
    const leadPriorities = Object.values(LeadPriority)
    const leadSources = Object.values(LeadSource)
    const regions = Object.values(SaudiRegion)

    for (let i = 0; i < 200; i++) {
      const product = randomElement(this.products)
      const cityIndex = randomNumber(0, saudiCities.ar.length - 1)

      const lead: AdminLead = {
        id: `lead_${i + 1}`,
        customerInfo: {
          name: `${randomElement(saudiNames.male.en)} ${randomElement(['Abdullah', 'Mohammed', 'Ahmed'])}`,
          phone: `+966${randomNumber(500000000, 599999999)}`,
          email: Math.random() > 0.3 ? `customer${i}@example.com` : undefined,
          company: Math.random() > 0.5 ? randomElement(businessNames.en) : undefined,
          city: saudiCities.en[cityIndex],
          region: randomElement(regions)
        },
        productInterest: {
          productId: product.id,
          productName: product.nameEn,
          category: product.category.nameEn,
          priceRange: Math.random() > 0.5 ? {
            min: randomFloat(100, 1000),
            max: randomFloat(1000, 10000)
          } : undefined
        },
        conversation: [
          {
            id: `msg_${i}_1`,
            senderId: `customer_${i}`,
            senderType: 'customer',
            message: `I'm interested in ${product.nameEn}. Can you provide more details?`,
            timestamp: randomDate(new Date('2024-01-01'), new Date()),
            isRead: true
          }
        ],
        assignedTo: Math.random() > 0.5 ? 'admin_1' : undefined,
        status: randomElement(leadStatuses),
        priority: randomElement(leadPriorities),
        source: randomElement(leadSources),
        score: randomNumber(1, 100),
        tags: ['new-lead', 'high-value'].slice(0, randomNumber(0, 2)),
        followUpDate: Math.random() > 0.5 ? randomDate(new Date(), new Date('2024-12-31')) : undefined,
        lastContactDate: randomDate(new Date('2024-01-01'), new Date()),
        notes: [],
        createdAt: randomDate(new Date('2024-01-01'), new Date()),
        updatedAt: randomDate(new Date('2024-01-15'), new Date())
      }

      this.leads.push(lead)
    }
  }

  private generateKYCDocuments() {
    const documentTypes = Object.values(SaudiDocumentType)
    const documentStatuses = Object.values(DocumentStatus)

    this.users.forEach((user, index) => {
      if (Math.random() > 0.3) { // 70% of users have documents
        const docType = randomElement(documentTypes)
        
        const document: KYCDocument = {
          id: `doc_${index + 1}`,
          userId: user.id,
          type: docType,
          status: randomElement(documentStatuses),
          frontImage: `https://images.unsplash.com/photo-${1500000000 + index}?w=400`,
          backImage: Math.random() > 0.5 ? `https://images.unsplash.com/photo-${1500000001 + index}?w=400` : undefined,
          extractedData: {
            documentNumber: docType === SaudiDocumentType.NATIONAL_ID ? user.nationalId || `${randomNumber(1000000000, 1999999999)}` : `DOC${randomNumber(100000000, 999999999)}`,
            fullName: user.name.en,
            nationality: 'Saudi Arabian',
            dateOfBirth: randomDate(new Date('1970-01-01'), new Date('2000-01-01')),
            expiryDate: randomDate(new Date(), new Date('2030-01-01')),
            issueDate: randomDate(new Date('2020-01-01'), new Date())
          },
          verificationNotes: Math.random() > 0.7 ? [{
            id: `note_doc_${index}`,
            content: 'Document quality is acceptable',
            adminId: 'admin_1',
            adminName: 'Admin User',
            createdAt: new Date().toISOString(),
            type: 'info'
          }] : undefined,
          uploadedAt: randomDate(new Date('2024-01-01'), new Date()),
          reviewedAt: Math.random() > 0.5 ? randomDate(new Date('2024-01-01'), new Date()) : undefined,
          reviewedBy: Math.random() > 0.5 ? 'admin_1' : undefined,
          expiryDate: randomDate(new Date(), new Date('2030-01-01'))
        }

        this.kycDocuments.push(document)
      }
    })
  }

  // API Methods

  // Users
  async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: UserRole
    status?: UserStatus
    verificationLevel?: VerificationLevel
  }): Promise<{ users: SaudiUser[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

    let filteredUsers = [...this.users]

    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.name.en.toLowerCase().includes(search) ||
        user.name.ar.includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.businessInfo?.businessNameEn?.toLowerCase().includes(search) ||
        user.businessInfo?.businessNameAr?.includes(search)
      )
    }

    if (params?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role)
    }

    if (params?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status)
    }

    if (params?.verificationLevel) {
      filteredUsers = filteredUsers.filter(user => user.verificationLevel === params.verificationLevel)
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const start = (page - 1) * limit
    const end = start + limit

    return {
      users: filteredUsers.slice(start, end),
      total: filteredUsers.length
    }
  }

  async getUserById(id: string): Promise<SaudiUser | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.users.find(user => user.id === id) || null
  }

  async updateUser(id: string, updates: Partial<SaudiUser>): Promise<SaudiUser> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex === -1) throw new Error('User not found')
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates, updatedAt: new Date().toISOString() }
    return this.users[userIndex]
  }

  // Products
  async getProducts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: ProductVerificationStatus
    sellerId?: string
  }): Promise<{ products: SaudiProduct[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 400))

    let filteredProducts = [...this.products]

    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.nameEn.toLowerCase().includes(search) ||
        product.nameAr.includes(search) ||
        product.descriptionEn.toLowerCase().includes(search)
      )
    }

    if (params?.category) {
      filteredProducts = filteredProducts.filter(product => product.category.id === params.category)
    }

    if (params?.status) {
      filteredProducts = filteredProducts.filter(product => product.verificationStatus === params.status)
    }

    if (params?.sellerId) {
      filteredProducts = filteredProducts.filter(product => product.seller.id === params.sellerId)
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const start = (page - 1) * limit
    const end = start + limit

    return {
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length
    }
  }

  async getProductById(id: string): Promise<SaudiProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.products.find(product => product.id === id) || null
  }

  async updateProductStatus(id: string, status: ProductVerificationStatus, notes?: string): Promise<SaudiProduct> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const productIndex = this.products.findIndex(product => product.id === id)
    if (productIndex === -1) throw new Error('Product not found')

    this.products[productIndex].verificationStatus = status
    this.products[productIndex].updatedAt = new Date().toISOString()
    
    if (notes) {
      this.products[productIndex].adminNotes = this.products[productIndex].adminNotes || []
      this.products[productIndex].adminNotes!.push({
        id: `note_${Date.now()}`,
        content: notes,
        adminId: 'admin_1',
        adminName: 'Admin User',
        createdAt: new Date().toISOString(),
        type: status === ProductVerificationStatus.APPROVED ? 'success' : 
              status === ProductVerificationStatus.REJECTED ? 'error' : 'info'
      })
    }

    return this.products[productIndex]
  }

  // Categories
  async getCategories(): Promise<SaudiCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.categories
  }

  // Leads
  async getLeads(params?: {
    page?: number
    limit?: number
    status?: LeadStatus
    priority?: LeadPriority
    assignedTo?: string
  }): Promise<{ leads: AdminLead[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    let filteredLeads = [...this.leads]

    if (params?.status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === params.status)
    }

    if (params?.priority) {
      filteredLeads = filteredLeads.filter(lead => lead.priority === params.priority)
    }

    if (params?.assignedTo) {
      filteredLeads = filteredLeads.filter(lead => lead.assignedTo === params.assignedTo)
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const start = (page - 1) * limit
    const end = start + limit

    return {
      leads: filteredLeads.slice(start, end),
      total: filteredLeads.length
    }
  }

  // KYC Documents
  async getKYCDocuments(params?: {
    page?: number
    limit?: number
    status?: DocumentStatus
    type?: SaudiDocumentType
  }): Promise<{ documents: KYCDocument[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 300))

    let filteredDocs = [...this.kycDocuments]

    if (params?.status) {
      filteredDocs = filteredDocs.filter(doc => doc.status === params.status)
    }

    if (params?.type) {
      filteredDocs = filteredDocs.filter(doc => doc.type === params.type)
    }

    const page = params?.page || 1
    const limit = params?.limit || 50
    const start = (page - 1) * limit
    const end = start + limit

    return {
      documents: filteredDocs.slice(start, end),
      total: filteredDocs.length
    }
  }

  // Analytics Data
  async getAnalyticsOverview(): Promise<{
    totalUsers: number
    activeUsers: number
    totalProducts: number
    pendingVerifications: number
    totalRevenue: number
    monthlyGrowth: number
    usersByRegion: Array<{ region: SaudiRegion, count: number }>
    productsByCategory: Array<{ category: string, count: number }>
    recentRegistrations: Array<{ date: string, count: number }>
  }> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const usersByRegion = Object.values(SaudiRegion).map(region => ({
      region,
      count: this.users.filter(user => user.addresses[0]?.region === region).length
    }))

    const productsByCategory = this.categories.map(cat => ({
      category: cat.nameEn,
      count: this.products.filter(prod => prod.category.id === cat.id).length
    }))

    // Generate recent registration data (last 30 days)
    const recentRegistrations = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: randomNumber(5, 25)
      }
    })

    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === UserStatus.ACTIVE).length,
      totalProducts: this.products.length,
      pendingVerifications: this.products.filter(p => p.verificationStatus === ProductVerificationStatus.PENDING).length,
      totalRevenue: this.products.reduce((sum, prod) => sum + prod.price.amount, 0),
      monthlyGrowth: randomFloat(5, 15),
      usersByRegion,
      productsByCategory,
      recentRegistrations
    }
  }
}

export const mockDataService = new AdminMockDataService()