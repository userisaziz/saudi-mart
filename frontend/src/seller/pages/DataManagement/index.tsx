import React, { useState, useRef } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { useSellerStore } from '../../stores/seller-store';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  CogIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

interface ImportExportConfig {
  type: 'products' | 'customers' | 'orders' | 'leads' | 'reports';
  format: 'csv' | 'xlsx' | 'json';
  includeImages: boolean;
  includeMetadata: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

const DataManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { products, orders, leads, setProducts } = useSellerStore();
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'backup'>('export');
  const [exportConfig, setExportConfig] = useState<ImportExportConfig>({
    type: 'products',
    format: 'csv',
    includeImages: false,
    includeMetadata: true,
  });
  const [importConfig, setImportConfig] = useState<ImportExportConfig>({
    type: 'products',
    format: 'csv',
    includeImages: false,
    includeMetadata: true,
  });
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backupHistory, setBackupHistory] = useState([
    {
      id: '1',
      name: 'Full Data Backup',
      date: '2024-03-19',
      size: '2.4 MB',
      type: 'full',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Products Only',
      date: '2024-03-18',
      size: '850 KB',
      type: 'partial',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Customer Data',
      date: '2024-03-17',
      size: '1.2 MB',
      type: 'partial',
      status: 'completed',
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dataTypes = [
    {
      key: 'products',
      label: 'Products',
      labelAr: 'المنتجات',
      icon: CubeIcon,
      count: products.length,
      description: 'Product catalog, pricing, inventory',
      descriptionAr: 'كتالوج المنتجات والأسعار والمخزون',
    },
    {
      key: 'customers',
      label: 'Customers',
      labelAr: 'العملاء',
      icon: UserGroupIcon,
      count: 125,
      description: 'Customer information and preferences',
      descriptionAr: 'معلومات العملاء وتفضيلاتهم',
    },
    {
      key: 'orders',
      label: 'Orders',
      labelAr: 'الطلبات',
      icon: ShoppingBagIcon,
      count: orders.length,
      description: 'Order history and transaction details',
      descriptionAr: 'تاريخ الطلبات وتفاصيل المعاملات',
    },
    {
      key: 'leads',
      label: 'Leads',
      labelAr: 'العملاء المحتملون',
      icon: BuildingStorefrontIcon,
      count: leads.length,
      description: 'Lead information and follow-up data',
      descriptionAr: 'معلومات العملاء المحتملين وبيانات المتابعة',
    },
    {
      key: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      icon: DocumentChartBarIcon,
      count: 15,
      description: 'Generated reports and analytics',
      descriptionAr: 'التقارير المُولدة والتحليلات',
    },
  ];

  const formatOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Comma-separated values, compatible with Excel',
      descriptionAr: 'قيم مفصولة بفواصل، متوافقة مع Excel',
      icon: TableCellsIcon,
    },
    {
      value: 'xlsx',
      label: 'Excel',
      description: 'Microsoft Excel spreadsheet format',
      descriptionAr: 'تنسيق جدول بيانات Microsoft Excel',
      icon: DocumentTextIcon,
    },
    {
      value: 'json',
      label: 'JSON',
      description: 'JavaScript Object Notation, for developers',
      descriptionAr: 'تنسيق JSON للمطورين',
      icon: ClipboardDocumentListIcon,
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setExportProgress(i);
      }

      // Generate download
      const data = getDataForExport(exportConfig.type);
      const filename = `${exportConfig.type}_export_${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
      
      if (exportConfig.format === 'json') {
        downloadJSON(data, filename);
      } else {
        downloadCSV(data, filename);
      }

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      // Simulate import process
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setImportProgress(i);
      }

      // Process file
      const result = await processImportFile(selectedFile, importConfig);
      setImportResult(result);

    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const getDataForExport = (type: string) => {
    switch (type) {
      case 'products':
        return products.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category,
          price: p.price,
          stock: p.stock,
          status: p.status,
          description: p.description,
          created: p.createdAt,
          updated: p.updatedAt,
        }));
      case 'orders':
        return orders.map(o => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.customerName,
          total: o.total,
          status: o.status,
          created: o.createdAt,
        }));
      case 'leads':
        return leads.map(l => ({
          id: l.id,
          name: l.name,
          email: l.email,
          company: l.company,
          phone: l.phone,
          status: l.status,
          value: l.value,
          source: l.source,
        }));
      default:
        return [];
    }
  };

  const downloadJSON = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const processImportFile = async (file: File, config: ImportExportConfig): Promise<ImportResult> => {
    // Simulate file processing
    const mockResult: ImportResult = {
      total: 150,
      successful: 142,
      failed: 8,
      errors: [
        { row: 12, field: 'price', message: 'Invalid price format' },
        { row: 25, field: 'email', message: 'Invalid email address' },
        { row: 34, field: 'sku', message: 'SKU already exists' },
        { row: 56, field: 'category', message: 'Category not found' },
        { row: 78, field: 'stock', message: 'Stock must be a positive number' },
        { row: 89, field: 'name', message: 'Product name is required' },
        { row: 102, field: 'price', message: 'Price cannot be zero' },
        { row: 134, field: 'status', message: 'Invalid status value' },
      ],
    };

    return mockResult;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleBackup = async (type: 'full' | 'partial') => {
    // Implement backup functionality
    console.log(`Creating ${type} backup...`);
  };

  const handleRestore = async (backupId: string) => {
    // Implement restore functionality
    console.log(`Restoring from backup ${backupId}...`);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600 mt-1">
            Import, export, and backup your business data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleBackup('full')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            Create Backup
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export Data
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowUpTrayIcon className="w-4 h-4" />
              Import Data
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CloudArrowDownIcon className="w-4 h-4" />
              Backup & Restore
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                <p className="text-gray-600 mb-6">
                  Download your business data in various formats for backup or external analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Data Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Data Type
                  </label>
                  <div className="space-y-2">
                    {dataTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div
                          key={type.key}
                          onClick={() => setExportConfig({...exportConfig, type: type.key as any})}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            exportConfig.type === type.key
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {isRTL ? type.labelAr : type.label}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {isRTL ? type.descriptionAr : type.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">{type.count}</p>
                              <p className="text-xs text-gray-500">records</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Format and Options */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Export Format
                    </label>
                    <div className="space-y-2">
                      {formatOptions.map((format) => {
                        const IconComponent = format.icon;
                        return (
                          <div
                            key={format.value}
                            onClick={() => setExportConfig({...exportConfig, format: format.value as any})}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              exportConfig.format === format.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <div>
                                <p className="font-medium text-gray-900">{format.label}</p>
                                <p className="text-sm text-gray-500">
                                  {isRTL ? format.descriptionAr : format.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Export Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeMetadata}
                          onChange={(e) => setExportConfig({...exportConfig, includeMetadata: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Include metadata (dates, IDs)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeImages}
                          onChange={(e) => setExportConfig({...exportConfig, includeImages: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Include image URLs</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Exporting... {exportProgress}%
                        </>
                      ) : (
                        <>
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Export Data
                        </>
                      )}
                    </button>
                    
                    {isExporting && (
                      <div className="mt-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${exportProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
                <p className="text-gray-600 mb-6">
                  Upload data files to add or update your business information.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select File
                  </label>
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to select a file or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports CSV, Excel, and JSON files up to 10MB
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Import Options */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Data Type
                    </label>
                    <select
                      value={importConfig.type}
                      onChange={(e) => setImportConfig({...importConfig, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {dataTypes.map((type) => (
                        <option key={type.key} value={type.key}>
                          {isRTL ? type.labelAr : type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Import Behavior
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="importBehavior"
                          value="replace"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Replace existing data</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="importBehavior"
                          value="update"
                          defaultChecked
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Update existing, add new</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="importBehavior"
                          value="append"
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Add new records only</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleImport}
                      disabled={!selectedFile || isImporting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isImporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Importing... {importProgress}%
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          Import Data
                        </>
                      )}
                    </button>
                    
                    {isImporting && (
                      <div className="mt-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${importProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Import Results */}
              {importResult && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Import Results</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{importResult.total}</p>
                          <p className="text-sm text-gray-600">Total Records</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{importResult.successful}</p>
                          <p className="text-sm text-gray-600">Successful</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                          <p className="text-sm text-gray-600">Failed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Import Errors</h5>
                      <div className="bg-white rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {importResult.errors.map((error, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-900">{error.row}</td>
                                <td className="px-4 py-2 text-gray-600">{error.field}</td>
                                <td className="px-4 py-2 text-red-600">{error.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Restore</h3>
                <p className="text-gray-600 mb-6">
                  Create backups of your data and restore from previous backups.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Backup */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Backup</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Backup Type
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="backupType"
                            value="full"
                            defaultChecked
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Full Backup (All data)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="backupType"
                            value="partial"
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Partial Backup (Selected data)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="manual">Manual (one-time)</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => handleBackup('full')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CloudArrowUpIcon className="w-4 h-4" />
                      Create Backup
                    </button>
                  </div>
                </div>

                {/* Backup History */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Backup History</h4>
                  
                  <div className="space-y-3">
                    {backupHistory.map((backup) => (
                      <div key={backup.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{backup.name}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">
                                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                                {backup.date}
                              </span>
                              <span className="text-sm text-gray-500">{backup.size}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                backup.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {backup.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleRestore(backup.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Restore
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips and Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Data Management Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always create a backup before importing large datasets</li>
              <li>• Use CSV format for better compatibility with spreadsheet applications</li>
              <li>• Test imports with a small sample file first</li>
              <li>• Schedule regular automated backups to prevent data loss</li>
              <li>• Keep exported files secure and follow your organization's data policies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;