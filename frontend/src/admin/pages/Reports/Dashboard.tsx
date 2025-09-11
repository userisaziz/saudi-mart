import React, { useState } from 'react'
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, Users, Package, DollarSign, Eye, Settings, RefreshCw, Clock, CheckCircle, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'

interface Report {
  id: string
  name: string
  description: string
  category: 'sales' | 'users' | 'products' | 'financial' | 'operations' | 'compliance'
  type: 'standard' | 'custom' | 'scheduled'
  format: 'pdf' | 'excel' | 'csv' | 'json'
  status: 'ready' | 'generating' | 'scheduled' | 'failed'
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    time: string
    recipients: string[]
  }
  lastGenerated?: string
  nextGeneration?: string
  fileSize?: string
  downloadUrl?: string
  createdAt: string
  createdBy: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: Report['category']
  fields: string[]
  filters: string[]
  visualizations: string[]
  isPopular: boolean
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive monthly sales analysis',
    category: 'sales',
    type: 'scheduled',
    format: 'pdf',
    status: 'ready',
    schedule: {
      frequency: 'monthly',
      time: '08:00',
      recipients: ['admin@company.com', 'manager@company.com']
    },
    lastGenerated: '2024-01-20T08:00:00Z',
    nextGeneration: '2024-02-20T08:00:00Z',
    fileSize: '2.4 MB',
    downloadUrl: '/reports/monthly-sales-jan-2024.pdf',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System Admin'
  },
  {
    id: '2',
    name: 'User Registration Analytics',
    description: 'User growth and registration patterns',
    category: 'users',
    type: 'standard',
    format: 'excel',
    status: 'ready',
    lastGenerated: '2024-01-21T10:30:00Z',
    fileSize: '1.8 MB',
    downloadUrl: '/reports/user-registration-q1-2024.xlsx',
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'Marketing Team'
  },
  {
    id: '3',
    name: 'Product Performance Report',
    description: 'Top performing products and categories',
    category: 'products',
    type: 'custom',
    format: 'pdf',
    status: 'generating',
    createdAt: '2024-01-21T09:15:00Z',
    createdBy: 'Product Manager'
  },
  {
    id: '4',
    name: 'Financial Summary Q1',
    description: 'Quarterly financial performance overview',
    category: 'financial',
    type: 'standard',
    format: 'excel',
    status: 'scheduled',
    schedule: {
      frequency: 'quarterly',
      time: '09:00',
      recipients: ['cfo@company.com', 'finance@company.com']
    },
    nextGeneration: '2024-03-31T09:00:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    createdBy: 'CFO Office'
  },
  {
    id: '5',
    name: 'SASO Compliance Report',
    description: 'Saudi standards compliance verification',
    category: 'compliance',
    type: 'scheduled',
    format: 'pdf',
    status: 'failed',
    schedule: {
      frequency: 'weekly',
      time: '07:00',
      recipients: ['compliance@company.com']
    },
    createdAt: '2024-01-05T00:00:00Z',
    createdBy: 'Compliance Officer'
  }
]

const mockTemplates: ReportTemplate[] = [
  {
    id: 'template-1',
    name: 'Sales Performance Dashboard',
    nameAr: 'لوحة أداء المبيعات',
    description: 'Complete sales metrics and trends',
    descriptionAr: 'مقاييس واتجاهات مبيعات شاملة',
    category: 'sales',
    fields: ['Revenue', 'Orders', 'Conversion Rate', 'Average Order Value'],
    filters: ['Date Range', 'Region', 'Category', 'Seller'],
    visualizations: ['Line Charts', 'Bar Charts', 'Pie Charts', 'Tables'],
    isPopular: true
  },
  {
    id: 'template-2',
    name: 'Customer Analysis Report',
    nameAr: 'تقرير تحليل العملاء',
    description: 'Customer demographics and behavior analysis',
    descriptionAr: 'تحليل ديموغرافية وسلوك العملاء',
    category: 'users',
    fields: ['User Count', 'Active Users', 'Registration Trends', 'Geographic Distribution'],
    filters: ['Registration Date', 'User Type', 'Region', 'Activity Status'],
    visualizations: ['Heat Maps', 'Bar Charts', 'Geographic Maps', 'Trend Lines'],
    isPopular: true
  },
  {
    id: 'template-3',
    name: 'Product Catalog Report',
    nameAr: 'تقرير كتالوج المنتجات',
    description: 'Product inventory and performance metrics',
    descriptionAr: 'مقاييس المخزون وأداء المنتجات',
    category: 'products',
    fields: ['Product Count', 'Category Distribution', 'Stock Levels', 'Price Analysis'],
    filters: ['Category', 'Status', 'Price Range', 'Stock Level'],
    visualizations: ['Tables', 'Bar Charts', 'Stock Alerts', 'Price Trends'],
    isPopular: false
  }
]

const getCategoryIcon = (category: string) => {
  const iconMap = {
    'sales': DollarSign,
    'users': Users,
    'products': Package,
    'financial': BarChart3,
    'operations': Settings,
    'compliance': CheckCircle
  }
  return iconMap[category as keyof typeof iconMap] || FileText
}

const getCategoryBadge = (category: string) => {
  const categoryMap = {
    'sales': { label: 'Sales', color: 'bg-green-100 text-green-800 hover:bg-green-100' },
    'users': { label: 'Users', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    'products': { label: 'Products', color: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
    'financial': { label: 'Financial', color: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
    'operations': { label: 'Operations', color: 'bg-teal-100 text-teal-800 hover:bg-teal-100' },
    'compliance': { label: 'Compliance', color: 'bg-red-100 text-red-800 hover:bg-red-100' }
  }
  
  const categoryInfo = categoryMap[category as keyof typeof categoryMap]
  return <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    'ready': { label: 'Ready', color: 'bg-green-100 text-green-800 hover:bg-green-100', icon: CheckCircle },
    'generating': { label: 'Generating', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: RefreshCw },
    'scheduled': { label: 'Scheduled', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100', icon: Calendar },
    'failed': { label: 'Failed', color: 'bg-red-100 text-red-800 hover:bg-red-100', icon: Clock }
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap]
  const Icon = statusInfo.icon
  
  return (
    <Badge className={statusInfo.color}>
      <Icon className="w-3 h-3 ml-1" />
      {statusInfo.label}
    </Badge>
  )
}

const getTypeBadge = (type: string) => {
  const typeMap = {
    'standard': { label: 'Standard', color: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    'custom': { label: 'Custom', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100' },
    'scheduled': { label: 'Scheduled', color: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100' }
  }
  
  const typeInfo = typeMap[type as keyof typeof typeMap]
  return <Badge variant="outline" className={typeInfo.color}>{typeInfo.label}</Badge>
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [templates] = useState<ReportTemplate[]>(mockTemplates)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('reports')

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.nameAr.includes(searchTerm) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.descriptionAr.includes(searchTerm)
    
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus
  })

  const handleGenerateReport = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: 'generating' as const,
            lastGenerated: new Date().toISOString()
          }
        : report
    ))
    
    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'ready' as const,
              fileSize: '2.1 MB',
              downloadUrl: `/reports/generated-${reportId}.pdf`
            }
          : report
      ))
    }, 3000)
  }

  const readyReports = reports.filter(r => r.status === 'ready').length
  const scheduledReports = reports.filter(r => r.status === 'scheduled').length
  const failedReports = reports.filter(r => r.status === 'failed').length
  const totalReports = reports.length

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports System</h1>
          <p className="text-gray-600">Generate and manage business and analytical reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 ml-2" />
            Report Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            Create New Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              <p className="text-xs text-blue-600">All reports</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready Reports</p>
              <p className="text-2xl font-bold text-gray-900">{readyReports}</p>
              <p className="text-xs text-green-600">Available for download</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled Reports</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledReports}</p>
              <p className="text-xs text-orange-600">Automatic</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Reports</p>
              <p className="text-2xl font-bold text-gray-900">{failedReports}</p>
              <p className="text-xs text-red-600">Need review</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 ml-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="templates">
              <BarChart3 className="w-4 h-4 ml-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Calendar className="w-4 h-4 ml-2" />
              Scheduled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="generating">Generating</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => {
                const CategoryIcon = getCategoryIcon(report.category)
                return (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <CategoryIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{report.nameAr}</CardTitle>
                            <p className="text-sm text-gray-500">{report.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{report.descriptionAr}</p>
                          </div>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(report.category)}
                          {getTypeBadge(report.type)}
                          <Badge variant="outline">
                            {report.format.toUpperCase()}
                          </Badge>
                        </div>

                        {report.lastGenerated && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last generated:</span>
                            <span>{formatDateShort(report.lastGenerated)}</span>
                          </div>
                        )}

                        {report.fileSize && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">File size:</span>
                            <span>{report.fileSize}</span>
                          </div>
                        )}

                        {report.schedule && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Frequency:</span>
                            <span>
                              {report.schedule.frequency === 'daily' ? 'Daily' :
                               report.schedule.frequency === 'weekly' ? 'Weekly' :
                               report.schedule.frequency === 'monthly' ? 'Monthly' : 'Quarterly'}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-gray-500">
                            by {report.createdBy}
                          </span>
                          <div className="flex items-center gap-2">
                            {report.status === 'ready' && report.downloadUrl && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 ml-1" />
                                Download
                              </Button>
                            )}
                            {report.status === 'failed' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleGenerateReport(report.id)}
                              >
                                <RefreshCw className="w-4 h-4 ml-1" />
                                Retry
                              </Button>
                            )}
                            {report.status !== 'generating' && (
                              <Button 
                                size="sm"
                                onClick={() => handleGenerateReport(report.id)}
                              >
                                <RefreshCw className="w-4 h-4 ml-1" />
                                Generate
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Report Templates</h3>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                Create New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category)
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <CategoryIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{template.nameAr}</CardTitle>
                            <p className="text-sm text-gray-500">{template.name}</p>
                          </div>
                        </div>
                        {template.isPopular && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{template.descriptionAr}</p>
                        
                        {getCategoryBadge(template.category)}
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Fields:</span>
                            <p className="text-gray-600">{template.fields.length} fields</p>
                          </div>
                          <div>
                            <span className="font-medium">Filters:</span>
                            <p className="text-gray-600">{template.filters.length} filters</p>
                          </div>
                          <div>
                            <span className="font-medium">Charts:</span>
                            <p className="text-gray-600">{template.visualizations.length} types</p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button size="sm" variant="outline">Preview</Button>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Scheduled Reports</h3>
              <Button>
                <Calendar className="w-4 h-4 ml-2" />
                Add New Schedule
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">Report</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                  <TableHead className="text-right">Recipients</TableHead>
                  <TableHead className="text-right">Next</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.filter(r => r.schedule).map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.nameAr}</p>
                        <p className="text-sm text-gray-500">{getCategoryBadge(report.category)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.schedule?.frequency === 'daily' ? 'Daily' :
                       report.schedule?.frequency === 'weekly' ? 'Weekly' :
                       report.schedule?.frequency === 'monthly' ? 'Monthly' : 'Quarterly'}
                    </TableCell>
                    <TableCell>{report.schedule?.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {report.schedule?.recipients.length} recipients
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {report.nextGeneration ? formatDateShort(report.nextGeneration) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="ghost">Disable</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}