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
  Filter,
  Calendar,
  Award,
  AlertTriangle,
  ChevronDown,
  BarChart3,
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
  Share2,
  Download,
  Settings,
  Zap,
  Target,
  Activity,
  SortDesc,
  Sparkles,
  Bell,
  Plus,
  Shield,
  Headphones,
  Mail
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
    productName: 'Professional Laptop Stand',
    productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100',
    customerId: 'C001',
    customerName: 'Ahmed Al-Hassan',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 5,
    title: 'Excellent build quality and design!',
    comment: 'This laptop stand exceeded my expectations. The aluminum construction feels premium and sturdy. Perfect height adjustment and the cable management is thoughtful.',
    status: 'approved',
    isVerified: true,
    helpful: 28,
    notHelpful: 1,
    createdAt: '2024-01-20T10:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200'
    ],
    reply: {
      id: 'RP001',
      message: 'Thank you Ahmed for this wonderful review! We\'re thrilled that our laptop stand meets your professional needs. Your feedback about the cable management feature is especially valuable to us.',
      createdAt: '2024-01-20T16:00:00Z'
    }
  },
  {
    id: 'R002',
    productId: 'P002',
    productName: 'Wireless Charging Pad',
    productImage: 'https://images.unsplash.com/photo-1586892478025-2f5c9e5b3269?w=100',
    customerId: 'C002',
    customerName: 'Sarah Mohammed',
    rating: 4,
    title: 'Good product, fast charging',
    comment: 'Works well with my iPhone and Samsung. Charging speed is impressive. Only minor issue is the LED indicator is quite bright at night.',
    status: 'approved',
    isVerified: true,
    helpful: 19,
    notHelpful: 3,
    createdAt: '2024-01-21T09:15:00Z'
  },
  {
    id: 'R003',
    productId: 'P003',
    productName: 'Ergonomic Office Chair',
    productImage: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=100',
    customerId: 'C003',
    customerName: 'Omar Khalid',
    rating: 3,
    title: 'Average comfort, good price',
    comment: 'Chair is decent for the price point. Assembly took longer than expected and instructions could be clearer. Comfort is okay for short sessions.',
    status: 'approved',
    isVerified: false,
    helpful: 12,
    notHelpful: 8,
    createdAt: '2024-01-19T14:20:00Z'
  },
  {
    id: 'R004',
    productId: 'P004',
    productName: 'Bluetooth Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    customerId: 'C004',
    customerName: 'Fatima Al-Zahra',
    rating: 5,
    title: 'Amazing sound quality!',
    comment: 'These headphones are fantastic! Crystal clear audio, comfortable for long sessions, and the noise cancellation works perfectly. Battery life is excellent too.',
    status: 'approved',
    isVerified: true,
    helpful: 34,
    notHelpful: 2,
    createdAt: '2024-01-18T11:30:00Z'
  },
  {
    id: 'R005',
    productId: 'P005',
    productName: 'Mechanical Keyboard',
    productImage: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100',
    customerId: 'C005',
    customerName: 'Khalid Al-Rashid',
    rating: 2,
    title: 'Key switches feel inconsistent',
    comment: 'Some keys feel different than others. The spacebar makes a different sound and the overall build quality seems inconsistent. Expected better for this price.',
    status: 'pending',
    isVerified: true,
    helpful: 7,
    notHelpful: 15,
    createdAt: '2024-01-22T08:45:00Z'
  }
]

export default function SellerReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [reviewDetailsOpen, setReviewDetailsOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')
  const reviewsPerPage = 8

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
      const matchesProduct = productFilter === 'all' || review.productId === productFilter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'needs-reply' && !review.reply && review.status === 'approved') ||
        (statusFilter === 'replied' && review.reply) ||
        (statusFilter === 'verified' && review.isVerified) ||
        review.status === statusFilter
      
      const matchesDate = dateFilter === 'all' || (() => {
        const reviewDate = new Date(review.createdAt)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        switch (dateFilter) {
          case 'today': return reviewDate >= today
          case 'week': return reviewDate >= weekAgo
          case 'month': return reviewDate >= monthAgo
          default: return true
        }
      })()
      
      return matchesSearch && matchesRating && matchesProduct && matchesStatus && matchesDate
    })
    
    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful - a.helpful
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [searchTerm, ratingFilter, productFilter, statusFilter, dateFilter, sortBy, reviews])

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
    needsReply: reviews.filter(r => !r.reply && r.status === 'approved').length,
    responseRate: Math.round((reviews.filter(r => r.reply).length / reviews.length) * 100)
  }

  const uniqueProducts = [...new Set(reviews.map(r => ({ id: r.productId, name: r.productName })))]

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  )

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Reviews & Ratings</h1>
                <p className="text-blue-100 text-lg">Manage customer feedback and build trust</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>{stats.averageRating.toFixed(1)} average rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-300" />
                <span>{stats.responseRate}% response rate</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-gray-50">
              <Zap className="w-4 h-4 mr-2" />
              Boost Reviews
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reviews */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  +18%
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500 mt-1">+3 this week</p>
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  +0.2
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                {renderStars(Math.round(stats.averageRating), 'w-5 h-5')}
              </div>
              <p className="text-sm text-gray-500 mt-1">Excellent performance</p>
            </div>
          </CardContent>
        </Card>

        {/* Response Rate */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <Reply className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <Target className="w-3 h-3" />
                  Great
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.responseRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.responseRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                {stats.needsReply > 0 ? (
                  <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Action needed
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    All caught up
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Needs Reply</p>
              <p className="text-3xl font-bold text-gray-900">{stats.needsReply}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.needsReply > 0 ? 'Respond to build trust' : 'Great job!'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid grid-cols-3 w-fit">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Email Templates
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Rating Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Rating Distribution
                </CardTitle>
                <p className="text-sm text-gray-600">How customers rate your products</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats[`${rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one'}Stars` as keyof typeof stats] as number
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  
                  return (
                    <div key={rating} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-2 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-gray-500">({percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Customer Satisfaction */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="w-5 h-5 text-green-600" />
                    Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-600">
                      {(((stats.fiveStars + stats.fourStars) / stats.total) * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600">Customers satisfied (4-5 stars)</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Very satisfied</span>
                        <span className="font-medium">{stats.fiveStars}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfied</span>
                        <span className="font-medium">{stats.fourStars}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start gap-2"
                    variant={stats.needsReply > 0 ? "default" : "outline"}
                    onClick={() => {
                      setActiveTab('reviews')
                      setStatusFilter('needs-reply')
                    }}
                  >
                    <Reply className="w-4 h-4" />
                    Reply to Reviews ({stats.needsReply})
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Headphones className="w-4 h-4" />
                    Customer Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Advanced Filters */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    Smart Filters
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredReviews.length} of {stats.total} reviews
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setProductFilter('all')
                    setRatingFilter('all')
                    setStatusFilter('all')
                    setDateFilter('all')
                    setSortBy('newest')
                  }}
                  className="gap-2"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10 h-12 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Search reviews by product, customer, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Products" />
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
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Ratings" />
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
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="needs-reply">Needs Reply</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="rating-high">Highest Rating</SelectItem>
                    <SelectItem value="rating-low">Lowest Rating</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quick Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setStatusFilter('needs-reply')}
                >
                  <Bell className="w-3 h-3" />
                  Needs Reply ({stats.needsReply})
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setRatingFilter('5')}
                >
                  <Award className="w-3 h-3" />
                  5 Stars ({stats.fiveStars})
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setRatingFilter('1')}
                >
                  <AlertTriangle className="w-3 h-3" />
                  Low Ratings ({stats.oneStar + stats.twoStars})
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setStatusFilter('verified')}
                >
                  <CheckCircle className="w-3 h-3" />
                  Verified ({reviews.filter(r => r.isVerified).length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {paginatedReviews.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    No reviews match your current filters. Try adjusting your search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {paginatedReviews.map((review) => (
                  <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Product & Rating */}
                        <div className="flex items-start gap-4 flex-1">
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
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{review.productName}</h3>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                  <span className="text-sm font-medium text-gray-700 ml-1">{review.rating}/5</span>
                                </div>
                                <Badge 
                                  variant={review.status === 'approved' ? 'default' : review.status === 'pending' ? 'outline' : 'destructive'}
                                  className="text-xs"
                                >
                                  {review.status}
                                </Badge>
                                {review.isVerified && (
                                  <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{review.comment}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={review.customerAvatar} />
                                  <AvatarFallback className="text-xs">{review.customerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-gray-700 font-medium">{review.customerName}</span>
                              </div>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">{formatDate(review.createdAt)}</span>
                              <span className="text-gray-500">•</span>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-green-600">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{review.helpful}</span>
                                </div>
                                <div className="flex items-center gap-1 text-red-600">
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>{review.notHelpful}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!review.reply && review.status === 'approved' && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                              <Bell className="w-3 h-3 mr-1" />
                              Needs Reply
                            </Badge>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewReview(review)}
                            className="gap-2"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          
                          {!review.reply && review.status === 'approved' ? (
                            <Button
                              size="sm"
                              onClick={() => handleViewReview(review)}
                              className="gap-2"
                            >
                              <Send className="w-3 h-3" />
                              Reply
                            </Button>
                          ) : review.reply && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReview(review)}
                              className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Replied
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View on Store
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Review
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Heart className="w-4 h-4 mr-2" />
                                Mark as Favorite
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {/* Reply Preview */}
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
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * reviewsPerPage) + 1} to {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
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
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.4h</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.responseRate}%</div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">4.6/5</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">+18%</div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Top Reviewed Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueProducts.slice(0, 5).map((product, index) => {
                    const productReviews = reviews.filter(r => r.productId === product.id)
                    const avgRating = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length
                    
                    return (
                      <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(Math.round(avgRating), 'w-3 h-3')}
                            <span className="text-sm text-gray-600">{avgRating.toFixed(1)} ({productReviews.length} reviews)</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Quick Responses</span>
                  </div>
                  <p className="text-sm text-blue-800">Respond to reviews within 24 hours to improve customer satisfaction</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Quality Focus</span>
                  </div>
                  <p className="text-sm text-green-800">Address quality concerns in low-rated reviews to prevent future issues</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Promote Reviews</span>
                  </div>
                  <p className="text-sm text-purple-800">Share positive reviews on social media to build brand trust</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Review Details Modal */}
      <Dialog open={reviewDetailsOpen} onOpenChange={setReviewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              Review Details
            </DialogTitle>
            <DialogDescription>
              {selectedReview && `${selectedReview.productName} • by ${selectedReview.customerName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
            {selectedReview && (
              <>
                {/* Review Header */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedReview.productImage}
                      alt={selectedReview.productName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{selectedReview.productName}</h3>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(selectedReview.rating, 'w-5 h-5')}
                          <span className="text-lg font-medium ml-1">{selectedReview.rating}/5</span>
                        </div>
                        <Badge 
                          variant={selectedReview.status === 'approved' ? 'default' : 'outline'}
                        >
                          {selectedReview.status}
                        </Badge>
                        {selectedReview.isVerified && (
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatDate(selectedReview.createdAt)}</span>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-3 h-3 text-green-600" />
                          <span>{selectedReview.helpful}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="w-3 h-3 text-red-600" />
                          <span>{selectedReview.notHelpful}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Review Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedReview.customerAvatar} />
                            <AvatarFallback>{selectedReview.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{selectedReview.customerName}</div>
                            <div className="text-sm text-gray-600">Review #{selectedReview.id}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Review Content */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Review Content</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{selectedReview.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
                        </div>
                        
                        {selectedReview.images && selectedReview.images.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Review Images</h5>
                            <div className="grid grid-cols-3 gap-2">
                              {selectedReview.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-20 rounded-lg object-cover"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Reply Section */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {selectedReview.reply ? 'Your Reply' : 'Reply to Review'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedReview.reply ? (
                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-blue-600 text-white text-xs">S</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">Your Store</span>
                              </div>
                              <p className="text-sm text-blue-900">{selectedReview.reply.message}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => setReplyText(selectedReview.reply!.message)}
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit Reply
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Write a professional response..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[120px]"
                            />
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
                                className="flex-1 gap-2"
                                onClick={handleReplySubmit}
                                disabled={!replyText.trim()}
                              >
                                <Send className="w-3 h-3" />
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}