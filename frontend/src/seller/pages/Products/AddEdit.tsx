import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { CategoryTreeSelector } from '../../components/ui/CategoryTreeSelector';
import { Category } from '../../types/category';
import { findCategoryById, getCategoryPath, categoryTree } from '../../data/categories';
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
  ArrowLeftIcon as ArrowLeftSecondIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface ProductFormData {
  name: string;
  nameAr: string;
  sku: string;
  categoryId: string;
  categoryPath: string[];
  description: string;
  descriptionAr: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'draft';
  tags: string[];
  images: File[];
  specifications: Array<{ key: string; value: string; keyAr: string; valueAr: string }>;
  variants: Array<{ name: string; nameAr: string; price: number; stock: number; sku: string }>;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

const initialFormData: ProductFormData = {
  name: '',
  nameAr: '',
  sku: '',
  categoryId: '',
  categoryPath: [],
  description: '',
  descriptionAr: '',
  price: 0,
  costPrice: 0,
  stock: 0,
  lowStockThreshold: 5,
  status: 'draft',
  tags: [],
  images: [],
  specifications: [],
  variants: [],
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
  },
};

// Categories are now imported from the categories data file

const ProductAddEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [newTag, setNewTag] = useState('');
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const steps = [
    { number: 1, title: t('addProduct.basicInfo'), icon: DocumentTextIcon },
    { number: 2, title: t('addProduct.detailsMedia'), icon: PhotoIcon },
    { number: 3, title: t('addProduct.pricingInventory'), icon: CurrencyDollarIcon },
    { number: 4, title: t('addProduct.reviewPublish'), icon: CheckCircleIcon },
  ];

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!isDirty) return;
    
    setAutoSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoSaveStatus('saved');
      setIsDirty(false);
    } catch (error) {
      setAutoSaveStatus('error');
    }
  }, [isDirty]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [autoSave]);

  // Generate SKU automatically
  useEffect(() => {
    if (formData.name && !formData.sku && !isEditing) {
      const generatedSku = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 10) + '-' + Date.now().toString().slice(-4);
      setFormData(prev => ({ ...prev, sku: generatedSku }));
    }
  }, [formData.name, isEditing]);

  const validateStep = (step: number): boolean => {
    const stepErrors: ValidationError[] = [];

    switch (step) {
      case 1:
        if (!formData.name.trim()) stepErrors.push({ field: 'name', message: t('validation.nameRequired') });
        if (!formData.nameAr.trim()) stepErrors.push({ field: 'nameAr', message: t('validation.nameArRequired') });
        if (!formData.sku.trim()) stepErrors.push({ field: 'sku', message: t('validation.skuRequired') });
        if (!formData.category) stepErrors.push({ field: 'category', message: t('validation.categoryRequired') });
        break;
      case 2:
        if (!formData.description.trim()) stepErrors.push({ field: 'description', message: t('validation.descriptionRequired') });
        if (!formData.descriptionAr.trim()) stepErrors.push({ field: 'descriptionAr', message: t('validation.descriptionArRequired') });
        break;
      case 3:
        if (formData.price <= 0) stepErrors.push({ field: 'price', message: t('validation.priceRequired') });
        if (formData.stock < 0) stepErrors.push({ field: 'stock', message: t('validation.stockNegative') });
        break;
    }

    setErrors(stepErrors);
    return stepErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear errors for this field
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleCategorySelect = (category: Category) => {
    const path = getCategoryPath(categoryTree, category.id);
    handleInputChange('categoryId', category.id);
    handleInputChange('categoryPath', path.map(cat => cat.id));
    
    // Auto-populate specifications if the category has them
    if (category.specifications && category.specifications.length > 0) {
      const autoSpecs = category.specifications.map(spec => ({
        key: spec.key,
        keyAr: spec.keyAr,
        value: '',
        valueAr: ''
      }));
      handleInputChange('specifications', autoSpecs);
    }
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
      specifications: [...prev.specifications, { key: '', value: '', keyAr: '', valueAr: '' }]
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
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/seller/products/list');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
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
            onClick={() => navigate('/seller/products/list')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? t('editProduct.title') : t('addProduct.title')}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                {t('addProduct.step')} {currentStep} {t('addProduct.of')} {steps.length}
              </span>
              {autoSaveStatus === 'saving' && (
                <span className="text-xs text-blue-600">{t('addProduct.saving')}</span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  {t('addProduct.saved')}
                </span>
              )}
              {autoSaveStatus === 'error' && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  {t('addProduct.saveError')}
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
              <h3 className="text-lg font-semibold text-gray-900">المعلومات الأساسية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.nameEn')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Industrial Water Pump HP-2000"
                  />
                  {getFieldError('name') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.nameAr')} *
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
                    {t('addProduct.sku')} *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('sku') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="PUMP-HP-2000"
                  />
                  {getFieldError('sku') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('sku')}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {t('addProduct.autoSku')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.category')} *
                  </label>
                  <CategoryTreeSelector
                    selectedCategoryId={formData.categoryId}
                    onSelect={handleCategorySelect}
                    allowParentSelection={false}
                    placeholder={t('addProduct.selectCategory')}
                    error={getFieldError('categoryId')}
                  />
                  {getFieldError('categoryId') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('categoryId')}</p>
                  )}
                  
                  {/* Category Path Display */}
                  {formData.categoryId && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">
                        {t('addProduct.categoryPath', 'Category Path')}:
                      </div>
                      <div className="flex items-center text-sm">
                        {getCategoryPath(categoryTree, formData.categoryId).map((cat, index, arr) => (
                          <React.Fragment key={cat.id}>
                            <span className="text-gray-700">
                              {isRTL ? cat.labelAr : cat.label}
                            </span>
                            {index < arr.length - 1 && (
                              <ChevronRightIcon className={`w-4 h-4 mx-1 text-gray-400 ${
                                isRTL ? 'rotate-180' : ''
                              }`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProduct.tags')}
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('addProduct.addTag')}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('addProduct.addTag')}
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
              <h3 className="text-lg font-semibold text-gray-900">التفاصيل والوسائط</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.descriptionEn')} *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('description') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="High-pressure industrial water pump suitable for large-scale operations..."
                  />
                  {getFieldError('description') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.descriptionAr')} *
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
                  {t('addProduct.images')}
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
                      {t('addProduct.dragImages')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG، JPG، GIF حتى 10MB لكل صورة
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
                    {t('addProduct.specifications')}
                  </label>
                  <button
                    onClick={addSpecification}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    {t('addProduct.addSpec')}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        placeholder="المفتاح (إنجليزي)"
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="القيمة (إنجليزي)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="المفتاح (عربي)"
                        value={spec.keyAr}
                        onChange={(e) => updateSpecification(index, 'keyAr', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="القيمة (عربي)"
                          value={spec.valueAr}
                          onChange={(e) => updateSpecification(index, 'valueAr', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          dir="rtl"
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
              <h3 className="text-lg font-semibold text-gray-900">{t('addProduct.pricingInventory')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.sellingPrice')} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('price') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="15000"
                  />
                  {getFieldError('price') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.costPrice')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12000"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    هامش الربح: {formData.price && formData.costPrice ? 
                      `${(((formData.price - formData.costPrice) / formData.price) * 100).toFixed(1)}%` : '0%'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addProduct.stockQuantity')} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getFieldError('stock') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25"
                  />
                  {getFieldError('stock') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('stock')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('addProduct.lowStockThreshold')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('addProduct.lowStockAlert')}
                  </p>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">{t('addProduct.dimensions')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('addProduct.length')}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...formData.dimensions,
                        length: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('addProduct.width')}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...formData.dimensions,
                        width: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('addProduct.height')}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...formData.dimensions,
                        height: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">{t('addProduct.weight')}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.weight}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...formData.dimensions,
                        weight: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('addProduct.productStatus')}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">{t('status.draft')}</option>
                  <option value="active">{t('status.active')}</option>
                  <option value="inactive">{t('status.inactive')}</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('addProduct.review')}</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('addProduct.productInfo')}</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.name')}:</dt>
                        <dd className="text-gray-900">{formData.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.productCode')}:</dt>
                        <dd className="text-gray-900">{formData.sku}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.category')}:</dt>
                        <dd className="text-gray-900">
                          {formData.categoryId ? (
                            <div className="space-y-1">
                              <div>
                                {(() => {
                                  const selectedCategory = findCategoryById(categoryTree, formData.categoryId);
                                  return selectedCategory ? (isRTL ? selectedCategory.labelAr : selectedCategory.label) : formData.categoryId;
                                })()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getCategoryPath(categoryTree, formData.categoryId).map((cat, index, arr) => (
                                  <React.Fragment key={cat.id}>
                                    {isRTL ? cat.labelAr : cat.label}
                                    {index < arr.length - 1 && ' › '}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ) : (
                            t('addProduct.notSelected', 'Not selected')
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">السعر:</dt>
                        <dd className="text-gray-900 font-medium">
                          {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(formData.price)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.stockCount')}:</dt>
                        <dd className="text-gray-900">{formData.stock} {t('products.units')}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">الحالة والإعدادات</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">الحالة:</dt>
                        <dd className="text-gray-900">
                          {formData.status === 'active' && t('status.active')}
                          {formData.status === 'inactive' && t('status.inactive')}
                          {formData.status === 'draft' && t('status.draft')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.imageCount')}:</dt>
                        <dd className="text-gray-900">{formData.images.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.specCount')}:</dt>
                        <dd className="text-gray-900">{formData.specifications.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">{t('addProduct.tags')}:</dt>
                        <dd className="text-gray-900">{formData.tags.length}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">{t('addProduct.description')}</h4>
                  <p className="text-sm text-gray-600">{formData.description}</p>
                </div>
              </div>

              {/* Validation Summary */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-900">{t('validation.fixErrors')}</h4>
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
            <ArrowLeftSecondIcon className="w-4 h-4" />
            {t('addProduct.previous')}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('addProduct.next')}
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
                  {t('addProduct.saving')}
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  {isEditing ? t('addProduct.saveChanges') : t('addProduct.publishProduct')}
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
            <span className="text-sm text-yellow-800">لديك تغييرات غير محفوظة</span>
          </div>
          <button
            onClick={autoSave}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
          >
            حفظ الآن
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductAddEdit;