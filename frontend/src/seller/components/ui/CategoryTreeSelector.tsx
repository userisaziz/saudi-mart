import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  FolderOpenIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Category } from '../../types/category';
import { categoryTree, getCategoryPath, getLeafCategories } from '../../data/categories';

interface CategoryTreeSelectorProps {
  selectedCategoryId?: string;
  onSelect: (category: Category) => void;
  allowParentSelection?: boolean;
  placeholder?: string;
  error?: string;
}

export const CategoryTreeSelector: React.FC<CategoryTreeSelectorProps> = ({
  selectedCategoryId,
  onSelect,
  allowParentSelection = false,
  placeholder,
  error
}) => {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (selectedCategoryId) {
      const path = getCategoryPath(categoryTree, selectedCategoryId);
      if (path.length > 0) {
        setSelectedCategory(path[path.length - 1]);
        // Expand all parent categories in the path
        const parentIds = path.slice(0, -1).map(cat => cat.id);
        setExpandedCategories(new Set(parentIds));
      }
    }
  }, [selectedCategoryId]);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (category: Category) => {
    const canSelect = allowParentSelection || (!category.children || category.children.length === 0);
    
    if (canSelect) {
      setSelectedCategory(category);
      onSelect(category);
      setIsOpen(false);
      setSearchTerm('');
    } else {
      // If it's a parent category and we don't allow parent selection, just toggle expansion
      toggleExpanded(category.id);
    }
  };

  const filterCategories = (categories: Category[], term: string): Category[] => {
    if (!term) return categories;

    const filtered: Category[] = [];
    
    for (const category of categories) {
      const matchesSearch = 
        category.label.toLowerCase().includes(term.toLowerCase()) ||
        category.labelAr.includes(term) ||
        category.value.toLowerCase().includes(term.toLowerCase());

      if (matchesSearch) {
        filtered.push(category);
      } else if (category.children) {
        const filteredChildren = filterCategories(category.children, term);
        if (filteredChildren.length > 0) {
          filtered.push({
            ...category,
            children: filteredChildren
          });
        }
      }
    }

    return filtered;
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;
    const canSelect = allowParentSelection || !hasChildren;
    
    const indentClass = isRTL 
      ? `pr-${level * 4}` 
      : `pl-${level * 4}`;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          } ${indentClass}`}
          onClick={() => handleCategorySelect(category)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(category.id);
                }}
                className="flex-shrink-0 p-1 mr-2 rounded hover:bg-gray-200"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                )}
              </button>
            )}
            
            <div className="flex items-center min-w-0 flex-1">
              <div className="flex-shrink-0 mr-2">
                {category.icon ? (
                  <span className="text-lg">{category.icon}</span>
                ) : hasChildren ? (
                  isExpanded ? (
                    <FolderOpenIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FolderIcon className="w-5 h-5 text-gray-400" />
                  )
                ) : (
                  <TagIcon className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${
                  canSelect ? 'text-gray-900' : 'text-gray-600'
                } ${isSelected ? 'text-blue-700' : ''}`}>
                  {isRTL ? category.labelAr : category.label}
                </p>
                {category.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {isRTL ? category.descriptionAr : category.description}
                  </p>
                )}
              </div>
            </div>

            {isSelected && (
              <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            )}
          </div>
        </div>

        {hasChildren && isExpanded && category.children && (
          <div>
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const displayValue = selectedCategory 
    ? (isRTL ? selectedCategory.labelAr : selectedCategory.label)
    : (placeholder || t('addProduct.selectCategory', 'Select Category'));

  const filteredCategories = searchTerm 
    ? filterCategories(categoryTree, searchTerm)
    : categoryTree;

  // Auto-expand filtered categories
  useEffect(() => {
    if (searchTerm) {
      const expandAll = (categories: Category[]) => {
        const toExpand = new Set<string>();
        const traverse = (cats: Category[]) => {
          cats.forEach(cat => {
            if (cat.children && cat.children.length > 0) {
              toExpand.add(cat.id);
              traverse(cat.children);
            }
          });
        };
        traverse(categories);
        setExpandedCategories(toExpand);
      };
      expandAll(filteredCategories);
    }
  }, [searchTerm]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-left border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <div className="flex items-center justify-between">
          <span className={`${selectedCategory ? 'text-gray-900' : 'text-gray-500'}`}>
            {displayValue}
          </span>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className={`w-5 h-5 text-gray-400 absolute ${
                  isRTL ? 'right-3' : 'left-3'
                } top-1/2 transform -translate-y-1/2`} />
                <input
                  type="text"
                  placeholder={t('addProduct.searchCategories', 'Search categories...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${
                    isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'
                  } py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute ${
                      isRTL ? 'left-3' : 'right-3'
                    } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tree */}
            <div className="max-h-80 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => renderCategory(category))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>{t('addProduct.noCategoriesFound', 'No categories found')}</p>
                </div>
              )}
            </div>

            {/* Selected Category Path */}
            {selectedCategory && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-600 mb-1">
                  {t('addProduct.selectedCategory', 'Selected Category')}:
                </div>
                <div className="flex items-center text-sm">
                  {getCategoryPath(categoryTree, selectedCategory.id).map((cat, index, arr) => (
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
        </>
      )}
    </div>
  );
};