import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import { CategoryTreeSelector } from '../../components/ui/CategoryTreeSelector';
import { Category } from '../../types/category';
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  FolderPlusIcon
} from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Alert,
  AlertDescription
} from '@/shared/components/ui';

interface CategoryRequestFormData {
  parentCategoryId: string;
  categoryName: string;
  categoryNameAr: string;
  description: string;
  descriptionAr: string;
  businessJustification: string;
  expectedProductCount: number;
  targetMarket: string;
}

export const RequestCategory: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState<CategoryRequestFormData>({
    parentCategoryId: '',
    categoryName: '',
    categoryNameAr: '',
    description: '',
    descriptionAr: '',
    businessJustification: '',
    expectedProductCount: 1,
    targetMarket: ''
  });
  
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.parentCategoryId) {
      newErrors.parentCategoryId = t('categoryRequest.errors.parentRequired', 'Parent category is required');
    }
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = t('categoryRequest.errors.nameRequired', 'Category name is required');
    }
    if (!formData.categoryNameAr.trim()) {
      newErrors.categoryNameAr = t('categoryRequest.errors.nameArRequired', 'Arabic category name is required');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('categoryRequest.errors.descriptionRequired', 'Description is required');
    }
    if (!formData.businessJustification.trim()) {
      newErrors.businessJustification = t('categoryRequest.errors.justificationRequired', 'Business justification is required');
    }
    if (formData.expectedProductCount < 1) {
      newErrors.expectedProductCount = t('categoryRequest.errors.productCountRequired', 'Expected product count must be at least 1');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to submit the category request
      console.log('Category request submitted:', formData);
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/seller/products');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting category request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParentCategorySelect = (category: Category) => {
    setSelectedParentCategory(category);
    setFormData(prev => ({ ...prev, parentCategoryId: category.id }));
    if (errors.parentCategoryId) {
      setErrors(prev => ({ ...prev, parentCategoryId: '' }));
    }
  };

  const handleInputChange = (field: keyof CategoryRequestFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeftIcon className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="ml-2">{t('common.back', 'Back')}</span>
            </button>
          </div>
          
          <div className="flex items-center mb-2">
            <FolderPlusIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('categoryRequest.title', 'Request New Category')}
            </h1>
          </div>
          
          <p className="text-gray-600">
            {t('categoryRequest.subtitle', 'Request a new subcategory to be added to our catalog')}
          </p>
        </div>

        {/* Status Alerts */}
        {submitStatus === 'success' && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {t('categoryRequest.success', 'Your category request has been submitted successfully! Our team will review it and get back to you soon.')}
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              {t('categoryRequest.error', 'There was an error submitting your request. Please try again.')}
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <InformationCircleIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t('categoryRequest.info', 'Category requests are typically reviewed within 1-3 business days. You will be notified once your request is approved.')}
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('categoryRequest.formTitle', 'Category Request Details')}</CardTitle>
            <CardDescription>
              {t('categoryRequest.formDescription', 'Provide details about the category you would like to add')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Category Selection */}
              <div>
                <Label htmlFor="parentCategory" className="text-base font-medium">
                  {t('categoryRequest.parentCategory', 'Parent Category')} *
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  {t('categoryRequest.parentCategoryHelp', 'Select the parent category where your new subcategory should be added')}
                </p>
                <CategoryTreeSelector
                  selectedCategoryId={formData.parentCategoryId}
                  onSelect={handleParentCategorySelect}
                  allowParentSelection={true}
                  placeholder={t('categoryRequest.selectParent', 'Select parent category')}
                  error={errors.parentCategoryId}
                />
                {errors.parentCategoryId && (
                  <p className="text-red-600 text-sm mt-1">{errors.parentCategoryId}</p>
                )}
              </div>

              {/* Category Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="categoryName">
                    {t('categoryRequest.categoryName', 'Category Name (English)')} *
                  </Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) => handleInputChange('categoryName', e.target.value)}
                    placeholder={t('categoryRequest.categoryNamePlaceholder', 'e.g., Smart Watches')}
                    className={errors.categoryName ? 'border-red-500' : ''}
                  />
                  {errors.categoryName && (
                    <p className="text-red-600 text-sm mt-1">{errors.categoryName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="categoryNameAr">
                    {t('categoryRequest.categoryNameAr', 'Category Name (Arabic)')} *
                  </Label>
                  <Input
                    id="categoryNameAr"
                    value={formData.categoryNameAr}
                    onChange={(e) => handleInputChange('categoryNameAr', e.target.value)}
                    placeholder={t('categoryRequest.categoryNameArPlaceholder', 'e.g., الساعات الذكية')}
                    className={errors.categoryNameAr ? 'border-red-500' : ''}
                    dir="rtl"
                  />
                  {errors.categoryNameAr && (
                    <p className="text-red-600 text-sm mt-1">{errors.categoryNameAr}</p>
                  )}
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="description">
                    {t('categoryRequest.description', 'Description (English)')} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('categoryRequest.descriptionPlaceholder', 'Describe what products will be in this category...')}
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="descriptionAr">
                    {t('categoryRequest.descriptionAr', 'Description (Arabic)')}
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    placeholder={t('categoryRequest.descriptionArPlaceholder', 'صف المنتجات التي ستكون في هذه الفئة...')}
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Business Justification */}
              <div>
                <Label htmlFor="businessJustification">
                  {t('categoryRequest.businessJustification', 'Business Justification')} *
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  {t('categoryRequest.businessJustificationHelp', 'Explain why this category is needed and how it will benefit your business')}
                </p>
                <Textarea
                  id="businessJustification"
                  value={formData.businessJustification}
                  onChange={(e) => handleInputChange('businessJustification', e.target.value)}
                  placeholder={t('categoryRequest.businessJustificationPlaceholder', 'This category is needed because...')}
                  rows={4}
                  className={errors.businessJustification ? 'border-red-500' : ''}
                />
                {errors.businessJustification && (
                  <p className="text-red-600 text-sm mt-1">{errors.businessJustification}</p>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="expectedProductCount">
                    {t('categoryRequest.expectedProductCount', 'Expected Product Count')}
                  </Label>
                  <Input
                    id="expectedProductCount"
                    type="number"
                    min="1"
                    value={formData.expectedProductCount}
                    onChange={(e) => handleInputChange('expectedProductCount', parseInt(e.target.value) || 1)}
                    placeholder="10"
                    className={errors.expectedProductCount ? 'border-red-500' : ''}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {t('categoryRequest.expectedProductCountHelp', 'How many products do you plan to list in this category?')}
                  </p>
                  {errors.expectedProductCount && (
                    <p className="text-red-600 text-sm mt-1">{errors.expectedProductCount}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="targetMarket">
                    {t('categoryRequest.targetMarket', 'Target Market')}
                  </Label>
                  <Input
                    id="targetMarket"
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                    placeholder={t('categoryRequest.targetMarketPlaceholder', 'e.g., Tech enthusiasts, fitness lovers')}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {t('categoryRequest.targetMarketHelp', 'Who is your target customer for this category?')}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t('categoryRequest.submitting', 'Submitting...')}
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      {t('categoryRequest.submit', 'Submit Request')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestCategory;