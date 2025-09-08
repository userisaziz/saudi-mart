import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Truck,
  Shield,
  BarChart3,
  Eye,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Download,
  Plus,
  Target,
  Activity,
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  MapPin,
  Globe,
  RefreshCw
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

interface Supplier {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  website?: string;
  category: string;
  tier: 'strategic' | 'preferred' | 'approved' | 'conditional';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  performance: {
    overall: number;
    quality: number;
    delivery: number;
    cost: number;
    innovation: number;
    sustainability: number;
  };
  compliance: {
    certifications: string[];
    audits: {
      type: string;
      date: Date;
      score: number;
      status: 'passed' | 'failed' | 'conditional';
    }[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  business: {
    totalOrders: number;
    totalValue: number;
    averageOrderValue: number;
    onTimeDelivery: number;
    qualityRating: number;
    lastOrder: Date;
    contractsActive: number;
  };
  location: {
    country: string;
    city: string;
    region: string;
  };
  contacts: {
    primary: {
      name: string;
      title: string;
      email: string;
      phone: string;
    };
    technical?: {
      name: string;
      email: string;
    };
    commercial?: {
      name: string;
      email: string;
    };
  };
  capabilities: string[];
  certifications: string[];
  joinedDate: Date;
  lastEvaluated: Date;
  nextEvaluation: Date;
}

export const SupplierRelationshipManagement: React.FC = () => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const mockSuppliers: Supplier[] = [
    {
      id: 'SUP-001',
      name: 'Saudi Industrial Solutions',
      nameAr: 'الحلول الصناعية السعودية',
      email: 'info@saudind.com',
      phone: '+966-11-4567890',
      website: 'https://saudind.com',
      category: 'Industrial Equipment',
      tier: 'strategic',
      status: 'active',
      performance: {
        overall: 92,
        quality: 95,
        delivery: 88,
        cost: 85,
        innovation: 90,
        sustainability: 78
      },
      compliance: {
        certifications: ['ISO 9001', 'ISO 14001', 'SASO', 'CE'],
        audits: [
          { type: 'Quality Audit', date: new Date('2024-01-15'), score: 95, status: 'passed' },
          { type: 'Sustainability Audit', date: new Date('2023-12-10'), score: 78, status: 'passed' }
        ],
        riskLevel: 'low'
      },
      business: {
        totalOrders: 145,
        totalValue: 2850000,
        averageOrderValue: 19655,
        onTimeDelivery: 94,
        qualityRating: 4.8,
        lastOrder: new Date('2024-01-20'),
        contractsActive: 3
      },
      location: {
        country: 'Saudi Arabia',
        city: 'Riyadh',
        region: 'Central'
      },
      contacts: {
        primary: {
          name: 'Ahmed Al-Rashid',
          title: 'Business Development Manager',
          email: 'ahmed.alrashid@saudind.com',
          phone: '+966-50-1234567'
        },
        technical: {
          name: 'Omar Hassan',
          email: 'omar.hassan@saudind.com'
        },
        commercial: {
          name: 'Fatima Al-Zahra',
          email: 'fatima.alzahra@saudind.com'
        }
      },
      capabilities: ['Heavy Machinery', 'Industrial Automation', 'Custom Engineering', 'Maintenance Services'],
      certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001'],
      joinedDate: new Date('2022-03-15'),
      lastEvaluated: new Date('2024-01-15'),
      nextEvaluation: new Date('2024-07-15')
    },
    {
      id: 'SUP-002',
      name: 'Gulf Construction Supply',
      nameAr: 'توريدات الخليج للإنشاءات',
      email: 'contact@gulfconstruct.com',
      phone: '+966-13-7654321',
      category: 'Construction Materials',
      tier: 'preferred',
      status: 'active',
      performance: {
        overall: 78,
        quality: 82,
        delivery: 75,
        cost: 88,
        innovation: 60,
        sustainability: 65
      },
      compliance: {
        certifications: ['SASO', 'ISO 9001'],
        audits: [
          { type: 'Quality Audit', date: new Date('2023-11-20'), score: 82, status: 'passed' },
          { type: 'Environmental Audit', date: new Date('2023-10-05'), score: 65, status: 'conditional' }
        ],
        riskLevel: 'medium'
      },
      business: {
        totalOrders: 89,
        totalValue: 1650000,
        averageOrderValue: 18539,
        onTimeDelivery: 78,
        qualityRating: 4.1,
        lastOrder: new Date('2024-01-18'),
        contractsActive: 2
      },
      location: {
        country: 'Saudi Arabia',
        city: 'Dammam',
        region: 'Eastern'
      },
      contacts: {
        primary: {
          name: 'Mohammed Al-Mahmoud',
          title: 'Sales Manager',
          email: 'mohammed@gulfconstruct.com',
          phone: '+966-50-9876543'
        }
      },
      capabilities: ['Concrete Products', 'Steel Structures', 'Building Materials', 'Logistics'],
      certifications: ['SASO Compliance', 'ISO 9001:2008'],
      joinedDate: new Date('2021-08-20'),
      lastEvaluated: new Date('2023-11-20'),
      nextEvaluation: new Date('2024-05-20')
    }
  ];

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.nameAr.includes(searchQuery) ||
        supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTier = tierFilter === 'all' || supplier.tier === tierFilter;
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
      const matchesRisk = riskFilter === 'all' || supplier.compliance.riskLevel === riskFilter;
      
      return matchesSearch && matchesTier && matchesStatus && matchesCategory && matchesRisk;
    });
  }, [mockSuppliers, searchQuery, tierFilter, statusFilter, categoryFilter, riskFilter]);

  const getTierBadge = (tier: string) => {
    const colors = {
      strategic: 'bg-purple-100 text-purple-800',
      preferred: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      conditional: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      strategic: isRTL ? 'استراتيجي' : 'Strategic',
      preferred: isRTL ? 'مفضل' : 'Preferred',
      approved: isRTL ? 'معتمد' : 'Approved',
      conditional: isRTL ? 'مشروط' : 'Conditional'
    };

    return (
      <Badge className={`${colors[tier as keyof typeof colors]} hover:${colors[tier as keyof typeof colors]}`}>
        {labels[tier as keyof typeof labels]}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };

    const labels = {
      low: isRTL ? 'منخفض' : 'Low',
      medium: isRTL ? 'متوسط' : 'Medium',
      high: isRTL ? 'عالي' : 'High'
    };

    return (
      <Badge className={`${colors[risk as keyof typeof colors]} hover:${colors[risk as keyof typeof colors]}`}>
        {labels[risk as keyof typeof labels]}
      </Badge>
    );
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Statistics
  const totalSuppliers = mockSuppliers.length;
  const strategicSuppliers = mockSuppliers.filter(s => s.tier === 'strategic').length;
  const activeSuppliers = mockSuppliers.filter(s => s.status === 'active').length;
  const highRiskSuppliers = mockSuppliers.filter(s => s.compliance.riskLevel === 'high').length;
  const totalSpend = mockSuppliers.reduce((sum, supplier) => sum + supplier.business.totalValue, 0);
  const avgPerformance = mockSuppliers.reduce((sum, supplier) => sum + supplier.performance.overall, 0) / mockSuppliers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'إدارة علاقات الموردين' : 'Supplier Relationship Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة شاملة لأداء الموردين والعلاقات الاستراتيجية' : 'Comprehensive supplier performance and strategic relationship management'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isRTL ? 'تقرير الأداء' : 'Performance Report'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? 'مورد جديد' : 'New Supplier'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي الموردين' : 'Total Suppliers'}</p>
                <p className="text-2xl font-bold text-blue-600">{totalSuppliers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'استراتيجي' : 'Strategic'}</p>
                <p className="text-2xl font-bold text-purple-600">{strategicSuppliers}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'نشط' : 'Active'}</p>
                <p className="text-2xl font-bold text-green-600">{activeSuppliers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'مخاطر عالية' : 'High Risk'}</p>
                <p className="text-2xl font-bold text-red-600">{highRiskSuppliers}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي الإنفاق' : 'Total Spend'}</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalSpend)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'متوسط الأداء' : 'Avg Performance'}</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(avgPerformance)}`}>
                  {avgPerformance.toFixed(0)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-500" />
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
                placeholder={isRTL ? 'البحث في الموردين...' : 'Search suppliers...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={isRTL ? 'المستوى' : 'Tier'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Tiers'}</SelectItem>
                <SelectItem value="strategic">{isRTL ? 'استراتيجي' : 'Strategic'}</SelectItem>
                <SelectItem value="preferred">{isRTL ? 'مفضل' : 'Preferred'}</SelectItem>
                <SelectItem value="approved">{isRTL ? 'معتمد' : 'Approved'}</SelectItem>
                <SelectItem value="conditional">{isRTL ? 'مشروط' : 'Conditional'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{isRTL ? 'غير نشط' : 'Inactive'}</SelectItem>
                <SelectItem value="pending">{isRTL ? 'معلق' : 'Pending'}</SelectItem>
                <SelectItem value="suspended">{isRTL ? 'موقوف' : 'Suspended'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'المخاطر' : 'Risk'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Risks'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'الموردين' : 'Suppliers'} ({filteredSuppliers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'المورد' : 'Supplier'}</TableHead>
                <TableHead>{isRTL ? 'الفئة' : 'Category'}</TableHead>
                <TableHead>{isRTL ? 'المستوى' : 'Tier'}</TableHead>
                <TableHead>{isRTL ? 'الأداء العام' : 'Overall Performance'}</TableHead>
                <TableHead>{isRTL ? 'إجمالي القيمة' : 'Total Value'}</TableHead>
                <TableHead>{isRTL ? 'التسليم في الوقت' : 'On-Time Delivery'}</TableHead>
                <TableHead>{isRTL ? 'المخاطر' : 'Risk'}</TableHead>
                <TableHead>{isRTL ? 'التقييم التالي' : 'Next Evaluation'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{isRTL ? supplier.nameAr : supplier.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {supplier.location.city}, {supplier.location.country}
                      </div>
                      <div className="text-sm text-gray-500">{supplier.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{supplier.category}</div>
                  </TableCell>
                  <TableCell>{getTierBadge(supplier.tier)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={supplier.performance.overall} className="w-16 h-2" />
                      <span className={`font-medium ${getPerformanceColor(supplier.performance.overall)}`}>
                        {supplier.performance.overall}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {supplier.business.totalOrders} {isRTL ? 'طلب' : 'orders'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{formatCurrency(supplier.business.totalValue)}</div>
                    <div className="text-xs text-gray-500">
                      {isRTL ? 'متوسط:' : 'Avg:'} {formatCurrency(supplier.business.averageOrderValue)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={supplier.business.onTimeDelivery} className="w-12 h-2" />
                      <span className="text-sm font-medium">{supplier.business.onTimeDelivery}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(supplier.compliance.riskLevel)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{supplier.nextEvaluation.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {Math.ceil((supplier.nextEvaluation.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {isRTL ? 'أيام' : 'days'}
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
                          {isRTL ? 'عرض الملف الشخصي' : 'View Profile'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          {isRTL ? 'تقرير الأداء' : 'Performance Report'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {isRTL ? 'تقييم جديد' : 'New Evaluation'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {isRTL ? 'إرسال رسالة' : 'Send Message'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {isRTL ? 'لم يتم العثور على موردين' : 'No suppliers found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierRelationshipManagement;