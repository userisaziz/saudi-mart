import React, { useState } from 'react'
import { 
  DocumentCheckIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  StarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Supplier {
  id: string
  name: string
  nameAr: string
  logo?: string
  rating: number
  verificationLevel: 'basic' | 'verified' | 'premium'
  previousOrders: number
  responseTime: string
  location: string
  locationAr: string
}

interface QuoteItem {
  id: string
  productName: string
  productNameAr: string
  quantity: number
  unitPrice: number
  totalPrice: number
  deliveryTime: string
  specifications: string
  specificationMet: boolean
}

interface SupplierQuote {
  id: string
  supplier: Supplier
  submittedAt: string
  validUntil: string
  totalAmount: number
  currency: 'SAR' | 'USD' | 'EUR'
  items: QuoteItem[]
  deliveryTerms: string
  paymentTerms: string
  notes?: string
  attachments: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
  technicalScore?: number
  commercialScore?: number
  overallScore?: number
  status: 'pending' | 'under_review' | 'evaluated' | 'accepted' | 'rejected'
}

interface EvaluationCriteria {
  id: string
  name: string
  nameAr: string
  weight: number
  type: 'technical' | 'commercial' | 'compliance'
  maxScore: number
  description: string
  descriptionAr: string
}

interface RFQEvaluation {
  id: string
  rfqId: string
  rfqTitle: string
  rfqTitleAr: string
  evaluationCriteria: EvaluationCriteria[]
  quotes: SupplierQuote[]
  evaluationDeadline: string
  evaluationStatus: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  evaluators: Array<{
    id: string
    name: string
    role: string
    department: string
  }>
}

const RFQEvaluation: React.FC = () => {
  const [selectedRFQ, setSelectedRFQ] = useState<string>('')
  const [selectedQuote, setSelectedQuote] = useState<string>('')
  const [evaluationView, setEvaluationView] = useState<'overview' | 'comparison' | 'detailed' | 'scoring'>('overview')
  const [showScoreModal, setShowScoreModal] = useState(false)

  // Mock data
  const rfqEvaluations: RFQEvaluation[] = [
    {
      id: 'eval001',
      rfqId: 'rfq001',
      rfqTitle: 'Office Supplies Procurement Q1 2024',
      rfqTitleAr: 'شراء مستلزمات المكاتب للربع الأول 2024',
      evaluationDeadline: '2024-02-15',
      evaluationStatus: 'in_progress',
      evaluators: [
        { id: 'e1', name: 'Ahmed Al-Rashid', role: 'Procurement Manager', department: 'Procurement' },
        { id: 'e2', name: 'Fatima Al-Zahra', role: 'Technical Lead', department: 'IT' },
        { id: 'e3', name: 'Omar Al-Saudi', role: 'Finance Director', department: 'Finance' }
      ],
      evaluationCriteria: [
        {
          id: 'c1',
          name: 'Technical Compliance',
          nameAr: 'الامتثال التقني',
          weight: 30,
          type: 'technical',
          maxScore: 100,
          description: 'Product specifications and quality standards',
          descriptionAr: 'مواصفات المنتج ومعايير الجودة'
        },
        {
          id: 'c2',
          name: 'Price Competitiveness',
          nameAr: 'التنافسية السعرية',
          weight: 40,
          type: 'commercial',
          maxScore: 100,
          description: 'Total cost and value for money',
          descriptionAr: 'التكلفة الإجمالية والقيمة مقابل المال'
        },
        {
          id: 'c3',
          name: 'Delivery Timeline',
          nameAr: 'الجدول الزمني للتسليم',
          weight: 20,
          type: 'commercial',
          maxScore: 100,
          description: 'Delivery schedule and reliability',
          descriptionAr: 'جدول التسليم والموثوقية'
        },
        {
          id: 'c4',
          name: 'Supplier Reliability',
          nameAr: 'موثوقية المورد',
          weight: 10,
          type: 'compliance',
          maxScore: 100,
          description: 'Past performance and certifications',
          descriptionAr: 'الأداء السابق والشهادات'
        }
      ],
      quotes: [
        {
          id: 'q1',
          supplier: {
            id: 's1',
            name: 'Al-Riyadh Office Solutions',
            nameAr: 'حلول مكاتب الرياض',
            rating: 4.5,
            verificationLevel: 'verified',
            previousOrders: 15,
            responseTime: '2 hours',
            location: 'Riyadh, Saudi Arabia',
            locationAr: 'الرياض، المملكة العربية السعودية'
          },
          submittedAt: '2024-01-20T10:30:00Z',
          validUntil: '2024-02-20T23:59:59Z',
          totalAmount: 45000,
          currency: 'SAR',
          deliveryTerms: 'FOB Riyadh, 7 days delivery',
          paymentTerms: '30 days net',
          technicalScore: 85,
          commercialScore: 92,
          overallScore: 89,
          status: 'evaluated',
          items: [
            {
              id: 'i1',
              productName: 'Office Chairs (Executive)',
              productNameAr: 'كراسي مكتبية (تنفيذية)',
              quantity: 50,
              unitPrice: 450,
              totalPrice: 22500,
              deliveryTime: '5 days',
              specifications: 'Ergonomic, leather, adjustable height',
              specificationMet: true
            },
            {
              id: 'i2',
              productName: 'Desk Organizers',
              productNameAr: 'منظمات المكتب',
              quantity: 100,
              unitPrice: 25,
              totalPrice: 2500,
              deliveryTime: '3 days',
              specifications: 'Wood, multiple compartments',
              specificationMet: true
            }
          ],
          attachments: [
            { id: 'a1', name: 'Product Catalog.pdf', url: '#', type: 'pdf' },
            { id: 'a2', name: 'Certifications.pdf', url: '#', type: 'pdf' }
          ]
        },
        {
          id: 'q2',
          supplier: {
            id: 's2',
            name: 'Modern Office Equipment',
            nameAr: 'معدات المكاتب الحديثة',
            rating: 4.2,
            verificationLevel: 'basic',
            previousOrders: 8,
            responseTime: '4 hours',
            location: 'Jeddah, Saudi Arabia',
            locationAr: 'جدة، المملكة العربية السعودية'
          },
          submittedAt: '2024-01-21T14:15:00Z',
          validUntil: '2024-02-21T23:59:59Z',
          totalAmount: 42000,
          currency: 'SAR',
          deliveryTerms: 'FOB Jeddah, 10 days delivery',
          paymentTerms: '45 days net',
          technicalScore: 78,
          commercialScore: 95,
          overallScore: 84,
          status: 'evaluated',
          items: [
            {
              id: 'i3',
              productName: 'Office Chairs (Standard)',
              productNameAr: 'كراسي مكتبية (عادية)',
              quantity: 50,
              unitPrice: 380,
              totalPrice: 19000,
              deliveryTime: '7 days',
              specifications: 'Fabric, basic adjustability',
              specificationMet: false
            }
          ],
          attachments: []
        }
      ]
    }
  ]

  const currentEvaluation = rfqEvaluations.find(e => e.id === selectedRFQ) || rfqEvaluations[0]
  const currentQuote = currentEvaluation?.quotes.find(q => q.id === selectedQuote)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'text-gray-500 bg-gray-100'
      case 'in_progress': return 'text-blue-500 bg-blue-100'
      case 'completed': return 'text-green-500 bg-green-100'
      case 'on_hold': return 'text-yellow-500 bg-yellow-100'
      case 'pending': return 'text-orange-500 bg-orange-100'
      case 'under_review': return 'text-blue-500 bg-blue-100'
      case 'evaluated': return 'text-green-500 bg-green-100'
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-500 bg-red-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'premium': return <ShieldCheckIcon className="h-4 w-4 text-gold-500" />
      case 'verified': return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      default: return <ExclamationTriangleIcon className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">RFQ Evaluation</h1>
          <p className="text-sm text-gray-600">تقييم طلب عروض الأسعار</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="rounded-md border-gray-300 text-sm"
            value={selectedRFQ}
            onChange={(e) => setSelectedRFQ(e.target.value)}
          >
            {rfqEvaluations.map(rfq => (
              <option key={rfq.id} value={rfq.id}>{rfq.rfqTitle}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Evaluation Info Card */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{currentEvaluation.rfqTitle}</h2>
            <p className="text-sm text-gray-600">{currentEvaluation.rfqTitleAr}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-sm font-medium">{new Date(currentEvaluation.evaluationDeadline).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentEvaluation.evaluationStatus)}`}>
              {currentEvaluation.evaluationStatus.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-blue-600">{currentEvaluation.quotes.length}</p>
            <p className="text-xs text-gray-600">Total Quotes</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-green-600">
              {currentEvaluation.quotes.filter(q => q.status === 'evaluated').length}
            </p>
            <p className="text-xs text-gray-600">Evaluated</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <ClockIcon className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-yellow-600">
              {currentEvaluation.quotes.filter(q => q.status === 'under_review').length}
            </p>
            <p className="text-xs text-gray-600">Under Review</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <CurrencyDollarIcon className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-semibold text-purple-600">
              {Math.min(...currentEvaluation.quotes.map(q => q.totalAmount)).toLocaleString()} SAR
            </p>
            <p className="text-xs text-gray-600">Lowest Quote</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', nameAr: 'نظرة عامة' },
              { id: 'comparison', name: 'Comparison', nameAr: 'مقارنة' },
              { id: 'detailed', name: 'Detailed View', nameAr: 'عرض تفصيلي' },
              { id: 'scoring', name: 'Scoring', nameAr: 'تسجيل النقاط' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEvaluationView(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  evaluationView === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="block text-xs text-gray-400">{tab.nameAr}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content based on selected view */}
      {evaluationView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evaluation Criteria */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Criteria</h3>
            <div className="space-y-4">
              {currentEvaluation.evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                    <span className="text-sm font-medium text-indigo-600">{criteria.weight}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{criteria.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      criteria.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                      criteria.type === 'commercial' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {criteria.type.toUpperCase()}
                    </span>
                    <span className="text-gray-500">Max Score: {criteria.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Quotes */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Quotes</h3>
            <div className="space-y-4">
              {currentEvaluation.quotes
                .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
                .slice(0, 3)
                .map((quote, index) => (
                <div key={quote.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{quote.supplier.name}</h4>
                        <p className="text-sm text-gray-600">{quote.supplier.nameAr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {quote.totalAmount.toLocaleString()} {quote.currency}
                      </p>
                      {quote.overallScore && (
                        <p className={`text-sm font-medium ${getScoreColor(quote.overallScore)}`}>
                          Score: {quote.overallScore}/100
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        {getVerificationIcon(quote.supplier.verificationLevel)}
                        <span className="ml-1">{quote.supplier.verificationLevel}</span>
                      </span>
                      <span className="flex items-center">
                        <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                        {quote.supplier.rating}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                      {quote.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {evaluationView === 'comparison' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technical Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commercial Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEvaluation.quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{quote.supplier.name}</div>
                          <div className="text-sm text-gray-500">{quote.supplier.nameAr}</div>
                          <div className="flex items-center mt-1">
                            {getVerificationIcon(quote.supplier.verificationLevel)}
                            <StarIcon className="h-3 w-3 text-yellow-400 ml-2 mr-1" />
                            <span className="text-xs text-gray-500">{quote.supplier.rating}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.totalAmount.toLocaleString()} {quote.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${quote.technicalScore ? getScoreColor(quote.technicalScore) : 'text-gray-400'}`}>
                        {quote.technicalScore ? `${quote.technicalScore}/100` : 'Not scored'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${quote.commercialScore ? getScoreColor(quote.commercialScore) : 'text-gray-400'}`}>
                        {quote.commercialScore ? `${quote.commercialScore}/100` : 'Not scored'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${quote.overallScore ? getScoreColor(quote.overallScore) : 'text-gray-400'}`}>
                        {quote.overallScore ? `${quote.overallScore}/100` : 'Not scored'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quote.deliveryTerms}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {quote.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowScoreModal(true)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <DocumentCheckIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {evaluationView === 'detailed' && currentQuote && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{currentQuote.supplier.name}</h3>
              <p className="text-sm text-gray-600">{currentQuote.supplier.nameAr}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {currentQuote.totalAmount.toLocaleString()} {currentQuote.currency}
              </p>
              {currentQuote.overallScore && (
                <p className={`text-lg font-medium ${getScoreColor(currentQuote.overallScore)}`}>
                  Overall Score: {currentQuote.overallScore}/100
                </p>
              )}
            </div>
          </div>

          {/* Quote Items */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Quote Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Spec Met</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentQuote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-xs text-gray-500">{item.productNameAr}</div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.unitPrice.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.deliveryTime}</td>
                      <td className="px-4 py-2">
                        {item.specificationMet ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Terms and Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Terms & Conditions</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Delivery:</span> {currentQuote.deliveryTerms}</p>
                <p><span className="font-medium">Payment:</span> {currentQuote.paymentTerms}</p>
                <p><span className="font-medium">Valid Until:</span> {new Date(currentQuote.validUntil).toLocaleDateString()}</p>
                {currentQuote.notes && (
                  <p><span className="font-medium">Notes:</span> {currentQuote.notes}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Attachments</h4>
              <div className="space-y-2">
                {currentQuote.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center space-x-2 text-sm">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                    <a href={attachment.url} className="text-indigo-600 hover:text-indigo-800">
                      {attachment.name}
                    </a>
                  </div>
                ))}
                {currentQuote.attachments.length === 0 && (
                  <p className="text-sm text-gray-500">No attachments provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {evaluationView === 'scoring' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Evaluation Scoring Matrix</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  {currentEvaluation.evaluationCriteria.map((criteria) => (
                    <th key={criteria.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div>{criteria.name}</div>
                      <div className="text-xs text-gray-400">({criteria.weight}%)</div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weighted Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentEvaluation.quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.supplier.name}</div>
                      <div className="text-sm text-gray-500">{quote.supplier.nameAr}</div>
                    </td>
                    {currentEvaluation.evaluationCriteria.map((criteria) => (
                      <td key={criteria.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {/* Mock scoring data */}
                          {criteria.type === 'technical' ? (quote.technicalScore || 'N/A') :
                           criteria.type === 'commercial' ? (quote.commercialScore || 'N/A') :
                           Math.floor(Math.random() * 30) + 70}
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${quote.overallScore ? getScoreColor(quote.overallScore) : 'text-gray-400'}`}>
                        {quote.overallScore ? `${quote.overallScore}/100` : 'Not calculated'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default RFQEvaluation