export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  images: string[];
  description: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  score: number;
  source: string;
  value: number;
  lastContact: string;
  nextFollowUp?: string;
  notes: string[];
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
  aovGrowth: number;
  conversionGrowth: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  logo?: string;
  founded: string;
  employees: string;
  industry: string;
}

// Mock Data
export const mockMetrics: SalesMetrics = {
  totalRevenue: 125000,
  totalOrders: 486,
  averageOrderValue: 257,
  conversionRate: 3.2,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  aovGrowth: 4.2,
  conversionGrowth: -1.1,
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial Steel Pipes',
    category: 'Manufacturing',
    price: 450,
    stock: 120,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300',
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=300'
    ],
    description: 'High-grade industrial steel pipes suitable for construction and manufacturing applications.',
    sku: 'ISP-001',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20',
  },
  {
    id: '2',
    name: 'Commercial LED Panels',
    category: 'Electronics',
    price: 89,
    stock: 45,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300'
    ],
    description: 'Energy-efficient LED panels for commercial spaces and offices.',
    sku: 'LED-002',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-25',
  },
  {
    id: '3',
    name: 'Hydraulic System Components',
    category: 'Automotive',
    price: 1250,
    stock: 8,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=300'
    ],
    description: 'Premium hydraulic components for industrial machinery and automotive applications.',
    sku: 'HSC-003',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-28',
  },
  {
    id: '4',
    name: 'Office Furniture Set',
    category: 'Furniture',
    price: 850,
    stock: 0,
    status: 'inactive',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300'
    ],
    description: 'Complete office furniture set including desk, chair, and storage solutions.',
    sku: 'OFS-004',
    createdAt: '2024-01-10',
    updatedAt: '2024-02-15',
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    company: 'TechCorp Industries',
    phone: '+1 (555) 123-4567',
    status: 'qualified',
    score: 85,
    source: 'Website',
    value: 15000,
    lastContact: '2024-03-01',
    nextFollowUp: '2024-03-05',
    notes: [
      'Interested in bulk LED panel purchase',
      'Budget approved for Q2',
      'Decision maker confirmed'
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@buildright.com',
    company: 'BuildRight Construction',
    phone: '+1 (555) 987-6543',
    status: 'proposal',
    score: 92,
    source: 'Referral',
    value: 45000,
    lastContact: '2024-02-28',
    nextFollowUp: '2024-03-03',
    notes: [
      'Requested quote for steel pipes',
      'Large construction project starting in April',
      'Comparing with 2 other suppliers'
    ]
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@autoparts.com',
    company: 'AutoParts Plus',
    phone: '+1 (555) 456-7890',
    status: 'new',
    score: 65,
    source: 'Cold Email',
    value: 8500,
    lastContact: '2024-02-25',
    notes: [
      'Inquired about hydraulic components',
      'Small auto repair business'
    ]
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa.chen@designstudio.com',
    company: 'Modern Design Studio',
    phone: '+1 (555) 234-5678',
    status: 'contacted',
    score: 78,
    source: 'LinkedIn',
    value: 12000,
    lastContact: '2024-02-26',
    nextFollowUp: '2024-03-02',
    notes: [
      'Office renovation project',
      'Interested in furniture packages',
      'Budget meeting next week'
    ]
  }
];

export const mockRevenueData: ChartData[] = [
  { name: 'Jan', value: 65000, date: '2024-01' },
  { name: 'Feb', value: 78000, date: '2024-02' },
  { name: 'Mar', value: 125000, date: '2024-03' },
];

export const mockOrdersData: ChartData[] = [
  { name: 'Jan', value: 145 },
  { name: 'Feb', value: 198 },
  { name: 'Mar', value: 486 },
];

export const mockCategoryData: ChartData[] = [
  { name: 'Manufacturing', value: 45 },
  { name: 'Electronics', value: 30 },
  { name: 'Automotive', value: 15 },
  { name: 'Furniture', value: 10 },
];

export const mockLeadSourceData: ChartData[] = [
  { name: 'Website', value: 35 },
  { name: 'Referral', value: 25 },
  { name: 'LinkedIn', value: 20 },
  { name: 'Cold Email', value: 15 },
  { name: 'Trade Shows', value: 5 },
];

export const mockCompanyInfo: CompanyInfo = {
  name: 'Industrial Solutions Ltd.',
  email: 'contact@industrialsolutions.com',
  phone: '+1 (555) 000-0000',
  address: '1234 Industrial Blvd, Manufacturing City, MC 12345',
  website: 'www.industrialsolutions.com',
  description: 'Leading supplier of industrial components, electronics, and manufacturing equipment for B2B clients worldwide.',
  founded: '2010',
  employees: '50-100',
  industry: 'Industrial Equipment',
};

export const mockAnalyticsData = {
  conversionFunnel: [
    { name: 'Visitors', value: 10000 },
    { name: 'Leads', value: 500 },
    { name: 'Qualified', value: 200 },
    { name: 'Proposals', value: 50 },
    { name: 'Customers', value: 15 },
  ],
  topProducts: [
    { name: 'Industrial Steel Pipes', value: 45000 },
    { name: 'LED Panels', value: 32000 },
    { name: 'Hydraulic Components', value: 28000 },
    { name: 'Office Furniture', value: 20000 },
  ],
  customerSatisfaction: [
    { name: 'Very Satisfied', value: 45 },
    { name: 'Satisfied', value: 35 },
    { name: 'Neutral', value: 15 },
    { name: 'Dissatisfied', value: 4 },
    { name: 'Very Dissatisfied', value: 1 },
  ]
};

export const mockTemplates = [
  {
    id: '1',
    name: 'Initial Contact',
    subject: 'Welcome to Industrial Solutions - Let\'s Connect',
    content: 'Hi {{name}},\n\nThank you for your interest in {{product}}. We specialize in providing high-quality industrial solutions...',
    type: 'email'
  },
  {
    id: '2',
    name: 'Follow-up',
    subject: 'Following up on your {{product}} inquiry',
    content: 'Hi {{name}},\n\nI wanted to follow up on our previous conversation about {{product}}...',
    type: 'email'
  }
];