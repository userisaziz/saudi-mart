import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  ArrowLeftIcon,
  PrinterIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'stc_pay' | 'mada' | 'cash';
  customer: {
    name: string;
    company: string;
    email: string;
    phone: string;
    taxId?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  orderDate: string;
  estimatedDelivery?: string;
  notes?: string;
  timeline: Array<{
    id: string;
    status: string;
    timestamp: string;
    note?: string;
    user?: string;
  }>;
  priority: 'low' | 'medium' | 'high';
}

const mockOrderDetails: OrderDetails = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  status: 'processing',
  paymentStatus: 'paid',
  paymentMethod: 'bank_transfer',
  customer: {
    name: 'Ahmed Al-Rashid',
    company: 'Al-Rashid Trading Company',
    email: 'ahmed@alrashid-trading.sa',
    phone: '+966 50 123 4567',
    taxId: '300123456789003',
  },
  shippingAddress: {
    street: 'King Fahd Road, Building 123, Floor 4',
    city: 'Riyadh',
    region: 'Riyadh Province',
    postalCode: '11564',
    country: 'Saudi Arabia',
  },
  billingAddress: {
    street: 'King Fahd Road, Building 123, Floor 4',
    city: 'Riyadh',
    region: 'Riyadh Province',
    postalCode: '11564',
    country: 'Saudi Arabia',
  },
  items: [
    {
      id: '1',
      name: 'Industrial Water Pump HP-2000',
      sku: 'PUMP-HP-2000',
      quantity: 2,
      unitPrice: 15000,
      totalPrice: 30000,
    },
    {
      id: '2',
      name: 'Pressure Control Valve 4-inch',
      sku: 'VALVE-PC-4IN',
      quantity: 5,
      unitPrice: 2500,
      totalPrice: 12500,
    },
  ],
  subtotal: 42500,
  tax: 6375, // 15% VAT
  shipping: 500,
  discount: 1000,
  total: 48375,
  orderDate: '2024-03-15T10:30:00Z',
  estimatedDelivery: '2024-03-20T17:00:00Z',
  notes: 'Urgent delivery required for construction project. Please handle with care.',
  timeline: [
    {
      id: '1',
      status: 'pending',
      timestamp: '2024-03-15T10:30:00Z',
      note: 'Order placed by customer',
    },
    {
      id: '2',
      status: 'confirmed',
      timestamp: '2024-03-15T11:15:00Z',
      note: 'Order confirmed and payment verified',
      user: 'System',
    },
    {
      id: '3',
      status: 'processing',
      timestamp: '2024-03-15T14:20:00Z',
      note: 'Items picked from warehouse and preparing for shipment',
      user: 'Warehouse Team',
    },
  ],
  priority: 'high',
};

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
  cancelled: XCircleIcon,
  refunded: ExclamationTriangleIcon,
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [order, setOrder] = useState<OrderDetails>(mockOrderDetails);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'communication'>('details');
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderDetails['status']>(order.status);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = () => {
    setOrder(prev => ({ ...prev, status: newStatus }));
    setStatusUpdateModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/seller/orders/list')}
            className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('orders.orderDetails')} #{order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              {formatDate(order.orderDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => setStatusUpdateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PencilIcon className="w-4 h-4" />
            {t('orders.updateStatus')}
          </button>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${statusColors[order.status]}`}>
              <StatusIcon className="w-4 h-4" />
              {t(`orderStatus.${order.status}`)}
            </div>
            
            <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${paymentStatusColors[order.paymentStatus]}`}>
              <CreditCardIcon className="w-4 h-4 mr-1" />
              Payment: {order.paymentStatus}
            </div>

            {order.priority === 'high' && (
              <span className="px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg">
                High Priority
              </span>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
            <p className="text-sm text-gray-500">{order.items.length} items</p>
          </div>
        </div>
        
        {order.estimatedDelivery && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                Estimated Delivery: {formatDate(order.estimatedDelivery)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('orders.orderTimeline')}
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'communication'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Communication
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Customer and Addresses */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    {t('orders.customerInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-sm text-gray-600">{order.customer.company}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      {order.customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      {order.customer.phone}
                    </div>
                    {order.customer.taxId && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        Tax ID: {order.customer.taxId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TruckIcon className="w-5 h-5" />
                    {t('orders.shippingInfo')}
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                      <p>{order.shippingAddress.postalCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5" />
                    {t('orders.paymentInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('orders.orderItems')}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('orders.orderSummary')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orders.subtotal')}:</span>
                    <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orders.tax')}:</span>
                    <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('orders.shipping')}:</span>
                    <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('orders.discount')}:</span>
                      <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">{t('orders.grandTotal')}:</span>
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Order Notes:</h4>
                  <p className="text-sm text-yellow-700">{order.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('orders.orderTimeline')}</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.timeline.map((event, eventIdx) => {
                    const EventIcon = statusIcons[event.status as keyof typeof statusIcons] || ClockIcon;
                    return (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== order.timeline.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <EventIcon className="w-4 h-4 text-blue-600" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  {event.note}
                                  {event.user && (
                                    <span className="font-medium text-gray-900"> by {event.user}</span>
                                  )}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={event.timestamp}>
                                  {formatDate(event.timestamp)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Communication</h3>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No messages yet</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {t('orders.contactCustomer')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {statusUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('orders.updateStatus')}
              </h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderDetails['status'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="pending">{t('orderStatus.pending')}</option>
                <option value="confirmed">{t('orderStatus.confirmed')}</option>
                <option value="processing">{t('orderStatus.processing')}</option>
                <option value="shipped">{t('orderStatus.shipped')}</option>
                <option value="delivered">{t('orderStatus.delivered')}</option>
                <option value="cancelled">{t('orderStatus.cancelled')}</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setStatusUpdateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;