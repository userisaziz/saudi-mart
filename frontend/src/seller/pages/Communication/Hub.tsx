import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  StarIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ClockIcon,
  CheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

interface Message {
  id: string;
  customerId: string;
  content: string;
  timestamp: string;
  sender: 'customer' | 'seller';
  type: 'text' | 'file' | 'image';
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  isRead: boolean;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmed Mohammed Al-Salem',
    company: 'Saudi Industries Company',
    email: 'ahmed@saudi-industries.com',
    phone: '+966501234567',
    lastMessage: 'When can the order be delivered? We need the equipment urgently.',
    lastMessageTime: '2024-03-15T14:30:00Z',
    unreadCount: 3,
    isOnline: true,
    priority: 'high',
    tags: ['VIP Customer', 'Industries'],
  },
  {
    id: '2',
    name: 'Fatima Al-Ahmed',
    company: 'Nakheel Commercial Group',
    email: 'fatima@nakheel-group.com',
    phone: '+966502345678',
    lastMessage: 'Thank you for the excellent service. I will review the product soon.',
    lastMessageTime: '2024-03-15T13:15:00Z',
    unreadCount: 0,
    isOnline: false,
    priority: 'medium',
    tags: ['Commerce', 'Regular Customer'],
  },
  {
    id: '3',
    name: 'Khalid Al-Salem',
    company: 'Advanced Technology Solutions',
    email: 'khalid@advanced-tech.com',
    phone: '+966503456789',
    lastMessage: 'Can I get a bulk pricing quote?',
    lastMessageTime: '2024-03-15T12:00:00Z',
    unreadCount: 1,
    isOnline: true,
    priority: 'medium',
    tags: ['Technology', 'Bulk Orders'],
  },
  {
    id: '4',
    name: 'Nora Al-Ghamdi',
    company: 'Industrial Innovation Company',
    email: 'nora@innovation-ind.com',
    lastMessage: 'Shipment received in excellent condition. Thank you.',
    lastMessageTime: '2024-03-15T11:30:00Z',
    unreadCount: 0,
    isOnline: false,
    priority: 'low',
    tags: ['Innovation'],
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    customerId: '1',
    content: 'Hello, I want to inquire about the possibility of delivering order ORD-2024-0001 before the scheduled date.',
    timestamp: '2024-03-15T14:20:00Z',
    sender: 'customer',
    type: 'text',
    isRead: true,
  },
  {
    id: '2',
    customerId: '1',
    content: 'Hello! Absolutely, we can work on expediting the delivery process. I will contact the shipping department and give you an update within two hours.',
    timestamp: '2024-03-15T14:25:00Z',
    sender: 'seller',
    type: 'text',
    isRead: true,
  },
  {
    id: '3',
    customerId: '1',
    content: 'Excellent, we are waiting for your response. The project is very urgent.',
    timestamp: '2024-03-15T14:27:00Z',
    sender: 'customer',
    type: 'text',
    isRead: true,
  },
  {
    id: '4',
    customerId: '1',
    content: 'When can the order be delivered? We need the equipment urgently.',
    timestamp: '2024-03-15T14:30:00Z',
    sender: 'customer',
    type: 'text',
    isRead: false,
  },
];

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const CommunicationHub: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [customers] = useState<Customer[]>(mockCustomers);
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || customer.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const customerMessages = messages.filter(message => message.customerId === selectedCustomer?.id);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}${t('communication.minutes', 'm')}`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}${t('communication.hours', 'h')}`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}${t('communication.days', 'd')}`;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedCustomer) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const totalUnread = customers.reduce((sum, customer) => sum + customer.unreadCount, 0);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return t('communication.highPriority', 'High Priority');
      case 'medium': return t('communication.mediumPriority', 'Medium Priority');
      case 'low': return t('communication.lowPriority', 'Low Priority');
      default: return priority;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar - Customer List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">{t('communication.title', 'Communication Hub')}</h1>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">{t('communication.activeChats', 'Active Chats')}</p>
              <p className="text-xl font-bold text-blue-700">{customers.length}</p>
            </div>
            <div className="flex-1 bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">{t('communication.unreadMessages', 'Unread Messages')}</p>
              <p className="text-xl font-bold text-red-700">{totalUnread}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              type="text"
              placeholder={t('communication.searchCustomers', 'Search customers...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          {/* Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('communication.allPriorities', 'All Priorities')}</option>
            <option value="high">{t('communication.highPriority', 'High Priority')}</option>
            <option value="medium">{t('communication.mediumPriority', 'Medium Priority')}</option>
            <option value="low">{t('communication.lowPriority', 'Low Priority')}</option>
          </select>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCustomer?.id === customer.id 
                  ? `bg-blue-50 ${isRTL ? 'border-r-4 border-r-blue-600' : 'border-l-4 border-l-blue-600'}` 
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  {customer.isOnline && (
                    <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-3 h-3 bg-green-500 border-2 border-white rounded-full`}></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                    <div className="flex items-center gap-1">
                      {customer.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {customer.unreadCount}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{formatTime(customer.lastMessageTime)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-2">{customer.company}</p>
                  
                  <p className="text-sm text-gray-700 truncate mb-2">{customer.lastMessage}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[customer.priority]}`}>
                      {getPriorityLabel(customer.priority)}
                    </span>
                    
                    {customer.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    {selectedCustomer.isOnline && (
                      <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-3 h-3 bg-green-500 border-2 border-white rounded-full`}></div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedCustomer.name}</h2>
                    <p className="text-sm text-gray-600">{selectedCustomer.company}</p>
                    <p className="text-xs text-gray-500">
                      {selectedCustomer.isOnline 
                        ? t('communication.online', 'Online now')
                        : `${t('communication.lastSeen', 'Last seen')} ${formatTime(selectedCustomer.lastMessageTime)}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={t('communication.call', 'Call')}
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={t('communication.videoCall', 'Video Call')}
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={t('communication.markAsImportant', 'Mark as Important')}
                  >
                    <StarIcon className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="More options"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {customerMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'seller' 
                      ? isRTL ? 'justify-start' : 'justify-end'
                      : isRTL ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'seller'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      message.sender === 'seller' ? 'text-blue-100' : 'text-gray-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === 'seller' && (
                        <CheckIcon className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={t('communication.attachments', 'Attachments')}
                >
                  <PaperClipIcon className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={t('communication.typeMessage', 'Type your message...')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`w-full px-4 py-2 ${isRTL ? 'pr-10' : 'pl-4'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <button 
                    className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors`}
                    title={t('communication.emoji', 'Emoji')}
                  >
                    <FaceSmileIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={t('communication.send', 'Send')}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('communication.selectChat', 'Select a conversation to start')}
              </h3>
              <p className="text-gray-500">
                {t('communication.selectChatDesc', 'Choose a customer from the list to view your conversation')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;