// Enhanced Product Management Types
export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { size: 'Large', color: 'Red' }
  price: number;
  stock: number;
  images?: string[];
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
  category: string;
}

export interface ProductReorderPoint {
  threshold: number;
  reorderQuantity: number;
  supplier?: string;
  leadTimeDays: number;
}

export interface ProductPricing {
  cost: number;
  price: number;
  minOrderQuantity?: number;
  bulkPricing?: Array<{
    quantity: number;
    price: number;
  }>;
}

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug?: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string; // Arabic name
  category: string;
  subcategory?: string;
  brand?: string;
  description: string;
  descriptionAr?: string; // Arabic description
  shortDescription?: string;
  sku: string;
  barcode?: string;
  
  // Pricing and inventory
  pricing: ProductPricing;
  stock: number;
  stockUnit: string;
  reservedStock?: number;
  reorderPoint?: ProductReorderPoint;
  
  // Product variants
  hasVariants: boolean;
  variants: ProductVariant[];
  
  // Media
  images: string[];
  videos?: string[];
  documents?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  
  // Specifications and features
  specifications: ProductSpecification[];
  features: string[];
  
  // Status and visibility
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  visibility: 'public' | 'private' | 'catalog_only';
  isDigital: boolean;
  
  // Shipping and dimensions
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  shippingClass?: string;
  
  // SEO and marketing
  seo?: ProductSEO;
  tags: string[];
  
  // Compliance and certifications
  certifications?: string[];
  countryOfOrigin?: string;
  hsCode?: string; // Harmonized System code
  
  // Timestamps and audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
}

export interface ProductFilter {
  category?: string[];
  subcategory?: string[];
  status?: string[];
  brand?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  stockLevel?: 'in_stock' | 'low_stock' | 'out_of_stock';
  tags?: string[];
  createdDateRange?: {
    from: string;
    to: string;
  };
}

export interface ProductSort {
  field: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt' | 'sku';
  direction: 'asc' | 'desc';
}

export interface ProductListState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  selectedProducts: string[];
  currentFilter: ProductFilter;
  currentSort: ProductSort;
  searchQuery: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface BulkAction {
  type: 'update_status' | 'update_price' | 'update_stock' | 'delete' | 'duplicate' | 'export';
  data?: any;
  selectedIds: string[];
}

export interface ProductFormState {
  currentStep: number;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: string;
  errors: Record<string, string>;
  product: Partial<Product>;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  type: 'low_stock' | 'out_of_stock' | 'reorder_needed';
  severity: 'low' | 'medium' | 'high';
  currentStock: number;
  threshold?: number;
  message: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  variantId?: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  createdAt: string;
  createdBy: string;
}

export interface BulkUploadTemplate {
  id: string;
  name: string;
  description: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date';
    required: boolean;
    validation?: {
      pattern?: string;
      min?: number;
      max?: number;
      options?: string[];
    };
    example?: string;
    helpText?: string;
  }>;
}

export interface BulkUploadResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
    data?: any;
  }>;
  warnings: Array<{
    row: number;
    message: string;
    data?: any;
  }>;
}

// Arabic/RTL Support Types
export interface LocalizedContent {
  en: string;
  ar?: string;
}

export interface RTLConfig {
  isRTL: boolean;
  locale: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  numberFormat: 'western' | 'arabic';
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
}

// UI Component Props Types
export interface FilterSidebarProps {
  filters: ProductFilter;
  onFiltersChange: (filters: ProductFilter) => void;
  categories: string[];
  brands: string[];
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onQuickEdit: (id: string, field: string, value: any) => void;
}

export interface BulkActionBarProps {
  selectedCount: number;
  onAction: (action: BulkAction) => void;
  onClearSelection: () => void;
  isVisible: boolean;
}

export interface StepperProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    isActive: boolean;
  }>;
  currentStep: number;
  onStepClick: (step: number) => void;
}

// Utility Types
export type ProductStatus = Product['status'];
export type ProductVisibility = Product['visibility'];
export type BulkActionType = BulkAction['type'];
export type InventoryAlertType = InventoryAlert['type'];
export type StockMovementType = StockMovement['type'];