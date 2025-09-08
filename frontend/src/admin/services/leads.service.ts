import { 
  AdminLead, 
  LeadStatus, 
  LeadPriority, 
  LeadSource,
  SaudiRegion,
  LeadMessage,
  AdminNote 
} from '../types/saudi-admin';

// Mock data for leads
const mockLeads: AdminLead[] = [
  {
    id: '1',
    customerInfo: {
      name: 'علي المحمدي',
      phone: '+966501111111',
      email: 'ali.almohammadi@email.com',
      company: 'شركة المحمدي للتجارة',
      city: 'الرياض',
      region: SaudiRegion.RIYADH
    },
    productInterest: {
      productId: '1',
      productName: 'iPhone 15 Pro',
      category: 'Electronics',
      priceRange: {
        min: 4000,
        max: 5000
      }
    },
    conversation: [
      {
        id: 'msg1',
        senderId: 'customer',
        senderType: 'customer',
        message: 'مرحبا، أريد الاستفسار عن هاتف آيفون 15 برو',
        timestamp: '2024-02-20T10:00:00Z',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'admin1',
        senderType: 'admin',
        message: 'أهلاً وسهلاً، يسعدني مساعدتك. الهاتف متوفر بسعر 4999 ريال شامل الضريبة',
        timestamp: '2024-02-20T10:05:00Z',
        isRead: true
      }
    ],
    assignedTo: 'admin1',
    status: LeadStatus.CONTACTED,
    priority: LeadPriority.HIGH,
    source: LeadSource.WEBSITE,
    score: 85,
    tags: ['vip-customer', 'electronics', 'high-value'],
    followUpDate: '2024-02-25T09:00:00Z',
    lastContactDate: '2024-02-20T10:05:00Z',
    notes: [
      {
        id: 'note1',
        content: 'Customer interested in bulk purchase for company',
        adminId: 'admin1',
        adminName: 'Sarah Al-Rashid',
        createdAt: '2024-02-20T10:10:00Z',
        type: 'info'
      }
    ],
    createdAt: '2024-02-20T09:30:00Z',
    updatedAt: '2024-02-20T10:10:00Z'
  },
  {
    id: '2',
    customerInfo: {
      name: 'فاطمة العتيبي',
      phone: '+966502222222',
      email: 'fatima.otaibi@email.com',
      city: 'جدة',
      region: SaudiRegion.MAKKAH
    },
    productInterest: {
      productId: '2',
      productName: 'Natural Sidr Honey',
      category: 'Food & Beverages',
      priceRange: {
        min: 200,
        max: 400
      }
    },
    conversation: [
      {
        id: 'msg3',
        senderId: 'customer',
        senderType: 'customer',
        message: 'هل يمكنني الحصول على عينة من عسل السدر؟',
        timestamp: '2024-02-22T14:00:00Z',
        isRead: false
      }
    ],
    assignedTo: 'admin2',
    status: LeadStatus.NEW,
    priority: LeadPriority.MEDIUM,
    source: LeadSource.PHONE,
    score: 65,
    tags: ['natural-products', 'sample-request'],
    followUpDate: '2024-02-24T11:00:00Z',
    notes: [],
    createdAt: '2024-02-22T14:00:00Z',
    updatedAt: '2024-02-22T14:00:00Z'
  },
  {
    id: '3',
    customerInfo: {
      name: 'محمد الغامدي',
      phone: '+966503333333',
      email: 'mohammed.ghamdi@email.com',
      company: 'مؤسسة الغامدي',
      city: 'الدمام',
      region: SaudiRegion.EASTERN
    },
    productInterest: {
      productId: '1',
      productName: 'iPhone 15 Pro',
      category: 'Electronics',
      priceRange: {
        min: 4500,
        max: 5500
      }
    },
    conversation: [
      {
        id: 'msg4',
        senderId: 'customer',
        senderType: 'customer',
        message: 'أحتاج 10 أجهزة آيفون للشركة، هل يوجد خصم للكمية؟',
        timestamp: '2024-02-23T09:00:00Z',
        isRead: true
      },
      {
        id: 'msg5',
        senderId: 'admin1',
        senderType: 'admin',
        message: 'نعم، يمكننا توفير خصم 5% للطلبات أكثر من 10 قطع',
        timestamp: '2024-02-23T09:15:00Z',
        isRead: true
      },
      {
        id: 'msg6',
        senderId: 'customer',
        senderType: 'customer',
        message: 'ممتاز، سأراسلكم بالتفاصيل اليوم',
        timestamp: '2024-02-23T09:20:00Z',
        isRead: true
      }
    ],
    assignedTo: 'admin1',
    status: LeadStatus.PROPOSAL_SENT,
    priority: LeadPriority.HIGH,
    source: LeadSource.EMAIL,
    score: 90,
    tags: ['bulk-order', 'b2b', 'high-value'],
    followUpDate: '2024-02-26T10:00:00Z',
    lastContactDate: '2024-02-23T09:20:00Z',
    notes: [
      {
        id: 'note2',
        content: 'Bulk order opportunity - follow up for quote acceptance',
        adminId: 'admin1',
        adminName: 'Sarah Al-Rashid',
        createdAt: '2024-02-23T09:25:00Z',
        type: 'success'
      }
    ],
    createdAt: '2024-02-23T08:45:00Z',
    updatedAt: '2024-02-23T09:25:00Z'
  }
];

// Lead scoring rules
interface LeadScoringRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  points: number;
  isActive: boolean;
}

const mockScoringRules: LeadScoringRule[] = [
  {
    id: 'rule1',
    name: 'High-value product interest',
    description: 'Customer interested in products above 1000 SAR',
    condition: 'productPrice > 1000',
    points: 25,
    isActive: true
  },
  {
    id: 'rule2',
    name: 'Bulk order inquiry',
    description: 'Customer asking about bulk orders or quantity discounts',
    condition: 'messageContains(bulk|quantity|discount)',
    points: 30,
    isActive: true
  },
  {
    id: 'rule3',
    name: 'Business customer',
    description: 'Customer has company information',
    condition: 'hasCompany == true',
    points: 20,
    isActive: true
  },
  {
    id: 'rule4',
    name: 'Riyadh region',
    description: 'Customer from Riyadh region',
    condition: 'region == RIYADH',
    points: 10,
    isActive: true
  }
];

// Response templates
interface ResponseTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: 'greeting' | 'product_info' | 'pricing' | 'follow_up' | 'closing';
  isActive: boolean;
}

const mockTemplates: ResponseTemplate[] = [
  {
    id: 'template1',
    name: 'Arabic Greeting',
    subject: 'مرحباً بك في منصتنا',
    content: 'مرحباً {{customerName}}،\n\nشكراً لك على اهتمامك بمنتج {{productName}}. يسعدنا خدمتك ومساعدتك في العثور على ما تحتاجه.\n\nإذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.\n\nتحياتي،\n{{adminName}}',
    variables: ['customerName', 'productName', 'adminName'],
    category: 'greeting',
    isActive: true
  },
  {
    id: 'template2',
    name: 'Product Information',
    subject: 'معلومات المنتج - {{productName}}',
    content: 'عزيزي {{customerName}}،\n\nإليك معلومات المنتج الذي استفسرت عنه:\n\nاسم المنتج: {{productName}}\nالسعر: {{productPrice}} ريال (شامل الضريبة)\nالوصف: {{productDescription}}\nالكمية المتوفرة: {{availableQuantity}}\n\nهل تحتاج إلى معلومات إضافية؟\n\nتحياتي،\n{{adminName}}',
    variables: ['customerName', 'productName', 'productPrice', 'productDescription', 'availableQuantity', 'adminName'],
    category: 'product_info',
    isActive: true
  },
  {
    id: 'template3',
    name: 'Follow-up Reminder',
    subject: 'متابعة - {{customerName}}',
    content: 'مرحباً {{customerName}}،\n\nأردت المتابعة معك بخصوص استفسارك عن {{productName}}. هل لا زلت مهتماً بالمنتج؟\n\nنحن هنا لمساعدتك في أي وقت.\n\nتحياتي،\n{{adminName}}',
    variables: ['customerName', 'productName', 'adminName'],
    category: 'follow_up',
    isActive: true
  }
];

export class LeadsService {
  static async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: LeadStatus;
    priority?: LeadPriority;
    source?: LeadSource;
    assignedTo?: string;
    region?: SaudiRegion;
    scoreMin?: number;
    scoreMax?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    leads: AdminLead[];
    total: number;
    page: number;
    limit: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredLeads = [...mockLeads];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead => 
        lead.customerInfo.name.toLowerCase().includes(searchLower) ||
        lead.customerInfo.email?.toLowerCase().includes(searchLower) ||
        lead.customerInfo.phone.includes(params.search!) ||
        lead.productInterest.productName.toLowerCase().includes(searchLower)
      );
    }

    if (params?.status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === params.status);
    }

    if (params?.priority) {
      filteredLeads = filteredLeads.filter(lead => lead.priority === params.priority);
    }

    if (params?.source) {
      filteredLeads = filteredLeads.filter(lead => lead.source === params.source);
    }

    if (params?.assignedTo) {
      filteredLeads = filteredLeads.filter(lead => lead.assignedTo === params.assignedTo);
    }

    if (params?.region) {
      filteredLeads = filteredLeads.filter(lead => lead.customerInfo.region === params.region);
    }

    if (params?.scoreMin !== undefined) {
      filteredLeads = filteredLeads.filter(lead => lead.score >= params.scoreMin!);
    }

    if (params?.scoreMax !== undefined) {
      filteredLeads = filteredLeads.filter(lead => lead.score <= params.scoreMax!);
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      leads: filteredLeads.slice(startIndex, endIndex),
      total: filteredLeads.length,
      page,
      limit
    };
  }

  static async getLeadById(id: string): Promise<AdminLead | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLeads.find(lead => lead.id === id) || null;
  }

  static async updateLeadStatus(id: string, status: LeadStatus): Promise<AdminLead | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lead = mockLeads.find(l => l.id === id);
    if (!lead) return null;

    lead.status = status;
    lead.updatedAt = new Date().toISOString();

    return lead;
  }

  static async assignLead(id: string, assignedTo: string): Promise<AdminLead | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lead = mockLeads.find(l => l.id === id);
    if (!lead) return null;

    lead.assignedTo = assignedTo;
    lead.updatedAt = new Date().toISOString();

    return lead;
  }

  static async addLeadNote(id: string, noteContent: string, adminId: string, adminName: string): Promise<AdminLead | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lead = mockLeads.find(l => l.id === id);
    if (!lead) return null;

    const newNote: AdminNote = {
      id: Date.now().toString(),
      content: noteContent,
      adminId,
      adminName,
      createdAt: new Date().toISOString(),
      type: 'info'
    };

    lead.notes.push(newNote);
    lead.updatedAt = new Date().toISOString();

    return lead;
  }

  static async updateLeadScore(id: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lead = mockLeads.find(l => l.id === id);
    if (!lead) return 0;

    // Recalculate score based on active rules
    let score = 0;
    
    const activeRules = mockScoringRules.filter(rule => rule.isActive);
    
    activeRules.forEach(rule => {
      // Simple rule evaluation (in real app, would use proper rule engine)
      if (rule.condition.includes('productPrice > 1000')) {
        if (lead.productInterest.priceRange && lead.productInterest.priceRange.min > 1000) {
          score += rule.points;
        }
      }
      
      if (rule.condition.includes('hasCompany == true')) {
        if (lead.customerInfo.company) {
          score += rule.points;
        }
      }
      
      if (rule.condition.includes('region == RIYADH')) {
        if (lead.customerInfo.region === SaudiRegion.RIYADH) {
          score += rule.points;
        }
      }
      
      if (rule.condition.includes('bulk|quantity|discount')) {
        const hasKeywords = lead.conversation.some(msg => 
          msg.message.toLowerCase().includes('bulk') ||
          msg.message.includes('كمية') ||
          msg.message.includes('خصم')
        );
        if (hasKeywords) {
          score += rule.points;
        }
      }
    });

    lead.score = Math.min(score, 100); // Cap at 100
    lead.updatedAt = new Date().toISOString();

    return lead.score;
  }

  static async getScoringRules(): Promise<LeadScoringRule[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockScoringRules];
  }

  static async updateScoringRule(id: string, updates: Partial<LeadScoringRule>): Promise<LeadScoringRule | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ruleIndex = mockScoringRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) return null;

    mockScoringRules[ruleIndex] = {
      ...mockScoringRules[ruleIndex],
      ...updates
    };

    return mockScoringRules[ruleIndex];
  }

  static async getResponseTemplates(): Promise<ResponseTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockTemplates];
  }

  static async createResponseTemplate(templateData: Partial<ResponseTemplate>): Promise<ResponseTemplate> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTemplate: ResponseTemplate = {
      id: Date.now().toString(),
      name: templateData.name!,
      subject: templateData.subject!,
      content: templateData.content!,
      variables: templateData.variables || [],
      category: templateData.category!,
      isActive: true
    };

    mockTemplates.push(newTemplate);
    return newTemplate;
  }

  static async getLeadStats(): Promise<{
    total: number;
    newLeads: number;
    contacted: number;
    qualified: number;
    closedWon: number;
    conversionRate: number;
    avgScore: number;
    bySource: Record<LeadSource, number>;
    byRegion: Record<SaudiRegion, number>;
    followUpToday: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const total = mockLeads.length;
    const newLeads = mockLeads.filter(l => l.status === LeadStatus.NEW).length;
    const contacted = mockLeads.filter(l => l.status === LeadStatus.CONTACTED).length;
    const qualified = mockLeads.filter(l => l.status === LeadStatus.QUALIFIED).length;
    const closedWon = mockLeads.filter(l => l.status === LeadStatus.CLOSED_WON).length;
    
    const conversionRate = total > 0 ? (closedWon / total) * 100 : 0;
    const avgScore = total > 0 ? mockLeads.reduce((sum, lead) => sum + lead.score, 0) / total : 0;

    const bySource = Object.values(LeadSource).reduce((acc, source) => {
      acc[source] = mockLeads.filter(l => l.source === source).length;
      return acc;
    }, {} as Record<LeadSource, number>);

    const byRegion = Object.values(SaudiRegion).reduce((acc, region) => {
      acc[region] = mockLeads.filter(l => l.customerInfo.region === region).length;
      return acc;
    }, {} as Record<SaudiRegion, number>);

    const today = new Date().toDateString();
    const followUpToday = mockLeads.filter(l => 
      l.followUpDate && new Date(l.followUpDate).toDateString() === today
    ).length;

    return {
      total,
      newLeads,
      contacted,
      qualified,
      closedWon,
      conversionRate,
      avgScore,
      bySource,
      byRegion,
      followUpToday
    };
  }
}