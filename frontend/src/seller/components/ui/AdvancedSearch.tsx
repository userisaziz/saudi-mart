import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Search,
  Filter,
  X,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Users,
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface SearchFilter {
  id: string;
  type: 'text' | 'select' | 'date' | 'range' | 'multi-select';
  label: string;
  labelAr: string;
  value: any;
  options?: Array<{ value: string; label: string; labelAr?: string }>;
  placeholder?: string;
  placeholderAr?: string;
}

interface AdvancedSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: SearchFilter[];
  onFiltersChange: (filters: SearchFilter[]) => void;
  suggestions?: Array<{
    id: string;
    title: string;
    subtitle: string;
    type: string;
  }>;
  onSuggestionSelect?: (suggestion: any) => void;
  placeholder?: string;
  placeholderAr?: string;
  showSuggestions?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  suggestions = [],
  onSuggestionSelect,
  placeholder,
  placeholderAr,
  showSuggestions = true
}) => {
  const { t, isRTL } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);

  const displayPlaceholder = isRTL && placeholderAr ? placeholderAr : placeholder || (isRTL ? 'البحث...' : 'Search...');

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    return suggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [suggestions, searchQuery]);

  const handleFilterChange = useCallback((filterId: string, newValue: any) => {
    const updatedFilters = filters.map(filter =>
      filter.id === filterId ? { ...filter, value: newValue } : filter
    );
    onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  const clearFilter = useCallback((filterId: string) => {
    handleFilterChange(filterId, filter.type === 'multi-select' ? [] : '');
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = filters.map(filter => ({
      ...filter,
      value: filter.type === 'multi-select' ? [] : ''
    }));
    onFiltersChange(clearedFilters);
    onSearchChange('');
  }, [filters, onFiltersChange, onSearchChange]);

  const activeFiltersCount = useMemo(() => {
    return filters.filter(filter => {
      if (filter.type === 'multi-select') {
        return Array.isArray(filter.value) && filter.value.length > 0;
      }
      return filter.value && filter.value !== '';
    }).length;
  }, [filters]);

  const renderFilterInput = (filter: SearchFilter) => {
    const filterLabel = isRTL && filter.labelAr ? filter.labelAr : filter.label;
    const filterPlaceholder = isRTL && filter.placeholderAr ? filter.placeholderAr : filter.placeholder;

    switch (filter.type) {
      case 'text':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{filterLabel}</label>
            <div className="relative">
              <Input
                type="text"
                value={filter.value || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                placeholder={filterPlaceholder}
                className="pr-8"
              />
              {filter.value && (
                <button
                  onClick={() => clearFilter(filter.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{filterLabel}</label>
            <Select value={filter.value || ''} onValueChange={(value) => handleFilterChange(filter.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={filterPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {isRTL && option.labelAr ? option.labelAr : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{filterLabel}</label>
            <Input
              type="date"
              value={filter.value || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="w-full"
            />
          </div>
        );

      case 'range':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{filterLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={isRTL ? 'من' : 'Min'}
                value={filter.value?.min || ''}
                onChange={(e) => handleFilterChange(filter.id, { ...filter.value, min: e.target.value })}
              />
              <Input
                type="number"
                placeholder={isRTL ? 'إلى' : 'Max'}
                value={filter.value?.max || ''}
                onChange={(e) => handleFilterChange(filter.id, { ...filter.value, max: e.target.value })}
              />
            </div>
          </div>
        );

      case 'multi-select':
        return (
          <div key={filter.id} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{filterLabel}</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {Array.isArray(filter.value) && filter.value.length > 0
                      ? `${filter.value.length} ${isRTL ? 'محدد' : 'selected'}`
                      : filterPlaceholder
                    }
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {filter.options?.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      const currentValues = Array.isArray(filter.value) ? filter.value : [];
                      const newValues = currentValues.includes(option.value)
                        ? currentValues.filter(v => v !== option.value)
                        : [...currentValues, option.value];
                      handleFilterChange(filter.id, newValues);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded">
                        {Array.isArray(filter.value) && filter.value.includes(option.value) && (
                          <Check className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                      <span>{isRTL && option.labelAr ? option.labelAr : option.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (showSuggestions) {
                setShowSuggestionsList(e.target.value.length >= 2);
              }
            }}
            onFocus={() => showSuggestions && setShowSuggestionsList(searchQuery.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestionsList(false), 150)}
            placeholder={displayPlaceholder}
            className={`${isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12'} h-11`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} flex items-center space-x-1`}>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-8 px-2 ${activeFiltersCount > 0 ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 text-xs">{activeFiltersCount}</Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && showSuggestionsList && filteredSuggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-auto">
            <CardContent className="p-0">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => {
                    onSuggestionSelect?.(suggestion);
                    setShowSuggestionsList(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{suggestion.title}</p>
                      <p className="text-xs text-gray-500 truncate">{suggestion.subtitle}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">
            {isRTL ? 'المرشحات النشطة:' : 'Active filters:'}
          </span>
          {filters.map(filter => {
            if (filter.type === 'multi-select' && Array.isArray(filter.value) && filter.value.length > 0) {
              return filter.value.map(value => {
                const option = filter.options?.find(opt => opt.value === value);
                return (
                  <Badge key={`${filter.id}-${value}`} variant="secondary" className="gap-1">
                    {option ? (isRTL && option.labelAr ? option.labelAr : option.label) : value}
                    <button
                      onClick={() => {
                        const newValues = filter.value.filter((v: any) => v !== value);
                        handleFilterChange(filter.id, newValues);
                      }}
                      className="ml-1 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              });
            } else if (filter.value && filter.value !== '') {
              return (
                <Badge key={filter.id} variant="secondary" className="gap-1">
                  {`${isRTL && filter.labelAr ? filter.labelAr : filter.label}: ${filter.value}`}
                  <button
                    onClick={() => clearFilter(filter.id)}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }
            return null;
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 h-6 px-2 text-xs"
          >
            {isRTL ? 'مسح الكل' : 'Clear all'}
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {isRTL ? 'البحث المتقدم' : 'Advanced Search'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(renderFilterInput)}
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={clearAllFilters}>
                {isRTL ? 'مسح الكل' : 'Clear All'}
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                {isRTL ? 'تطبيق المرشحات' : 'Apply Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};