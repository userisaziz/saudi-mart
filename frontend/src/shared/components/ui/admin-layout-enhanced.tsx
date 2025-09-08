import React, { useState, useContext } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  CheckCircle,
  BarChart3,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Globe,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Languages
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Badge,
  Input
} from '@/shared/components/ui'
import { cn } from '@/shared/utils/cn'

interface NavItem {
  title: string
  titleAr: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeAr?: string
}

interface AdminLayoutProps {
  dir?: 'ltr' | 'rtl'
  locale?: 'en' | 'ar'
  darkMode?: boolean
  onDarkModeToggle?: () => void
  onLocaleChange?: (locale: 'en' | 'ar') => void
  user?: {
    name: string
    nameAr?: string
    email: string
    avatar?: string
  }
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    titleAr: 'لوحة المتحكم',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    titleAr: 'المستخدمين',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Products', 
    titleAr: 'المنتجات',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Categories',
    titleAr: 'التصنيفات',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Verification',
    titleAr: 'التحقق',
    href: '/admin/verification',
    icon: CheckCircle,
    badge: '23',
    badgeAr: '٢٣',
  },
  {
    title: 'Analytics',
    titleAr: 'التحليلات',
    href: '/admin/analytics',
    icon: BarChart3,
  },
]

const getBreadcrumbs = (pathname: string, locale: 'en' | 'ar' = 'en') => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ title: string; href: string; isLast?: boolean }> = []
  
  // Always start with Admin
  breadcrumbs.push({ 
    title: locale === 'ar' ? 'الإدارة' : 'Admin', 
    href: '/admin' 
  })
  
  // Map segments to readable names
  const segmentMap: Record<string, { en: string; ar: string }> = {
    admin: { en: 'Admin', ar: 'الإدارة' },
    users: { en: 'Users', ar: 'المستخدمين' },
    products: { en: 'Products', ar: 'المنتجات' },
    categories: { en: 'Categories', ar: 'التصنيفات' },
    verification: { en: 'Verification', ar: 'التحقق' },
    analytics: { en: 'Analytics', ar: 'التحليلات' },
  }
  
  let currentPath = ''
  segments.forEach((segment, index) => {
    if (segment === 'admin') return // Skip admin as it's already added
    
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    const segmentInfo = segmentMap[segment]
    const title = segmentInfo 
      ? segmentInfo[locale]
      : segment.charAt(0).toUpperCase() + segment.slice(1)
    
    breadcrumbs.push({
      title,
      href: `/admin${currentPath}`,
      isLast
    })
  })
  
  return breadcrumbs
}

export const AdminLayoutEnhanced: React.FC<AdminLayoutProps> = ({
  dir = 'ltr',
  locale = 'en',
  darkMode = false,
  onDarkModeToggle,
  onLocaleChange,
  user = {
    name: 'Admin User',
    nameAr: 'مستخدم الإدارة',
    email: 'admin@company.com'
  }
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname, locale)
  
  const isRtl = dir === 'rtl' || locale === 'ar'
  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64'

  return (
    <div className={cn("min-h-screen bg-background", isRtl && "rtl")} dir={dir}>
      <div className="flex h-screen">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 z-50 bg-sidebar border-sidebar-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
            sidebarWidth,
            isRtl ? "right-0 border-l" : "left-0 border-r",
            sidebarOpen 
              ? "translate-x-0" 
              : isRtl ? "translate-x-full" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo and controls */}
            <div className={cn(
              "flex items-center justify-between p-4 border-sidebar-border",
              isRtl ? "border-b" : "border-b"
            )}>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
                </div>
                {!sidebarCollapsed && (
                  <span className="font-semibold text-foreground">
                    {locale === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {/* Collapse button - desktop only */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex h-8 w-8"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  {isRtl ? (
                    sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                  ) : (
                    sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
                
                {/* Close button - mobile only */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                const title = locale === 'ar' ? item.titleAr : item.title
                const badge = locale === 'ar' ? item.badgeAr || item.badge : item.badge
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                      isActive
                        ? "bg-sidebar-accent text-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse min-w-0">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{title}</span>
                      )}
                    </div>
                    {badge && !sidebarCollapsed && (
                      <Badge variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                    {badge && sidebarCollapsed && (
                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b border-border px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button and breadcrumbs */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Search bar - desktop */}
                <div className="hidden md:block relative">
                  <Search className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                    isRtl ? "right-3" : "left-3"
                  )} />
                  <Input
                    placeholder={locale === 'ar' ? "البحث..." : "Search..."}
                    className={cn(
                      "w-64 bg-muted/50",
                      isRtl ? "pr-10" : "pl-10"
                    )}
                  />
                </div>
                
                {/* Breadcrumbs - desktop only */}
                <div className="hidden sm:block">
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.href}>
                          {index > 0 && <BreadcrumbSeparator className={isRtl ? "rotate-180" : ""} />}
                          <BreadcrumbItem>
                            {breadcrumb.isLast ? (
                              <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {/* Search - mobile only */}
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Search className="h-4 w-4" />
                </Button>
                
                {/* Language toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onLocaleChange?.(locale === 'en' ? 'ar' : 'en')}
                >
                  <Languages className="h-4 w-4" />
                </Button>
                
                {/* Dark mode toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDarkModeToggle}
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {locale === 'ar' ? '٣' : '3'}
                  </Badge>
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {locale === 'ar' ? 'إد' : 'AD'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {locale === 'ar' ? user.nameAr || user.name : user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                      <span>{locale === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                      <span>{locale === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                      <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}