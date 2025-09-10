import React, { useState, useMemo } from 'react';
import {
  ArrowLeftIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  FireIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  PhoneIcon as PhoneIconSolid,
  EnvelopeIcon as EnvelopeIconSolid
} from '@heroicons/react/24/solid';
import { mockLeads, mockTemplates, type Lead } from '../../data/mockData';

interface ConversationMessage {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  direction: 'inbound' | 'outbound';
  timestamp: Date;
  subject?: string;
  content: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read' | 'replied';
  duration?: number; // for calls in minutes
}

interface LeadActivity {
  id: string;
  type: 'status_change' | 'score_update' | 'task_created' | 'follow_up_scheduled';
  timestamp: Date;
  description: string;
  user?: string;
}

const mockConversations: ConversationMessage[] = [
  {
    id: '1',
    type: 'email',
    direction: 'inbound',
    timestamp: new Date('2024-03-01T10:30:00'),
    subject: 'Inquiry about LED Panel Bulk Purchase',
    content: 'Hi, I\'m interested in purchasing LED panels for our office renovation project. Could you provide pricing for 200+ units?',
    status: 'read'
  },
  {
    id: '2',
    type: 'email',
    direction: 'outbound',
    timestamp: new Date('2024-03-01T14:15:00'),
    subject: 'Re: Inquiry about LED Panel Bulk Purchase',
    content: 'Thank you for your interest! I\'d be happy to provide bulk pricing. For 200+ units, we can offer a 15% discount. Would you like to schedule a call to discuss specifications?',
    status: 'delivered'
  },
  {
    id: '3',
    type: 'call',
    direction: 'outbound',
    timestamp: new Date('2024-03-02T15:00:00'),
    content: 'Discussed project requirements, timeline, and budget. Customer confirmed 250 units needed by April 15th.',
    duration: 25,
    status: 'sent'
  },
  {
    id: '4',
    type: 'note',
    direction: 'outbound',
    timestamp: new Date('2024-03-03T09:00:00'),
    content: 'Follow-up required: Send detailed quote with installation timeline and warranty information.',
    status: 'sent'
  }
];

const mockActivities: LeadActivity[] = [
  {
    id: '1',
    type: 'score_update',
    timestamp: new Date('2024-03-03T10:00:00'),
    description: 'Lead score increased from 75 to 85 (Budget confirmed)',
    user: 'System'
  },
  {
    id: '2',
    type: 'follow_up_scheduled',
    timestamp: new Date('2024-03-02T16:00:00'),
    description: 'Follow-up scheduled for March 5th at 2:00 PM',
    user: 'John Doe'
  },
  {
    id: '3',
    type: 'status_change',
    timestamp: new Date('2024-03-01T14:20:00'),
    description: 'Status changed from "New" to "Qualified"',
    user: 'John Doe'
  }
];

interface LeadScoreBreakdownProps {
  score: number;
  breakdown: {
    engagement: number;
    fit: number;
    intent: number;
    timing: number;
  };
}

const LeadScoreBreakdown: React.FC<LeadScoreBreakdownProps> = ({ score, breakdown }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Score Breakdown</h3>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => {
            const filled = i < Math.floor(score / 20);
            return filled ? (
              <StarIconSolid key={i} className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarIcon key={i} className="w-6 h-6 text-gray-300" />
            );
          })}
        </div>
        <span className="ml-3 text-2xl font-bold text-gray-900">{score}/100</span>
      </div>

      <div className="space-y-3">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 capitalize">{key}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ConversationThreadProps {
  messages: ConversationMessage[];
  onSendMessage: (content: string, type: 'email' | 'note') => void;
}

const ConversationThread: React.FC<ConversationThreadProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'email' | 'note'>('email');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, messageType);
      setNewMessage('');
    }
  };

  const getMessageIcon = (type: string, direction: string) => {
    switch (type) {
      case 'email':
        return direction === 'inbound' ? 
          <EnvelopeIconSolid className="w-5 h-5 text-blue-600" /> :
          <EnvelopeIcon className="w-5 h-5 text-gray-600" />;
      case 'call':
        return <PhoneIconSolid className="w-5 h-5 text-green-600" />;
      case 'meeting':
        return <CalendarIcon className="w-5 h-5 text-purple-600" />;
      case 'note':
        return <DocumentTextIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-gray-500';
      case 'delivered': return 'text-blue-500';
      case 'read': return 'text-green-500';
      case 'replied': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Conversation History</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getMessageIcon(message.type, message.direction)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {message.direction === 'inbound' ? 'Customer' : 'You'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleString()}
                  </span>
                  {message.duration && (
                    <span className="text-xs text-gray-500">
                      ({message.duration}m call)
                    </span>
                  )}
                </div>
                <span className={`text-xs ${getStatusColor(message.status)}`}>
                  {message.status}
                </span>
              </div>
              {message.subject && (
                <p className="text-sm font-medium text-gray-800 mb-1">{message.subject}</p>
              )}
              <p className="text-sm text-gray-600">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as 'email' | 'note')}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="email">Email</option>
            <option value="note">Internal Note</option>
          </select>
        </div>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Type a ${messageType}...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const LeadDetails: React.FC = () => {
  const [leadId] = useState('1'); // In real app, this would come from URL params
  const [conversations, setConversations] = useState(mockConversations);
  const [activities] = useState(mockActivities);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(true);

  const lead = mockLeads.find(l => l.id === leadId) || mockLeads[0];

  const scoreBreakdown = {
    engagement: 85,
    fit: 92,
    intent: 78,
    timing: 85
  };

  const handleSendMessage = (content: string, type: 'email' | 'note') => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      direction: 'outbound',
      timestamp: new Date(),
      content,
      status: 'sent'
    };
    setConversations(prev => [...prev, newMessage]);
  };

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

  const getPriorityIcon = (score: number) => {
    if (score >= 80) return <FireIcon className="w-5 h-5 text-red-500" />;
    if (score >= 60) return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    return <ClockIcon className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600">{lead.company}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(lead.status)}`}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
          {getPriorityIcon(lead.score)}
        </div>
        
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5" />
            <span>Call</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <EnvelopeIcon className="w-5 h-5" />
            <span>Email</span>
          </button>
          <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ConversationThread
            messages={conversations}
            onSendMessage={handleSendMessage}
          />

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </span>
                      {activity.user && (
                        <span className="text-xs text-gray-500">• by {activity.user}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {lead.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                <p className="text-gray-600">{lead.company}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{lead.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm font-medium text-gray-900">{lead.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Source:</span>
                <span className="text-sm font-medium text-gray-900">{lead.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Value:</span>
                <span className="text-lg font-semibold text-green-600">
                  ${lead.value.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Contact:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(lead.lastContact).toLocaleDateString()}
                </span>
              </div>
              {lead.nextFollowUp && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Follow-up:</span>
                  <span className="text-sm font-medium text-orange-600">
                    {new Date(lead.nextFollowUp).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lead Score Breakdown */}
          {showScoreBreakdown && (
            <LeadScoreBreakdown score={lead.score} breakdown={scoreBreakdown} />
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Schedule Follow-up</p>
                    <p className="text-xs text-gray-500">Set reminder for next contact</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Send Proposal</p>
                    <p className="text-xs text-gray-500">Create and send quote</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Update Status</p>
                    <p className="text-xs text-gray-500">Change lead status</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-2">
              {lead.notes.map((note, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;