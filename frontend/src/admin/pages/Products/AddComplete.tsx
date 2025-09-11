import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CloudArrowUpIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ChevronRightIcon,
  UserIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { SaudiProduct, SaudiCategory, ProductVerificationStatus, SaudiRegion, UserRole } from '@/admin/types/saudi-admin';

interface AdminProductFormData {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  categoryId: string;
  price: {
    amount: number;
    currency: 'SAR';
    vatIncluded: boolean;
  };
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    location: string;
  };
  specifications: Array<{ 
    nameEn: string; 
    nameAr: string; 
    valueEn: string; 
    valueAr: string; 
    unit?: string;
  }>;
  compliance: {
    saudiStandards: boolean;
    halalCertified: boolean;
    importLicense?: string;
    customsCode?: string;
  };
  images: File[];
  tags: string[];
  sellerId: string;
  verificationStatus: ProductVerificationStatus;
  adminNotes: string;
  priority: 'low' | 'medium' | 'high';
}

interface ValidationError {
  field: string;
  message: string;
}

const initialFormData: AdminProductFormData = {
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  categoryId: '',
  price: {
    amount: 0,
    currency: 'SAR',
    vatIncluded: true,
  },
  inventory: {
    quantity: 0,
    lowStockThreshold: 5,
    location: '',
  },
  specifications: [],
  compliance: {
    saudiStandards: false,
    halalCertified: false,
    importLicense: '',
    customsCode: '',
  },
  images: [],
  tags: [],
  sellerId: '',
  verificationStatus: ProductVerificationStatus.PENDING,
  adminNotes: '',
  priority: 'medium',
};

// Mock categories
const mockCategories = [
  {
    id: 'industrial-equipment',
    nameEn: 'Industrial Equipment',
    nameAr: 'معدات صناعية',
  },
  {
    id: 'valves-controls',
    nameEn: 'Valves & Controls',
    nameAr: 'صمامات وأجهزة تحكم',
  },
  {
    id: 'electrical-components',
    nameEn: 'Electrical Components',
    nameAr: 'مكونات كهربائية',
  },
];

// Mock sellers
const mockSellers = [
  {
    id: 'seller1',
    nameEn: 'Ahmad Industries LLC',
    nameAr: 'صناعات أحمد المحدودة',
    verificationLevel: 'Fully Verified',
    region: SaudiRegion.RIYADH,
  },
  {
    id: 'seller2',
    nameEn: 'Gulf Equipment Co.',
    nameAr: 'شركة معدات الخليج',
    verificationLevel: 'Business Verified',
    region: SaudiRegion.MAKKAH,
  },
];

const AdminProductAdd: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<AdminProductFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    { number: 1, title: 'Basic Information', icon: DocumentTextIcon },
    { number: 2, title: 'Product Details', icon: PhotoIcon },
    { number: 3, title: 'Pricing & Inventory', icon: CurrencyDollarIcon },
    { number: 4, title: 'Seller & Compliance', icon: ShieldCheckIcon },
    { number: 5, title: 'Review & Publish', icon: CheckCircleIcon },
  ];

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!isDirty) return;
    
    setAutoSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoSaveStatus('saved');
      setIsDirty(false);
    } catch (error) {
      setAutoSaveStatus('error');
    }
  }, [isDirty]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const validateStep = (step: number): boolean => {
    const stepErrors: ValidationError[] = [];

    switch (step) {
      case 1:
        if (!formData.nameEn.trim()) stepErrors.push({ field: 'nameEn', message: 'English name is required' });
        if (!formData.nameAr.trim()) stepErrors.push({ field: 'nameAr', message: 'Arabic name is required' });
        if (!formData.categoryId) stepErrors.push({ field: 'categoryId', message: 'Category is required' });
        break;
      case 2:
        if (!formData.descriptionEn.trim()) stepErrors.push({ field: 'descriptionEn', message: 'English description is required' });
        if (!formData.descriptionAr.trim()) stepErrors.push({ field: 'descriptionAr', message: 'Arabic description is required' });
        break;
      case 3:
        if (formData.price.amount <= 0) stepErrors.push({ field: 'price', message: 'Price must be greater than 0' });
        if (formData.inventory.quantity < 0) stepErrors.push({ field: 'inventory', message: 'Stock cannot be negative' });
        if (!formData.inventory.location.trim()) stepErrors.push({ field: 'location', message: 'Inventory location is required' });
        break;
      case 4:
        if (!formData.sellerId) stepErrors.push({ field: 'sellerId', message: 'Seller must be selected' });
        break;
    }

    setErrors(stepErrors);
    return stepErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: keyof AdminProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof AdminProductFormData] as any,
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
      setIsDirty(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    setIsDirty(true);
  };

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).slice(0, 10 - formData.images.length);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    setIsDirty(true);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setIsDirty(true);
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { nameEn: '', nameAr: '', valueEn: '', valueAr: '', unit: '' }]
    }));
    setIsDirty(true);
  };

  const updateSpecification = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
    setIsDirty(true);
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/admin/products/list');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.number
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-300 text-gray-400'
          }`}>
            <step.icon className="w-5 h-5" />
          </div>
          <div className="mr-3 hidden sm:block">
            <p className={`text-sm font-medium ${
              currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.title}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products/list')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </span>
              {autoSaveStatus === 'saving' && (
                <span className="text-xs text-blue-600">Saving...</span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <StepIndicator />

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => handleInputChange('nameEn', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('nameEn') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Industrial Water Pump HP-2000"
                  />
                  {getFieldError('nameEn') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('nameEn')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name (Arabic) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('nameAr') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="مضخة مياه صناعية عالية الضغط HP-2000"
                    dir="rtl"
                  />
                  {getFieldError('nameAr') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('nameAr')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('categoryId') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nameEn} - {category.nameAr}
                      </option>
                    ))}
                  </select>
                  {getFieldError('categoryId') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('categoryId')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Tags
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Details & Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English) *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('descriptionEn') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="High-pressure industrial water pump suitable for large-scale operations..."
                  />
                  {getFieldError('descriptionEn') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('descriptionEn')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Arabic) *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('descriptionAr') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="مضخة مياه صناعية عالية الضغط مناسبة للعمليات واسعة النطاق..."
                    dir="rtl"
                  />
                  {getFieldError('descriptionAr') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('descriptionAr')}</p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Specifications
                  </label>
                  <button
                    onClick={addSpecification}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Specification
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        placeholder="Name (English)"
                        value={spec.nameEn}
                        onChange={(e) => updateSpecification(index, 'nameEn', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Name (Arabic)"
                        value={spec.nameAr}
                        onChange={(e) => updateSpecification(index, 'nameAr', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                      <input
                        type="text"
                        placeholder="Value (English)"
                        value={spec.valueEn}
                        onChange={(e) => updateSpecification(index, 'valueEn', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Value (Arabic)"
                        value={spec.valueAr}
                        onChange={(e) => updateSpecification(index, 'valueAr', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Unit"
                          value={spec.unit || ''}
                          onChange={(e) => updateSpecification(index, 'unit', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeSpecification(index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (SAR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price.amount}
                    onChange={(e) => handleNestedInputChange('price', 'amount', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('price') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="15000"
                  />
                  {getFieldError('price') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
                  )}
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.price.vatIncluded}
                        onChange={(e) => handleNestedInputChange('price', 'vatIncluded', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Price includes VAT</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory.quantity}
                    onChange={(e) => handleNestedInputChange('inventory', 'quantity', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('inventory') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25"
                  />
                  {getFieldError('inventory') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('inventory')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory.lowStockThreshold}
                    onChange={(e) => handleNestedInputChange('inventory', 'lowStockThreshold', parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Alert when stock falls below this threshold
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inventory Location *
                  </label>
                  <input
                    type="text"
                    value={formData.inventory.location}
                    onChange={(e) => handleNestedInputChange('inventory', 'location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('location') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Riyadh Warehouse"
                  />
                  {getFieldError('location') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('location')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Seller & Compliance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Seller *
                  </label>
                  <select
                    value={formData.sellerId}
                    onChange={(e) => handleInputChange('sellerId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('sellerId') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Seller</option>
                    {mockSellers.map(seller => (
                      <option key={seller.id} value={seller.id}>
                        {seller.nameEn} - {seller.verificationLevel}
                      </option>
                    ))}
                  </select>
                  {getFieldError('sellerId') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('sellerId')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Status
                  </label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => handleInputChange('verificationStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ProductVerificationStatus.PENDING}>Pending</option>
                    <option value={ProductVerificationStatus.UNDER_REVIEW}>Under Review</option>
                    <option value={ProductVerificationStatus.APPROVED}>Approved</option>
                    <option value={ProductVerificationStatus.REJECTED}>Rejected</option>
                    <option value={ProductVerificationStatus.REQUIRES_INFO}>Requires Info</option>
                  </select>
                </div>
              </div>

              {/* Compliance Section */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Compliance & Certifications</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.compliance.saudiStandards}
                        onChange={(e) => handleNestedInputChange('compliance', 'saudiStandards', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">SASO Standards Compliant</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.compliance.halalCertified}
                        onChange={(e) => handleNestedInputChange('compliance', 'halalCertified', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Halal Certified</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Import License</label>
                      <input
                        type="text"
                        value={formData.compliance.importLicense || ''}
                        onChange={(e) => handleNestedInputChange('compliance', 'importLicense', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="IMP-001234"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Customs Code</label>
                      <input
                        type="text"
                        value={formData.compliance.customsCode || ''}
                        onChange={(e) => handleNestedInputChange('compliance', 'customsCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="8414.10.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.adminNotes}
                  onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal notes about this product..."
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review & Publish</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Product Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Name (EN):</dt>
                        <dd className="text-gray-900 text-right">{formData.nameEn}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Name (AR):</dt>
                        <dd className="text-gray-900 text-right">{formData.nameAr}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Category:</dt>
                        <dd className="text-gray-900 text-right">
                          {mockCategories.find(c => c.id === formData.categoryId)?.nameEn}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Price:</dt>
                        <dd className="text-gray-900 text-right font-medium">
                          {formatCurrency(formData.price.amount)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Stock:</dt>
                        <dd className="text-gray-900 text-right">{formData.inventory.quantity} units</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Status & Settings</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Seller:</dt>
                        <dd className="text-gray-900 text-right">
                          {mockSellers.find(s => s.id === formData.sellerId)?.nameEn}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Status:</dt>
                        <dd className="text-gray-900 text-right">{formData.verificationStatus}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Priority:</dt>
                        <dd className="text-gray-900 text-right capitalize">{formData.priority}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Images:</dt>
                        <dd className="text-gray-900 text-right">{formData.images.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Specifications:</dt>
                        <dd className="text-gray-900 text-right">{formData.specifications.length}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Validation Summary */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Please fix the following errors:</h4>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || errors.length > 0}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {isDirty && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">You have unsaved changes</span>
          </div>
          <button
            onClick={autoSave}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
          >
            Save Now
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProductAdd;