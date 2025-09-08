import React, { useState, useContext, useEffect } from 'react'
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
  ChevronDown,
  Plus,
  ShoppingCart,
  FileText,
  Activity
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
  titleAr?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeAr?: string
  subItems?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    subItems: [
      { title: 'All Orders', href: '/admin/orders/list' },
      { title: 'Pending Orders', href: '/admin/orders/pending' },
      { title: 'Shipping', href: '/admin/orders/shipping' },
      { title: 'Returns', href: '/admin/orders/returns' },
      { title: 'Order Analytics', href: '/admin/orders/analytics' },
    ],
  },
  {
    title: 'Sellers',
    href: '/admin/sellers',
    icon: Users,
    subItems: [
      { title: 'Seller List', href: '/admin/sellers/list' },
      { title: 'Add Seller', href: '/admin/sellers/add' },
      { title: 'Seller Details', href: '/admin/sellers/details' },
      { title: 'Seller Verification', href: '/admin/sellers/verification' },
      { title: 'Role Management', href: '/admin/sellers/roles' },
    ],
  },
  {
    title: 'Buyers',
    href: '/admin/buyers',
    icon: Users,
    subItems: [
      { title: 'Buyer List', href: '/admin/buyers/list' },
      { title: 'Add Buyer', href: '/admin/buyers/add' },
      { title: 'Buyer Details', href: '/admin/buyers/details' },
      { title: 'Role Management', href: '/admin/buyers/roles' },
    ],
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    subItems: [
      { title: 'Product List', href: '/admin/products/list' },
      { title: 'Add Product', href: '/admin/products/add' },
      { title: 'Product Approval', href: '/admin/products/approval' },
      { title: 'Inventory Management', href: '/admin/products/inventory' },
      { title: 'Bulk Operations', href: '/admin/products/bulk' },
    ],
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
    subItems: [
      { title: 'Category List', href: '/admin/categories/list' },
      { title: 'Add Category', href: '/admin/categories/add' },
      { title: 'Category Approval', href: '/admin/categories/approval' },
      { title: 'Category Tree', href: '/admin/categories/tree' },
    ],
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
    badge: '12',
  },
  {
    title: 'System Logs',
    href: '/admin/logs',
    icon: Activity,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ title: string; href: string; isLast?: boolean }> = []
  
  // Always start with Admin
  breadcrumbs.push({ title: 'Admin', href: '/admin' })
  
  // Map segments to readable names
  const segmentMap: Record<string, string> = {
    admin: 'Admin',
    orders: 'Orders',
    sellers: 'Sellers',
    buyers: 'Buyers',
    products: 'Products',
    categories: 'Categories',
    notifications: 'Notifications',
    verification: 'Seller Verification',
    analytics: 'Analytics',
    logs: 'System Logs',
    list: 'List',
    add: 'Add',
    approval: 'Approval',
    inventory: 'Inventory',
    bulk: 'Bulk Operations',
    requests: 'Requests',
    tree: 'Tree View',
    details: 'Details',
    roles: 'Roles',
    pending: 'Pending',
    shipping: 'Shipping',
    returns: 'Returns',
  }
  
  let currentPath = ''
  segments.forEach((segment, index) => {
    if (segment === 'admin') return // Skip admin as it's already added
    
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    breadcrumbs.push({
      title: segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/admin${currentPath}`,
      isLast
    })
  })
  
  return breadcrumbs
}

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()
  const breadcrumbs = getBreadcrumbs(location.pathname)

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  // Auto-expand menu if current page is in submenu
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(subItem => 
          location.pathname === subItem.href
        )
        if (hasActiveSubItem && !expandedItems.includes(item.title)) {
          setExpandedItems(prev => [...prev, item.title])
        }
      }
    })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background">
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
            "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo and close button */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">Admin Panel</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isExpanded = expandedItems.includes(item.title)
                const isActive = location.pathname === item.href
                const hasActiveSubItem = hasSubItems && item.subItems!.some(subItem => 
                  location.pathname === subItem.href
                )
                const Icon = item.icon
                
                return (
                  <div key={item.href}>
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive || hasActiveSubItem
                            ? "bg-sidebar-accent text-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronDown 
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded ? "rotate-180" : ""
                            )} 
                          />
                        </div>
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                    
                    {hasSubItems && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems!.map((subItem) => {
                          const isSubItemActive = location.pathname === subItem.href
                          return (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-md transition-colors",
                                isSubItemActive
                                  ? "bg-sidebar-accent/50 text-accent-foreground"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-accent-foreground"
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
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
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Breadcrumbs */}
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((breadcrumb, index) => (
                      <React.Fragment key={breadcrumb.href}>
                        {index > 0 && <BreadcrumbSeparator />}
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

              {/* Header actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    3
                  </Badge>
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar.jpg" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          admin@company.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
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