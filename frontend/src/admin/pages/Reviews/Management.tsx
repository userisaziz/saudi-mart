import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Star, 
  Trash2, 
  Flag, 
  Check, 
  X, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  AlertTriangle,
  MessageSquare,
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Textarea } from '@/shared/components/ui/textarea'

interface Review {
  id: string
  productId: string
  productName: string
  productImage: string
  customerId: string
  customerName: string
  customerAvatar?: string
  sellerId: string
  sellerName: string
  rating: number
  title: string
  comment: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  isVerified: boolean
  helpful: number
  notHelpful: number
  createdAt: string
  updatedAt: string
  adminNotes?: string
  images?: string[]
  reply?: {
    id: string
    sellerId: string
    sellerName: string
    message: string
    createdAt: string
  }
}

const mockReviews: Review[] = [
  {
    id: 'R001',
    productId: 'P001',
    productName: 'iPhone 15 Pro',
    productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100',
    customerId: 'C001',
    customerName: 'Ahmed Al-Hassan',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    sellerId: 'S001',
    sellerName: 'TechStore KSA',
    rating: 5,
    title: 'Excellent product quality!',
    comment: 'Amazing phone with great camera quality. Fast delivery and excellent packaging. Highly recommended!',
    status: 'approved',
    isVerified: true,
    helpful: 24,
    notHelpful: 2,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200',
      'https://images.unsplash.com/photo-1611792226019-7d4fb407296d?w=200'
    ],
    reply: {
      id: 'RP001',
      sellerId: 'S001',
      sellerName: 'TechStore KSA',
      message: 'Thank you for your positive feedback! We\'re glad you\'re satisfied with your purchase.',
      createdAt: '2024-01-20T16:00:00Z'
    }
  },
  {
    id: 'R002',
    productId: 'P002',
    productName: 'Samsung Galaxy S24',
    productImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100',
    customerId: 'C002',
    customerName: 'Sarah Mohammed',
    sellerId: 'S002',
    sellerName: 'ElectroMax',
    rating: 2,
    title: 'Not as expected',
    comment: 'The phone arrived with scratches on the screen. Very disappointed with the condition.',
    status: 'pending',
    isVerified: false,
    helpful: 8,
    notHelpful: 15,
    createdAt: '2024-01-21T09:15:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
    adminNotes: 'Customer complaint about product condition - needs investigation'
  },
  {
    id: 'R003',
    productId: 'P004',
    productName: 'Industrial Drill Press',
    productImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100',
    customerId: 'C003',
    customerName: 'Omar Khalid',
    sellerId: 'S004',
    sellerName: 'Industrial Tools KSA',
    rating: 4,
    title: 'Good quality industrial tool',
    comment: 'Solid construction and works as expected. Good value for money.',
    status: 'approved',
    isVerified: true,
    helpful: 12,
    notHelpful: 1,
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T16:45:00Z'
  },
  {
    id: 'R004',
    productId: 'P007',
    productName: 'Digital Blood Pressure Monitor',
    productImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100',
    customerId: 'C004',
    customerName: 'Dr. Fatima Al-Zahra',
    sellerId: 'S007',
    sellerName: 'MediCare Supplies',
    rating: 5,
    title: 'Professional grade medical equipment',
    comment: 'Accurate readings and reliable performance. Perfect for clinical use.',
    status: 'approved',
    isVerified: true,
    helpful: 18,
    notHelpful: 0,
    createdAt: '2024-01-18T11:30:00Z',
    updatedAt: '2024-01-18T13:20:00Z'
  },
  {
    id: 'R005',
    productId: 'P003',
    productName: 'Smart Security Camera',
    productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100',
    customerId: 'C005',
    customerName: 'Khalid Al-Rashid',
    sellerId: 'S003',
    sellerName: 'SmartHome Solutions',
    rating: 1,
    title: 'Inappropriate content in review',
    comment: 'This product is terrible and the seller is dishonest. [FLAGGED CONTENT]',
    status: 'flagged',
    isVerified: false,
    helpful: 3,
    notHelpful: 22,
    createdAt: '2024-01-22T08:45:00Z',
    updatedAt: '2024-01-22T10:30:00Z',
    adminNotes: 'Review contains inappropriate language and unsubstantiated claims'
  }
]

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewDetailsOpen, setReviewDetailsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
      
      return matchesSearch && matchesStatus && matchesRating
    })
    
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, ratingFilter, reviews])

  const handleReviewAction = (reviewId: string, action: 'approve' | 'reject' | 'flag') => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged' }
        : review
    ))
  }

  const handleViewReview = (review: Review) => {
    setSelectedReview(review)
    setReviewDetailsOpen(true)
  }

  const getStatusBadge = (status: Review['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      flagged: { label: 'Flagged', variant: 'destructive' as const, color: 'bg-orange-100 text-orange-800' }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    flagged: reviews.filter(r => r.status === 'flagged').length,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  }

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  )

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">Monitor and moderate customer reviews and ratings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
            <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search reviews by product, customer, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{review.productName}</div>
                        <div className="text-sm text-muted-foreground">{review.sellerName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.customerAvatar} />
                        <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.customerName}</div>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div>
                      <div className="font-medium truncate">{review.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{review.comment}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600">{review.helpful} helpful</span>
                        <span className="text-xs text-red-600">{review.notHelpful} not helpful</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(review.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewReview(review)}
                        className="gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {review.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleReviewAction(review.id, 'approve')}>
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReviewAction(review.id, 'reject')}>
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleReviewAction(review.id, 'flag')}>
                            <Flag className="w-4 h-4 mr-2" />
                            Flag as Inappropriate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * reviewsPerPage) + 1} to {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
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
                  Math.abs(page - currentPage) <= 1
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

      {/* Review Details Dialog */}
      <Dialog open={reviewDetailsOpen} onOpenChange={setReviewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              {selectedReview && `Review for ${selectedReview.productName} by ${selectedReview.customerName}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              {/* Review Header */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedReview.productImage}
                  alt={selectedReview.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedReview.productName}</h3>
                  <p className="text-muted-foreground">{selectedReview.sellerName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {renderStars(selectedReview.rating, 'w-5 h-5')}
                    <span className="font-medium">{selectedReview.rating}/5</span>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedReview.customerAvatar} />
                      <AvatarFallback>{selectedReview.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedReview.customerName}</div>
                      <div className="flex items-center gap-2">
                        {selectedReview.isVerified && (
                          <Badge variant="outline">Verified Purchase</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Reviewed on {formatDate(selectedReview.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{selectedReview.title}</h4>
                    <p className="text-muted-foreground">{selectedReview.comment}</p>
                  </div>
                  
                  {selectedReview.images && selectedReview.images.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Review Images</h5>
                      <div className="flex gap-2">
                        {selectedReview.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{selectedReview.helpful} found this helpful</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm">{selectedReview.notHelpful} found this not helpful</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Reply */}
              {selectedReview.reply && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Seller Reply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedReview.reply.sellerName}</span>
                        <span className="text-sm text-muted-foreground">
                          replied on {formatDate(selectedReview.reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{selectedReview.reply.message}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add admin notes about this review..."
                    value={selectedReview.adminNotes || ''}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedReview.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleReviewAction(selectedReview.id, 'approve')}
                      className="gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve Review
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleReviewAction(selectedReview.id, 'reject')}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject Review
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => handleReviewAction(selectedReview.id, 'flag')}
                  className="gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Flag as Inappropriate
                </Button>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}