import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Bell,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Plus,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface QuickMetric {
  id: string;
  title: string;
  titleAr: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
}

interface QuickAction {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  icon: any;
  color: string;
  href: string;
}

interface RecentItem {
  id: string;
  type: 'order' | 'lead' | 'message' | 'alert';
  title: string;
  subtitle: string;
  time: string;
  status?: 'urgent' | 'normal' | 'info';
  avatar?: string;
}

export const MobileDashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const quickMetrics: QuickMetric[] = [
    {
      id: '1',
      title: "Today's Sales",
      titleAr: 'مبيعات اليوم',
      value: '$12,450',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: '2',
      title: 'New Orders',
      titleAr: 'طلبات جديدة',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'text-blue-600'
    },
    {
      id: '3',
      title: 'Active Leads',
      titleAr: 'عملاء محتملون',
      value: '15',
      change: '+5',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: '4',
      title: 'Conversion Rate',
      titleAr: 'معدل التحويل',
      value: '3.8%',
      change: '+0.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Add Product',
      titleAr: 'إضافة منتج',
      subtitle: 'Create new listing',
      subtitleAr: 'إنشاء منتج جديد',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/seller/products/add'
    },
    {
      id: '2',
      title: 'View Orders',
      titleAr: 'عرض الطلبات',
      subtitle: 'Manage orders',
      subtitleAr: 'إدارة الطلبات',
      icon: ShoppingBag,
      color: 'bg-green-500',
      href: '/seller/orders/list'
    },
    {
      id: '3',
      title: 'Leads Inbox',
      titleAr: 'صندوق العملاء',
      subtitle: 'Follow up leads',
      subtitleAr: 'متابعة العملاء',
      icon: MessageSquare,
      color: 'bg-purple-500',
      href: '/seller/leads/inbox'
    },
    {
      id: '4',
      title: 'Analytics',
      titleAr: 'التحليلات',
      subtitle: 'View insights',
      subtitleAr: 'عرض الإحصائيات',
      icon: BarChart3,
      color: 'bg-orange-500',
      href: '/seller/analytics/growth'
    }
  ];

  const recentItems: RecentItem[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order #ORD-001',
      subtitle: 'Saudi Industries Corp - $5,200',
      time: '5m ago',
      status: 'urgent'
    },
    {
      id: '2',
      type: 'lead',
      title: 'Ahmed Al-Mahmoud',
      subtitle: 'Interested in bulk steel pipes',
      time: '12m ago',
      status: 'normal',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      type: 'message',
      title: 'Customer Support',
      subtitle: 'Payment inquiry from client',
      time: '25m ago',
      status: 'info'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Low Stock Alert',
      subtitle: '5 products need restocking',
      time: '1h ago',
      status: 'urgent'
    },
    {
      id: '5',
      type: 'lead',
      title: 'Fatima Al-Zahra',
      subtitle: 'Requested quote for LED panels',
      time: '2h ago',
      status: 'normal',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getItemIcon = (type: string, status?: string) => {
    const iconClass = `h-4 w-4 ${status === 'urgent' ? 'text-red-600' : 'text-gray-600'}`;
    
    switch (type) {
      case 'order':
        return <ShoppingBag className={iconClass} />;
      case 'lead':
        return <Users className={iconClass} />;
      case 'message':
        return <MessageSquare className={iconClass} />;
      case 'alert':
        return <AlertTriangle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* Bottom padding for mobile navigation */}
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {isRTL ? 'مرحباً بك' : 'Welcome back'}
              </h1>
              <p className="text-sm text-gray-600">
                {isRTL ? 'Industrial Solutions' : 'Industrial Solutions'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">IS</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={isRTL ? 'البحث عن المنتجات والطلبات...' : 'Search products, orders...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {quickMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.id} className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-1.5 rounded-md bg-gray-100 ${metric.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge
                      variant={metric.changeType === 'positive' ? 'default' : 'destructive'}
                      className="text-xs px-1.5 py-0.5"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      {isRTL ? metric.titleAr : metric.title}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.id} className="p-0 overflow-hidden">
                <button 
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.href = action.href}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {isRTL ? action.titleAr : action.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {isRTL ? action.subtitleAr : action.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
          </h2>
          <Button variant="ghost" size="sm" className="text-xs text-blue-600 p-0 h-auto">
            {isRTL ? 'عرض الكل' : 'View All'}
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {recentItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center space-x-3 p-3">
                  <div className="flex-shrink-0">
                    {item.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback className="text-xs">
                          {item.title.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getItemIcon(item.type, item.status)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {item.time}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {index < recentItems.length - 1 && <div className="border-b border-gray-100 ml-14" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 px-2 py-1 h-auto">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">
              {isRTL ? 'لوحة التحكم' : 'Dashboard'}
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 px-2 py-1 h-auto">
            <ShoppingBag className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500">
              {isRTL ? 'الطلبات' : 'Orders'}
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 px-2 py-1 h-auto">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500">
              {isRTL ? 'العملاء' : 'Leads'}
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 px-2 py-1 h-auto">
            <MessageSquare className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500">
              {isRTL ? 'الرسائل' : 'Messages'}
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 px-2 py-1 h-auto">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500">
              {isRTL ? 'المالية' : 'Finance'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};