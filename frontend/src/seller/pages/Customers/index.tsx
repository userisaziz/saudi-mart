import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  StarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'prospect' | 'vip' | 'blocked';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  registrationDate: string;
  tags: string[];
  notes: string;
  leadSource: string;
  assignedTo?: string;
  birthDate?: string;
  preferredLanguage: 'en' | 'ar';
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    phone: boolean;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  creditLimit?: number;
  paymentTerms?: string;
  taxId?: string;
  industry?: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@constructionpro.com',
    phone: '+966 50 123 4567',
    company: 'Construction Pro Ltd',
    position: 'Project Manager',
    address: {
      street: 'King Fahd Road 123',
      city: 'Riyadh',
      state: 'Riyadh Province',
      country: 'Saudi Arabia',
      zipCode: '11564',
    },
    status: 'active',
    tier: 'gold',
    totalOrders: 24,
    totalSpent: 145000,
    averageOrderValue: 6041.67,
    lastOrderDate: '2024-03-15',
    registrationDate: '2023-06-12',
    tags: ['construction', 'bulk-buyer', 'reliable'],
    notes: 'Prefers bulk orders for construction projects. Always pays on time.',
    leadSource: 'Website',
    assignedTo: 'Sarah Johnson',
    preferredLanguage: 'ar',
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: false,
    },
    creditLimit: 200000,
    paymentTerms: 'Net 30',
    industry: 'Construction',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@techsolutions.com',
    phone: '+1 555 987 6543',
    company: 'Tech Solutions Inc',
    position: 'Procurement Manager',
    address: {
      street: '456 Business Ave',
      city: 'Dubai',
      state: 'Dubai',
      country: 'UAE',
      zipCode: '00000',
    },
    status: 'vip',
    tier: 'platinum',
    totalOrders: 52,
    totalSpent: 285000,
    averageOrderValue: 5480.77,
    lastOrderDate: '2024-03-18',
    registrationDate: '2022-09-08',
    tags: ['technology', 'vip-customer', 'frequent-buyer'],
    notes: 'VIP customer with recurring monthly orders. Excellent payment history.',
    leadSource: 'Referral',
    assignedTo: 'Mike Chen',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: false,
      whatsapp: false,
      phone: true,
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/in/mariasantos',
    },
    creditLimit: 500000,
    paymentTerms: 'Net 15',
    industry: 'Technology',
  },
  {
    id: '3',
    name: 'Khalid Manufacturing',
    email: 'orders@khalidmfg.com',
    phone: '+966 11 456 7890',
    company: 'Khalid Manufacturing Co',
    position: 'Purchasing Director',
    address: {
      street: 'Industrial City, Plot 15',
      city: 'Dammam',
      state: 'Eastern Province',
      country: 'Saudi Arabia',
      zipCode: '31421',
    },
    status: 'active',
    tier: 'silver',
    totalOrders: 18,
    totalSpent: 95000,
    averageOrderValue: 5277.78,
    lastOrderDate: '2024-02-28',
    registrationDate: '2023-11-20',
    tags: ['manufacturing', 'industrial', 'seasonal'],
    notes: 'Large orders during peak manufacturing seasons. Prefers detailed specifications.',
    leadSource: 'Trade Show',
    assignedTo: 'Ahmad Hassan',
    preferredLanguage: 'ar',
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: true,
    },
    creditLimit: 150000,
    paymentTerms: 'Net 45',
    industry: 'Manufacturing',
  },
  {
    id: '4',
    name: 'Jennifer Wilson',
    email: 'jen@modernoffice.com',
    phone: '+1 555 234 5678',
    company: 'Modern Office Solutions',
    position: 'Operations Manager',
    address: {
      street: '789 Corporate Blvd',
      city: 'Abu Dhabi',
      state: 'Abu Dhabi',
      country: 'UAE',
      zipCode: '00000',
    },
    status: 'prospect',
    tier: 'bronze',
    totalOrders: 3,
    totalSpent: 12500,
    averageOrderValue: 4166.67,
    lastOrderDate: '2024-01-15',
    registrationDate: '2024-01-10',
    tags: ['office-supplies', 'new-customer', 'potential'],
    notes: 'New customer showing interest in office furniture and equipment.',
    leadSource: 'LinkedIn',
    assignedTo: 'Lisa Park',
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: false,
      whatsapp: false,
      phone: false,
    },
    industry: 'Office Solutions',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  prospect: 'bg-blue-100 text-blue-800 border-blue-200',
  vip: 'bg-purple-100 text-purple-800 border-purple-200',
  blocked: 'bg-red-100 text-red-800 border-red-200',
};

const tierColors = {
  bronze: 'text-orange-600 bg-orange-50',
  silver: 'text-gray-600 bg-gray-50',
  gold: 'text-yellow-600 bg-yellow-50',
  platinum: 'text-purple-600 bg-purple-50',
};

const CustomersIndex: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    tier: 'all',
    assignedTo: 'all',
    industry: 'all',
    spentRange: 'all',
  });
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'totalOrders' | 'lastOrder' | 'registrationDate'>('totalSpent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Filter and search logic
  const applyFiltersAndSearch = useMemo(() => {
    let filtered = [...customers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }

    // Tier filter
    if (filters.tier !== 'all') {
      filtered = filtered.filter(customer => customer.tier === filters.tier);
    }

    // Assigned to filter
    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(customer => customer.assignedTo === filters.assignedTo);
    }

    // Industry filter
    if (filters.industry !== 'all') {
      filtered = filtered.filter(customer => customer.industry === filters.industry);
    }

    // Spent range filter
    if (filters.spentRange !== 'all') {
      filtered = filtered.filter(customer => {
        switch (filters.spentRange) {
          case 'under_10k':
            return customer.totalSpent < 10000;
          case '10k_50k':
            return customer.totalSpent >= 10000 && customer.totalSpent < 50000;
          case '50k_100k':
            return customer.totalSpent >= 50000 && customer.totalSpent < 100000;
          case 'over_100k':
            return customer.totalSpent >= 100000;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'lastOrder') {
        aValue = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
        bValue = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
      } else if (sortBy === 'registrationDate') {
        aValue = new Date(a.registrationDate).getTime();
        bValue = new Date(b.registrationDate).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [customers, searchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    setFilteredCustomers(applyFiltersAndSearch);
  }, [applyFiltersAndSearch]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === filteredCustomers.length ? [] : filteredCustomers.map(c => c.id)
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getCustomerValue = (customer: Customer) => {
    if (customer.totalSpent >= 100000) return 'high';
    if (customer.totalSpent >= 50000) return 'medium';
    return 'low';
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      tier: 'all',
      assignedTo: 'all',
      industry: 'all',
      spentRange: 'all',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all') || searchQuery.trim();

  const assignedToOptions = [...new Set(customers.map(c => c.assignedTo).filter(Boolean))];
  const industryOptions = [...new Set(customers.map(c => c.industry).filter(Boolean))];

  // Calculate stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    prospects: customers.filter(c => c.status === 'prospect').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
    highValue: customers.filter(c => c.totalSpent >= 100000).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer relationships and track business performance
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlusIcon className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VIP</p>
              <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
            </div>
            <StarIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prospects</p>
              <p className="text-2xl font-bold text-blue-600">{stats.prospects}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Value</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.averageValue)}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Value</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.highValue}</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, company, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="totalSpent">Total Spent</option>
            <option value="name">Name</option>
            <option value="totalOrders">Total Orders</option>
            <option value="lastOrder">Last Order</option>
            <option value="registrationDate">Registration Date</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                  <option value="vip">VIP</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
                <select
                  value={filters.tier}
                  onChange={(e) => setFilters({...filters, tier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tiers</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Team Members</option>
                  {assignedToOptions.map(person => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters({...filters, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Industries</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spent Range</label>
                <select
                  value={filters.spentRange}
                  onChange={(e) => setFilters({...filters, spentRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ranges</option>
                  <option value="under_10k">Under $10K</option>
                  <option value="10k_50k">$10K - $50K</option>
                  <option value="50k_100k">$50K - $100K</option>
                  <option value="over_100k">Over $100K</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {selectedCustomers.length} customers selected
              </span>
              <button
                onClick={() => setSelectedCustomers([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Update Status
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
                Assign To
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
                Add Tags
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.company}</div>
                        {customer.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {customer.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {customer.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[customer.status]}`}>
                        {customer.status}
                      </span>
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${tierColors[customer.tier]}`}>
                        <StarIcon className="w-3 h-3 mr-1" />
                        {customer.tier}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg: {formatCurrency(customer.averageOrderValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <ShoppingBagIcon className="w-4 h-4 text-gray-400" />
                      {customer.totalOrders}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {customer.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? "No customers match your current filters" 
                : "Get started by adding your first customer"
              }
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear filters
              </button>
            ) : (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Customer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                          <p className="text-gray-600">{selectedCustomer.position} at {selectedCustomer.company}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selectedCustomer.status]}`}>
                              {selectedCustomer.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${tierColors[selectedCustomer.tier]}`}>
                              <StarIcon className="w-3 h-3 mr-1" />
                              {selectedCustomer.tier}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="text-gray-600">
                            <div>{selectedCustomer.address.street}</div>
                            <div>{selectedCustomer.address.city}, {selectedCustomer.address.state}</div>
                            <div>{selectedCustomer.address.country} {selectedCustomer.address.zipCode}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Business Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedCustomer.industry}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Credit Limit: {formatCurrency(selectedCustomer.creditLimit || 0)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Payment Terms: {selectedCustomer.paymentTerms}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Lead Source: {selectedCustomer.leadSource}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags and Notes */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Tags & Notes</h4>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{selectedCustomer.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Purchase Statistics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.totalSpent)}</div>
                        <div className="text-xs text-gray-500">Total Spent</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                        <div className="text-xs text-gray-500">Total Orders</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{formatCurrency(selectedCustomer.averageOrderValue)}</div>
                        <div className="text-xs text-gray-500">Average Order Value</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Registration</div>
                        <div className="text-gray-500">{formatDate(selectedCustomer.registrationDate)}</div>
                      </div>
                      {selectedCustomer.lastOrderDate && (
                        <div>
                          <div className="font-medium text-gray-900">Last Order</div>
                          <div className="text-gray-500">{formatDate(selectedCustomer.lastOrderDate)}</div>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">Assigned To</div>
                        <div className="text-gray-500">{selectedCustomer.assignedTo || 'Unassigned'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Communication</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className={`w-2 h-2 rounded-full ${selectedCustomer.communicationPreferences.email ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">SMS</span>
                        <span className={`w-2 h-2 rounded-full ${selectedCustomer.communicationPreferences.sms ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">WhatsApp</span>
                        <span className={`w-2 h-2 rounded-full ${selectedCustomer.communicationPreferences.whatsapp ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className={`w-2 h-2 rounded-full ${selectedCustomer.communicationPreferences.phone ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersIndex;