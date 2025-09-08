export interface Category {
  id: string;
  value: string;
  label: string;
  labelAr: string;
  description?: string;
  descriptionAr?: string;
  parent?: string;
  children?: Category[];
  level: number;
  isActive: boolean;
  icon?: string;
  specifications?: CategorySpecification[];
}

export interface CategorySpecification {
  id: string;
  key: string;
  keyAr: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  options?: Array<{ value: string; label: string; labelAr: string }>;
}

export interface CategoryPath {
  category: Category;
  path: Category[];
}