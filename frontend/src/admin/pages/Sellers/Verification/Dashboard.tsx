import React, { useState } from 'react'
import { Search, Filter, Eye, Check, X, Download, Upload, Clock, AlertTriangle, FileText, Building2, CreditCard, Landmark } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
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
import { Badge } from '@/shared/components/ui/badge'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface KYCDocument {
  id: string
  sellerId: string
  sellerName: string
  sellerNameAr: string
  businessName: string
  businessNameAr: string
  documentType: 'national_id' | 'iqama' | 'commercial_registration' | 'vat_certificate' | 'sama_license' | 'municipal_license' | 'zakat_certificate' | 'bank_verification'
  documentNumber: string
  documentUrl: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  priority: 'high' | 'medium' | 'low'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes: string
  autoVerified: boolean
  complianceScore: number
  expiryDate?: string
  businessCategory: string
  businessCategoryAr: string
  phone: string
  email: string
  region: string
}

const mockKYCQueue: KYCDocument[] = [
  {
    id: '1',
    sellerId: 'seller-001',
    sellerName: 'Ahmed Al-Rashid Trading Company',
    sellerNameAr: 'شركة أحمد الراشد التجارية',
    businessName: 'Al-Rashid Dates Export',
    businessNameAr: 'الراشد لتصدير التمور',
    documentType: 'commercial_registration',
    documentNumber: 'CR-1010567890',
    documentUrl: '/documents/cr_1010567890.pdf',
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-20T09:30:00Z',
    notes: '',
    autoVerified: false,
    complianceScore: 85,
    expiryDate: '2025-12-31',
    businessCategory: 'Food & Agriculture',
    businessCategoryAr: 'الغذاء والزراعة',
    phone: '+966501234567',
    email: 'ahmed@alrashid-dates.com',
    region: 'الرياض'
  },
  {
    id: '2',
    sellerId: 'seller-002',
    sellerName: 'Fatima Al-Zahra Fashion',
    sellerNameAr: 'فاطمة الزهراء للأزياء',
    businessName: 'Modern Abaya Collection',
    businessNameAr: 'مجموعة العباية العصرية',
    documentType: 'vat_certificate',
    documentNumber: 'VAT-300567891234',
    documentUrl: '/documents/vat_300567891234.pdf',
    status: 'under_review',
    priority: 'medium',
    submittedAt: '2024-01-19T14:15:00Z',
    reviewedAt: '2024-01-20T10:00:00Z',
    reviewedBy: 'Admin User',
    notes: 'VAT registration looks valid, checking with ZATCA system',
    autoVerified: false,
    complianceScore: 92,
    expiryDate: '2025-03-15',
    businessCategory: 'Fashion & Clothing',
    businessCategoryAr: 'الأزياء والملابس',
    phone: '+966502345678',
    email: 'fatima@modernabaya.sa',
    region: 'جدة'
  },
  {
    id: '3',
    sellerId: 'seller-003',
    sellerName: 'Mohammed Investment Holdings',
    sellerNameAr: 'محمد القابضة للاستثمار',
    businessName: 'Golden Oud Perfumes',
    businessNameAr: 'عطور العود الذهبي',
    documentType: 'sama_license',
    documentNumber: 'SAMA-FL-789456123',
    documentUrl: '/documents/sama_fl_789456123.pdf',
    status: 'approved',
    priority: 'high',
    submittedAt: '2024-01-18T11:45:00Z',
    reviewedAt: '2024-01-19T16:30:00Z',
    reviewedBy: 'Senior Admin',
    notes: 'SAMA license verified successfully. All compliance requirements met.',
    autoVerified: true,
    complianceScore: 98,
    expiryDate: '2026-06-30',
    businessCategory: 'Beauty & Personal Care',
    businessCategoryAr: 'الجمال والعناية الشخصية',
    phone: '+966503456789',
    email: 'mohammed@goldenoud.sa',
    region: 'الدمام'
  },
  {
    id: '4',
    sellerId: 'seller-004',
    sellerName: 'Sarah Tech Solutions',
    sellerNameAr: 'سارة للحلول التقنية',
    businessName: 'Digital Innovation Hub',
    businessNameAr: 'مركز الابتكار الرقمي',
    documentType: 'national_id',
    documentNumber: '1234567890',
    documentUrl: '/documents/national_id_1234567890.pdf',
    status: 'rejected',
    priority: 'low',
    submittedAt: '2024-01-17T08:20:00Z',
    reviewedAt: '2024-01-18T13:45:00Z',
    reviewedBy: 'Compliance Officer',
    notes: 'National ID image quality is poor. Please upload a clearer scan.',
    autoVerified: false,
    complianceScore: 45,
    expiryDate: '2030-05-20',
    businessCategory: 'Technology',
    businessCategoryAr: 'التكنولوجيا',
    phone: '+966504567890',
    email: 'sarah@digitalhub.sa',
    region: 'المدينة المنورة'
  }
]

const getDocumentTypeInfo = (type: string) => {
  const types = {
    'national_id': { name: 'الهوية الوطنية', nameEn: 'National ID', icon: <CreditCard className="w-4 h-4" />, color: 'blue' },
    'iqama': { name: 'الإقامة', nameEn: 'Iqama', icon: <CreditCard className="w-4 h-4" />, color: 'purple' },
    'commercial_registration': { name: 'السجل التجاري', nameEn: 'Commercial Registration', icon: <Building2 className="w-4 h-4" />, color: 'green' },
    'vat_certificate': { name: 'شهادة ضريبة القيمة المضافة', nameEn: 'VAT Certificate', icon: <FileText className="w-4 h-4" />, color: 'orange' },
    'sama_license': { name: 'ترخيص ساما', nameEn: 'SAMA License', icon: <Landmark className="w-4 h-4" />, color: 'indigo' },
    'municipal_license': { name: 'الرخصة البلدية', nameEn: 'Municipal License', icon: <Building2 className="w-4 h-4" />, color: 'teal' },
    'zakat_certificate': { name: 'شهادة الزكاة', nameEn: 'Zakat Certificate', icon: <FileText className="w-4 h-4" />, color: 'emerald' },
    'bank_verification': { name: 'تحقق الحساب البنكي', nameEn: 'Bank Verification', icon: <Landmark className="w-4 h-4" />, color: 'cyan' }
  }
  return types[type as keyof typeof types] || { name: type, nameEn: type, icon: <FileText className="w-4 h-4" />, color: 'gray' }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد الانتظار</Badge>
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">موافق عليه</Badge>
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مرفوض</Badge>
    case 'under_review':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">قيد المراجعة</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">عالية</Badge>
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">متوسطة</Badge>
    case 'low':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">منخفضة</Badge>
    default:
      return <Badge>{priority}</Badge>
  }
}

const getComplianceScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function VerificationPage() {
  const [documents, setDocuments] = useState<KYCDocument[]>(mockKYCQueue)
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('all')
  const [reviewNotes, setReviewNotes] = useState('')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.sellerNameAr.includes(searchTerm) ||
                         doc.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.businessNameAr.includes(searchTerm) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    const matchesType = selectedDocumentType === 'all' || doc.documentType === selectedDocumentType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleApprove = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId 
        ? { 
            ...doc, 
            status: 'approved' as const, 
            reviewedBy: 'Current Admin',
            reviewedAt: new Date().toISOString(),
            notes: reviewNotes || 'تم الموافقة على الوثيقة'
          }
        : doc
    ))
    setSelectedDocument(null)
    setReviewNotes('')
  }

  const handleReject = (docId: string) => {
    if (!reviewNotes.trim()) {
      alert('يرجى إضافة ملاحظات الرفض')
      return
    }
    setDocuments(documents.map(doc => 
      doc.id === docId 
        ? { 
            ...doc, 
            status: 'rejected' as const, 
            reviewedBy: 'Current Admin',
            reviewedAt: new Date().toISOString(),
            notes: reviewNotes
          }
        : doc
    ))
    setSelectedDocument(null)
    setReviewNotes('')
  }

  const pendingCount = documents.filter(doc => doc.status === 'pending').length
  const approvedCount = documents.filter(doc => doc.status === 'approved').length
  const rejectedCount = documents.filter(doc => doc.status === 'rejected').length
  const underReviewCount = documents.filter(doc => doc.status === 'under_review').length

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التحقق من الهوية (KYC)</h1>
          <p className="text-gray-600">مراجعة والتحقق من وثائق البائعين السعوديين</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="w-4 h-4 ml-2" />
          رفع وثيقة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              <p className="text-xs text-yellow-600">يحتاج مراجعة</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">موافق عليها</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              <p className="text-xs text-green-600">وثائق مصدقة</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مرفوضة</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              <p className="text-xs text-red-600">تحتاج إعادة تقديم</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
              <p className="text-2xl font-bold text-gray-900">{underReviewCount}</p>
              <p className="text-xs text-blue-600">تحت التدقيق</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في الوثائق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="approved">موافق عليها</SelectItem>
              <SelectItem value="rejected">مرفوضة</SelectItem>
              <SelectItem value="under_review">قيد المراجعة</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="جميع الوثائق" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الوثائق</SelectItem>
              <SelectItem value="national_id">الهوية الوطنية</SelectItem>
              <SelectItem value="iqama">الإقامة</SelectItem>
              <SelectItem value="commercial_registration">السجل التجاري</SelectItem>
              <SelectItem value="vat_certificate">شهادة الضريبة</SelectItem>
              <SelectItem value="sama_license">ترخيص ساما</SelectItem>
              <SelectItem value="municipal_license">الرخصة البلدية</SelectItem>
              <SelectItem value="zakat_certificate">شهادة الزكاة</SelectItem>
              <SelectItem value="bank_verification">تحقق بنكي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">البائع</TableHead>
              <TableHead className="text-right">نوع الوثيقة</TableHead>
              <TableHead className="text-right">رقم الوثيقة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الأولوية</TableHead>
              <TableHead className="text-right">نقاط الامتثال</TableHead>
              <TableHead className="text-right">تاريخ التقديم</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => {
              const docInfo = getDocumentTypeInfo(doc.documentType)
              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{doc.sellerNameAr}</p>
                      <p className="text-sm text-gray-500">{doc.businessNameAr}</p>
                      <p className="text-xs text-gray-400">{doc.region}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-${docInfo.color}-100 rounded-lg flex items-center justify-center`}>
                        {docInfo.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{docInfo.name}</p>
                        <p className="text-xs text-gray-500">{docInfo.nameEn}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {doc.documentNumber}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>{getPriorityBadge(doc.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`font-bold ${getComplianceScoreColor(doc.complianceScore)}`}>
                        {doc.complianceScore}%
                      </div>
                      {doc.autoVerified && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
                          تحقق تلقائي
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatDate(doc.submittedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl" dir="rtl">
                          <DialogHeader>
                            <DialogTitle>مراجعة وثيقة التحقق</DialogTitle>
                          </DialogHeader>
                          {selectedDocument && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">البائع</label>
                                    <p className="font-semibold">{selectedDocument.sellerNameAr}</p>
                                    <p className="text-sm text-gray-500">{selectedDocument.sellerName}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">اسم التجارة</label>
                                    <p className="font-semibold">{selectedDocument.businessNameAr}</p>
                                    <p className="text-sm text-gray-500">{selectedDocument.businessName}</p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">نوع الوثيقة</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      {getDocumentTypeInfo(selectedDocument.documentType).icon}
                                      <span className="font-medium">
                                        {getDocumentTypeInfo(selectedDocument.documentType).name}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">رقم الوثيقة</label>
                                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                                      {selectedDocument.documentNumber}
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">تاريخ الانتهاء</label>
                                    <p className="text-sm">
                                      {selectedDocument.expiryDate ? 
                                        formatDate(selectedDocument.expiryDate) : 
                                        'غير محدد'
                                      }
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">فئة النشاط التجاري</label>
                                    <p className="font-medium">{selectedDocument.businessCategoryAr}</p>
                                    <p className="text-sm text-gray-500">{selectedDocument.businessCategory}</p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">معلومات الاتصال</label>
                                    <p className="text-sm">{selectedDocument.phone}</p>
                                    <p className="text-sm">{selectedDocument.email}</p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">نقاط الامتثال</label>
                                    <div className="flex items-center gap-2">
                                      <div className={`text-xl font-bold ${getComplianceScoreColor(selectedDocument.complianceScore)}`}>
                                        {selectedDocument.complianceScore}%
                                      </div>
                                      {selectedDocument.autoVerified && (
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                          تحقق تلقائي
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-gray-600">الحالة الحالية</label>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedDocument.status)}
                                    </div>
                                  </div>

                                  {selectedDocument.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">الملاحظات السابقة</label>
                                      <p className="text-sm bg-gray-50 p-3 rounded">
                                        {selectedDocument.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <div className="mb-4">
                                  <Button 
                                    variant="outline" 
                                    className="mb-4"
                                    onClick={() => window.open(selectedDocument.documentUrl, '_blank')}
                                  >
                                    <Download className="w-4 h-4 ml-2" />
                                    تحميل الوثيقة
                                  </Button>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">ملاحظات المراجعة</label>
                                    <Textarea
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      placeholder="أضف ملاحظاتك حول الوثيقة..."
                                      className="text-right"
                                      rows={4}
                                    />
                                  </div>

                                  <div className="flex justify-end gap-3">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedDocument(null)
                                        setReviewNotes('')
                                      }}
                                    >
                                      إلغاء
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleReject(selectedDocument.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      <X className="w-4 h-4 ml-2" />
                                      رفض
                                    </Button>
                                    <Button
                                      onClick={() => handleApprove(selectedDocument.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="w-4 h-4 ml-2" />
                                      موافقة
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.documentUrl, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              عرض 1 إلى {filteredDocuments.length} من أصل {documents.length} وثيقة
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                السابق
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                التالي
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}