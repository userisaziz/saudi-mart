import React, { useState } from 'react'
import { Search, Plus, Filter, MoreVertical, Check, X, Eye, ShoppingBag, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
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
import { Textarea } from '@/shared/components/ui/textarea'

interface Product {
  id: string
  name: string
  nameAr: string
  seller: string
  sellerAr: string
  category: string
  categoryAr: string
  price: number
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review'
  saso: boolean
  halal: boolean
  submitDate: string
  reviewedBy?: string
  priority: 'High' | 'Medium' | 'Low'
  images: string[]
  description: string
  descriptionAr: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Saudi Arabian Dates Premium',
    nameAr: 'تمور سعودية فاخرة',
    seller: 'Ahmed Al-Rashid',
    sellerAr: 'أحمد الراشد',
    category: 'Food & Beverages',
    categoryAr: 'المواد الغذائية والمشروبات',
    price: 45.50,
    status: 'Pending',
    saso: true,
    halal: true,
    submitDate: '2024-01-20',
    priority: 'High',
    images: ['/images/dates1.jpg'],
    description: 'Premium quality Saudi Arabian dates from Al-Ahsa region',
    descriptionAr: 'تمور سعودية فاخرة من منطقة الأحساء'
  },
  {
    id: '2',
    name: 'Traditional Saudi Coffee',
    nameAr: 'قهوة سعودية تقليدية',
    seller: 'Fatima Al-Zahra',
    sellerAr: 'فاطمة الزهراء',
    category: 'Food & Beverages',
    categoryAr: 'المواد الغذائية والمشروبات',
    price: 28.75,
    status: 'Approved',
    saso: true,
    halal: true,
    submitDate: '2024-01-18',
    reviewedBy: 'Admin User',
    priority: 'Medium',
    images: ['/images/coffee1.jpg'],
    description: 'Authentic Saudi coffee blend with cardamom',
    descriptionAr: 'خليط قهوة سعودية أصيلة مع الهيل'
  },
  {
    id: '3',
    name: 'Saudi Thobe - White',
    nameAr: 'ثوب سعودي - أبيض',
    seller: 'Mohammed Al-Sudairi',
    sellerAr: 'محمد السديري',
    category: 'Clothing',
    categoryAr: 'الملابس',
    price: 95.00,
    status: 'Under Review',
    saso: false,
    halal: true,
    submitDate: '2024-01-19',
    priority: 'Medium',
    images: ['/images/thobe1.jpg'],
    description: 'Traditional Saudi white thobe for men',
    descriptionAr: 'ثوب سعودي تقليدي أبيض للرجال'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    case 'Approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
    case 'Rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
    case 'Under Review':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Under Review</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
    case 'Medium':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
    case 'Low':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
    default:
      return <Badge>{priority}</Badge>
  }
}

const formatSARCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameAr.includes(searchTerm) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleApprove = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: 'Approved' as const, reviewedBy: 'Current Admin' }
        : p
    ))
    setSelectedProduct(null)
    setReviewNotes('')
  }

  const handleReject = (productId: string) => {
    if (!reviewNotes.trim()) {
      alert('Please add rejection notes')
      return
    }
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: 'Rejected' as const, reviewedBy: 'Current Admin' }
        : p
    ))
    setSelectedProduct(null)
    setReviewNotes('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Review and approve products submitted by sellers</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Products</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-yellow-600">↗ +23 new products</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Products</p>
              <p className="text-2xl font-bold text-gray-900">3,247</p>
              <p className="text-xs text-green-600">↗ +145 this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected Products</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-xs text-red-600">↘ -12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">3,492</p>
              <p className="text-xs text-blue-600">↗ +8.2% monthly growth</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
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
              placeholder="Search for products..."
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
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Under Review">Under Review</option>
          </select>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Garden">Home & Garden</option>
          </select>
          <Button variant="outline" className="px-4">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Product</TableHead>
              <TableHead className="text-left">Seller</TableHead>
              <TableHead className="text-left">Category</TableHead>
              <TableHead className="text-left">Price</TableHead>
              <TableHead className="text-left">Status</TableHead>
              <TableHead className="text-left">Priority</TableHead>
              <TableHead className="text-left">SASO</TableHead>
              <TableHead className="text-left">Halal</TableHead>
              <TableHead className="text-left">Submit Date</TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.nameAr}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{product.seller}</p>
                    <p className="text-sm text-gray-500">{product.sellerAr}</p>
                  </div>
                </TableCell>
                <TableCell className="text-left">{product.category}</TableCell>
                <TableCell className="text-left font-medium">
                  {formatSARCurrency(product.price)}
                </TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell>{getPriorityBadge(product.priority)}</TableCell>
                <TableCell>
                  {product.saso ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </TableCell>
                <TableCell>
                  {product.halal ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </TableCell>
                <TableCell className="text-left">{formatDate(product.submitDate)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Product Review</DialogTitle>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Product Name (Arabic)</label>
                                <p className="text-lg font-semibold">{selectedProduct.nameAr}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Product Name (English)</label>
                                <p className="text-lg">{selectedProduct.name}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Seller</label>
                                <p>{selectedProduct.seller}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Price</label>
                                <p className="font-semibold text-green-600">
                                  {formatSARCurrency(selectedProduct.price)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Description</label>
                              <p className="mt-1">{selectedProduct.description}</p>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">SASO:</span>
                                {selectedProduct.saso ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Halal:</span>
                                {selectedProduct.halal ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <X className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Review Notes</label>
                              <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add your notes here..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedProduct(null)
                                  setReviewNotes('')
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(selectedProduct.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleApprove(selectedProduct.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
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
                          Quick Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <X className="w-4 h-4 mr-2" />
                          Reject
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
              Showing 1 to {filteredProducts.length} of {products.length} products
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
                3
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