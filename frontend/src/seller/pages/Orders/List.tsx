import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  orderDate: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'stc_pay' | 'mada' | 'cash';
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

interface FilterOptions {
  status: string;
  paymentStatus: string;
  dateRange: string;
  customerType: string;
  orderValue: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Ahmed Al-Rashid',
    customerEmail: 'ahmed@alrashid-trading.sa',
    customerPhone: '+966 50 123 4567',
    customerCompany: 'Al-Rashid Trading Company',
    orderDate: '2024-03-15T10:30:00Z',
    items: [
      { id: '1', name: 'Industrial Water Pump HP-2000', quantity: 2, price: 15000 },
      { id: '2', name: 'Pressure Control Valve 4-inch', quantity: 5, price: 2500 },
    ],
    subtotal: 42500,
    tax: 6375,
    shipping: 500,
    discount: 1000,
    total: 48375,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    shippingAddress: {
      street: 'King Fahd Road, Building 123',
      city: 'Riyadh',
      region: 'Riyadh Province',
      postalCode: '11564',
      country: 'Saudi Arabia',
    },
    notes: 'Urgent delivery required for construction project',
    priority: 'high',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Fatima Al-Zahra',
    customerEmail: 'fatima@modernfactory.sa',
    customerPhone: '+966 55 987 6543',
    customerCompany: 'Modern Factory Solutions',
    orderDate: '2024-03-14T14:15:00Z',
    items: [
      { id: '3', name: 'Three-Phase Electric Motor 50HP', quantity: 1, price: 25000 },
      { id: '4', name: 'Safety Equipment Package', quantity: 1, price: 5000 },
    ],
    subtotal: 30000,
    tax: 4500,
    shipping: 750,
    discount: 0,
    total: 35250,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'stc_pay',
    shippingAddress: {
      street: 'Industrial Area, Block C',
      city: 'Jeddah',
      region: 'Makkah Province',
      postalCode: '21577',
      country: 'Saudi Arabia',
    },
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Mohammad Al-Otaibi',
    customerEmail: 'mohammad@petrotech.sa',
    customerPhone: '+966 56 111 2233',
    customerCompany: 'PetroTech Industries',
    orderDate: '2024-03-13T09:45:00Z',
    items: [
      { id: '5', name: 'Hydraulic System Components', quantity: 3, price: 8000 },
    ],
    subtotal: 24000,
    tax: 3600,
    shipping: 400,
    discount: 500,
    total: 27500,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'card',
    shippingAddress: {
      street: 'Eastern Ring Road, Gate 5',
      city: 'Dammam',
      region: 'Eastern Province',
      postalCode: '31952',
      country: 'Saudi Arabia',
    },
    priority: 'low',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons = {
  pending: ClockIcon,
  confirmed: CheckCircleIcon,
  processing: AdjustmentsHorizontalIcon,
  shipped: TruckIcon,
  delivered: CheckCircleIcon,
  cancelled: XMarkIcon,
  refunded: ExclamationTriangleIcon,
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const OrdersList: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    customerType: 'all',
    orderValue: 'all',
  });
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loadedCount, setLoadedCount] = useState(10);

  // Filter and search logic
  const applyFiltersAndSearch = useMemo(() => {
    let filtered = [...orders];

    // Search functionality
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
      }
    }

    // Order value filter
    if (filters.orderValue !== 'all') {
      filtered = filtered.filter(order => {
        switch (filters.orderValue) {
          case 'under_10000':
            return order.total < 10000;
          case '10000_50000':
            return order.total >= 10000 && order.total <= 50000;
          case 'over_50000':
            return order.total > 50000;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'customer':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, searchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    setFilteredOrders(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  const displayedOrders = filteredOrders.slice(0, loadedCount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      paymentStatus: 'all',
      dateRange: 'all',
      customerType: 'all',
      orderValue: 'all',
    });
    setSearchQuery('');
    setShowFilters(false);
  };

  const loadMore = () => {
    setLoadedCount(prev => prev + 10);
  };

  const handleBulkStatusUpdate = (newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      selectedOrders.includes(order.id) 
        ? { ...order, status: newStatus }
        : order
    ));
    setSelectedOrders([]);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const completed = orders.filter(order => order.status === 'delivered').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    
    return { total, pending, completed, cancelled };
  };

  const stats = getOrderStats();
  const hasActiveFilters = Object.values(filters).some(value => value !== 'all') || searchQuery.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('orders.subtitle')} ({filteredOrders.length} orders)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FunnelIcon className="w-4 h-4" />
            {t('common.filter')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('orders.totalOrders')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('orders.pendingOrders')}</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('orders.completedOrders')}</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('orders.cancelledOrders')}</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XMarkIcon className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('orders.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">{t('orders.date')}</option>
              <option value="total">{t('orders.total')}</option>
              <option value="customer">{t('orders.customer')}</option>
              <option value="status">{t('orders.status')}</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? 
                <ArrowUpIcon className="w-4 h-4" /> : 
                <ArrowDownIcon className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('orders.status')}</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('orders.allStatuses')}</option>
                  <option value="pending">{t('orderStatus.pending')}</option>
                  <option value="confirmed">{t('orderStatus.confirmed')}</option>
                  <option value="processing">{t('orderStatus.processing')}</option>
                  <option value="shipped">{t('orderStatus.shipped')}</option>
                  <option value="delivered">{t('orderStatus.delivered')}</option>
                  <option value="cancelled">{t('orderStatus.cancelled')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('orders.dateRange')}</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('orders.orderValue')}</label>
                <select
                  value={filters.orderValue}
                  onChange={(e) => setFilters(prev => ({ ...prev, orderValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Values</option>
                  <option value="under_10000">Under 10,000 SAR</option>
                  <option value="10000_50000">10,000 - 50,000 SAR</option>
                  <option value="over_50000">Over 50,000 SAR</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('products.clearFilters')}
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
                {selectedOrders.length} {t('orders.selectedOrders')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleBulkStatusUpdate('processing')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('orders.markAsProcessing')}
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate('shipped')}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
              >
                {t('orders.markAsShipped')}
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate('delivered')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                {t('orders.markAsDelivered')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === displayedOrders.length && displayedOrders.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(displayedOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.orderNumber')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.customer')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.date')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.total')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orders.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedOrders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(prev => [...prev, order.id]);
                          } else {
                            setSelectedOrders(prev => prev.filter(id => id !== order.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{order.orderNumber}</div>
                        {order.priority === 'high' && (
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${priorityColors.high}`}>
                            High Priority
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerCompany}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</div>
                      <div className="text-xs text-gray-500">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>
                          {t(`orderStatus.${order.status}`)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/seller/orders/details/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 transition-colors">
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {displayedOrders.length < filteredOrders.length && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More ({filteredOrders.length - displayedOrders.length} remaining)
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('orders.noOrders')}</h3>
            <p className="text-gray-500 mb-6">{t('orders.noOrdersDesc')}</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('products.clearFilters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;