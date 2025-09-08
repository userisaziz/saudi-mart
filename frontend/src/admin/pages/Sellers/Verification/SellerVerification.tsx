import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Download, 
  Upload, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Building2, 
  CreditCard, 
  Landmark,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
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
  DialogDescription,
  DialogFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Progress } from '@/shared/components/ui/progress'

interface SaudiKYCDocument {
  id: string
  sellerId: string
  sellerName: string
  businessName: string
  documentType: 'national_id' | 'iqama' | 'commercial_registration' | 'vat_certificate' | 'sama_license' | 'municipal_license' | 'zakat_certificate' | 'bank_verification' | 'maroof_certificate' | 'saber_certificate'
  documentNumber: string
  documentUrl: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'expired' | 'resubmission_required'
  priority: 'critical' | 'high' | 'medium' | 'low'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes: string
  autoVerified: boolean
  complianceScore: number
  expiryDate?: string
  businessCategory: string
  phone: string
  email: string
  region: string
  // Saudi-specific fields
  saudiComplianceLevel: 'basic' | 'standard' | 'premium' | 'gold'
  zatcaVerified: boolean
  saberCompliant: boolean
  maroofCertified: boolean
  samaRegulated: boolean
  municipalityApproved: boolean
  zakatPaid: boolean
  gccCitizen: boolean
  businessLicenseNumber?: string
  establishmentCard?: string
  iban?: string
}

const saudiRegions = [
  'Riyadh', 'Makkah', 'Eastern Province', 'Asir', 'Jazan', 'Madinah', 
  'Qassim', 'Tabuk', 'Ha\'il', 'Northern Borders', 'Najran', 'Al Bahah', 'Al Jawf'
]

const mockSaudiKYCQueue: SaudiKYCDocument[] = [
  {
    id: '1',
    sellerId: 'seller-001',
    sellerName: 'Ahmed Al-Rashid Trading Company',
    businessName: 'Al-Rashid Dates Export',
    documentType: 'commercial_registration',
    documentNumber: 'CR-1010567890',
    documentUrl: '/documents/cr_1010567890.pdf',
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-20T09:30:00Z',
    notes: 'Initial submission for commercial registration verification',
    autoVerified: false,
    complianceScore: 85,
    expiryDate: '2025-12-31',
    businessCategory: 'Food & Agriculture',
    phone: '+966501234567',
    email: 'ahmed@alrashid-dates.com',
    region: 'Riyadh',
    saudiComplianceLevel: 'standard',
    zatcaVerified: true,
    saberCompliant: false,
    maroofCertified: true,
    samaRegulated: false,
    municipalityApproved: true,
    zakatPaid: true,
    gccCitizen: true,
    businessLicenseNumber: 'BL-2024-001234',
    establishmentCard: 'EC-789012',
    iban: 'SA0380000000608010167519'
  },
  {
    id: '2',
    sellerId: 'seller-002',
    sellerName: 'Fatima Al-Zahra Fashion',
    businessName: 'Modern Abaya Collection',
    documentType: 'vat_certificate',
    documentNumber: 'VAT-300567891234',
    documentUrl: '/documents/vat_300567891234.pdf',
    status: 'under_review',
    priority: 'medium',
    submittedAt: '2024-01-19T14:15:00Z',
    reviewedAt: '2024-01-20T10:00:00Z',
    reviewedBy: 'Admin User',
    notes: 'VAT registration verified with ZATCA system. Awaiting final approval.',
    autoVerified: false,
    complianceScore: 92,
    expiryDate: '2025-03-15',
    businessCategory: 'Fashion & Clothing',
    phone: '+966502345678',
    email: 'fatima@modern-abaya.com',
    region: 'Jeddah',
    saudiComplianceLevel: 'premium',
    zatcaVerified: true,
    saberCompliant: true,
    maroofCertified: false,
    samaRegulated: false,
    municipalityApproved: true,
    zakatPaid: true,
    gccCitizen: false,
    businessLicenseNumber: 'BL-2024-002345',
    iban: 'SA4420000000701234567890'
  },
  {
    id: '3',
    sellerId: 'seller-003',
    sellerName: 'Mohammed Investment Holding',
    businessName: 'Golden Oud Perfumes',
    documentType: 'municipal_license',
    documentNumber: 'ML-RUH-789456',
    documentUrl: '/documents/ml_ruh_789456.pdf',
    status: 'approved',
    priority: 'medium',
    submittedAt: '2024-01-18T11:20:00Z',
    reviewedAt: '2024-01-19T15:30:00Z',
    reviewedBy: 'Senior Admin',
    notes: 'Municipal license approved. All requirements met for perfume retail business.',
    autoVerified: true,
    complianceScore: 96,
    expiryDate: '2025-06-30',
    businessCategory: 'Beauty & Personal Care',
    phone: '+966503456789',
    email: 'mohammed@golden-oud.com',
    region: 'Dammam',
    saudiComplianceLevel: 'gold',
    zatcaVerified: true,
    saberCompliant: true,
    maroofCertified: true,
    samaRegulated: false,
    municipalityApproved: true,
    zakatPaid: true,
    gccCitizen: true,
    businessLicenseNumber: 'BL-2024-003456',
    establishmentCard: 'EC-456789',
    iban: 'SA6745000000123456789012'
  }
]

const documentTypes = {
  'national_id': { 
    name: 'National ID', 
    icon: <CreditCard className="w-4 h-4" />, 
    color: 'blue',
    required: true,
    description: 'Saudi National Identity Card for GCC citizens'
  },
  'iqama': { 
    name: 'Iqama (Residence Permit)', 
    icon: <CreditCard className="w-4 h-4" />, 
    color: 'purple',
    required: true,
    description: 'Residence permit for non-Saudi nationals'
  },
  'commercial_registration': { 
    name: 'Commercial Registration', 
    icon: <Building2 className="w-4 h-4" />, 
    color: 'green',
    required: true,
    description: 'Ministry of Commerce commercial registration certificate'
  },
  'vat_certificate': { 
    name: 'VAT Certificate', 
    icon: <FileText className="w-4 h-4" />, 
    color: 'orange',
    required: false,
    description: 'ZATCA VAT registration certificate (required for sales >375,000 SAR)'
  },
  'zakat_certificate': { 
    name: 'Zakat Certificate', 
    icon: <Landmark className="w-4 h-4" />, 
    color: 'emerald',
    required: true,
    description: 'ZATCA Zakat clearance certificate'
  },
  'municipal_license': { 
    name: 'Municipal License', 
    icon: <Building2 className="w-4 h-4" />, 
    color: 'cyan',
    required: true,
    description: 'Local municipality business operation license'
  },
  'sama_license': { 
    name: 'SAMA License', 
    icon: <Landmark className="w-4 h-4" />, 
    color: 'red',
    required: false,
    description: 'Saudi Arabian Monetary Authority license (for financial services)'
  },
  'maroof_certificate': { 
    name: 'Maroof Certificate', 
    icon: <Shield className="w-4 h-4" />, 
    color: 'indigo',
    required: false,
    description: 'Ministry of Commerce e-commerce certification'
  },
  'saber_certificate': { 
    name: 'SABER Certificate', 
    icon: <CheckCircle className="w-4 h-4" />, 
    color: 'teal',
    required: false,
    description: 'SASO product conformity certificate'
  },
  'bank_verification': { 
    name: 'Bank Account Verification', 
    icon: <Landmark className="w-4 h-4" />, 
    color: 'gray',
    required: true,
    description: 'Saudi bank account verification and IBAN confirmation'
  }
}

const complianceLevels = {
  'basic': { name: 'Basic', color: 'bg-gray-100 text-gray-800', score: '0-60' },
  'standard': { name: 'Standard', color: 'bg-blue-100 text-blue-800', score: '61-80' },
  'premium': { name: 'Premium', color: 'bg-purple-100 text-purple-800', score: '81-95' },
  'gold': { name: 'Gold', color: 'bg-yellow-100 text-yellow-800', score: '96-100' }
}

export default function SaudiVerificationDashboard() {
  const [documents, setDocuments] = useState<SaudiKYCDocument[]>(mockSaudiKYCQueue)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<SaudiKYCDocument | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesType = documentTypeFilter === 'all' || doc.documentType === documentTypeFilter
    const matchesRegion = regionFilter === 'all' || doc.region === regionFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesRegion
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'Pending Review', variant: 'secondary' as const, icon: Clock },
      'under_review': { label: 'Under Review', variant: 'default' as const, icon: Eye },
      'approved': { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
      'rejected': { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
      'expired': { label: 'Expired', variant: 'destructive' as const, icon: AlertCircle },
      'resubmission_required': { label: 'Resubmission Required', variant: 'secondary' as const, icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    }
    
    return (
      <Badge className={priorityConfig[priority as keyof typeof priorityConfig]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const handleApprove = async (docId: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'Current Admin' }
        : doc
    ))
  }

  const handleReject = async (docId: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: 'Current Admin', notes: reviewNotes }
        : doc
    ))
    setIsReviewDialogOpen(false)
    setReviewNotes('')
  }

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    underReview: documents.filter(d => d.status === 'under_review').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    avgComplianceScore: Math.round(documents.reduce((acc, doc) => acc + doc.complianceScore, 0) / documents.length),
    zatcaVerified: documents.filter(d => d.zatcaVerified).length,
    saberCompliant: documents.filter(d => d.saberCompliant).length
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saudi Verification Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage KYC documents and business verification according to Saudi regulations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ZATCA Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.zatcaVerified}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold">{stats.avgComplianceScore}%</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by business name, seller name, or document number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                {Object.entries(documentTypes).map(([key, type]) => (
                  <SelectItem key={key} value={key}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {saudiRegions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Queue ({filteredDocuments.length})</CardTitle>
          <CardDescription>
            Showing {filteredDocuments.length} documents for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Details</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Saudi Certifications</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{doc.businessName}</div>
                      <div className="text-sm text-gray-500">{doc.sellerName}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {doc.region}
                        {doc.gccCitizen && <Badge variant="outline" className="text-xs">GCC Citizen</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {documentTypes[doc.documentType].icon}
                      <div>
                        <div className="font-medium text-sm">{documentTypes[doc.documentType].name}</div>
                        <div className="text-xs text-gray-500">{doc.documentNumber}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  
                  <TableCell>{getPriorityBadge(doc.priority)}</TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Progress value={doc.complianceScore} className="w-16 h-2" />
                        <span className="text-sm font-medium">{doc.complianceScore}%</span>
                      </div>
                      <Badge className={complianceLevels[doc.saudiComplianceLevel].color}>
                        {complianceLevels[doc.saudiComplianceLevel].name}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {doc.zatcaVerified && <Badge variant="outline" className="text-xs">ZATCA</Badge>}
                      {doc.saberCompliant && <Badge variant="outline" className="text-xs">SABER</Badge>}
                      {doc.maroofCertified && <Badge variant="outline" className="text-xs">Maroof</Badge>}
                      {doc.municipalityApproved && <Badge variant="outline" className="text-xs">Municipal</Badge>}
                      {doc.zakatPaid && <Badge variant="outline" className="text-xs">Zakat</Badge>}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(doc.submittedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Document Review - {doc.businessName}</DialogTitle>
                            <DialogDescription>
                              Review and verify Saudi business documentation
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedDocument && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList>
                                <TabsTrigger value="details">Business Details</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="compliance">Saudi Compliance</TabsTrigger>
                                <TabsTrigger value="verification">Verification</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-2">Business Information</h3>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Business Name:</strong> {selectedDocument.businessName}</p>
                                      <p><strong>Owner:</strong> {selectedDocument.sellerName}</p>
                                      <p><strong>Category:</strong> {selectedDocument.businessCategory}</p>
                                      <p><strong>Region:</strong> {selectedDocument.region}</p>
                                      <p><strong>GCC Citizen:</strong> {selectedDocument.gccCitizen ? 'Yes' : 'No'}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-semibold mb-2">Contact Information</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {selectedDocument.phone}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {selectedDocument.email}
                                      </div>
                                      {selectedDocument.iban && (
                                        <p><strong>IBAN:</strong> {selectedDocument.iban}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="documents" className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        {documentTypes[selectedDocument.documentType].icon}
                                        <span className="font-medium">{documentTypes[selectedDocument.documentType].name}</span>
                                      </div>
                                      <Badge variant="outline">{selectedDocument.documentNumber}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {documentTypes[selectedDocument.documentType].description}
                                    </p>
                                    {selectedDocument.expiryDate && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        <span>Expires: {new Date(selectedDocument.expiryDate).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    <Button variant="outline" size="sm" className="mt-2">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Document
                                    </Button>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="compliance" className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="font-semibold mb-4">Saudi Regulatory Compliance</h3>
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span>ZATCA Registration</span>
                                        {selectedDocument.zatcaVerified ? 
                                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                          <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>SABER Compliance</span>
                                        {selectedDocument.saberCompliant ? 
                                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                          <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Maroof Certified</span>
                                        {selectedDocument.maroofCertified ? 
                                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                          <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Municipality Approved</span>
                                        {selectedDocument.municipalityApproved ? 
                                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                          <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Zakat Compliance</span>
                                        {selectedDocument.zakatPaid ? 
                                          <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                          <XCircle className="h-5 w-5 text-red-500" />
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="font-semibold mb-4">Compliance Score</h3>
                                    <div className="text-center">
                                      <div className="text-4xl font-bold text-blue-600 mb-2">
                                        {selectedDocument.complianceScore}%
                                      </div>
                                      <Progress value={selectedDocument.complianceScore} className="w-full h-3 mb-2" />
                                      <Badge className={complianceLevels[selectedDocument.saudiComplianceLevel].color}>
                                        {complianceLevels[selectedDocument.saudiComplianceLevel].name} Level
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="verification" className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Verification Status</h3>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span>Status:</span>
                                      {getStatusBadge(selectedDocument.status)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>Priority:</span>
                                      {getPriorityBadge(selectedDocument.priority)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>Auto-Verified:</span>
                                      {selectedDocument.autoVerified ? 'Yes' : 'No'}
                                    </div>
                                    {selectedDocument.reviewedBy && (
                                      <div>
                                        <p><strong>Reviewed by:</strong> {selectedDocument.reviewedBy}</p>
                                        <p><strong>Review Date:</strong> {new Date(selectedDocument.reviewedAt!).toLocaleString()}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {selectedDocument.notes && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Review Notes</h3>
                                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                      {selectedDocument.notes}
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {doc.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(doc.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          
                          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Document</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this document
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Enter rejection reason..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                              />
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => selectedDocument && handleReject(selectedDocument.id)}
                                >
                                  Reject Document
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}