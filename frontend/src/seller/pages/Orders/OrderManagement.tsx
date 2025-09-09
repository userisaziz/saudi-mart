import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
} from '@heroicons/react/24/solid';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    company?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  rating?: number;
  feedback?: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: 'CUST-001',
    customerName: 'Ahmed Al-Rashid',
    customerEmail: 'ahmed@constructco.sa',
    customerPhone: '+966 50 123 4567',
    items: [
      {
        id: '1',
        productId: 'PROD-001',
        productName: 'Industrial Water Pump HP-2000',
        sku: 'PUMP-HP-2000',
        quantity: 2,
        price: 15000,
        total: 30000,
      },
      {
        id: '2',
        productId: 'PROD-002',
        productName: 'Pressure Control Valve 4-inch',
        sku: 'VALVE-PC-4IN',
        quantity: 5,
        price: 2500,
        total: 12500,
      },
    ],
    subtotal: 42500,
    tax: 6375,
    shipping: 500,
    discount: 0,
    total: 49375,
    currency: 'SAR',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Bank Transfer',
    shippingAddress: {
      name: 'Ahmed Al-Rashid',
      company: 'Al-Rashid Construction Co.',
      address: 'King Fahd Industrial District, Building 15',
      city: 'Riyadh',
      state: 'Riyadh Province',
      zipCode: '11564',
      country: 'Saudi Arabia',
    },
    estimatedDelivery: '2024-03-25',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-16T14:20:00Z',
    priority: 'high',
    rating: 5,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: 'CUST-002',
    customerName: 'Fatima Al-Zahra',
    customerEmail: 'fatima@techinnovate.sa',
    customerPhone: '+966 55 987 6543',
    items: [
      {
        id: '3',
        productId: 'PROD-003',
        productName: 'Three-Phase Electric Motor 50HP',
        sku: 'MOTOR-3PH-50HP',
        quantity: 1,
        price: 25000,
        total: 25000,
      },
    ],
    subtotal: 25000,
    tax: 3750,
    shipping: 300,
    discount: 1250,
    total: 27800,
    currency: 'SAR',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      name: 'Fatima Al-Zahra',
      company: 'Tech Innovate Solutions',
      address: 'Al-Olaya District, Tower 3, Floor 12',
      city: 'Riyadh',
      state: 'Riyadh Province',
      zipCode: '11433',
      country: 'Saudi Arabia',
    },
    trackingNumber: 'TRK-2024-5678',
    estimatedDelivery: '2024-03-20',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-17T16:45:00Z',
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerId: 'CUST-003',
    customerName: 'Mohammad bin Salman',
    customerEmail: 'mohammad@petroequip.sa',
    customerPhone: '+966 50 555 1234',
    items: [
      {
        id: '4',
        productId: 'PROD-004',
        productName: 'Hydraulic Cylinder 200mm Bore',
        sku: 'CYL-HYD-200MM',
        quantity: 10,
        price: 8500,
        total: 85000,
      },
    ],
    subtotal: 85000,
    tax: 12750,
    shipping: 1200,
    discount: 4250,
    total: 94700,
    currency: 'SAR',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Invoice',
    shippingAddress: {
      name: 'Mohammad bin Salman',
      company: 'Petro Equipment Trading',
      address: 'Industrial City 2, Warehouse Complex A',
      city: 'Dammam',
      state: 'Eastern Province',
      zipCode: '34334',
      country: 'Saudi Arabia',
    },
    createdAt: '2024-03-18T11:00:00Z',
    updatedAt: '2024-03-18T11:00:00Z',
    priority: 'urgent',
  },
];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: ClockIcon },
  confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircleIcon },
  processing: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: ArrowPathIcon },
  shipped: { color: 'bg-green-100 text-green-800 border-green-200', icon: TruckIcon },
  delivered: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircleIconSolid },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XMarkIcon },
  returned: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: ArrowPathIcon },
};

const paymentStatusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  paid: { color: 'bg-green-100 text-green-800', icon: CheckCircleIconSolid },
  failed: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIconSolid },
  refunded: { color: 'bg-gray-100 text-gray-800', icon: ArrowPathIcon },
};

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-800', badge: '🔵' },
  medium: { color: 'bg-blue-100 text-blue-800', badge: '🟡' },
  high: { color: 'bg-orange-100 text-orange-800', badge: '🟠' },
  urgent: { color: 'bg-red-100 text-red-800', badge: '🔴' },
};

interface OrderFilters {
  search: string;
  status: string;
  paymentStatus: string;
  priority: string;
  dateRange: { start: string; end: string };
}

const OrderManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'total' | 'priority'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    priority: 'all',
    dateRange: { start: '', end: '' },
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (filters.search.trim()) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.sku.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    // Status filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(order => order.priority === filters.priority);
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      }

      return sortOrder === 'asc' ? 
        (aValue > bValue ? 1 : -1) : 
        (aValue < bValue ? 1 : -1);
    });

    setFilteredOrders(filtered);
  }, [orders, filters, sortBy, sortOrder]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length ? [] : filteredOrders.map(o => o.id)
    );
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentStatus: 'all',
      priority: 'all',
      dateRange: { start: '', end: '' },
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'dateRange') {
      return value.start || value.end;
    }
    return value !== 'all' && value !== '';
  });

  const handleOrderAction = (orderId: string, action: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, updatedAt: new Date().toISOString() };
        switch (action) {
          case 'confirm':
            updatedOrder.status = 'confirmed';
            break;
          case 'process':
            updatedOrder.status = 'processing';
            break;
          case 'ship':
            updatedOrder.status = 'shipped';
            updatedOrder.trackingNumber = `TRK-${Date.now()}`;
            break;
          case 'deliver':
            updatedOrder.status = 'delivered';
            break;
          case 'cancel':
            updatedOrder.status = 'cancelled';
            break;
        }
        return updatedOrder;
      }
      return order;
    }));
  };

  // Statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      totalRevenue,
      avgOrderValue,
    };
  }, [orders]);

  const OrderDetailsModal = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600">{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Order Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
                <div className="flex items-center gap-2">
                  {priorityConfig[order.priority].badge}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[order.priority].color}`}>
                    {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Order Status</label>
                  <div className={`mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status].color}`}>
                    {React.createElement(statusConfig[order.status].icon, { className: "w-3 h-3" })}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Payment Status</label>
                  <div className={`mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.paymentStatus].color}`}>
                    {React.createElement(paymentStatusConfig[order.paymentStatus].icon, { className: "w-3 h-3" })}
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <UserIcon className="w-12 h-12 text-gray-400 bg-white rounded-full p-2 border-2 border-gray-200" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{order.customerName}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <EnvelopeIcon className="w-4 h-4" />
                        {order.customerEmail}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        {order.customerPhone}
                      </div>
                      {order.shippingAddress.company && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-4 h-4 flex items-center justify-center">🏢</span>
                          {order.shippingAddress.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    {order.shippingAddress.company && (
                      <p className="text-sm text-gray-600">{order.shippingAddress.company}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(item.total, order.currency)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(item.price, order.currency)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-{formatCurrency(order.discount, order.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">{formatCurrency(order.tax, order.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-900">{formatCurrency(order.shipping, order.currency)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{formatCurrency(order.total, order.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Information</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Tracking Number: {order.trackingNumber}</p>
                      {order.estimatedDelivery && (
                        <p className="text-sm text-blue-700 mt-1">
                          Estimated Delivery: {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Rating */}
            {order.rating && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Feedback</h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({order.rating}/5)</span>
                  </div>
                  {order.feedback && (
                    <p className="text-sm text-gray-700">{order.feedback}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PrinterIcon className="w-4 h-4" />
                  Print Invoice
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="flex items-center gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleOrderAction(order.id, 'confirm')}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm Order
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleOrderAction(order.id, 'process')}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => handleOrderAction(order.id, 'ship')}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark as Shipped
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'table' ? '📋' : '📦'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-purple-600">{stats.processingOrders}</p>
            </div>
            <ArrowPathIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-green-600">{stats.shippedOrders}</p>
            </div>
            <TruckIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.avgOrderValue)}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, or products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="total">Sort by Total</option>
            <option value="priority">Sort by Priority</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {selectedOrders.length} orders selected
              </span>
              <button
                onClick={() => setSelectedOrders([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Update Status
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                Mark as Shipped
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table/Cards */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  const PaymentIcon = paymentStatusConfig[order.paymentStatus].icon;
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">{order.orderNumber}</div>
                            <span className="text-xs">{priorityConfig[order.priority].badge}</span>
                          </div>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.paymentStatus].color}`}>
                          <PaymentIcon className="w-3 h-3" />
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(order.total, order.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <EllipsisVerticalIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                          <span className="text-xs">{priorityConfig[order.priority].badge}</span>
                        </div>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatusConfig[order.paymentStatus].color}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-lg text-gray-900">
                        {formatCurrency(order.total, order.currency)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">No orders match your current filters.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;