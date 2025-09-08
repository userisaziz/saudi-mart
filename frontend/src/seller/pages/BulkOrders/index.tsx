import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { DataTable } from '@/seller/components/ui/DataTable';
import { MetricsCard } from '@/seller/components/ui/MetricsCard';
import { FileUploader } from '@/seller/components/ui/FileUploader';
import {
  PlusIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ShoppingCartIcon,
  TruckIcon,
  ClipboardDocumentIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

// Types for Bulk Order Management
interface BulkOrder {
  id: string;
  orderNumber: string;
  supplier: {
    id: string;
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    location: string;
  };
  status: 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partial_received' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  currency: 'SAR' | 'USD';
  expectedDelivery: string;
  createdAt: string;
  updatedAt: string;
  orderType: 'inventory_restock' | 'new_products' | 'seasonal' | 'emergency';
  paymentTerms: string;
  deliveryAddress: string;
  notes?: string;
}

interface BulkOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  minOrderQuantity: number;
  currentStock: number;
  reorderPoint: number;
  supplierSku?: string;
  notes?: string;
}

interface OrderTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  supplier: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  items: BulkOrderItem[];
  isActive: boolean;
  lastUsed: string;
}

interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  recommendedQuantity: number;
  priority: 'high' | 'medium' | 'low';
  daysUntilStockout: number;
}

const BulkOrdersPage: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'create' | 'templates' | 'alerts' | 'analytics'>('orders');
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [orderTemplates, setOrderTemplates] = useState<OrderTemplate[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Initialize mock bulk orders
    const mockBulkOrders: BulkOrder[] = [
      {
        id: 'BO-001',
        orderNumber: 'BO-2024-001',
        supplier: {
          id: 'SUP-001',
          name: 'Saudi Industrial Supplies',
          nameAr: 'الإمدادات الصناعية السعودية',
          email: 'orders@saudiindustrial.com.sa',
          phone: '+966-11-4567890',
          location: 'Riyadh, Saudi Arabia'
        },
        status: 'approved',
        priority: 'high',
        totalItems: 25,
        totalQuantity: 500,
        totalAmount: 125000,
        currency: 'SAR',
        expectedDelivery: '2024-01-15',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
        orderType: 'inventory_restock',
        paymentTerms: 'Net 30',
        deliveryAddress: 'Riyadh Distribution Center',
        notes: 'Rush order for Q1 inventory restock'
      },
      {
        id: 'BO-002',
        orderNumber: 'BO-2024-002',
        supplier: {
          id: 'SUP-002',
          name: 'Gulf Manufacturing Co.',
          nameAr: 'شركة الخليج للتصنيع',
          email: 'procurement@gulf-mfg.com',
          phone: '+966-13-7890123',
          location: 'Dammam, Saudi Arabia'
        },
        status: 'pending_approval',
        priority: 'medium',
        totalItems: 15,
        totalQuantity: 300,
        totalAmount: 87500,
        currency: 'SAR',
        expectedDelivery: '2024-01-20',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03',
        orderType: 'new_products',
        paymentTerms: 'Net 45',
        deliveryAddress: 'Dammam Warehouse'
      }
    ];

    const mockTemplates: OrderTemplate[] = [
      {
        id: 'TPL-001',
        name: 'Monthly Steel Inventory',
        nameAr: 'مخزون الصلب الشهري',
        description: 'Regular monthly steel inventory restock',
        supplier: 'Saudi Steel Industries',
        frequency: 'monthly',
        items: [],
        isActive: true,
        lastUsed: '2023-12-01'
      }
    ];

    const mockAlerts: InventoryAlert[] = [
      {
        id: 'ALT-001',
        productId: 'PRD-001',
        productName: 'Steel Pipes 2"',
        sku: 'SP-2-001',
        currentStock: 15,
        reorderPoint: 50,
        recommendedQuantity: 200,
        priority: 'high',
        daysUntilStockout: 7
      },
      {
        id: 'ALT-002',
        productId: 'PRD-002',
        productName: 'Industrial Valves',
        sku: 'IV-001',
        currentStock: 25,
        reorderPoint: 30,
        recommendedQuantity: 100,
        priority: 'medium',
        daysUntilStockout: 12
      }
    ];

    setBulkOrders(mockBulkOrders);
    setOrderTemplates(mockTemplates);
    setInventoryAlerts(mockAlerts);
  }, []);

  // Table columns for bulk orders
  const bulkOrderColumns = [
    {
      key: 'orderNumber',
      header: language === 'ar' ? 'رقم الطلب' : 'Order Number',
      sortable: true,
      render: (value: string, order: BulkOrder) => (
        <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {value}
        </div>
      )
    },
    {
      key: 'supplier',
      header: language === 'ar' ? 'المورد' : 'Supplier',
      render: (value: any, order: BulkOrder) => (
        <div>
          <div className="font-medium">{language === 'ar' ? order.supplier.nameAr : order.supplier.name}</div>
          <div className="text-sm text-gray-500">{order.supplier.location}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: language === 'ar' ? 'الحالة' : 'Status',
      render: (value: string) => {
        const statusConfig = {
          draft: { color: 'gray', text: language === 'ar' ? 'مسودة' : 'Draft' },
          pending_approval: { color: 'yellow', text: language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval' },
          approved: { color: 'green', text: language === 'ar' ? 'معتمد' : 'Approved' },
          ordered: { color: 'blue', text: language === 'ar' ? 'تم الطلب' : 'Ordered' },
          partial_received: { color: 'orange', text: language === 'ar' ? 'مستلم جزئياً' : 'Partial Received' },
          completed: { color: 'green', text: language === 'ar' ? 'مكتمل' : 'Completed' },
          cancelled: { color: 'red', text: language === 'ar' ? 'ملغي' : 'Cancelled' }
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${config.color}-100 text-${config.color}-800`}>
            {config.text}
          </span>
        );
      }
    },
    {
      key: 'priority',
      header: language === 'ar' ? 'الأولوية' : 'Priority',
      render: (value: string) => {
        const priorityConfig = {
          low: { color: 'green', text: language === 'ar' ? 'منخفضة' : 'Low' },
          medium: { color: 'yellow', text: language === 'ar' ? 'متوسطة' : 'Medium' },
          high: { color: 'orange', text: language === 'ar' ? 'عالية' : 'High' },
          urgent: { color: 'red', text: language === 'ar' ? 'عاجل' : 'Urgent' }
        };
        const config = priorityConfig[value as keyof typeof priorityConfig];
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${config.color}-100 text-${config.color}-800`}>
            {config.text}
          </span>
        );
      }
    },
    {
      key: 'totalAmount',
      header: language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount',
      sortable: true,
      render: (value: number, order: BulkOrder) => (
        <div className="font-medium">
          {new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
            style: 'currency',
            currency: order.currency
          }).format(value)}
        </div>
      )
    },
    {
      key: 'totalItems',
      header: language === 'ar' ? 'عدد الأصناف' : 'Items',
      sortable: true
    },
    {
      key: 'expectedDelivery',
      header: language === 'ar' ? 'التسليم المتوقع' : 'Expected Delivery',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
        </div>
      )
    },
    {
      key: 'actions',
      header: language === 'ar' ? 'الإجراءات' : 'Actions',
      render: (value: any, order: BulkOrder) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-green-600 hover:text-green-800">
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-800">
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  // Calculate metrics
  const orderMetrics = {
    totalOrders: bulkOrders.length,
    pendingApproval: bulkOrders.filter(o => o.status === 'pending_approval').length,
    activeOrders: bulkOrders.filter(o => ['approved', 'ordered', 'partial_received'].includes(o.status)).length,
    totalValue: bulkOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    urgentAlerts: inventoryAlerts.filter(a => a.priority === 'high').length
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'إدارة الطلبات الكبيرة' : 'Bulk Order Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'ar' 
                ? 'إدارة شاملة لطلبات الجملة والمخزون الكبير مع التكامل مع الموردين'
                : 'Comprehensive management of bulk orders and large inventory with supplier integration'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              {language === 'ar' ? 'رفع ملف' : 'Upload File'}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              {language === 'ar' ? 'طلب جديد' : 'New Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricsCard
          title={language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}
          value={orderMetrics.totalOrders.toString()}
          icon={ShoppingCartIcon}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <MetricsCard
          title={language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval'}
          value={orderMetrics.pendingApproval.toString()}
          icon={ClockIcon}
          color="yellow"
        />
        <MetricsCard
          title={language === 'ar' ? 'الطلبات النشطة' : 'Active Orders'}
          value={orderMetrics.activeOrders.toString()}
          icon={ArrowPathIcon}
          color="green"
        />
        <MetricsCard
          title={language === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}
          value={new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
            style: 'currency',
            currency: 'SAR',
            notation: 'compact'
          }).format(orderMetrics.totalValue)}
          icon={BanknotesIcon}
          color="indigo"
        />
        <MetricsCard
          title={language === 'ar' ? 'تنبيهات عاجلة' : 'Urgent Alerts'}
          value={orderMetrics.urgentAlerts.toString()}
          icon={ExclamationTriangleIcon}
          color="red"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'orders', label: language === 'ar' ? 'الطلبات' : 'Orders', icon: ShoppingCartIcon },
              { key: 'create', label: language === 'ar' ? 'إنشاء طلب' : 'Create Order', icon: PlusIcon },
              { key: 'templates', label: language === 'ar' ? 'القوالب' : 'Templates', icon: ClipboardDocumentIcon },
              { key: 'alerts', label: language === 'ar' ? 'التنبيهات' : 'Alerts', icon: ExclamationTriangleIcon },
              { key: 'analytics', label: language === 'ar' ? 'التحليلات' : 'Analytics', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Bulk Actions */}
              {selectedOrders.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-800">
                      {language === 'ar' 
                        ? `تم تحديد ${selectedOrders.length} طلب`
                        : `${selectedOrders.length} orders selected`
                      }
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        {language === 'ar' ? 'موافقة' : 'Approve'}
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        {language === 'ar' ? 'رفض' : 'Reject'}
                      </button>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        {language === 'ar' ? 'تصدير' : 'Export'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Table */}
              <DataTable
                columns={bulkOrderColumns}
                data={bulkOrders}
                searchPlaceholder={language === 'ar' ? 'البحث في الطلبات...' : 'Search orders...'}
              />
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'ar' ? 'إنشاء طلب كبير جديد' : 'Create New Bulk Order'}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Order Information */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">
                        {language === 'ar' ? 'معلومات الطلب' : 'Order Information'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'نوع الطلب' : 'Order Type'}
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>{language === 'ar' ? 'تجديد المخزون' : 'Inventory Restock'}</option>
                            <option>{language === 'ar' ? 'منتجات جديدة' : 'New Products'}</option>
                            <option>{language === 'ar' ? 'موسمي' : 'Seasonal'}</option>
                            <option>{language === 'ar' ? 'طارئ' : 'Emergency'}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'الأولوية' : 'Priority'}
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>{language === 'ar' ? 'منخفضة' : 'Low'}</option>
                            <option>{language === 'ar' ? 'متوسطة' : 'Medium'}</option>
                            <option>{language === 'ar' ? 'عالية' : 'High'}</option>
                            <option>{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'المورد' : 'Supplier'}
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>{language === 'ar' ? 'اختر المورد' : 'Select Supplier'}</option>
                            <option>Saudi Industrial Supplies</option>
                            <option>Gulf Manufacturing Co.</option>
                            <option>Arabian Steel Works</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ar' ? 'تاريخ التسليم المطلوب' : 'Required Delivery Date'}
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Selection */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          {language === 'ar' ? 'اختيار المنتجات' : 'Product Selection'}
                        </h3>
                        <div className="flex gap-2">
                          <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                            {language === 'ar' ? 'من القالب' : 'From Template'}
                          </button>
                          <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                            {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-md">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                            <div className="col-span-2">{language === 'ar' ? 'المنتج' : 'Product'}</div>
                            <div>{language === 'ar' ? 'المخزون الحالي' : 'Current Stock'}</div>
                            <div>{language === 'ar' ? 'نقطة الطلب' : 'Reorder Point'}</div>
                            <div>{language === 'ar' ? 'الكمية' : 'Quantity'}</div>
                            <div>{language === 'ar' ? 'السعر' : 'Price'}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-center py-8 text-gray-500">
                            {language === 'ar' ? 'لم يتم إضافة منتجات بعد' : 'No products added yet'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">
                        {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'عدد الأصناف:' : 'Items:'}</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'إجمالي الكمية:' : 'Total Quantity:'}</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'المبلغ الفرعي:' : 'Subtotal:'}</span>
                          <span>SAR 0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                          <span>SAR 0</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                            <span>SAR 0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">
                        {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                      </h3>
                      <div className="space-y-2">
                        <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                          {language === 'ar' ? 'حفظ كمسودة' : 'Save as Draft'}
                        </button>
                        <button className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                          {language === 'ar' ? 'إرسال للموافقة' : 'Submit for Approval'}
                        </button>
                        <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                          {language === 'ar' ? 'حفظ كقالب' : 'Save as Template'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {language === 'ar' ? 'قوالب الطلبات' : 'Order Templates'}
                </h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {language === 'ar' ? 'إنشاء قالب جديد' : 'Create New Template'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderTemplates.map((template) => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'ar' ? template.nameAr : template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive 
                          ? (language === 'ar' ? 'نشط' : 'Active')
                          : (language === 'ar' ? 'غير نشط' : 'Inactive')
                        }
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'المورد:' : 'Supplier:'}</span> {template.supplier}
                      </div>
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'التكرار:' : 'Frequency:'}</span>{' '}
                        {language === 'ar' 
                          ? (template.frequency === 'weekly' ? 'أسبوعي' : 
                             template.frequency === 'monthly' ? 'شهري' : 'ربع سنوي')
                          : template.frequency
                        }
                      </div>
                      <div>
                        <span className="font-medium">{language === 'ar' ? 'آخر استخدام:' : 'Last used:'}</span>{' '}
                        {new Date(template.lastUsed).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        {language === 'ar' ? 'استخدام' : 'Use'}
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {language === 'ar' ? 'تنبيهات المخزون' : 'Inventory Alerts'}
                </h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {language === 'ar' ? 'تحديث التنبيهات' : 'Refresh Alerts'}
                </button>
              </div>

              <div className="grid gap-4">
                {inventoryAlerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${
                    alert.priority === 'high' ? 'border-red-200 bg-red-50' :
                    alert.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-gray-200 bg-white'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className={`h-6 w-6 mt-0.5 ${
                          alert.priority === 'high' ? 'text-red-600' :
                          alert.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`} />
                        <div>
                          <h3 className="font-medium">{alert.productName}</h3>
                          <p className="text-sm text-gray-600">SKU: {alert.sku}</p>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">
                              {language === 'ar' ? 'المخزون الحالي:' : 'Current Stock:'}{' '}
                            </span>
                            <span className="font-medium">{alert.currentStock}</span>
                            <span className="text-gray-600 ml-4">
                              {language === 'ar' ? 'نقطة الطلب:' : 'Reorder Point:'}{' '}
                            </span>
                            <span className="font-medium">{alert.reorderPoint}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === 'ar' ? 'أيام حتى نفاد المخزون:' : 'Days until stockout:'}{' '}
                            <span className="font-medium text-red-600">{alert.daysUntilStockout}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-2">
                          {language === 'ar' ? 'الكمية المقترحة:' : 'Recommended Qty:'}
                        </div>
                        <div className="font-bold text-lg text-blue-600">
                          {alert.recommendedQuantity}
                        </div>
                        <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          {language === 'ar' ? 'إنشاء طلب' : 'Create Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'تحليلات الطلبات الكبيرة' : 'Bulk Orders Analytics'}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Distribution */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'توزيع حالات الطلبات' : 'Order Status Distribution'}
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">{language === 'ar' ? 'رسم بياني للحالات' : 'Status Chart Placeholder'}</p>
                  </div>
                </div>

                {/* Monthly Trends */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends'}
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">{language === 'ar' ? 'رسم بياني للاتجاهات' : 'Trends Chart Placeholder'}</p>
                  </div>
                </div>

                {/* Supplier Performance */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'أداء الموردين' : 'Supplier Performance'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Saudi Industrial Supplies</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">95%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Gulf Manufacturing Co.</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">88%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Savings */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'ar' ? 'توفير التكاليف' : 'Cost Savings'}
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">SAR 45,000</div>
                      <div className="text-sm text-gray-600">
                        {language === 'ar' ? 'إجمالي التوفير هذا الشهر' : 'Total savings this month'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-medium">15%</div>
                        <div className="text-gray-600">{language === 'ar' ? 'خصم الكمية' : 'Bulk Discount'}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="font-medium">8%</div>
                        <div className="text-gray-600">{language === 'ar' ? 'توفير الشحن' : 'Shipping Savings'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {language === 'ar' ? 'رفع ملف الطلب الكبير' : 'Upload Bulk Order File'}
            </h3>
            <div className="space-y-4">
              <FileUploader
                accept=".csv,.xlsx,.xls"
                onUpload={(files) => {
                  console.log('Files uploaded:', files);
                  setShowUploadModal(false);
                }}
                multiple={false}
                maxSize={10 * 1024 * 1024} // 10MB
              />
              <div className="text-sm text-gray-600">
                {language === 'ar' 
                  ? 'يدعم ملفات CSV و Excel. الحد الأقصى للحجم 10MB'
                  : 'Supports CSV and Excel files. Maximum size 10MB'
                }
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {language === 'ar' ? 'رفع' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOrdersPage;