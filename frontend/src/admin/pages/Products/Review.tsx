import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Star,
  Package,
  Building,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Shield,
  Settings,
  MessageSquare,
  Save,
  Send,
  RefreshCw,
  Expand,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Flag
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Progress } from '@/shared/components/ui/progress';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { 
  SaudiProduct, 
  ProductVerificationStatus,
  AdminNote 
} from '@/admin/types/saudi-admin';
import { format, formatDistanceToNow } from 'date-fns';

// Mock product data for demonstration
const mockProduct: SaudiProduct = {
  id: '1',
  nameAr: 'جهاز كمبيوتر محمول للألعاب',
  nameEn: 'Gaming Laptop Pro X15',
  descriptionAr: 'جهاز كمبيوتر محمول متقدم للألعاب مع معالج Intel Core i9 وبطاقة رسومات RTX 4080. مثالي للألعاب الاحترافية والمحتوى الإبداعي',
  descriptionEn: 'Advanced gaming laptop featuring Intel Core i9 processor and RTX 4080 graphics card. Perfect for professional gaming and creative content creation.',
  price: { amount: 8500.00, currency: 'SAR', vatIncluded: true },
  category: {
    id: 'cat1',
    nameAr: 'إلكترونيات - أجهزة كمبيوتر',
    nameEn: 'Electronics - Computers',
    level: 2,
    isActive: true,
    requiresVerification: true,
    sasoCompliant: true,
    displayOrder: 1,
    seoData: { slugAr: 'electronics-computers-ar', slugEn: 'electronics-computers' },
    analytics: { productCount: 50, activeProducts: 40, totalRevenue: 125000, avgPrice: 2500 }
  },
  seller: {
    id: 'seller1',
    name: 'TechZone Saudi Arabia',
    verificationStatus: 'fully_verified' as any
  },
  images: [
    { id: 'img1', url: '/images/laptop-front.jpg', alt: 'Gaming Laptop Front View', isPrimary: true, order: 1 },
    { id: 'img2', url: '/images/laptop-side.jpg', alt: 'Gaming Laptop Side View', isPrimary: false, order: 2 },
    { id: 'img3', url: '/images/laptop-keyboard.jpg', alt: 'Gaming Laptop Keyboard', isPrimary: false, order: 3 },
    { id: 'img4', url: '/images/laptop-ports.jpg', alt: 'Gaming Laptop Ports', isPrimary: false, order: 4 }
  ],
  specifications: [
    { nameAr: 'المعالج', nameEn: 'Processor', valueAr: 'Intel Core i9-13900HX', valueEn: 'Intel Core i9-13900HX' },
    { nameAr: 'كرت الرسومات', nameEn: 'Graphics Card', valueAr: 'NVIDIA RTX 4080', valueEn: 'NVIDIA RTX 4080' },
    { nameAr: 'الذاكرة العشوائية', nameEn: 'RAM', valueAr: '32 جيجابايت DDR5', valueEn: '32GB DDR5' },
    { nameAr: 'التخزين', nameEn: 'Storage', valueAr: '1 تيرابايت SSD NVMe', valueEn: '1TB NVMe SSD' },
    { nameAr: 'الشاشة', nameEn: 'Display', valueAr: '15.6 إنش 4K OLED', valueEn: '15.6" 4K OLED' },
    { nameAr: 'البطارية', nameEn: 'Battery', valueAr: '90Wh Li-ion', valueEn: '90Wh Li-ion' },
    { nameAr: 'الوزن', nameEn: 'Weight', valueAr: '2.3 كيلوجرام', valueEn: '2.3 kg' },
    { nameAr: 'نظام التشغيل', nameEn: 'Operating System', valueAr: 'ويندوز 11 برو', valueEn: 'Windows 11 Pro' }
  ],
  inventory: { quantity: 15, lowStockThreshold: 5, location: 'Riyadh Main Warehouse' },
  compliance: { 
    saudiStandards: true, 
    halalCertified: false,
    importLicense: 'IMP-2024-001234',
    customsCode: '8471.30.0000'
  },
  verificationStatus: ProductVerificationStatus.UNDER_REVIEW,
  adminNotes: [
    {
      id: 'note1',
      content: 'Product submitted for review. All required documents appear to be complete.',
      adminId: 'admin1',
      adminName: 'Ahmed Al-Rashid',
      createdAt: '2024-02-20T10:00:00Z',
      type: 'info'
    },
    {
      id: 'note2',
      content: 'Seller verification confirmed. Business license and VAT registration valid.',
      adminId: 'admin2',
      adminName: 'Fatima Al-Zahra',
      createdAt: '2024-02-20T14:30:00Z',
      type: 'success'
    }
  ],
  createdAt: '2024-02-20T08:30:00Z',
  updatedAt: '2024-02-20T14:30:00Z'
};

interface ReviewChecklist {
  productInfo: boolean;
  images: boolean;
  pricing: boolean;
  specifications: boolean;
  compliance: boolean;
  sellerVerification: boolean;
  documentation: boolean;
}

const ProductsReview: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [product, setProduct] = useState<SaudiProduct | null>(mockProduct);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<ProductVerificationStatus>(
    mockProduct.verificationStatus
  );
  const [reviewNotes, setReviewNotes] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  
  const [checklist, setChecklist] = useState<ReviewChecklist>({
    productInfo: false,
    images: false,
    pricing: false,
    specifications: false,
    compliance: false,
    sellerVerification: false,
    documentation: false
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id && !product) {
      // Load product data
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [id, product]);

  const getStatusBadge = (status: ProductVerificationStatus) => {
    const statusConfig = {
      [ProductVerificationStatus.PENDING]: { 
        label: 'Pending Review', 
        variant: 'outline' as const, 
        icon: Clock,
        color: 'text-yellow-600'
      },
      [ProductVerificationStatus.UNDER_REVIEW]: { 
        label: 'Under Review', 
        variant: 'secondary' as const, 
        icon: Eye,
        color: 'text-blue-600'
      },
      [ProductVerificationStatus.APPROVED]: { 
        label: 'Approved', 
        variant: 'default' as const, 
        icon: CheckCircle,
        color: 'text-green-600'
      },
      [ProductVerificationStatus.REJECTED]: { 
        label: 'Rejected', 
        variant: 'destructive' as const, 
        icon: XCircle,
        color: 'text-red-600'
      },
      [ProductVerificationStatus.REQUIRES_INFO]: { 
        label: 'Requires Information', 
        variant: 'outline' as const, 
        icon: AlertTriangle,
        color: 'text-orange-600'
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

  const getComplianceBadge = (compliant: boolean) => {
    return compliant ? (
      <Badge variant="default" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        SASO Compliant
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Not Compliant
      </Badge>
    );
  };

  const handleChecklistChange = (key: keyof ReviewChecklist, value: boolean) => {
    setChecklist(prev => ({ ...prev, [key]: value }));
  };

  const getChecklistProgress = () => {
    const completed = Object.values(checklist).filter(Boolean).length;
    const total = Object.values(checklist).length;
    return (completed / total) * 100;
  };

  const handleSaveReview = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new admin note
      const newNote: AdminNote = {
        id: `note_${Date.now()}`,
        content: reviewNotes || 'Review updated without additional notes',
        adminId: 'current_admin',
        adminName: 'Current Admin User',
        createdAt: new Date().toISOString(),
        type: reviewStatus === ProductVerificationStatus.APPROVED ? 'success' : 
              reviewStatus === ProductVerificationStatus.REJECTED ? 'error' : 'info'
      };

      if (product) {
        setProduct({
          ...product,
          verificationStatus: reviewStatus,
          adminNotes: [...(product.adminNotes || []), newNote],
          updatedAt: new Date().toISOString()
        });
      }

      setSuccess('Review saved successfully!');
      setReviewNotes('');
    } catch (err) {
      setError('Failed to save review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAction = async (action: ProductVerificationStatus) => {
    setReviewStatus(action);
    await handleSaveReview();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Product not found or failed to load.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/products')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Product Review</h1>
            <p className="text-muted-foreground">
              Review and moderate product listing: {product.nameEn}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusBadge(product.verificationStatus)}
          <Badge variant="outline">ID: {product.id}</Badge>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Review Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Review Progress
          </CardTitle>
          <CardDescription>
            Complete the review checklist to ensure thorough product evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {Object.values(checklist).filter(Boolean).length} / {Object.values(checklist).length} completed
            </span>
          </div>
          <Progress value={getChecklistProgress()} className="h-2" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="productInfo"
                checked={checklist.productInfo}
                onCheckedChange={(checked) => handleChecklistChange('productInfo', !!checked)}
              />
              <Label htmlFor="productInfo" className="text-sm">Product Information</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="images"
                checked={checklist.images}
                onCheckedChange={(checked) => handleChecklistChange('images', !!checked)}
              />
              <Label htmlFor="images" className="text-sm">Product Images</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pricing"
                checked={checklist.pricing}
                onCheckedChange={(checked) => handleChecklistChange('pricing', !!checked)}
              />
              <Label htmlFor="pricing" className="text-sm">Pricing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="specifications"
                checked={checklist.specifications}
                onCheckedChange={(checked) => handleChecklistChange('specifications', !!checked)}
              />
              <Label htmlFor="specifications" className="text-sm">Specifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="compliance"
                checked={checklist.compliance}
                onCheckedChange={(checked) => handleChecklistChange('compliance', !!checked)}
              />
              <Label htmlFor="compliance" className="text-sm">Compliance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sellerVerification"
                checked={checklist.sellerVerification}
                onCheckedChange={(checked) => handleChecklistChange('sellerVerification', !!checked)}
              />
              <Label htmlFor="sellerVerification" className="text-sm">Seller Verification</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="documentation"
                checked={checklist.documentation}
                onCheckedChange={(checked) => handleChecklistChange('documentation', !!checked)}
              />
              <Label htmlFor="documentation" className="text-sm">Documentation</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="gap-2">
                <Package className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="specs" className="gap-2">
                <FileText className="h-4 w-4" />
                Specifications
              </TabsTrigger>
              <TabsTrigger value="compliance" className="gap-2">
                <Shield className="h-4 w-4" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="seller" className="gap-2">
                <Building className="h-4 w-4" />
                Seller
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>Basic product details and description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Product Name (English)</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md font-medium">
                          {product.nameEn}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Product Name (Arabic)</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md font-medium text-right" dir="rtl">
                          {product.nameAr}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <div className="font-medium">{product.category.nameEn}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {product.category.nameAr}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Price</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <div className="font-bold text-lg">
                            {product.price.currency} {product.price.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.price.vatIncluded ? 'VAT Included' : 'VAT Excluded'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Stock Status</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <div className="font-medium">{product.inventory.quantity} units available</div>
                          <div className="text-sm text-muted-foreground">
                            Location: {product.inventory.location}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <div className="mt-1 p-3 bg-muted rounded-md">
                          <div className="font-medium">
                            {format(new Date(product.createdAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Description (English)</Label>
                    <div className="mt-1 p-4 bg-muted rounded-md min-h-24">
                      {product.descriptionEn}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Description (Arabic)</Label>
                    <div className="mt-1 p-4 bg-muted rounded-md min-h-24 text-right" dir="rtl">
                      {product.descriptionAr}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Review product images for quality and accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={image.alt}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setImageDialogOpen(true);
                            }}
                          />
                          {image.isPrimary && (
                            <Badge className="absolute top-2 left-2" variant="default">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground truncate">{image.alt}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">Order: {image.order}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Expand className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Image Gallery Dialog */}
                  <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Product Image Gallery</DialogTitle>
                        <DialogDescription>
                          Image {currentImageIndex + 1} of {product.images.length}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={product.images[currentImageIndex]?.url} 
                            alt={product.images[currentImageIndex]?.alt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                            disabled={currentImageIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Original
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentImageIndex(Math.min(product.images.length - 1, currentImageIndex + 1))}
                            disabled={currentImageIndex === product.images.length - 1}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                  <CardDescription>Detailed technical specifications and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{spec.nameEn}</p>
                          <p className="text-sm text-muted-foreground" dir="rtl">{spec.nameAr}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="font-medium">{spec.valueEn}</p>
                          <p className="text-sm text-muted-foreground" dir="rtl">{spec.valueAr}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Standards</CardTitle>
                  <CardDescription>Product compliance with Saudi regulations and standards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">SASO Compliance</Label>
                        <div className="mt-2">
                          {getComplianceBadge(product.compliance.saudiStandards)}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Halal Certification</Label>
                        <div className="mt-2">
                          <Badge variant={product.compliance.halalCertified ? 'default' : 'secondary'}>
                            {product.compliance.halalCertified ? 'Halal Certified' : 'Not Applicable'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {product.compliance.importLicense && (
                        <div>
                          <Label className="text-sm font-medium">Import License</Label>
                          <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm">
                            {product.compliance.importLicense}
                          </div>
                        </div>
                      )}
                      
                      {product.compliance.customsCode && (
                        <div>
                          <Label className="text-sm font-medium">Customs Code</Label>
                          <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm">
                            {product.compliance.customsCode}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Seller Tab */}
            <TabsContent value="seller" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seller Information</CardTitle>
                  <CardDescription>Details about the product seller and verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://avatar.vercel.sh/${product.seller.name}`} />
                      <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{product.seller.name}</h3>
                      <p className="text-sm text-muted-foreground">Seller ID: {product.seller.id}</p>
                      <Badge variant="default" className="mt-1">
                        {product.seller.verificationStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="gap-2">
                      <User className="h-4 w-4" />
                      View Seller Profile
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Package className="h-4 w-4" />
                      View Other Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Review Actions Sidebar */}
        <div className="space-y-6">
          {/* Review Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Review Actions
              </CardTitle>
              <CardDescription>
                Set the review status and add notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewStatus">Review Status</Label>
                <Select value={reviewStatus} onValueChange={(value) => setReviewStatus(value as ProductVerificationStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProductVerificationStatus.PENDING}>Pending Review</SelectItem>
                    <SelectItem value={ProductVerificationStatus.UNDER_REVIEW}>Under Review</SelectItem>
                    <SelectItem value={ProductVerificationStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={ProductVerificationStatus.REJECTED}>Rejected</SelectItem>
                    <SelectItem value={ProductVerificationStatus.REQUIRES_INFO}>Requires Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewNotes">Review Notes</Label>
                <Textarea
                  id="reviewNotes"
                  placeholder="Add your review comments, feedback, or reasons for the decision..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveReview}
                  disabled={saving}
                  className="flex-1 gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Review'}
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickAction(ProductVerificationStatus.APPROVED)}
                    disabled={saving}
                    className="gap-2 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Quick Approve
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickAction(ProductVerificationStatus.REJECTED)}
                    disabled={saving}
                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Quick Reject
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickAction(ProductVerificationStatus.REQUIRES_INFO)}
                    disabled={saving}
                    className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Request Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Review History
              </CardTitle>
              <CardDescription>
                Previous admin notes and review actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.adminNotes && product.adminNotes.length > 0 ? (
                  product.adminNotes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {note.adminName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{note.adminName}</span>
                            <Badge 
                              variant={
                                note.type === 'success' ? 'default' :
                                note.type === 'error' ? 'destructive' :
                                note.type === 'warning' ? 'outline' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {note.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{note.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No review history yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductsReview;