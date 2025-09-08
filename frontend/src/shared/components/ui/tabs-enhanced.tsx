import React, { useState } from 'react'
import { Badge } from './badge'
import { cn } from '@/shared/utils/cn'

interface Tab {
  key: string
  title: string
  titleAr?: string
  content: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeAr?: string | number
  disabled?: boolean
  closeable?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onTabChange?: (tabKey: string) => void
  onTabClose?: (tabKey: string) => void
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  locale?: 'en' | 'ar'
  orientation?: 'horizontal' | 'vertical'
  className?: string
  contentClassName?: string
  scrollable?: boolean
}

interface SearchProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  placeholderAr?: string
  suggestions?: Array<{
    value: string
    label: string
    labelAr?: string
    category?: string
    categoryAr?: string
  }>
  onSuggestionSelect?: (suggestion: any) => void
  loading?: boolean
  locale?: 'en' | 'ar'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'ghost'
  showSearchIcon?: boolean
  showClearButton?: boolean
  debounceMs?: number
  className?: string
}

const tabVariants = {
  default: {
    tab: "px-4 py-2 text-sm font-medium rounded-none border-b-2 border-transparent transition-all duration-200 hover:text-primary hover:border-primary/50",
    activeTab: "text-primary border-primary bg-primary/5",
    container: "border-b border-border"
  },
  pills: {
    tab: "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 hover:bg-muted",
    activeTab: "bg-primary text-primary-foreground hover:bg-primary/90",
    container: ""
  },
  underline: {
    tab: "px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-all duration-200 hover:border-primary/50",
    activeTab: "text-primary border-primary font-semibold",
    container: "border-b border-border"
  },
  cards: {
    tab: "px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-200 hover:border-border hover:bg-muted/50",
    activeTab: "bg-background border-border shadow-sm",
    container: "gap-1"
  }
}

const tabSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm", 
  lg: "px-6 py-3 text-base"
}

export const TabsEnhanced: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  variant = 'default',
  size = 'md',
  locale = 'en',
  orientation = 'horizontal',
  className,
  contentClassName,
  scrollable = false
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.key)
  const isRtl = locale === 'ar'
  const isVertical = orientation === 'vertical'
  
  const variantStyles = tabVariants[variant]
  const sizeStyles = tabSizes[size]

  const handleTabChange = (tabKey: string) => {
    setCurrentTab(tabKey)
    onTabChange?.(tabKey)
  }

  const handleTabClose = (tabKey: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onTabClose?.(tabKey)
    
    // If closing active tab, switch to another tab
    if (currentTab === tabKey) {
      const remainingTabs = tabs.filter(tab => tab.key !== tabKey)
      if (remainingTabs.length > 0) {
        handleTabChange(remainingTabs[0].key)
      }
    }
  }

  const activeTabContent = tabs.find(tab => tab.key === currentTab)

  return (
    <div className={cn(
      "w-full",
      isVertical && "flex gap-4",
      className
    )}>
      {/* Tab List */}
      <div className={cn(
        "flex",
        isVertical ? "flex-col min-w-48" : "flex-row",
        scrollable && !isVertical && "overflow-x-auto scrollbar-hide",
        scrollable && isVertical && "overflow-y-auto max-h-96",
        variantStyles.container,
        isRtl && !isVertical && "flex-row-reverse"
      )}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key
          const Icon = tab.icon
          const displayTitle = locale === 'ar' && tab.titleAr ? tab.titleAr : tab.title
          const displayBadge = locale === 'ar' && tab.badgeAr ? tab.badgeAr : tab.badge

          return (
            <button
              key={tab.key}
              onClick={() => !tab.disabled && handleTabChange(tab.key)}
              disabled={tab.disabled}
              className={cn(
                variantStyles.tab,
                sizeStyles,
                isActive && variantStyles.activeTab,
                tab.disabled && "opacity-50 cursor-not-allowed",
                "flex items-center space-x-2 rtl:space-x-reverse relative group whitespace-nowrap",
                isRtl && "flex-row-reverse"
              )}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              <span className="flex-1 min-w-0 truncate">{displayTitle}</span>
              
              {displayBadge && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "text-xs scale-90",
                    locale === 'ar' && "font-arabic"
                  )}
                >
                  {displayBadge}
                </Badge>
              )}
              
              {tab.closeable && (
                <button
                  onClick={(e) => handleTabClose(tab.key, e)}
                  className="ml-1 rtl:mr-1 rtl:ml-0 p-1 rounded-full hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className={cn(
        "flex-1 mt-4",
        isVertical && "mt-0",
        contentClassName
      )}>
        {activeTabContent && (
          <div
            key={currentTab}
            className="animate-fade-in"
          >
            {activeTabContent.content}
          </div>
        )}
      </div>
    </div>
  )
}

export const SearchEnhanced: React.FC<SearchProps> = ({
  value = '',
  onChange,
  placeholder,
  placeholderAr,
  suggestions = [],
  onSuggestionSelect,
  loading = false,
  locale = 'en',
  size = 'md',
  variant = 'default',
  showSearchIcon = true,
  showClearButton = true,
  debounceMs = 300,
  className
}) => {
  const [searchValue, setSearchValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  
  const isRtl = locale === 'ar'
  const displayPlaceholder = locale === 'ar' && placeholderAr 
    ? placeholderAr 
    : placeholder || (locale === 'ar' ? 'البحث...' : 'Search...')

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  }

  const variantClasses = {
    default: 'bg-background border border-input',
    filled: 'bg-muted border border-transparent',
    ghost: 'bg-transparent border border-transparent hover:bg-muted'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    const searchTerm = searchValue.toLowerCase()
    const label = locale === 'ar' && suggestion.labelAr 
      ? suggestion.labelAr 
      : suggestion.label
    return label.toLowerCase().includes(searchTerm)
  }).slice(0, 8) // Limit to 8 suggestions

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    setShowSuggestions(true)
    setFocusedIndex(-1)

    // Debounce the onChange callback
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    const timer = setTimeout(() => {
      onChange?.(newValue)
    }, debounceMs)
    
    setDebounceTimer(timer)
  }

  const handleSuggestionClick = (suggestion: any) => {
    const label = locale === 'ar' && suggestion.labelAr 
      ? suggestion.labelAr 
      : suggestion.label
    setSearchValue(label)
    setShowSuggestions(false)
    onChange?.(suggestion.value)
    onSuggestionSelect?.(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[focusedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setFocusedIndex(-1)
        break
    }
  }

  const clearSearch = () => {
    setSearchValue('')
    setShowSuggestions(false)
    onChange?.('')
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {/* Search Icon */}
        {showSearchIcon && (
          <div className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none",
            isRtl ? "right-3" : "left-3"
          )}>
            {loading ? (
              <div className={cn("animate-spin", iconSizes[size])}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            ) : (
              <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        )}

        {/* Input */}
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow for clicks
            setTimeout(() => setShowSuggestions(false), 150)
          }}
          onKeyDown={handleKeyDown}
          placeholder={displayPlaceholder}
          className={cn(
            "w-full rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            sizeClasses[size],
            variantClasses[variant],
            showSearchIcon && (isRtl ? "pr-10" : "pl-10"),
            showClearButton && searchValue && (isRtl ? "pl-10" : "pr-10"),
            isRtl && "text-right",
            locale === 'ar' && "font-arabic"
          )}
          dir={isRtl ? 'rtl' : 'ltr'}
        />

        {/* Clear Button */}
        {showClearButton && searchValue && (
          <button
            onClick={clearSearch}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              isRtl ? "left-3" : "right-3"
            )}
          >
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className={cn(
          "absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto",
          isRtl ? "right-0" : "left-0"
        )}>
          {filteredSuggestions.map((suggestion, index) => {
            const isActive = index === focusedIndex
            const displayLabel = locale === 'ar' && suggestion.labelAr 
              ? suggestion.labelAr 
              : suggestion.label
            const displayCategory = suggestion.category && (
              locale === 'ar' && suggestion.categoryAr 
                ? suggestion.categoryAr 
                : suggestion.category
            )

            return (
              <button
                key={`${suggestion.value}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0",
                  isActive && "bg-muted",
                  isRtl && "text-right"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "flex-1 truncate",
                    locale === 'ar' && "font-arabic"
                  )}>
                    {displayLabel}
                  </span>
                  {displayCategory && (
                    <Badge variant="outline" className="text-xs ml-2 rtl:mr-2 rtl:ml-0">
                      {displayCategory}
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchValue && filteredSuggestions.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3 text-center text-muted-foreground text-sm">
          {locale === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
        </div>
      )}
    </div>
  )
}