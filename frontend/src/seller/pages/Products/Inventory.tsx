import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { 
  PencilIcon, 
  ExclamationTriangleIcon, 
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { mockProducts, type Product } from '../../data/mockData';
import { DataTable } from '../../components/ui/DataTable';

interface BulkActionToolbarProps {
  selectedItems: string[];
  onBulkAction: (action: string) => void;
  onClearSelection: () => void;
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({ 
  selectedItems, 
  onBulkAction, 
  onClearSelection 
}) => {
  const { t } = useLanguage();
  if (selectedItems.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedItems.length} {t('inventory.selected', 'items selected')}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onBulkAction('updateStock')}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              {t('inventory.bulkUpdateStock', 'Bulk Update Stock')}
            </button>
            <button
              onClick={() => onBulkAction('updatePrice')}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              {t('inventory.bulkUpdatePrice', 'Bulk Update Price')}
            </button>
            <button
              onClick={() => onBulkAction('export')}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>{t('inventory.export', 'Export')}</span>
            </button>
            <button
              onClick={() => onBulkAction('delete')}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
            >
              <TrashIcon className="w-4 h-4" />
              <span>{t('inventory.delete', 'Delete')}</span>
            </button>
          </div>
        </div>
        <button
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: string[];
  updateType: 'stock' | 'price' | null;
  onUpdate: (updates: { [key: string]: any }) => void;
}

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  updateType,
  onUpdate
}) => {
  const { t } = useLanguage();
  const [updateValue, setUpdateValue] = useState('');
  const [updateMode, setUpdateMode] = useState<'set' | 'add' | 'subtract' | 'percent'>('set');

  if (!isOpen || !updateType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(updateValue);
    if (isNaN(value)) return;

    const updates = selectedItems.reduce((acc, id) => {
      acc[id] = { [updateType]: value, updateMode };
      return acc;
    }, {} as { [key: string]: any });

    onUpdate(updates);
    onClose();
    setUpdateValue('');
  };

  const title = updateType === 'stock' ? t('inventory.updateStockTitle', 'Bulk Update Stock') : t('inventory.updatePriceTitle', 'Bulk Update Price');
  const label = updateType === 'stock' ? t('inventory.stockQuantity', 'Stock Quantity') : t('inventory.price', 'Price ($)');

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('bulkUpload.processing', 'Processing {processed} of {total} products').replace('{processed}', selectedItems.length.toString()).replace('{total}', selectedItems.length.toString())}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('inventory.updateMode', 'Update Mode')}
            </label>
            <select
              value={updateMode}
              onChange={(e) => setUpdateMode(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="set">{t('inventory.setValue', 'Set to value')}</option>
              <option value="add">{t('inventory.addToCurrent', 'Add to current')}</option>
              <option value="subtract">{t('inventory.subtractFromCurrent', 'Subtract from current')}</option>
              {updateType === 'price' && <option value="percent">{t('inventory.percentageChange', 'Percentage change')}</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type="number"
              min="0"
              step={updateType === 'price' ? '0.01' : '1'}
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter ${label.toLowerCase()}`}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('inventory.updateProducts', 'Update Products')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProductInventory: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState(mockProducts);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkUpdateType, setBulkUpdateType] = useState<'stock' | 'price' | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      const matchesStock = stockFilter === 'all' ||
                          (stockFilter === 'low' && product.stock > 0 && product.stock < 10) ||
                          (stockFilter === 'out' && product.stock === 0) ||
                          (stockFilter === 'inStock' && product.stock >= 10);

      return matchesSearch && matchesStatus && matchesStock;
    });
  }, [products, searchTerm, statusFilter, stockFilter]);

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'updateStock':
        setBulkUpdateType('stock');
        setShowBulkModal(true);
        break;
      case 'updatePrice':
        setBulkUpdateType('price');
        setShowBulkModal(true);
        break;
      case 'export':
        // Export functionality
        console.log('Exporting selected items:', selectedItems);
        break;
      case 'delete':
        // Delete functionality
        if (confirm(`${t('inventory.confirmDelete', 'Are you sure you want to delete')} ${selectedItems.length} ${t('inventory.confirmDeleteMultiple', 'products?')}`)) {
          setProducts(prev => prev.filter(p => !selectedItems.includes(p.id)));
          setSelectedItems([]);
        }
        break;
    }
  };

  const handleBulkUpdate = (updates: { [key: string]: any }) => {
    setProducts(prev => prev.map(product => {
      if (selectedItems.includes(product.id)) {
        const update = updates[product.id];
        const newProduct = { ...product };

        if (update.stock !== undefined) {
          switch (update.updateMode) {
            case 'set':
              newProduct.stock = update.stock;
              break;
            case 'add':
              newProduct.stock += update.stock;
              break;
            case 'subtract':
              newProduct.stock = Math.max(0, newProduct.stock - update.stock);
              break;
          }
        }

        if (update.price !== undefined) {
          switch (update.updateMode) {
            case 'set':
              newProduct.price = update.price;
              break;
            case 'add':
              newProduct.price += update.price;
              break;
            case 'subtract':
              newProduct.price = Math.max(0, newProduct.price - update.price);
              break;
            case 'percent':
              newProduct.price *= (1 + update.price / 100);
              break;
          }
        }

        return newProduct;
      }
      return product;
    }));
    setSelectedItems([]);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: t('inventory.stockStatus.outOfStock', 'Out of Stock'), color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stock < 10) return { status: t('inventory.stockStatus.lowStock', 'Low Stock'), color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { status: t('inventory.stockStatus.inStock', 'In Stock'), color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(p => p.stock >= 10).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return { totalProducts, inStock, lowStock, outOfStock, totalValue };
  }, [products]);

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems(filteredProducts.map(p => p.id));
            } else {
              setSelectedItems([]);
            }
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (_: any, product: Product) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(product.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems(prev => [...prev, product.id]);
            } else {
              setSelectedItems(prev => prev.filter(id => id !== product.id));
            }
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      width: 'w-12'
    },
    {
      key: 'images',
      header: t('inventory.product', 'Product'),
      render: (images: string[], product: Product) => (
        <div className="flex items-center space-x-3">
          <img 
            src={images[0] || '/api/placeholder/64/64'} 
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.sku}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'category',
      header: t('inventory.category', 'Category'),
      sortable: true,
    },
    {
      key: 'price',
      header: t('inventory.price', 'Price'),
      render: (price: number) => (
        <span className="font-medium text-gray-900">
          ${price.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'stock',
      header: t('inventory.stock', 'Stock'),
      render: (stock: number) => {
        const { status, color, bgColor } = getStockStatus(stock);
        return (
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${color}`}>{stock}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${color} ${bgColor}`}>
              {status}
            </span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'value',
      header: t('inventory.inventoryValue', 'Inventory Value'),
      render: (_: any, product: Product) => (
        <span className="font-medium text-gray-900">
          ${(product.price * product.stock).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: t('inventory.status', 'Status'),
      render: (status: string) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'active' 
            ? 'bg-green-100 text-green-800'
            : status === 'inactive'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: t('inventory.actions', 'Actions'),
      render: (_: any, product: Product) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-800 p-1" 
            title={t('inventory.quickEditStock', 'Quick Edit Stock')}
            onClick={() => {
              const newStock = prompt(`Update stock for ${product.name} (current: ${product.stock})`);
              if (newStock !== null && !isNaN(parseInt(newStock))) {
                setProducts(prev => prev.map(p => 
                  p.id === product.id ? { ...p, stock: parseInt(newStock) } : p
                ));
              }
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button 
            className="text-green-600 hover:text-green-800 p-1" 
            title={t('inventory.duplicate', 'Duplicate Product')}
            onClick={() => {
              const newProduct = {
                ...product,
                id: Date.now().toString(),
                name: `${product.name} (Copy)`,
                sku: `${product.sku}-COPY`
              };
              setProducts(prev => [...prev, newProduct]);
            }}
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
          <button 
            className="text-red-600 hover:text-red-800 p-1" 
            title={t('inventory.deleteProduct', 'Delete Product')}
            onClick={() => {
              if (confirm(`${t('inventory.confirmDelete', 'Are you sure you want to delete')} "${product.name}"?`)) {
                setProducts(prev => prev.filter(p => p.id !== product.id));
              }
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <button 
            className="text-yellow-600 hover:text-yellow-800 p-1" 
            title={product.status === 'draft' ? t('inventory.markAsActive', 'Mark as Active') : t('inventory.markAsDraft', 'Mark as Draft')}
            onClick={() => {
              setProducts(prev => prev.map(p => 
                p.id === product.id ? { ...p, status: p.status === 'draft' ? 'active' : 'draft' } : p
              ));
            }}
          >
            <ClockIcon className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('inventory.title', 'Inventory Management')}</h1>
          <p className="text-gray-600">{t('inventory.subtitle', 'Track and manage your product inventory levels')}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>{t('inventory.exportInventory', 'Export Inventory')}</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t('inventory.importStockUpdates', 'Import Stock Updates')}
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t('inventory.totalProducts', 'Total Products')}</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-50">
              <CheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t('inventory.inStock', 'In Stock')}</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.inStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-50">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t('inventory.lowStock', 'Low Stock')}</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-50">
              <XMarkIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t('inventory.outOfStock', 'Out of Stock')}</p>
              <p className="text-2xl font-semibold text-gray-900">{inventoryStats.outOfStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-50">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t('inventory.totalValue', 'Total Value')}</p>
              <p className="text-2xl font-semibold text-gray-900">${inventoryStats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedItems={selectedItems}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedItems([])}
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className={`w-5 h-5 text-gray-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2`} />
            <input
              type="text"
              placeholder={t('inventory.searchPlaceholder', 'Search products by name, SKU, or category...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('inventory.allStatus', 'All Status')}</option>
                <option value="active">{t('inventory.active', 'Active')}</option>
                <option value="inactive">{t('inventory.inactive', 'Inactive')}</option>
                <option value="draft">{t('inventory.draft', 'Draft')}</option>
              </select>
            </div>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('inventory.allStockLevels', 'All Stock Levels')}</option>
              <option value="inStock">{t('inventory.inStockFilter', 'In Stock (10+)')}</option>
              <option value="low">{t('inventory.lowStockFilter', 'Low Stock (1-9)')}</option>
              <option value="out">{t('inventory.outOfStockFilter', 'Out of Stock')}</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        searchPlaceholder={t('inventory.searchPlaceholder', 'Search inventory...')}
        searchable={false}
      />

      {/* Bulk Update Modal */}
      <BulkUpdateModal
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setBulkUpdateType(null);
        }}
        selectedItems={selectedItems}
        updateType={bulkUpdateType}
        onUpdate={handleBulkUpdate}
      />
    </div>
  );
};

export default ProductInventory;