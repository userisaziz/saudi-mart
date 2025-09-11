import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  LanguageIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface SellerLayoutProps {
  currentPage?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/seller/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Products',
    href: '/seller/products',
    icon: CubeIcon,
    subItems: [
      { name: 'Product List', href: '/seller/products/list' },
      { name: 'Add Product', href: '/seller/products/add' },
      { name: 'Inventory', href: '/seller/products/inventory' },
      { name: 'Bulk Upload', href: '/seller/products/bulk-upload' },
      { name: 'Request Category', href: '/seller/categories/request' },
    ],
  },
  {
    name: 'RFQ Management',
    href: '/seller/rfq',
    icon: ClipboardDocumentListIcon,
    subItems: [
      { name: 'RFQ Dashboard', href: '/seller/rfq' },
      { name: 'Create RFQ', href: '/seller/rfq?tab=create' },
      { name: 'Suppliers', href: '/seller/rfq?tab=suppliers' },
      { name: 'Quotes', href: '/seller/rfq?tab=quotes' },
      { name: 'Templates', href: '/seller/rfq?tab=templates' },
      { name: 'Analytics', href: '/seller/rfq?tab=analytics' },
    ],
  },
  {
    name: 'Orders',
    href: '/seller/orders',
    icon: DocumentTextIcon,
    subItems: [
      { name: 'All Orders', href: '/seller/orders/list' },
      { name: 'Returns', href: '/seller/orders/returns' },
      { name: 'Shipping', href: '/seller/orders/shipping' },
    ],
  },
  {
    name: 'Leads & Communication',
    href: '/seller/leads',
    icon: UserGroupIcon,
    subItems: [
      { name: 'Leads Inbox', href: '/seller/leads/inbox' },
      { name: 'Messages Hub', href: '/seller/communication/hub' },
      { name: 'Follow-up', href: '/seller/leads/follow-up' },
      { name: 'Email Templates', href: '/seller/communication/templates' },
    ],
  },
  {
    name: 'Finance',
    href: '/seller/finance',
    icon: CreditCardIcon,
    subItems: [
      { name: 'Dashboard', href: '/seller/finance/dashboard' },
      { name: 'Invoices', href: '/seller/finance/invoices' },
      { name: 'Payments', href: '/seller/finance/payments' },
      { name: 'Reports', href: '/seller/finance/reports' },
    ],
  },
  {
    name: 'Profile',
    href: '/seller/profile',
    icon: UserIcon,
    subItems: [
      { name: 'Company Info', href: '/seller/profile/company' },
      { name: 'Documents', href: '/seller/profile/documents' },
      { name: 'Contacts', href: '/seller/profile/contacts' },
      { name: 'Business Hours', href: '/seller/profile/hours' },
    ],
  },
  {
    name: 'Analytics',
    href: '/seller/analytics',
    icon: ChartBarIcon,
    subItems: [
      { name: 'Growth', href: '/seller/analytics/growth' },
      { name: 'Conversion', href: '/seller/analytics/conversion' },
      { name: 'Product Insights', href: '/seller/analytics/products' },
      { name: 'Customer Feedback', href: '/seller/analytics/feedback' },
    ],
  },
  {
    name: 'Reviews & Ratings',
    href: '/seller/reviews',
    icon: StarIcon,
  },
  {
    name: 'Settings',
    href: '/seller/settings',
    icon: Cog6ToothIcon,
  },
];

export const SellerLayout: React.FC<SellerLayoutProps> = ({ currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products']);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    };

    if (languageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageDropdownOpen]);

  // Auto-expand menu if current page is in submenu
  useEffect(() => {
    navigation.forEach(item => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(subItem => 
          location.pathname === subItem.href || 
          (item.name === 'RFQ Management' && location.pathname.startsWith('/seller/rfq'))
        );
        if (hasActiveSubItem && !expandedItems.includes(item.name)) {
          setExpandedItems(prev => [...prev, item.name]);
        }
      }
    });
  }, [location.pathname]);

  const NavItem: React.FC<{ item: NavItem; isExpanded?: boolean }> = ({ item, isExpanded = false }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = location.pathname === item.href;
    const hasActiveSubItem = hasSubItems && item.subItems!.some(subItem => 
      location.pathname === subItem.href
    );
    
    return (
      <div>
        {hasSubItems ? (
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive || hasActiveSubItem
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? 'transform rotate-90' : ''
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <Link
            to={item.href}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </div>
          </Link>
        )}
        
        {hasSubItems && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.subItems!.map((subItem) => {
              const isSubItemActive = location.pathname === subItem.href;
              return (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className={`block px-3 py-2 text-sm rounded-lg transition-colors truncate ${
                    isSubItemActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {subItem.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 flex" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-80 max-w-[85vw] bg-white shadow-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-900 p-1"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                Seller Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <a 
                href="/seller/notifications" 
                className="relative text-gray-500 hover:text-gray-700 p-1"
              >
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-600 rounded-full"></span>
              </a>
              <a 
                href="/seller/settings" 
                className="text-gray-500 hover:text-gray-700 p-1 hidden sm:block"
              >
                <Cog6ToothIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              
              {/* Language Switcher */}
              <div className="relative hidden sm:block" ref={languageDropdownRef}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  <LanguageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium uppercase hidden md:inline">{language}</span>
                  <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setLanguage('en');
                          setLanguageDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center space-x-2 ${
                          language === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span>🇺🇸</span>
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('ar');
                          setLanguageDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center space-x-2 ${
                          language === 'ar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span>🇸🇦</span>
                        <span>العربية</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">IS</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">Industrial Solutions</p>
                  <p className="text-xs text-gray-500">Seller Account</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700 p-1">
                <ArrowRightOnRectangleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6"><Outlet /></div>
        </main>
      </div>
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">IS</span>
          </div>
          <span className="ml-2 text-base sm:text-lg font-semibold text-gray-900">
            Industrial Solutions
          </span>
        </div>
        <nav className="mt-6 flex-grow px-3 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isExpanded={expandedItems.includes(item.name)}
            />
          ))}
        </nav>
      </div>
    );
  }
};