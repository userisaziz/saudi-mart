import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { useDropzone } from 'react-dropzone';
import { DataTable } from '../../components/ui/DataTable';
import { 
  DocumentArrowDownIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  InformationCircleIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CogIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

interface CSVRow {
  [key: string]: string;
}

interface ValidationError {
  row: number;
  column: string;
  field: string;
  value: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ProcessedRow extends CSVRow {
  _rowIndex: number;
  _status: 'valid' | 'error' | 'warning';
  _errors: ValidationError[];
}

interface BulkUploadStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

const getUploadSteps = (t: any): BulkUploadStep[] => [
  { id: 'upload', name: t('bulkUpload.uploadCsv', 'Upload CSV'), description: t('bulkUpload.uploadDescription', 'Select and upload your CSV file'), completed: false },
  { id: 'mapping', name: t('bulkUpload.mapColumns', 'Field Mapping'), description: t('bulkUpload.mapDescription', 'Map CSV columns to product fields'), completed: false },
  { id: 'validation', name: t('bulkUpload.validationResults', 'Data Validation'), description: t('bulkUpload.reviewErrors', 'Review and fix validation errors'), completed: false },
  { id: 'preview', name: t('bulkUpload.previewImport', 'Preview'), description: t('bulkUpload.reviewProducts', 'Preview products before import'), completed: false },
  { id: 'import', name: t('bulkUpload.import', 'Import'), description: t('bulkUpload.importMoreProducts', 'Import products to your catalog'), completed: false }
];

const requiredFields = [
  { key: 'name', label: 'Product Name', required: true, type: 'text' },
  { key: 'sku', label: 'SKU', required: true, type: 'text' },
  { key: 'price', label: 'Price', required: true, type: 'number' },
  { key: 'category', label: 'Category', required: true, type: 'text' },
  { key: 'stock', label: 'Stock Quantity', required: false, type: 'number' },
  { key: 'description', label: 'Description', required: false, type: 'text' },
  { key: 'weight', label: 'Weight (kg)', required: false, type: 'number' },
  { key: 'dimensions', label: 'Dimensions', required: false, type: 'text' }
];

const mockCategories = ['Manufacturing', 'Electronics', 'Automotive', 'Furniture', 'Construction'];

export const ProductBulkUpload: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<{[key: string]: string}>({});
  const [processedData, setProcessedData] = useState<ProcessedRow[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    processed: number;
    success: number;
    errors: number;
  }>({ total: 0, processed: 0, success: 0, errors: 0 });

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    setCsvHeaders(headers);

    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: CSVRow = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      return row;
    });

    return data;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSV(text);
      setCsvData(parsedData);
      setCurrentStep(1); // Move to mapping step
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const validateData = (): ProcessedRow[] => {
    return csvData.map((row, index) => {
      const errors: ValidationError[] = [];
      let status: 'valid' | 'error' | 'warning' = 'valid';

      // Check required fields
      requiredFields.forEach(field => {
        const mappedColumn = fieldMapping[field.key];
        const value = mappedColumn ? row[mappedColumn] : '';

        if (field.required && !value.trim()) {
          errors.push({
            row: index + 1,
            column: mappedColumn || '',
            field: field.key,
            value,
            message: `${field.label} is required`,
            severity: 'error'
          });
          status = 'error';
        }

        // Type validation
        if (value && field.type === 'number' && isNaN(Number(value))) {
          errors.push({
            row: index + 1,
            column: mappedColumn || '',
            field: field.key,
            value,
            message: `${field.label} must be a valid number`,
            severity: 'error'
          });
          status = 'error';
        }

        // Business logic validation
        if (field.key === 'price' && Number(value) <= 0) {
          errors.push({
            row: index + 1,
            column: mappedColumn || '',
            field: field.key,
            value,
            message: 'Price must be greater than 0',
            severity: 'error'
          });
          status = 'error';
        }

        if (field.key === 'category' && value && !mockCategories.includes(value)) {
          errors.push({
            row: index + 1,
            column: mappedColumn || '',
            field: field.key,
            value,
            message: `Category "${value}" is not valid. Available: ${mockCategories.join(', ')}`,
            severity: 'warning'
          });
          if (status !== 'error') status = 'warning';
        }

        // SKU uniqueness check
        if (field.key === 'sku' && value) {
          const duplicates = csvData.filter((r, i) => i !== index && r[mappedColumn || ''] === value);
          if (duplicates.length > 0) {
            errors.push({
              row: index + 1,
              column: mappedColumn || '',
              field: field.key,
              value,
              message: `SKU "${value}" is duplicated in the file`,
              severity: 'error'
            });
            status = 'error';
          }
        }
      });

      return {
        ...row,
        _rowIndex: index,
        _status: status,
        _errors: errors
      };
    });
  };

  const validationStats = useMemo(() => {
    if (!processedData.length) return { total: 0, valid: 0, errors: 0, warnings: 0 };
    
    return {
      total: processedData.length,
      valid: processedData.filter(row => row._status === 'valid').length,
      errors: processedData.filter(row => row._status === 'error').length,
      warnings: processedData.filter(row => row._status === 'warning').length
    };
  }, [processedData]);

  const handleValidation = () => {
    const validated = validateData();
    setProcessedData(validated);
    setCurrentStep(2); // Move to validation step
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportStats({ total: validationStats.valid, processed: 0, success: 0, errors: 0 });

    const validRows = processedData.filter(row => row._status === 'valid');
    
    // Simulate import process
    for (let i = 0; i < validRows.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call
      
      const success = Math.random() > 0.1; // 90% success rate
      setImportStats(prev => ({
        ...prev,
        processed: i + 1,
        success: prev.success + (success ? 1 : 0),
        errors: prev.errors + (success ? 0 : 1)
      }));
    }

    setIsImporting(false);
    setCurrentStep(4); // Move to completion step
  };

  const downloadTemplate = () => {
    const headers = requiredFields.map(field => field.label).join(',');
    const sampleRow = 'Steel Pipe Industrial,"SP-001",450.00,Manufacturing,100,"High-grade steel pipe for industrial use",2.5,"2m x 0.1m"';
    const csv = `${headers}\n${sampleRow}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_import_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const uploadSteps = getUploadSteps(t);
  
  const StepIndicator: React.FC = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {uploadSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              index <= currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index < currentStep ? (
                <CheckCircleIcon className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.name}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < uploadSteps.length - 1 && (
              <ArrowRightIcon className="w-5 h-5 text-gray-400 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Upload
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bulkUpload.uploadCsv', 'Upload Your Product CSV')}</h2>
              <p className="text-gray-600">
                {t('bulkUpload.uploadDescription', 'Upload a CSV file containing your product data. Need help getting started?')}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">{t('bulkUpload.beforeStart', 'Before you start:')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('bulkUpload.downloadTemplate', 'Download our template to ensure proper formatting')}</li>
                    <li>{t('bulkUpload.requiredFields', 'Include required fields: Product Name, SKU, Price, Category')}</li>
                    <li>{t('bulkUpload.utf8Encoding', 'Use UTF-8 encoding for special characters')}</li>
                    <li>{t('bulkUpload.maxFileSize', 'Maximum file size: 10MB')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={downloadTemplate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>{t('bulkUpload.downloadCsvTemplate', 'Download CSV Template')}</span>
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? t('bulkUpload.dropFile', 'Drop your CSV file here') : t('bulkUpload.uploadCsvFile', 'Upload CSV File')}
              </h3>
              <p className="text-gray-600">
                {t('bulkUpload.dragAndDrop', 'Drag and drop your CSV file here, or click to select')}
              </p>
            </div>
          </div>
        );

      case 1: // Field Mapping
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bulkUpload.mapColumns', 'Map CSV Columns')}</h2>
              <p className="text-gray-600">
                {t('bulkUpload.mapDescription', 'Map your CSV columns to the corresponding product fields')}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requiredFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">{t('bulkUpload.required', '*')}</span>}
                    </label>
                    <select
                      value={fieldMapping[field.key] || ''}
                      onChange={(e) => setFieldMapping(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t('bulkUpload.selectColumn', 'Select CSV column...')}</option>
                      {csvHeaders.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(0)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t('bulkUpload.back', 'Back')}</span>
              </button>
              <button
                onClick={handleValidation}
                disabled={!Object.values(fieldMapping).some(v => v)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>{t('bulkUpload.validateData', 'Validate Data')}</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 2: // Validation
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bulkUpload.validationResults', 'Data Validation Results')}</h2>
              <p className="text-gray-600">
                {t('bulkUpload.reviewErrors', 'Review validation results and fix any errors before proceeding')}
              </p>
            </div>

            {/* Validation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('bulkUpload.totalRows', 'Total Rows')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{validationStats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-50">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('bulkUpload.valid', 'Valid')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{validationStats.valid}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-red-50">
                    <XMarkIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('bulkUpload.errors', 'Errors')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{validationStats.errors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-yellow-50">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">{t('bulkUpload.warnings', 'Warnings')}</p>
                    <p className="text-2xl font-semibold text-gray-900">{validationStats.warnings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Errors Table */}
            {processedData.some(row => row._errors.length > 0) && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{t('bulkUpload.validationIssues', 'Validation Issues')}</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('bulkUpload.row', 'Row')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('bulkUpload.field', 'Field')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('bulkUpload.value', 'Value')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('bulkUpload.issue', 'Issue')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('bulkUpload.type', 'Type')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {processedData.flatMap(row => 
                        row._errors.map((error, index) => (
                          <tr key={`${row._rowIndex}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {error.row}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {error.field}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {error.value || '(empty)'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {error.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                error.severity === 'error' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {t(`bulkUpload.${error.severity}`, error.severity)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t('bulkUpload.backToMapping', 'Back to Mapping')}</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={validationStats.errors > 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>{t('bulkUpload.previewImport', 'Preview Import')} ({validationStats.valid} {t('bulkUpload.products', 'products')})</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      case 3: // Preview
        const validRows = processedData.filter(row => row._status === 'valid');
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bulkUpload.previewImport', 'Preview Import')}</h2>
              <p className="text-gray-600">
                {t('bulkUpload.reviewProducts', 'Review {count} products that will be imported').replace('{count}', validRows.length.toString())}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-h-96 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {requiredFields.slice(0, 6).map((field) => (
                      <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validRows.slice(0, 20).map((row, index) => (
                    <tr key={index}>
                      {requiredFields.slice(0, 6).map((field) => (
                        <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[fieldMapping[field.key]] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {validRows.length > 20 && (
                <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                  {t('bulkUpload.showingFirst', 'Showing first 20 of')} {validRows.length} {t('bulkUpload.products', 'products')}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t('bulkUpload.backToValidation', 'Back to Validation')}</span>
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <PlayIcon className="w-5 h-5" />
                <span>{isImporting ? t('bulkUpload.importing', 'Importing...') : t('bulkUpload.importProducts', 'Import {count} Products').replace('{count}', validRows.length.toString())}</span>
              </button>
            </div>
          </div>
        );

      case 4: // Import Progress/Complete
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isImporting ? t('bulkUpload.importing', 'Importing Products...') : t('bulkUpload.importComplete', 'Import Complete!')}
              </h2>
              <p className="text-gray-600">
                {isImporting 
                  ? t('bulkUpload.processing', 'Processing {processed} of {total} products').replace('{processed}', importStats.processed.toString()).replace('{total}', importStats.total.toString())
                  : t('bulkUpload.successfullyImported', 'Successfully imported {success} products').replace('{success}', importStats.success.toString())
                }
              </p>
            </div>

            {isImporting && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('bulkUpload.importProgress', 'Import Progress')}</span>
                  <span className="text-sm text-gray-500">
                    {importStats.processed} / {importStats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(importStats.processed / importStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {!isImporting && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-green-50">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">{t('bulkUpload.successful', 'Successful')}</p>
                      <p className="text-2xl font-semibold text-gray-900">{importStats.success}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-red-50">
                      <XMarkIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">{t('bulkUpload.failed', 'Failed')}</p>
                      <p className="text-2xl font-semibold text-gray-900">{importStats.errors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">{t('bulkUpload.totalProcessed', 'Total Processed')}</p>
                      <p className="text-2xl font-semibold text-gray-900">{importStats.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isImporting && (
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => window.location.href = '/seller/products/list'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('bulkUpload.viewProducts', 'View Products')}
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setCsvData([]);
                    setCsvHeaders([]);
                    setFieldMapping({});
                    setProcessedData([]);
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t('bulkUpload.importMoreProducts', 'Import More Products')}
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('bulkUpload.title', 'Bulk Product Import')}</h1>
        <p className="text-gray-600 mt-2">{t('bulkUpload.subtitle', 'Import multiple products using CSV file')}</p>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default ProductBulkUpload;