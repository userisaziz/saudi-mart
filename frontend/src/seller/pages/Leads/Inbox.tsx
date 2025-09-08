import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Clock,
  DollarSign,
  Eye,
  Edit
} from 'lucide-react';
import { mockLeads, type Lead } from '../../data/mockData';

export const LeadsInbox: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'score'>('date');

  const statusOptions = [
    { 
      value: 'all', 
      label: t('leads.allLeads', 'All Leads'), 
      count: mockLeads.length 
    },
    { 
      value: 'new', 
      label: t('leadStatus.new', 'New'), 
      count: mockLeads.filter(l => l.status === 'new').length 
    },
    { 
      value: 'contacted', 
      label: t('leadStatus.contacted', 'Contacted'), 
      count: mockLeads.filter(l => l.status === 'contacted').length 
    },
    { 
      value: 'qualified', 
      label: t('leadStatus.qualified', 'Qualified'), 
      count: mockLeads.filter(l => l.status === 'qualified').length 
    },
    { 
      value: 'proposal', 
      label: t('leadStatus.proposal', 'Proposal'), 
      count: mockLeads.filter(l => l.status === 'proposal').length 
    },
    { 
      value: 'won', 
      label: t('leadStatus.won', 'Won'), 
      count: mockLeads.filter(l => l.status === 'won').length 
    },
    { 
      value: 'lost', 
      label: t('leadStatus.lost', 'Lost'), 
      count: mockLeads.filter(l => l.status === 'lost').length 
    },
  ];

  const filteredLeads = mockLeads
    .filter(lead => {
      const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
      const matchesSearch = searchTerm === '' || 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.value - a.value;
        case 'score':
          return b.score - a.score;
        case 'date':
        default:
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      }
    });

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      won: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('leads.yesterday', 'Yesterday');
    if (diffDays < 7) return `${diffDays} ${t('leads.daysAgo', 'days ago')}`;
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const getStatusText = (status: string) => {
    return t(`leadStatus.${status}`, status.charAt(0).toUpperCase() + status.slice(1));
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('leads.title', 'Leads Inbox')}</h1>
          <p className="text-gray-600 mt-1">{t('leads.subtitle', 'Manage and track your sales leads')}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t('leads.addLead', 'Add Lead')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{t('leads.totalLeads', 'Total Leads')}</p>
              <p className="text-2xl font-semibold text-gray-900">{mockLeads.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-50">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{t('leads.qualified', 'Qualified')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockLeads.filter(l => l.status === 'qualified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-50">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{t('leads.pendingFollowUp', 'Pending Follow-up')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockLeads.filter(l => l.nextFollowUp).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-50">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-gray-600">{t('leads.totalValue', 'Total Value')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(mockLeads.reduce((sum, lead) => sum + lead.value, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Status Filter Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('leads.filterByStatus', 'Filter by Status')}</h3>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedStatus === option.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Search and Sort */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className={`w-5 h-5 text-gray-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2`} />
                  <input
                    type="text"
                    placeholder={t('leads.searchPlaceholder', 'Search leads by name, company, or email...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'value' | 'score')}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">{t('leads.sortByDate', 'Sort by Date')}</option>
                    <option value="value">{t('leads.sortByValue', 'Sort by Value')}</option>
                    <option value="score">{t('leads.sortByScore', 'Sort by Score')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads List */}
            <div className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                            {getStatusText(lead.status)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => {
                              const filled = i < Math.floor(lead.score / 20);
                              return filled ? (
                                <Star key={i} className={`w-4 h-4 fill-current ${getScoreColor(lead.score)}`} />
                              ) : (
                                <Star key={i} className="w-4 h-4 text-gray-300" />
                              );
                            })}
                            <span className={`text-sm font-medium ml-1 ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600">{lead.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(lead.value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('leads.lastContact', 'Last contact')}: {formatDate(lead.lastContact)}
                      </div>
                      {lead.nextFollowUp && (
                        <div className="text-sm text-orange-600 mt-1">
                          {t('leads.followUp', 'Follow up')}: {formatDate(lead.nextFollowUp)}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1" 
                          title={t('leads.viewDetails', 'View Details')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 p-1" 
                          title={t('leads.edit', 'Edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-purple-600 hover:text-purple-800 p-1" 
                          title={t('leads.call', 'Call')}
                        >
                          <PhoneIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1" 
                          title={t('leads.email', 'Email')}
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('leads.noLeads', 'No leads found')}</h3>
                <p className="text-gray-600">{t('leads.noLeadsDesc', 'Try adjusting your search or filter criteria')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};