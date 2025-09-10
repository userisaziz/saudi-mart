import React, { useState, useCallback } from 'react'
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Package,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Database
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs'
import { Progress } from '@/shared/components/ui/progress'
import { useLanguage } from '@/shared/contexts/LanguageContext'

interface BulkOperation {
  id: string
  type: 'import' | 'export' | 'update' | 'delete'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  fileName: string
  totalRecords: number
  processedRecords: number
  successfulRecords: number
  failedRecords: number
  startTime: string
  completionTime?: string
  errors?: Array<{
    row: number
    field: string
    message: string
  }>
  performedBy: string
  description: string
}

interface BulkTemplate {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  type: 'products' | 'categories' | 'inventory' | 'pricing'
  fields: Array<{
    name: string
    nameAr: string
    required: boolean
    type: 'text' | 'number' | 'email' | 'date' | 'select'
    options?: string[]
  }>
  sampleData: Record<string, any>[]
}

const mockOperations: BulkOperation[] = [
  {
    id: 'BULK-001',
    type: 'import',
    status: 'completed',
    fileName: 'products_batch_2024_01.xlsx',
    totalRecords: 1500,
    processedRecords: 1500,
    successfulRecords: 1450,
    failedRecords: 50,
    startTime: '2024-01-15T10:30:00Z',
    completionTime: '2024-01-15T11:15:00Z',
    performedBy: 'Admin User',
    description: 'Monthly product catalog import',
    errors: [
      { row: 15, field: 'price', message: 'Invalid price format' },
      { row: 23, field: 'category', message: 'Category does not exist' },
    ]
  },
  {
    id: 'BULK-002',
    type: 'update',
    status: 'processing',
    fileName: 'price_updates_2024_01.xlsx',
    totalRecords: 800,
    processedRecords: 450,
    successfulRecords: 440,
    failedRecords: 10,
    startTime: '2024-01-16T14:20:00Z',
    performedBy: 'Admin User',
    description: 'Price update for electronics category'
  }
]

const mockTemplates: BulkTemplate[] = [
  {
    id: 'TMPL-001',
    name: 'Product Import Template',
    nameAr: 'قالب استيراد المنتجات',
    description: 'Standard template for importing new products',
    descriptionAr: 'القالب المعياري لاستيراد المنتجات الجديدة',
    type: 'products',
    fields: [
      { name: 'Product Name (EN)', nameAr: 'اسم المنتج (EN)', required: true, type: 'text' },
      { name: 'Product Name (AR)', nameAr: 'اسم المنتج (AR)', required: true, type: 'text' },
      { name: 'SKU', nameAr: 'رمز المنتج', required: true, type: 'text' },
      { name: 'Category', nameAr: 'الفئة', required: true, type: 'select', options: ['Electronics', 'Industrial', 'Fashion'] },
      { name: 'Price', nameAr: 'السعر', required: true, type: 'number' },
      { name: 'Stock Quantity', nameAr: 'كمية المخزون', required: true, type: 'number' }
    ],
    sampleData: [
      {
        'Product Name (EN)': 'Industrial Steel Pipe',
        'Product Name (AR)': 'أنبوب صلب صناعي',
        'SKU': 'ISP-001',
        'Category': 'Industrial',
        'Price': 250,
        'Stock Quantity': 100
      }
    ]
  },
  {
    id: 'TMPL-002',
    name: 'Price Update Template',
    nameAr: 'قالب تحديث الأسعار',
    description: 'Template for bulk price updates',
    descriptionAr: 'قالب لتحديث الأسعار بشكل جماعي',
    type: 'pricing',
    fields: [
      { name: 'SKU', nameAr: 'رمز المنتج', required: true, type: 'text' },
      { name: 'New Price', nameAr: 'السعر الجديد', required: true, type: 'number' },
      { name: 'Effective Date', nameAr: 'تاريخ السريان', required: false, type: 'date' }
    ],
    sampleData: [
      {
        'SKU': 'ISP-001',
        'New Price': 275,
        'Effective Date': '2024-02-01'
      }
    ]
  }
]

const BulkOperationsPage: React.FC = () => {
  const { t, isRTL } = useLanguage()
  const [operations, setOperations] = useState<BulkOperation[]>(mockOperations)
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<BulkTemplate | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Pagination
  const totalPages = Math.ceil(operations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOperations = operations.slice(startIndex, startIndex + itemsPerPage)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }, [])

  const handleStartOperation = () => {
    if (!uploadFile) return

    const newOperation: BulkOperation = {
      id: `BULK-${Date.now()}`,
      type: 'import',
      status: 'pending',
      fileName: uploadFile.name,
      totalRecords: 0,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      startTime: new Date().toISOString(),
      performedBy: 'Admin User',
      description: 'New bulk import operation'
    }

    setOperations(prev => [newOperation, ...prev])
    setUploadFile(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-gray-100 text-gray-800', text: isRTL ? 'في الانتظار' : 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', text: isRTL ? 'قيد المعالجة' : 'Processing' },
      completed: { color: 'bg-green-100 text-green-800', text: isRTL ? 'مكتمل' : 'Completed' },
      failed: { color: 'bg-red-100 text-red-800', text: isRTL ? 'فشل' : 'Failed' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      import: Upload,
      export: Download,
      update: Edit,
      delete: Trash2
    }
    const Icon = icons[type as keyof typeof icons] || FileText
    return <Icon className="w-4 h-4" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadTemplate = (template: BulkTemplate) => {
    // In a real app, this would generate and download the template file
    console.log(`Downloading template: ${template.name}`)
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'العمليات الجماعية' : 'Bulk Operations'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'إدارة العمليات الجماعية للمنتجات والفئات والمخزون' : 'Manage bulk operations for products, categories, and inventory'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="operations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">
            {isRTL ? 'العمليات' : 'Operations'}
          </TabsTrigger>
          <TabsTrigger value="upload">
            {isRTL ? 'رفع جديد' : 'New Upload'}
          </TabsTrigger>
          <TabsTrigger value="templates">
            {isRTL ? 'القوالب' : 'Templates'}
          </TabsTrigger>
        </TabsList>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          {/* Operations Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                    <TableHead>{isRTL ? 'الملف' : 'File'}</TableHead>
                    <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead>{isRTL ? 'التقدم' : 'Progress'}</TableHead>
                    <TableHead>{isRTL ? 'النتائج' : 'Results'}</TableHead>
                    <TableHead>{isRTL ? 'وقت البدء' : 'Start Time'}</TableHead>
                    <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(operation.type)}
                          <span className="capitalize">{operation.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{operation.fileName}</div>
                          <div className="text-sm text-gray-500">{operation.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(operation.status)}
                      </TableCell>
                      <TableCell>
                        {operation.status === 'processing' ? (
                          <div className="space-y-1">
                            <Progress 
                              value={(operation.processedRecords / operation.totalRecords) * 100} 
                              className="w-20" 
                            />
                            <div className="text-xs text-gray-500">
                              {operation.processedRecords}/{operation.totalRecords}
                            </div>
                          </div>
                        ) : operation.status === 'completed' ? (
                          <div className="text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 inline mr-1" />
                            {isRTL ? 'مكتمل' : 'Complete'}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {operation.totalRecords > 0 ? `${operation.totalRecords} ${isRTL ? 'سجل' : 'records'}` : '-'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {operation.status === 'completed' && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-green-600">{operation.successfulRecords}</span>
                            </div>
                            {operation.failedRecords > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className="text-red-600">{operation.failedRecords}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(operation.startTime)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedOperation(operation)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                          {operation.status === 'completed' && operation.failedRecords > 0 && (
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Download className="w-4 h-4 mr-1" />
                              {isRTL ? 'الأخطاء' : 'Errors'}
                            </Button>
                          )}
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
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {isRTL ? 'رفع ملف جديد' : 'Upload New File'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'اختر ملف لبدء عملية جماعية جديدة' : 'Select a file to start a new bulk operation'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isRTL ? 'نوع العملية' : 'Operation Type'}
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر نوع العملية' : 'Select operation type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="import">{isRTL ? 'استيراد منتجات' : 'Import Products'}</SelectItem>
                      <SelectItem value="update">{isRTL ? 'تحديث الأسعار' : 'Update Prices'}</SelectItem>
                      <SelectItem value="inventory">{isRTL ? 'تحديث المخزون' : 'Update Inventory'}</SelectItem>
                      <SelectItem value="categories">{isRTL ? 'إدارة الفئات' : 'Manage Categories'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isRTL ? 'اختيار الملف' : 'Select File'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {isRTL ? 'اسحب وأفلت الملف هنا أو انقر للاختيار' : 'Drag and drop file here or click to select'}
                    </p>
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        {isRTL ? 'اختيار الملف' : 'Choose File'}
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      {isRTL ? 'الأنواع المدعومة: .xlsx, .xls, .csv' : 'Supported formats: .xlsx, .xls, .csv'}
                    </p>
                  </div>
                  {uploadFile && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{uploadFile.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setUploadFile(null)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isRTL ? 'الوصف (اختياري)' : 'Description (Optional)'}
                  </label>
                  <Textarea
                    placeholder={isRTL ? 'أدخل وصفاً لهذه العملية...' : 'Enter a description for this operation...'}
                  />
                </div>

                <Button 
                  onClick={handleStartOperation} 
                  disabled={!uploadFile}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isRTL ? 'بدء العملية' : 'Start Operation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5" />
                      {isRTL ? template.nameAr : template.name}
                    </div>
                    <Badge variant="outline">{template.type}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? template.descriptionAr : template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      {isRTL ? 'الحقول المطلوبة:' : 'Required Fields:'}
                    </p>
                    <div className="space-y-1">
                      {template.fields.filter(f => f.required).map((field, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {isRTL ? field.nameAr : field.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadTemplate(template)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isRTL ? 'تحميل' : 'Download'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Operation Details Modal */}
      {selectedOperation && (
        <Dialog open={!!selectedOperation} onOpenChange={() => setSelectedOperation(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? `تفاصيل العملية - ${selectedOperation.fileName}` : `Operation Details - ${selectedOperation.fileName}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status and Progress */}
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedOperation.status)}
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedOperation.type)}
                  <span className="capitalize">{selectedOperation.type}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedOperation.totalRecords}</p>
                  <p className="text-sm text-gray-600">{isRTL ? 'إجمالي السجلات' : 'Total Records'}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedOperation.successfulRecords}</p>
                  <p className="text-sm text-gray-600">{isRTL ? 'ناجح' : 'Successful'}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{selectedOperation.failedRecords}</p>
                  <p className="text-sm text-gray-600">{isRTL ? 'فاشل' : 'Failed'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">{selectedOperation.processedRecords}</p>
                  <p className="text-sm text-gray-600">{isRTL ? 'معالج' : 'Processed'}</p>
                </div>
              </div>

              {/* Error Details */}
              {selectedOperation.errors && selectedOperation.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      {isRTL ? 'الأخطاء' : 'Errors'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOperation.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {isRTL ? `السطر ${error.row}` : `Row ${error.row}`}: {error.field}
                              </p>
                              <p className="text-sm text-red-600">{error.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timing Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'معلومات التوقيت' : 'Timing Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'وقت البدء' : 'Start Time'}</p>
                      <p className="font-medium">{formatDate(selectedOperation.startTime)}</p>
                    </div>
                    {selectedOperation.completionTime && (
                      <div>
                        <p className="text-sm text-gray-600">{isRTL ? 'وقت الانتهاء' : 'Completion Time'}</p>
                        <p className="font-medium">{formatDate(selectedOperation.completionTime)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'نُفذت بواسطة' : 'Performed By'}</p>
                      <p className="font-medium">{selectedOperation.performedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'الوصف' : 'Description'}</p>
                      <p className="font-medium">{selectedOperation.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Template Details Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? selectedTemplate.nameAr : selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <p className="text-gray-600">
                {isRTL ? selectedTemplate.descriptionAr : selectedTemplate.description}
              </p>

              {/* Field Definitions */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'تعريف الحقول' : 'Field Definitions'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{isRTL ? 'اسم الحقل' : 'Field Name'}</TableHead>
                        <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                        <TableHead>{isRTL ? 'مطلوب' : 'Required'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTemplate.fields.map((field, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{isRTL ? field.nameAr : field.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{field.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {field.required ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Sample Data */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'بيانات نموذجية' : 'Sample Data'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {selectedTemplate.fields.map((field, index) => (
                            <TableHead key={index}>{isRTL ? field.nameAr : field.name}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTemplate.sampleData.map((row, index) => (
                          <TableRow key={index}>
                            {selectedTemplate.fields.map((field, fieldIndex) => (
                              <TableCell key={fieldIndex}>
                                {row[field.name]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={() => downloadTemplate(selectedTemplate)}>
                  <Download className="w-4 h-4 mr-2" />
                  {isRTL ? 'تحميل القالب' : 'Download Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default BulkOperationsPage