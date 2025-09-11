import { 
  SaudiProduct, 
  SaudiCategory,
  ProductVerificationStatus,
  AdminNote,
  SaudiRegion 
} from '../types/saudi-admin';

// Mock data for Saudi products
const mockProducts: SaudiProduct[] = [
  {
    id: '1',
    nameAr: 'iPhone 15 Pro',
    nameEn: 'iPhone 15 Pro',
    descriptionAr: 'Latest iPhone with advanced technology and professional camera',
    descriptionEn: 'Latest iPhone with advanced technology and professional camera',
    price: {
      amount: 4999,
      currency: 'SAR',
      vatIncluded: true
    },
    category: {
      id: 'cat1',
      nameAr: 'Smartphones',
      nameEn: 'Smartphones',
      parentId: 'electronics',
      level: 2,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 1,
      seoData: {
        slugAr: 'الهواتف-الذكية',
        slugEn: 'smartphones'
      },
      analytics: {
        productCount: 150,
        activeProducts: 142,
        totalRevenue: 2500000,
        avgPrice: 2800
      }
    },
    seller: {
      id: '1',
      name: 'Ahmed Al-Farisi',
      verificationStatus: 'fully_verified' as any
    },
    images: [
      {
        id: 'img1',
        url: '/images/iphone15pro-1.jpg',
        alt: 'iPhone 15 Pro Front View',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img2',
        url: '/images/iphone15pro-2.jpg',
        alt: 'iPhone 15 Pro Back View',
        isPrimary: false,
        order: 2
      }
    ],
    specifications: [
      {
        nameAr: 'الشاشة',
        nameEn: 'Display',
        valueAr: '6.1 بوصة',
        valueEn: '6.1 inch'
      },
      {
        nameAr: 'التخزين',
        nameEn: 'Storage',
        valueAr: '256 جيجابايت',
        valueEn: '256GB'
      }
    ],
    inventory: {
      quantity: 50,
      lowStockThreshold: 10,
      location: 'Riyadh Warehouse'
    },
    compliance: {
      saudiStandards: true,
      importLicense: 'IMP-2024-001234',
      customsCode: '8517.12.00'
    },
    verificationStatus: ProductVerificationStatus.APPROVED,
    adminNotes: [
      {
        id: 'note1',
        content: 'Product approved after SASO compliance verification',
        adminId: '3',
        adminName: 'Mohammed Al-Abdullah',
        createdAt: '2024-02-15T10:00:00Z',
        type: 'success'
      }
    ],
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    nameAr: 'عسل سدر طبيعي',
    nameEn: 'Natural Sidr Honey',
    descriptionAr: 'عسل سدر طبيعي 100% من منطقة عسير',
    descriptionEn: '100% Natural Sidr Honey from Asir Region',
    price: {
      amount: 299,
      currency: 'SAR',
      vatIncluded: true
    },
    category: {
      id: 'cat2',
      nameAr: 'العسل والمنتجات الطبيعية',
      nameEn: 'Honey & Natural Products',
      parentId: 'food',
      level: 2,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 5,
      seoData: {
        slugAr: 'العسل-والمنتجات-الطبيعية',
        slugEn: 'honey-natural-products'
      },
      analytics: {
        productCount: 45,
        activeProducts: 42,
        totalRevenue: 150000,
        avgPrice: 250
      }
    },
    seller: {
      id: '2',
      name: 'Fatima Al-Najjar',
      verificationStatus: 'identity_verified' as any
    },
    images: [
      {
        id: 'img3',
        url: '/images/sidr-honey-1.jpg',
        alt: 'Natural Sidr Honey Jar',
        isPrimary: true,
        order: 1
      }
    ],
    specifications: [
      {
        nameAr: 'الوزن',
        nameEn: 'Weight',
        valueAr: '500 جرام',
        valueEn: '500g'
      },
      {
        nameAr: 'المصدر',
        nameEn: 'Source',
        valueAr: 'منطقة عسير',
        valueEn: 'Asir Region'
      }
    ],
    inventory: {
      quantity: 25,
      lowStockThreshold: 5,
      location: 'Abha Warehouse'
    },
    compliance: {
      saudiStandards: true,
      halalCertified: true
    },
    verificationStatus: ProductVerificationStatus.PENDING,
    adminNotes: [],
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z'
  }
];

// Mock categories
const mockCategories: SaudiCategory[] = [
  {
    id: 'electronics',
    nameAr: 'الإلكترونيات',
    nameEn: 'Electronics',
    descriptionAr: 'جميع المنتجات الإلكترونية والتقنية',
    descriptionEn: 'All electronic and technology products',
    level: 1,
    isActive: true,
    requiresVerification: true,
    sasoCompliant: true,
    displayOrder: 1,
    seoData: {
      slugAr: 'الإلكترونيات',
      slugEn: 'electronics'
    },
    analytics: {
      productCount: 500,
      activeProducts: 485,
      totalRevenue: 5000000,
      avgPrice: 1500
    }
  },
  {
    id: 'food',
    nameAr: 'الأغذية والمشروبات',
    nameEn: 'Food & Beverages',
    descriptionAr: 'المنتجات الغذائية والمشروبات',
    descriptionEn: 'Food products and beverages',
    level: 1,
    isActive: true,
    requiresVerification: true,
    sasoCompliant: true,
    displayOrder: 2,
    seoData: {
      slugAr: 'الأغذية-والمشروبات',
      slugEn: 'food-beverages'
    },
    analytics: {
      productCount: 200,
      activeProducts: 195,
      totalRevenue: 800000,
      avgPrice: 120
    }
  }
];

export class ProductsService {
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ProductVerificationStatus;
    category?: string;
    sellerId?: string;
    priceMin?: number;
    priceMax?: number;
  }): Promise<{
    products: SaudiProduct[];
    total: number;
    page: number;
    limit: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.nameEn.toLowerCase().includes(searchLower) ||
        product.nameAr.includes(params.search!) ||
        product.descriptionEn.toLowerCase().includes(searchLower) ||
        product.descriptionAr.includes(params.search!)
      );
    }

    if (params?.status) {
      filteredProducts = filteredProducts.filter(product => 
        product.verificationStatus === params.status
      );
    }

    if (params?.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.id === params.category
      );
    }

    if (params?.sellerId) {
      filteredProducts = filteredProducts.filter(product => 
        product.seller.id === params.sellerId
      );
    }

    if (params?.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.price.amount >= params.priceMin!
      );
    }

    if (params?.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.price.amount <= params.priceMax!
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      products: filteredProducts.slice(startIndex, endIndex),
      total: filteredProducts.length,
      page,
      limit
    };
  }

  static async getProductById(id: string): Promise<SaudiProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(product => product.id === id) || null;
  }

  static async getVerificationQueue(): Promise<SaudiProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockProducts.filter(product => 
      product.verificationStatus === ProductVerificationStatus.PENDING ||
      product.verificationStatus === ProductVerificationStatus.UNDER_REVIEW
    );
  }

  static async approveProduct(id: string, adminNote?: string): Promise<SaudiProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) return null;

    product.verificationStatus = ProductVerificationStatus.APPROVED;
    product.updatedAt = new Date().toISOString();

    if (adminNote) {
      product.adminNotes = product.adminNotes || [];
      product.adminNotes.push({
        id: Date.now().toString(),
        content: adminNote,
        adminId: '3',
        adminName: 'Mohammed Al-Abdullah',
        createdAt: new Date().toISOString(),
        type: 'success'
      });
    }

    return product;
  }

  static async rejectProduct(id: string, reason: string): Promise<SaudiProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = mockProducts.find(p => p.id === id);
    if (!product) return null;

    product.verificationStatus = ProductVerificationStatus.REJECTED;
    product.updatedAt = new Date().toISOString();

    product.adminNotes = product.adminNotes || [];
    product.adminNotes.push({
      id: Date.now().toString(),
      content: `Product rejected: ${reason}`,
      adminId: '3',
      adminName: 'Mohammed Al-Abdullah',
      createdAt: new Date().toISOString(),
      type: 'error'
    });

    return product;
  }

  static async getCategories(): Promise<SaudiCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockCategories];
  }

  static async getCategoryById(id: string): Promise<SaudiCategory | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories.find(category => category.id === id) || null;
  }

  static async createCategory(categoryData: Partial<SaudiCategory>): Promise<SaudiCategory> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCategory: SaudiCategory = {
      id: Date.now().toString(),
      nameAr: categoryData.nameAr!,
      nameEn: categoryData.nameEn!,
      descriptionAr: categoryData.descriptionAr,
      descriptionEn: categoryData.descriptionEn,
      parentId: categoryData.parentId,
      level: categoryData.level || 1,
      isActive: true,
      requiresVerification: categoryData.requiresVerification || false,
      sasoCompliant: categoryData.sasoCompliant || false,
      displayOrder: categoryData.displayOrder || 999,
      seoData: {
        slugAr: categoryData.nameAr!.replace(/\s+/g, '-'),
        slugEn: categoryData.nameEn!.toLowerCase().replace(/\s+/g, '-')
      },
      analytics: {
        productCount: 0,
        activeProducts: 0,
        totalRevenue: 0,
        avgPrice: 0
      }
    };

    mockCategories.push(newCategory);
    return newCategory;
  }

  static async updateCategory(id: string, updates: Partial<SaudiCategory>): Promise<SaudiCategory | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const categoryIndex = mockCategories.findIndex(category => category.id === id);
    if (categoryIndex === -1) return null;

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...updates
    };

    return mockCategories[categoryIndex];
  }

  static async deleteCategory(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categoryIndex = mockCategories.findIndex(category => category.id === id);
    if (categoryIndex === -1) return false;

    mockCategories.splice(categoryIndex, 1);
    return true;
  }

  static async getProductStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    byCategory: Record<string, number>;
    lowStock: number;
    recentlyAdded: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const total = mockProducts.length;
    const approved = mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.APPROVED).length;
    const pending = mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.PENDING).length;
    const rejected = mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.REJECTED).length;

    const byCategory: Record<string, number> = {};
    mockProducts.forEach(product => {
      byCategory[product.category.nameEn] = (byCategory[product.category.nameEn] || 0) + 1;
    });

    const lowStock = mockProducts.filter(p => 
      p.inventory.quantity <= p.inventory.lowStockThreshold
    ).length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentlyAdded = mockProducts.filter(p => 
      new Date(p.createdAt) > oneWeekAgo
    ).length;

    return {
      total,
      approved,
      pending,
      rejected,
      byCategory,
      lowStock,
      recentlyAdded
    };
  }
}