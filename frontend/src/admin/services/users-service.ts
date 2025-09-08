import { User } from '@/auth/types'

export interface UserFilters {
  search?: string
  role?: User['role']
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  isActive?: boolean
  createdFrom?: string
  createdTo?: string
}

export interface UserListResponse {
  data: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  pendingVerification: number
  adminUsers: number
  sellerUsers: number
  supportUsers: number
  newUsersThisMonth: number
  growthPercentage: number
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@crm.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32',
    isVerified: true,
    isActive: true,
    lastLogin: '2024-01-15T08:30:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    permissions: ['users.read', 'users.write', 'products.read', 'products.write', 'analytics.read']
  },
  {
    id: 'user-2',
    email: 'john.seller@business.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32',
    isVerified: true,
    isActive: true,
    lastLogin: '2024-01-14T14:22:00Z',
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2024-01-14T14:22:00Z',
    businessName: 'Smith Electronics Ltd',
    businessType: 'Electronics',
    verificationStatus: 'verified'
  },
  {
    id: 'user-3',
    email: 'sarah.davis@techsolutions.com',
    firstName: 'Sarah',
    lastName: 'Davis',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32',
    isVerified: false,
    isActive: true,
    lastLogin: '2024-01-13T09:15:00Z',
    createdAt: '2023-08-20T00:00:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    businessName: 'TechSolutions Inc',
    businessType: 'Software',
    verificationStatus: 'pending'
  },
  {
    id: 'user-4',
    email: 'mike.support@crm.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'support',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32',
    isVerified: true,
    isActive: true,
    lastLogin: '2024-01-15T10:45:00Z',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-01-15T10:45:00Z'
  },
  {
    id: 'user-5',
    email: 'lisa.wilson@greentech.com',
    firstName: 'Lisa',
    lastName: 'Wilson',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32',
    isVerified: true,
    isActive: false,
    lastLogin: '2024-01-10T16:30:00Z',
    createdAt: '2023-11-05T00:00:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    businessName: 'GreenTech Solutions',
    businessType: 'Environmental',
    verificationStatus: 'verified'
  },
  {
    id: 'user-6',
    email: 'robert.brown@manufacturing.com',
    firstName: 'Robert',
    lastName: 'Brown',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32',
    isVerified: false,
    isActive: true,
    lastLogin: '2024-01-12T11:20:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T11:20:00Z',
    businessName: 'Brown Manufacturing Co',
    businessType: 'Manufacturing',
    verificationStatus: 'rejected'
  },
  {
    id: 'user-7',
    email: 'emma.clark@fashion.com',
    firstName: 'Emma',
    lastName: 'Clark',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32',
    isVerified: true,
    isActive: true,
    lastLogin: '2024-01-14T13:45:00Z',
    createdAt: '2023-09-12T00:00:00Z',
    updatedAt: '2024-01-14T13:45:00Z',
    businessName: 'Clark Fashion House',
    businessType: 'Fashion',
    verificationStatus: 'verified'
  },
  {
    id: 'user-8',
    email: 'david.support@crm.com',
    firstName: 'David',
    lastName: 'Miller',
    role: 'support',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32',
    isVerified: true,
    isActive: true,
    lastLogin: '2024-01-15T09:30:00Z',
    createdAt: '2023-07-22T00:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'user-9',
    email: 'anna.martinez@foodtech.com',
    firstName: 'Anna',
    lastName: 'Martinez',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=32',
    isVerified: false,
    isActive: true,
    lastLogin: '2024-01-11T15:20:00Z',
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-11T15:20:00Z',
    businessName: 'FoodTech Innovations',
    businessType: 'Food & Beverage',
    verificationStatus: 'pending'
  },
  {
    id: 'user-10',
    email: 'james.taylor@automotive.com',
    firstName: 'James',
    lastName: 'Taylor',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32',
    isVerified: true,
    isActive: true,
    lastLogin: '2024-01-13T12:10:00Z',
    createdAt: '2023-05-30T00:00:00Z',
    updatedAt: '2024-01-13T12:10:00Z',
    businessName: 'Taylor Automotive Parts',
    businessType: 'Automotive',
    verificationStatus: 'verified'
  }
]

class UsersService {
  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Filter users based on criteria
  private filterUsers(users: User[], filters: UserFilters): User[] {
    return users.filter(user => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        if (!fullName.includes(searchTerm) && 
            !user.email.toLowerCase().includes(searchTerm) &&
            !user.businessName?.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      if (filters.role && user.role !== filters.role) return false
      if (filters.verificationStatus && user.verificationStatus !== filters.verificationStatus) return false
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) return false
      
      if (filters.createdFrom) {
        const createdDate = new Date(user.createdAt)
        const fromDate = new Date(filters.createdFrom)
        if (createdDate < fromDate) return false
      }
      
      if (filters.createdTo) {
        const createdDate = new Date(user.createdAt)
        const toDate = new Date(filters.createdTo)
        if (createdDate > toDate) return false
      }

      return true
    })
  }

  // Get paginated users list
  async getUsers(
    page: number = 1,
    limit: number = 10,
    filters: UserFilters = {}
  ): Promise<UserListResponse> {
    await this.delay()

    const filteredUsers = this.filterUsers(mockUsers, filters)
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const data = filteredUsers.slice(startIndex, startIndex + limit)

    return {
      data,
      total,
      page,
      limit,
      totalPages
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    await this.delay()
    return mockUsers.find(user => user.id === id) || null
  }

  // Create new user
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.delay()

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockUsers.push(newUser)
    return newUser
  }

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.delay()

    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    mockUsers[userIndex] = updatedUser
    return updatedUser
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await this.delay()

    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    mockUsers.splice(userIndex, 1)
  }

  // Toggle user status
  async toggleUserStatus(id: string): Promise<User> {
    await this.delay()

    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    mockUsers[userIndex].isActive = !mockUsers[userIndex].isActive
    mockUsers[userIndex].updatedAt = new Date().toISOString()

    return mockUsers[userIndex]
  }

  // Update user role
  async updateUserRole(id: string, role: User['role']): Promise<User> {
    await this.delay()

    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    mockUsers[userIndex].role = role
    mockUsers[userIndex].updatedAt = new Date().toISOString()

    return mockUsers[userIndex]
  }

  // Update user permissions (admin only)
  async updateUserPermissions(id: string, permissions: string[]): Promise<User> {
    await this.delay()

    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    if (mockUsers[userIndex].role !== 'admin') {
      throw new Error('Permissions can only be set for admin users')
    }

    mockUsers[userIndex].permissions = permissions
    mockUsers[userIndex].updatedAt = new Date().toISOString()

    return mockUsers[userIndex]
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    await this.delay()

    const totalUsers = mockUsers.length
    const activeUsers = mockUsers.filter(u => u.isActive).length
    const pendingVerification = mockUsers.filter(u => u.verificationStatus === 'pending').length
    const adminUsers = mockUsers.filter(u => u.role === 'admin').length
    const sellerUsers = mockUsers.filter(u => u.role === 'seller').length
    const supportUsers = mockUsers.filter(u => u.role === 'support').length

    // Calculate new users this month
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const newUsersThisMonth = mockUsers.filter(u => 
      new Date(u.createdAt) >= thisMonth
    ).length

    // Mock growth percentage
    const growthPercentage = 12.5

    return {
      totalUsers,
      activeUsers,
      pendingVerification,
      adminUsers,
      sellerUsers,
      supportUsers,
      newUsersThisMonth,
      growthPercentage
    }
  }

  // Bulk operations
  async bulkUpdateStatus(userIds: string[], isActive: boolean): Promise<User[]> {
    await this.delay(1000) // Longer delay for bulk operations

    const updatedUsers: User[] = []

    for (const id of userIds) {
      const userIndex = mockUsers.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        mockUsers[userIndex].isActive = isActive
        mockUsers[userIndex].updatedAt = new Date().toISOString()
        updatedUsers.push(mockUsers[userIndex])
      }
    }

    return updatedUsers
  }

  async bulkDelete(userIds: string[]): Promise<void> {
    await this.delay(1000)

    for (let i = mockUsers.length - 1; i >= 0; i--) {
      if (userIds.includes(mockUsers[i].id)) {
        mockUsers.splice(i, 1)
      }
    }
  }

  // Search users with advanced options
  async searchUsers(
    query: string,
    options: {
      fields?: ('name' | 'email' | 'business')[]
      limit?: number
    } = {}
  ): Promise<User[]> {
    await this.delay()

    const { fields = ['name', 'email', 'business'], limit = 10 } = options
    const searchTerm = query.toLowerCase()

    const results = mockUsers.filter(user => {
      const matches = []
      
      if (fields.includes('name')) {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        matches.push(fullName.includes(searchTerm))
      }
      
      if (fields.includes('email')) {
        matches.push(user.email.toLowerCase().includes(searchTerm))
      }
      
      if (fields.includes('business') && user.businessName) {
        matches.push(user.businessName.toLowerCase().includes(searchTerm))
      }

      return matches.some(Boolean)
    })

    return results.slice(0, limit)
  }
}

export const usersService = new UsersService()