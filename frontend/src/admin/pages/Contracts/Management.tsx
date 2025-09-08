import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  MoreVertical,
  Building,
  Scale,
  Shield,
  Zap,
  TrendingUp,
  Archive,
  RefreshCw,
  Bell
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface Contract {
  id: string;
  title: string;
  titleAr: string;
  contractNumber: string;
  supplier: {
    id: string;
    name: string;
    email: string;
    rating: number;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  type: 'master_agreement' | 'purchase_order' | 'framework' | 'service_agreement';
  status: 'draft' | 'pending_approval' | 'active' | 'expired' | 'terminated' | 'renewed';
  value: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  autoRenewal: boolean;
  renewalDays: number;
  paymentTerms: string;
  deliveryTerms: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
  riskLevel: 'low' | 'medium' | 'high';
  approvalWorkflow: {
    stage: string;
    approvedBy?: string;
    approvedAt?: Date;
    comments?: string;
  }[];
  attachments: string[];
  createdAt: Date;
  lastModified: Date;
  nextReviewDate: Date;
}

export const ContractManagement: React.FC = () => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const mockContracts: Contract[] = [
    {
      id: '1',
      title: 'Industrial Equipment Supply Agreement',
      titleAr: 'اتفاقية توريد المعدات الصناعية',
      contractNumber: 'CNT-2024-001',
      supplier: {
        id: 'SUP-001',
        name: 'Saudi Industrial Solutions',
        email: 'contracts@saudind.com',
        rating: 4.8
      },
      buyer: {
        id: 'BUY-001',
        name: 'Riyadh Manufacturing Corp',
        email: 'procurement@riyadhmanuf.com',
        department: 'Procurement'
      },
      type: 'master_agreement',
      status: 'active',
      value: 2500000,
      currency: 'SAR',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      autoRenewal: true,
      renewalDays: 30,
      paymentTerms: 'NET 30',
      deliveryTerms: 'FOB Destination',
      complianceStatus: 'compliant',
      riskLevel: 'low',
      approvalWorkflow: [
        { stage: 'Legal Review', approvedBy: 'Sarah Ahmed', approvedAt: new Date('2023-12-15'), comments: 'Legal terms reviewed and approved' },
        { stage: 'Financial Approval', approvedBy: 'Mohammed Al-Rashid', approvedAt: new Date('2023-12-20') },
        { stage: 'Executive Approval', approvedBy: 'Fatima Al-Zahra', approvedAt: new Date('2023-12-22') }
      ],
      attachments: ['contract_main.pdf', 'terms_conditions.pdf', 'compliance_cert.pdf'],
      createdAt: new Date('2023-12-10'),
      lastModified: new Date('2024-01-15'),
      nextReviewDate: new Date('2024-06-01')
    },
    {
      id: '2',
      title: 'Construction Materials Framework',
      titleAr: 'إطار عمل مواد البناء',
      contractNumber: 'CNT-2024-002',
      supplier: {
        id: 'SUP-002',
        name: 'Gulf Construction Supply',
        email: 'info@gulfconstruct.com',
        rating: 4.2
      },
      buyer: {
        id: 'BUY-002',
        name: 'Eastern Province Development',
        email: 'contracts@epdevelopment.com',
        department: 'Construction'
      },
      type: 'framework',
      status: 'pending_approval',
      value: 1800000,
      currency: 'SAR',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2026-02-28'),
      autoRenewal: false,
      renewalDays: 0,
      paymentTerms: 'NET 45',
      deliveryTerms: 'Ex Works',
      complianceStatus: 'pending_review',
      riskLevel: 'medium',
      approvalWorkflow: [
        { stage: 'Technical Review', approvedBy: 'Ahmed Hassan', approvedAt: new Date('2024-01-10') },
        { stage: 'Commercial Review' }
      ],
      attachments: ['framework_agreement.pdf', 'technical_specs.pdf'],
      createdAt: new Date('2024-01-05'),
      lastModified: new Date('2024-01-20'),
      nextReviewDate: new Date('2024-04-01')
    }
  ];

  const filteredContracts = useMemo(() => {
    return mockContracts.filter(contract => {
      const matchesSearch = 
        contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      const matchesType = typeFilter === 'all' || contract.type === typeFilter;
      const matchesRisk = riskFilter === 'all' || contract.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesRisk;
    });
  }, [mockContracts, searchQuery, statusFilter, typeFilter, riskFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      pending_approval: 'default',
      active: 'default',
      expired: 'destructive',
      terminated: 'destructive',
      renewed: 'default'
    } as const;

    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      terminated: 'bg-red-100 text-red-800',
      renewed: 'bg-blue-100 text-blue-800'
    };

    const labels = {
      draft: isRTL ? 'مسودة' : 'Draft',
      pending_approval: isRTL ? 'في انتظار الموافقة' : 'Pending Approval',
      active: isRTL ? 'نشط' : 'Active',
      expired: isRTL ? 'منتهي الصلاحية' : 'Expired',
      terminated: isRTL ? 'منهي' : 'Terminated',
      renewed: isRTL ? 'مجدد' : 'Renewed'
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} hover:${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Statistics
  const totalContracts = mockContracts.length;
  const activeContracts = mockContracts.filter(c => c.status === 'active').length;
  const pendingApproval = mockContracts.filter(c => c.status === 'pending_approval').length;
  const expiringContracts = mockContracts.filter(c => {
    const daysUntilExpiry = Math.ceil((c.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && c.status === 'active';
  }).length;
  const totalValue = mockContracts.reduce((sum, contract) => sum + contract.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'إدارة العقود' : 'Contract Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة شاملة لدورة حياة العقود والامتثال' : 'Comprehensive contract lifecycle and compliance management'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            {isRTL ? 'استيراد' : 'Import'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? 'عقد جديد' : 'New Contract'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'إجمالي العقود' : 'Total Contracts'}</p>
                <p className="text-2xl font-bold text-blue-600">{totalContracts}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'العقود النشطة' : 'Active Contracts'}</p>
                <p className="text-2xl font-bold text-green-600">{activeContracts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'في انتظار الموافقة' : 'Pending Approval'}</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingApproval}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'تنتهي قريباً' : 'Expiring Soon'}</p>
                <p className="text-2xl font-bold text-red-600">{expiringContracts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue, 'SAR')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
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
                placeholder={isRTL ? 'البحث في العقود...' : 'Search contracts...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'جميع الحالات' : 'All Statuses'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Statuses'}</SelectItem>
                <SelectItem value="active">{isRTL ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="pending_approval">{isRTL ? 'في انتظار الموافقة' : 'Pending Approval'}</SelectItem>
                <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
                <SelectItem value="expired">{isRTL ? 'منتهي الصلاحية' : 'Expired'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'جميع الأنواع' : 'All Types'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                <SelectItem value="master_agreement">{isRTL ? 'اتفاقية رئيسية' : 'Master Agreement'}</SelectItem>
                <SelectItem value="framework">{isRTL ? 'إطار عمل' : 'Framework'}</SelectItem>
                <SelectItem value="purchase_order">{isRTL ? 'أمر شراء' : 'Purchase Order'}</SelectItem>
                <SelectItem value="service_agreement">{isRTL ? 'اتفاقية خدمة' : 'Service Agreement'}</SelectItem>
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

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'العقود' : 'Contracts'} ({filteredContracts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'رقم العقد' : 'Contract #'}</TableHead>
                <TableHead>{isRTL ? 'العنوان' : 'Title'}</TableHead>
                <TableHead>{isRTL ? 'المورد' : 'Supplier'}</TableHead>
                <TableHead>{isRTL ? 'المشتري' : 'Buyer'}</TableHead>
                <TableHead>{isRTL ? 'القيمة' : 'Value'}</TableHead>
                <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isRTL ? 'المخاطر' : 'Risk'}</TableHead>
                <TableHead>{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{contract.contractNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{isRTL ? contract.titleAr : contract.title}</div>
                    <div className="text-sm text-gray-500 capitalize">{contract.type.replace('_', ' ')}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{contract.supplier.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <span>★ {contract.supplier.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{contract.buyer.name}</div>
                    <div className="text-sm text-gray-500">{contract.buyer.department}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{formatCurrency(contract.value, contract.currency)}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{getRiskBadge(contract.riskLevel)}</TableCell>
                  <TableCell>
                    <div className="text-sm">{contract.endDate.toLocaleDateString()}</div>
                    {contract.autoRenewal && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {isRTL ? 'تجديد تلقائي' : 'Auto Renewal'}
                      </Badge>
                    )}
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
                          <Edit className="h-4 w-4 mr-2" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          {isRTL ? 'تحميل PDF' : 'Download PDF'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {isRTL ? 'تجديد' : 'Renew'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredContracts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {isRTL ? 'لم يتم العثور على عقود' : 'No contracts found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;