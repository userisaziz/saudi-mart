# Saudi Arabian Admin Dashboard Component Library

## Design Foundation

### Color Palette
```typescript
const colors = {
  // Cultural Colors
  success: '#22c55e', // Green for success (culturally appropriate)
  trust: '#3b82f6',   // Blue for trust and reliability
  premium: '#f59e0b', // Gold for premium features
  
  // Admin Dashboard Colors
  primary: '#1e40af',     // Deep blue for primary actions
  secondary: '#64748b',   // Gray for secondary elements
  background: '#f8fafc',  // Light gray background
  surface: '#ffffff',     // White surfaces
  text: {
    primary: '#0f172a',   // Dark text
    secondary: '#475569', // Medium gray text
    muted: '#94a3b8'      // Light gray text
  },
  border: '#e2e8f0',     // Light border
  error: '#ef4444',      // Red for errors
  warning: '#f59e0b',    // Amber for warnings
  info: '#3b82f6'        // Blue for information
}
```

### Typography Scale (Arabic-optimized)
```typescript
const typography = {
  // Arabic text requires 20% larger font sizes
  'xs': '0.9rem',    // 14.4px for Arabic
  'sm': '1.05rem',   // 16.8px for Arabic  
  'base': '1.2rem',  // 19.2px for Arabic
  'lg': '1.35rem',   // 21.6px for Arabic
  'xl': '1.5rem',    // 24px for Arabic
  '2xl': '1.8rem',   // 28.8px for Arabic
  '3xl': '2.25rem',  // 36px for Arabic
  '4xl': '2.7rem'    // 43.2px for Arabic
}
```

### RTL Configuration
```css
/* Tailwind RTL utilities */
.rtl {
  direction: rtl;
}

.rtl .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

.rtl .mr-auto {
  margin-right: 0;
  margin-left: auto;
}
```

## 1. Layout Components

### AdminLayout Component

**Purpose**: Main dashboard layout with RTL-aware sidebar and responsive design

```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  locale?: 'ar' | 'en';
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}
```

**Tailwind Implementation**:
```tsx
<div className="min-h-screen bg-background rtl:text-right">
  {/* Mobile Header */}
  <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
    <Header mobile onToggleSidebar={onToggleSidebar} />
  </div>
  
  <div className="flex rtl:flex-row-reverse">
    {/* Sidebar */}
    <div className={`
      fixed lg:static inset-y-0 rtl:right-0 left-0 z-40
      w-64 bg-surface border-r rtl:border-l rtl:border-r-0 border-border
      transform transition-transform duration-300 ease-in-out
      ${sidebarCollapsed ? '-translate-x-full rtl:translate-x-full' : 'translate-x-0'}
      lg:translate-x-0 lg:rtl:translate-x-0
    `}>
      <SidebarNavigation />
    </div>
    
    {/* Main Content */}
    <div className="flex-1 flex flex-col min-w-0">
      <div className="hidden lg:block">
        <Header />
      </div>
      
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 overflow-hidden">
        {children}
      </main>
    </div>
  </div>
</div>
```

### Header Component

**Purpose**: Top navigation with search, notifications, and profile

```typescript
interface HeaderProps {
  mobile?: boolean;
  onToggleSidebar?: () => void;
  searchPlaceholder?: string;
  notificationCount?: number;
  user?: {
    name: string;
    avatar?: string;
  };
}
```

**Implementation**:
```tsx
<header className="bg-surface border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between rtl:flex-row-reverse">
  {/* Mobile Menu Toggle */}
  {mobile && (
    <button 
      onClick={onToggleSidebar}
      className="lg:hidden p-2 rounded-md hover:bg-gray-100 rtl:ml-2 ml-0"
    >
      <Menu className="w-5 h-5" />
    </button>
  )}
  
  {/* Search Bar */}
  <div className="flex-1 max-w-md mx-4 rtl:ml-4">
    <div className="relative">
      <Search className="absolute top-1/2 transform -translate-y-1/2 rtl:right-3 left-3 w-4 h-4 text-text-muted" />
      <input
        type="text"
        placeholder="البحث في لوحة التحكم..."
        className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
      />
    </div>
  </div>
  
  {/* Actions */}
  <div className="flex items-center space-x-4 rtl:space-x-reverse">
    {/* Notifications */}
    <div className="relative">
      <button className="p-2 rounded-md hover:bg-gray-100 relative">
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>
    </div>
    
    {/* Profile Dropdown */}
    <Dropdown>
      <div className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-md hover:bg-gray-100 cursor-pointer">
        <img 
          src={user?.avatar || '/default-avatar.png'} 
          alt={user?.name}
          className="w-8 h-8 rounded-full"
        />
        <ChevronDown className="w-4 h-4" />
      </div>
    </Dropdown>
  </div>
</header>
```

### SidebarNavigation Component

**Purpose**: Collapsible navigation menu with Arabic labels

```typescript
interface SidebarItem {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ComponentType;
  href: string;
  badge?: number;
  children?: SidebarItem[];
}

interface SidebarNavigationProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  locale?: 'ar' | 'en';
  activeItem?: string;
}
```

**Default Navigation Items**:
```tsx
const defaultNavItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/admin'
  },
  {
    id: 'users',
    label: 'Users',
    labelAr: 'المستخدمون',
    icon: Users,
    href: '/admin/users'
  },
  {
    id: 'products',
    label: 'Products',
    labelAr: 'المنتجات',
    icon: Package,
    href: '/admin/products'
  },
  {
    id: 'categories',
    label: 'Categories',
    labelAr: 'الفئات',
    icon: Tag,
    href: '/admin/categories'
  },
  {
    id: 'verification',
    label: 'Verification',
    labelAr: 'التحقق',
    icon: Shield,
    href: '/admin/verification',
    badge: 12
  },
  {
    id: 'analytics',
    label: 'Analytics',
    labelAr: 'التحليلات',
    icon: BarChart3,
    href: '/admin/analytics'
  }
];
```

### Breadcrumbs Component

**Purpose**: RTL-aware navigation trail

```typescript
interface BreadcrumbItem {
  label: string;
  labelAr: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale?: 'ar' | 'en';
  separator?: React.ReactNode;
}
```

## 2. Data Display Components

### KPI Cards Component

**Purpose**: Display revenue metrics with SAR formatting and trend indicators

```typescript
interface KPICardProps {
  title: string;
  titleAr: string;
  value: number;
  currency?: 'SAR' | 'USD';
  trend?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ComponentType;
  loading?: boolean;
}
```

**Implementation**:
```tsx
<div className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
  <div className="flex items-center justify-between rtl:flex-row-reverse mb-4">
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
      {icon && <Icon className="w-8 h-8 text-primary" />}
      <h3 className="text-sm font-medium text-text-secondary">
        {locale === 'ar' ? titleAr : title}
      </h3>
    </div>
    
    {trend && (
      <div className={`flex items-center space-x-1 rtl:space-x-reverse text-xs ${
        trend.type === 'increase' ? 'text-success' : 'text-error'
      }`}>
        {trend.type === 'increase' ? 
          <TrendingUp className="w-3 h-3" /> : 
          <TrendingDown className="w-3 h-3" />
        }
        <span>{trend.value}%</span>
      </div>
    )}
  </div>
  
  <div className="space-y-2">
    <div className="text-2xl font-bold text-text-primary">
      {formatCurrency(value, currency)}
    </div>
    
    {trend && (
      <div className="text-xs text-text-muted">
        {trend.period}
      </div>
    )}
  </div>
</div>
```

### DataTable Component

**Purpose**: Comprehensive table with Arabic support, search, filter, sort, and pagination

```typescript
interface Column<T> {
  key: keyof T;
  title: string;
  titleAr: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    onPageChange: (page: number, pageSize?: number) => void;
  };
  rowSelection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[]) => void;
  };
  locale?: 'ar' | 'en';
}
```

### Charts Component

**Purpose**: Recharts integration with RTL support and SAR formatting

```typescript
interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'area';
  xAxis?: string;
  yAxis?: string;
  title?: string;
  titleAr?: string;
  height?: number;
  currency?: boolean;
  locale?: 'ar' | 'en';
  colors?: string[];
}
```

## 3. Form Components

### FormField Component

**Purpose**: RTL-aware form field with Arabic validation messages

```typescript
interface FormFieldProps {
  label: string;
  labelAr: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  placeholderAr?: string;
  required?: boolean;
  error?: string;
  errorAr?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  locale?: 'ar' | 'en';
  direction?: 'ltr' | 'rtl' | 'auto';
}
```

### DatePicker Component

**Purpose**: Dual calendar support (Gregorian/Hijri)

```typescript
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  calendar?: 'gregorian' | 'hijri';
  onCalendarChange?: (calendar: 'gregorian' | 'hijri') => void;
  placeholder?: string;
  placeholderAr?: string;
  disabled?: boolean;
  locale?: 'ar' | 'en';
  format?: string;
}
```

### CurrencyInput Component

**Purpose**: SAR formatting with Arabic/Latin numeral support

```typescript
interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  currency?: 'SAR' | 'USD';
  numerals?: 'arabic' | 'latin';
  placeholder?: string;
  placeholderAr?: string;
  disabled?: boolean;
  locale?: 'ar' | 'en';
  precision?: number;
}
```

## 4. Interactive Components

### Modal Component

**Purpose**: Approve/Reject dialogs with note fields

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleAr: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  locale?: 'ar' | 'en';
}
```

### Toggle Switch Component

**Purpose**: Enable/disable controls with Arabic labels

```typescript
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelAr?: string;
  description?: string;
  descriptionAr?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  locale?: 'ar' | 'en';
}
```

## 5. Feedback Components

### Toast Notifications

**Purpose**: Success/error messages in Arabic

```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  titleAr: string;
  message?: string;
  messageAr?: string;
  duration?: number;
  onClose?: () => void;
  locale?: 'ar' | 'en';
}
```

### Loading States

**Purpose**: Skeleton screens for data tables and cards

```typescript
interface SkeletonProps {
  type: 'card' | 'table' | 'text' | 'image';
  rows?: number;
  columns?: number;
  height?: string;
  className?: string;
}
```

## Mobile Responsiveness

### Breakpoints (Mobile-first)
```typescript
const breakpoints = {
  'xs': '475px',  // Extra small devices
  'sm': '640px',  // Small devices
  'md': '768px',  // Medium devices
  'lg': '1024px', // Large devices
  'xl': '1280px', // Extra large devices
  '2xl': '1536px' // 2X Large devices
}
```

### Mobile-specific Classes
```css
/* Hide on mobile, show on desktop */
.hidden-mobile { @apply hidden lg:block; }

/* Show on mobile, hide on desktop */
.mobile-only { @apply block lg:hidden; }

/* Mobile-first responsive text */
.responsive-text { @apply text-sm lg:text-base; }

/* Mobile-first spacing */
.responsive-padding { @apply p-4 lg:p-6; }
.responsive-margin { @apply m-2 lg:m-4; }
```

## Accessibility Features

### ARIA Labels (Arabic support)
```typescript
const ariaLabels = {
  'ar': {
    close: 'إغلاق',
    open: 'فتح',
    search: 'بحث',
    loading: 'جارٍ التحميل',
    error: 'خطأ',
    success: 'نجح'
  },
  'en': {
    close: 'Close',
    open: 'Open',
    search: 'Search',
    loading: 'Loading',
    error: 'Error',
    success: 'Success'
  }
}
```

### Focus Management
```css
/* Custom focus ring for RTL */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

.focus-ring-rtl {
  @apply focus:ring-offset-reverse;
}
```

## Implementation Guidelines

### RTL Considerations
1. Use `rtl:` prefix for RTL-specific styles
2. Reverse flex directions and spacing
3. Position absolute elements correctly
4. Handle icon positioning
5. Ensure proper text alignment

### Performance
1. Lazy load heavy components
2. Virtualize large lists
3. Optimize bundle size
4. Use React.memo for expensive renders

### Cultural Adaptations
1. Use culturally appropriate colors
2. Support both Arabic and Latin numerals
3. Handle Hijri calendar integration
4. Format currencies for Saudi market
5. Respect Arabic typography requirements

This component library provides a solid foundation for building admin dashboards that cater specifically to Saudi Arabian users while maintaining modern UX standards and accessibility requirements.