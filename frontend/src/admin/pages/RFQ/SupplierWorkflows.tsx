import React, { useState } from 'react'
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  BanknotesIcon,
  TruckIcon,
  DocumentTextIcon,
  StarIcon,
  FlagIcon
} from '@heroicons/react/24/outline'

interface SupplierDocument {
  id: string
  type: 'commercial_register' | 'tax_certificate' | 'bank_letter' | 'license' | 'certificate' | 'other'
  name: string
  nameAr: string
  url: string
  uploadedAt: string
  verifiedAt?: string
  verifiedBy?: string
  status: 'pending' | 'verified' | 'rejected'
  expiryDate?: string
  rejectionReason?: string
}

interface SupplierContact {
  id: string
  name: string
  nameAr: string
  position: string
  positionAr: string
  email: string
  phone: string
  isPrimary: boolean
}

interface SupplierCapability {
  id: string
  category: string
  categoryAr: string
  subCategories: string[]
  certifications: string[]
  capacity: string
  experience: number
  references: Array<{
    clientName: string
    projectValue: number
    completionDate: string
    description: string
  }>
}

interface SupplierFinancial {
  annualRevenue: number
  currency: string
  creditRating?: string
  bankReferences: Array<{
    bankName: string
    accountType: string
    relationshipYears: number
  }>
  insuranceCoverage: number
}

interface OnboardingSupplier {
  id: string
  applicationId: string
  companyName: string
  companyNameAr: string
  businessType: 'manufacturer' | 'distributor' | 'service_provider' | 'trading' | 'contractor'
  registrationNumber: string
  taxNumber: string
  establishedYear: number
  website?: string
  description: string
  descriptionAr: string
  
  // Location
  country: string
  city: string
  address: string
  addressAr: string
  
  // Contacts
  contacts: SupplierContact[]
  
  // Documents
  documents: SupplierDocument[]
  
  // Capabilities
  capabilities: SupplierCapability[]
  
  // Financial Info
  financial: SupplierFinancial
  
  // Application Status
  applicationDate: string
  onboardingStatus: 'submitted' | 'document_review' | 'capability_assessment' | 'financial_review' | 'final_review' | 'approved' | 'rejected' | 'on_hold'
  verificationLevel: 'basic' | 'verified' | 'premium'
  
  // Workflow
  currentStep: number
  totalSteps: number
  assignedReviewer?: string
  reviewDeadline?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  // Scores
  documentScore?: number
  capabilityScore?: number
  financialScore?: number
  overallScore?: number
  
  // Notes
  internalNotes?: string
  publicFeedback?: string
}

const SupplierWorkflows: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>('')
  const [workflowView, setWorkflowView] = useState<'list' | 'details' | 'documents' | 'assessment'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])

  // Mock data
  const onboardingSuppliers: OnboardingSupplier[] = [
    {
      id: 'sup001',
      applicationId: 'APP-2024-001',
      companyName: 'Advanced Manufacturing Solutions',
      companyNameAr: 'حلول التصنيع المتقدمة',
      businessType: 'manufacturer',
      registrationNumber: '1010123456',
      taxNumber: '300123456700003',
      establishedYear: 2015,
      website: 'https://ams-saudi.com',
      description: 'Leading manufacturer of industrial equipment and components',
      descriptionAr: 'شركة رائدة في تصنيع المعدات والمكونات الصناعية',
      country: 'Saudi Arabia',
      city: 'Riyadh',
      address: 'Industrial City, 2nd Industrial Area',
      addressAr: 'المدينة الصناعية، المنطقة الصناعية الثانية',
      applicationDate: '2024-01-15T09:00:00Z',
      onboardingStatus: 'capability_assessment',
      verificationLevel: 'basic',
      currentStep: 3,
      totalSteps: 5,
      assignedReviewer: 'Ahmed Al-Rashid',
      reviewDeadline: '2024-02-15T23:59:59Z',
      priority: 'high',
      documentScore: 95,
      capabilityScore: 88,
      overallScore: 91,
      contacts: [
        {
          id: 'c1',
          name: 'Mohamed Al-Ahmadi',
          nameAr: 'محمد الأحمدي',
          position: 'General Manager',
          positionAr: 'المدير العام',
          email: 'mohamed@ams-saudi.com',
          phone: '+966501234567',
          isPrimary: true
        }
      ],
      documents: [
        {
          id: 'd1',
          type: 'commercial_register',
          name: 'Commercial Registration',
          nameAr: 'السجل التجاري',
          url: '#',
          uploadedAt: '2024-01-15T10:00:00Z',
          verifiedAt: '2024-01-16T14:30:00Z',
          verifiedBy: 'Sarah Al-Zahra',
          status: 'verified',
          expiryDate: '2025-01-15'
        },
        {
          id: 'd2',
          type: 'tax_certificate',
          name: 'Tax Registration Certificate',
          nameAr: 'شهادة التسجيل الضريبي',
          url: '#',
          uploadedAt: '2024-01-15T10:05:00Z',
          status: 'pending'
        }
      ],
      capabilities: [
        {
          id: 'cap1',
          category: 'Industrial Manufacturing',
          categoryAr: 'التصنيع الصناعي',
          subCategories: ['Metal Fabrication', 'CNC Machining', 'Assembly'],
          certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
          capacity: '1000 units/month',
          experience: 9,
          references: [
            {
              clientName: 'SABIC',
              projectValue: 2500000,
              completionDate: '2023-12-15',
              description: 'Industrial equipment manufacturing project'
            }
          ]
        }
      ],
      financial: {
        annualRevenue: 15000000,
        currency: 'SAR',
        creditRating: 'A',
        bankReferences: [
          {
            bankName: 'Al Rajhi Bank',
            accountType: 'Corporate',
            relationshipYears: 5
          }
        ],
        insuranceCoverage: 5000000
      }
    },
    {
      id: 'sup002',
      applicationId: 'APP-2024-002',
      companyName: 'Digital Solutions Hub',
      companyNameAr: 'مركز الحلول الرقمية',
      businessType: 'service_provider',
      registrationNumber: '1010789012',
      taxNumber: '300789012700003',
      establishedYear: 2018,
      description: 'Software development and IT consulting services',
      descriptionAr: 'خدمات تطوير البرمجيات والاستشارات التقنية',
      country: 'Saudi Arabia',
      city: 'Jeddah',
      address: 'King Abdullah Economic City',
      addressAr: 'مدينة الملك عبد الله الاقتصادية',
      applicationDate: '2024-01-20T11:30:00Z',
      onboardingStatus: 'document_review',
      verificationLevel: 'basic',
      currentStep: 2,
      totalSteps: 5,
      assignedReviewer: 'Fatima Al-Zahra',
      reviewDeadline: '2024-02-20T23:59:59Z',
      priority: 'medium',
      documentScore: 82,
      contacts: [
        {
          id: 'c2',
          name: 'Omar Al-Khalil',
          nameAr: 'عمر الخليل',
          position: 'CEO',
          positionAr: 'الرئيس التنفيذي',
          email: 'omar@dsh.sa',
          phone: '+966551234567',
          isPrimary: true
        }
      ],
      documents: [
        {
          id: 'd3',
          type: 'commercial_register',
          name: 'Commercial Registration',
          nameAr: 'السجل التجاري',
          url: '#',
          uploadedAt: '2024-01-20T12:00:00Z',
          status: 'pending'
        }
      ],
      capabilities: [
        {
          id: 'cap2',
          category: 'Software Development',
          categoryAr: 'تطوير البرمجيات',
          subCategories: ['Web Development', 'Mobile Apps', 'System Integration'],
          certifications: ['ISO 27001:2013'],
          capacity: '20 projects/year',
          experience: 6,
          references: []
        }
      ],
      financial: {
        annualRevenue: 8000000,
        currency: 'SAR',
        bankReferences: [
          {
            bankName: 'NCB',
            accountType: 'Corporate',
            relationshipYears: 3
          }
        ],
        insuranceCoverage: 2000000
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-500 bg-blue-100'
      case 'document_review': return 'text-yellow-500 bg-yellow-100'
      case 'capability_assessment': return 'text-purple-500 bg-purple-100'
      case 'financial_review': return 'text-orange-500 bg-orange-100'
      case 'final_review': return 'text-indigo-500 bg-indigo-100'
      case 'approved': return 'text-green-500 bg-green-100'
      case 'rejected': return 'text-red-500 bg-red-100'
      case 'on_hold': return 'text-gray-500 bg-gray-100'
      case 'pending': return 'text-yellow-500 bg-yellow-100'
      case 'verified': return 'text-green-500 bg-green-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-blue-600 bg-blue-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'manufacturer': return <BuildingOfficeIcon className="h-5 w-5" />
      case 'distributor': return <TruckIcon className="h-5 w-5" />
      case 'service_provider': return <GlobeAltIcon className="h-5 w-5" />
      case 'trading': return <BanknotesIcon className="h-5 w-5" />
      case 'contractor': return <BuildingOfficeIcon className="h-5 w-5" />
      default: return <BuildingOfficeIcon className="h-5 w-5" />
    }
  }

  const filteredSuppliers = onboardingSuppliers.filter(supplier => {
    const matchesSearch = supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.companyNameAr.includes(searchTerm) ||
                         supplier.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || supplier.onboardingStatus === filterStatus
    const matchesPriority = filterPriority === 'all' || supplier.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const currentSupplier = onboardingSuppliers.find(s => s.id === selectedSupplier)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Onboarding</h1>
          <p className="text-sm text-gray-600">تأهيل الموردين</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Import Applications
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{onboardingSuppliers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Under Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {onboardingSuppliers.filter(s => !['approved', 'rejected'].includes(s.onboardingStatus)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {onboardingSuppliers.filter(s => s.onboardingStatus === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">
                {onboardingSuppliers.filter(s => ['high', 'urgent'].includes(s.priority)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {workflowView === 'list' && (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow border p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="document_review">Document Review</option>
                  <option value="capability_assessment">Capability Assessment</option>
                  <option value="financial_review">Financial Review</option>
                  <option value="final_review">Final Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Bulk Actions
                </button>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {showBulkActions && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedSuppliers.length} supplier(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      Bulk Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                      Bulk Reject
                    </button>
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                      Assign Reviewer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suppliers List */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSuppliers(filteredSuppliers.map(s => s.id))
                          } else {
                            setSelectedSuppliers([])
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSuppliers.includes(supplier.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSuppliers([...selectedSuppliers, supplier.id])
                            } else {
                              setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplier.id))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              {getBusinessTypeIcon(supplier.businessType)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{supplier.companyName}</div>
                            <div className="text-sm text-gray-500">{supplier.companyNameAr}</div>
                            <div className="text-xs text-gray-400">{supplier.businessType.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{supplier.applicationId}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(supplier.applicationDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.onboardingStatus)}`}>
                          {supplier.onboardingStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(supplier.priority)}`}>
                          {supplier.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(supplier.currentStep / supplier.totalSteps) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-600">
                            {supplier.currentStep}/{supplier.totalSteps}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.overallScore ? (
                          <span className={`text-sm font-medium ${getScoreColor(supplier.overallScore)}`}>
                            {supplier.overallScore}/100
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Not scored</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.assignedReviewer || 'Unassigned'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.reviewDeadline ? (
                          <div className="text-sm text-gray-900">
                            {new Date(supplier.reviewDeadline).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No deadline</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSupplier(supplier.id)
                              setWorkflowView('details')
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {workflowView === 'details' && currentSupplier && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWorkflowView('list')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              ← Back to List
            </button>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Approve
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                Reject
              </button>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700">
                Hold
              </button>
            </div>
          </div>

          {/* Supplier Details */}
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentSupplier.companyName}</h2>
                <p className="text-gray-600">{currentSupplier.companyNameAr}</p>
                <p className="text-sm text-gray-500">Application ID: {currentSupplier.applicationId}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentSupplier.onboardingStatus)}`}>
                  {currentSupplier.onboardingStatus.replace('_', ' ')}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Progress: {currentSupplier.currentStep}/{currentSupplier.totalSteps}
                </p>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Onboarding Progress</h3>
              <div className="flex items-center">
                {Array.from({ length: currentSupplier.totalSteps }, (_, index) => (
                  <React.Fragment key={index}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index < currentSupplier.currentStep ? 'bg-green-500 text-white' :
                      index === currentSupplier.currentStep ? 'bg-blue-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {index < currentSupplier.currentStep ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < currentSupplier.totalSteps - 1 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        index < currentSupplier.currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Application</span>
                <span>Documents</span>
                <span>Capabilities</span>
                <span>Financial</span>
                <span>Approval</span>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'details', name: 'Company Details' },
                  { id: 'documents', name: 'Documents' },
                  { id: 'assessment', name: 'Assessment' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setWorkflowView(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      workflowView === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Company Details Tab Content */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Business Type</dt>
                    <dd className="text-gray-900">{currentSupplier.businessType.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Registration Number</dt>
                    <dd className="text-gray-900">{currentSupplier.registrationNumber}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Tax Number</dt>
                    <dd className="text-gray-900">{currentSupplier.taxNumber}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Established</dt>
                    <dd className="text-gray-900">{currentSupplier.establishedYear}</dd>
                  </div>
                  {currentSupplier.website && (
                    <div>
                      <dt className="font-medium text-gray-500">Website</dt>
                      <dd className="text-gray-900">
                        <a href={currentSupplier.website} className="text-indigo-600 hover:text-indigo-800">
                          {currentSupplier.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Contact Information</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Location</dt>
                    <dd className="text-gray-900">{currentSupplier.city}, {currentSupplier.country}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Address</dt>
                    <dd className="text-gray-900">{currentSupplier.address}</dd>
                    <dd className="text-gray-600">{currentSupplier.addressAr}</dd>
                  </div>
                  {currentSupplier.contacts.map((contact) => (
                    <div key={contact.id}>
                      <dt className="font-medium text-gray-500">
                        {contact.position} {contact.isPrimary && '(Primary)'}
                      </dt>
                      <dd className="text-gray-900">{contact.name}</dd>
                      <dd className="text-gray-600">{contact.email}</dd>
                      <dd className="text-gray-600">{contact.phone}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {workflowView === 'documents' && currentSupplier && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Verification</h3>
          
          <div className="space-y-4">
            {currentSupplier.documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{document.name}</h4>
                      <p className="text-sm text-gray-600">{document.nameAr}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                    <div className="flex space-x-1">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {document.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800">
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {document.verifiedAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Verified by {document.verifiedBy} on {new Date(document.verifiedAt).toLocaleDateString()}
                  </div>
                )}
                {document.expiryDate && (
                  <div className="mt-1 text-xs text-gray-500">
                    Expires: {new Date(document.expiryDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {workflowView === 'assessment' && currentSupplier && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Capability Assessment</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{currentSupplier.documentScore || 'N/A'}</p>
              <p className="text-sm text-gray-600">Document Score</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{currentSupplier.capabilityScore || 'N/A'}</p>
              <p className="text-sm text-gray-600">Capability Score</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{currentSupplier.overallScore || 'N/A'}</p>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
          </div>

          <div className="space-y-6">
            {currentSupplier.capabilities.map((capability) => (
              <div key={capability.id} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{capability.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Sub-categories</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {capability.subCategories.map((sub, index) => (
                        <li key={index}>• {sub}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Certifications</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {capability.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center">
                          <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-2" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Capacity:</span> {capability.capacity}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Experience:</span> {capability.experience} years
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierWorkflows