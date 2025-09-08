// Admin Services - Comprehensive mock data services for the admin dashboard

export * from './users-service'
export * from './products-service' 
export * from './categories-service'
export * from './verification-service'
export * from './analytics-service'
export * from './dashboard-service'

// Re-export service instances for convenience
export { usersService } from './users-service'
export { productsService } from './products-service'
export { categoriesService } from './categories-service'
export { verificationService } from './verification-service'
export { analyticsService } from './analytics-service'
export { dashboardService } from './dashboard-service'