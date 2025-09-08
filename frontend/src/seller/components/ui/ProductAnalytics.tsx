import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Star,
  Package,
  DollarSign,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Chart } from './Chart';

interface ProductPerformance {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  sku: string;
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  rating: number;
  reviewCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  stock: number;
  images: string[];
}

interface CategoryInsight {
  category: string;
  categoryAr: string;
  products: number;
  revenue: number;
  growth: number;
  marketShare: number;
}

export const ProductAnalytics: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('revenue');

  // Mock product performance data
  const productData: ProductPerformance[] = [
    {
      id: '1',
      name: 'Industrial Steel Pipes',
      nameAr: 'أنابيب الصلب الصناعية',
      category: 'Manufacturing',
      sku: 'ISP-001',
      views: 1250,
      sales: 45,
      revenue: 22500,
      conversionRate: 3.6,
      rating: 4.8,
      reviewCount: 28,
      trend: 'up',
      trendPercentage: 15.2,
      stock: 120,
      images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300']
    },
    {
      id: '2',
      name: 'LED Panel Lights',
      nameAr: 'أضواء لوحة LED',
      category: 'Electronics',
      sku: 'LED-002',
      views: 890,
      sales: 32,
      revenue: 15680,
      conversionRate: 3.9,
      rating: 4.6,
      reviewCount: 19,
      trend: 'up',
      trendPercentage: 8.7,
      stock: 75,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300']
    },
    {
      id: '3',
      name: 'Safety Equipment',
      nameAr: 'معدات السلامة',
      category: 'Safety',
      sku: 'SAF-003',
      views: 650,
      sales: 28,
      revenue: 8400,
      conversionRate: 4.3,
      rating: 4.9,
      reviewCount: 15,
      trend: 'stable',
      trendPercentage: 1.2,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300']
    },
    {
      id: '4',
      name: 'Office Furniture',
      nameAr: 'أثاث المكاتب',
      category: 'Furniture',
      sku: 'OFF-004',
      views: 420,
      sales: 12,
      revenue: 9600,
      conversionRate: 2.9,
      rating: 4.2,
      reviewCount: 8,
      trend: 'down',
      trendPercentage: -5.3,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300']
    }
  ];

  const categoryInsights: CategoryInsight[] = [
    {
      category: 'Manufacturing',
      categoryAr: 'التصنيع',
      products: 45,
      revenue: 125000,
      growth: 12.5,
      marketShare: 35
    },
    {
      category: 'Electronics',
      categoryAr: 'الإلكترونيات',
      products: 32,
      revenue: 89000,
      growth: 18.2,
      marketShare: 25
    },
    {
      category: 'Safety',
      categoryAr: 'السلامة',
      products: 28,
      revenue: 67000,
      growth: 8.7,
      marketShare: 20
    },
    {
      category: 'Furniture',
      categoryAr: 'الأثاث',
      products: 22,
      revenue: 45000,
      growth: -2.1,
      marketShare: 15
    }
  ];

  const sortedProducts = useMemo(() => {
    return [...productData].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.revenue - a.revenue;
        case 'sales':
          return b.sales - a.sales;
        case 'views':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'conversion':
          return b.conversionRate - a.conversionRate;
        default:
          return 0;
      }
    });
  }, [sortBy]);

  const totalRevenue = productData.reduce((sum, product) => sum + product.revenue, 0);
  const totalViews = productData.reduce((sum, product) => sum + product.views, 0);
  const totalSales = productData.reduce((sum, product) => sum + product.sales, 0);
  const avgConversion = productData.reduce((sum, product) => sum + product.conversionRate, 0) / productData.length;

  // Chart data for product performance over time
  const performanceChartData = [
    { month: isRTL ? 'يناير' : 'Jan', views: 2100, sales: 85, revenue: 42500 },
    { month: isRTL ? 'فبراير' : 'Feb', views: 2450, sales: 98, revenue: 49000 },
    { month: isRTL ? 'مارس' : 'Mar', views: 2800, sales: 112, revenue: 56000 },
    { month: isRTL ? 'أبريل' : 'Apr', views: 2650, sales: 105, revenue: 52500 },
    { month: isRTL ? 'مايو' : 'May', views: 3200, sales: 128, revenue: 64000 },
    { month: isRTL ? 'يونيو' : 'Jun', views: 3450, sales: 142, revenue: 71000 },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'تحليلات المنتجات' : 'Product Analytics'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'تحليل شامل لأداء المنتجات ومبيعاتها' : 'Comprehensive analysis of product performance and sales'}
          </p>
        </div>
        
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{isRTL ? '7 أيام' : '7 days'}</SelectItem>
              <SelectItem value="30d">{isRTL ? '30 يوم' : '30 days'}</SelectItem>
              <SelectItem value="90d">{isRTL ? '90 يوم' : '90 days'}</SelectItem>
              <SelectItem value="1y">{isRTL ? 'سنة' : '1 year'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">{isRTL ? 'الإيرادات' : 'Revenue'}</SelectItem>
              <SelectItem value="sales">{isRTL ? 'المبيعات' : 'Sales'}</SelectItem>
              <SelectItem value="views">{isRTL ? 'المشاهدات' : 'Views'}</SelectItem>
              <SelectItem value="rating">{isRTL ? 'التقييم' : 'Rating'}</SelectItem>
              <SelectItem value="conversion">{isRTL ? 'التحويل' : 'Conversion'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Download className="h-4 w-4" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {isRTL ? 'إجمالي المشاهدات' : 'Total Views'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8.2% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {isRTL ? 'إجمالي المبيعات' : 'Total Sales'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15.7% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isRTL ? 'متوسط معدل التحويل' : 'Avg Conversion Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2.1% {isRTL ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'اتجاه الأداء' : 'Performance Trend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={performanceChartData}
              type="line"
              xKey="month"
              yKeys={['revenue']}
              colors={['#3B82F6']}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'رؤى الفئات' : 'Category Insights'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryInsights.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {isRTL ? category.categoryAr : category.category}
                  </span>
                  <Badge variant={category.growth > 0 ? 'default' : 'destructive'}>
                    {category.growth > 0 ? '+' : ''}{category.growth}%
                  </Badge>
                </div>
                <Progress value={category.marketShare} className="h-2" />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{category.products} {isRTL ? 'منتج' : 'products'}</span>
                  <span>${category.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isRTL ? 'أداء المنتجات' : 'Product Performance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                {/* Product Image */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">
                      {isRTL ? product.nameAr : product.name}
                    </h3>
                    {getTrendIcon(product.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(product.trend)}`}>
                      {product.trend !== 'stable' && (
                        <>
                          {product.trend === 'up' ? '+' : '-'}
                          {Math.abs(product.trendPercentage)}%
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{product.sku} • {product.category}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {product.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      {product.sales}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-semibold">
                    ${product.revenue.toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {product.conversionRate}% {isRTL ? 'تحويل' : 'conversion'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {product.stock} {isRTL ? 'في المخزون' : 'in stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};