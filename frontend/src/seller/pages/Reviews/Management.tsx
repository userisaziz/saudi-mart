import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Star, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Eye,
  Reply,
  RefreshCw,
  Filter,
  Calendar,
  Award,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Image as ImageIcon,
  Send,
  Edit3,
  MoreVertical,
  ExternalLink,
  Heart,
  Share2
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
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
import { Progress } from '@/shared/components/ui/progress'
import { Separator } from '@/shared/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

interface Review {
  id: string
  productId: string
  productName: string
  productImage: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number
  title: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  isVerified: boolean
  helpful: number
  notHelpful: number
  createdAt: string
  images?: string[]
  reply?: {
    id: string
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
    rating: 5,
    title: 'Excellent product quality!',
    comment: 'Amazing phone with great camera quality. Fast delivery and excellent packaging. Highly recommended!',
    status: 'approved',
    isVerified: true,
    helpful: 24,
    notHelpful: 2,
    createdAt: '2024-01-20T10:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200'
    ],
    reply: {
      id: 'RP001',
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
    rating: 4,
    title: 'Good phone but expensive',
    comment: 'Great performance and camera quality. However, I think it\'s a bit overpriced compared to competitors.',
    status: 'approved',
    isVerified: true,
    helpful: 15,
    notHelpful: 3,
    createdAt: '2024-01-21T09:15:00Z'
  },
  {
    id: 'R003',
    productId: 'P001',
    productName: 'iPhone 15 Pro',
    productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100',
    customerId: 'C003',
    customerName: 'Omar Khalid',
    rating: 3,
    title: 'Average experience',
    comment: 'The phone is okay but battery life could be better. Delivery was delayed by 2 days.',
    status: 'approved',
    isVerified: false,
    helpful: 8,
    notHelpful: 12,
    createdAt: '2024-01-19T14:20:00Z'
  },
  {
    id: 'R004',
    productId: 'P003',
    productName: 'Wireless Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    customerId: 'C004',
    customerName: 'Fatima Al-Zahra',
    rating: 5,
    title: 'Perfect for workouts',
    comment: 'Great sound quality and they stay in place during exercise. Battery lasts all day.',
    status: 'approved',
    isVerified: true,
    helpful: 18,
    notHelpful: 1,
    createdAt: '2024-01-18T11:30:00Z'
  },
  {
    id: 'R005',
    productId: 'P002',
    productName: 'Samsung Galaxy S24',
    productImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100',
    customerId: 'C005',
    customerName: 'Khalid Al-Rashid',
    rating: 2,
    title: 'Not as expected',
    comment: 'Phone arrived with a small scratch on the back. Customer service was slow to respond.',
    status: 'pending',
    isVerified: true,
    helpful: 5,
    notHelpful: 8,
    createdAt: '2024-01-22T08:45:00Z'
  }
]

export default function SellerReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewDetailsOpen, setReviewDetailsOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
      const matchesProduct = productFilter === 'all' || review.productId === productFilter
      
      return matchesSearch && matchesRating && matchesProduct
    })
    
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [searchTerm, ratingFilter, productFilter, reviews])

  const handleViewReview = (review: Review) => {
    setSelectedReview(review)
    setReplyText(review.reply?.message || '')
    setReviewDetailsOpen(true)
  }

  const handleReplySubmit = () => {
    if (!selectedReview || !replyText.trim()) return

    setReviews(prev => prev.map(review => 
      review.id === selectedReview.id 
        ? { 
            ...review, 
            reply: { 
              id: `RP${Date.now()}`, 
              message: replyText, 
              createdAt: new Date().toISOString() 
            } 
          }
        : review
    ))

    setReplyText('')
    setReviewDetailsOpen(false)
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
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
    needsReply: reviews.filter(r => !r.reply && r.status === 'approved').length
  }

  const uniqueProducts = [...new Set(reviews.map(r => ({ id: r.productId, name: r.productName })))]

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  )

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Reviews & Ratings
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Manage customer feedback and build stronger relationships
                </p>
              </div>
            </div>
            
            {/* Quick Stats Row */}
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Last updated 2 minutes ago</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>{stats.fiveStars} five-star reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{stats.needsReply} pending replies</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2 hover:bg-white hover:shadow-md transition-all">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button variant="outline" className="gap-2 hover:bg-white hover:shadow-md transition-all">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Award className="w-4 h-4" />
              View Public Profile
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-8 translate-x-8 opacity-50"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+12% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -translate-y-8 translate-x-8 opacity-50"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Average Rating</p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(stats.averageRating), 'w-5 h-5')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">+0.2 this week</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -translate-y-8 translate-x-8 opacity-50"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Needs Reply</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.needsReply}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">Respond soon</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Reply className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-8 translate-x-8 opacity-50"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">5-Star Reviews</p>
                  <p className="text-3xl font-bold text-green-600">{stats.fiveStars}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">{((stats.fiveStars / stats.total) * 100).toFixed(0)}% positive</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Rating Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Distribution */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Rating Distribution</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Overview of customer satisfaction levels</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats[`${rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one'}Stars` as keyof typeof stats] as number
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                const barColor = rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                const bgColor = rating >= 4 ? 'bg-green-100' : rating === 3 ? 'bg-yellow-100' : 'bg-red-100'
                
                return (
                  <div key={rating} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-sm font-semibold text-gray-700">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className={`${bgColor} rounded-full h-3 overflow-hidden`}>
                          <div 
                            className={`${barColor} h-3 rounded-full transition-all duration-500 ease-out group-hover:opacity-80`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-24">
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                        <span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions & Insights */}
          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Customer Satisfaction</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {(((stats.fiveStars + stats.fourStars) / stats.total) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-green-600 mt-1">Positive reviews (4-5 stars)</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Action Required</span>
                </div>
                <div className="text-2xl font-bold text-orange-700">{stats.needsReply}</div>
                <p className="text-xs text-orange-600 mt-1">Reviews need your response</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Engagement Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">89%</div>
                <p className="text-xs text-blue-600 mt-1">Reviews with seller replies</p>
              </div>
              
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters & Search */}
        <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold text-gray-900">Filter & Search Reviews</CardTitle>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {filteredReviews.length} of {stats.total} reviews
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Search by product name, customer, or review content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="All Products" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="All Ratings" />
                  </div>
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
              
              <Select value="all">
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="needs-reply">Needs Reply</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value="all">
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <SelectValue placeholder="Date Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="h-11 border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all"
                onClick={() => {
                  setSearchTerm('')
                  setProductFilter('all')
                  setRatingFilter('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline" className="h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-50">
                Needs Reply ({stats.needsReply})
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50">
                5-Star Reviews ({stats.fiveStars})
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50">
                Low Ratings ({stats.oneStar + stats.twoStars})
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                With Images
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modern Review Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="rating-high">Highest Rating</SelectItem>
                  <SelectItem value="rating-low">Lowest Rating</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-6">
            {paginatedReviews.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    No reviews match your current filters. Try adjusting your search criteria or clearing the filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              paginatedReviews.map((review) => (
                <Card key={review.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Product Info */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={review.productImage}
                              alt={review.productName}
                              className="w-16 h-16 rounded-xl object-cover shadow-md"
                            />
                            {review.images && review.images.length > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{review.productName}</h3>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating, 'w-4 h-4')}
                                <span className="text-sm font-medium text-gray-700 ml-1">{review.rating}/5</span>
                              </div>
                              <Badge 
                                variant={review.status === 'approved' ? 'default' : review.status === 'pending' ? 'outline' : 'destructive'}
                                className="text-xs"
                              >
                                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions & Status */}
                      <div className="flex items-center gap-2">
                        {!review.reply && review.status === 'approved' && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                            <Reply className="w-3 h-3 mr-1" />
                            Needs Reply
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewReview(review)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Store
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Review Content */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                    
                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="mb-4">
                        <div className="flex gap-2">
                          {review.images.map((image, index) => (
                            <div key={index} className="relative group/image">
                              <img
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-20 h-20 rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover/image:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Customer & Engagement Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* Customer */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={review.customerAvatar} />
                            <AvatarFallback className="text-sm font-medium">{review.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{review.customerName}</span>
                              {review.isVerified && (
                                <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Engagement */}
                        <div className="flex items-center gap-4 ml-4">
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{review.helpful}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <ThumbsDown className="w-3 h-3" />
                            <span>{review.notHelpful}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReview(review)}
                          className="gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        {!review.reply && review.status === 'approved' ? (
                          <Button
                            size="sm"
                            onClick={() => handleViewReview(review)}
                            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                          >
                            <Send className="w-3 h-3" />
                            Reply
                          </Button>
                        ) : review.reply && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewReview(review)}
                            className="gap-2 border-green-200 text-green-700 hover:bg-green-50 transition-all"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Replied
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Seller Reply Preview */}
                    {review.reply && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">S</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-blue-900">Your Store</span>
                          <span className="text-xs text-blue-600">replied {formatDate(review.reply.createdAt)}</span>
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed">{review.reply.message}</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-7 px-2"
                          onClick={() => handleViewReview(review)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit Reply
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

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

        {/* Enhanced Review Details Modal */}
        <Dialog open={reviewDetailsOpen} onOpenChange={setReviewDetailsOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white to-gray-50">
            <DialogHeader className="pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Review Details
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {selectedReview && `${selectedReview.productName} • by ${selectedReview.customerName}`}
                  </DialogDescription>
                </div>
                {selectedReview && (
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={selectedReview.status === 'approved' ? 'default' : selectedReview.status === 'pending' ? 'outline' : 'destructive'}
                      className="px-3 py-1"
                    >
                      {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] pr-2">
              {selectedReview && (
                <div className="space-y-6 py-6">
                  {/* Product & Rating Overview */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <img
                          src={selectedReview.productImage}
                          alt={selectedReview.productName}
                          className="w-24 h-24 rounded-xl object-cover shadow-md"
                        />
                        {selectedReview.images && selectedReview.images.length > 0 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                            <ImageIcon className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedReview.productName}</h3>
                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            {renderStars(selectedReview.rating, 'w-6 h-6')}
                            <span className="text-2xl font-bold text-gray-800">{selectedReview.rating}</span>
                            <span className="text-gray-500 text-lg">/5</span>
                          </div>
                          <Separator orientation="vertical" className="h-6" />
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">{selectedReview.helpful} helpful</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsDown className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 font-medium">{selectedReview.notHelpful} not helpful</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reviewed on {formatDate(selectedReview.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Review Content - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Customer Information */}
                      <Card className="border-0 shadow-md bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                            Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-gray-100">
                              <AvatarImage src={selectedReview.customerAvatar} />
                              <AvatarFallback className="text-lg font-semibold">{selectedReview.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-lg">{selectedReview.customerName}</div>
                              <div className="flex items-center gap-3 mt-1">
                                {selectedReview.isVerified && (
                                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified Purchase
                                  </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  Customer since 2023
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div>Review #{selectedReview.id}</div>
                              <div className="mt-1">{formatDate(selectedReview.createdAt)}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
  
                      {/* Review Content */}
                      <Card className="border-0 shadow-md bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            Review Content
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 text-lg mb-3">{selectedReview.title}</h4>
                            <p className="text-gray-700 leading-relaxed text-base">{selectedReview.comment}</p>
                          </div>
                          
                          {selectedReview.images && selectedReview.images.length > 0 && (
                            <div className="space-y-3">
                              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Review Images ({selectedReview.images.length})
                              </h5>
                              <div className="grid grid-cols-3 gap-3">
                                {selectedReview.images.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={image}
                                      alt={`Review image ${index + 1}`}
                                      className="w-full h-24 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow cursor-pointer"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
  
                    {/* Reply Section - Takes 1 column */}
                    <div className="space-y-6">
                      {/* Quick Actions */}
                      <Card className="border-0 shadow-md bg-white">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full justify-start gap-2" variant="outline">
                            <ExternalLink className="w-4 h-4" />
                            View on Store
                          </Button>
                          <Button className="w-full justify-start gap-2" variant="outline">
                            <Share2 className="w-4 h-4" />
                            Share Review
                          </Button>
                          <Button className="w-full justify-start gap-2" variant="outline">
                            <Heart className="w-4 h-4" />
                            Mark as Favorite
                          </Button>
                        </CardContent>
                      </Card>
  
                      {/* Reply Section */}
                      <Card className="border-0 shadow-md bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Reply className="w-5 h-5 text-blue-600" />
                            {selectedReview.reply ? 'Your Reply' : 'Reply to Review'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedReview.reply ? (
                            <div className="space-y-4">
                              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                <div className="flex items-center gap-2 mb-3">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">S</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-blue-900">Your Store</span>
                                  <span className="text-xs text-blue-600">
                                    {formatDate(selectedReview.reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-blue-800 leading-relaxed">
                                  {selectedReview.reply.message}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex-1 gap-2"
                                  onClick={() => setReplyText(selectedReview.reply!.message)}
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                  💡 Tip: A professional response shows you care about customer feedback and can improve your store's reputation.
                                </p>
                              </div>
                              <Textarea
                                placeholder="Thank you for your review! We appreciate your feedback...\n\nWrite a professional, empathetic response that addresses the customer's concerns and shows your commitment to quality service."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                              <div className="text-xs text-muted-foreground">
                                {replyText.length}/1000 characters
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => {
                                    setReplyText('')
                                    setReviewDetailsOpen(false)
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  onClick={handleReplySubmit}
                                  disabled={!replyText.trim()}
                                >
                                  <Send className="w-4 h-4" />
                                  Send Reply
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}