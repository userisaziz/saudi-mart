import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  MoreHorizontal, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  DollarSign,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
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

interface OrderItem {
  id: string
  productName: string
  productNameAr: string
  quantity: number
  unitPrice: number
  totalPrice: number
  sku: string
}

interface Order {
  id: string
  orderNumber: string
  buyerName: string
  buyerNameAr: string
  buyerEmail: string
  buyerPhone: string
  sellerName: string
  sellerNameAr: string
  orderDate: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  totalAmount: number
  currency: 'SAR' | 'USD' | 'AED'
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  paymentMethod: 'card' | 'bank_transfer' | 'cash_on_delivery' | 'wallet'
  notes?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    buyerName: 'Ahmed Al-Rashid Trading Co.',
    buyerNameAr: 'Ahmed Al-Rashid Trading Co.',
    buyerEmail: 'orders@alrashid.com.sa',
    buyerPhone: '+966501234567',
    sellerName: 'Tech Solutions Saudi',
    sellerNameAr: 'Tech Solutions Saudi',
    orderDate: '2024-01-20T10:30:00Z',
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 15750.00,
    currency: 'SAR',
    items: [
      {
        id: '1',
        productName: 'Industrial Printer HP LaserJet Pro',
        productNameAr: 'Industrial Printer HP LaserJet Pro',
        quantity: 3,
        unitPrice: 4500.00,
        totalPrice: 13500.00,
        sku: 'HP-LJ-PRO-001'
      },
      {
        id: '2',
        productName: 'Premium Paper Rolls',
        productNameAr: 'Premium Paper Rolls',
        quantity: 15,
        unitPrice: 150.00,
        totalPrice: 2250.00,
        sku: 'PPR-ROLL-150'
      }
    ],
    shippingAddress: {
      street: 'King Fahd Road, Building 123',
      city: 'Riyadh',
      region: 'Riyadh Province',
      postalCode: '11564',
      country: 'Saudi Arabia'
    },
    trackingNumber: 'TRK-2024-001',
    estimatedDelivery: '2024-01-25T12:00:00Z',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    buyerName: 'Jeddah Medical Supplies',
    buyerNameAr: 'Jeddah Medical Supplies',
    buyerEmail: 'procurement@jms.com.sa',
    buyerPhone: '+966502345678',
    sellerName: 'MedEquip International',
    sellerNameAr: 'MedEquip International',
    orderDate: '2024-01-19T14:15:00Z',
    status: 'processing',
    paymentStatus: 'paid',
    totalAmount: 28500.00,
    currency: 'SAR',
    items: [
      {
        id: '3',
        productName: 'Digital Blood Pressure Monitors',
        productNameAr: 'Digital Blood Pressure Monitors',
        quantity: 10,
        unitPrice: 2850.00,
        totalPrice: 28500.00,
        sku: 'DBP-MON-2850'
      }
    ],
    shippingAddress: {
      street: 'Palestine Street, Medical District',
      city: 'Jeddah',
      region: 'Makkah Province',
      postalCode: '21442',
      country: 'Saudi Arabia'
    },
    paymentMethod: 'card',
    notes: 'Urgent medical equipment order'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    buyerName: 'Construction Materials LLC',
    buyerNameAr: 'Construction Materials LLC',
    buyerEmail: 'orders@constructsa.com',
    buyerPhone: '+966503456789',
    sellerName: 'Building Supplies Kingdom',
    sellerNameAr: 'Building Supplies Kingdom',
    orderDate: '2024-01-18T09:00:00Z',
    status: 'shipped',
    paymentStatus: 'paid',
    totalAmount: 45200.00,
    currency: 'SAR',
    items: [
      {
        id: '4',
        productName: 'Steel Reinforcement Bars',
        productNameAr: 'Steel Reinforcement Bars',
        quantity: 100,
        unitPrice: 350.00,
        totalPrice: 35000.00,
        sku: 'SRB-350-100'
      },
      {
        id: '5',
        productName: 'Concrete Mixer Industrial',
        productNameAr: 'Concrete Mixer Industrial',
        quantity: 2,
        unitPrice: 5100.00,
        totalPrice: 10200.00,
        sku: 'CMI-5100-02'
      }
    ],
    shippingAddress: {
      street: 'Industrial City, Warehouse 45',
      city: 'Dammam',
      region: 'Eastern Province',
      postalCode: '31411',
      country: 'Saudi Arabia'
    },
    trackingNumber: 'TRK-2024-003',
    estimatedDelivery: '2024-01-22T16:00:00Z',
    paymentMethod: 'cash_on_delivery'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    buyerName: 'Foodservice Solutions Co.',
    buyerNameAr: 'Foodservice Solutions Co.',
    buyerEmail: 'purchasing@foodservice.sa',
    buyerPhone: '+966504567890',
    sellerName: 'Kitchen Equipment Pro',
    sellerNameAr: 'Kitchen Equipment Pro',
    orderDate: '2024-01-17T11:45:00Z',
    status: 'cancelled',
    paymentStatus: 'refunded',
    totalAmount: 12300.00,
    currency: 'SAR',
    items: [
      {
        id: '6',
        productName: 'Commercial Refrigerator',
        productNameAr: 'Commercial Refrigerator',
        quantity: 1,
        unitPrice: 12300.00,
        totalPrice: 12300.00,
        sku: 'COM-REF-12300'
      }
    ],
    shippingAddress: {
      street: 'Al-Khobar Corniche, Restaurant 12',
      city: 'Al-Khobar',
      region: 'Eastern Province',
      postalCode: '31952',
      country: 'Saudi Arabia'
    },
    paymentMethod: 'card',
    notes: 'Order cancelled due to delivery issues'
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    buyerName: 'Educational Resources Center',
    buyerNameAr: 'Educational Resources Center',
    buyerEmail: 'procurement@erc.edu.sa',
    buyerPhone: '+966505678901',
    sellerName: 'Learning Technologies',
    sellerNameAr: 'Learning Technologies',
    orderDate: '2024-01-16T08:30:00Z',
    status: 'delivered',
    paymentStatus: 'paid',
    totalAmount: 8750.00,
    currency: 'SAR',
    items: [
      {
        id: '7',
        productName: 'Interactive Whiteboards',
        productNameAr: 'Interactive Whiteboards',
        quantity: 5,
        unitPrice: 1750.00,
        totalPrice: 8750.00,
        sku: 'IWB-1750-05'
      }
    ],
    shippingAddress: {
      street: 'Education District, School Complex A',
      city: 'Medina',
      region: 'Medina Province',
      postalCode: '42351',
      country: 'Saudi Arabia'
    },
    trackingNumber: 'TRK-2024-005',
    paymentMethod: 'bank_transfer'
  }
]

export default function OrdersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerNameAr.includes(searchTerm) ||
      order.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerNameAr.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle },
      processing: { label: 'Processing', variant: 'outline' as const, icon: Package },
      shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck },
      delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle },
      returned: { label: 'Returned', variant: 'destructive' as const, icon: XCircle }
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

  const getPaymentBadge = (paymentStatus: Order['paymentStatus']) => {
    const paymentConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      paid: { label: 'Paid', variant: 'default' as const },
      failed: { label: 'Failed', variant: 'destructive' as const },
      refunded: { label: 'Refunded', variant: 'outline' as const }
    }
    
    const config = paymentConfig[paymentStatus]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    confirmed: mockOrders.filter(o => o.status === 'confirmed').length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    shipped: mockOrders.filter(o => o.status === 'shipped').length,
    delivered: mockOrders.filter(o => o.status === 'delivered').length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders in the system</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            <div className="text-2xl font-bold text-purple-600">{stats.processing}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shipped</CardTitle>
            <div className="text-2xl font-bold text-indigo-600">{stats.shipped}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
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
                placeholder="Search orders, buyers, or sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{order.buyerName}</div>
                      <div className="text-sm text-muted-foreground">{order.buyerNameAr}</div>
                      <div className="text-xs text-muted-foreground">{order.buyerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{order.sellerName}</div>
                      <div className="text-sm text-muted-foreground">{order.sellerNameAr}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {order.totalAmount.toLocaleString()} {order.currency}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOrder(order)}
                        className="gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="w-4 h-4 mr-2" />
                            Track Shipment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Buyer
                          </DropdownMenuItem>
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

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getStatusBadge(selectedOrder.status)}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getPaymentBadge(selectedOrder.paymentStatus)}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedOrder.totalAmount.toLocaleString()} {selectedOrder.currency}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Buyer and Seller Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Buyer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="font-medium">{selectedOrder.buyerName}</div>
                      <div className="text-sm text-muted-foreground">{selectedOrder.buyerNameAr}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.buyerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.buyerPhone}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Seller Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="font-medium">{selectedOrder.sellerName}</div>
                      <div className="text-sm text-muted-foreground">{selectedOrder.sellerNameAr}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    <div>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region}
                    </div>
                    <div>
                      {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-muted-foreground">{item.productNameAr}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitPrice.toLocaleString()} {selectedOrder.currency}</TableCell>
                          <TableCell className="font-medium">
                            {item.totalPrice.toLocaleString()} {selectedOrder.currency}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Tracking Information */}
              {selectedOrder.trackingNumber && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Tracking Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tracking Number:</span>
                      <span className="font-mono">{selectedOrder.trackingNumber}</span>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span>{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}