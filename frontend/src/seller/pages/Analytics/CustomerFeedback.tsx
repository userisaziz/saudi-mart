import React, { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Filter, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Progress } from '@/shared/components/ui/progress'

interface CustomerReview {
  id: string
  customerName: string
  productName: string
  rating: number
  comment: string
  commentAr?: string
  date: string
  isVerified: boolean
  helpful: number
  response?: string
  responseDate?: string
}

const mockReviews: CustomerReview[] = [
  {
    id: 'R001',
    customerName: 'أحمد محمد الأحمد',
    productName: 'ماكينة صناعية A100',
    rating: 5,
    comment: 'منتج ممتاز وجودة عالية، أنصح بالشراء',
    date: '2024-01-20',
    isVerified: true,
    helpful: 15,
    response: 'شكراً لك على هذا التقييم الإيجابي، نسعد بخدمتك دائماً',
    responseDate: '2024-01-21'
  },
  {
    id: 'R002',
    customerName: 'فاطمة علي السعيد',
    productName: 'قطع غيار صناعية',
    rating: 4,
    comment: 'المنتج جيد ولكن التسليم كان متأخراً قليلاً',
    date: '2024-01-19',
    isVerified: true,
    helpful: 8
  },
  {
    id: 'R003',
    customerName: 'خالد سعد المطيري',
    productName: 'أدوات قياس دقيقة',
    rating: 3,
    comment: 'المنتج مقبول لكن كنت أتوقع جودة أفضل مقابل هذا السعر',
    date: '2024-01-18',
    isVerified: false,
    helpful: 3
  }
]

const getRatingStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star 
      key={index} 
      className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
    />
  ))
}

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return 'text-green-600'
  if (rating >= 3.5) return 'text-yellow-600'
  if (rating >= 2.5) return 'text-orange-600'
  return 'text-red-600'
}

export default function CustomerFeedbackPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'helpful'>('date')

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.includes(searchTerm) ||
                         review.productName.includes(searchTerm) ||
                         review.comment.includes(searchTerm)
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating
    
    return matchesSearch && matchesRating
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'helpful':
        return b.helpful - a.helpful
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  // Calculate statistics
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length
  const responseRate = (reviews.filter(r => r.response).length / totalReviews) * 100
  
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i
    const count = reviews.filter(r => r.rating === rating).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { rating, count, percentage }
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">آراء العملاء</h1>
          <p className="text-gray-600">تحليل وإدارة تقييمات وآراء العملاء</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">متوسط التقييم</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-end mt-1">
              <div className="flex">{getRatingStars(Math.round(averageRating))}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي التقييمات</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{totalReviews}</div>
            <div className="flex items-center text-xs text-blue-600 justify-end mt-1">
              <TrendingUp className="w-4 h-4 ml-1" />
              +12 هذا الشهر
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">معدل الاستجابة</CardTitle>
            <ThumbsUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{responseRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-green-600 justify-end mt-1">
              <ThumbsUp className="w-4 h-4 ml-1" />
              نسبة جيدة
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">التقييمات الإيجابية</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right text-green-600">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="flex items-center text-xs text-green-600 justify-end mt-1">
              <Star className="w-4 h-4 ml-1" />
              4-5 نجوم
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">توزيع التقييمات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">تقييم جديد 5 نجوم</p>
                  <p className="text-gray-600">منذ ساعتين</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">رد على تعليق</p>
                  <p className="text-gray-600">منذ 4 ساعات</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                <Star className="w-5 h-5 text-orange-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">تقييم 3 نجوم</p>
                  <p className="text-gray-600">أمس</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 ml-2" />
                الرد على التعليقات
              </Button>
              <Button variant="outline" className="w-full">
                <ThumbsDown className="w-4 h-4 ml-2" />
                مراجعة التقييمات السلبية
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 ml-2" />
                تحليل الاتجاهات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في التقييمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التقييمات</SelectItem>
                <SelectItem value="5">5 نجوم</SelectItem>
                <SelectItem value="4">4 نجوم</SelectItem>
                <SelectItem value="3">3 نجوم</SelectItem>
                <SelectItem value="2">2 نجمة</SelectItem>
                <SelectItem value="1">نجمة واحدة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">الأحدث</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="helpful">الأكثر فائدة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{review.customerName}</h4>
                      {review.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          مشتري مؤكد
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.productName}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{getRatingStars(review.rating)}</div>
                      <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating} من 5
                      </span>
                    </div>
                    <p className="text-gray-900 mb-3">{review.comment}</p>
                    
                    {review.response && (
                      <div className="bg-blue-50 p-3 rounded-lg mt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">رد من البائع</span>
                        </div>
                        <p className="text-blue-900 text-sm">{review.response}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {formatDate(review.responseDate!)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ThumbsUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{review.helpful}</span>
                  </div>
                </div>
              </div>
              
              {!review.response && (
                <div className="flex justify-end gap-2 pt-3 border-t">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 ml-1" />
                    الرد
                  </Button>
                  <Button size="sm" variant="outline">
                    <ThumbsUp className="w-4 h-4 ml-1" />
                    مفيد
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}