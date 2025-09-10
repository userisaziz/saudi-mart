import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Users,
  Zap,
  Award,
  Settings,
  Download,
  Upload,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Progress } from '@/shared/components/ui/progress';
import { Textarea } from '@/shared/components/ui/textarea';

interface PricingNegotiation {
  id: string;
  title: string;
  titleAr: string;
  buyer: {
    name: string;
    company: string;
    email: string;
    rating: number;
  };
  product: {
    name: string;
    category: string;
    sku: string;
    image?: string;
  };
  quantities: {
    requested: number;
    unit: string;
  };
  pricing: {
    initialQuote: number;
    currentOffer: number;
    counterOffer?: number;
    finalPrice?: number;
    currency: string;
    pricePerUnit: number;
    totalValue: number;
  };
  negotiation: {
    rounds: number;
    status: 'pending' | 'active' | 'counter_offered' | 'accepted' | 'rejected' | 'expired';
    progress: number;
    lastActivity: Date;
    deadline: Date;
  };
  terms: {
    paymentTerms: string;
    deliveryTerms: string;
    warranty: string;
    specialConditions?: string;
  };
  analytics: {
    marketPrice: number;
    competitorPrices: number[];
    profitMargin: number;
    recommendedPrice: number;
    priceFlexibility: number;
  };
  history: {
    timestamp: Date;
    action: string;
    amount?: number;
    notes?: string;
    party: 'seller' | 'buyer';
  }[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export const PricingTools: React.FC = () => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedNegotiation, setSelectedNegotiation] = useState<PricingNegotiation | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const mockNegotiations: PricingNegotiation[] = [
    {
      id: 'NEG-001',
      title: 'Industrial Pump Systems Negotiation',
      titleAr: 'مفاوضة أنظمة المضخات الصناعية',
      buyer: {
        name: 'Ahmed Al-Rashid',
        company: 'Saudi Manufacturing Corp',
        email: 'ahmed@saudimanuf.com',
        rating: 4.8
      },
      product: {
        name: 'Heavy Duty Industrial Pump Model XL-2000',
        category: 'Industrial Equipment',
        sku: 'PUMP-XL2000'
      },
      quantities: {
        requested: 25,
        unit: 'units'
      },
      pricing: {
        initialQuote: 15000,
        currentOffer: 13500,
        counterOffer: 12800,
        currency: 'SAR',
        pricePerUnit: 12800,
        totalValue: 320000
      },
      negotiation: {
        rounds: 3,
        status: 'counter_offered',
        progress: 75,
        lastActivity: new Date('2024-01-20'),
        deadline: new Date('2024-02-01')
      },
      terms: {
        paymentTerms: 'NET 30',
        deliveryTerms: '4-6 weeks',
        warranty: '2 years full warranty',
        specialConditions: 'Installation and training included'
      },
      analytics: {
        marketPrice: 14200,
        competitorPrices: [13800, 14500, 13200, 15100],
        profitMargin: 28.5,
        recommendedPrice: 13200,
        priceFlexibility: 15
      },
      history: [
        {
          timestamp: new Date('2024-01-15'),
          action: 'Initial Quote Sent',
          amount: 15000,
          party: 'seller',
          notes: 'Standard pricing for 25 units'
        },
        {
          timestamp: new Date('2024-01-17'),
          action: 'Counter Offer Received',
          amount: 12500,
          party: 'buyer',
          notes: 'Request for volume discount'
        },
        {
          timestamp: new Date('2024-01-18'),
          action: 'Revised Quote',
          amount: 13500,
          party: 'seller',
          notes: '10% volume discount applied'
        },
        {
          timestamp: new Date('2024-01-20'),
          action: 'Final Counter Offer',
          amount: 12800,
          party: 'buyer',
          notes: 'Final offer - decision needed'
        }
      ],
      priority: 'high',
      riskLevel: 'medium',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'NEG-002',
      title: 'Construction Materials Package Deal',
      titleAr: 'صفقة حزمة مواد البناء',
      buyer: {
        name: 'Fatima Al-Zahra',
        company: 'Gulf Construction Ltd',
        email: 'fatima@gulfconstruction.com',
        rating: 4.2
      },
      product: {
        name: 'Premium Steel Rebar Package',
        category: 'Construction Materials',
        sku: 'STEEL-PKG-001'
      },
      quantities: {
        requested: 500,
        unit: 'tons'
      },
      pricing: {
        initialQuote: 2800,
        currentOffer: 2650,
        currency: 'SAR',
        pricePerUnit: 2650,
        totalValue: 1325000
      },
      negotiation: {
        rounds: 1,
        status: 'active',
        progress: 25,
        lastActivity: new Date('2024-01-22'),
        deadline: new Date('2024-02-15')
      },
      terms: {
        paymentTerms: 'NET 45',
        deliveryTerms: '2-3 weeks',
        warranty: '1 year material warranty'
      },
      analytics: {
        marketPrice: 2750,
        competitorPrices: [2700, 2820, 2680, 2900],
        profitMargin: 22.3,
        recommendedPrice: 2680,
        priceFlexibility: 8
      },
      history: [
        {
          timestamp: new Date('2024-01-22'),
          action: 'Initial Quote Sent',
          amount: 2800,
          party: 'seller',
          notes: 'Bulk pricing for 500 tons'
        }
      ],
      priority: 'critical',
      riskLevel: 'low',
      createdAt: new Date('2024-01-22')
    }
  ];

  const filteredNegotiations = useMemo(() => {
    return mockNegotiations.filter(negotiation => {
      const matchesSearch = 
        negotiation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        negotiation.titleAr.includes(searchQuery) ||
        negotiation.buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        negotiation.product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || negotiation.negotiation.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || negotiation.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [mockNegotiations, searchQuery, statusFilter, priorityFilter]);

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      active: 'bg-blue-100 text-blue-800',
      counter_offered: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      pending: isRTL ? 'في الانتظار' : 'Pending',
      active: isRTL ? 'نشط' : 'Active',
      counter_offered: isRTL ? 'عرض مضاد' : 'Counter Offered',
      accepted: isRTL ? 'مقبول' : 'Accepted',
      rejected: isRTL ? 'مرفوض' : 'Rejected',
      expired: isRTL ? 'منتهي الصلاحية' : 'Expired'
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} hover:${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    const labels = {
      low: isRTL ? 'منخفض' : 'Low',
      medium: isRTL ? 'متوسط' : 'Medium',
      high: isRTL ? 'عالي' : 'High',
      critical: isRTL ? 'حرج' : 'Critical'
    };

    return (
      <Badge className={`${colors[priority as keyof typeof colors]} hover:${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculatePriceChange = (current: number, initial: number) => {
    return ((current - initial) / initial * 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const days = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Statistics
  const totalNegotiations = mockNegotiations.length;
  const activeNegotiations = mockNegotiations.filter(n => ['active', 'counter_offered'].includes(n.negotiation.status)).length;
  const totalValue = mockNegotiations.reduce((sum, n) => sum + n.pricing.totalValue, 0);
  const avgMargin = mockNegotiations.reduce((sum, n) => sum + n.analytics.profitMargin, 0) / mockNegotiations.length;
  const successRate = (mockNegotiations.filter(n => n.negotiation.status === 'accepted').length / mockNegotiations.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'أدوات التسعير والتفاوض' : 'Pricing & Negotiation Tools'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة متقدمة للتسعير الديناميكي وعمليات التفاوض' : 'Advanced dynamic pricing and negotiation management'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            {isRTL ? 'حاسبة السعر' : 'Price Calculator'}
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            {isRTL ? 'تحليل السوق' : 'Market Analysis'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? 'تفاوض جديد' : 'New Negotiation'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي المفاوضات' : 'Total Negotiations'}</p>
                <p className="text-2xl font-bold text-blue-600">{totalNegotiations}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'نشط' : 'Active'}</p>
                <p className="text-2xl font-bold text-orange-600">{activeNegotiations}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'متوسط الهامش' : 'Avg Margin'}</p>
                <p className="text-2xl font-bold text-purple-600">{avgMargin.toFixed(1)}%</p>
              </div>
              <Percent className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'معدل النجاح' : 'Success Rate'}</p>
                <p className="text-2xl font-bold text-emerald-600">{successRate.toFixed(0)}%</p>
              </div>
              <Award className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isRTL ? 'حاسبة التسعير الذكية' : 'Smart Pricing Calculator'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isRTL ? 'احسب الأسعار المثلى بناءً على السوق والمنافسة' : 'Calculate optimal prices based on market and competition'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isRTL ? 'تحليل المنافسين' : 'Competitor Analysis'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isRTL ? 'راقب أسعار المنافسين واتجاهات السوق' : 'Monitor competitor prices and market trends'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isRTL ? 'قوالب التفاوض' : 'Negotiation Templates'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isRTL ? 'قوالب جاهزة لعروض الأسعار والمفاوضات' : 'Ready templates for quotes and negotiations'}
                </p>
              </div>
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
                placeholder={isRTL ? 'البحث في المفاوضات...' : 'Search negotiations...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="counter_offered">{isRTL ? 'عرض مضاد' : 'Counter Offered'}</SelectItem>
                <SelectItem value="accepted">{isRTL ? 'مقبول' : 'Accepted'}</SelectItem>
                <SelectItem value="rejected">{isRTL ? 'مرفوض' : 'Rejected'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الأولوية' : 'Priority'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Priority'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Negotiations Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'المفاوضات' : 'Negotiations'} ({filteredNegotiations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'المعرف' : 'ID'}</TableHead>
                <TableHead>{isRTL ? 'المنتج' : 'Product'}</TableHead>
                <TableHead>{isRTL ? 'المشتري' : 'Buyer'}</TableHead>
                <TableHead>{isRTL ? 'السعر الحالي' : 'Current Price'}</TableHead>
                <TableHead>{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</TableHead>
                <TableHead>{isRTL ? 'التقدم' : 'Progress'}</TableHead>
                <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isRTL ? 'الأولوية' : 'Priority'}</TableHead>
                <TableHead>{isRTL ? 'الموعد النهائي' : 'Deadline'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNegotiations.map((negotiation) => {
                const priceChange = calculatePriceChange(negotiation.pricing.currentOffer, negotiation.pricing.initialQuote);
                
                return (
                  <TableRow key={negotiation.id}>
                    <TableCell>
                      <div className="font-mono text-sm font-medium">{negotiation.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{negotiation.product.name}</div>
                        <div className="text-sm text-gray-500">
                          {negotiation.quantities.requested} {negotiation.quantities.unit}
                        </div>
                        <div className="text-xs text-gray-400">{negotiation.product.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{negotiation.buyer.name}</div>
                        <div className="text-sm text-gray-500">{negotiation.buyer.company}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          ⭐ {negotiation.buyer.rating}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{formatCurrency(negotiation.pricing.currentOffer)}</div>
                      <div className="text-xs flex items-center gap-1">
                        {priceChange > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-red-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-green-500" />
                        )}
                        <span className={priceChange > 0 ? 'text-red-600' : 'text-green-600'}>
                          {Math.abs(priceChange).toFixed(1)}%
                        </span>
                      </div>
                      {negotiation.pricing.counterOffer && (
                        <div className="text-xs text-blue-600">
                          {isRTL ? 'العرض المضاد:' : 'Counter:'} {formatCurrency(negotiation.pricing.counterOffer)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-green-600">{formatCurrency(negotiation.pricing.totalValue)}</div>
                      <div className="text-xs text-gray-500">
                        {isRTL ? 'الهامش:' : 'Margin:'} {negotiation.analytics.profitMargin.toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={negotiation.negotiation.progress} className="w-16 h-2" />
                        <span className="text-sm font-medium">{negotiation.negotiation.progress}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {negotiation.negotiation.rounds} {isRTL ? 'جولات' : 'rounds'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(negotiation.negotiation.status)}</TableCell>
                    <TableCell>{getPriorityBadge(negotiation.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{negotiation.negotiation.deadline.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {getDaysRemaining(negotiation.negotiation.deadline)} {isRTL ? 'أيام متبقية' : 'days left'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{isRTL ? 'الإجراءات' : 'Actions'}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {isRTL ? 'إرسال عرض' : 'Send Offer'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calculator className="h-4 w-4 mr-2" />
                            {isRTL ? 'إعادة حساب السعر' : 'Recalculate Price'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            {isRTL ? 'تحليل السوق' : 'Market Analysis'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {isRTL ? 'قبول العرض' : 'Accept Offer'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4 mr-2" />
                            {isRTL ? 'رفض العرض' : 'Decline Offer'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredNegotiations.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {isRTL ? 'لم يتم العثور على مفاوضات' : 'No negotiations found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTools;