import React, { useState, useEffect } from 'react'
import {
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Warehouse
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
import { useLanguage } from '@/shared/contexts/LanguageContext'

interface InventoryItem {
  id: string
  productId: string
  productName: string
  productNameAr: string
  sku: string
  sellerId: string
  sellerName: string
  category: string
  categoryAr: string
  currentStock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
  reorderPoint: number
  price: number
  lastUpdated: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
  stockMovements: Array<{
    date: string
    type: 'in' | 'out' | 'adjustment'
    quantity: number
    reason: string
  }>
  location: string
  cost: number
  margin: number
  currency: 'SAR' | 'USD'
}

const mockInventoryData: InventoryItem[] = [
  {
    id: 'INV-001',
    productId: 'PROD-001',
    productName: 'Industrial Steel Pipe',
    productNameAr: 'أنبوب صلب صناعي',
    sku: 'ISP-001',
    sellerId: 'SELL-001',
    sellerName: 'شركة الأحمد للصناعات',
    category: 'Industrial Materials',
    categoryAr: 'المواد الصناعية',
    currentStock: 150,
    reservedStock: 50,
    availableStock: 100,
    lowStockThreshold: 20,
    reorderPoint: 30,
    price: 250,
    lastUpdated: '2024-01-15T10:30:00Z',
    status: 'in_stock',
    stockMovements: [
      { date: '2024-01-15', type: 'out', quantity: 50, reason: 'Order fulfillment' },
      { date: '2024-01-14', type: 'in', quantity: 100, reason: 'Stock replenishment' }
    ],
    location: 'Warehouse A - Section 1',
    cost: 200,
    margin: 25,
    currency: 'SAR'
  },
  {
    id: 'INV-002',
    productId: 'PROD-002',
    productName: 'LED Panel System',
    productNameAr: 'نظام لوحات LED',
    sku: 'LED-002',
    sellerId: 'SELL-002',
    sellerName: 'مصنع السعيد للمعادن',
    category: 'Lighting Systems',
    categoryAr: 'أنظمة الإضاءة',
    currentStock: 15,
    reservedStock: 10,
    availableStock: 5,
    lowStockThreshold: 20,
    reorderPoint: 25,
    price: 450,
    lastUpdated: '2024-01-14T14:20:00Z',
    status: 'low_stock',
    stockMovements: [
      { date: '2024-01-14', type: 'out', quantity: 20, reason: 'Bulk order' },
      { date: '2024-01-10', type: 'in', quantity: 35, reason: 'New shipment' }
    ],
    location: 'Warehouse B - Section 3',
    cost: 350,
    margin: 28.6,
    currency: 'SAR'
  }
]

const ProductInventoryPage: React.FC = () => {
  const { t, isRTL } = useLanguage()
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryData)
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(mockInventoryData)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filter inventory
  useEffect(() => {
    let filtered = inventory

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productNameAr.includes(searchQuery) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    setFilteredInventory(filtered)
    setCurrentPage(1)
  }, [inventory, searchQuery, statusFilter, categoryFilter])

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_stock: { color: 'bg-green-100 text-green-800', text: isRTL ? 'متوفر' : 'In Stock' },
      low_stock: { color: 'bg-yellow-100 text-yellow-800', text: isRTL ? 'مخزون منخفض' : 'Low Stock' },
      out_of_stock: { color: 'bg-red-100 text-red-800', text: isRTL ? 'نفد المخزون' : 'Out of Stock' },
      discontinued: { color: 'bg-gray-100 text-gray-800', text: isRTL ? 'متوقف' : 'Discontinued' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.text}</Badge>
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate metrics
  const metrics = {
    totalProducts: filteredInventory.length,
    lowStockItems: filteredInventory.filter(item => item.status === 'low_stock').length,
    outOfStockItems: filteredInventory.filter(item => item.status === 'out_of_stock').length,
    totalValue: filteredInventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  }

  const categories = Array.from(new Set(inventory.map(item => item.category)))

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'إدارة المخزون' : 'Inventory Management'}
          </h1>
          <p className="text-gray-600">
            {isRTL ? 'مراقبة وإدارة مستويات المخزون للمنتجات' : 'Monitor and manage product inventory levels'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي المنتجات' : 'Total Products'}</p>
                <p className="text-2xl font-bold">{metrics.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</p>
                <p className="text-2xl font-bold text-red-600">{metrics.outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Warehouse className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{isRTL ? 'القيمة الإجمالية' : 'Total Value'}</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalValue, 'SAR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  className="pl-10"
                  placeholder={isRTL ? 'البحث في المخزون...' : 'Search inventory...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="in_stock">{isRTL ? 'متوفر' : 'In Stock'}</SelectItem>
                <SelectItem value="low_stock">{isRTL ? 'مخزون منخفض' : 'Low Stock'}</SelectItem>
                <SelectItem value="out_of_stock">{isRTL ? 'نفد المخزون' : 'Out of Stock'}</SelectItem>
                <SelectItem value="discontinued">{isRTL ? 'متوقف' : 'Discontinued'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'الفئة' : 'Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'المنتج' : 'Product'}</TableHead>
                <TableHead>{isRTL ? 'البائع' : 'Seller'}</TableHead>
                <TableHead>{isRTL ? 'المخزون الحالي' : 'Current Stock'}</TableHead>
                <TableHead>{isRTL ? 'المتاح' : 'Available'}</TableHead>
                <TableHead>{isRTL ? 'الحد الأدنى' : 'Low Threshold'}</TableHead>
                <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isRTL ? 'السعر' : 'Price'}</TableHead>
                <TableHead>{isRTL ? 'آخر تحديث' : 'Last Updated'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventory.map((item) => (
                <TableRow key={item.id} className={item.status === 'low_stock' ? 'bg-yellow-50' : item.status === 'out_of_stock' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{isRTL ? item.productNameAr : item.productName}</div>
                      <div className="text-sm text-gray-500">{item.sku}</div>
                      <div className="text-xs text-gray-400">{isRTL ? item.categoryAr : item.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{item.sellerName}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.currentStock}
                      {item.status === 'low_stock' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {item.status === 'out_of_stock' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.availableStock}</div>
                      {item.reservedStock > 0 && (
                        <div className="text-xs text-gray-500">
                          {isRTL ? `محجوز: ${item.reservedStock}` : `Reserved: ${item.reservedStock}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.lowStockThreshold}</TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.price, item.currency)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(item.lastUpdated)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            {isRTL ? 'تعديل المخزون' : 'Edit Stock'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            {isRTL ? 'تقرير الحركة' : 'Movement Report'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {isRTL ? 'إعادة ترتيب' : 'Reorder'}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {isRTL ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Inventory Details Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? `تفاصيل المخزون - ${selectedItem.productNameAr}` : `Inventory Details - ${selectedItem.productName}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status */}
              <div>
                {getStatusBadge(selectedItem.status)}
              </div>

              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {isRTL ? 'معلومات المنتج' : 'Product Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}</p>
                      <p className="font-medium">{selectedItem.productNameAr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}</p>
                      <p className="font-medium">{selectedItem.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'رمز المنتج' : 'SKU'}</p>
                      <p className="font-medium">{selectedItem.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'البائع' : 'Seller'}</p>
                      <p className="font-medium">{selectedItem.sellerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'الفئة' : 'Category'}</p>
                      <p className="font-medium">{isRTL ? selectedItem.categoryAr : selectedItem.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'الموقع' : 'Location'}</p>
                      <p className="font-medium">{selectedItem.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Warehouse className="w-5 h-5" />
                    {isRTL ? 'معلومات المخزون' : 'Stock Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{selectedItem.currentStock}</p>
                      <p className="text-sm text-gray-600">{isRTL ? 'المخزون الحالي' : 'Current Stock'}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedItem.availableStock}</p>
                      <p className="text-sm text-gray-600">{isRTL ? 'المتاح' : 'Available'}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{selectedItem.reservedStock}</p>
                      <p className="text-sm text-gray-600">{isRTL ? 'محجوز' : 'Reserved'}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{selectedItem.lowStockThreshold}</p>
                      <p className="text-sm text-gray-600">{isRTL ? 'الحد الأدنى' : 'Low Threshold'}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'نقطة إعادة الطلب' : 'Reorder Point'}</p>
                      <p className="font-medium">{selectedItem.reorderPoint}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'التكلفة' : 'Cost'}</p>
                      <p className="font-medium">{formatCurrency(selectedItem.cost, selectedItem.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'الهامش الربحي' : 'Margin'}</p>
                      <p className="font-medium">{selectedItem.margin}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Stock Movements */}
              {selectedItem.stockMovements && selectedItem.stockMovements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {isRTL ? 'آخر حركات المخزون' : 'Recent Stock Movements'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedItem.stockMovements.map((movement, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {movement.type === 'in' ? (
                              <TrendingUp className="w-5 h-5 text-green-500" />
                            ) : movement.type === 'out' ? (
                              <TrendingDown className="w-5 h-5 text-red-500" />
                            ) : (
                              <BarChart3 className="w-5 h-5 text-blue-500" />
                            )}
                            <div>
                              <p className="font-medium">{movement.reason}</p>
                              <p className="text-sm text-gray-600">{movement.date}</p>
                            </div>
                          </div>
                          <div className={`font-bold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                            {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ProductInventoryPage