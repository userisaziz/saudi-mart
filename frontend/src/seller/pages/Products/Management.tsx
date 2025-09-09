import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { DataTable } from '@/seller/components/ui/DataTable';
import { MetricsCard } from '@/seller/components/ui/MetricsCard';
import { Chart } from '@/seller/components/ui/Chart';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  TagIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DuplicateIcon,
  StarIcon,
  TruckIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  nameAr: string;
  sku: string;
  category: string;
  categoryAr: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock' | 'discontinued';
  images: string[];
  description: string;
  descriptionAr: string;
  createdAt: string;
  updatedAt: string;
  sales: number;
  revenue: number;
  views: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number; };
  supplier?: string;
  leadTime?: number;
  variants?: Array<{ name: string; value: string; price?: number; stock?: number; }>;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  trending: boolean;
  lastOrderDate?: string;
  profit: number;
  profitMargin: number;
}

// Enhanced mock data with more comprehensive product information
const mockProductsData: Product[] = [
  {
    id: '1',
    name: 'Industrial Water Pump HP-2000',
    nameAr: 'مضخة مياه صناعية عالية الضغط HP-2000',
    sku: 'PUMP-HP-2000',
    category: 'Industrial Equipment',
    categoryAr: 'معدات صناعية',
    price: 15000,
    cost: 9000,
    stock: 25,
    lowStockThreshold: 10,
    status: 'active',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: 'High-pressure industrial water pump suitable for large-scale operations with superior efficiency and durability.',
    descriptionAr: 'مضخة مياه صناعية عالية الضغط مناسبة للعمليات واسعة النطاق مع كفاءة ومتانة فائقة.',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    sales: 45,
    revenue: 675000,
    views: 1234,
    rating: 4.8,
    reviewCount: 23,
    tags: ['industrial', 'water', 'pump', 'heavy-duty'],
    weight: 150,
    dimensions: { length: 80, width: 60, height: 120 },
    supplier: 'TechFlow Industries',
    leadTime: 14,
    variants: [
      { name: 'Power', value: '2000HP', stock: 25 },
      { name: 'Color', value: 'Industrial Blue', stock: 25 },
    ],
    featured: true,
    trending: true,
    lastOrderDate: '2024-03-14T10:30:00Z',
    profit: 6000,
    profitMargin: 40,
  },
  {
    id: '2',
    name: 'Pressure Control Valve 4-inch',
    nameAr: 'صمام تحكم في الضغط 4 إنش',
    sku: 'VALVE-PC-4IN',
    category: 'Valves & Controls',
    categoryAr: 'صمامات وأجهزة تحكم',
    price: 2500,
    cost: 1500,
    stock: 8,
    lowStockThreshold: 15,
    status: 'active',
    images: ['/api/placeholder/400/300'],
    description: 'Precision pressure control valve for industrial applications with advanced flow control technology.',
    descriptionAr: 'صمام تحكم دقيق في الضغط للتطبيقات الصناعية مع تقنية تحكم متقدمة في التدفق.',
    createdAt: '2024-02-28T09:15:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
    sales: 23,
    revenue: 57500,
    views: 856,
    rating: 4.6,
    reviewCount: 12,
    tags: ['valve', 'pressure', 'control', 'precision'],
    weight: 12,
    dimensions: { length: 25, width: 15, height: 30 },
    supplier: 'ValveTech Solutions',
    leadTime: 7,
    featured: false,
    trending: false,
    lastOrderDate: '2024-03-12T15:45:00Z',
    profit: 1000,
    profitMargin: 40,
  },
  {
    id: '3',
    name: 'Three-Phase Electric Motor 50HP',
    nameAr: 'محرك كهربائي ثلاثي الأطوار 50 حصان',
    sku: 'MOTOR-3PH-50HP',
    category: 'Electric Motors',
    categoryAr: 'محركات كهربائية',
    price: 25000,
    cost: 16000,
    stock: 0,
    lowStockThreshold: 5,
    status: 'out_of_stock',
    images: ['/api/placeholder/400/300'],
    description: 'High-efficiency three-phase electric motor for industrial use with premium performance characteristics.',
    descriptionAr: 'محرك كهربائي ثلاثي الأطوار عالي الكفاءة للاستخدام الصناعي مع خصائص أداء متميزة.',
    createdAt: '2024-02-25T14:45:00Z',
    updatedAt: '2024-03-13T16:10:00Z',
    sales: 12,
    revenue: 300000,
    views: 642,
    rating: 4.9,
    reviewCount: 8,
    tags: ['motor', 'electric', 'industrial', 'high-efficiency'],
    weight: 180,
    dimensions: { length: 100, width: 80, height: 90 },
    supplier: 'ElectroMotor Corp',
    leadTime: 21,
    featured: true,
    trending: false,
    lastOrderDate: '2024-03-10T08:20:00Z',
    profit: 9000,
    profitMargin: 36,
  },
];

export default function ProductManagement() {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState<Product[]>(mockProductsData);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Calculate metrics
  const metrics = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    lowStockProducts: products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length,
    outOfStockProducts: products.filter(p => p.stock === 0).length,
    totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
    totalProfit: products.reduce((sum, p) => sum + (p.profit * p.sales), 0),
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
  };

  // Get categories for filter
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Product performance data for charts
  const topPerformingProducts = products
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ name: p.name, revenue: p.revenue, sales: p.sales }));

  const categoryPerformance = categories.map(category => {
    const categoryProducts = products.filter(p => p.category === category);
    const revenue = categoryProducts.reduce((sum, p) => sum + p.revenue, 0);
    const sales = categoryProducts.reduce((sum, p) => sum + p.sales, 0);
    return { name: category, revenue, sales };
  });

  const stockAlerts = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const lowPerformers = products.filter(p => p.views < 100 || p.sales < 5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? 'إدارة المنتجات المتقدمة' : 'Advanced Product Management'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRTL ? 'إدارة شاملة لجميع المنتجات مع تحليلات متقدمة وإدارة المخزون الذكية' : 'Comprehensive product management with advanced analytics and smart inventory management'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <CloudArrowUpIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'رفع مجمع' : 'Bulk Upload'}
          </Button>
          <Button variant="outline" size="sm">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            {isRTL ? 'منتج جديد' : 'New Product'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={isRTL ? 'إجمالي المنتجات' : 'Total Products'}
          value={metrics.totalProducts}
          change={12}
          changeType="increase"
          icon={CubeIcon}
          iconColor="text-blue-600"
        />
        <MetricsCard
          title={isRTL ? 'المنتجات النشطة' : 'Active Products'}
          value={metrics.activeProducts}
          change={8}
          changeType="increase"
          icon={CheckCircleIcon}
          iconColor="text-green-600"
        />
        <MetricsCard
          title={isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
          value={metrics.totalRevenue}
          change={15.5}
          changeType="increase"
          icon={CurrencyDollarIcon}
          iconColor="text-green-600"
          format="currency"
        />
        <MetricsCard
          title={isRTL ? 'متوسط التقييم' : 'Average Rating'}
          value={Number(metrics.averageRating.toFixed(1))}
          change={0.3}
          changeType="increase"
          icon={StarIcon}
          iconColor="text-yellow-600"
          format="decimal"
        />
      </div>

      {/* Alert Cards */}
      {(stockAlerts > 0 || lowPerformers > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stockAlerts > 0 && (
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  {isRTL ? 'تنبيهات المخزون' : 'Stock Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{stockAlerts}</div>
                <p className="text-xs text-orange-600 mt-1">
                  {isRTL ? 'منتج يحتاج إعادة طلب' : 'products need reordering'}
                </p>
              </CardContent>
            </Card>
          )}
          
          {lowPerformers > 0 && (
            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800 flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  {isRTL ? 'منتجات ضعيفة الأداء' : 'Low Performing Products'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{lowPerformers}</div>
                <p className="text-xs text-red-600 mt-1">
                  {isRTL ? 'منتج يحتاج تحسين' : 'products need optimization'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="inventory">{isRTL ? 'المخزون' : 'Inventory'}</TabsTrigger>
          <TabsTrigger value="analytics">{isRTL ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          <TabsTrigger value="optimization">{isRTL ? 'التحسين' : 'Optimization'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 lg:w-96">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={isRTL ? 'البحث في المنتجات...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                {isRTL ? 'فلاتر' : 'Filters'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">{isRTL ? 'كل الحالات' : 'All Status'}</option>
                <option value="active">{isRTL ? 'نشط' : 'Active'}</option>
                <option value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</option>
                <option value="draft">{isRTL ? 'مسودة' : 'Draft'}</option>
                <option value="out_of_stock">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</option>
              </select>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <ListBulletIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <XMarkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'الفئة' : 'Category'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">{isRTL ? 'كل الفئات' : 'All Categories'}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'حالة المخزون' : 'Stock Level'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{isRTL ? 'كل المستويات' : 'All Levels'}</option>
                      <option value="in_stock">{isRTL ? 'متوفر' : 'In Stock'}</option>
                      <option value="low_stock">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</option>
                      <option value="out_of_stock">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'نطاق السعر' : 'Price Range'}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{isRTL ? 'كل الأسعار' : 'All Prices'}</option>
                      <option value="0-1000">$0 - $1,000</option>
                      <option value="1000-10000">$1,000 - $10,000</option>
                      <option value="10000+">{isRTL ? 'أكثر من $10,000' : '$10,000+'}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'ترتيب بواسطة' : 'Sort By'}
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="name">{isRTL ? 'الاسم' : 'Name'}</option>
                      <option value="price">{isRTL ? 'السعر' : 'Price'}</option>
                      <option value="stock">{isRTL ? 'المخزون' : 'Stock'}</option>
                      <option value="sales">{isRTL ? 'المبيعات' : 'Sales'}</option>
                      <option value="rating">{isRTL ? 'التقييم' : 'Rating'}</option>
                      <option value="created">{isRTL ? 'تاريخ الإنشاء' : 'Date Created'}</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    {isRTL ? 'إعادة تعيين' : 'Reset'}
                  </Button>
                  <Button size="sm">
                    {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid/List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isRTL ? 'المنتجات' : 'Products'} ({filteredProducts.length})
                </CardTitle>
                {selectedProducts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedProducts.length} {isRTL ? 'محدد' : 'selected'}
                    </span>
                    <Button variant="outline" size="sm">
                      {isRTL ? 'إجراء مجمع' : 'Bulk Action'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <PhotoIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm line-clamp-2">{isRTL ? product.nameAr : product.name}</h3>
                          {product.featured && (
                            <StarSolidIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">SKU:</span>
                          <span className="text-xs font-mono">{product.sku}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-green-600">
                            {isRTL ? `${product.price.toLocaleString()} ر.س` : `$${product.price.toLocaleString()}`}
                          </span>
                          <Badge
                            className={
                              product.status === 'active' ? 'bg-green-100 text-green-800' :
                              product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{isRTL ? 'المخزون:' : 'Stock:'} {product.stock}</span>
                          <div className="flex items-center">
                            <StarIcon className="w-3 h-3 mr-1" />
                            {product.rating} ({product.reviewCount})
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <EyeIcon className="w-3 h-3 mr-1" />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <PencilIcon className="w-3 h-3 mr-1" />
                            {isRTL ? 'تعديل' : 'Edit'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                          className="rounded"
                        />
                        
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 truncate">
                                {isRTL ? product.nameAr : product.name}
                                {product.featured && <StarSolidIcon className="w-4 h-4 text-yellow-500 inline ml-2" />}
                                {product.trending && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">Trending</span>}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span>SKU: {product.sku}</span>
                                <span>{product.category}</span>
                                <div className="flex items-center">
                                  <StarIcon className="w-3 h-3 mr-1" />
                                  {product.rating} ({product.reviewCount})
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right flex-shrink-0">
                              <div className="font-semibold text-green-600">
                                {isRTL ? `${product.price.toLocaleString()} ر.س` : `$${product.price.toLocaleString()}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {isRTL ? 'التكلفة:' : 'Cost:'} {isRTL ? `${product.cost.toLocaleString()} ر.س` : `$${product.cost.toLocaleString()}`}
                              </div>
                              <div className="text-sm font-medium text-blue-600">
                                {product.profitMargin}% {isRTL ? 'ربح' : 'margin'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center">
                                <CubeIcon className="w-4 h-4 mr-1 text-gray-400" />
                                <span className={product.stock <= product.lowStockThreshold ? 'text-orange-600 font-medium' : ''}>
                                  {isRTL ? 'المخزون:' : 'Stock:'} {product.stock}
                                  {product.stock <= product.lowStockThreshold && (
                                    <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 inline ml-1" />
                                  )}
                                </span>
                              </div>
                              
                              <div className="flex items-center">
                                <ShoppingCartIcon className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{isRTL ? 'المبيعات:' : 'Sales:'} {product.sales}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <EyeIcon className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{isRTL ? 'المشاهدات:' : 'Views:'} {product.views.toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  product.status === 'active' ? 'bg-green-100 text-green-800' :
                                  product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                  product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }
                              >
                                {product.status}
                              </Badge>
                              
                              <Button variant="ghost" size="sm">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <DuplicateIcon className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? 'لم يتم العثور على منتجات' : 'No products found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isRTL ? 'حاول تعديل معايير البحث أو الفلاتر' : 'Try adjusting your search criteria or filters'}
                  </p>
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {isRTL ? 'إضافة منتج جديد' : 'Add New Product'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-6 mt-6">
          {/* Inventory Management Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{isRTL ? 'مراقبة المخزون' : 'Inventory Monitoring'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.filter(p => p.stock <= p.lowStockThreshold).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex-1">
                        <h4 className="font-medium">{isRTL ? product.nameAr : product.name}</h4>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-orange-600 font-medium">
                            {isRTL ? 'المخزون الحالي:' : 'Current Stock:'} {product.stock}
                          </span>
                          <span className="text-sm text-gray-500 ml-4">
                            {isRTL ? 'الحد الأدنى:' : 'Min Threshold:'} {product.lowStockThreshold}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <TruckIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'إعادة الطلب' : 'Reorder'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <PencilIcon className="w-4 h-4 mr-1" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'ملخص المخزون' : 'Inventory Summary'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'قيمة المخزون الإجمالية' : 'Total Inventory Value'}</span>
                    <span className="font-semibold">
                      {isRTL ? `${(products.reduce((sum, p) => sum + (p.cost * p.stock), 0)).toLocaleString()} ر.س` : `$${(products.reduce((sum, p) => sum + (p.cost * p.stock), 0)).toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'منتجات نشطة' : 'Active Products'}</span>
                    <span className="font-semibold text-green-600">{metrics.activeProducts}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</span>
                    <span className="font-semibold text-orange-600">{metrics.lowStockProducts}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</span>
                    <span className="font-semibold text-red-600">{metrics.outOfStockProducts}</span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'صحة المخزون' : 'Inventory Health'}</span>
                      <span className="text-sm text-gray-500">
                        {Math.round((metrics.activeProducts / metrics.totalProducts) * 100)}%
                      </span>
                    </div>
                    <Progress value={(metrics.activeProducts / metrics.totalProducts) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Analytics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'أفضل المنتجات أداءً' : 'Top Performing Products'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={topPerformingProducts}
                  type="bar"
                  title=""
                  xKey="name"
                  yKey="revenue"
                  color="#10B981"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'أداء الفئات' : 'Category Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={categoryPerformance}
                  type="pie"
                  title=""
                  height={300}
                  colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'توزيع الأسعار' : 'Price Distribution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">$0 - $5,000</span>
                    <span className="text-sm font-medium">
                      {products.filter(p => p.price <= 5000).length} products
                    </span>
                  </div>
                  <Progress value={(products.filter(p => p.price <= 5000).length / products.length) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">$5,001 - $15,000</span>
                    <span className="text-sm font-medium">
                      {products.filter(p => p.price > 5000 && p.price <= 15000).length} products
                    </span>
                  </div>
                  <Progress value={(products.filter(p => p.price > 5000 && p.price <= 15000).length / products.length) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">$15,001+</span>
                    <span className="text-sm font-medium">
                      {products.filter(p => p.price > 15000).length} products
                    </span>
                  </div>
                  <Progress value={(products.filter(p => p.price > 15000).length / products.length) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'مقاييس الأداء' : 'Performance Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'معدل المشاهدة' : 'View Rate'}</span>
                      <span className="text-sm font-medium">
                        {(metrics.totalViews / metrics.totalProducts).toFixed(0)} avg
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</span>
                      <span className="text-sm font-medium">3.2%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{isRTL ? 'معدل رضا العملاء' : 'Customer Satisfaction'}</span>
                      <span className="text-sm font-medium">{metrics.averageRating.toFixed(1)}/5</span>
                    </div>
                    <Progress value={(metrics.averageRating / 5) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'التوقعات' : 'Forecasting'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {isRTL ? '+18%' : '+18%'}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {isRTL ? 'نمو متوقع للشهر القادم' : 'Expected growth next month'}
                    </p>
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'المبيعات المتوقعة' : 'Expected Sales'}</span>
                      <span className="font-medium">156 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'الإيرادات المتوقعة' : 'Expected Revenue'}</span>
                      <span className="font-medium">
                        {isRTL ? '1,250,000 ر.س' : '$1,250,000'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isRTL ? 'منتجات تحتاج إعادة طلب' : 'Reorder Needed'}</span>
                      <span className="font-medium text-orange-600">8 products</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-6 mt-6">
          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'توصيات التحسين' : 'Optimization Recommendations'}</CardTitle>
              <CardDescription>
                {isRTL ? 'اقتراحات مخصصة لتحسين أداء منتجاتك' : 'Personalized suggestions to improve your product performance'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">
                    {isRTL ? '🎯 الفرص عالية الأولوية' : '🎯 High Priority Opportunities'}
                  </h3>
                  
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2">{isRTL ? 'تحسين الأسعار' : 'Price Optimization'}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? '3 منتجات يمكن زيادة أسعارها بناءً على الطلب العالي' : '3 products could benefit from price increases based on high demand'}
                    </p>
                    <div className="flex items-center text-sm">
                      <BanknotesIcon className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {isRTL ? 'زيادة محتملة في الإيرادات: 15%' : 'Potential revenue increase: 15%'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium mb-2">{isRTL ? 'تحسين المخزون' : 'Inventory Optimization'}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? 'إعادة ترتيب مستويات المخزون لمنع نفاد المنتجات الشائعة' : 'Rebalance inventory levels to prevent stockouts of popular items'}
                    </p>
                    <div className="flex items-center text-sm">
                      <CubeIcon className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        {isRTL ? '8 منتجات تحتاج إعادة الطلب' : '8 products need reordering'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <h4 className="font-medium mb-2">{isRTL ? 'تحسين السيو' : 'SEO Improvement'}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? 'تحسين أوصاف المنتجات والكلمات المفتاحية لزيادة الظهور' : 'Enhance product descriptions and keywords to increase visibility'}
                    </p>
                    <div className="flex items-center text-sm">
                      <EyeIcon className="w-4 h-4 mr-1 text-purple-600" />
                      <span className="text-purple-600 font-medium">
                        {isRTL ? 'زيادة محتملة في المشاهدات: 25%' : 'Potential view increase: 25%'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-orange-600">
                    {isRTL ? '⚠️ مجالات تحتاج انتباه' : '⚠️ Areas Needing Attention'}
                  </h3>
                  
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-medium mb-2">{isRTL ? 'منتجات ضعيفة الأداء' : 'Underperforming Products'}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? '5 منتجات تحتاج تحسين أو إعادة تقييم' : '5 products need improvement or reassessment'}
                    </p>
                    <div className="space-y-1">
                      {products.filter(p => p.sales < 10).slice(0, 3).map(product => (
                        <div key={product.id} className="text-xs flex justify-between">
                          <span>{product.name}</span>
                          <span>{product.sales} sales</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium mb-2">{isRTL ? 'نفاد المخزون' : 'Stock Issues'}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? 'منتجات نفد مخزونها أو اقترب من النفاد' : 'Products that are out of stock or running low'}
                    </p>
                    <div className="space-y-1">
                      {products.filter(p => p.stock <= p.lowStockThreshold).slice(0, 3).map(product => (
                        <div key={product.id} className="text-xs flex justify-between">
                          <span>{product.name}</span>
                          <span className={product.stock === 0 ? 'text-red-600 font-medium' : 'text-orange-600'}>
                            {product.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-medium mb-2">{isRTL ? 'تحسين الصور' : 'Image Quality'}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? 'منتجات تحتاج صور عالية الجودة أو صور إضافية' : 'Products need high-quality images or additional photos'}
                    </p>
                    <div className="flex items-center text-sm">
                      <PhotoIcon className="w-4 h-4 mr-1 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">
                        {isRTL ? '12 منتج يحتاج تحسين الصور' : '12 products need image improvements'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button>
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  {isRTL ? 'تحديث التوصيات' : 'Refresh Recommendations'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}