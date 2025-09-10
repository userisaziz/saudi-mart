import React, { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  Search,
  FileText,
  User,
  Calendar,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { useLanguage } from '@/shared/contexts/LanguageContext'

interface CategoryRequest {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  requestedBy: string
  requestedAt: string
  status: 'pending' | 'approved' | 'rejected'
  parentCategory?: string
  businessJustification: string
  expectedProducts: number
  priority: 'low' | 'medium' | 'high'
  adminNotes?: string
}

const mockRequests: CategoryRequest[] = [
  {
    id: '1',
    name: 'Smart Home Devices',
    nameAr: 'أجهزة المنزل الذكي',
    description: 'IoT devices for home automation',
    descriptionAr: 'أجهزة إنترنت الأشياء لأتمتة المنزل',
    requestedBy: 'TechCorp Solutions',
    requestedAt: '2024-01-20T10:30:00Z',
    status: 'pending',
    parentCategory: 'Electronics',
    businessJustification: 'Growing market demand for smart home solutions',
    expectedProducts: 150,
    priority: 'high'
  },
  {
    id: '2',
    name: 'Organic Baby Food',
    nameAr: 'طعام الأطفال العضوي',
    description: 'Certified organic food products for infants',
    descriptionAr: 'منتجات غذائية عضوية معتمدة للأطفال',
    requestedBy: 'Pure Baby Co',
    requestedAt: '2024-01-19T14:15:00Z',
    status: 'approved',
    parentCategory: 'Food & Beverages',
    businessJustification: 'Health-conscious parents seeking organic options',
    expectedProducts: 75,
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Cryptocurrency Hardware',
    nameAr: 'أجهزة العملات الرقمية',
    description: 'Hardware wallets and mining equipment',
    descriptionAr: 'محافظ الأجهزة ومعدات التعدين',
    requestedBy: 'CryptoTech Ltd',
    requestedAt: '2024-01-18T09:45:00Z',
    status: 'rejected',
    parentCategory: 'Electronics',
    businessJustification: 'Emerging cryptocurrency market',
    expectedProducts: 25,
    priority: 'low',
    adminNotes: 'Category rejected due to regulatory concerns'
  }
]

export default function CategoriesApproval() {
  const { t, isRTL } = useLanguage()
  const [requests, setRequests] = useState<CategoryRequest[]>(mockRequests)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<CategoryRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.nameAr.includes(searchTerm) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', icon: Clock },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-800 hover:bg-green-100', icon: CheckCircle },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 hover:bg-red-100', icon: XCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Low', color: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
      medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      high: { label: 'High', color: 'bg-orange-100 text-orange-800 hover:bg-orange-100' }
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const handleApproval = (requestId: string, approved: boolean) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: approved ? 'approved' : 'rejected', adminNotes }
        : req
    ))
    setAdminNotes('')
  }

  const statsData = [
    { title: 'Total Requests', value: requests.length, icon: FileText, color: 'blue' },
    { title: 'Pending Review', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'yellow' },
    { title: 'Approved', value: requests.filter(r => r.status === 'approved').length, icon: CheckCircle, color: 'green' },
    { title: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, icon: XCircle, color: 'red' }
  ]

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Approval</h1>
          <p className="text-gray-600">Review and approve new category requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Category Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Category</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Requested By</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Priority</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Expected Products</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Status</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Date</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-500">{request.nameAr}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{request.requestedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{request.expectedProducts}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
                          <DialogHeader>
                            <DialogTitle>Category Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && selectedRequest.id === request.id && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Category Name</label>
                                  <p className="font-semibold">{selectedRequest.name}</p>
                                  <p className="text-sm text-gray-500">{selectedRequest.nameAr}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Requested By</label>
                                  <p className="font-semibold">{selectedRequest.requestedBy}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm">{selectedRequest.description}</p>
                                <p className="text-sm text-gray-500 mt-1">{selectedRequest.descriptionAr}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Business Justification</label>
                                <p className="text-sm">{selectedRequest.businessJustification}</p>
                              </div>
                              
                              {selectedRequest.adminNotes && (
                                <div>
                                  <label className="text-sm font-medium">Admin Notes</label>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRequest.adminNotes}</p>
                                </div>
                              )}
                              
                              {selectedRequest.status === 'pending' && (
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium">Admin Notes</label>
                                    <Textarea
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      placeholder="Add your review notes..."
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleApproval(selectedRequest.id, true)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleApproval(selectedRequest.id, false)}
                                      variant="destructive"
                                    >
                                      <XCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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