import React, { useState } from 'react'
import { Search, Filter, MoreVertical, Eye, Check, X, Truck, Package, CreditCard, MapPin, Phone, Mail, Calendar, Clock, DollarSign } from 'lucide-react'
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

interface OrderItem {
  id: string
  productName: string
  productImage: string
  quantity: number
  price: number
  totalPrice: number
}

interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  sellerId: string
  sellerName: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'cod' | 'mada' | 'visa' | 'bank_transfer'
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  vatAmount: number
  totalAmount: number
  currency: 'SAR'
  shippingAddress: {
    fullName: string
    phone: string
    street: string
    city: string
    region: string
    postalCode: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
  notes?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001234',
    customerId: 'cust-001',
    customerName: 'Ahmed Al-Rashid',
    customerNameAr: 'Ahmed Al-Rashid',
    customerPhone: '+966501234567',
    customerEmail: 'ahmed@example.com',
    sellerId: 'seller-001',
    sellerName: 'Premium Dates Store',
    sellerNameAr: 'Premium Dates Store',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'mada',
    items: [
      {
        id: 'item-1',
        productName: 'Premium Medjool Dates',
        productNameAr: 'Premium Medjool Dates',
        productImage: '/images/dates.jpg',
        quantity: 2,
        price: 45.50,
        totalPrice: 91.00
      },
      {
        id: 'item-2',
        productName: 'Saudi Coffee Blend',
        productNameAr: 'Saudi Coffee Blend',
        productImage: '/images/coffee.jpg',
        quantity: 1,
        price: 28.75,
        totalPrice: 28.75
      }
    ],
    subtotal: 119.75,
    shippingCost: 15.00,
    vatAmount: 20.21,
    totalAmount: 154.96,
    currency: 'SAR',
    shippingAddress: {
      fullName: 'Ahmed Al-Rashid',
      phone: '+966501234567',
      street: 'King Fahd Road, Al-Rabwa District',
      city: 'Riyadh',
      region: 'Riyadh Province',
      postalCode: '11564'
    },
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-25',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    notes: 'Customer requested fast delivery'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-001235',
    customerId: 'cust-002',
    customerName: 'Fatima Al-Zahra',
    customerNameAr: 'Fatima Al-Zahra',
    customerPhone: '+966502345678',
    customerEmail: 'fatima@example.com',
    sellerId: 'seller-002',
    sellerName: 'Modern Abaya Collection',
    sellerNameAr: 'Modern Abaya Collection',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'visa',
    items: [
      {
        id: 'item-3',
        productName: 'Black Silk Abaya',
        productNameAr: 'Black Silk Abaya',
        productImage: '/images/abaya.jpg',
        quantity: 1,
        price: 195.00,
        totalPrice: 195.00
      }
    ],
    subtotal: 195.00,
    shippingCost: 20.00,
    vatAmount: 32.25,
    totalAmount: 247.25,
    currency: 'SAR',
    shippingAddress: {
      fullName: 'Fatima Al-Zahra',
      phone: '+966502345678',
      street: 'Prince Mohammed bin Abdulaziz Street',
      city: 'Jeddah',
      region: 'Makkah Province',
      postalCode: '23443'
    },
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-24',
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-21T09:20:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-001236',
    customerId: 'cust-003',
    customerName: 'Mohammed Al-Sudairi',
    customerNameAr: 'Mohammed Al-Sudairi',
    customerPhone: '+966503456789',
    customerEmail: 'mohammed@example.com',
    sellerId: 'seller-003',
    sellerName: 'Golden Oud Perfumes',
    sellerNameAr: 'Golden Oud Perfumes',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    items: [
      {
        id: 'item-4',
        productName: 'Royal Oud Perfume 50ml',
        productNameAr: 'Royal Oud Perfume 50ml',
        productImage: '/images/perfume.jpg',
        quantity: 1,
        price: 350.00,
        totalPrice: 350.00
      }
    ],
    subtotal: 350.00,
    shippingCost: 25.00,
    vatAmount: 56.25,
    totalAmount: 431.25,
    currency: 'SAR',
    shippingAddress: {
      fullName: 'Mohammed Al-Sudairi',
      phone: '+966503456789',
      street: 'King Abdullah Road, Al-Faisaliyyah District',
      city: 'Dammam',
      region: 'Eastern Province',
      postalCode: '32242'
    },
    createdAt: '2024-01-21T11:20:00Z',
    updatedAt: '2024-01-21T11:20:00Z'
  }
]

const getStatusBadge = (status: string) => {
  const statusMap = {
    'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    'confirmed': { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    'processing': { label: 'Processing', color: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
    'shipped': { label: 'Shipped', color: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
    'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800 hover:bg-green-100' },
    'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800 hover:bg-red-100' },
    'refunded': { label: 'Refunded', color: 'bg-gray-100 text-gray-800 hover:bg-gray-100' }
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap]
  return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
}

const getPaymentStatusBadge = (status: string) => {
  const statusMap = {
    'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    'paid': { label: 'Paid', color: 'bg-green-100 text-green-800 hover:bg-green-100' },
    'failed': { label: 'Failed', color: 'bg-red-100 text-red-800 hover:bg-red-100' },
    'refunded': { label: 'Refunded', color: 'bg-gray-100 text-gray-800 hover:bg-gray-100' }
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap]
  return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'cod': return '💵'
    case 'mada': return '💳'
    case 'visa': return '💳'
    case 'bank_transfer': return '🏦'
    default: return '💳'
  }
}

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
  }).format(amount)
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

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const [updateNotes, setUpdateNotes] = useState('')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerNameAr.includes(searchTerm) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerNameAr.includes(searchTerm)
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            updatedAt: new Date().toISOString(),
            notes: updateNotes || order.notes
          }
        : order
    ))
    setSelectedOrder(null)
    setUpdateNotes('')
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const confirmedOrders = orders.filter(order => order.status === 'confirmed').length
  const shippedOrders = orders.filter(order => order.status === 'shipped').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and process all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-blue-600">All orders</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              <p className="text-xs text-yellow-600">Needs review</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900">{shippedOrders}</p>
              <p className="text-xs text-orange-600">In transit</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatSARCurrency(totalRevenue)}</p>
              <p className="text-xs text-green-600">From all orders</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Order Number</TableHead>
              <TableHead className="text-left">Customer</TableHead>
              <TableHead className="text-left">Seller</TableHead>
              <TableHead className="text-left">Amount</TableHead>
              <TableHead className="text-left">Order Status</TableHead>
              <TableHead className="text-left">Payment Status</TableHead>
              <TableHead className="text-left">Payment Method</TableHead>
              <TableHead className="text-left">Date</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-bold text-blue-600">{order.orderNumber}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-gray-500">Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.sellerName}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                </TableCell>
                <TableCell className="text-left font-bold text-green-600">
                  {formatSARCurrency(order.totalAmount)}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{getPaymentMethodIcon(order.paymentMethod)}</span>
                    <span className="text-sm">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                       order.paymentMethod === 'mada' ? 'Mada' :
                       order.paymentMethod === 'visa' ? 'Visa' : 'Bank Transfer'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-left text-sm">
                  {formatDateShort(order.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Customer Information</h3>
                                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Name:</span>
                                    <span>{selectedOrder.customerName}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{selectedOrder.customerPhone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{selectedOrder.customerEmail}</span>
                                  </div>
                                </div>

                                <h3 className="font-semibold text-lg">Delivery Address</h3>
                                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-1" />
                                    <div>
                                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                                      <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                                      <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region}</p>
                                      <p className="text-sm">{selectedOrder.shippingAddress.postalCode}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Order Information</h3>
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span>Order Status:</span>
                                    {getStatusBadge(selectedOrder.status)}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Payment Status:</span>
                                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span>Payment Method:</span>
                                    <div className="flex items-center gap-1">
                                      <span>{getPaymentMethodIcon(selectedOrder.paymentMethod)}</span>
                                      <span>
                                        {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                         selectedOrder.paymentMethod === 'mada' ? 'Mada' :
                                         selectedOrder.paymentMethod === 'visa' ? 'Visa' : 'Bank Transfer'}
                                      </span>
                                    </div>
                                  </div>
                                  {selectedOrder.trackingNumber && (
                                    <div className="flex justify-between items-center">
                                      <span>Tracking Number:</span>
                                      <span className="font-mono text-sm">{selectedOrder.trackingNumber}</span>
                                    </div>
                                  )}
                                  {selectedOrder.estimatedDelivery && (
                                    <div className="flex justify-between items-center">
                                      <span>Expected Delivery:</span>
                                      <span>{formatDateShort(selectedOrder.estimatedDelivery)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                              <div className="border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-left">Product</TableHead>
                                      <TableHead className="text-left">Quantity</TableHead>
                                      <TableHead className="text-left">Price</TableHead>
                                      <TableHead className="text-left">Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedOrder.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>
                                          <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                            <div>
                                              <p className="font-medium">{item.productName}</p>
                                              <p className="text-sm text-gray-500">{item.productNameAr}</p>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-left">{formatSARCurrency(item.price)}</TableCell>
                                        <TableCell className="text-left font-medium">{formatSARCurrency(item.totalPrice)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatSARCurrency(selectedOrder.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{formatSARCurrency(selectedOrder.shippingCost)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>VAT (15%):</span>
                                    <span>{formatSARCurrency(selectedOrder.vatAmount)}</span>
                                  </div>
                                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span className="text-green-600">{formatSARCurrency(selectedOrder.totalAmount)}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold text-lg mb-4">Update Order</h3>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Update Order Status</label>
                                    <Select onValueChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value as Order['status'])}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose new status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="confirmed">Confirm Order</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Ship Order</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancel Order</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">Additional Notes</label>
                                    <Textarea
                                      value={updateNotes}
                                      onChange={(e) => setUpdateNotes(e.target.value)}
                                      placeholder="Add notes about the update..."
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </div>
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
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Order
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="w-4 h-4 mr-2" />
                          Update Shipping
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <X className="w-4 h-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing 1 to {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}