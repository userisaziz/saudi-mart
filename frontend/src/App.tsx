import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/shared/components/ui/toaster'
import { AuthProvider } from '@/auth/contexts/auth-context'
import { LanguageProvider } from '@/shared/contexts/LanguageContext'
import { ProtectedRoute } from '@/auth/components/protected-route'
import { AdminLayout } from '@/admin/components/layout/admin-layout'
import { SellerLayout } from '@/seller/layout/SellerLayout'
import { AuthLayout } from '@/auth/components/layout/auth-layout'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { USER_ROLES } from '@/shared/utils/constants'

// Lazy load pages for better performance
const AdminDashboard = React.lazy(() => import('@/admin/pages/dashboard'))

// Admin Pages
const AdminSellers = React.lazy(() => import('@/admin/pages/Sellers/Management'))
const AdminSellersList = React.lazy(() => import('@/admin/pages/Sellers/List'))
const AdminSellersAdd = React.lazy(() => import('@/admin/pages/Sellers/Add'))
const AdminBuyers = React.lazy(() => import('@/admin/pages/Buyers/Management'))
const AdminBuyersList = React.lazy(() => import('@/admin/pages/Buyers/List'))
const AdminBuyersAdd = React.lazy(() => import('@/admin/pages/Buyers/Add'))
const AdminProducts = React.lazy(() => import('@/admin/pages/Products/Management'))
const AdminProductsList = React.lazy(() => import('@/admin/pages/Products/List'))
const AdminProductsAdd = React.lazy(() => import('@/admin/pages/Products/Add'))
const AdminCategories = React.lazy(() => import('@/admin/pages/Categories/Management'))
const AdminCategoriesList = React.lazy(() => import('@/admin/pages/Categories/List'))
const AdminCategoriesAdd = React.lazy(() => import('@/admin/pages/Categories/Add'))
const AdminOrders = React.lazy(() => import('@/admin/pages/Orders/Management'))
const AdminOrdersList = React.lazy(() => import('@/admin/pages/Orders/List'))
const AdminOrdersPending = React.lazy(() => import('@/admin/pages/Orders/Pending'))
const AdminOrdersShipping = React.lazy(() => import('@/admin/pages/Orders/Shipping'))
const AdminOrdersReturns = React.lazy(() => import('@/admin/pages/Orders/Returns'))
const AdminOrdersAnalytics = React.lazy(() => import('@/admin/pages/Orders/Analytics'))
const AdminNotifications = React.lazy(() => import('@/admin/pages/Notifications/Management'))
const AdminAnalytics = React.lazy(() => import('@/admin/pages/Analytics/Dashboard'))
const AdminReports = React.lazy(() => import('@/admin/pages/Reports/Dashboard'))
const AdminLogs = React.lazy(() => import('@/admin/pages/Logs/Activity'))
const AdminSellerVerification = React.lazy(() => import('@/admin/pages/Sellers/Verification/SellerVerification'))
const AdminSettings = React.lazy(() => import('@/admin/pages/Settings/General'))

const SellerDashboard = React.lazy(() => import('@/seller/pages/Dashboard'))
const LoginPage = React.lazy(() => import('@/auth/pages/login'))
const RegisterPage = React.lazy(() => import('@/auth/pages/register'))
const ForgotPasswordPage = React.lazy(() => import('@/auth/pages/forgot-password'))

// Seller Pages
const ProductsList = React.lazy(() => import('@/seller/pages/Products/List'))
const ProductsAddEdit = React.lazy(() => import('@/seller/pages/Products/AddEdit'))
const ProductsInventory = React.lazy(() => import('@/seller/pages/Products/Inventory'))
const ProductsBulkUpload = React.lazy(() => import('@/seller/pages/Products/BulkUpload'))

const LeadsInbox = React.lazy(() => import('@/seller/pages/Leads/Inbox'))
const LeadsFunnel = React.lazy(() => import('@/seller/pages/Leads/Funnel'))
const LeadsDetails = React.lazy(() => import('@/seller/pages/Leads/Details'))

const ProfileCompanyInfo = React.lazy(() => import('@/seller/pages/Profile/CompanyInfo'))
const ProfileDocuments = React.lazy(() => import('@/seller/pages/Profile/Documents'))
const ProfileSettings = React.lazy(() => import('@/seller/pages/Profile/Settings'))
const ProfileAccount = React.lazy(() => import('@/seller/pages/Profile/Account'))
const ProfileBusinessDetails = React.lazy(() => import('@/seller/pages/Profile/BusinessDetails'))
const ProfileVerification = React.lazy(() => import('@/seller/pages/Profile/Verification'))
const ProfileCompletion = React.lazy(() => import('@/seller/pages/Profile/Completion'))

const AnalyticsGrowth = React.lazy(() => import('@/seller/pages/Analytics/Growth'))
const AnalyticsConversion = React.lazy(() => import('@/seller/pages/Analytics/Conversion'))

const OrdersList = React.lazy(() => import('@/seller/pages/Orders/List'))
const OrdersDetails = React.lazy(() => import('@/seller/pages/Orders/Details'))

const CommunicationHub = React.lazy(() => import('@/seller/pages/Communication/Hub'))

const FinanceDashboard = React.lazy(() => import('@/seller/pages/Finance/Dashboard'))

// New Seller Components
const OrdersReturns = React.lazy(() => import('@/seller/pages/Orders/Returns'))
const OrdersShipping = React.lazy(() => import('@/seller/pages/Orders/Shipping'))
const CommunicationTemplates = React.lazy(() => import('@/seller/pages/Communication/Templates'))
const CommunicationWhatsApp = React.lazy(() => import('@/seller/pages/Communication/WhatsApp'))
const FinanceInvoices = React.lazy(() => import('@/seller/pages/Finance/Invoices'))
const FinancePayments = React.lazy(() => import('@/seller/pages/Finance/Payments'))
const FinanceReports = React.lazy(() => import('@/seller/pages/Finance/Reports'))
const LeadsFollowUp = React.lazy(() => import('@/seller/pages/Leads/FollowUp'))
const LeadsTemplates = React.lazy(() => import('@/seller/pages/Leads/Templates'))
const LeadsScoring = React.lazy(() => import('@/seller/pages/Leads/Scoring'))
const Profile = React.lazy(() => import('@/seller/pages/Profile'))
const ProfileContacts = React.lazy(() => import('@/seller/pages/Profile/Contacts'))
const ProfileBusinessHours = React.lazy(() => import('@/seller/pages/Profile/BusinessHours'))
const AnalyticsProductInsights = React.lazy(() => import('@/seller/pages/Analytics/ProductInsights'))
const AnalyticsCustomerFeedback = React.lazy(() => import('@/seller/pages/Analytics/CustomerFeedback'))

// Settings
const SellerSettings = React.lazy(() => import('@/seller/pages/Settings'))
const SellerNotifications = React.lazy(() => import('@/seller/pages/Notifications'))
const SellerHelp = React.lazy(() => import('@/seller/pages/Help'))
const SellerReports = React.lazy(() => import('@/seller/pages/Reports'))

// New Seller Features
const BulkOrders = React.lazy(() => import('@/seller/pages/BulkOrders'))
const RFQ = React.lazy(() => import('@/seller/pages/RFQ'))
const RequestCategory = React.lazy(() => import('@/seller/pages/Categories/RequestCategory'))

// Admin Approval Pages
const CategoryRequests = React.lazy(() => import('@/admin/pages/Categories/CategoryRequests'))
const CategoryAnalytics = React.lazy(() => import('@/admin/pages/Categories/Analytics'))
const ProductApproval = React.lazy(() => import('@/admin/pages/Products/ProductApproval'))

// Enterprise Features - Admin
const ContractManagement = React.lazy(() => import('@/admin/pages/Contracts/Management'))
const SupplierSRM = React.lazy(() => import('@/admin/pages/Suppliers/SRM'))
const ProcurementWorkflows = React.lazy(() => import('@/admin/pages/Procurement/Workflows'))
const AuditTrails = React.lazy(() => import('@/admin/pages/Compliance/AuditTrails'))

// Missing Admin Pages
const AdminProductsInventory = React.lazy(() => import('@/admin/pages/Products/Inventory'))
const AdminProductsBulk = React.lazy(() => import('@/admin/pages/Products/Bulk'))
const AdminSellersRoles = React.lazy(() => import('@/admin/pages/Sellers/Roles'))
const AdminBuyersRoles = React.lazy(() => import('@/admin/pages/Buyers/Roles'))

// Enterprise Features - Seller
const PricingTools = React.lazy(() => import('@/seller/pages/Negotiations/PricingTools'))


function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
          <React.Suspense 
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/auth/*" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                
                {/* Sellers Routes */}
                <Route path="sellers" element={<AdminSellers />} />
                <Route path="sellers/list" element={<AdminSellersList />} />
                <Route path="sellers/add" element={<AdminSellersAdd />} />
                <Route path="sellers/verification" element={<AdminSellerVerification />} />
                <Route path="sellers/roles" element={<AdminSellersRoles />} />
                
                {/* Buyers Routes */}
                <Route path="buyers" element={<AdminBuyers />} />
                <Route path="buyers/list" element={<AdminBuyersList />} />
                <Route path="buyers/add" element={<AdminBuyersAdd />} />
                <Route path="buyers/roles" element={<AdminBuyersRoles />} />
                
                {/* Products Routes */}
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/list" element={<AdminProductsList />} />
                <Route path="products/add" element={<AdminProductsAdd />} />
                <Route path="products/inventory" element={<AdminProductsInventory />} />
                <Route path="products/bulk" element={<AdminProductsBulk />} />
                <Route path="product-approval" element={<ProductApproval />} />
                
                {/* Categories Routes */}
                <Route path="categories" element={<AdminCategories />} />
                <Route path="categories/list" element={<AdminCategoriesList />} />
                <Route path="categories/add" element={<AdminCategoriesAdd />} />
                <Route path="category-requests" element={<CategoryRequests />} />
                <Route path="category-analytics" element={<CategoryAnalytics />} />
                
                {/* Orders Routes */}
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/list" element={<AdminOrdersList />} />
                <Route path="orders/pending" element={<AdminOrdersPending />} />
                <Route path="orders/shipping" element={<AdminOrdersShipping />} />
                <Route path="orders/returns" element={<AdminOrdersReturns />} />
                <Route path="orders/analytics" element={<AdminOrdersAnalytics />} />
                
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="logs" element={<AdminLogs />} />
                
                {/* Enterprise Features */}
                <Route path="contracts" element={<ContractManagement />} />
                <Route path="suppliers/srm" element={<SupplierSRM />} />
                <Route path="procurement" element={<ProcurementWorkflows />} />
                <Route path="compliance" element={<AuditTrails />} />
                
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Protected Seller Routes */}
              <Route
                path="/seller/*"
                element={
                  <ProtectedRoute requiredRole={USER_ROLES.SELLER}>
                    <SellerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/seller/dashboard" replace />} />
                <Route path="dashboard" element={<SellerDashboard />} />
                
                {/* Products Routes */}
                <Route path="products/list" element={<ProductsList />} />
                <Route path="products/add" element={<ProductsAddEdit />} />
                <Route path="products/edit/:id" element={<ProductsAddEdit />} />
                <Route path="products/inventory" element={<ProductsInventory />} />
                <Route path="products/bulk-upload" element={<ProductsBulkUpload />} />
                
                {/* Category Routes */}
                <Route path="categories/request" element={<RequestCategory />} />
                
                {/* Orders Routes */}
                <Route path="orders/list" element={<OrdersList />} />
                <Route path="orders/details/:id" element={<OrdersDetails />} />
                <Route path="orders/returns" element={<OrdersReturns />} />
                <Route path="orders/shipping" element={<OrdersShipping />} />
                
                {/* Communication Routes */}
                <Route path="communication/hub" element={<CommunicationHub />} />
                <Route path="communication/templates" element={<CommunicationTemplates />} />
                <Route path="communication/whatsapp" element={<CommunicationWhatsApp />} />
                
                {/* Finance Routes */}
                <Route path="finance/dashboard" element={<FinanceDashboard />} />
                <Route path="finance/invoices" element={<FinanceInvoices />} />
                <Route path="finance/payments" element={<FinancePayments />} />
                <Route path="finance/reports" element={<FinanceReports />} />
                
                {/* Leads Routes */}
                <Route path="leads/inbox" element={<LeadsInbox />} />
                <Route path="leads/funnel" element={<LeadsFunnel />} />
                <Route path="leads/details/:id" element={<LeadsDetails />} />
                <Route path="leads/follow-up" element={<LeadsFollowUp />} />
                <Route path="leads/templates" element={<LeadsTemplates />} />
                <Route path="leads/scoring" element={<LeadsScoring />} />
                
                {/* Profile Routes */}
                <Route path="profile" element={<Profile />} />
                <Route path="profile/company" element={<ProfileCompanyInfo />} />
                <Route path="profile/documents" element={<ProfileDocuments />} />
                <Route path="profile/contacts" element={<ProfileContacts />} />
                <Route path="profile/hours" element={<ProfileBusinessHours />} />
                <Route path="profile/settings" element={<ProfileSettings />} />
                <Route path="profile/account" element={<ProfileAccount />} />
                <Route path="profile/business" element={<ProfileBusinessDetails />} />
                <Route path="profile/verification" element={<ProfileVerification />} />
                <Route path="profile/completion" element={<ProfileCompletion />} />
                
                {/* Analytics Routes */}
                <Route path="analytics/growth" element={<AnalyticsGrowth />} />
                <Route path="analytics/conversion" element={<AnalyticsConversion />} />
                <Route path="analytics/products" element={<AnalyticsProductInsights />} />
                <Route path="analytics/feedback" element={<AnalyticsCustomerFeedback />} />
                
                {/* Negotiations Routes */}
                <Route path="negotiations/pricing" element={<PricingTools />} />
                
                {/* Settings Routes */}
                <Route path="settings" element={<SellerSettings />} />
                <Route path="notifications" element={<SellerNotifications />} />
                <Route path="help" element={<SellerHelp />} />
                <Route path="reports" element={<SellerReports />} />
              </Route>

              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </React.Suspense>

          <Toaster />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App