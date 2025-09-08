import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Package,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  ShoppingBag,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface CategoryAnalytics {
  id: string;
  name: string;
  nameAr: string;
  parentId?: string;
  parentName?: string;
  totalProducts: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  growthRate: number;
  popularityScore: number;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'pending';
  isNew: boolean;
}

interface TrendingCategory {
  id: string;
  name: string;
  nameAr: string;
  change: number;
  changeType: 'up' | 'down';
  period: string;
  icon: any;
}

export const CategoryAnalytics: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockAnalytics: CategoryAnalytics[] = [
    {
      id: '1',
      name: 'Industrial Machinery',
      nameAr: 'الآلات الصناعية',
      totalProducts: 1250,
      totalSellers: 89,
      totalOrders: 3420,
      totalRevenue: 2450000,
      avgOrderValue: 715.79,
      conversionRate: 4.2,
      growthRate: 12.5,
      popularityScore: 94,
      lastUpdated: new Date(),
      status: 'active',
      isNew: false
    },
    {
      id: '2',
      name: 'Construction Materials',
      nameAr: 'مواد البناء',
      totalProducts: 980,
      totalSellers: 67,
      totalOrders: 2180,
      totalRevenue: 1890000,
      avgOrderValue: 866.97,
      conversionRate: 3.8,
      growthRate: 18.3,
      popularityScore: 87,
      lastUpdated: new Date(),
      status: 'active',
      isNew: false
    },
    {
      id: '3',
      name: 'Electronics & Components',
      nameAr: 'الإلكترونيات والمكونات',
      totalProducts: 2340,
      totalSellers: 156,
      totalOrders: 8960,
      totalRevenue: 3200000,
      avgOrderValue: 357.14,
      conversionRate: 5.1,
      growthRate: 25.7,
      popularityScore: 96,
      lastUpdated: new Date(),
      status: 'active',
      isNew: true
    },
    {
      id: '4',
      name: 'Safety Equipment',
      nameAr: 'معدات السلامة',
      totalProducts: 560,
      totalSellers: 34,
      totalOrders: 1450,
      totalRevenue: 890000,
      avgOrderValue: 613.79,
      conversionRate: 6.2,
      growthRate: -5.2,
      popularityScore: 78,
      lastUpdated: new Date(),
      status: 'active',
      isNew: false
    }
  ];

  const trendingCategories: TrendingCategory[] = [
    {
      id: '1',
      name: 'Smart Manufacturing',
      nameAr: 'التصنيع الذكي',
      change: 45.2,
      changeType: 'up',
      period: 'This month',
      icon: BarChart3
    },
    {
      id: '2',
      name: 'Green Energy Solutions',
      nameAr: 'حلول الطاقة الخضراء',
      change: 38.7,
      changeType: 'up',
      period: 'This month',
      icon: TrendingUp
    },
    {
      id: '3',
      name: 'Automation Systems',
      nameAr: 'أنظمة الأتمتة',
      change: 29.1,
      changeType: 'up',
      period: 'This month',
      icon: Target
    },
    {
      id: '4',
      name: 'Traditional Tools',
      nameAr: 'الأدوات التقليدية',
      change: -12.3,
      changeType: 'down',
      period: 'This month',
      icon: TrendingDown
    }
  ];

  const filteredAnalytics = mockAnalytics.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.nameAr.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || category.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedAnalytics = [...filteredAnalytics].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.totalRevenue - a.totalRevenue;
      case 'growth':
        return b.growthRate - a.growthRate;
      case 'products':
        return b.totalProducts - a.totalProducts;
      case 'popularity':
        return b.popularityScore - a.popularityScore;
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthBadge = (rate: number) => {
    if (rate > 0) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          +{rate}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          <ArrowDownRight className="w-3 h-3 mr-1" />
          {rate}%
        </Badge>
      );
    }
  };

  const totalRevenue = mockAnalytics.reduce((sum, cat) => sum + cat.totalRevenue, 0);
  const totalProducts = mockAnalytics.reduce((sum, cat) => sum + cat.totalProducts, 0);
  const totalSellers = mockAnalytics.reduce((sum, cat) => sum + cat.totalSellers, 0);
  const totalOrders = mockAnalytics.reduce((sum, cat) => sum + cat.totalOrders, 0);
  const avgGrowth = mockAnalytics.reduce((sum, cat) => sum + cat.growthRate, 0) / mockAnalytics.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'تحليلات الفئات' : 'Category Analytics'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'رؤى وإحصائيات شاملة لأداء الفئات' : 'Comprehensive insights and performance metrics for categories'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{isRTL ? '7 أيام' : '7 days'}</SelectItem>
              <SelectItem value="30d">{isRTL ? '30 يوم' : '30 days'}</SelectItem>
              <SelectItem value="90d">{isRTL ? '90 يوم' : '90 days'}</SelectItem>
              <SelectItem value="1y">{isRTL ? 'سنة واحدة' : '1 year'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'إجمالي المنتجات' : 'Total Products'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{totalProducts.toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'إجمالي البائعين' : 'Total Sellers'}
                </p>
                <p className="text-2xl font-bold text-purple-600">{totalSellers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
                </p>
                <p className="text-2xl font-bold text-orange-600">{totalOrders.toLocaleString()}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? 'متوسط النمو' : 'Avg Growth'}
                </p>
                <p className="text-2xl font-bold text-indigo-600">+{avgGrowth.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isRTL ? 'الفئات الرائجة' : 'Trending Categories'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${category.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                    <Badge variant={category.changeType === 'up' ? 'default' : 'destructive'} className="text-xs">
                      {category.changeType === 'up' ? '+' : ''}{category.change}%
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {isRTL ? category.nameAr : category.name}
                  </h3>
                  <p className="text-xs text-gray-500">{category.period}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isRTL ? 'أداء الفئات التفصيلي' : 'Detailed Category Performance'}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={isRTL ? 'البحث في الفئات...' : 'Search categories...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">{isRTL ? 'الإيرادات' : 'Revenue'}</SelectItem>
                  <SelectItem value="growth">{isRTL ? 'النمو' : 'Growth'}</SelectItem>
                  <SelectItem value="products">{isRTL ? 'المنتجات' : 'Products'}</SelectItem>
                  <SelectItem value="popularity">{isRTL ? 'الشعبية' : 'Popularity'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                  <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                  <SelectItem value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</SelectItem>
                  <SelectItem value="pending">{isRTL ? 'معلق' : 'Pending'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'الفئة' : 'Category'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'المنتجات' : 'Products'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'البائعين' : 'Sellers'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'الطلبات' : 'Orders'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'الإيرادات' : 'Revenue'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'متوسط قيمة الطلب' : 'AOV'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'معدل التحويل' : 'Conv. Rate'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'النمو' : 'Growth'}</TableHead>
                <TableHead className="text-center">{isRTL ? 'الشعبية' : 'Popularity'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAnalytics.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {isRTL ? category.nameAr : category.name}
                          </span>
                          {category.isNew && (
                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                              {isRTL ? 'جديد' : 'New'}
                            </Badge>
                          )}
                        </div>
                        {category.parentName && (
                          <p className="text-xs text-gray-500 mt-1">{category.parentName}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {category.totalProducts.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {category.totalSellers}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {category.totalOrders.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center font-bold text-green-600">
                    {formatCurrency(category.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(category.avgOrderValue)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Percent className="w-3 h-3 mr-1 text-gray-400" />
                      {category.conversionRate}%
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getGrowthBadge(category.growthRate)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{category.popularityScore}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sortedAnalytics.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {isRTL ? 'لم يتم العثور على فئات تطابق معايير البحث' : 'No categories found matching your search criteria.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryAnalytics;