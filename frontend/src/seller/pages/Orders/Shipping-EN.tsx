import React, { useState } from 'react'
import { Search, Filter, Eye, Package, Truck, MapPin, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'

interface Shipment {
  id: string
  orderId: string
  customerName: string
  customerAddress: string
  city: string
  productName: string
  trackingNumber?: string
  carrier: string
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  shippingDate: string
  estimatedDelivery: string
  actualDelivery?: string
  shippingCost: number
  weight: number
}

const mockShipments: Shipment[] = [
  {
    id: 'SH001',
    orderId: 'ORD001234',
    customerName: 'Ahmed Mohammed Al-Ahmad',
    customerAddress: 'King Fahd Street, Al-Olaya District',
    city: 'Riyadh',
    productName: 'Industrial Machines - Model A100',
    trackingNumber: 'TR123456789',
    carrier: 'Saudi Post',
    status: 'in_transit',
    shippingDate: '2024-01-18',
    estimatedDelivery: '2024-01-22',
    shippingCost: 120,
    weight: 25.5
  },
  {
    id: 'SH002',
    orderId: 'ORD001235',
    customerName: 'Fatima Ali Al-Saeed',
    customerAddress: 'King Abdulaziz Road, Al-Nahda District',
    city: 'Jeddah',
    productName: 'Various Industrial Spare Parts',
    trackingNumber: 'AR987654321',
    carrier: 'Aramex',
    status: 'delivered',
    shippingDate: '2024-01-15',
    estimatedDelivery: '2024-01-19',
    actualDelivery: '2024-01-19',
    shippingCost: 85,
    weight: 12.3
  },
  {
    id: 'SH003',
    orderId: 'ORD001236',
    customerName: 'Khalid Saad Al-Mutairi',
    customerAddress: 'Prince Sultan Street, Al-Faisaliya District',
    city: 'Dammam',
    productName: 'Precision Measuring Tools',
    carrier: 'FedEx',
    status: 'pending',
    shippingDate: '2024-01-20',
    estimatedDelivery: '2024-01-24',
    shippingCost: 150,
    weight: 8.7
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    case 'picked_up':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Picked Up</Badge>
    case 'in_transit':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">In Transit</Badge>
    case 'out_for_delivery':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Out for Delivery</Badge>
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Delivery Failed</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />
    case 'picked_up':
      return <Package className="w-4 h-4 text-blue-600" />
    case 'in_transit':
      return <Truck className="w-4 h-4 text-purple-600" />
    case 'out_for_delivery':
      return <MapPin className="w-4 h-4 text-orange-600" />
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'failed':
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    default:
      return <Package className="w-4 h-4 text-gray-600" />
  }
}

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getCarrierLogo = (carrier: string) => {
  const logos: { [key: string]: string } = {
    'Saudi Post': '📮',
    'Aramex': '📦',
    'FedEx': '✈️',
    'DHL': '🚚',
    'SMSA': '🏃‍♂️'
  }
  return logos[carrier] || '📦'
}

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || shipment.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (shipmentId: string, newStatus: Shipment['status']) => {
    setShipments(shipments.map(ship => 
      ship.id === shipmentId ? { ...ship, status: newStatus } : ship
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping & Delivery Management</h1>
          <p className="text-gray-600">Track and monitor all product shipments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Package className="w-4 h-4" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
              <p className="text-xs text-blue-600">This month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'in_transit').length}
              </p>
              <p className="text-xs text-purple-600">Being delivered</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === 'delivered').length}
              </p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipping Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatSARCurrency(shipments.reduce((sum, ship) => sum + ship.shippingCost, 0))}
              </p>
              <p className="text-xs text-orange-600">This month</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search in shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Delivery Failed</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>{shipment.orderId}</TableCell>
                <TableCell>{shipment.customerName}</TableCell>
                <TableCell>{shipment.city}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCarrierLogo(shipment.carrier)}</span>
                    <span>{shipment.carrier}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {shipment.trackingNumber || 'Not specified'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(shipment.status)}
                    {getStatusBadge(shipment.status)}
                  </div>
                </TableCell>
                <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
                <TableCell className="font-medium text-blue-600">
                  {formatSARCurrency(shipment.shippingCost)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Shipment Details</DialogTitle>
                        </DialogHeader>
                        {selectedShipment && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Shipment Information</h3>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Shipment ID</label>
                                    <p className="text-lg font-semibold">{selectedShipment.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Order ID</label>
                                    <p>{selectedShipment.orderId}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Tracking Number</label>
                                    <p className="font-mono text-sm">
                                      {selectedShipment.trackingNumber || 'Not specified'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Carrier</label>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{getCarrierLogo(selectedShipment.carrier)}</span>
                                      <span>{selectedShipment.carrier}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Customer Information</h3>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Customer Name</label>
                                    <p>{selectedShipment.customerName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Address</label>
                                    <p>{selectedShipment.customerAddress}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">City</label>
                                    <p>{selectedShipment.city}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg mb-4">Product Information</h3>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium">{selectedShipment.productName}</p>
                                <div className="mt-2 flex gap-6 text-sm text-gray-600">
                                  <span>Weight: {selectedShipment.weight} kg</span>
                                  <span>Cost: {formatSARCurrency(selectedShipment.shippingCost)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg mb-4">Shipment Tracking</h3>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    {getStatusIcon(selectedShipment.status)}
                                    {getStatusBadge(selectedShipment.status)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {selectedShipment.status === 'delivered' && selectedShipment.actualDelivery
                                      ? `Delivered on: ${formatDate(selectedShipment.actualDelivery)}`
                                      : `Expected delivery: ${formatDate(selectedShipment.estimatedDelivery)}`
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedShipment(null)}
                              >
                                Close
                              </Button>
                              {selectedShipment.trackingNumber && (
                                <Button variant="outline" className="bg-blue-50">
                                  Track Shipment
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {shipment.status === 'pending' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'picked_up')}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Mark as Picked Up
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'picked_up' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'in_transit')}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Mark in Transit
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'in_transit' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'out_for_delivery')}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Out for Delivery
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'out_for_delivery' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(shipment.id, 'delivered')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Delivered
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing 1 to {filteredShipments.length} of {shipments.length} shipments
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                1
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