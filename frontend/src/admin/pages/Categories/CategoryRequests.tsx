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
  SelectValue
} from '@/shared/components/ui';
import {
  FolderPlus,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  User,
  Calendar,
  Tag,
  AlertTriangle
} from 'lucide-react';

enum CategoryRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review'
}

interface CategoryRequest {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerId: string;
  parentCategoryId: string;
  parentCategoryName: string;
  categoryName: string;
  categoryNameAr: string;
  description: string;
  descriptionAr: string;
  businessJustification: string;
  expectedProductCount: number;
  targetMarket: string;
  status: CategoryRequestStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminComments?: string;
  priority: 'high' | 'medium' | 'low';
}

const mockRequests: CategoryRequest[] = [
  {
    id: '1',
    sellerName: 'Ahmed Electronics Store',
    sellerEmail: 'ahmed@electronics.com',
    sellerId: 'seller_123',
    parentCategoryId: 'electronics',
    parentCategoryName: 'Electronics > Mobile Accessories',
    categoryName: 'Wireless Charging Pads',
    categoryNameAr: 'أجهزة الشحن اللاسلكية',
    description: 'Wireless charging solutions for smartphones and devices',
    descriptionAr: 'حلول الشحن اللاسلكي للهواتف الذكية والأجهزة',
    businessJustification: 'Growing demand for wireless charging accessories with 50+ products ready to list',
    expectedProductCount: 75,
    targetMarket: 'Tech enthusiasts, smartphone users',
    status: CategoryRequestStatus.PENDING,
    submittedAt: new Date('2024-01-15'),
    priority: 'high'
  },
  {
    id: '2',
    sellerName: 'Fashion Hub',
    sellerEmail: 'contact@fashionhub.com',
    sellerId: 'seller_456',
    parentCategoryId: 'fashion',
    parentCategoryName: 'Fashion > Women\'s Clothing',
    categoryName: 'Sustainable Fashion',
    categoryNameAr: 'الأزياء المستدامة',
    description: 'Eco-friendly and sustainable clothing options',
    descriptionAr: 'خيارات الملابس الصديقة للبيئة والمستدامة',
    businessJustification: 'Increasing consumer awareness about sustainable fashion, targeting eco-conscious customers',
    expectedProductCount: 120,
    targetMarket: 'Eco-conscious consumers, millennials',
    status: CategoryRequestStatus.UNDER_REVIEW,
    submittedAt: new Date('2024-01-10'),
    reviewedAt: new Date('2024-01-12'),
    reviewedBy: 'Admin User',
    priority: 'medium'
  },
  {
    id: '3',
    sellerName: 'Home Decor Plus',
    sellerEmail: 'info@homedecorplus.com',
    sellerId: 'seller_789',
    parentCategoryId: 'home',
    parentCategoryName: 'Home & Garden > Decor',
    categoryName: 'Smart Home Lighting',
    categoryNameAr: 'إضاءة المنزل الذكية',
    description: 'Smart LED bulbs, strips, and automated lighting systems',
    descriptionAr: 'مصابيح LED ذكية وشرائط وأنظمة إضاءة آلية',
    businessJustification: 'Smart home market growing rapidly, we have partnerships with major lighting manufacturers',
    expectedProductCount: 200,
    targetMarket: 'Smart home enthusiasts, tech-savvy homeowners',
    status: CategoryRequestStatus.APPROVED,
    submittedAt: new Date('2024-01-05'),
    reviewedAt: new Date('2024-01-08'),
    reviewedBy: 'Admin User',
    adminComments: 'Approved - Good market demand and seller has proven track record',
    priority: 'high'
  }
];

export const CategoryRequests: React.FC = () => {
  const [requests, setRequests] = useState<CategoryRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState<CategoryRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<CategoryRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [adminComments, setAdminComments] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = requests.filter(request => {
      const matchesSearch = 
        request.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.parentCategoryName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  const handleReviewRequest = (request: CategoryRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setAdminComments('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedRequest || !reviewAction) return;

    const updatedRequests = requests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: reviewAction === 'approve' ? CategoryRequestStatus.APPROVED : CategoryRequestStatus.REJECTED,
          reviewedAt: new Date(),
          reviewedBy: 'Current Admin', // This would come from auth context
          adminComments
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    setIsReviewModalOpen(false);
    setSelectedRequest(null);
    setReviewAction(null);
    setAdminComments('');
  };

  const getStatusBadge = (status: CategoryRequestStatus) => {
    const variants = {
      [CategoryRequestStatus.PENDING]: 'default',
      [CategoryRequestStatus.UNDER_REVIEW]: 'secondary',
      [CategoryRequestStatus.APPROVED]: 'success',
      [CategoryRequestStatus.REJECTED]: 'destructive'
    } as const;

    const labels = {
      [CategoryRequestStatus.PENDING]: 'Pending',
      [CategoryRequestStatus.UNDER_REVIEW]: 'Under Review',
      [CategoryRequestStatus.APPROVED]: 'Approved',
      [CategoryRequestStatus.REJECTED]: 'Rejected'
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

  const pendingCount = requests.filter(r => r.status === CategoryRequestStatus.PENDING).length;
  const underReviewCount = requests.filter(r => r.status === CategoryRequestStatus.UNDER_REVIEW).length;
  const approvedCount = requests.filter(r => r.status === CategoryRequestStatus.APPROVED).length;
  const rejectedCount = requests.filter(r => r.status === CategoryRequestStatus.REJECTED).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Requests</h1>
          <p className="text-gray-600">Review and approve category requests from sellers</p>
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
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{underReviewCount}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
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
              <CheckCircle className="w-8 h-8 text-green-500" />
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
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by seller, category name, or parent category..."
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
                <SelectItem value={CategoryRequestStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={CategoryRequestStatus.UNDER_REVIEW}>Under Review</SelectItem>
                <SelectItem value={CategoryRequestStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={CategoryRequestStatus.REJECTED}>Rejected</SelectItem>
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

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Requested Category</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Expected Products</TableHead>
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
                    <div>
                      <div className="font-medium">{request.sellerName}</div>
                      <div className="text-sm text-gray-500">{request.sellerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.categoryName}</div>
                      <div className="text-sm text-gray-500">{request.categoryNameAr}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{request.parentCategoryName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{request.expectedProductCount}</span>
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
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      {request.status === CategoryRequestStatus.PENDING && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
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
              <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No category requests found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Category Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Seller Information</label>
                  <div className="mt-1">
                    <p className="font-medium">{selectedRequest.sellerName}</p>
                    <p className="text-sm text-gray-500">{selectedRequest.sellerEmail}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category Name (English)</label>
                  <p className="mt-1">{selectedRequest.categoryName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category Name (Arabic)</label>
                  <p className="mt-1 text-right">{selectedRequest.categoryNameAr}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Parent Category</label>
                <p className="mt-1">{selectedRequest.parentCategoryName}</p>
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
                <label className="text-sm font-medium text-gray-700">Business Justification</label>
                <p className="mt-1 text-sm">{selectedRequest.businessJustification}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Expected Products</label>
                  <p className="mt-1 font-medium">{selectedRequest.expectedProductCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Target Market</label>
                  <p className="mt-1 text-sm">{selectedRequest.targetMarket}</p>
                </div>
              </div>

              {selectedRequest.adminComments && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Admin Comments</label>
                  <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{selectedRequest.adminComments}</p>
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
            </div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Category Request
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' 
                ? 'This will approve the category request and notify the seller.'
                : 'This will reject the category request. Please provide a reason for the seller.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRequest && (
              <Alert>
                <Tag className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedRequest.categoryName}</strong> requested by <strong>{selectedRequest.sellerName}</strong>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <label className="text-sm font-medium">
                {reviewAction === 'approve' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
              </label>
              <Textarea
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder={
                  reviewAction === 'approve' 
                    ? 'Add any comments for the seller...'
                    : 'Please explain why this request is being rejected...'
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
              className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={reviewAction === 'reject' ? 'destructive' : 'default'}
              disabled={reviewAction === 'reject' && !adminComments.trim()}
            >
              {reviewAction === 'approve' ? 'Approve Request' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryRequests;