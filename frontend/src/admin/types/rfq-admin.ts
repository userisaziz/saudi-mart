import { SaudiRegion, UserRole } from './saudi-admin';

export interface AdminRFQ {
  id: string;
  rfqNumber: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'rfq' | 'rfp' | 'tender' | 'framework' | 'direct_purchase' | 'emergency';
  status: 'draft' | 'published' | 'responses_received' | 'under_evaluation' | 'awarded' | 'closed' | 'cancelled' | 'suspended';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  category: RFQCategory;
  
  // Requester Information
  requester: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    company: string;
    phone?: string;
    location: SaudiRegion;
  };
  
  // Financial Information
  budget: {
    estimatedMin: number;
    estimatedMax: number;
    actualAwarded?: number;
    currency: 'SAR' | 'USD' | 'EUR';
    vatIncluded: boolean;
    paymentTerms?: string;
    budgetApproval: {
      approved: boolean;
      approvedBy?: string;
      approvalDate?: string;
      approvalAmount: number;
    };
  };
  
  // Timeline Management
  timeline: {
    createdAt: string;
    publishedAt?: string;
    quotationDeadline: string;
    clarificationDeadline?: string;
    evaluationStartDate?: string;
    evaluationEndDate?: string;
    deliveryDate: string;
    contractStartDate?: string;
    contractEndDate?: string;
    lastModified: string;
  };
  
  // Participant Management
  participants: {
    invitedSuppliers: string[];
    registeredSuppliers: string[];
    qualifiedSuppliers: string[];
    disqualifiedSuppliers: string[];
    responsesReceived: number;
    shortlistedSuppliers: string[];
    awardedSupplier?: string;
  };
  
  // Documents and Attachments
  documents: RFQDocument[];
  
  // Technical Requirements
  specifications: RFQSpecification[];
  technicalRequirements: TechnicalRequirement[];
  complianceRequirements: ComplianceRequirement[];
  
  // Evaluation Framework
  evaluation: {
    criteria: EvaluationCriteria[];
    methodology: 'lowest_price' | 'best_value' | 'technical_commercial' | 'multi_criteria';
    passingScore: number;
    weightings: Record<string, number>;
    evaluators: string[];
    evaluationStatus: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
    clarifications: RFQClarification[];
  };
  
  // Approval Workflow
  approval: {
    currentStage: 'draft' | 'technical_review' | 'commercial_review' | 'legal_review' | 'management_approval' | 'approved' | 'rejected';
    approvalLevels: ApprovalLevel[];
    pendingWith?: string;
    approvalHistory: ApprovalHistory[];
    comments?: string;
    rejectionReason?: string;
  };
  
  // Risk Assessment
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: RiskFactor[];
    mitigationStrategies: string[];
    assessedBy: string;
    assessmentDate: string;
    lastReviewDate?: string;
  };
  
  // Supplier Communication
  communication: {
    clarificationRequests: ClarificationRequest[];
    announcements: RFQAnnouncement[];
    meetings: RFQMeeting[];
    lastCommunication?: string;
  };
  
  // Quality Assurance
  qualityChecks: {
    technicalReview: QualityCheck;
    legalReview: QualityCheck;
    complianceReview: QualityCheck;
    procurementReview: QualityCheck;
  };
  
  // Analytics and Reporting
  analytics: {
    views: number;
    downloads: number;
    supplierEngagement: number;
    averageResponseTime: number;
    competitionLevel: 'low' | 'medium' | 'high';
    marketResponse: 'poor' | 'fair' | 'good' | 'excellent';
  };
  
  // Compliance and Audit
  compliance: {
    regulatoryRequirements: string[];
    auditTrail: AuditEntry[];
    complianceScore: number;
    lastAuditDate?: string;
    certificationRequired: boolean;
  };
  
  // Integration References
  integrations: {
    erpReference?: string;
    financialReference?: string;
    contractReference?: string;
    projectReference?: string;
  };
  
  // Metadata
  metadata: {
    version: string;
    template?: string;
    tags: string[];
    language: 'en' | 'ar' | 'both';
    confidentialityLevel: 'public' | 'restricted' | 'confidential' | 'secret';
    archiveDate?: string;
  };
}

export interface RFQCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  description: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  requiresPrequalification: boolean;
  minimumExperience: number;
  requiredCertifications: string[];
  estimatedDuration: number;
  complexityLevel: 'simple' | 'moderate' | 'complex' | 'highly_complex';
}

export interface RFQDocument {
  id: string;
  name: string;
  nameAr?: string;
  type: 'specification' | 'drawing' | 'terms_conditions' | 'evaluation_criteria' | 'reference' | 'template' | 'clarification' | 'other';
  category: 'mandatory' | 'optional' | 'reference';
  url: string;
  size: number;
  format: string;
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
  securityLevel: 'public' | 'restricted' | 'confidential';
  checksum?: string;
  expiryDate?: string;
}

export interface RFQSpecification {
  id: string;
  category: string;
  categoryAr: string;
  requirement: string;
  requirementAr: string;
  value: string;
  valueAr?: string;
  unit?: string;
  tolerance?: string;
  isMandatory: boolean;
  isNegotiable: boolean;
  verificationMethod: 'document' | 'sample' | 'test' | 'inspection' | 'certification';
  priority: 'must_have' | 'should_have' | 'nice_to_have';
  notes?: string;
}

export interface TechnicalRequirement {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'performance' | 'quality' | 'safety' | 'environmental' | 'operational' | 'maintenance';
  importance: 'critical' | 'high' | 'medium' | 'low';
  verificationMethod: string;
  acceptanceCriteria: string;
  testingRequired: boolean;
  certificationRequired: boolean;
  compliance: {
    standard: string;
    version?: string;
    authority: string;
  }[];
}

export interface ComplianceRequirement {
  id: string;
  type: 'legal' | 'regulatory' | 'industry' | 'company' | 'international';
  name: string;
  nameAr: string;
  description: string;
  authority: string;
  reference: string;
  mandatory: boolean;
  verificationMethod: 'certificate' | 'audit' | 'declaration' | 'inspection';
  validityPeriod?: number;
  renewalRequired: boolean;
  penaltyForNonCompliance?: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: 'technical' | 'commercial' | 'compliance' | 'experience' | 'financial';
  weight: number;
  scoringMethod: 'numeric' | 'percentage' | 'pass_fail' | 'ranking' | 'qualitative';
  minScore?: number;
  maxScore?: number;
  passingScore?: number;
  subcriteria: SubCriteria[];
  evaluators: string[];
  notes?: string;
}

export interface SubCriteria {
  id: string;
  name: string;
  nameAr: string;
  weight: number;
  scoringGuidelines: string;
  examples?: string;
}

export interface ApprovalLevel {
  level: number;
  name: string;
  approvers: string[];
  requiredApprovals: number;
  autoApprovalConditions?: string;
  timeoutDays: number;
  escalationRules: string[];
}

export interface ApprovalHistory {
  id: string;
  level: number;
  action: 'approved' | 'rejected' | 'returned' | 'escalated';
  approver: string;
  timestamp: string;
  comments?: string;
  attachments?: string[];
}

export interface RiskFactor {
  id: string;
  type: 'financial' | 'technical' | 'schedule' | 'regulatory' | 'supplier' | 'market';
  description: string;
  probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  impact: 'negligible' | 'minor' | 'moderate' | 'major' | 'severe';
  riskScore: number;
  mitigationPlan: string;
  owner: string;
  status: 'identified' | 'assessed' | 'mitigated' | 'closed';
  lastReviewed: string;
}

export interface ClarificationRequest {
  id: string;
  supplierId: string;
  supplierName: string;
  question: string;
  category: 'technical' | 'commercial' | 'procedural' | 'other';
  submittedAt: string;
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  isPublic: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'answered' | 'escalated';
}

export interface RFQClarification {
  id: string;
  type: 'general' | 'technical' | 'commercial';
  question: string;
  questionAr?: string;
  answer: string;
  answerAr?: string;
  publishedAt: string;
  publishedBy: string;
  isPublic: boolean;
  relevantSection?: string;
}

export interface RFQAnnouncement {
  id: string;
  type: 'general' | 'deadline_extension' | 'clarification' | 'amendment' | 'cancellation';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  publishedAt: string;
  publishedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipients: 'all' | 'registered' | 'specific';
  specificRecipients?: string[];
  acknowledgmentRequired: boolean;
  acknowledgments?: Record<string, string>;
}

export interface RFQMeeting {
  id: string;
  type: 'pre_bid' | 'clarification' | 'site_visit' | 'presentation' | 'negotiation';
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizer: string;
  attendees: string[];
  agenda: string[];
  minutes?: string;
  recordings?: string[];
  followUpActions?: string[];
}

export interface QualityCheck {
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  reviewer: string;
  reviewDate?: string;
  score?: number;
  findings: string[];
  recommendations: string[];
  approved: boolean;
  comments?: string;
  attachments?: string[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// RFQ Response/Quote Models
export interface AdminQuote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierInfo: {
    name: string;
    nameAr: string;
    email: string;
    phone: string;
    location: string;
    verificationLevel: 'unverified' | 'basic' | 'enhanced' | 'premium';
    rating: number;
    certifications: string[];
  };
  
  // Commercial Details
  commercial: {
    totalAmount: number;
    currency: 'SAR' | 'USD' | 'EUR';
    breakdown: LineItem[];
    taxes: TaxBreakdown[];
    discounts: Discount[];
    validityPeriod: number;
    paymentTerms: string;
    deliveryTerms: string;
    warranties: Warranty[];
    penalties: Penalty[];
  };
  
  // Technical Response
  technical: {
    complianceMatrix: ComplianceMatrix[];
    technicalDeviations: TechnicalDeviation[];
    alternativeProposals: AlternativeProposal[];
    certifications: CertificationDocument[];
    samples: SampleDocument[];
    references: ProjectReference[];
  };
  
  // Delivery and Implementation
  implementation: {
    deliverySchedule: DeliveryMilestone[];
    implementationPlan: string;
    resourceAllocation: ResourceAllocation[];
    riskMitigation: string;
    qualityAssurance: string;
    afterSalesSupport: string;
  };
  
  // Evaluation Results
  evaluation: {
    technicalScore: number;
    commercialScore: number;
    complianceScore: number;
    overallScore: number;
    ranking: number;
    evaluatedBy: string[];
    evaluationDate: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string;
    status: 'pending' | 'evaluating' | 'clarification_needed' | 'accepted' | 'rejected' | 'shortlisted';
  };
  
  // Communication
  communication: {
    clarificationRequests: QuoteClarification[];
    negotiations: NegotiationRound[];
    presentations: Presentation[];
  };
  
  // Documents
  documents: QuoteDocument[];
  
  // Timestamps
  timestamps: {
    submittedAt: string;
    lastModified: string;
    evaluationStarted?: string;
    evaluationCompleted?: string;
    clarificationDeadline?: string;
    negotiationStarted?: string;
    finalDecisionDate?: string;
  };
  
  // Legal and Compliance
  legal: {
    contractualConditions: string[];
    liabilityTerms: string;
    intellectualProperty: string;
    confidentialityAgreement: boolean;
    disputeResolution: string;
    governingLaw: string;
  };
  
  // Financial Analysis
  financial: {
    costAnalysis: CostAnalysis;
    financialStability: FinancialAssessment;
    bankGuarantees: BankGuarantee[];
    insuranceCoverage: InsuranceCoverage[];
  };
}

export interface LineItem {
  id: string;
  description: string;
  descriptionAr?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  specifications: string;
  deliveryDate: string;
  notes?: string;
}

export interface TaxBreakdown {
  type: 'VAT' | 'customs_duty' | 'excise_tax' | 'other';
  name: string;
  rate: number;
  amount: number;
  taxableAmount: number;
  exemption?: string;
}

export interface Discount {
  type: 'volume' | 'early_payment' | 'loyalty' | 'promotional' | 'other';
  description: string;
  value: number;
  valueType: 'percentage' | 'fixed';
  conditions: string;
}

export interface Warranty {
  type: 'manufacturer' | 'extended' | 'performance' | 'other';
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  coverage: string;
  conditions: string;
  cost?: number;
}

export interface Penalty {
  type: 'delay' | 'performance' | 'quality' | 'other';
  description: string;
  value: number;
  valueType: 'percentage' | 'fixed' | 'daily';
  conditions: string;
  maximum?: number;
}

export interface ComplianceMatrix {
  requirementId: string;
  requirement: string;
  response: 'compliant' | 'non_compliant' | 'partial' | 'alternative';
  explanation: string;
  supportingDocuments: string[];
  deviationJustification?: string;
}

export interface TechnicalDeviation {
  section: string;
  originalRequirement: string;
  proposedAlternative: string;
  justification: string;
  impact: 'none' | 'minor' | 'moderate' | 'major';
  costImplication?: number;
  timeImplication?: number;
}

export interface AlternativeProposal {
  title: string;
  description: string;
  benefits: string[];
  costComparison: number;
  implementationTime: number;
  riskAssessment: string;
  recommendationLevel: 'highly_recommended' | 'recommended' | 'optional' | 'not_recommended';
}

export interface CertificationDocument {
  name: string;
  issuingAuthority: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  documentUrl: string;
  verificationStatus: 'pending' | 'verified' | 'expired' | 'invalid';
}

export interface SampleDocument {
  name: string;
  description: string;
  specifications: string;
  testResults?: string;
  certificationRef?: string;
  documentUrl: string;
  submissionDate: string;
}

export interface ProjectReference {
  projectName: string;
  client: string;
  value: number;
  duration: string;
  completionDate: string;
  scope: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  performanceRating?: number;
  certificateUrl?: string;
}

export interface DeliveryMilestone {
  milestone: string;
  description: string;
  deliverables: string[];
  plannedDate: string;
  dependencies: string[];
  riskFactors: string[];
}

export interface ResourceAllocation {
  resourceType: 'personnel' | 'equipment' | 'material' | 'subcontractor';
  description: string;
  quantity: number;
  duration: string;
  cost: number;
  availability: string;
}

export interface QuoteClarification {
  id: string;
  question: string;
  askedBy: string;
  askedAt: string;
  response?: string;
  respondedAt?: string;
  category: 'technical' | 'commercial' | 'legal' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'answered' | 'escalated';
}

export interface NegotiationRound {
  round: number;
  initiatedBy: string;
  initiatedAt: string;
  topics: string[];
  proposals: string[];
  agreements: string[];
  nextSteps: string[];
  status: 'ongoing' | 'paused' | 'completed' | 'failed';
}

export interface Presentation {
  title: string;
  scheduledAt: string;
  duration: number;
  agenda: string[];
  attendees: string[];
  presentationUrl?: string;
  evaluationScores?: Record<string, number>;
  feedback: string[];
}

export interface QuoteDocument {
  id: string;
  name: string;
  type: 'commercial_proposal' | 'technical_proposal' | 'certificate' | 'reference' | 'sample' | 'other';
  category: 'mandatory' | 'supporting' | 'additional';
  url: string;
  size: number;
  uploadedAt: string;
  description?: string;
  version: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'needs_revision';
  reviewComments?: string;
}

export interface CostAnalysis {
  totalCost: number;
  directCosts: number;
  indirectCosts: number;
  contingency: number;
  profitMargin: number;
  competitiveness: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  benchmarkComparison: number;
  valueForMoney: number;
  costBreakdownAccuracy: 'high' | 'medium' | 'low';
}

export interface FinancialAssessment {
  creditRating: string;
  financialStrength: 'excellent' | 'good' | 'fair' | 'poor' | 'concerning';
  liquidityRatio: number;
  debtToEquityRatio: number;
  profitability: number;
  revenueGrowth: number;
  assessmentDate: string;
  assessedBy: string;
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
}

export interface BankGuarantee {
  type: 'bid_bond' | 'performance_bond' | 'advance_payment' | 'retention' | 'warranty';
  amount: number;
  currency: string;
  validityPeriod: number;
  issuingBank: string;
  guaranteeNumber: string;
  conditions: string[];
  documentUrl: string;
  status: 'draft' | 'issued' | 'validated' | 'expired' | 'claimed';
}

export interface InsuranceCoverage {
  type: 'general_liability' | 'professional_indemnity' | 'product_liability' | 'equipment' | 'other';
  provider: string;
  policyNumber: string;
  coverage: number;
  deductible: number;
  validFrom: string;
  validTo: string;
  scope: string;
  documentUrl: string;
}

// Supplier Management Models
export interface AdminSupplier {
  id: string;
  basicInfo: {
    name: string;
    nameAr: string;
    legalName: string;
    tradingName?: string;
    registrationNumber: string;
    taxNumber: string;
    establishmentDate: string;
    businessType: 'individual' | 'partnership' | 'llc' | 'corporation' | 'government' | 'ngo';
    countryOfOrigin: string;
    headquarters: string;
  };
  
  contactInfo: {
    primaryContact: ContactPerson;
    secondaryContact?: ContactPerson;
    addresses: Address[];
    phone: string;
    mobile?: string;
    email: string;
    website?: string;
    socialMedia?: Record<string, string>;
  };
  
  businessProfile: {
    industry: string[];
    specializations: string[];
    products: string[];
    services: string[];
    capabilities: string[];
    certifications: SupplierCertification[];
    experience: number;
    employeeCount: number;
    annualRevenue?: number;
    markets: string[];
  };
  
  verification: {
    status: 'unverified' | 'pending' | 'basic' | 'enhanced' | 'premium' | 'suspended' | 'blacklisted';
    level: number;
    verifiedBy: string;
    verificationDate: string;
    expiryDate?: string;
    documents: VerificationDocument[];
    notes: string;
    lastAuditDate?: string;
    nextAuditDue?: string;
  };
  
  performance: {
    rating: number;
    totalRFQs: number;
    respondedRFQs: number;
    wonRFQs: number;
    completedProjects: number;
    averageResponseTime: number;
    qualityScore: number;
    deliveryScore: number;
    complianceScore: number;
    customerSatisfaction: number;
    penalties: number;
    disputes: number;
  };
  
  financial: {
    creditRating?: string;
    paymentTerms: string;
    currency: string[];
    bankDetails: BankAccount[];
    financialStatements: FinancialStatement[];
    insurancePolicies: InsurancePolicy[];
    bonds: BondCapacity[];
  };
  
  compliance: {
    regulatoryStatus: 'compliant' | 'partial' | 'non_compliant' | 'under_review';
    licenses: License[];
    permits: Permit[];
    accreditations: Accreditation[];
    auditReports: AuditReport[];
    riskAssessment: SupplierRiskAssessment;
  };
  
  preferences: {
    communicationLanguage: 'en' | 'ar' | 'both';
    timezone: string;
    preferredContactMethod: 'email' | 'phone' | 'portal' | 'meeting';
    workingHours: string;
    holidays: string[];
    escalationContacts: ContactPerson[];
  };
  
  relationships: {
    accountManager: string;
    category: 'strategic' | 'preferred' | 'approved' | 'conditional' | 'restricted';
    contracts: ActiveContract[];
    frameworkAgreements: FrameworkAgreement[];
    partnerships: Partnership[];
    subsidiaries: string[];
    parentCompany?: string;
  };
  
  systemInfo: {
    registrationDate: string;
    lastLogin?: string;
    portalAccess: boolean;
    apiAccess: boolean;
    integrations: SystemIntegration[];
    supportTickets: number;
    trainingCompleted: string[];
  };
}

export interface ContactPerson {
  name: string;
  title: string;
  email: string;
  phone: string;
  mobile?: string;
  department: string;
  role: 'primary' | 'technical' | 'commercial' | 'legal' | 'support' | 'emergency';
  languages: string[];
  availability: string;
}

export interface Address {
  type: 'headquarters' | 'billing' | 'shipping' | 'branch' | 'warehouse' | 'service_center';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SupplierCertification {
  name: string;
  issuingBody: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  level?: string;
  documentUrl: string;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface VerificationDocument {
  type: 'commercial_registration' | 'tax_certificate' | 'bank_statement' | 'audit_report' | 'insurance' | 'license' | 'other';
  name: string;
  documentNumber?: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  documentUrl: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountType: 'current' | 'savings' | 'foreign_currency';
  currency: string;
  swiftCode?: string;
  iban?: string;
  branchCode?: string;
  isPrimary: boolean;
  status: 'active' | 'inactive' | 'frozen';
}

export interface FinancialStatement {
  year: number;
  type: 'annual' | 'quarterly' | 'interim';
  currency: string;
  revenue: number;
  profit: number;
  assets: number;
  liabilities: number;
  equity: number;
  documentUrl: string;
  audited: boolean;
  auditorName?: string;
  submissionDate: string;
}

export interface InsurancePolicy {
  type: 'general_liability' | 'professional_indemnity' | 'product_liability' | 'equipment' | 'workers_compensation' | 'other';
  provider: string;
  policyNumber: string;
  coverage: number;
  deductible: number;
  validFrom: string;
  validTo: string;
  scope: string;
  documentUrl: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface BondCapacity {
  type: 'performance' | 'advance_payment' | 'bid' | 'retention' | 'warranty';
  provider: string;
  maxAmount: number;
  currency: string;
  validUntil: string;
  termsAndConditions: string;
  documentUrl: string;
  utilisedAmount: number;
  availableAmount: number;
}

export interface License {
  name: string;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  restrictions?: string;
  documentUrl: string;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  renewalRequired: boolean;
}

export interface Permit {
  name: string;
  permitNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  conditions?: string;
  documentUrl: string;
  status: 'active' | 'expired' | 'pending_renewal';
}

export interface Accreditation {
  name: string;
  accreditingBody: string;
  accreditationNumber: string;
  issueDate: string;
  expiryDate: string;
  scope: string;
  level: string;
  documentUrl: string;
  status: 'active' | 'expired' | 'suspended';
}

export interface AuditReport {
  type: 'financial' | 'quality' | 'compliance' | 'security' | 'operational';
  auditor: string;
  auditDate: string;
  scope: string;
  findings: string[];
  recommendations: string[];
  score?: number;
  status: 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  documentUrl: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface SupplierRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  financialRisk: 'low' | 'medium' | 'high';
  operationalRisk: 'low' | 'medium' | 'high';
  complianceRisk: 'low' | 'medium' | 'high';
  reputationalRisk: 'low' | 'medium' | 'high';
  geopoliticalRisk: 'low' | 'medium' | 'high';
  assessmentDate: string;
  assessedBy: string;
  nextReviewDate: string;
  mitigationStrategies: string[];
  riskFactors: string[];
  notes: string;
}

export interface ActiveContract {
  contractNumber: string;
  title: string;
  type: 'supply' | 'service' | 'framework' | 'maintenance' | 'consultancy';
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'terminated' | 'suspended';
  performanceRating?: number;
  renewalOption: boolean;
  nextReviewDate?: string;
}

export interface FrameworkAgreement {
  agreementNumber: string;
  title: string;
  category: string;
  value: number;
  currency: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'terminated';
  utilisedValue: number;
  callOffOrders: number;
  performanceKPIs: Record<string, number>;
}

export interface Partnership {
  type: 'strategic' | 'preferred' | 'joint_venture' | 'consortium' | 'distributor';
  partnershipName: string;
  startDate: string;
  endDate?: string;
  scope: string;
  benefits: string[];
  obligations: string[];
  status: 'active' | 'inactive' | 'terminated';
  renewalDate?: string;
}

export interface SystemIntegration {
  systemName: string;
  integrationType: 'api' | 'file_transfer' | 'portal' | 'manual';
  status: 'active' | 'inactive' | 'pending' | 'error';
  lastSync?: string;
  dataTypes: string[];
  frequency: string;
  contactPerson: string;
}

// Analytics and Reporting Models
export interface RFQAnalytics {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  
  overview: {
    totalRFQs: number;
    activeRFQs: number;
    completedRFQs: number;
    cancelledRFQs: number;
    totalValue: number;
    averageValue: number;
    savingsAchieved: number;
    processingTime: number;
  };
  
  performance: {
    responseRates: Record<string, number>;
    competitionLevels: Record<string, number>;
    successRates: Record<string, number>;
    timeToAward: Record<string, number>;
    costSavings: Record<string, number>;
    qualityScores: Record<string, number>;
  };
  
  suppliers: {
    totalSuppliers: number;
    activeSuppliers: number;
    newSuppliers: number;
    topPerformers: TopSupplier[];
    categoryDistribution: Record<string, number>;
    geographicDistribution: Record<string, number>;
  };
  
  categories: {
    mostActive: CategoryMetrics[];
    highestValue: CategoryMetrics[];
    bestPerformance: CategoryMetrics[];
    riskLevels: Record<string, number>;
  };
  
  trends: {
    volumeTrend: TrendData[];
    valueTrend: TrendData[];
    participationTrend: TrendData[];
    performanceTrend: TrendData[];
  };
  
  risks: {
    identifiedRisks: number;
    mitigatedRisks: number;
    activeRisks: number;
    riskDistribution: Record<string, number>;
    topRisks: RiskMetric[];
  };
}

export interface TopSupplier {
  id: string;
  name: string;
  participationRate: number;
  winRate: number;
  averageScore: number;
  totalValue: number;
  responseTime: number;
}

export interface CategoryMetrics {
  category: string;
  count: number;
  value: number;
  averageParticipation: number;
  averageScore: number;
  riskLevel: string;
}

export interface TrendData {
  period: string;
  value: number;
  change: number;
  changePercentage: number;
}

export interface RiskMetric {
  type: string;
  count: number;
  impact: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Integration Models
export interface ERPIntegration {
  systemName: string;
  version: string;
  connectionType: 'real_time' | 'batch' | 'manual';
  dataMapping: Record<string, string>;
  lastSync: string;
  syncStatus: 'success' | 'failed' | 'partial' | 'in_progress';
  errorLog: string[];
  configurations: Record<string, any>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: string;
  type: 'rfq' | 'rfp' | 'tender' | 'framework';
  steps: WorkflowStep[];
  approvalLevels: ApprovalLevel[];
  documents: TemplateDocument[];
  estimatedDuration: number;
  complexity: 'simple' | 'moderate' | 'complex';
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  isActive: boolean;
}

export interface WorkflowStep {
  stepNumber: number;
  name: string;
  nameAr: string;
  description: string;
  type: 'manual' | 'automated' | 'approval' | 'review';
  estimatedDuration: number;
  dependencies: number[];
  assignees: string[];
  deliverables: string[];
  criteria: string[];
  isOptional: boolean;
}

export interface TemplateDocument {
  name: string;
  nameAr: string;
  type: string;
  isRequired: boolean;
  templateUrl: string;
  instructions: string;
  validationRules: string[];
}

// Notification and Communication Models
export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'portal' | 'webhook';
  event: 'rfq_published' | 'deadline_approaching' | 'clarification_requested' | 'award_notification' | 'status_change';
  subject: string;
  subjectAr: string;
  content: string;
  contentAr: string;
  recipients: 'suppliers' | 'internal' | 'specific';
  timing: 'immediate' | 'scheduled' | 'batch';
  frequency: 'once' | 'reminder' | 'digest';
  isActive: boolean;
  variables: string[];
  attachments: string[];
}

export interface CommunicationLog {
  id: string;
  rfqId?: string;
  supplierId?: string;
  type: 'email' | 'sms' | 'portal_message' | 'meeting' | 'phone_call';
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  attachments: string[];
  sender: string;
  recipients: string[];
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'informational' | 'clarification' | 'negotiation' | 'legal' | 'technical';
  followUpRequired: boolean;
  followUpDate?: string;
  relatedMessages: string[];
}

// Additional utility types
export type RFQStatus = AdminRFQ['status'];
export type RFQType = AdminRFQ['type'];
export type Priority = AdminRFQ['priority'];
export type VerificationStatus = AdminSupplier['verification']['status'];
export type QuoteStatus = AdminQuote['evaluation']['status'];
export type DocumentType = RFQDocument['type'];
export type EvaluationMethod = AdminRFQ['evaluation']['methodology'];
export type RiskLevel = AdminRFQ['riskAssessment']['level'];
export type CommunicationType = CommunicationLog['type'];
export type ApprovalStage = AdminRFQ['approval']['currentStage'];