import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  FolderTree, 
  Globe, 
  Settings, 
  Tag, 
  Plus, 
  X, 
  Image,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

interface CategoryFormData {
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  slug: string
  parentId: string
  status: 'active' | 'inactive'
  featured: boolean
  sortOrder: number
  icon: string
  image: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  attributes: string[]
  requiresApproval: boolean
  allowReviews: boolean
  showInMenu: boolean
  commissionRate: number
  businessJustification: string
}

interface ParentCategory {
  id: string
  name: string
  nameAr: string
  level: number
}

const mockParentCategories: ParentCategory[] = [
  { id: '1', name: 'Electronics', nameAr: 'الإلكترونيات', level: 0 },
  { id: '2', name: 'Smart Home Devices', nameAr: 'أجهزة المنزل الذكي', level: 1 },
  { id: '3', name: 'Industrial Equipment', nameAr: 'المعدات الصناعية', level: 0 },
  { id: '4', name: 'Construction Tools', nameAr: 'أدوات البناء', level: 1 },
  { id: '5', name: 'Medical Supplies', nameAr: 'المستلزمات الطبية', level: 0 },
  { id: '6', name: 'Diagnostic Equipment', nameAr: 'معدات التشخيص', level: 1 },
  { id: '7', name: 'Office Supplies', nameAr: 'مستلزمات المكاتب', level: 0 }
]

const commonAttributes = [
  'Brand', 'Model', 'Color', 'Size', 'Material', 'Weight', 'Dimensions',
  'Power Rating', 'Voltage', 'Capacity', 'Warranty', 'Certification',
  'Origin Country', 'Manufacturer', 'Usage Type', 'Compatibility'
]

export default function AddCategory() {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    slug: '',
    parentId: '',
    status: 'active',
    featured: false,
    sortOrder: 1,
    icon: '',
    image: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    attributes: [],
    requiresApproval: true,
    allowReviews: true,
    showInMenu: true,
    commissionRate: 5.0,
    businessJustification: ''
  })

  const [newAttribute, setNewAttribute] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const addAttribute = () => {
    if (newAttribute.trim() && !formData.attributes.includes(newAttribute.trim())) {
      setFormData(prev => ({
        ...prev,
        attributes: [...prev.attributes, newAttribute.trim()]
      }))
      setNewAttribute('')
    }
  }

  const removeAttribute = (attribute: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(attr => attr !== attribute)
    }))
  }

  const addCommonAttribute = (attribute: string) => {
    if (!formData.attributes.includes(attribute)) {
      setFormData(prev => ({
        ...prev,
        attributes: [...prev.attributes, attribute]
      }))
    }
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (!formData.name.trim()) errors.push('Category name is required')
    if (!formData.nameAr.trim()) errors.push('Arabic category name is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (!formData.descriptionAr.trim()) errors.push('Arabic description is required')
    if (!formData.slug.trim()) errors.push('Slug is required')
    if (!formData.businessJustification.trim()) errors.push('Business justification is required')
    
    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      errors.push('Commission rate must be between 0 and 100')
    }
    
    if (formData.sortOrder < 1) {
      errors.push('Sort order must be at least 1')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Category submitted:', formData)
      // Handle success - redirect or show success message
    } catch (error) {
      console.error('Error creating category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add Category</h1>
            <p className="text-muted-foreground">Create a new product category for the marketplace</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive mb-2">Please fix the following errors:</h4>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="seo">SEO & Display</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="settings">Advanced Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="w-5 h-5" />
                    Category Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name (English) *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Smart Home Devices"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">Category Name (Arabic) *</Label>
                      <Input
                        id="nameAr"
                        value={formData.nameAr}
                        onChange={(e) => handleInputChange('nameAr', e.target.value)}
                        placeholder="مثال: أجهزة المنزل الذكي"
                        dir="rtl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="smart-home-devices"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        URL-friendly version of the name (auto-generated)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Hierarchy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentId">Parent Category</Label>
                    <Select value={formData.parentId} onValueChange={(value) => handleInputChange('parentId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Parent (Root Category)</SelectItem>
                        {mockParentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {'  '.repeat(category.level)}
                            {category.name} - {category.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      min="1"
                      value={formData.sortOrder}
                      onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 1)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first in listings
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (English) *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the category and what products it contains..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="descriptionAr">Description (Arabic) *</Label>
                    <Textarea
                      id="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                      placeholder="وصف الفئة والمنتجات التي تحتويها..."
                      dir="rtl"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Justification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="businessJustification">Business Justification *</Label>
                  <Textarea
                    id="businessJustification"
                    value={formData.businessJustification}
                    onChange={(e) => handleInputChange('businessJustification', e.target.value)}
                    placeholder="Explain why this category is needed, market demand, expected benefits..."
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide business reasons for creating this category
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO & Display Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                      placeholder="Category Name - Saudi B2B Marketplace"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.seoTitle.length}/60 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                      placeholder="Brief description for search engines..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.seoDescription.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">SEO Keywords</Label>
                    <Input
                      id="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate keywords with commas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Media & Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Category Icon</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      placeholder="e.g., smartphone, home, tools"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lucide icon name for the category
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Category Image</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop image here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 400x300px, JPG or PNG, max 2MB
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured Category</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showInMenu">Show in Navigation Menu</Label>
                      <Switch
                        id="showInMenu"
                        checked={formData.showInMenu}
                        onCheckedChange={(checked) => handleInputChange('showInMenu', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Category Attributes
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define attributes that products in this category should have
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Custom Attribute */}
                <div className="space-y-2">
                  <Label>Add Custom Attribute</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAttribute}
                      onChange={(e) => setNewAttribute(e.target.value)}
                      placeholder="e.g., Screen Size, Battery Life"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
                    />
                    <Button type="button" onClick={addAttribute} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Common Attributes */}
                <div className="space-y-2">
                  <Label>Common Attributes</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonAttributes.map((attr) => (
                      <Button
                        key={attr}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCommonAttribute(attr)}
                        disabled={formData.attributes.includes(attr)}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        {attr}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Attributes */}
                {formData.attributes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Attributes</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.attributes.map((attr) => (
                        <Badge key={attr} variant="secondary" className="gap-1">
                          {attr}
                          <button
                            type="button"
                            onClick={() => removeAttribute(attr)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Content Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requiresApproval">Requires Approval</Label>
                      <p className="text-sm text-muted-foreground">
                        Products in this category need admin approval
                      </p>
                    </div>
                    <Switch
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onCheckedChange={(checked) => handleInputChange('requiresApproval', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowReviews">Allow Reviews</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable customer reviews for products
                      </p>
                    </div>
                    <Switch
                      id="allowReviews"
                      checked={formData.allowReviews}
                      onCheckedChange={(checked) => handleInputChange('allowReviews', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Platform commission for products in this category
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Submit Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Category will be created and sent for approval
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <>Creating...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Category
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </form>
    </div>
  )
}