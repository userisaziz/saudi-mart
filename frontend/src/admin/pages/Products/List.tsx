import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Package,
  TrendingUp,
  Star,
  Image,
  ShoppingCart,
  RefreshCw,
  ChevronDown,
  Archive
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { 
  SaudiProduct, 
  ProductVerificationStatus,
  SaudiRegion 
} from '@/admin/types/saudi-admin';
import { formatDistanceToNow, format } from 'date-fns';

// Mock product data for demonstration
const mockProducts: SaudiProduct[] = [
  {
    id: '1',
    nameAr: 'جهاز كمبيوتر محمول',
    nameEn: 'Gaming Laptop',
    descriptionAr: 'جهاز كمبيوتر محمول للألعاب عالي الأداء',
    descriptionEn: 'High-performance gaming laptop with RTX graphics',
    price: { amount: 4500.00, currency: 'SAR', vatIncluded: true },
    category: {
      id: 'cat1',
      nameAr: 'إلكترونيات',
      nameEn: 'Electronics',
      level: 1,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 1,
      seoData: { slugAr: 'electronics-ar', slugEn: 'electronics' },
      analytics: { productCount: 150, activeProducts: 120, totalRevenue: 250000, avgPrice: 1500 }
    },
    seller: {
      id: 'seller1',
      name: 'Tech Solutions Ltd.',
      verificationStatus: 'fully_verified' as any
    },
    images: [
      { id: 'img1', url: '/images/laptop1.jpg', alt: 'Gaming Laptop', isPrimary: true, order: 1 }
    ],
    specifications: [
      { nameAr: 'المعالج', nameEn: 'Processor', valueAr: 'Intel i7', valueEn: 'Intel i7' },
      { nameAr: 'الذاكرة', nameEn: 'RAM', valueAr: '16 جيجا', valueEn: '16GB' }
    ],
    inventory: { quantity: 25, lowStockThreshold: 5, location: 'Riyadh Warehouse' },
    compliance: { saudiStandards: true, halalCertified: false },
    verificationStatus: ProductVerificationStatus.APPROVED,
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-20T14:45:00Z'
  },
  {
    id: '2',
    nameAr: 'هاتف ذكي',
    nameEn: 'Smartphone Pro',
    descriptionAr: 'هاتف ذكي بكاميرا متقدمة',
    descriptionEn: 'Advanced smartphone with professional camera',
    price: { amount: 2800.00, currency: 'SAR', vatIncluded: true },
    category: {
      id: 'cat1',
      nameAr: 'إلكترونيات',
      nameEn: 'Electronics',
      level: 1,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 1,
      seoData: { slugAr: 'electronics-ar', slugEn: 'electronics' },
      analytics: { productCount: 150, activeProducts: 120, totalRevenue: 250000, avgPrice: 1500 }
    },
    seller: {
      id: 'seller2',
      name: 'Mobile World',
      verificationStatus: 'identity_verified' as any
    },
    images: [
      { id: 'img2', url: '/images/phone1.jpg', alt: 'Smartphone', isPrimary: true, order: 1 }
    ],
    specifications: [
      { nameAr: 'الشاشة', nameEn: 'Display', valueAr: '6.7 إنش', valueEn: '6.7 inch' },
      { nameAr: 'الكاميرا', nameEn: 'Camera', valueAr: '108 ميجا بكسل', valueEn: '108MP' }
    ],
    inventory: { quantity: 2, lowStockThreshold: 5, location: 'Jeddah Warehouse' },
    compliance: { saudiStandards: true, halalCertified: false },
    verificationStatus: ProductVerificationStatus.UNDER_REVIEW,
    createdAt: '2024-02-18T09:15:00Z',
    updatedAt: '2024-02-22T16:20:00Z'
  },
  {
    id: '3',
    nameAr: 'سماعات لاسلكية',
    nameEn: 'Wireless Headphones',
    descriptionAr: 'سماعات لاسلكية بتقنية إلغاء الضوضاء',
    descriptionEn: 'Premium wireless headphones with noise cancellation',
    price: { amount: 450.00, currency: 'SAR', vatIncluded: true },
    category: {
      id: 'cat1',
      nameAr: 'إلكترونيات',
      nameEn: 'Electronics',
      level: 1,
      isActive: true,
      requiresVerification: true,
      sasoCompliant: true,
      displayOrder: 1,
      seoData: { slugAr: 'electronics-ar', slugEn: 'electronics' },
      analytics: { productCount: 150, activeProducts: 120, totalRevenue: 250000, avgPrice: 1500 }
    },
    seller: {
      id: 'seller3',
      name: 'Audio Plus',
      verificationStatus: 'business_verified' as any
    },
    images: [
      { id: 'img3', url: '/images/headphones1.jpg', alt: 'Headphones', isPrimary: true, order: 1 }
    ],
    specifications: [
      { nameAr: 'البطارية', nameEn: 'Battery', valueAr: '30 ساعة', valueEn: '30 hours' },
      { nameAr: 'الاتصال', nameEn: 'Connectivity', valueAr: 'بلوتوث 5.0', valueEn: 'Bluetooth 5.0' }
    ],
    inventory: { quantity: 0, lowStockThreshold: 10, location: 'Dammam Warehouse' },
    compliance: { saudiStandards: true, halalCertified: false },
    verificationStatus: ProductVerificationStatus.REJECTED,
    adminNotes: [
      {
        id: 'note1',
        content: 'Product images do not meet quality standards',
        adminId: 'admin1',
        adminName: 'Admin User',
        createdAt: '2024-02-20T10:00:00Z',
        type: 'warning'
      }
    ],
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-21T11:15:00Z'
  }
];

interface ProductFilters {
  search: string;
  status: string;
  category: string;
  seller: string;
  region: string;
  priceRange: string;
  compliance: string;
}

const AdminProductsList: React.FC = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<SaudiProduct[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<SaudiProduct[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [bulkLoading, setBulkLoading] = useState(false);
  
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    status: 'all',
    category: 'all',
    seller: 'all',
    region: 'all',
    priceRange: 'all',
    compliance: 'all'
  });

  const [stats, setStats] = useState({
    total: mockProducts.length,
    approved: mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.APPROVED).length,
    pending: mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.PENDING).length,
    underReview: mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.UNDER_REVIEW).length,
    rejected: mockProducts.filter(p => p.verificationStatus === ProductVerificationStatus.REJECTED).length,
    lowStock: mockProducts.filter(p => p.inventory.quantity <= p.inventory.lowStockThreshold).length,
    outOfStock: mockProducts.filter(p => p.inventory.quantity === 0).length
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.nameEn.toLowerCase().includes(searchLower) ||
        product.nameAr.includes(filters.search) ||
        product.seller.name.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(product => product.verificationStatus === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category.id === filters.category);
    }

    // Seller filter
    if (filters.seller !== 'all') {
      filtered = filtered.filter(product => product.seller.id === filters.seller);
    }

    // Compliance filter
    if (filters.compliance !== 'all') {
      if (filters.compliance === 'compliant') {
        filtered = filtered.filter(product => product.compliance.saudiStandards);
      } else if (filters.compliance === 'non-compliant') {
        filtered = filtered.filter(product => !product.compliance.saudiStandards);
      }
    }

    setFilteredProducts(filtered);
  };

  const getStatusBadge = (status: ProductVerificationStatus) => {
    const statusConfig = {
      [ProductVerificationStatus.PENDING]: { 
        label: 'Pending', 
        variant: 'outline' as const, 
        icon: Clock 
      },
      [ProductVerificationStatus.UNDER_REVIEW]: { 
        label: 'Under Review', 
        variant: 'secondary' as const, 
        icon: AlertCircle 
      },
      [ProductVerificationStatus.APPROVED]: { 
        label: 'Approved', 
        variant: 'default' as const, 
        icon: CheckCircle 
      },
      [ProductVerificationStatus.REJECTED]: { 
        label: 'Rejected', 
        variant: 'destructive' as const, 
        icon: XCircle 
      },
      [ProductVerificationStatus.REQUIRES_INFO]: { 
        label: 'Needs Info', 
        variant: 'outline' as const, 
        icon: AlertCircle 
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getStockBadge = (product: SaudiProduct) => {
    if (product.inventory.quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (product.inventory.quantity <= product.inventory.lowStockThreshold) {
      return <Badge variant="outline">Low Stock</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length 
        ? [] 
        : filteredProducts.map(p => p.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;
    
    setBulkLoading(true);
    try {
      // Simulate bulk action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) 
            ? { ...p, verificationStatus: ProductVerificationStatus.APPROVED }
            : p
        ));
      } else if (action === 'reject') {
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) 
            ? { ...p, verificationStatus: ProductVerificationStatus.REJECTED }
            : p
        ));
      }
      
      setSelectedProducts([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setBulkLoading(false);
    }
  };

  const StatsCard = ({ title, value, subtitle, icon: Icon, variant = 'default' }: { 
    title: string; 
    value: number; 
    subtitle?: string; 
    icon: any;
    variant?: 'default' | 'warning' | 'destructive';
  }) => {
    const cardClass = variant === 'warning' ? 'border-yellow-200' : 
                     variant === 'destructive' ? 'border-red-200' : '';
    
    return (
      <Card className={cardClass}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {title}
            </CardTitle>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </CardHeader>
      </Card>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Manage, review, and approve products in the marketplace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatsCard title="Total Products" value={stats.total} icon={Package} />
        <StatsCard title="Approved" value={stats.approved} icon={CheckCircle} />
        <StatsCard title="Pending Review" value={stats.pending} icon={Clock} />
        <StatsCard title="Under Review" value={stats.underReview} icon={AlertCircle} />
        <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} variant="destructive" />
        <StatsCard title="Low Stock" value={stats.lowStock} icon={TrendingUp} variant="warning" />
        <StatsCard title="Out of Stock" value={stats.outOfStock} icon={Archive} variant="destructive" />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Filter products by various criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products, sellers..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={ProductVerificationStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ProductVerificationStatus.UNDER_REVIEW}>Under Review</SelectItem>
                <SelectItem value={ProductVerificationStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={ProductVerificationStatus.REJECTED}>Rejected</SelectItem>
                <SelectItem value={ProductVerificationStatus.REQUIRES_INFO}>Needs Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cat1">Electronics</SelectItem>
                <SelectItem value="cat2">Fashion</SelectItem>
                <SelectItem value="cat3">Home & Garden</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.compliance} onValueChange={(value) => setFilters(prev => ({ ...prev, compliance: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="compliant">SASO Compliant</SelectItem>
                <SelectItem value="non-compliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  disabled={bulkLoading}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                  disabled={bulkLoading}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                  disabled={bulkLoading}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products List</CardTitle>
              <CardDescription>
                Showing {currentProducts.length} of {filteredProducts.length} products
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleSelectProduct(product.id)}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 rounded-md">
                              {product.images.length > 0 ? (
                                <AvatarImage src={product.images[0].url} alt={product.images[0].alt} />
                              ) : null}
                              <AvatarFallback className="rounded-md">
                                <Image className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{product.nameEn}</div>
                              <div className="text-sm text-muted-foreground" dir="rtl">
                                {product.nameAr}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {product.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.seller.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.seller.verificationStatus.replace('_', ' ')}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.category.nameEn}</div>
                            <div className="text-xs text-muted-foreground" dir="rtl">
                              {product.category.nameAr}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-medium">
                            {product.price.currency} {product.price.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {product.price.vatIncluded ? 'VAT included' : 'VAT excluded'}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            {getStockBadge(product)}
                            <div className="text-xs text-muted-foreground">
                              {product.inventory.quantity} units
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>{getStatusBadge(product.verificationStatus)}</TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => navigate(`/admin/products/${product.id}`)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => navigate(`/admin/products/${product.id}/review`)}
                                className="gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Review Product
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No products found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 2
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsList;