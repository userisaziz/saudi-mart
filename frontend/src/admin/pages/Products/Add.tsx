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
import { Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
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
    
    // Clear errors for this field
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
      // Simulate API call
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
              {autoSaveStatus === 'error' && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  Save Error
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <EyeIcon className="w-4 h-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <StepIndicator />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name (English) *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name in English"
                />
              </div>
              <div>
                <Label htmlFor="nameAr">Product Name (Arabic) *</Label>
                <Input
                  id="nameAr"
                  required
                  value={formData.nameAr}
                  onChange={(e) => handleInputChange('nameAr', e.target.value)}
                  placeholder="أدخل اسم المنتج بالعربية"
                  className="text-right"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Product brand"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Product model"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  required
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Unique product code"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description in English"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                  placeholder="وصف تفصيلي للمنتج بالعربية"
                  rows={4}
                  className="text-right"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Categorization
            </CardTitle>
            <CardDescription>Product category and tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartphones">Smartphones</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing
            </CardTitle>
            <CardDescription>Product pricing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Regular Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                placeholder="15"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory
            </CardTitle>
            <CardDescription>Stock and inventory management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Track Inventory</Label>
                <p className="text-sm text-muted-foreground">Enable stock tracking for this product</p>
              </div>
              <Switch
                checked={formData.trackInventory}
                onCheckedChange={(checked) => handleInputChange('trackInventory', checked)}
              />
            </div>
            
            {formData.trackInventory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Backorders</Label>
                <p className="text-sm text-muted-foreground">Allow orders when out of stock</p>
              </div>
              <Switch
                checked={formData.allowBackorders}
                onCheckedChange={(checked) => handleInputChange('allowBackorders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Specifications
            </CardTitle>
            <CardDescription>Technical specifications and attributes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Specification name"
                value={newSpec.name}
                onChange={(e) => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Value"
                value={newSpec.value}
                onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
              />
              <Button type="button" onClick={addSpecification} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{spec.name}:</span> {spec.value}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Product Status
            </CardTitle>
            <CardDescription>Publication and visibility settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="password">Password Protected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured Product</Label>
                <p className="text-sm text-muted-foreground">Mark as featured product</p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products/list')}
          >
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductAdd;