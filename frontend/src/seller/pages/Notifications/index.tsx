import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

// Import shared UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface Notification {
  id: string;
  type: 'order' | 'lead' | 'payment' | 'message' | 'system' | 'inventory';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  metadata?: {
    orderId?: string;
    leadId?: string;
    amount?: number;
    productName?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 from Ahmed Al-Hassan for Industrial Water Pump',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    priority: 'high',
    actionUrl: '/seller/orders/details/ORD-2024-001',
    metadata: { orderId: 'ORD-2024-001', amount: 15000 }
  },
  {
    id: '2',
    type: 'lead',
    title: 'High-Value Lead Assigned',
    message: 'New qualified lead from Saudi Petrochemicals Company - Potential value: 250,000 SAR',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    priority: 'high',
    actionUrl: '/seller/leads/details/LED-2024-045',
    metadata: { leadId: 'LED-2024-045', amount: 250000 }
  },
  {
    id: '3',
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Industrial Water Pump HP-2000 is running low (5 units remaining)',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
    priority: 'medium',
    actionUrl: '/seller/products/inventory',
    metadata: { productName: 'Industrial Water Pump HP-2000' }
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of 12,500 SAR received for invoice #INV-2024-089',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    priority: 'medium',
    actionUrl: '/seller/finance/payments',
    metadata: { amount: 12500 }
  },
  {
    id: '5',
    type: 'message',
    title: 'New Customer Message',
    message: 'Message from Riyadh Construction Ltd regarding bulk order inquiry',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false,
    priority: 'medium',
    actionUrl: '/seller/communication/hub'
  },
  {
    id: '6',
    type: 'system',
    title: 'Profile Verification Complete',
    message: 'Your business documents have been verified and approved',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    priority: 'low',
    actionUrl: '/seller/profile/documents'
  },
  {
    id: '7',
    type: 'order',
    title: 'Order Status Updated',
    message: 'Order #ORD-2024-089 has been marked as delivered by customer',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: 'low',
    actionUrl: '/seller/orders/details/ORD-2024-089',
    metadata: { orderId: 'ORD-2024-089' }
  },
  {
    id: '8',
    type: 'lead',
    title: 'Lead Follow-up Due',
    message: 'Follow-up scheduled with Al-Rajhi Industries is due in 1 hour',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    priority: 'medium',
    actionUrl: '/seller/leads/follow-up'
  }
];

export const Notifications: React.FC = () => {
  const { isRTL } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'order' | 'lead' | 'payment' | 'message' | 'system' | 'inventory'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBagIcon className="w-5 h-5" />;
      case 'lead':
        return <UserGroupIcon className="w-5 h-5" />;
      case 'payment':
        return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'message':
        return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
      case 'inventory':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'system':
        return <InformationCircleIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'text-red-600 bg-red-100';
    
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-100';
      case 'lead':
        return 'text-green-600 bg-green-100';
      case 'payment':
        return 'text-emerald-600 bg-emerald-100';
      case 'message':
        return 'text-purple-600 bg-purple-100';
      case 'inventory':
        return 'text-orange-600 bg-orange-100';
      case 'system':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">{isRTL ? 'عالية' : 'High'}</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">{isRTL ? 'متوسطة' : 'Medium'}</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">{isRTL ? 'منخفضة' : 'Low'}</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return isRTL ? 'الآن' : 'Just now';
    } else if (minutes < 60) {
      return isRTL ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    } else if (hours < 24) {
      return isRTL ? `منذ ${hours} ساعة` : `${hours}h ago`;
    } else {
      return isRTL ? `منذ ${days} يوم` : `${days}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'high':
        return notification.priority === 'high';
      case 'all':
        return true;
      default:
        return notification.type === filter;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.has(notification.id)));
    setSelectedNotifications(new Set());
  };

  const markSelectedAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => 
        selectedNotifications.has(notification.id) ? { ...notification, isRead: true } : notification
      )
    );
    setSelectedNotifications(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BellIcon className="w-7 h-7 mr-3 text-blue-600" />
            {isRTL ? 'مركز الإشعارات' : 'Notifications Center'}
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-600 text-white">
                {unreadCount} {isRTL ? 'جديد' : 'new'}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRTL 
              ? 'إدارة جميع إشعاراتك والتحديثات المهمة' 
              : 'Manage all your notifications and important updates'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedNotifications.size > 0 && (
            <>
              <Button
                variant="outline"
                onClick={markSelectedAsRead}
                className="flex items-center space-x-2"
              >
                <CheckCircleIcon className="w-4 h-4" />
                <span>{isRTL ? 'قراءة المحدد' : 'Mark Selected as Read'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={deleteSelected}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
                <span>{isRTL ? 'حذف المحدد' : 'Delete Selected'}</span>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            {isRTL ? 'قراءة الكل' : 'Mark All as Read'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'إجمالي الإشعارات' : 'Total Notifications'}</p>
                <p className="text-2xl font-semibold">{notifications.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'غير مقروءة' : 'Unread'}</p>
                <p className="text-2xl font-semibold text-orange-600">{unreadCount}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <EyeIcon className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'أولوية عالية' : 'High Priority'}</p>
                <p className="text-2xl font-semibold text-red-600">{highPriorityCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{isRTL ? 'اليوم' : 'Today'}</p>
                <p className="text-2xl font-semibold text-green-600">
                  {notifications.filter(n => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return n.timestamp >= today;
                  }).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {isRTL ? 'تصفية حسب:' : 'Filter by:'}
              </span>
            </div>
            
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الإشعارات' : 'All Notifications'}</SelectItem>
                <SelectItem value="unread">{isRTL ? 'غير مقروءة' : 'Unread Only'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'أولوية عالية' : 'High Priority'}</SelectItem>
                <SelectItem value="order">{isRTL ? 'الطلبات' : 'Orders'}</SelectItem>
                <SelectItem value="lead">{isRTL ? 'العملاء المحتملين' : 'Leads'}</SelectItem>
                <SelectItem value="payment">{isRTL ? 'المدفوعات' : 'Payments'}</SelectItem>
                <SelectItem value="message">{isRTL ? 'الرسائل' : 'Messages'}</SelectItem>
                <SelectItem value="inventory">{isRTL ? 'المخزون' : 'Inventory'}</SelectItem>
                <SelectItem value="system">{isRTL ? 'النظام' : 'System'}</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500">
              {isRTL 
                ? `عرض ${filteredNotifications.length} من ${notifications.length} إشعار`
                : `Showing ${filteredNotifications.length} of ${notifications.length} notifications`
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isRTL ? 'لا توجد إشعارات' : 'No Notifications'}
              </h3>
              <p className="text-gray-500">
                {isRTL 
                  ? 'لا توجد إشعارات تطابق الفلترة المحددة'
                  : 'No notifications match the selected filter'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
              } ${
                selectedNotifications.has(notification.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.has(notification.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(notification.id);
                    }}
                    className="mt-1"
                  />
                  
                  <div className={`p-2 rounded-full ${getIconColor(notification.type, notification.priority)}`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {getPriorityBadge(notification.priority)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        {notification.metadata && (
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {notification.metadata.amount && (
                              <span>{notification.metadata.amount.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</span>
                            )}
                            {notification.metadata.orderId && (
                              <span>{notification.metadata.orderId}</span>
                            )}
                            {notification.metadata.productName && (
                              <span>{notification.metadata.productName}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <div className="flex items-center space-x-1">
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.actionUrl!;
                              }}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;