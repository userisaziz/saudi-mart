import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ChevronDownIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { SaudiProduct, UserRole, ProductVerificationStatus } from '@/admin/types/saudi-admin';

interface AdminProduct extends SaudiProduct {
  sellerName: string;
  sellerCompany: string;
  sellerVerificationLevel: string;
  totalRevenue: number;
  totalSales: number;
  views: number;
  conversionRate: number;
}

interface FilterOptions {
  category: string;
  status: string;
  verificationStatus: string;
  priceRange: string;
  seller: string;
  region: string;
  stockLevel: string;
}

const mockAdminProducts: AdminProduct[] = [
  {
    id: '1',
    nameEn: 'Industrial Water Pump HP-2000',
    nameAr: 'مضخة مياه صناعية عالية الضغط HP-2000',
    descriptionEn: 'High-pressure industrial water pump suitable for large-scale operations',
    descriptionAr: 'مضخة مياه صناعية عالية الضغط مناسبة للعمليات واسعة النطاق',
    price: { amount: 15000, currency: 'SAR', vatIncluded: true },
    category: {
      id: 'industrial-equipment',
      nameEn: 'Industrial Equipment',
      nameAr: 'معدات صناعية',
      descriptionEn: '',
      descriptionAr: '',
      parentId: '',
      level: 1,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 1,
      seoData: {
        slugEn: 'industrial-equipment',
        slugAr: 'معدات-صناعية'
      },
      analytics: {
        productCount: 150,
        activeProducts: 120,
        totalRevenue: 2500000,
        avgPrice: 18000
      }
    },
    seller: {
      id: 'seller1',
      name: 'Ahmad Industries',
      verificationStatus: 'fully_verified'
    },
    images: [],
    specifications: [
      { nameEn: 'Power', nameAr: 'القوة', valueEn: '2000HP', valueAr: '2000 حصان', unit: 'HP' }
    ],
    inventory: { quantity: 25, lowStockThreshold: 10, location: 'Riyadh Warehouse' },
    compliance: { saudiStandards: true, halalCertified: false, importLicense: 'IMP-001' },
    verificationStatus: ProductVerificationStatus.APPROVED,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    sellerName: 'Ahmad Al-Rashid',
    sellerCompany: 'Ahmad Industries LLC',
    sellerVerificationLevel: 'Fully Verified',
    totalRevenue: 675000,
    totalSales: 45,
    views: 1234,
    conversionRate: 3.6,
  },
  {
    id: '2',
    nameEn: 'Pressure Control Valve 4-inch',
    nameAr: 'صمام تحكم في الضغط 4 إنش',
    descriptionEn: 'Precision pressure control valve for industrial applications',
    descriptionAr: 'صمام تحكم دقيق في الضغط للتطبيقات الصناعية',
    price: { amount: 2500, currency: 'SAR', vatIncluded: true },
    category: {
      id: 'valves-controls',
      nameEn: 'Valves & Controls',
      nameAr: 'صمامات وأجهزة تحكم',
      descriptionEn: '',
      descriptionAr: '',
      parentId: 'industrial-equipment',
      level: 2,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 2,
      seoData: {
        slugEn: 'valves-controls',
        slugAr: 'صمامات-تحكم'
      },
      analytics: {
        productCount: 75,
        activeProducts: 60,
        totalRevenue: 180000,
        avgPrice: 3000
      }
    },
    seller: {
      id: 'seller2',
      name: 'Gulf Equipment Co.',
      verificationStatus: 'business_verified'
    },
    images: [],
    specifications: [
      { nameEn: 'Size', nameAr: 'الحجم', valueEn: '4 inch', valueAr: '4 إنش', unit: 'inch' }
    ],
    inventory: { quantity: 8, lowStockThreshold: 15, location: 'Jeddah Warehouse' },
    compliance: { saudiStandards: true, halalCertified: false },
    verificationStatus: ProductVerificationStatus.PENDING,
    createdAt: '2024-02-28T09:15:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
    sellerName: 'Fatima Al-Zahra',
    sellerCompany: 'Gulf Equipment Co.',
    sellerVerificationLevel: 'Business Verified',
    totalRevenue: 57500,
    totalSales: 23,
    views: 456,
    conversionRate: 5.0,
  },
];

const statusColors = {
  [ProductVerificationStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
  [ProductVerificationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ProductVerificationStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ProductVerificationStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
  [ProductVerificationStatus.REQUIRES_INFO]: 'bg-orange-100 text-orange-800 border-orange-200',
};

const statusIcons = {
  [ProductVerificationStatus.APPROVED]: CheckCircleIcon,
  [ProductVerificationStatus.PENDING]: ClockIcon,
  [ProductVerificationStatus.UNDER_REVIEW]: AdjustmentsHorizontalIcon,
  [ProductVerificationStatus.REJECTED]: XMarkIcon,
  [ProductVerificationStatus.REQUIRES_INFO]: ExclamationTriangleIcon,
};

const AdminProductsList: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProduct[]>(mockAdminProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([]);
  const [bulkActionModal, setBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | 'delete' | 'status' | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    category: 'all',
    status: 'all',
    verificationStatus: 'all',
    priceRange: 'all',
    seller: 'all',
    region: 'all',
    stockLevel: 'all',
  });
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'sales' | 'revenue' | 'updated'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loadedCount, setLoadedCount] = useState(10);
  const [bulkStatusValue, setBulkStatusValue] = useState<string>('');

  // Statistics calculations
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const approvedProducts = products.filter(p => p.verificationStatus === ProductVerificationStatus.APPROVED).length;
    const pendingProducts = products.filter(p => p.verificationStatus === ProductVerificationStatus.PENDING).length;
    const lowStockProducts = products.filter(p => p.inventory.quantity <= p.inventory.lowStockThreshold).length;
    const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);
    
    return {
      totalProducts,
      approvedProducts,
      pendingProducts,
      lowStockProducts,
      totalRevenue,
    };
  }, [products]);

  // Filter and search logic
  const applyFiltersAndSearch = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameAr.includes(searchQuery) ||
        product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sellerCompany.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (localFilters.category !== 'all') {
      filtered = filtered.filter(product => product.category.id === localFilters.category);
    }

    // Verification status filter
    if (localFilters.verificationStatus !== 'all') {
      filtered = filtered.filter(product => product.verificationStatus === localFilters.verificationStatus);
    }

    // Price range filter
    if (localFilters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        switch (localFilters.priceRange) {
          case 'under_1000':
            return product.price.amount < 1000;
          case '1000_5000':
            return product.price.amount >= 1000 && product.price.amount < 5000;
          case '5000_20000':
            return product.price.amount >= 5000 && product.price.amount < 20000;
          case 'over_20000':
            return product.price.amount >= 20000;
          default:
            return true;
        }
      });
    }

    // Stock level filter
    if (localFilters.stockLevel !== 'all') {
      filtered = filtered.filter(product => {
        switch (localFilters.stockLevel) {
          case 'in_stock':
            return product.inventory.quantity > product.inventory.lowStockThreshold;
          case 'low_stock':
            return product.inventory.quantity <= product.inventory.lowStockThreshold && product.inventory.quantity > 0;
          case 'out_of_stock':
            return product.inventory.quantity === 0;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof AdminProduct];
      let bValue: any = b[sortBy as keyof AdminProduct];

      if (sortBy === 'updated') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      } else if (sortBy === 'price') {
        aValue = a.price.amount;
        bValue = b.price.amount;
      } else if (sortBy === 'stock') {
        aValue = a.inventory.quantity;
        bValue = b.inventory.quantity;
      } else if (sortBy === 'sales') {
        aValue = a.totalSales;
        bValue = b.totalSales;
      } else if (sortBy === 'revenue') {
        aValue = a.totalRevenue;
        bValue = b.totalRevenue;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchQuery, localFilters, sortBy, sortOrder]);

  useEffect(() => {
    setFilteredProducts(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  const handleSelectProduct = (productId: string) => {
    const newSelected = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    const visibleProductIds = filteredProducts.slice(0, loadedCount).map(p => p.id);
    const newSelected = selectedProducts.length === visibleProductIds.length ? [] : visibleProductIds;
    setSelectedProducts(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getStockLevelColor = (product: AdminProduct) => {
    if (product.inventory.quantity === 0) return 'text-red-600 bg-red-50';
    if (product.inventory.quantity <= product.inventory.lowStockThreshold) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const displayedProducts = filteredProducts.slice(0, loadedCount);

  const loadMore = () => {
    setLoadedCount(prev => Math.min(prev + 10, filteredProducts.length));
  };

  const clearFilters = () => {
    setLocalFilters({
      category: 'all',
      status: 'all',
      verificationStatus: 'all',
      priceRange: 'all',
      seller: 'all',
      region: 'all',
      stockLevel: 'all',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== 'all') || searchQuery.trim();

  // Bulk operations
  const handleBulkAction = (action: 'approve' | 'reject' | 'delete' | 'status') => {
    setBulkAction(action);
    setBulkActionModal(true);
  };

  const executeBulkAction = () => {
    if (!bulkAction || selectedProducts.length === 0) return;
    
    switch (bulkAction) {
      case 'approve':
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) 
            ? { ...p, verificationStatus: ProductVerificationStatus.APPROVED }
            : p
        ));
        break;
      case 'reject':
        setProducts(products.map(p => 
          selectedProducts.includes(p.id) 
            ? { ...p, verificationStatus: ProductVerificationStatus.REJECTED }
            : p
        ));
        break;
      case 'delete':
        setProducts(products.filter(p => !selectedProducts.includes(p.id)));
        break;
    }
    
    setSelectedProducts([]);
    setBulkActionModal(false);
    setBulkAction(null);
    setBulkStatusValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all products across the platform ({filteredProducts.length} of {products.length} products)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? <ListBulletIcon className="w-5 h-5" /> : <Squares2X2Icon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => navigate('/admin/products/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <ViewColumnsIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedProducts}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingProducts}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, sellers, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">Last Updated</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="sales">Sales</option>
            <option value="revenue">Revenue</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => setLocalFilters({...localFilters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="industrial-equipment">Industrial Equipment</option>
                  <option value="valves-controls">Valves & Controls</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                <select
                  value={localFilters.verificationStatus}
                  onChange={(e) => setLocalFilters({...localFilters, verificationStatus: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value={ProductVerificationStatus.APPROVED}>Approved</option>
                  <option value={ProductVerificationStatus.PENDING}>Pending</option>
                  <option value={ProductVerificationStatus.UNDER_REVIEW}>Under Review</option>
                  <option value={ProductVerificationStatus.REJECTED}>Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Level</label>
                <select
                  value={localFilters.stockLevel}
                  onChange={(e) => setLocalFilters({...localFilters, stockLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={localFilters.priceRange}
                  onChange={(e) => setLocalFilters({...localFilters, priceRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under_1000">Under 1,000 SAR</option>
                  <option value="1000_5000">1,000 - 5,000 SAR</option>
                  <option value="5000_20000">5,000 - 20,000 SAR</option>
                  <option value="over_20000">Over 20,000 SAR</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {selectedProducts.length} products selected
              </span>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Unselect All
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button 
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded-md hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List/Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === displayedProducts.length && displayedProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedProducts.map((product) => {
                  const StatusIcon = statusIcons[product.verificationStatus];
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ViewColumnsIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.nameEn}</div>
                            <div className="text-sm text-gray-500">{product.nameAr}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{product.sellerName}</div>
                            <div className="text-sm text-gray-500">{product.sellerCompany}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.category.nameEn}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.price.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium px-2 py-1 rounded ${getStockLevelColor(product)}`}>
                          {product.inventory.quantity} units
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[product.verificationStatus]}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{product.verificationStatus.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.totalRevenue)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <EllipsisVerticalIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const StatusIcon = statusIcons[product.verificationStatus];
              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <ViewColumnsIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 text-sm">{product.nameEn}</h3>
                    <p className="text-xs text-gray-500">{product.sellerCompany}</p>
                    <p className="text-xs text-gray-600">{product.category.nameEn}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{formatCurrency(product.price.amount)}</span>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[product.verificationStatus]}`}>
                        <StatusIcon className="w-3 h-3" />
                      </div>
                    </div>
                    
                    <div className={`text-xs font-medium px-2 py-1 rounded text-center ${getStockLevelColor(product)}`}>
                      {product.inventory.quantity} units
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500">Rev: {formatCurrency(product.totalRevenue)}</span>
                      <div className="flex items-center gap-1">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {displayedProducts.length < filteredProducts.length && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More ({filteredProducts.length - displayedProducts.length} remaining)
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <ViewColumnsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Modal */}
      {bulkActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {bulkAction === 'approve' && 'Approve Products'}
                {bulkAction === 'reject' && 'Reject Products'}
                {bulkAction === 'delete' && 'Delete Products'}
              </h3>
              <button
                onClick={() => setBulkActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                {bulkAction === 'delete' 
                  ? `Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`
                  : `This action will affect ${selectedProducts.length} selected products.`
                }
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setBulkActionModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  bulkAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : bulkAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {bulkAction === 'delete' ? 'Delete' : bulkAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsList;