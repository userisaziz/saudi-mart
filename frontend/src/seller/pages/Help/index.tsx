import React, { useState } from 'react';
import { useLanguage } from '@/shared/contexts/LanguageContext';
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlayIcon,
  UserIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Import shared UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'products' | 'orders' | 'payments' | 'technical' | 'account';
  tags: string[];
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const mockFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I add a new product to my catalog?',
    answer: 'To add a new product, navigate to Products > Add Product from your dashboard. Fill in all required information including product name, description, price, and category. Upload high-quality images and save your product. It will be reviewed and published within 24 hours.',
    category: 'products',
    tags: ['products', 'catalog', 'add', 'publish']
  },
  {
    id: '2',
    question: 'How long does it take to receive payments?',
    answer: 'Payments are typically processed within 2-3 business days after order delivery confirmation. Bank transfers may take an additional 1-2 business days depending on your bank. You can track all payments in the Finance section of your dashboard.',
    category: 'payments',
    tags: ['payments', 'processing', 'banking', 'timeline']
  },
  {
    id: '3',
    question: 'Can I bulk upload products using CSV?',
    answer: 'Yes! You can bulk upload products using our CSV template. Go to Products > Bulk Upload, download our template, fill it with your product data, and upload it. The system will validate all entries and import valid products.',
    category: 'products',
    tags: ['bulk upload', 'csv', 'products', 'import']
  },
  {
    id: '4',
    question: 'How do I manage my business hours?',
    answer: 'You can set your business hours in Profile > Business Hours. This helps customers know when you are available and sets expectations for response times. You can set different hours for each day of the week.',
    category: 'account',
    tags: ['business hours', 'profile', 'settings', 'availability']
  },
  {
    id: '5',
    question: 'What should I do if my account verification is delayed?',
    answer: 'Account verification typically takes 1-3 business days. If it takes longer, ensure all documents are clear, valid, and match your business information. Contact our support team if verification is pending for more than 5 business days.',
    category: 'account',
    tags: ['verification', 'account', 'documents', 'support']
  },
  {
    id: '6',
    question: 'How do I handle order cancellations and refunds?',
    answer: 'Order cancellations can be processed through the Orders section. For cancellations before shipping, refunds are automatic. For returns after delivery, follow the return process which includes customer verification and refund processing.',
    category: 'orders',
    tags: ['cancellation', 'refund', 'orders', 'returns']
  }
];

const mockTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'Getting Started with Your Seller Account',
    description: 'Complete guide to setting up your seller profile and adding your first products',
    duration: '12:30',
    thumbnail: '/api/placeholder/320/180',
    category: 'Getting Started',
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Advanced Product Management',
    description: 'Learn about inventory management, bulk uploads, and product optimization',
    duration: '18:45',
    thumbnail: '/api/placeholder/320/180',
    category: 'Products',
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Managing Orders and Customer Communication',
    description: 'Handle orders efficiently and communicate effectively with customers',
    duration: '15:20',
    thumbnail: '/api/placeholder/320/180',
    category: 'Orders',
    difficulty: 'beginner'
  },
  {
    id: '4',
    title: 'Analytics and Performance Tracking',
    description: 'Use analytics to grow your business and track performance metrics',
    duration: '22:10',
    thumbnail: '/api/placeholder/320/180',
    category: 'Analytics',
    difficulty: 'advanced'
  }
];

export const Help: React.FC = () => {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('faq');

  const categories = [
    { id: 'all', name: isRTL ? 'جميع الفئات' : 'All Categories' },
    { id: 'getting-started', name: isRTL ? 'البداية' : 'Getting Started' },
    { id: 'products', name: isRTL ? 'المنتجات' : 'Products' },
    { id: 'orders', name: isRTL ? 'الطلبات' : 'Orders' },
    { id: 'payments', name: isRTL ? 'المدفوعات' : 'Payments' },
    { id: 'account', name: isRTL ? 'الحساب' : 'Account' },
    { id: 'technical', name: isRTL ? 'تقني' : 'Technical' }
  ];

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const supportChannels = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: isRTL ? 'الدردشة المباشرة' : 'Live Chat',
      description: isRTL ? 'احصل على مساعدة فورية من فريق الدعم' : 'Get instant help from our support team',
      availability: isRTL ? 'متاح 24/7' : 'Available 24/7',
      action: isRTL ? 'ابدأ محادثة' : 'Start Chat',
      color: 'blue'
    },
    {
      icon: PhoneIcon,
      title: isRTL ? 'الدعم الهاتفي' : 'Phone Support',
      description: isRTL ? 'تحدث مع مختص الدعم مباشرة' : 'Speak directly with a support specialist',
      availability: isRTL ? 'الأحد - الخميس، 8 ص - 6 م' : 'Sun-Thu, 8 AM - 6 PM',
      action: '+966 11 234 5678',
      color: 'green'
    },
    {
      icon: VideoCameraIcon,
      title: isRTL ? 'جلسة فيديو' : 'Video Session',
      description: isRTL ? 'احجز جلسة تدريبية شخصية' : 'Book a personalized training session',
      availability: isRTL ? 'بموعد مسبق' : 'By Appointment',
      action: isRTL ? 'احجز جلسة' : 'Book Session',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isRTL ? 'مركز المساعدة والدعم' : 'Help & Support Center'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isRTL 
            ? 'نحن هنا لمساعدتك! ابحث في الأسئلة الشائعة أو تواصل مع فريق الدعم المختص'
            : 'We are here to help you! Search through FAQs or contact our expert support team'
          }
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mt-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={isRTL ? 'ابحث عن إجابة...' : 'Search for an answer...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center space-x-2">
            <BookOpenIcon className="w-4 h-4" />
            <span>{isRTL ? 'أسئلة شائعة' : 'FAQ'}</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center space-x-2">
            <AcademicCapIcon className="w-4 h-4" />
            <span>{isRTL ? 'دروس تعليمية' : 'Tutorials'}</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>{isRTL ? 'تواصل معنا' : 'Contact Us'}</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4" />
            <span>{isRTL ? 'حالة النظام' : 'System Status'}</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'الفئات' : 'Categories'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                    </span>
                    <Badge variant="secondary">
                      {filteredFAQs.length} {isRTL ? 'نتيجة' : 'results'}
                    </Badge>
                  </CardTitle>
                  {searchQuery && (
                    <CardDescription>
                      {isRTL ? `البحث عن: "${searchQuery}"` : `Searching for: "${searchQuery}"`}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isRTL ? 'لا توجد نتائج' : 'No Results Found'}
                      </h3>
                      <p className="text-gray-500">
                        {isRTL 
                          ? 'جرب كلمات مفتاحية مختلفة أو تصفح الفئات'
                          : 'Try different keywords or browse categories'
                        }
                      </p>
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                            <div className="flex flex-wrap gap-1 mt-3">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tutorials Section */}
        <TabsContent value="tutorials">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'دروس الفيديو التعليمية' : 'Video Tutorials'}</CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'تعلم كيفية استخدام المنصة من خلال دروس الفيديو التفاعلية'
                    : 'Learn how to use the platform through interactive video lessons'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mockTutorials.map((tutorial) => (
                    <div key={tutorial.id} className="group cursor-pointer">
                      <Card className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img 
                            src={tutorial.thumbnail} 
                            alt={tutorial.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                              <PlayIcon className="w-6 h-6 text-blue-600 ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {tutorial.difficulty === 'beginner' ? (isRTL ? 'مبتدئ' : 'Beginner') :
                               tutorial.difficulty === 'intermediate' ? (isRTL ? 'متوسط' : 'Intermediate') :
                               (isRTL ? 'متقدم' : 'Advanced')}
                            </Badge>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              {tutorial.duration}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {tutorial.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {tutorial.category}
                            </span>
                            <Button variant="ghost" size="sm">
                              {isRTL ? 'شاهد' : 'Watch'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'نصائح سريعة' : 'Quick Tips'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium mb-2">
                      {isRTL ? 'صور المنتجات عالية الجودة' : 'High-Quality Product Images'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isRTL 
                        ? 'استخدم صور واضحة وعالية الدقة لزيادة مبيعاتك'
                        : 'Use clear, high-resolution images to boost your sales'
                      }
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium mb-2">
                      {isRTL ? 'وصف مفصل للمنتجات' : 'Detailed Product Descriptions'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isRTL 
                        ? 'اكتب وصف شامل ومفصل لمنتجاتك'
                        : 'Write comprehensive and detailed product descriptions'
                      }
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium mb-2">
                      {isRTL ? 'رد سريع على العملاء' : 'Quick Customer Response'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {isRTL 
                        ? 'رد على استفسارات العملاء خلال 24 ساعة'
                        : 'Respond to customer inquiries within 24 hours'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    channel.color === 'blue' ? 'bg-blue-100' :
                    channel.color === 'green' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <channel.icon className={`w-8 h-8 ${
                      channel.color === 'blue' ? 'text-blue-600' :
                      channel.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
                  <p className="text-gray-600 mb-3">{channel.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <ClockIcon className="w-4 h-4 inline mr-1" />
                    {channel.availability}
                  </div>
                  <Button 
                    className={`w-full ${
                      channel.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      channel.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{isRTL ? 'معلومات الاتصال' : 'Contact Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">{isRTL ? 'عنوان المكتب' : 'Office Address'}</h4>
                  <p className="text-gray-600">
                    {isRTL 
                      ? 'الرياض، المملكة العربية السعودية\nحي الملك فهد، طريق الملك عبدالعزيز\nص.ب ١٢٣٤٥، الرياض ١١٤١١'
                      : 'Riyadh, Saudi Arabia\nKing Fahd District, King Abdulaziz Road\nP.O. Box 12345, Riyadh 11411'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-3">{isRTL ? 'ساعات العمل' : 'Business Hours'}</h4>
                  <p className="text-gray-600">
                    {isRTL 
                      ? 'الأحد - الخميس: 8:00 ص - 6:00 م\nالجمعة - السبت: مغلق\n\nالدعم عبر الإنترنت متاح 24/7'
                      : 'Sunday - Thursday: 8:00 AM - 6:00 PM\nFriday - Saturday: Closed\n\nOnline support available 24/7'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Status */}
        <TabsContent value="status">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  {isRTL ? 'حالة النظام' : 'System Status'}
                  <Badge variant="outline" className="ml-3 text-green-600">
                    {isRTL ? 'تعمل بشكل طبيعي' : 'All Systems Operational'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {isRTL 
                    ? 'آخر تحديث: منذ 5 دقائق'
                    : 'Last updated: 5 minutes ago'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: isRTL ? 'منصة البائعين' : 'Seller Platform', status: 'operational' },
                    { name: isRTL ? 'معالجة الطلبات' : 'Order Processing', status: 'operational' },
                    { name: isRTL ? 'نظام المدفوعات' : 'Payment System', status: 'operational' },
                    { name: isRTL ? 'إدارة المخزون' : 'Inventory Management', status: 'operational' },
                    { name: isRTL ? 'التحليلات والتقارير' : 'Analytics & Reports', status: 'operational' },
                    { name: isRTL ? 'نظام الإشعارات' : 'Notification System', status: 'operational' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'operational' ? 'bg-green-500' :
                          service.status === 'degraded' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          service.status === 'operational' ? 'text-green-600 border-green-200' :
                          service.status === 'degraded' ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }
                      >
                        {service.status === 'operational' ? (isRTL ? 'تعمل' : 'Operational') :
                         service.status === 'degraded' ? (isRTL ? 'بطيء' : 'Degraded') :
                         (isRTL ? 'متوقف' : 'Down')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'التحديثات الأخيرة' : 'Recent Updates'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">{isRTL ? 'تحديث النظام v2.1.3' : 'System Update v2.1.3'}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL 
                          ? 'تحسينات في أداء النظام وإصلاح أخطاء بسيطة'
                          : 'Performance improvements and minor bug fixes'
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isRTL ? 'منذ ساعتين' : '2 hours ago'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">{isRTL ? 'إضافة ميزة الإشعارات المحسنة' : 'Enhanced Notifications Feature'}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL 
                          ? 'مركز إشعارات محسن مع تصفية متقدمة'
                          : 'Improved notifications center with advanced filtering'
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isRTL ? 'أمس' : 'Yesterday'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">{isRTL ? 'تحسينات في صفحة التحليلات' : 'Analytics Page Improvements'}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL 
                          ? 'رسوم بيانية جديدة وتقارير مفصلة أكثر'
                          : 'New charts and more detailed reports'
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isRTL ? 'منذ 3 أيام' : '3 days ago'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;