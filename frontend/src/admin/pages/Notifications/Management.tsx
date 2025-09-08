import React, { useState } from 'react'
import { Bell, Search, Filter, MoreVertical, Eye, Check, X, Send, Users, AlertTriangle, Info, CheckCircle, Settings, Trash2, Plus, Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface AdminNotification {
  id: string
  type: 'user_registration' | 'product_submission' | 'order_placed' | 'verification_required' | 'system_alert' | 'payment_issue' | 'support_ticket'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  actionUrl?: string
  userId?: string
  relatedId?: string
  category: 'system' | 'business' | 'user' | 'security'
  recipientCount?: number
  deliveryStatus?: 'pending' | 'sent' | 'failed'
}

interface NotificationTemplate {
  id: string
  name: string
  type: AdminNotification['type']
  subject: string
  content: string
  isActive: boolean
  createdAt: string
}

const mockNotifications: AdminNotification[] = [
  {
    id: '1',
    type: 'user_registration',
    title: 'New User Registration',
    message: 'Ahmed Al-Rashid has registered as a new seller',
    isRead: false,
    createdAt: '2024-01-21T10:30:00Z',
    priority: 'medium',
    userId: 'user-001',
    category: 'user'
  },
  {
    id: '2',
    type: 'product_submission',
    title: 'Product Awaiting Approval',
    message: '15 products submitted for review',
    isRead: false,
    createdAt: '2024-01-21T09:15:00Z',
    priority: 'high',
    category: 'business',
    recipientCount: 15
  },
  {
    id: '3',
    type: 'system_alert',
    title: 'High Server Load Detected',
    message: 'Server CPU usage is at 85%',
    isRead: true,
    createdAt: '2024-01-21T08:45:00Z',
    priority: 'critical',
    category: 'system'
  },
  {
    id: '4',
    type: 'verification_required',
    title: 'KYC Documents Pending',
    message: '8 business verifications require review',
    isRead: false,
    createdAt: '2024-01-20T16:20:00Z',
    priority: 'high',
    category: 'business',
    recipientCount: 8
  },
  {
    id: '5',
    type: 'payment_issue',
    title: 'Payment Gateway Alert',
    message: 'Mada payment service experiencing issues',
    isRead: false,
    createdAt: '2024-01-20T14:30:00Z',
    priority: 'critical',
    category: 'system'
  }
]

const mockTemplates: NotificationTemplate[] = [
  {
    id: 'template-1',
    name: 'Welcome New User',
    type: 'user_registration',
    subject: 'Welcome to Saudi E-Commerce Platform',
    content: 'Welcome {{userName}}! Your account has been successfully created.',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template-2',
    name: 'Product Approval Required',
    type: 'product_submission',
    subject: 'New Product Requires Review',
    content: 'A new product "{{productName}}" has been submitted and requires admin approval.',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

const getTypeIcon = (type: string) => {
  const iconMap = {
    'user_registration': Users,
    'product_submission': CheckCircle,
    'order_placed': CheckCircle,
    'verification_required': AlertTriangle,
    'system_alert': AlertTriangle,
    'payment_issue': AlertTriangle,
    'support_ticket': MessageCircle
  }
  return iconMap[type as keyof typeof iconMap] || Bell
}

const getPriorityBadge = (priority: string) => {
  const priorityMap = {
    'low': { label: 'Low', color: 'bg-green-100 text-green-800 hover:bg-green-100' },
    'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    'high': { label: 'High', color: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
    'critical': { label: 'Critical', color: 'bg-red-100 text-red-800 hover:bg-red-100' }
  }
  
  const priorityInfo = priorityMap[priority as keyof typeof priorityMap]
  return <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
}

const getCategoryBadge = (category: string) => {
  const categoryMap = {
    'system': { label: 'System', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    'business': { label: 'Business', color: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
    'user': { label: 'User', color: 'bg-teal-100 text-teal-800 hover:bg-teal-100' },
    'security': { label: 'Security', color: 'bg-red-100 text-red-800 hover:bg-red-100' }
  }
  
  const categoryInfo = categoryMap[category as keyof typeof categoryMap]
  return <Badge variant="outline" className={categoryInfo.color}>{categoryInfo.label}</Badge>
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockNotifications)
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockTemplates)
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')

  // New notification form
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'system_alert' as AdminNotification['type'],
    priority: 'medium' as AdminNotification['priority'],
    category: 'system' as AdminNotification['category'],
    recipients: 'all'
  })

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || notification.type === selectedType
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory
    const matchesReadStatus = !showUnreadOnly || !notification.isRead
    
    return matchesSearch && matchesType && matchesPriority && matchesCategory && matchesReadStatus
  })

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })))
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const handleSendNotification = () => {
    const notification: AdminNotification = {
      id: Date.now().toString(),
      ...newNotification,
      isRead: false,
      createdAt: new Date().toISOString(),
      deliveryStatus: 'sent'
    }
    
    setNotifications([notification, ...notifications])
    setNewNotification({
      title: '',
      message: '',
      type: 'system_alert',
      priority: 'medium',
      category: 'system',
      recipients: 'all'
    })
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const criticalCount = notifications.filter(n => n.priority === 'critical').length
  const systemAlertsCount = notifications.filter(n => n.category === 'system').length
  const totalNotifications = notifications.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
          <p className="text-gray-600">Manage and send notifications and alerts to users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="w-4 h-4 ml-2" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{totalNotifications}</p>
              <p className="text-xs text-blue-600">All notifications</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-xs text-yellow-600">Need review</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
              <p className="text-xs text-red-600">High priority</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{systemAlertsCount}</p>
              <p className="text-xs text-orange-600">System and security</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 ml-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="compose">
              <Plus className="w-4 h-4 ml-2" />
              Create Notification
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Settings className="w-4 h-4 ml-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Notification Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="user_registration">User Registration</SelectItem>
                  <SelectItem value="product_submission">Product Submission</SelectItem>
                  <SelectItem value="system_alert">System Alert</SelectItem>
                  <SelectItem value="verification_required">Verification Required</SelectItem>
                  <SelectItem value="payment_issue">Payment Issue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={showUnreadOnly ? "default" : "outline"}
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                size="sm"
              >
                Unread Only
              </Button>
            </div>

            {/* Notifications Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notification</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => {
                  const TypeIcon = getTypeIcon(notification.type)
                  return (
                    <TableRow key={notification.id} className={!notification.isRead ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${notification.priority === 'critical' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <TypeIcon className={`w-4 h-4 ${notification.priority === 'critical' ? 'text-red-600' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            {notification.recipientCount && (
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.recipientCount} recipients
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {notification.type === 'user_registration' ? 'User Registration' :
                           notification.type === 'product_submission' ? 'Product Submission' :
                           notification.type === 'system_alert' ? 'System Alert' :
                           notification.type === 'verification_required' ? 'Verification Required' :
                           notification.type === 'payment_issue' ? 'Payment Issue' : notification.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getCategoryBadge(notification.category)}</TableCell>
                      <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                      <TableCell>
                        <Badge className={notification.isRead ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}>
                          {notification.isRead ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(notification.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedNotification(notification)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Notification Details</DialogTitle>
                              </DialogHeader>
                              {selectedNotification && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Title</label>
                                      <p className="font-semibold">{selectedNotification.title}</p>
                                      </div>
                                    <div>
                                      <label className="text-sm font-medium">Type</label>
                                      <p>{selectedNotification.type}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Message</label>
                                    <p className="mt-1 p-3 bg-gray-50 rounded">{selectedNotification.message}</p>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Priority</label>
                                      <div className="mt-1">{getPriorityBadge(selectedNotification.priority)}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Category</label>
                                      <div className="mt-1">{getCategoryBadge(selectedNotification.category)}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Date</label>
                                      <p className="text-sm">{formatDate(selectedNotification.createdAt)}</p>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedNotification(null)}
                                    >
                                      Close
                                    </Button>
                                    {!selectedNotification.isRead && (
                                      <Button
                                        onClick={() => {
                                          handleMarkAsRead(selectedNotification.id)
                                          setSelectedNotification(null)
                                        }}
                                      >
                                        <Check className="w-4 h-4 ml-2" />
                                        Mark as Read
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                View Details
                              </DropdownMenuItem>
                              {!notification.isRead && (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                  <Check className="w-4 h-4 ml-2" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteNotification(notification.id)}>
                                <Trash2 className="w-4 h-4 ml-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="compose" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    placeholder="Enter message content"
                    rows={4}
                  />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Notification Type</label>
                    <Select value={newNotification.type} onValueChange={(value) => setNewNotification({ ...newNotification, type: value as AdminNotification['type'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system_alert">System Alert</SelectItem>
                        <SelectItem value="user_registration">User Registration</SelectItem>
                        <SelectItem value="product_submission">Product Submission</SelectItem>
                        <SelectItem value="verification_required">Verification Required</SelectItem>
                        <SelectItem value="payment_issue">Payment Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newNotification.priority} onValueChange={(value) => setNewNotification({ ...newNotification, priority: value as AdminNotification['priority'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newNotification.category} onValueChange={(value) => setNewNotification({ ...newNotification, category: value as AdminNotification['category'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Recipients</label>
                    <Select value={newNotification.recipients} onValueChange={(value) => setNewNotification({ ...newNotification, recipients: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="sellers">Sellers Only</SelectItem>
                        <SelectItem value="customers">Customers Only</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSendNotification} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 ml-2" />
                    Send Notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notification Templates</h3>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                Create New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge className={template.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Type: {template.type}</p>
                      <p className="text-sm font-medium">{template.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}