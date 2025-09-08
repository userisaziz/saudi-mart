import React, { useState } from 'react'
import { Search, Filter, Eye, Check, X, Download, Upload, Clock, AlertTriangle, FileText, Building2, CreditCard, Landmark, Shield, MapPin, Calendar, Star } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

// Saudi-specific document types and verification requirements
interface SaudiVerificationDocument {
  id: string
  sellerId: string
  sellerName: string
  businessNameEn: string
  businessNameAr: string
  documentType: 'national_id' | 'iqama' | 'commercial_registration' | 'vat_certificate' | 'sama_license' | 'municipal_license' | 'zakat_certificate' | 'bank_verification' | 'saber_certificate' | 'sfda_license' | 'scta_permit'
  documentNumber: string
  documentUrl: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'expired'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes: string
  autoVerified: boolean
  complianceScore: number
  expiryDate?: string
  businessCategory: 'retail' | 'wholesale' | 'manufacturing' | 'services' | 'technology' | 'healthcare' | 'food_beverage' | 'automotive' | 'construction'
  region: 'riyadh' | 'makkah' | 'madinah' | 'eastern' | 'asir' | 'tabuk' | 'hail' | 'northern_borders' | 'jazan' | 'najran' | 'al_bahah' | 'al_jouf' | 'qassim'
  verificationLevel: 'basic' | 'enhanced' | 'premium'
}

const saudiDocumentTypes = {
  national_id: 'Saudi National ID',
  iqama: 'Iqama (Residency Permit)',
  commercial_registration: 'Commercial Registration',
  vat_certificate: 'VAT Registration Certificate',
  sama_license: 'SAMA Banking License',
  municipal_license: 'Municipal License',
  zakat_certificate: 'Zakat Certificate',
  bank_verification: 'Bank Account Verification',
  saber_certificate: 'SABER Product Certificate',
  sfda_license: 'SFDA License (Food & Drugs)',
  scta_permit: 'SCTA Tourism Permit'
}

const saudiRegions = {
  riyadh: 'Riyadh Region',
  makkah: 'Makkah Region',
  madinah: 'Madinah Region',
  eastern: 'Eastern Province',
  asir: 'Asir Region',
  tabuk: 'Tabuk Region',
  hail: 'Hail Region',
  northern_borders: 'Northern Borders',
  jazan: 'Jazan Region',
  najran: 'Najran Region',
  al_bahah: 'Al Bahah Region',
  al_jouf: 'Al Jouf Region',
  qassim: 'Qassim Region'
}

const SaudiVerification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<SaudiVerificationDocument | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  // Mock data for demonstration
  const mockDocuments: SaudiVerificationDocument[] = [
    {
      id: '1',
      sellerId: 'S001',
      sellerName: 'Ahmed Al-Rashid Trading Est.',
      businessNameEn: 'Al-Rashid Electronics Store',
      businessNameAr: 'متجر الراشد للإلكترونيات',
      documentType: 'commercial_registration',
      documentNumber: '1010123456',
      documentUrl: '/documents/cr_1010123456.pdf',
      status: 'pending',
      priority: 'high',
      submittedAt: '2024-01-15T10:30:00Z',
      notes: '',
      autoVerified: false,
      complianceScore: 85,
      expiryDate: '2025-12-31',
      businessCategory: 'retail',
      region: 'riyadh',
      verificationLevel: 'enhanced'
    },
    {
      id: '2',
      sellerId: 'S002',
      sellerName: 'Madinah Food Industries',
      businessNameEn: 'Fresh Valley Food Co.',
      businessNameAr: 'شركة وادي الطازج للأغذية',
      documentType: 'sfda_license',
      documentNumber: 'SFDA-2024-001234',
      documentUrl: '/documents/sfda_001234.pdf',
      status: 'under_review',
      priority: 'urgent',
      submittedAt: '2024-01-16T09:15:00Z',
      reviewedBy: 'Sarah Al-Mahmoud',
      notes: 'Requires additional food safety documentation',
      autoVerified: false,
      complianceScore: 92,
      expiryDate: '2024-06-30',
      businessCategory: 'food_beverage',
      region: 'madinah',
      verificationLevel: 'premium'
    },
    {
      id: '3',
      sellerId: 'S003',
      sellerName: 'Eastern Tech Solutions',
      businessNameEn: 'Digital Innovation Hub',
      businessNameAr: 'مركز الابتكار الرقمي',
      documentType: 'vat_certificate',
      documentNumber: '300123456700003',
      documentUrl: '/documents/vat_300123456700003.pdf',
      status: 'approved',
      priority: 'medium',
      submittedAt: '2024-01-14T14:20:00Z',
      reviewedAt: '2024-01-15T11:45:00Z',
      reviewedBy: 'Mohammed Al-Otaibi',
      notes: 'All requirements met, approved for technology services',
      autoVerified: true,
      complianceScore: 96,
      expiryDate: '2025-03-31',
      businessCategory: 'technology',
      region: 'eastern',
      verificationLevel: 'enhanced'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleApprove = (documentId: string) => {
    console.log('Approving document:', documentId)
  }

  const handleReject = (documentId: string) => {
    console.log('Rejecting document:', documentId)
  }

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.businessNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || doc.priority === priorityFilter
    const matchesRegion = regionFilter === 'all' || doc.region === regionFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesRegion
  })

  const stats = {
    total: mockDocuments.length,
    pending: mockDocuments.filter(d => d.status === 'pending').length,
    approved: mockDocuments.filter(d => d.status === 'approved').length,
    underReview: mockDocuments.filter(d => d.status === 'under_review').length,
    rejected: mockDocuments.filter(d => d.status === 'rejected').length,
    avgComplianceScore: Math.round(mockDocuments.reduce((acc, d) => acc + d.complianceScore, 0) / mockDocuments.length)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saudi Business Verification Center</h1>
          <p className="text-gray-600 mt-1">Compliance verification for Saudi Arabian business entities</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
              </div>
              <Eye className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Compliance</p>
                <p className={`text-2xl font-bold ${getComplianceScoreColor(stats.avgComplianceScore)}`}>
                  {stats.avgComplianceScore}%
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by business name or document number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Object.entries(saudiRegions).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Business Verification Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Information</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{doc.businessNameEn}</div>
                      <div className="text-sm text-gray-500">{doc.sellerName}</div>
                      <div className="text-xs text-gray-400">ID: {doc.documentNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        {doc.documentType === 'commercial_registration' && <Building2 className="w-4 h-4 text-blue-600" />}
                        {doc.documentType === 'vat_certificate' && <CreditCard className="w-4 h-4 text-blue-600" />}
                        {doc.documentType === 'sama_license' && <Landmark className="w-4 h-4 text-blue-600" />}
                        {doc.documentType === 'sfda_license' && <Shield className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {saudiDocumentTypes[doc.documentType] || doc.documentType}
                        </div>
                        <div className="text-xs text-gray-500">
                          Level: {doc.verificationLevel}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm">{saudiRegions[doc.region]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(doc.priority)}>
                      {doc.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`font-medium ${getComplianceScoreColor(doc.complianceScore)}`}>
                        {doc.complianceScore}%
                      </span>
                      {doc.autoVerified && (
                        <Shield className="w-4 h-4 ml-2 text-green-500" title="Auto-verified" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(doc.submittedAt).toLocaleDateString('en-SA')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Document Review - {selectedDocument?.businessNameEn}</DialogTitle>
                          </DialogHeader>
                          {selectedDocument && (
                            <div className="space-y-6">
                              <Tabs defaultValue="details">
                                <TabsList>
                                  <TabsTrigger value="details">Business Details</TabsTrigger>
                                  <TabsTrigger value="documents">Documents</TabsTrigger>
                                  <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
                                  <TabsTrigger value="history">Review History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Business Name (English)</label>
                                      <p className="text-sm text-gray-900 mt-1">{selectedDocument.businessNameEn}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Business Name (Arabic)</label>
                                      <p className="text-sm text-gray-900 mt-1 font-arabic">{selectedDocument.businessNameAr}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Document Number</label>
                                      <p className="text-sm text-gray-900 mt-1">{selectedDocument.documentNumber}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Business Category</label>
                                      <p className="text-sm text-gray-900 mt-1 capitalize">{selectedDocument.businessCategory.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Region</label>
                                      <p className="text-sm text-gray-900 mt-1">{saudiRegions[selectedDocument.region]}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Verification Level</label>
                                      <p className="text-sm text-gray-900 mt-1 capitalize">{selectedDocument.verificationLevel}</p>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="documents">
                                  <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Document Preview</h4>
                                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                                      <div className="text-center">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">Document preview would appear here</p>
                                        <p className="text-sm text-gray-500">{selectedDocument.documentUrl}</p>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="compliance">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Compliance Score</label>
                                        <div className="flex items-center mt-1">
                                          <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                                            <div 
                                              className="bg-blue-600 h-2 rounded-full" 
                                              style={{ width: `${selectedDocument.complianceScore}%` }}
                                            ></div>
                                          </div>
                                          <span className="text-sm font-medium">{selectedDocument.complianceScore}%</span>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Auto-Verified</label>
                                        <p className="text-sm mt-1">
                                          {selectedDocument.autoVerified ? (
                                            <span className="text-green-600">✓ Passed automated checks</span>
                                          ) : (
                                            <span className="text-yellow-600">⚠ Manual review required</span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    {selectedDocument.expiryDate && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                                        <p className="text-sm text-gray-900 mt-1">{new Date(selectedDocument.expiryDate).toLocaleDateString('en-SA')}</p>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                                <TabsContent value="history">
                                  <div className="space-y-3">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                      <p className="text-sm font-medium">Document Submitted</p>
                                      <p className="text-xs text-gray-500">{new Date(selectedDocument.submittedAt).toLocaleString('en-SA')}</p>
                                    </div>
                                    {selectedDocument.reviewedAt && (
                                      <div className="border-l-4 border-green-500 pl-4">
                                        <p className="text-sm font-medium">Review Completed by {selectedDocument.reviewedBy}</p>
                                        <p className="text-xs text-gray-500">{new Date(selectedDocument.reviewedAt).toLocaleString('en-SA')}</p>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                              
                              <div className="border-t pt-4">
                                <label className="text-sm font-medium text-gray-600">Review Notes</label>
                                <Textarea
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add review notes or reasons for approval/rejection..."
                                  className="mt-2"
                                  rows={3}
                                />
                                <div className="flex gap-3 mt-4">
                                  <Button 
                                    onClick={() => handleApprove(selectedDocument.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve Document
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleReject(selectedDocument.id)}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject Document
                                  </Button>
                                  <Button variant="outline">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Request More Info
                                  </Button>
                                </div>
                              </div>
                            </div>
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
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(doc.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
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

export default SaudiVerification