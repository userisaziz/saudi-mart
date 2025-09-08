import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  Alert,
  AlertDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/shared/components/ui';
import {
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TagIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

enum ProductApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_CHANGES = 'requires_changes'
}

interface ProductApprovalRequest {
  id: string;
  productId: string;
  productName: string;
  productNameAr: string;
  sku: string;
  sellerName: string;
  sellerEmail: string;
  sellerId: string;
  categoryName: string;
  categoryPath: string[];
  description: string;
  descriptionAr: string;
  price: number;
  costPrice: number;
  stock: number;
  images: string[];
  specifications: Array<{ key: string; value: string; keyAr: string; valueAr: string }>;
  tags: string[];
  status: ProductApprovalStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminComments?: string;
  rejectionReasons?: string[];
  priority: 'high' | 'medium' | 'low';
  isNewSeller: boolean;
  violatesGuidelines: boolean;
}

const mockProductRequests: ProductApprovalRequest[] = [
  {
    id: '1',
    productId: 'prod_001',
    productName: 'iPhone 15 Pro Max Case - Premium Leather',
    productNameAr: 'غطاء آيفون 15 برو ماكس - جلد فاخر',
    sku: 'APL-IP15PM-CASE-001',
    sellerName: 'TechGadgets Plus',
    sellerEmail: 'seller@techgadgets.com',
    sellerId: 'seller_001',
    categoryName: 'Phone Cases',
    categoryPath: ['Electronics', 'Mobile Accessories', 'Phone Cases'],
    description: 'Premium genuine leather case for iPhone 15 Pro Max with card slots and magnetic closure',
    descriptionAr: 'غطاء جلدي أصلي فاخر لآيفون 15 برو ماكس مع فتحات للبطاقات وإغلاق مغناطيسي',
    price: 299.99,
    costPrice: 150.00,
    stock: 50,
    images: ['/images/iphone-case-1.jpg', '/images/iphone-case-2.jpg'],
    specifications: [
      { key: 'Material', value: 'Genuine Leather', keyAr: 'المادة', valueAr: 'جلد أصلي' },
      { key: 'Color', value: 'Black', keyAr: 'اللون', valueAr: 'أسود' }
    ],
    tags: ['iPhone', 'Case', 'Leather', 'Premium'],
    status: ProductApprovalStatus.PENDING,
    submittedAt: new Date('2024-01-20'),
    priority: 'high',
    isNewSeller: false,
    violatesGuidelines: false
  },
  {
    id: '2',
    productId: 'prod_002',
    productName: 'Wireless Gaming Mouse RGB',
    productNameAr: 'ماوس ألعاب لاسلكي RGB',
    sku: 'GMG-WRL-RGB-002',
    sellerName: 'GameHub Store',
    sellerEmail: 'contact@gamehub.com',
    sellerId: 'seller_002',
    categoryName: 'Gaming Accessories',
    categoryPath: ['Electronics', 'Computers', 'Gaming Accessories'],
    description: 'High-performance wireless gaming mouse with RGB lighting and programmable buttons',
    descriptionAr: 'ماوس ألعاب لاسلكي عالي الأداء مع إضاءة RGB وأزرار قابلة للبرمجة',
    price: 159.99,
    costPrice: 80.00,
    stock: 25,
    images: ['/images/gaming-mouse-1.jpg', '/images/gaming-mouse-2.jpg', '/images/gaming-mouse-3.jpg'],
    specifications: [
      { key: 'DPI', value: '16000 DPI', keyAr: 'DPI', valueAr: '16000 DPI' },
      { key: 'Connection', value: 'Wireless 2.4GHz', keyAr: 'الاتصال', valueAr: 'لاسلكي 2.4 جيجاهرتز' }
    ],
    tags: ['Gaming', 'Mouse', 'RGB', 'Wireless'],
    status: ProductApprovalStatus.REQUIRES_CHANGES,
    submittedAt: new Date('2024-01-18'),
    reviewedAt: new Date('2024-01-19'),
    reviewedBy: 'Admin User',
    adminComments: 'Product images need to be higher resolution. Please update the main product image.',
    rejectionReasons: ['Low quality images'],
    priority: 'medium',
    isNewSeller: true,
    violatesGuidelines: false
  },
  {
    id: '3',
    productId: 'prod_003',
    productName: 'Smart Fitness Tracker - Health Monitor',
    productNameAr: 'جهاز تتبع اللياقة الذكي - مراقب الصحة',
    sku: 'FIT-SMART-TRACK-003',
    sellerName: 'HealthTech Solutions',
    sellerEmail: 'info@healthtech.com',
    sellerId: 'seller_003',
    categoryName: 'Fitness Trackers',
    categoryPath: ['Health & Beauty', 'Fitness', 'Fitness Trackers'],
    description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and smartphone integration',
    descriptionAr: 'جهاز تتبع لياقة متطور مع مراقبة معدل ضربات القلب وتتبع النوم والتكامل مع الهواتف الذكية',
    price: 199.99,
    costPrice: 120.00,
    stock: 75,
    images: ['/images/fitness-tracker-1.jpg', '/images/fitness-tracker-2.jpg'],
    specifications: [
      { key: 'Battery Life', value: '7 days', keyAr: 'عمر البطارية', valueAr: '7 أيام' },
      { key: 'Water Resistance', value: 'IP68', keyAr: 'مقاومة الماء', valueAr: 'IP68' }
    ],
    tags: ['Fitness', 'Tracker', 'Health', 'Smart'],
    status: ProductApprovalStatus.APPROVED,
    submittedAt: new Date('2024-01-15'),
    reviewedAt: new Date('2024-01-17'),
    reviewedBy: 'Admin User',
    adminComments: 'Product approved. Good quality images and complete information.',
    priority: 'high',
    isNewSeller: false,
    violatesGuidelines: false
  }
];

export const ProductApproval: React.FC = () => {
  const [requests, setRequests] = useState<ProductApprovalRequest[]>(mockProductRequests);
  const [filteredRequests, setFilteredRequests] = useState<ProductApprovalRequest[]>(mockProductRequests);
  const [selectedRequest, setSelectedRequest] = useState<ProductApprovalRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [adminComments, setAdminComments] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'require_changes' | null>(null);

  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = requests.filter(request => {
      const matchesSearch = 
        request.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || request.categoryName.toLowerCase().includes(categoryFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const handleReviewRequest = (request: ProductApprovalRequest, action: 'approve' | 'reject' | 'require_changes') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setAdminComments('');
    setRejectionReasons([]);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedRequest || !reviewAction) return;

    const updatedRequests = requests.map(request => {
      if (request.id === selectedRequest.id) {
        const newStatus = reviewAction === 'approve' 
          ? ProductApprovalStatus.APPROVED 
          : reviewAction === 'reject' 
            ? ProductApprovalStatus.REJECTED 
            : ProductApprovalStatus.REQUIRES_CHANGES;

        return {
          ...request,
          status: newStatus,
          reviewedAt: new Date(),
          reviewedBy: 'Current Admin',
          adminComments,
          rejectionReasons: reviewAction !== 'approve' ? rejectionReasons : undefined
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
    setReviewAction(null);
    setAdminComments('');
    setRejectionReasons([]);
  };

  const getStatusBadge = (status: ProductApprovalStatus) => {
    const variants = {
      [ProductApprovalStatus.PENDING]: 'default',
      [ProductApprovalStatus.REQUIRES_CHANGES]: 'secondary',
      [ProductApprovalStatus.APPROVED]: 'success',
      [ProductApprovalStatus.REJECTED]: 'destructive'
    } as const;

    const labels = {
      [ProductApprovalStatus.PENDING]: 'Pending',
      [ProductApprovalStatus.REQUIRES_CHANGES]: 'Needs Changes',
      [ProductApprovalStatus.APPROVED]: 'Approved',
      [ProductApprovalStatus.REJECTED]: 'Rejected'
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatSARCurrency = (amount: number) => `${amount.toFixed(2)} SAR`;

  const pendingCount = requests.filter(r => r.status === ProductApprovalStatus.PENDING).length;
  const requiresChangesCount = requests.filter(r => r.status === ProductApprovalStatus.REQUIRES_CHANGES).length;
  const approvedCount = requests.filter(r => r.status === ProductApprovalStatus.APPROVED).length;
  const rejectedCount = requests.filter(r => r.status === ProductApprovalStatus.REJECTED).length;

  const commonRejectionReasons = [
    'Low quality images',
    'Incomplete product description',
    'Pricing issues',
    'Category mismatch',
    'Missing specifications',
    'Duplicate product',
    'Trademark violation',
    'Inappropriate content'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Approval</h1>
          <p className="text-gray-600">Review and approve product listings from sellers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Needs Changes</p>
                <p className="text-2xl font-bold text-blue-600">{requiresChangesCount}</p>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircleIcon className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by product name, seller, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={ProductApprovalStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ProductApprovalStatus.REQUIRES_CHANGES}>Needs Changes</SelectItem>
                <SelectItem value={ProductApprovalStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={ProductApprovalStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Approval Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {request.images.length > 0 ? (
                        <img 
                          src={request.images[0]} 
                          alt={request.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{request.productName}</div>
                        <div className="text-sm text-gray-500">{request.sku}</div>
                        {request.isNewSeller && (
                          <Badge variant="secondary" className="text-xs mt-1">New Seller</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.sellerName}</div>
                      <div className="text-sm text-gray-500">{request.sellerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{request.categoryName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatSARCurrency(request.price)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{request.stock}</span>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(request.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {request.submittedAt.toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {request.status === ProductApprovalStatus.PENDING && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'require_changes')}
                          >
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            Changes
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'reject')}
                          >
                            <XCircleIcon className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No product approval requests found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Name (English)</label>
                    <p className="mt-1 font-medium">{selectedRequest.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Name (Arabic)</label>
                    <p className="mt-1 font-medium text-right">{selectedRequest.productNameAr}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">SKU</label>
                    <p className="mt-1 font-mono text-sm">{selectedRequest.sku}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1 font-medium text-green-600">{formatSARCurrency(selectedRequest.price)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Stock</label>
                    <p className="mt-1 font-medium">{selectedRequest.stock} units</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Category Path</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedRequest.categoryPath.join(' > ')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description (English)</label>
                    <p className="mt-1 text-sm">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description (Arabic)</label>
                    <p className="mt-1 text-sm text-right">{selectedRequest.descriptionAr}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedRequest.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Seller Information</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedRequest.sellerName}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.sellerEmail}</p>
                    {selectedRequest.isNewSeller && (
                      <Badge variant="secondary" className="mt-2">New Seller</Badge>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRequest.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {index + 1}/{selectedRequest.images.length}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedRequest.images.length === 0 && (
                  <div className="text-center py-8">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No images uploaded for this product.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Specification (English)</TableHead>
                      <TableHead>Value (English)</TableHead>
                      <TableHead>Specification (Arabic)</TableHead>
                      <TableHead>Value (Arabic)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRequest.specifications.map((spec, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{spec.key}</TableCell>
                        <TableCell>{spec.value}</TableCell>
                        <TableCell className="font-medium text-right">{spec.keyAr}</TableCell>
                        <TableCell className="text-right">{spec.valueAr}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {selectedRequest.specifications.length === 0 && (
                  <div className="text-center py-8">
                    <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No specifications provided for this product.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="review" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <div className="mt-1">
                      {getPriorityBadge(selectedRequest.priority)}
                    </div>
                  </div>
                </div>

                {selectedRequest.adminComments && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Admin Comments</label>
                    <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{selectedRequest.adminComments}</p>
                  </div>
                )}

                {selectedRequest.rejectionReasons && selectedRequest.rejectionReasons.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rejection Reasons</label>
                    <ul className="mt-1 list-disc list-inside text-sm text-red-600">
                      {selectedRequest.rejectionReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Submitted:</span> {selectedRequest.submittedAt.toLocaleString()}
                  </div>
                  {selectedRequest.reviewedAt && (
                    <div>
                      <span className="font-medium">Reviewed:</span> {selectedRequest.reviewedAt.toLocaleString()}
                      {selectedRequest.reviewedBy && <span className="ml-2">by {selectedRequest.reviewedBy}</span>}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' && 'Approve Product'}
              {reviewAction === 'reject' && 'Reject Product'}
              {reviewAction === 'require_changes' && 'Request Changes'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' && 'This will approve the product and make it live on the platform.'}
              {reviewAction === 'reject' && 'This will reject the product and notify the seller.'}
              {reviewAction === 'require_changes' && 'This will request changes from the seller before approval.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRequest && (
              <Alert>
                <CubeIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedRequest.productName}</strong> by <strong>{selectedRequest.sellerName}</strong>
                </AlertDescription>
              </Alert>
            )}

            {reviewAction !== 'approve' && (
              <div>
                <label className="text-sm font-medium">Reason for {reviewAction === 'reject' ? 'Rejection' : 'Changes'}</label>
                <div className="mt-2 space-y-2">
                  {commonRejectionReasons.map((reason) => (
                    <label key={reason} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rejectionReasons.includes(reason)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRejectionReasons([...rejectionReasons, reason]);
                          } else {
                            setRejectionReasons(rejectionReasons.filter(r => r !== reason));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">
                {reviewAction === 'approve' ? 'Approval Comments (Optional)' : 'Additional Comments'}
              </label>
              <Textarea
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder={
                  reviewAction === 'approve' 
                    ? 'Add any comments for the seller...'
                    : 'Provide specific details about what needs to be changed...'
                }
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className={
                reviewAction === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : reviewAction === 'require_changes'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : ''
              }
              variant={reviewAction === 'reject' ? 'destructive' : 'default'}
              disabled={reviewAction !== 'approve' && rejectionReasons.length === 0}
            >
              {reviewAction === 'approve' && 'Approve Product'}
              {reviewAction === 'reject' && 'Reject Product'}
              {reviewAction === 'require_changes' && 'Request Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductApproval;