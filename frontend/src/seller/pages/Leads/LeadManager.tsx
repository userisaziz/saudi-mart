import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid,
} from '@heroicons/react/24/solid';

interface LeadActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  createdAt: string;
  createdBy: string;
}

interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  source: string;
  value: number;
  currency: string;
  products: string[];
  notes: LeadNote[];
  activities: LeadActivity[];
  lastContact?: string;
  nextFollowUp?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  temperature: 'cold' | 'warm' | 'hot';
  estimatedCloseDate?: string;
  lostReason?: string;
  conversionRate?: number;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@constructco.sa',
    phone: '+966 50 123 4567',
    company: 'Al-Rashid Construction Co.',
    position: 'Procurement Manager',
    status: 'qualified',
    priority: 'high',
    score: 85,
    source: 'Website',
    value: 150000,
    currency: 'SAR',
    products: ['Industrial Water Pump HP-2000', 'Pressure Control Valve'],
    notes: [
      {
        id: '1',
        content: 'Very interested in bulk purchase. Budget approved for Q2.',
        createdAt: '2024-03-15T10:00:00Z',
        createdBy: 'Current User',
      },
      {
        id: '2',
        content: 'Requested technical specifications and installation manual.',
        createdAt: '2024-03-14T14:30:00Z',
        createdBy: 'Current User',
      },
    ],
    activities: [
      {
        id: '1',
        type: 'call',
        description: 'Discussed technical requirements and pricing',
        createdAt: '2024-03-15T10:00:00Z',
        createdBy: 'Current User',
      },
      {
        id: '2',
        type: 'email',
        description: 'Sent detailed product catalog and quote',
        createdAt: '2024-03-14T16:00:00Z',
        createdBy: 'Current User',
      },
    ],
    lastContact: '2024-03-15T10:00:00Z',
    nextFollowUp: '2024-03-22T09:00:00Z',
    assignedTo: 'Current User',
    createdAt: '2024-03-10T08:30:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    tags: ['construction', 'high-value', 'returning-customer'],
    temperature: 'hot',
    estimatedCloseDate: '2024-04-15',
    conversionRate: 75,
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    email: 'fatima@techinnovate.sa',
    phone: '+966 55 987 6543',
    company: 'Tech Innovate Solutions',
    position: 'Technical Director',
    status: 'proposal',
    priority: 'urgent',
    score: 92,
    source: 'Referral',
    value: 250000,
    currency: 'SAR',
    products: ['Three-Phase Electric Motor 50HP', 'Control Systems'],
    notes: [
      {
        id: '3',
        content: 'Urgent project deadline. Needs delivery within 2 weeks.',
        createdAt: '2024-03-16T11:00:00Z',
        createdBy: 'Current User',
      },
    ],
    activities: [
      {
        id: '3',
        type: 'meeting',
        description: 'Site visit and technical presentation completed',
        createdAt: '2024-03-16T14:00:00Z',
        createdBy: 'Current User',
      },
    ],
    lastContact: '2024-03-16T14:00:00Z',
    nextFollowUp: '2024-03-18T10:00:00Z',
    assignedTo: 'Current User',
    createdAt: '2024-03-12T09:00:00Z',
    updatedAt: '2024-03-16T14:00:00Z',
    tags: ['technology', 'urgent', 'new-client'],
    temperature: 'hot',
    estimatedCloseDate: '2024-03-30',
    conversionRate: 85,
  },
  {
    id: '3',
    name: 'Omar bin Abdullah',
    email: 'omar@petroequip.sa',
    phone: '+966 50 555 1234',
    company: 'Petro Equipment Trading',
    position: 'Operations Manager',
    status: 'contacted',
    priority: 'medium',
    score: 65,
    source: 'Cold Email',
    value: 85000,
    currency: 'SAR',
    products: ['Hydraulic Cylinder 200mm Bore'],
    notes: [
      {
        id: '4',
        content: 'Interested but budget approval pending until next quarter.',
        createdAt: '2024-03-14T15:00:00Z',
        createdBy: 'Current User',
      },
    ],
    activities: [
      {
        id: '4',
        type: 'email',
        description: 'Initial outreach email sent',
        createdAt: '2024-03-13T09:00:00Z',
        createdBy: 'Current User',
      },
    ],
    lastContact: '2024-03-14T15:00:00Z',
    nextFollowUp: '2024-03-21T10:00:00Z',
    assignedTo: 'Current User',
    createdAt: '2024-03-13T09:00:00Z',
    updatedAt: '2024-03-14T15:00:00Z',
    tags: ['petroleum', 'budget-pending'],
    temperature: 'warm',
    estimatedCloseDate: '2024-05-01',
    conversionRate: 45,
  },
];

const statusConfig = {
  new: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: ClockIcon },
  contacted: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: ChatBubbleLeftRightIcon },
  qualified: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircleIcon },
  proposal: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: DocumentTextIcon },
  negotiation: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: BanknotesIcon },
  won: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: StarIcon },
  lost: { color: 'bg-red-100 text-red-800 border-red-200', icon: ExclamationTriangleIcon },
};

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-600', badge: '🔵', weight: 1 },
  medium: { color: 'bg-blue-100 text-blue-700', badge: '🟡', weight: 2 },
  high: { color: 'bg-orange-100 text-orange-700', badge: '🟠', weight: 3 },
  urgent: { color: 'bg-red-100 text-red-700', badge: '🔴', weight: 4 },
};

const temperatureConfig = {
  cold: { color: 'text-blue-600', icon: '❄️' },
  warm: { color: 'text-yellow-600', icon: '🌡️' },
  hot: { color: 'text-red-600', icon: '🔥' },
};

interface LeadFilters {
  search: string;
  status: string;
  priority: string;
  source: string;
  assignedTo: string;
  temperature: string;
  tags: string[];
}

const LeadManager: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(mockLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'createdAt' | 'priority'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'kanban'>('cards');

  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    source: 'all',
    assignedTo: 'all',
    temperature: 'all',
    tags: [],
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = [...leads];

    // Search filter
    if (filters.search.trim()) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.products.some(product =>
          product.toLowerCase().includes(filters.search.toLowerCase())
        ) ||
        lead.tags.some(tag =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === filters.priority);
    }

    if (filters.source !== 'all') {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }

    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(lead => lead.assignedTo === filters.assignedTo);
    }

    if (filters.temperature !== 'all') {
      filtered = filtered.filter(lead => lead.temperature === filters.temperature);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(lead =>
        filters.tags.some(tag => lead.tags.includes(tag))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortBy === 'priority') {
        aValue = priorityConfig[a.priority].weight;
        bValue = priorityConfig[b.priority].weight;
      }

      return sortOrder === 'asc' ?
        (aValue > bValue ? 1 : -1) :
        (aValue < bValue ? 1 : -1);
    });

    setFilteredLeads(filtered);
  }, [leads, filters, sortBy, sortOrder]);

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length ? [] : filteredLeads.map(l => l.id)
    );
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      source: 'all',
      assignedTo: 'all',
      temperature: 'all',
      tags: [],
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'tags') return value.length > 0;
    return value !== 'all' && value !== '';
  });

  const handleLeadAction = (leadId: string, action: string, value?: any) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedLead = { ...lead, updatedAt: new Date().toISOString() };
        const activity: LeadActivity = {
          id: Date.now().toString(),
          type: action as any,
          description: `Lead ${action}${value ? ` to ${value}` : ''}`,
          createdAt: new Date().toISOString(),
          createdBy: 'Current User',
        };

        switch (action) {
          case 'status_change':
            updatedLead.status = value;
            updatedLead.activities.unshift(activity);
            break;
          case 'priority_change':
            updatedLead.priority = value;
            updatedLead.activities.unshift(activity);
            break;
          case 'call':
            updatedLead.lastContact = new Date().toISOString();
            updatedLead.activities.unshift(activity);
            break;
          case 'email':
            updatedLead.lastContact = new Date().toISOString();
            updatedLead.activities.unshift(activity);
            break;
          case 'note':
            const note: LeadNote = {
              id: Date.now().toString(),
              content: value,
              createdAt: new Date().toISOString(),
              createdBy: 'Current User',
            };
            updatedLead.notes.unshift(note);
            updatedLead.activities.unshift(activity);
            break;
        }
        return updatedLead;
      }
      return lead;
    }));
  };

  // Statistics
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
    const hotLeads = leads.filter(l => l.temperature === 'hot').length;
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    const avgScore = totalLeads > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads : 0;
    const conversionRate = totalLeads > 0 ? (leads.filter(l => l.status === 'won').length / totalLeads) * 100 : 0;

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      hotLeads,
      totalValue,
      avgScore,
      conversionRate,
    };
  }, [leads]);

  // Get unique values for filters
  const sources = [...new Set(leads.map(l => l.source))];
  const assignees = [...new Set(leads.map(l => l.assignedTo).filter(Boolean))];
  const allTags = [...new Set(leads.flatMap(l => l.tags))];

  const LeadDetailsModal = ({ lead, onClose }: { lead: Lead; onClose: () => void }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
              <p className="text-sm text-gray-600">{lead.company}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <EyeIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Lead Score & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{lead.score}</div>
                <div className="text-sm text-blue-700">Lead Score</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${lead.score}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(lead.value)}
                </div>
                <div className="text-sm text-green-700">Potential Value</div>
                <div className="text-xs text-gray-500 mt-1">
                  {lead.conversionRate}% conversion rate
                </div>
              </div>
            </div>

            {/* Status, Priority, Temperature */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig[lead.status].color}`}>
                  <statusConfig[lead.status].icon className="w-4 h-4" />
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Status</div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[lead.priority].color}`}>
                  <span>{priorityConfig[lead.priority].badge}</span>
                  {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Priority</div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 ${temperatureConfig[lead.temperature].color}`}>
                  <span>{temperatureConfig[lead.temperature].icon}</span>
                  {lead.temperature.charAt(0).toUpperCase() + lead.temperature.slice(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Temperature</div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{lead.position} at {lead.company}</span>
                </div>
              </div>
            </div>

            {/* Products of Interest */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Products of Interest</h3>
              <div className="space-y-2">
                {lead.products.map((product, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                    <span className="text-sm font-medium text-blue-900">{product}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Created:</strong> {formatDate(lead.createdAt)}
                </div>
                {lead.lastContact && (
                  <div className="text-sm text-gray-600">
                    <strong>Last Contact:</strong> {formatDate(lead.lastContact)}
                  </div>
                )}
                {lead.nextFollowUp && (
                  <div className="text-sm text-gray-600">
                    <strong>Next Follow-up:</strong> {formatDate(lead.nextFollowUp)}
                  </div>
                )}
                {lead.estimatedCloseDate && (
                  <div className="text-sm text-gray-600">
                    <strong>Estimated Close:</strong> {formatDate(lead.estimatedCloseDate)}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Activities</h3>
              <div className="space-y-3">
                {lead.activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === 'call' && <PhoneIcon className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'email' && <EnvelopeIcon className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'meeting' && <UserGroupIcon className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'note' && <DocumentTextIcon className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'status_change' && <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.createdAt)} by {activity.createdBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
              <div className="space-y-3">
                {lead.notes.map((note) => (
                  <div key={note.id} className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-900">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(note.createdAt)} by {note.createdBy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PhoneIcon className="w-4 h-4" />
                  Call
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <EnvelopeIcon className="w-4 h-4" />
                  Email
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="w-4 h-4" />
                  Add Note
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => handleLeadAction(lead.id, 'status_change', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Track and nurture your sales prospects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'cards' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-sm' : 'text-gray-500'
                }`}
            >
              Kanban
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.newLeads}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualified</p>
              <p className="text-2xl font-bold text-green-600">{stats.qualifiedLeads}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hot Leads</p>
              <p className="text-2xl font-bold text-red-600">{stats.hotLeads}</p>
            </div>
            <FireIconSolid className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
            </div>
            <BanknotesIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(stats.avgScore)}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion</p>
              <p className="text-2xl font-bold text-purple-600">{Math.round(stats.conversionRate)}%</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads, companies, or products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Sort by Score</option>
            <option value="value">Sort by Value</option>
            <option value="createdAt">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
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
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                <select
                  value={filters.temperature}
                  onChange={(e) => setFilters({ ...filters, temperature: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Temperatures</option>
                  <option value="cold">Cold</option>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Assignees</option>
                  {assignees.map((assignee) => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="relative">
                  <select
                    multiple
                    value={filters.tags}
                    onChange={(e) => setFilters({
                      ...filters,
                      tags: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={3}
                  >
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
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
      {selectedLeads.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-700">
                {selectedLeads.length} leads selected
              </span>
              <button
                onClick={() => setSelectedLeads([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Selection
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
                Send Email
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Display */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'cards' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => {
              const StatusIcon = statusConfig[lead.status].icon;

              return (
                <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{temperatureConfig[lead.temperature].icon}</span>
                        <span className="text-xs">{priorityConfig[lead.priority].badge}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadDetails(true);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.position} at {lead.company}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[lead.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <StarIcon className={`w-4 h-4 ${lead.score >= 80 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          <span className="text-sm font-medium">{lead.score}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-gray-900">
                        {formatCurrency(lead.value)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {lead.source}
                      </span>
                    </div>

                    {lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {lead.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{lead.tags.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleLeadAction(lead.id, 'call')}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleLeadAction(lead.id, 'email')}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-800 transition-colors">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {lead.lastContact ? formatDate(lead.lastContact) : 'No contact yet'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => {
                  const StatusIcon = statusConfig[lead.status].icon;

                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{temperatureConfig[lead.temperature].icon}</span>
                            <span className="text-xs">{priorityConfig[lead.priority].badge}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{lead.company}</div>
                          <div className="text-sm text-gray-500">{lead.position}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[lead.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <StarIcon className={`w-4 h-4 ${lead.score >= 80 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          <span className="font-medium text-gray-900">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.lastContact ? formatDate(lead.lastContact) : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowLeadDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleLeadAction(lead.id, 'call')}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            <PhoneIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <EllipsisVerticalIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="p-12 text-center">
            <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 mb-6">No leads match your current filters.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {showLeadDetails && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => {
            setShowLeadDetails(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};

export default LeadManager;