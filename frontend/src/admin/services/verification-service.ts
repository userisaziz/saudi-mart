export interface KYCDocument {
  id: string
  userId: string
  userName: string
  userEmail: string
  businessName: string
  documentType: 'business_license' | 'tax_certificate' | 'identity_document' | 'bank_statement' | 'utility_bill' | 'other'
  documentName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: 'pending' | 'approved' | 'rejected' | 'requires_resubmission'
  uploadedAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
  rejectionReason?: string
  expiryDate?: string
  metadata: {
    extracted: {
      companyName?: string
      registrationNumber?: string
      issueDate?: string
      expiryDate?: string
      address?: string
    }
    verification: {
      isAuthentic?: boolean
      confidence?: number
      flags?: string[]
    }
  }
}

export interface VerificationApplication {
  id: string
  userId: string
  userName: string
  userEmail: string
  businessName: string
  businessType: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_resubmission'
  priority: 'low' | 'normal' | 'high'
  submittedAt?: string
  reviewStartedAt?: string
  reviewCompletedAt?: string
  assignedTo?: string
  assignedToName?: string
  documents: KYCDocument[]
  reviewHistory: VerificationReviewAction[]
  businessInfo: {
    registrationNumber?: string
    taxId?: string
    industry: string
    yearEstablished?: number
    employeeCount?: string
    annualRevenue?: string
    businessAddress: {
      street: string
      city: string
      state: string
      country: string
      postalCode: string
    }
    contactPerson: {
      name: string
      position: string
      phone: string
      email: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface VerificationReviewAction {
  id: string
  applicationId: string
  action: 'submitted' | 'assigned' | 'document_approved' | 'document_rejected' | 'approved' | 'rejected' | 'resubmission_requested'
  reviewerId?: string
  reviewerName?: string
  notes?: string
  timestamp: string
  documentId?: string
}

export interface VerificationFilters {
  search?: string
  status?: VerificationApplication['status']
  priority?: VerificationApplication['priority']
  assignedTo?: string
  businessType?: string
  submittedFrom?: string
  submittedTo?: string
  documentType?: KYCDocument['documentType']
  documentStatus?: KYCDocument['status']
}

export interface VerificationListResponse {
  data: VerificationApplication[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface VerificationStats {
  totalApplications: number
  pendingReview: number
  underReview: number
  approved: number
  rejected: number
  requiresResubmission: number
  averageReviewTime: number // in days
  newApplicationsThisWeek: number
  approvalRate: number // percentage
  documentsAwaitingReview: number
}

export interface ReviewerStats {
  reviewerId: string
  reviewerName: string
  applicationsReviewed: number
  averageReviewTime: number
  approvalRate: number
  documentsReviewed: number
}

// Mock verification data
const mockKYCDocuments: KYCDocument[] = [
  {
    id: 'doc-1',
    userId: 'user-3',
    userName: 'Sarah Davis',
    userEmail: 'sarah.davis@techsolutions.com',
    businessName: 'TechSolutions Inc',
    documentType: 'business_license',
    documentName: 'Business License - TechSolutions Inc.pdf',
    fileUrl: 'https://example.com/documents/business-license-1.pdf',
    fileSize: 2547830,
    mimeType: 'application/pdf',
    status: 'pending',
    uploadedAt: '2024-01-10T14:30:00Z',
    metadata: {
      extracted: {
        companyName: 'TechSolutions Inc',
        registrationNumber: 'BL2023789456',
        issueDate: '2023-01-15',
        expiryDate: '2026-01-15'
      },
      verification: {
        confidence: 0.85,
        flags: []
      }
    }
  },
  {
    id: 'doc-2',
    userId: 'user-3',
    userName: 'Sarah Davis',
    userEmail: 'sarah.davis@techsolutions.com',
    businessName: 'TechSolutions Inc',
    documentType: 'tax_certificate',
    documentName: 'Tax Certificate 2023.pdf',
    fileUrl: 'https://example.com/documents/tax-cert-1.pdf',
    fileSize: 1892750,
    mimeType: 'application/pdf',
    status: 'pending',
    uploadedAt: '2024-01-10T14:35:00Z',
    metadata: {
      extracted: {
        companyName: 'TechSolutions Inc',
        registrationNumber: 'TAX456789123',
        issueDate: '2023-12-01',
        expiryDate: '2024-12-01'
      },
      verification: {
        confidence: 0.92,
        flags: []
      }
    }
  },
  {
    id: 'doc-3',
    userId: 'user-6',
    userName: 'Robert Brown',
    userEmail: 'robert.brown@manufacturing.com',
    businessName: 'Brown Manufacturing Co',
    documentType: 'business_license',
    documentName: 'Manufacturing License.pdf',
    fileUrl: 'https://example.com/documents/manufacturing-license.pdf',
    fileSize: 3425600,
    mimeType: 'application/pdf',
    status: 'rejected',
    uploadedAt: '2024-01-05T09:15:00Z',
    reviewedAt: '2024-01-08T11:20:00Z',
    reviewedBy: 'Admin User',
    reviewNotes: 'Document appears to be expired',
    rejectionReason: 'License expired on 2023-12-31. Please provide current license.',
    metadata: {
      extracted: {
        companyName: 'Brown Manufacturing Co',
        registrationNumber: 'ML2020654321',
        issueDate: '2020-01-01',
        expiryDate: '2023-12-31'
      },
      verification: {
        isAuthentic: true,
        confidence: 0.95,
        flags: ['expired']
      }
    }
  },
  {
    id: 'doc-4',
    userId: 'user-9',
    userName: 'Anna Martinez',
    userEmail: 'anna.martinez@foodtech.com',
    businessName: 'FoodTech Innovations',
    documentType: 'business_license',
    documentName: 'Food Business License 2024.pdf',
    fileUrl: 'https://example.com/documents/food-license.pdf',
    fileSize: 2156400,
    mimeType: 'application/pdf',
    status: 'approved',
    uploadedAt: '2024-01-08T16:45:00Z',
    reviewedAt: '2024-01-12T10:30:00Z',
    reviewedBy: 'Admin User',
    reviewNotes: 'All information verified and current',
    metadata: {
      extracted: {
        companyName: 'FoodTech Innovations',
        registrationNumber: 'FB2024123456',
        issueDate: '2024-01-01',
        expiryDate: '2025-01-01'
      },
      verification: {
        isAuthentic: true,
        confidence: 0.98,
        flags: []
      }
    }
  }
]

const mockVerificationApplications: VerificationApplication[] = [
  {
    id: 'app-1',
    userId: 'user-3',
    userName: 'Sarah Davis',
    userEmail: 'sarah.davis@techsolutions.com',
    businessName: 'TechSolutions Inc',
    businessType: 'Software',
    status: 'under_review',
    priority: 'normal',
    submittedAt: '2024-01-10T14:40:00Z',
    reviewStartedAt: '2024-01-11T09:00:00Z',
    assignedTo: 'admin-1',
    assignedToName: 'Admin User',
    documents: mockKYCDocuments.filter(doc => doc.userId === 'user-3'),
    reviewHistory: [
      {
        id: 'review-1',
        applicationId: 'app-1',
        action: 'submitted',
        timestamp: '2024-01-10T14:40:00Z'
      },
      {
        id: 'review-2',
        applicationId: 'app-1',
        action: 'assigned',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        timestamp: '2024-01-11T09:00:00Z'
      }
    ],
    businessInfo: {
      registrationNumber: 'BL2023789456',
      taxId: 'TAX456789123',
      industry: 'Software Development',
      yearEstablished: 2020,
      employeeCount: '10-50',
      annualRevenue: '$500K - $1M',
      businessAddress: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94105'
      },
      contactPerson: {
        name: 'Sarah Davis',
        position: 'CEO',
        phone: '+1-555-0123',
        email: 'sarah.davis@techsolutions.com'
      }
    },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-11T09:00:00Z'
  },
  {
    id: 'app-2',
    userId: 'user-6',
    userName: 'Robert Brown',
    userEmail: 'robert.brown@manufacturing.com',
    businessName: 'Brown Manufacturing Co',
    businessType: 'Manufacturing',
    status: 'requires_resubmission',
    priority: 'high',
    submittedAt: '2024-01-05T09:20:00Z',
    reviewStartedAt: '2024-01-05T14:00:00Z',
    reviewCompletedAt: '2024-01-08T11:20:00Z',
    assignedTo: 'admin-1',
    assignedToName: 'Admin User',
    documents: mockKYCDocuments.filter(doc => doc.userId === 'user-6'),
    reviewHistory: [
      {
        id: 'review-3',
        applicationId: 'app-2',
        action: 'submitted',
        timestamp: '2024-01-05T09:20:00Z'
      },
      {
        id: 'review-4',
        applicationId: 'app-2',
        action: 'assigned',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        timestamp: '2024-01-05T14:00:00Z'
      },
      {
        id: 'review-5',
        applicationId: 'app-2',
        action: 'document_rejected',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        notes: 'License expired, please provide current documentation',
        timestamp: '2024-01-08T11:20:00Z',
        documentId: 'doc-3'
      },
      {
        id: 'review-6',
        applicationId: 'app-2',
        action: 'resubmission_requested',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        notes: 'Please provide current business license',
        timestamp: '2024-01-08T11:20:00Z'
      }
    ],
    businessInfo: {
      registrationNumber: 'ML2020654321',
      taxId: 'TAX987654321',
      industry: 'Manufacturing',
      yearEstablished: 2018,
      employeeCount: '51-200',
      annualRevenue: '$1M - $5M',
      businessAddress: {
        street: '456 Industrial Blvd',
        city: 'Detroit',
        state: 'MI',
        country: 'USA',
        postalCode: '48201'
      },
      contactPerson: {
        name: 'Robert Brown',
        position: 'Owner',
        phone: '+1-555-0456',
        email: 'robert.brown@manufacturing.com'
      }
    },
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-08T11:20:00Z'
  },
  {
    id: 'app-3',
    userId: 'user-9',
    userName: 'Anna Martinez',
    userEmail: 'anna.martinez@foodtech.com',
    businessName: 'FoodTech Innovations',
    businessType: 'Food & Beverage',
    status: 'approved',
    priority: 'normal',
    submittedAt: '2024-01-08T16:50:00Z',
    reviewStartedAt: '2024-01-09T08:30:00Z',
    reviewCompletedAt: '2024-01-12T10:30:00Z',
    assignedTo: 'admin-1',
    assignedToName: 'Admin User',
    documents: mockKYCDocuments.filter(doc => doc.userId === 'user-9'),
    reviewHistory: [
      {
        id: 'review-7',
        applicationId: 'app-3',
        action: 'submitted',
        timestamp: '2024-01-08T16:50:00Z'
      },
      {
        id: 'review-8',
        applicationId: 'app-3',
        action: 'assigned',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        timestamp: '2024-01-09T08:30:00Z'
      },
      {
        id: 'review-9',
        applicationId: 'app-3',
        action: 'document_approved',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        notes: 'All documentation verified',
        timestamp: '2024-01-12T10:30:00Z',
        documentId: 'doc-4'
      },
      {
        id: 'review-10',
        applicationId: 'app-3',
        action: 'approved',
        reviewerId: 'admin-1',
        reviewerName: 'Admin User',
        notes: 'Application approved - all requirements met',
        timestamp: '2024-01-12T10:30:00Z'
      }
    ],
    businessInfo: {
      registrationNumber: 'FB2024123456',
      taxId: 'TAX111222333',
      industry: 'Food Technology',
      yearEstablished: 2022,
      employeeCount: '1-10',
      annualRevenue: '$100K - $500K',
      businessAddress: {
        street: '789 Innovation Drive',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        postalCode: '73301'
      },
      contactPerson: {
        name: 'Anna Martinez',
        position: 'Founder & CEO',
        phone: '+1-555-0789',
        email: 'anna.martinez@foodtech.com'
      }
    },
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-12T10:30:00Z'
  }
]

class VerificationService {
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Filter verification applications
  private filterApplications(applications: VerificationApplication[], filters: VerificationFilters): VerificationApplication[] {
    return applications.filter(app => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        if (!app.businessName.toLowerCase().includes(searchTerm) &&
            !app.userName.toLowerCase().includes(searchTerm) &&
            !app.userEmail.toLowerCase().includes(searchTerm) &&
            !app.businessInfo.registrationNumber?.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      if (filters.status && app.status !== filters.status) return false
      if (filters.priority && app.priority !== filters.priority) return false
      if (filters.assignedTo && app.assignedTo !== filters.assignedTo) return false
      if (filters.businessType && app.businessType !== filters.businessType) return false

      if (filters.submittedFrom) {
        const submittedDate = new Date(app.submittedAt || app.createdAt)
        const fromDate = new Date(filters.submittedFrom)
        if (submittedDate < fromDate) return false
      }

      if (filters.submittedTo) {
        const submittedDate = new Date(app.submittedAt || app.createdAt)
        const toDate = new Date(filters.submittedTo)
        if (submittedDate > toDate) return false
      }

      if (filters.documentType) {
        const hasDocumentType = app.documents.some(doc => doc.documentType === filters.documentType)
        if (!hasDocumentType) return false
      }

      if (filters.documentStatus) {
        const hasDocumentStatus = app.documents.some(doc => doc.status === filters.documentStatus)
        if (!hasDocumentStatus) return false
      }

      return true
    })
  }

  // Get paginated verification applications
  async getVerificationApplications(
    page: number = 1,
    limit: number = 10,
    filters: VerificationFilters = {}
  ): Promise<VerificationListResponse> {
    await this.delay()

    const filteredApplications = this.filterApplications(mockVerificationApplications, filters)
    const total = filteredApplications.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const data = filteredApplications.slice(startIndex, startIndex + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Get verification application by ID
  async getVerificationApplicationById(id: string): Promise<VerificationApplication | null> {
    await this.delay()
    return mockVerificationApplications.find(app => app.id === id) || null
  }

  // Get applications assigned to reviewer
  async getAssignedApplications(reviewerId: string): Promise<VerificationApplication[]> {
    await this.delay()
    return mockVerificationApplications.filter(app => app.assignedTo === reviewerId)
  }

  // Assign application to reviewer
  async assignApplication(applicationId: string, reviewerId: string, reviewerName: string): Promise<VerificationApplication> {
    await this.delay()

    const appIndex = mockVerificationApplications.findIndex(app => app.id === applicationId)
    if (appIndex === -1) {
      throw new Error('Application not found')
    }

    const now = new Date().toISOString()
    mockVerificationApplications[appIndex].assignedTo = reviewerId
    mockVerificationApplications[appIndex].assignedToName = reviewerName
    mockVerificationApplications[appIndex].reviewStartedAt = now
    mockVerificationApplications[appIndex].status = 'under_review'
    mockVerificationApplications[appIndex].updatedAt = now

    // Add review history entry
    const reviewAction: VerificationReviewAction = {
      id: `review-${Date.now()}`,
      applicationId,
      action: 'assigned',
      reviewerId,
      reviewerName,
      timestamp: now
    }
    mockVerificationApplications[appIndex].reviewHistory.push(reviewAction)

    return mockVerificationApplications[appIndex]
  }

  // Review document
  async reviewDocument(
    documentId: string,
    action: 'approve' | 'reject',
    reviewerId: string,
    reviewerName: string,
    notes?: string
  ): Promise<KYCDocument> {
    await this.delay()

    const docIndex = mockKYCDocuments.findIndex(doc => doc.id === documentId)
    if (docIndex === -1) {
      throw new Error('Document not found')
    }

    const now = new Date().toISOString()
    mockKYCDocuments[docIndex].status = action === 'approve' ? 'approved' : 'rejected'
    mockKYCDocuments[docIndex].reviewedAt = now
    mockKYCDocuments[docIndex].reviewedBy = reviewerName
    mockKYCDocuments[docIndex].reviewNotes = notes

    if (action === 'reject') {
      mockKYCDocuments[docIndex].rejectionReason = notes || 'Document does not meet verification standards'
    }

    // Update application review history
    const application = mockVerificationApplications.find(app => 
      app.documents.some(doc => doc.id === documentId)
    )
    if (application) {
      const reviewAction: VerificationReviewAction = {
        id: `review-${Date.now()}`,
        applicationId: application.id,
        action: action === 'approve' ? 'document_approved' : 'document_rejected',
        reviewerId,
        reviewerName,
        notes,
        timestamp: now,
        documentId
      }
      application.reviewHistory.push(reviewAction)
    }

    return mockKYCDocuments[docIndex]
  }

  // Complete application review
  async completeApplicationReview(
    applicationId: string,
    decision: 'approve' | 'reject' | 'request_resubmission',
    reviewerId: string,
    reviewerName: string,
    notes?: string
  ): Promise<VerificationApplication> {
    await this.delay()

    const appIndex = mockVerificationApplications.findIndex(app => app.id === applicationId)
    if (appIndex === -1) {
      throw new Error('Application not found')
    }

    const now = new Date().toISOString()
    let newStatus: VerificationApplication['status']
    let action: VerificationReviewAction['action']

    switch (decision) {
      case 'approve':
        newStatus = 'approved'
        action = 'approved'
        break
      case 'reject':
        newStatus = 'rejected'
        action = 'rejected'
        break
      case 'request_resubmission':
        newStatus = 'requires_resubmission'
        action = 'resubmission_requested'
        break
    }

    mockVerificationApplications[appIndex].status = newStatus
    mockVerificationApplications[appIndex].reviewCompletedAt = now
    mockVerificationApplications[appIndex].updatedAt = now

    // Add review history entry
    const reviewAction: VerificationReviewAction = {
      id: `review-${Date.now()}`,
      applicationId,
      action,
      reviewerId,
      reviewerName,
      notes,
      timestamp: now
    }
    mockVerificationApplications[appIndex].reviewHistory.push(reviewAction)

    return mockVerificationApplications[appIndex]
  }

  // Update application priority
  async updateApplicationPriority(applicationId: string, priority: VerificationApplication['priority']): Promise<VerificationApplication> {
    await this.delay()

    const appIndex = mockVerificationApplications.findIndex(app => app.id === applicationId)
    if (appIndex === -1) {
      throw new Error('Application not found')
    }

    mockVerificationApplications[appIndex].priority = priority
    mockVerificationApplications[appIndex].updatedAt = new Date().toISOString()

    return mockVerificationApplications[appIndex]
  }

  // Get verification statistics
  async getVerificationStats(): Promise<VerificationStats> {
    await this.delay()

    const totalApplications = mockVerificationApplications.length
    const pendingReview = mockVerificationApplications.filter(app => app.status === 'submitted').length
    const underReview = mockVerificationApplications.filter(app => app.status === 'under_review').length
    const approved = mockVerificationApplications.filter(app => app.status === 'approved').length
    const rejected = mockVerificationApplications.filter(app => app.status === 'rejected').length
    const requiresResubmission = mockVerificationApplications.filter(app => app.status === 'requires_resubmission').length

    // Calculate average review time for completed applications
    const completedApps = mockVerificationApplications.filter(app => 
      app.status === 'approved' || app.status === 'rejected'
    )
    const totalReviewTime = completedApps.reduce((sum, app) => {
      if (app.submittedAt && app.reviewCompletedAt) {
        const submitted = new Date(app.submittedAt).getTime()
        const completed = new Date(app.reviewCompletedAt).getTime()
        return sum + (completed - submitted)
      }
      return sum
    }, 0)
    const averageReviewTime = completedApps.length > 0 
      ? totalReviewTime / completedApps.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

    // Calculate new applications this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newApplicationsThisWeek = mockVerificationApplications.filter(app => 
      new Date(app.createdAt) >= oneWeekAgo
    ).length

    // Calculate approval rate
    const totalReviewed = approved + rejected
    const approvalRate = totalReviewed > 0 ? (approved / totalReviewed) * 100 : 0

    // Count documents awaiting review
    const documentsAwaitingReview = mockKYCDocuments.filter(doc => doc.status === 'pending').length

    return {
      totalApplications,
      pendingReview,
      underReview,
      approved,
      rejected,
      requiresResubmission,
      averageReviewTime,
      newApplicationsThisWeek,
      approvalRate,
      documentsAwaitingReview
    }
  }

  // Get reviewer statistics
  async getReviewerStats(reviewerId?: string): Promise<ReviewerStats[]> {
    await this.delay()

    const reviewers = new Map<string, {
      name: string
      reviewed: number
      approved: number
      totalReviewTime: number
      documentsReviewed: number
    }>()

    // Collect reviewer data from applications
    mockVerificationApplications.forEach(app => {
      app.reviewHistory.forEach(action => {
        if (action.reviewerId && action.reviewerName) {
          if (!reviewers.has(action.reviewerId)) {
            reviewers.set(action.reviewerId, {
              name: action.reviewerName,
              reviewed: 0,
              approved: 0,
              totalReviewTime: 0,
              documentsReviewed: 0
            })
          }

          const reviewer = reviewers.get(action.reviewerId)!
          
          if (action.action === 'approved') {
            reviewer.reviewed++
            reviewer.approved++
          } else if (action.action === 'rejected') {
            reviewer.reviewed++
          } else if (action.action === 'document_approved' || action.action === 'document_rejected') {
            reviewer.documentsReviewed++
          }
        }
      })
    })

    // Convert to array and calculate stats
    const stats: ReviewerStats[] = Array.from(reviewers.entries()).map(([id, data]) => ({
      reviewerId: id,
      reviewerName: data.name,
      applicationsReviewed: data.reviewed,
      averageReviewTime: 2.5, // Mock average
      approvalRate: data.reviewed > 0 ? (data.approved / data.reviewed) * 100 : 0,
      documentsReviewed: data.documentsReviewed
    }))

    return reviewerId ? stats.filter(s => s.reviewerId === reviewerId) : stats
  }

  // Get pending documents by type
  async getPendingDocumentsByType(): Promise<Record<KYCDocument['documentType'], number>> {
    await this.delay()

    const counts: Record<KYCDocument['documentType'], number> = {
      business_license: 0,
      tax_certificate: 0,
      identity_document: 0,
      bank_statement: 0,
      utility_bill: 0,
      other: 0
    }

    mockKYCDocuments
      .filter(doc => doc.status === 'pending')
      .forEach(doc => {
        counts[doc.documentType]++
      })

    return counts
  }

  // Bulk assign applications
  async bulkAssignApplications(
    applicationIds: string[],
    reviewerId: string,
    reviewerName: string
  ): Promise<VerificationApplication[]> {
    await this.delay(1000)

    const updatedApplications: VerificationApplication[] = []

    for (const appId of applicationIds) {
      try {
        const updated = await this.assignApplication(appId, reviewerId, reviewerName)
        updatedApplications.push(updated)
      } catch (error) {
        // Continue with other applications if one fails
        console.error(`Failed to assign application ${appId}:`, error)
      }
    }

    return updatedApplications
  }

  // Export verification data
  async exportVerificationData(filters: VerificationFilters = {}): Promise<string> {
    await this.delay(2000) // Simulate export processing time

    const applications = this.filterApplications(mockVerificationApplications, filters)
    
    // Mock CSV export URL
    const exportId = `export-${Date.now()}`
    return `https://api.example.com/exports/verifications/${exportId}.csv`
  }

  // Get application timeline
  async getApplicationTimeline(applicationId: string): Promise<VerificationReviewAction[]> {
    await this.delay()

    const application = mockVerificationApplications.find(app => app.id === applicationId)
    if (!application) {
      throw new Error('Application not found')
    }

    return application.reviewHistory.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }
}

export const verificationService = new VerificationService()