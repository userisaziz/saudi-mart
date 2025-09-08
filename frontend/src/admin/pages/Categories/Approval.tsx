import React, { useState } from 'react'
import { 
  FolderTree, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock,
  AlertTriangle,
  User,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
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
import { Textarea } from '@/shared/components/ui/textarea'
import { Label } from '@/shared/components/ui/label'

interface CategoryRequest {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  parentCategory: string | null
  requestedBy: string
  requestedByName: string
  requestDate: string
  status: 'pending' | 'approved' | 'rejected' | 'review'
  priority: 'low' | 'medium' | 'high'
  rejectionReason?: string
  reviewNotes?: string
  approvedBy?: string
  approvedDate?: string
  icon?: string
  suggestedParent?: string
  businessJustification: string
}

const mockRequests: CategoryRequest[] = [
  {
    id: '1',
    name: 'Smart Home Devices',
    nameAr: 'أجهزة المنزل الذكي',
    description: 'Internet-connected devices for home automation',
    descriptionAr: 'أجهزة متصلة بالإنترنت لأتمتة المنزل',
    parentCategory: 'Electronics',
    requestedBy: 'seller-001',
    requestedByName: 'Al-Rashid Electronics',
    requestDate: '2024-01-20T10:00:00Z',
    status: 'pending',
    priority: 'high',
    businessJustification: 'Growing demand for IoT devices in Saudi market',
    icon: 'home'
  },
  {
    id: '2',
    name: 'Organic Baby Food',
    nameAr: 'طعام الأطفال العضوي',
    description: 'Certified organic baby food products',
    descriptionAr: 'منتجات طعام الأطفال العضوي المعتمد',
    parentCategory: 'Baby Care',
    requestedBy: 'seller-002',
    requestedByName: 'Healthy Kids Co.',
    requestDate: '2024-01-19T14:30:00Z',
    status: 'review',
    priority: 'medium',
    businessJustification: 'Health-conscious parents seeking organic options',
    reviewNotes: 'Need to verify organic certification requirements'
  },
  {
    id: '3',
    name: 'Gaming Chairs',
    nameAr: 'كراسي الألعاب',
    description: 'Ergonomic gaming chairs and accessories',
    descriptionAr: 'كراسي الألعاب المريحة والإكسسوارات',
    parentCategory: 'Furniture',
    requestedBy: 'seller-003',
    requestedByName: 'Gaming World',
    requestDate: '2024-01-18T09:15:00Z',
    status: 'approved',
    priority: 'medium',
    businessJustification: 'Rising gaming community in Saudi Arabia',
    approvedBy: 'admin-001',
    approvedDate: '2024-01-19T11:00:00Z'
  },
  {
    id: '4',
    name: 'Islamic Calligraphy Art',
    nameAr: 'فن الخط العربي',
    description: 'Traditional and modern Islamic calligraphy artwork',
    descriptionAr: 'أعمال فنية للخط العربي التقليدي والحديث',
    parentCategory: 'Art & Crafts',
    requestedBy: 'seller-004',
    requestedByName: 'Cultural Arts Studio',
    requestDate: '2024-01-17T16:45:00Z',
    status: 'rejected',
    priority: 'low',
    businessJustification: 'Cultural significance and local demand',
    rejectionReason: 'Overlaps with existing Religious Items category'
  },
  {
    id: '5',
    name: 'Solar Power Equipment',
    nameAr: 'معدات الطاقة الشمسية',
    description: 'Solar panels, inverters, and renewable energy solutions',
    descriptionAr: 'الألواح الشمسية والعاكسات وحلول الطاقة المتجددة',
    parentCategory: 'Electronics',
    requestedBy: 'seller-005',
    requestedByName: 'Green Energy Solutions',
    requestDate: '2024-01-16T11:20:00Z',
    status: 'pending',
    priority: 'high',
    businessJustification: 'Saudi Vision 2030 renewable energy initiatives'
  }
]

export default function CategoryApproval() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<CategoryRequest | null>(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'review'>('approve')
  const [actionNotes, setActionNotes] = useState('')

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.nameAr.includes(searchTerm) ||
      request.requestedByName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: CategoryRequest['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      review: { label: 'In Review', variant: 'outline' as const, icon: Eye },
      approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: CategoryRequest['priority']) => {
    const priorityConfig = {
      low: { label: 'Low', variant: 'outline' as const },
      medium: { label: 'Medium', variant: 'secondary' as const },
      high: { label: 'High', variant: 'destructive' as const }
    }
    
    const config = priorityConfig[priority]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleAction = (request: CategoryRequest, action: 'approve' | 'reject' | 'review') => {
    setSelectedRequest(request)
    setActionType(action)
    setActionModalOpen(true)
    setActionNotes('')
  }

  const submitAction = () => {
    // Handle the action submission
    console.log(`${actionType} request ${selectedRequest?.id}:`, actionNotes)
    setActionModalOpen(false)
    setSelectedRequest(null)
    setActionNotes('')
  }

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category Approval</h1>
        <p className="text-muted-foreground">Review and approve category requests from sellers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search categories or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
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
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-muted-foreground">{request.nameAr}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {request.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-muted-foreground" />
                      <span>{request.parentCategory}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{request.requestedByName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAction(request, 'approve')}
                            className="gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(request, 'review')}
                            className="gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(request, 'reject')}
                            className="gap-1"
                          >
                            <X className="w-3 h-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {request.status === 'approved' && (
                            <DropdownMenuItem>
                              <FolderTree className="w-4 h-4 mr-2" />
                              View Category
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Category Request'}
              {actionType === 'reject' && 'Reject Category Request'}
              {actionType === 'review' && 'Send for Review'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  Category: {selectedRequest.name} ({selectedRequest.nameAr})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div><strong>Business Justification:</strong></div>
                <div className="text-sm">{selectedRequest.businessJustification}</div>
                <div className="text-sm text-muted-foreground">
                  Requested by: {selectedRequest.requestedByName}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="actionNotes">
                {actionType === 'approve' && 'Approval Notes (Optional)'}
                {actionType === 'reject' && 'Rejection Reason'}
                {actionType === 'review' && 'Review Notes'}
              </Label>
              <Textarea
                id="actionNotes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={
                  actionType === 'approve' ? 'Add any notes for this approval...' :
                  actionType === 'reject' ? 'Explain why this request is being rejected...' :
                  'Add notes for the reviewer...'
                }
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitAction}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
              {actionType === 'review' && 'Send for Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}