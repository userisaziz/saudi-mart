### **Agent 1: Saudi B2B Platform Foundation**

**Prompt Template:**
```
Create a React + Vite project for a Saudi Arabia B2B marketplace admin panel similar to IndiaMART.

SAUDI MARKET REQUIREMENTS:
- Arabic (RTL) and English (LTR) language support
- Saudi business compliance features (CR, VAT, SASO)
- Vision 2030 alignment tracking
- Saudi regions and cities integration
- Hijri and Gregorian calendar support
- SAR currency formatting
- Mobile-first design for Saudi market

PROJECT STRUCTURE:
- /shared: RTL-compatible components, Arabic i18n, Saudi utilities
- /admin: Platform management with Saudi compliance features
- /seller: Business management with local market tools
- /compliance: Saudi regulatory compliance module

SAUDI-SPECIFIC DEPENDENCIES:
- react-i18next for Arabic/English
- react-dates with Hijri calendar
- react-window for performance (Arabic text)
- @formatjs/intl for Arabic number formatting

TECHNICAL REQUIREMENTS:
- RTL CSS framework setup
- Arabic font integration (Amiri, Cairo, IBM Plex Arabic)
- Saudi phone number validation (+966)
- Commercial Registration (CR) number validation
- VAT number validation for Saudi Arabia
- SASO quality standards integration

Set up the foundation with proper RTL/LTR switching and Saudi market configurations.
```

### **Agent 2: RTL-Compatible UI Component Library**

**Prompt Template:**
```
Build an RTL-compatible UI component library for Saudi B2B marketplace.

RTL COMPONENTS TO CREATE:
1. Layout Components:
   - RTL Header with Arabic navigation
   - Collapsible RTL sidebar with Arabic menu
   - Breadcrumb navigation (Arabic/English)
   - Page layouts with RTL/LTR switching

2. Form Components:
   - RTL input fields with Arabic placeholder support
   - Arabic-English toggle inputs
   - Saudi phone number input (+966 format)
   - CR number input with validation
   - VAT number input for Saudi Arabia
   - Hijri/Gregorian date pickers

3. Data Components:
   - RTL data tables with Arabic headers
   - Arabic number formatting (Eastern Arabic numerals option)
   - Currency display (SAR formatting)
   - Regional charts (Saudi provinces/cities)

4. Business Components:
   - Saudi business profile cards
   - Compliance status indicators
   - Vision 2030 alignment trackers
   - Quality certification badges (SASO, Halal)

DESIGN REQUIREMENTS:
- Saudi national colors (green/white) with modern palette
- Arabic typography (Amiri for headers, IBM Plex Arabic for body)
- RTL-optimized spacing and alignment
- Mobile-first responsive design
- High contrast for accessibility
- Islamic cultural sensitivity in imagery

Make all components work seamlessly in both Arabic RTL and English LTR modes.
```

### **Agent 3: Admin Dashboard for Saudi Market**

**Prompt Template:**
```
Create admin dashboard for Saudi B2B marketplace with local market focus.

SAUDI ADMIN FEATURES:

1. Market Overview Dashboard:
   - Vision 2030 sector performance metrics
   - Saudi business registration statistics
   - Regional distribution analytics (13 provinces)
   - Compliance status tracking (CR, VAT, SASO)
   - Hajj/Umrah seasonal business trends

2. Business Management:
   - Saudi business verification (CR validation)
   - VAT registration compliance
   - SASO quality standards tracking
   - Halal certification verification
   - Nitaqat (Saudization) compliance monitoring

3. User Management:
   - Saudi national (ID) vs Expat (Iqama) classification
   - Arabic/English profile management
   - Regional user distribution
   - Business sector categorization
   - Compliance status tracking

4. Product Oversight:
   - SASO compliance verification
   - Halal certification approval
   - Arabic product name validation
   - Price monitoring (SAR)
   - Quality standards enforcement

5. Regional Analytics:
   - Province-wise business performance
   - City-level market penetration
   - Sector distribution by region
   - Seasonal trends (Ramadan, Hajj impacts)
   - Vision 2030 goal tracking

6. Compliance Center:
   - Regulatory requirement tracking
   - Document verification queue
   - Audit trail management
   - Violation reporting system
   - Compliance score dashboard

SAUDI BUSINESS CATEGORIES:
- Energy & Oil Services
- Construction & Real Estate  
- Food & Beverages (Halal focus)
- Healthcare & Medical Equipment
- Technology & Digital Services
- Manufacturing & Industrial
- Transportation & Logistics
- Tourism & Hospitality (Vision 2030)

Include Arabic language support throughout and Saudi-specific business intelligence.
```

### **Agent 4: Seller Dashboard for Saudi Businesses**

**Prompt Template:**
```
Create seller dashboard for Saudi businesses on B2B marketplace.

SAUDI SELLER FEATURES:

1. Business Profile Management:
   - Commercial Registration (CR) integration
   - VAT registration display
   - Saudi bank account verification
   - Address verification (Saudi postal system)
   - Business license upload and tracking
   - Arabic/English business description

2. Product & Service Management:
   - Arabic product catalog management
   - Halal certification tracking
   - SASO compliance status
   - SAR pricing management
   - Inventory tracking with Arabic labels
   - Multi-language product descriptions

3. Saudi Market Analytics:
   - Regional sales performance (13 provinces)
   - Seasonal business trends (Ramadan, Hajj)
   - Customer demographics (Saudi nationals vs expats)
   - Competition analysis in Saudi market
   - Vision 2030 opportunity identification
   - Market demand forecasting

4. Customer Relationship Management:
   - Arabic/English communication templates
   - Saudi cultural communication guidelines
   - Regional customer preferences
   - Business hours management (Prayer times consideration)
   - Holiday calendar integration (Islamic holidays)
   - Follow-up scheduling with cultural sensitivity

5. Business Growth Tools:
   - Vision 2030 sector alignment checker
   - Government tender opportunity alerts
   - Export opportunity identification
   - Business networking within Saudi ecosystem
   - Compliance improvement recommendations
   - Market expansion planning tools

6. Financial Management:
   - SAR revenue tracking and forecasting
   - VAT calculation and reporting
   - Zakat calculation assistance
   - Payment terms management
   - Credit facility integration (Islamic banking)
   - Financial performance analytics

CULTURAL CONSIDERATIONS:
- Prayer time scheduling integration
- Islamic holiday calendar
- Halal business practices
- Gender segregation requirements (where applicable)
- Cultural sensitivity in communication
- Arabic business etiquette guidelines

Ensure all features support both Arabic and English languages with proper RTL layout.
```

### **Agent 5: Saudi Compliance & Verification System**

**Prompt Template:**
```
Build comprehensive compliance and verification system for Saudi regulatory requirements.

SAUDI COMPLIANCE FEATURES:

1. Commercial Registration (CR) System:
   - CR number format validation (10 digits)
   - Ministry of Commerce integration
   - Business activity verification
   - Company name Arabic/English validation
   - Legal entity type classification
   - Renewal date tracking and alerts

2. VAT & Zakat Compliance:
   - VAT registration number validation (15 digits)
   - Zakat, Tax and Customs Authority (ZATCA) integration
   - VAT rate calculation by product category
   - E-invoicing compliance (ZATCA Phase 2)
   - Tax exemption status verification
   - Quarterly return filing reminders

3. Quality Standards (SASO):
   - Product compliance verification
   - Technical regulation compliance
   - Certificate of conformity tracking
   - Quality mark authorization
   - Import/export requirement validation
   - Safety standard compliance

4. Halal Certification:
   - Halal certificate verification
   - Islamic organization approval tracking
   - Product ingredient compliance
   - Supply chain Halal verification
   - Certificate renewal management
   - Halal logo usage compliance

5. Document Verification:
   - Arabic OCR for document scanning
   - Signature verification (Arabic/English)
   - Document authenticity checking
   - Multi-language document support
   - Automated compliance scoring
   - Risk assessment algorithms

6. Business License Verification:
   - Municipality license verification
   - Professional license validation
   - Industry-specific permits
   - Environmental compliance certificates
   - Health department approvals
   - Fire safety certificates

VERIFICATION WORKFLOWS:
- Automated initial screening
- Manual review for complex cases
- Expert verification for specialized industries
- Appeals and correction process
- Compliance status communication
- Audit trail maintenance

INTEGRATION REQUIREMENTS:
- Government API integrations where available
- Third-party verification services
- Document management systems
- Notification systems (Arabic/English)
- Reporting and analytics tools
- Mobile verification capabilities

Build system with high accuracy and cultural sensitivity for Saudi business environment.
```

### **Agent 6: Arabic RTL & Internationalization**

**Prompt Template:**
```
Implement comprehensive Arabic RTL and internationalization system for Saudi B2B platform.

LANGUAGE & RTL REQUIREMENTS:

1. RTL Layout Management:
   - Dynamic RTL/LTR switching
   - Mirrored layout components
   - RTL-aware animations and transitions
   - Icon and image flipping for RTL
   - Sidebar and navigation RTL adaptation
   - Form field alignment in RTL

2. Arabic Typography:
   - Arabic font integration (Amiri, Cairo, IBM Plex Arabic)
   - Proper Arabic text rendering
   - Arabic letter shaping and joining
   - Diacritical marks support
   - Arabic numerals vs Hindu-Arabic numerals
   - Text direction handling in mixed content

3. Translation Management:
   - Arabic translations for all UI elements
   - Business terminology in Arabic
   - Saudi-specific Arabic dialect considerations
   - Professional translation quality
   - Context-aware translations
   - Pluralization rules for Arabic

4. Cultural Adaptations:
   - Islamic calendar integration (Hijri dates)
   - Prayer times consideration
   - Islamic holiday calendar
   - Cultural color preferences
   - Gender-appropriate imagery
   - Business etiquette considerations

5. Input Handling:
   - Arabic keyboard layout support
   - Mixed Arabic/English input validation
   - Arabic text search and filtering
   - Arabic autocomplete functionality
   - Voice input in Arabic (future enhancement)
   - Arabic text-to-speech (accessibility)

6. Data Formatting:
   - Arabic number formatting
   - SAR currency formatting (Arabic)
   - Date formatting (Hijri/Gregorian)
   - Address formatting (Saudi postal system)
   - Phone number formatting (+966)
   - Arabic name formatting conventions

TECHNICAL IMPLEMENTATION:
- React i18n with Arabic support
- CSS logical properties for RTL
- Arabic text segmentation
- Bidirectional text handling
- Font loading optimization for Arabic
- Performance considerations for RTL rendering

QUALITY ASSURANCE:
- Arabic translation review process
- Cultural sensitivity review
- RTL layout testing
- Cross-browser Arabic rendering
- Mobile Arabic experience testing
- Accessibility testing for Arabic content

Ensure professional-quality Arabic experience that matches international B2B standards.
```

### **Agent 7: Saudi Business Intelligence & Analytics**

**Prompt Template:**
```
Create business intelligence and analytics system focused on Saudi market insights.

SAUDI MARKET ANALYTICS:

1. Regional Performance Analytics:
   - 13 provinces performance comparison
   - Major cities business concentration
   - Regional economic indicators
   - Cross-regional trade patterns
   - Geographic market penetration
   - Regional growth opportunities

2. Sector-Specific Analytics:
   - Vision 2030 priority sectors tracking
   - Oil vs non-oil sector performance
   - Manufacturing sector growth
   - Services sector expansion
   - Tourism and entertainment growth
   - Technology sector development

3. Seasonal Business Intelligence:
   - Ramadan business impact analysis
   - Hajj and Umrah seasonal trends
   - Summer vacation patterns
   - National Day celebrations impact
   - Islamic holiday business effects
   - Yearly business cycles

4. Vision 2030 Alignment Tracking:
   - Sector diversification progress
   - SME development metrics
   - Women's economic participation
   - Youth employment tracking
   - Digital transformation progress
   - Sustainability goals achievement

5. Competitive Intelligence:
   - Market share analysis
   - Competitor positioning maps
   - Pricing trend analysis
   - Service offering comparisons
   - Customer satisfaction benchmarks
   - Innovation index tracking

6. Customer Behavior Analytics:
   - Saudi vs expat customer patterns
   - Age demographic preferences
   - Regional buying behaviors
   - Mobile vs desktop usage
   - Arabic vs English interface usage
   - Cultural preference patterns

VISUALIZATION FEATURES:
- Interactive Saudi Arabia map
- Arabic-labeled charts and graphs
- RTL-compatible dashboards
- Mobile-responsive analytics
- Printable reports in Arabic/English
- Export functionality for presentations

PREDICTION MODELS:
- Market demand forecasting
- Seasonal trend predictions
- Economic indicator correlations
- Business growth projections
- Risk assessment models
- Opportunity identification algorithms

Include cultural context and Saudi-specific business intelligence for strategic decision making.
```

### **Agent 8: Saudi Mobile Experience & Performance**

**Prompt Template:**
```
Create optimized mobile experience for Saudi B2B marketplace with performance focus.

SAUDI MOBILE REQUIREMENTS:

1. Mobile-First Arabic RTL Design:
   - Touch-optimized RTL interface
   - Arabic text readability on mobile
   - Thumb-friendly navigation for Arabic users
   - Mobile Arabic keyboard optimization
   -# CRM Frontend Development Documentation
## Claude Code Integration Guide for Role-Based Architecture

---

## **📁 Project Structure Documentation**

### **Clean Architecture Principles**
```
- Separate admin and seller modules completely
- Shared components for common functionality
- Role-based routing and authentication
- Modular service layer for API interactions
- Consistent naming conventions throughout
```

### **Folder Organization Pattern**
```
/src
  /shared (Common components, hooks, services)
  /admin (Admin-specific features and pages)
  /seller (Seller-specific features and pages)
  /auth (Authentication components)
  /assets (Static files and styles)
```

---

## **🎯 Claude Code Agent Instructions**

### **Agent 1: Project Setup & Structure**

**Prompt Template:**
```
Create a React + Vite project structure for a B2B CRM dashboard with role-based architecture.

REQUIREMENTS:
- Separate folders for admin and seller roles
- Shared components for common UI elements
- Clean folder structure following React best practices
- TypeScript support (optional)
- Tailwind CSS for styling
- React Router for navigation
- State management with Zustand/Redux

PROJECT STRUCTURE:
- /shared: Common components, hooks, utilities, services
- /admin: Admin dashboard components, pages, services
- /seller: Seller dashboard components, pages, services
- /auth: Authentication components and guards

DEPENDENCIES NEEDED:
- React Router DOM
- Tailwind CSS
- Heroicons for icons
- Recharts for charts
- React Hook Form for forms
- Axios for API calls

Set up the basic project structure with proper folder organization and initial configuration files.
```

### **Agent 2: Shared Component Library**

**Prompt Template:**
```
Build a shared component library for the CRM dashboard with these base components:

COMPONENTS TO CREATE:
1. Layout Components:
   - Header with user info and notifications
   - Sidebar with navigation (collapsible)
   - Main content wrapper
   - Page container with breadcrumbs

2. UI Components:
   - Button (primary, secondary, danger variants)
   - Input fields (text, email, password, select, textarea)
   - Modal dialog with backdrop
   - Data table with sorting and pagination
   - Cards for dashboard widgets
   - Loading spinner and skeleton components

3. Form Components:
   - Form wrapper with validation
   - Form fields with error handling
   - Submit button with loading states
   - File upload component

DESIGN REQUIREMENTS:
- Use Tailwind CSS for styling
- Responsive design (mobile-first)
- Accessible components (ARIA labels)
- Consistent spacing and typography
- Professional color scheme (blues/grays)
- Hover and focus states
- Loading and error states

Make components reusable with proper prop interfaces and default values.
```

### **Agent 3: Admin Dashboard Module**

**Prompt Template:**
```
Create the admin dashboard module for B2B CRM platform management.

ADMIN FEATURES TO BUILD:

1. Dashboard Overview:
   - Metrics cards (total users, products, revenue)
   - Charts for user growth and revenue trends
   - Recent activity feed
   - Quick action buttons

2. User Management:
   - User list with search and filters
   - User creation form
   - User edit/delete functionality
   - Role assignment interface
   - User status management (active/inactive)

3. Product Management:
   - Product verification queue
   - Product approval/rejection workflow
   - Bulk product actions
   - Product category assignment
   - Product quality scoring

4. Category Management:
   - Category hierarchy tree view
   - Category CRUD operations
   - Category verification system
   - Category performance metrics

5. Seller Verification:
   - Document verification interface
   - Business verification workflow
   - KYC document review
   - Verification status tracking
   - Bulk verification actions

6. Analytics & Insights:
   - Lead generation reports
   - Conversion analytics
   - Revenue insights
   - Platform performance metrics
   - Export functionality

NAVIGATION STRUCTURE:
Use the admin sidebar structure with proper routing and page components for each feature.

PERMISSIONS:
Implement role-based access control for different admin functions.
```

### **Agent 4: Seller Dashboard Module**

**Prompt Template:**
```
Create the seller dashboard module for business management functionality.

SELLER FEATURES TO BUILD:

1. Business Dashboard:
   - Sales metrics and performance
   - Enquiry statistics
   - Revenue charts
   - Today's activity summary
   - Quick actions panel

2. Product Management:
   - My products listing
   - Add/edit product forms
   - Product performance analytics
   - Inventory management
   - Product image gallery
   - Bulk product upload

3. Lead Management:
   - Enquiry inbox with status filters
   - Lead details and history
   - Follow-up tracking
   - Response templates
   - Conversion funnel
   - Lead scoring display

4. Business Profile:
   - Company information management
   - Business document uploads
   - Verification status display
   - Contact details management
   - Business hours configuration

5. Analytics Center:
   - Business growth metrics
   - Lead conversion analytics
   - Product performance insights
   - Market position data
   - Customer feedback summary

6. Communication Hub:
   - Message center
   - Enquiry responses
   - Follow-up scheduling
   - Communication templates

SELLER VERIFICATION INTEGRATION:
- Verification status display
- Document upload interface
- Verification progress tracking
- Requirements checklist

MOBILE OPTIMIZATION:
Ensure all seller features work well on mobile devices as sellers often use phones.
```

### **Agent 5: Authentication & Security**

**Prompt Template:**
```
Implement authentication system with role-based access control.

AUTHENTICATION FEATURES:

1. Login System:
   - Email/password login form
   - Role detection (admin/seller)
   - Remember me functionality
   - Login validation and error handling
   - Redirect based on user role

2. Role-Based Routing:
   - Protected routes for admin and seller
   - Route guards based on permissions
   - Automatic redirection for unauthorized access
   - Role-specific navigation rendering

3. Session Management:
   - JWT token handling
   - Auto-logout on token expiry
   - Refresh token implementation
   - Secure token storage

4. Security Features:
   - Password strength validation
   - Account lockout after failed attempts
   - Two-factor authentication (optional)
   - Session timeout warnings

ROUTE STRUCTURE:
- /login - Login page
- /admin/* - Admin routes (protected)
- /seller/* - Seller routes (protected)
- / - Default redirect based on role

PERMISSION SYSTEM:
Implement granular permissions for different admin and seller actions.
```

### **Agent 6: API Integration Layer**

**Prompt Template:**
```
Create API service layer for CRM backend integration.

API SERVICES TO BUILD:

1. Core Services:
   - Authentication service (login, logout, refresh)
   - User management service (CRUD operations)
   - Product service (CRUD, verification, analytics)
   - Category service (CRUD, hierarchy management)
   - Lead service (tracking, conversion, analytics)

2. Admin-Specific Services:
   - Seller verification service
   - Platform analytics service
   - Content moderation service
   - System administration service

3. Seller-Specific Services:
   - Business profile service
   - Product management service
   - Lead management service
   - Business analytics service

API CONFIGURATION:
- Base URL configuration
- Request/response interceptors
- Error handling middleware
- Loading state management
- Token attachment for authenticated requests

FEATURES REQUIRED:
- Automatic retry on network failures
- Request cancellation for pending requests
- Response caching for frequently accessed data
- File upload handling for documents/images
- Pagination support for large datasets
- Search and filter parameter handling

ERROR HANDLING:
- Network error handling
- Authentication error responses
- Validation error display
- Server error messaging
- Offline state management
```

### **Agent 7: State Management Setup**

**Prompt Template:**
```
Set up state management for the CRM application.

STATE MANAGEMENT REQUIREMENTS:

1. Authentication State:
   - User login status
   - User role and permissions
   - Token management
   - Session information

2. UI State:
   - Loading states for different operations
   - Error messages and notifications
   - Modal and dialog states
   - Sidebar collapse/expand state
   - Theme preferences (light/dark)

3. Data State:
   - User management data
   - Product catalog data
   - Category hierarchy
   - Lead and enquiry data
   - Analytics and metrics data

4. Form State:
   - Form validation states
   - Dirty form warnings
   - Form submission status
   - Multi-step form progress

IMPLEMENTATION APPROACH:
- Use Context API for authentication state
- Local state for component-specific data
- Custom hooks for data fetching and caching
- Form state management with React Hook Form

PERFORMANCE CONSIDERATIONS:
- Lazy loading for large datasets
- Memoization for expensive computations
- Virtual scrolling for long lists
- Image lazy loading and optimization
```

### **Agent 8: Responsive Design Implementation**

**Prompt Template:**
```
Implement responsive design for both admin and seller dashboards.

RESPONSIVE DESIGN REQUIREMENTS:

1. Breakpoint Strategy:
   - Mobile: 320px - 768px
   - Tablet: 768px - 1024px
   - Desktop: 1024px and above

2. Layout Adaptations:
   - Collapsible sidebar on mobile
   - Stacked navigation for small screens
   - Touch-friendly button sizes
   - Optimized data tables for mobile
   - Modal adjustments for small screens

3. Component Responsiveness:
   - Responsive grid layouts
   - Flexible card components
   - Adaptive form layouts
   - Mobile-optimized charts
   - Touch gestures for interactions

4. Performance Optimization:
   - Image optimization for different screen sizes
   - Lazy loading for mobile
   - Reduced animations on low-end devices
   - Progressive web app features

MOBILE-SPECIFIC FEATURES:
- Swipe gestures for navigation
- Pull-to-refresh functionality
- Offline capabilities
- Touch-optimized interactions
- Mobile-first form design

TESTING REQUIREMENTS:
- Cross-browser compatibility
- Device testing (iOS/Android)
- Performance testing on mobile networks
- Accessibility testing with screen readers
```

---

## **📋 Development Workflow**

### **Phase 1: Project Foundation**
1. Set up project structure with Agent 1
2. Create shared component library with Agent 2
3. Implement authentication system with Agent 5
4. Set up API integration layer with Agent 6

### **Phase 2: Core Features**
1. Build admin dashboard with Agent 3
2. Create seller dashboard with Agent 4
3. Implement state management with Agent 7
4. Add responsive design with Agent 8

### **Phase 3: Feature Enhancement**
1. Add advanced filtering and search
2. Implement real-time notifications
3. Create export/import functionality
4. Add bulk operations for data management

### **Phase 4: Testing & Optimization**
1. Performance testing and optimization
2. Security testing and hardening
3. User acceptance testing
4. Mobile optimization and PWA features

---

## **🔧 Configuration Files**

### **Essential Configuration Files to Request:**
1. `package.json` - Dependencies and scripts
2. `vite.config.js` - Build tool configuration
3. `tailwind.config.js` - CSS framework setup
4. `router.jsx` - Route configuration
5. `.env.example` - Environment variables template

### **Styling Configuration:**
1. Global CSS files for admin and seller themes
2. Tailwind custom classes and utilities
3. Component-specific styling patterns
4. Responsive design breakpoints
5. Color scheme and typography definitions

---

## **⚡ Token & Memory Optimization Tips**

### **For Claude Code Interactions:**
1. **Break Down Complex Features**: Request one module at a time
2. **Use Specific Context**: Always mention "B2B CRM" and role-specific context
3. **Reference Previous Work**: Mention existing components when building related features
4. **Focus on Core Functionality**: Avoid advanced features initially
5. **Request Clean, Production-Ready Code**: Specify error handling and best practices

### **Memory Management:**
1. Start new conversations for major feature sets
2. Save important component patterns for reuse
3. Document API endpoints and data structures
4. Keep component interfaces consistent across modules
5. Use TypeScript interfaces for better code organization

---

## **📊 Data Management Patterns**

### **Agent 9: CRUD Operations Implementation**

**Prompt Template:**
```
Create CRUD operations for [ENTITY_NAME] management in the B2B CRM system.

ENTITY DETAILS:
- Entity: [User/Product/Category/Lead]
- Role Context: [Admin/Seller] perspective
- Required Fields: [List all entity fields]
- Validation Rules: [Business validation requirements]
- Relationships: [Connected entities and dependencies]

CRUD FEATURES TO IMPLEMENT:

1. CREATE Operation:
   - Form with all required fields
   - Real-time validation
   - Image/document upload (if applicable)
   - Success/error feedback
   - Redirect after creation

2. READ Operation:
   - List view with pagination
   - Search and filter functionality
   - Sorting capabilities
   - Detail view modal/page
   - Export functionality

3. UPDATE Operation:
   - Pre-populated edit form
   - Partial updates support
   - Optimistic UI updates
   - Conflict resolution
   - Change tracking

4. DELETE Operation:
   - Soft delete with confirmation
   - Bulk delete functionality
   - Dependency checking
   - Undo functionality (optional)
   - Archive instead of delete (optional)

Include proper error handling, loading states, and user feedback for all operations.
```

### **Agent 10: Verification System Implementation**

**Prompt Template:**
```
Build verification system components for seller and product verification in B2B CRM.

VERIFICATION FEATURES:

1. Seller Verification System:
   - Document upload interface (GST, PAN, License)
   - Business information form
   - Address verification with map integration
   - Phone/email verification OTP
   - Bank account verification
   - Verification status tracking
   - Admin approval workflow

2. Product Verification System:
   - Product information review
   - Image quality check interface
   - Category compliance verification
   - Price validation system
   - Content moderation tools
   - Bulk verification actions
   - Rejection with feedback system

3. Admin Verification Dashboard:
   - Verification queue management
   - Document review interface
   - Approval/rejection workflow
   - Verification history tracking
   - Performance metrics
   - Automated verification rules

WORKFLOW STATES:
- Pending: Initial submission
- Under Review: Admin reviewing
- Approved: Verification complete
- Rejected: Issues found, needs revision
- Suspended: Temporarily disabled

Include notification system, email templates, and audit trail functionality.
```

### **Agent 11: Analytics & Insights Dashboard**

**Prompt Template:**
```
Create analytics and insights dashboard for lead management and business intelligence.

ANALYTICS FEATURES FOR ADMIN:

1. Platform Analytics:
   - User growth trends (daily, weekly, monthly)
   - Revenue analytics and forecasting
   - Lead conversion funnel analysis
   - Geographic distribution of users
   - Platform performance metrics
   - Popular categories and products

2. Lead Intelligence:
   - Lead generation sources tracking
   - Conversion rate analysis by source
   - Response time analytics
   - Lead quality scoring metrics
   - Seasonal trend analysis
   - Industry-wise lead distribution

3. Business Insights:
   - Top performing sellers
   - Most searched products/categories
   - Market demand analysis
   - Customer behavior patterns
   - Revenue per user metrics
   - Churn analysis and predictions

ANALYTICS FEATURES FOR SELLERS:

1. Business Performance:
   - Sales performance tracking
   - Lead conversion metrics
   - Product popularity analysis
   - Customer inquiry patterns
   - Response rate analytics
   - Revenue growth trends

2. Market Intelligence:
   - Competitor analysis insights
   - Market positioning data
   - Price comparison analytics
   - Search ranking performance
   - Customer feedback analysis
   - Opportunity identification

VISUALIZATION REQUIREMENTS:
- Interactive charts and graphs
- Real-time data updates
- Drill-down capabilities
- Export to PDF/Excel
- Custom date range selection
- Mobile-responsive charts

Include filters, comparison tools, and actionable recommendations.
```

---

## **🔐 Security & Performance Patterns**

### **Agent 12: Security Implementation**

**Prompt Template:**
```
Implement security features and best practices for the CRM application.

SECURITY REQUIREMENTS:

1. Authentication Security:
   - JWT token management with refresh tokens
   - Secure password hashing and validation
   - Multi-factor authentication (2FA)
   - Session timeout and management
   - Account lockout after failed attempts
   - Password reset functionality

2. Authorization & Access Control:
   - Role-based access control (RBAC)
   - Permission-based feature access
   - Route protection and guards
   - API endpoint authorization
   - Resource-level permissions
   - Audit logging for sensitive actions

3. Data Protection:
   - Input sanitization and validation
   - XSS and CSRF protection
   - SQL injection prevention
   - File upload security
   - Data encryption for sensitive fields
   - Secure API communication (HTTPS)

4. Frontend Security:
   - Content Security Policy (CSP)
   - Secure cookie handling
   - Local storage security
   - API key protection
   - Error message sanitization
   - Security headers implementation

Include security monitoring, vulnerability scanning, and incident response procedures.
```

### **Agent 13: Performance Optimization**

**Prompt Template:**
```
Implement performance optimization strategies for the CRM application.

PERFORMANCE REQUIREMENTS:

1. Loading Performance:
   - Code splitting and lazy loading
   - Component-level lazy loading
   - Image optimization and lazy loading
   - Bundle size optimization
   - Tree shaking for unused code
   - CDN integration for static assets

2. Runtime Performance:
   - React memoization strategies
   - Virtual scrolling for large lists
   - Debounced search and filters
   - Efficient state management
   - Memory leak prevention
   - Component rendering optimization

3. Data Loading Optimization:
   - API response caching
   - Pagination for large datasets
   - Background data prefetching
   - Optimistic UI updates
   - Request deduplication
   - Offline data handling

4. User Experience Optimization:
   - Loading skeletons and indicators
   - Progressive web app features
   - Smooth animations and transitions
   - Error boundary implementation
   - Graceful degradation
   - Mobile performance optimization

Include performance monitoring, metrics tracking, and optimization guidelines.
```

---

## **🚀 Advanced Features Implementation**

### **Agent 14: Real-time Features**

**Prompt Template:**
```
Add real-time functionality to the CRM application for live updates and notifications.

REAL-TIME FEATURES:

1. Live Notifications:
   - New lead notifications for sellers
   - Verification status updates
   - System announcements
   - Real-time alerts and warnings
   - Push notification integration
   - In-app notification center

2. Live Data Updates:
   - Real-time dashboard metrics
   - Live chat functionality
   - Instant status changes
   - Live user activity feeds
   - Real-time analytics updates
   - Collaborative editing features

3. WebSocket Integration:
   - Connection management
   - Automatic reconnection handling
   - Message queuing for offline scenarios
   - Real-time synchronization
   - Presence indicators
   - Live typing indicators

IMPLEMENTATION APPROACH:
- WebSocket connection management
- Event-driven architecture
- State synchronization
- Conflict resolution
- Performance optimization
- Fallback for connection issues

Include proper error handling, connection status indicators, and offline support.
```

### **Agent 15: Mobile & PWA Features**

**Prompt Template:**
```
Create mobile-optimized features and Progressive Web App capabilities for the CRM.

MOBILE OPTIMIZATION:

1. Responsive Design:
   - Mobile-first approach
   - Touch-friendly interfaces
   - Swipe gestures and interactions
   - Mobile navigation patterns
   - Optimized form layouts
   - Thumb-friendly button placement

2. PWA Features:
   - Service worker implementation
   - Offline functionality
   - App-like experience
   - Push notifications
   - Add to home screen
   - Background sync

3. Mobile-Specific Features:
   - Camera integration for document upload
   - GPS location services
   - Phone/SMS integration
   - Biometric authentication
   - Mobile payments integration
   - Voice input capabilities

4. Performance on Mobile:
   - Reduced bundle sizes
   - Optimized images for mobile
   - Lazy loading strategies
   - Minimal network requests
   - Efficient caching
   - Battery usage optimization

TESTING REQUIREMENTS:
- Cross-device compatibility
- Performance testing on low-end devices
- Network throttling tests
- Touch interaction testing
- Accessibility on mobile
- App store optimization (if native)
```

---

## **📱 Integration Patterns**

### **Agent 16: Third-party Integrations**

**Prompt Template:**
```
Implement third-party service integrations for the CRM application.

INTEGRATION REQUIREMENTS:

1. Payment Gateway Integration:
   - Razorpay/Stripe payment processing
   - Subscription management
   - Invoice generation
   - Payment status tracking
   - Refund processing
   - Payment analytics

2. Communication Services:
   - Email service integration (SendGrid)
   - SMS gateway integration
   - WhatsApp Business API
   - Push notification services
   - Voice call integration
   - Video conferencing API

3. File & Document Management:
   - Cloud storage integration (AWS S3)
   - Document processing APIs
   - Image optimization services
   - PDF generation services
   - Document verification APIs
   - OCR services for document scanning

4. Analytics & Monitoring:
   - Google Analytics integration
   - Error monitoring (Sentry)
   - Performance monitoring
   - User behavior tracking
   - A/B testing integration
   - Custom analytics events

Include proper error handling, API rate limiting, webhook management, and fallback mechanisms.
```

---

## **🧪 Testing & Quality Assurance**

### **Agent 17: Testing Implementation**

**Prompt Template:**
```
Set up comprehensive testing suite for the CRM application.

TESTING REQUIREMENTS:

1. Unit Testing:
   - Component testing with React Testing Library
   - Hook testing
   - Utility function testing
   - Service layer testing
   - Custom hook testing
   - Error handling testing

2. Integration Testing:
   - API integration testing
   - Component integration testing
   - User flow testing
   - Database integration testing
   - Third-party service testing
   - Authentication flow testing

3. End-to-End Testing:
   - Critical user journey testing
   - Cross-browser compatibility
   - Mobile responsiveness testing
   - Performance testing
   - Security testing
   - Accessibility testing

4. Testing Infrastructure:
   - Test environment setup
   - Mock data generation
   - API mocking strategies
   - Continuous integration testing
   - Automated testing pipelines
   - Test reporting and coverage

Include testing best practices, mock strategies, and automated testing workflows.
```

---

## **📈 Deployment & Monitoring**

### **Agent 18: Production Deployment**

**Prompt Template:**
```
Set up production deployment and monitoring for the CRM application.

DEPLOYMENT REQUIREMENTS:

1. Build Configuration:
   - Production build optimization
   - Environment variable management
   - Asset optimization and minification
   - Bundle analysis and optimization
   - Source map configuration
   - Cache busting strategies

2. Deployment Pipeline:
   - CI/CD pipeline setup
   - Automated testing in pipeline
   - Staging environment deployment
   - Production deployment strategies
   - Rollback mechanisms
   - Blue-green deployment

3. Monitoring & Logging:
   - Application performance monitoring
   - Error tracking and alerting
   - User analytics and behavior tracking
   - Server monitoring and health checks
   - Database performance monitoring
   - Security monitoring

4. Maintenance & Updates:
   - Automated dependency updates
   - Security patch management
   - Performance optimization monitoring
   - User feedback collection
   - Feature flag management
   - A/B testing infrastructure

Include backup strategies, disaster recovery, and maintenance procedures.
```

---

## **💡 Best Practices & Guidelines**

### **Code Quality Standards:**
1. **Consistent Naming**: Use descriptive, consistent naming conventions
2. **Component Structure**: Follow single responsibility principle
3. **Error Handling**: Implement comprehensive error boundaries
4. **Performance**: Optimize for speed and memory usage
5. **Accessibility**: Follow WCAG guidelines for all components
6. **Security**: Implement security best practices throughout

### **Development Workflow:**
1. **Feature Branches**: Use Git flow for feature development
2. **Code Reviews**: Implement peer review process
3. **Testing**: Write tests before deployment
4. **Documentation**: Maintain up-to-date documentation
5. **Version Control**: Use semantic versioning
6. **Monitoring**: Track performance and user metrics

### **Token Optimization for Claude Code:**
1. **Modular Requests**: Break complex features into smaller components
2. **Context Preservation**: Reference previous work to maintain consistency
3. **Specific Requirements**: Provide detailed specifications for each request
4. **Progressive Building**: Build features incrementally
5. **Pattern Reuse**: Establish patterns and reuse them across components

This comprehensive documentation provides a structured approach to building a production-ready CRM frontend using 