import { 
  SaudiUser, 
  UserRole, 
  UserStatus, 
  VerificationLevel,
  SaudiRegion,
  BusinessType,
  BusinessVerificationStatus 
} from '../types/saudi-admin';

// Mock data for Saudi users
const mockUsers: SaudiUser[] = [
  {
    id: '1',
    email: 'ahmed.alfarisi@example.com',
    phone: '+966501234567',
    nationalId: '1234567890',
    name: {
      ar: 'أحمد الفارسي',
      en: 'Ahmed Al-Farisi'
    },
    role: UserRole.SELLER,
    status: UserStatus.ACTIVE,
    isVerified: true,
    verificationLevel: VerificationLevel.FULLY_VERIFIED,
    businessInfo: {
      commercialRegistration: 'CR-1234567890',
      vatNumber: 'VAT-300123456789',
      businessNameAr: 'شركة الفارسي للتجارة',
      businessNameEn: 'Al-Farisi Trading Company',
      businessType: BusinessType.LLC,
      isActive: true,
      verificationStatus: BusinessVerificationStatus.APPROVED
    },
    addresses: [
      {
        id: 'addr1',
        type: 'business',
        buildingNumber: '1234',
        streetName: {
          ar: 'شارع الملك فهد',
          en: 'King Fahd Street'
        },
        district: {
          ar: 'العليا',
          en: 'Al Olaya'
        },
        city: {
          ar: 'الرياض',
          en: 'Riyadh'
        },
        region: SaudiRegion.RIYADH,
        postalCode: '12345',
        additionalNumber: '5678',
        isDefault: true
      }
    ],
    preferences: {
      language: 'ar',
      timezone: 'Asia/Riyadh',
      prayerTimeNotifications: true,
      hijriCalendar: true
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    lastLoginAt: '2024-01-22T09:15:00Z'
  },
  {
    id: '2',
    email: 'fatima.alnajjar@example.com',
    phone: '+966509876543',
    iqamaNumber: 'IQ-2345678901',
    name: {
      ar: 'فاطمة النجار',
      en: 'Fatima Al-Najjar'
    },
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
    isVerified: true,
    verificationLevel: VerificationLevel.IDENTITY_VERIFIED,
    addresses: [
      {
        id: 'addr2',
        type: 'home',
        buildingNumber: '9876',
        streetName: {
          ar: 'شارع الأمير محمد بن عبدالعزيز',
          en: 'Prince Mohammed bin Abdulaziz Street'
        },
        district: {
          ar: 'الزهراء',
          en: 'Al Zahra'
        },
        city: {
          ar: 'جدة',
          en: 'Jeddah'
        },
        region: SaudiRegion.MAKKAH,
        postalCode: '23456',
        additionalNumber: '1234',
        isDefault: true
      }
    ],
    preferences: {
      language: 'ar',
      timezone: 'Asia/Riyadh',
      prayerTimeNotifications: true,
      hijriCalendar: true
    },
    createdAt: '2024-02-01T08:20:00Z',
    updatedAt: '2024-02-05T16:30:00Z',
    lastLoginAt: '2024-02-23T11:45:00Z'
  },
  {
    id: '3',
    email: 'mohammed.admin@saudiplatform.com',
    phone: '+966555123456',
    nationalId: '9876543210',
    name: {
      ar: 'محمد العبدالله',
      en: 'Mohammed Al-Abdullah'
    },
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isVerified: true,
    verificationLevel: VerificationLevel.FULLY_VERIFIED,
    addresses: [
      {
        id: 'addr3',
        type: 'business',
        buildingNumber: '5555',
        streetName: {
          ar: 'شارع التحلية',
          en: 'Tahlia Street'
        },
        district: {
          ar: 'المحمدية',
          en: 'Al Mohammadiyah'
        },
        city: {
          ar: 'الرياض',
          en: 'Riyadh'
        },
        region: SaudiRegion.RIYADH,
        postalCode: '11111',
        additionalNumber: '2222',
        isDefault: true
      }
    ],
    preferences: {
      language: 'ar',
      timezone: 'Asia/Riyadh',
      prayerTimeNotifications: false,
      hijriCalendar: true
    },
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2024-02-20T12:00:00Z',
    lastLoginAt: '2024-02-23T08:30:00Z'
  }
];

export class UsersService {
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    verificationLevel?: VerificationLevel;
    region?: SaudiRegion;
  }): Promise<{
    users: SaudiUser[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredUsers = [...mockUsers];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.en.toLowerCase().includes(searchLower) ||
        user.name.ar.includes(params.search!) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(params.search!)
      );
    }

    if (params?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }

    if (params?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status);
    }

    if (params?.verificationLevel) {
      filteredUsers = filteredUsers.filter(user => user.verificationLevel === params.verificationLevel);
    }

    if (params?.region) {
      filteredUsers = filteredUsers.filter(user => 
        user.addresses.some(addr => addr.region === params.region)
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      users: filteredUsers.slice(startIndex, endIndex),
      total: filteredUsers.length,
      page,
      limit
    };
  }

  static async getUserById(id: string): Promise<SaudiUser | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.find(user => user.id === id) || null;
  }

  static async createUser(userData: Partial<SaudiUser>): Promise<SaudiUser> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: SaudiUser = {
      id: Date.now().toString(),
      email: userData.email!,
      phone: userData.phone!,
      nationalId: userData.nationalId,
      iqamaNumber: userData.iqamaNumber,
      name: userData.name!,
      role: userData.role || UserRole.BUYER,
      status: UserStatus.PENDING,
      isVerified: false,
      verificationLevel: VerificationLevel.UNVERIFIED,
      businessInfo: userData.businessInfo,
      addresses: userData.addresses || [],
      preferences: userData.preferences || {
        language: 'ar',
        timezone: 'Asia/Riyadh',
        prayerTimeNotifications: true,
        hijriCalendar: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: Partial<SaudiUser>): Promise<SaudiUser | null> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return mockUsers[userIndex];
  }

  static async deleteUser(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    mockUsers.splice(userIndex, 1);
    return true;
  }

  static async toggleUserStatus(id: string): Promise<SaudiUser | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = mockUsers.find(user => user.id === id);
    if (!user) return null;

    user.status = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    user.updatedAt = new Date().toISOString();

    return user;
  }

  static async assignRole(id: string, role: UserRole): Promise<SaudiUser | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const user = mockUsers.find(user => user.id === id);
    if (!user) return null;

    user.role = role;
    user.updatedAt = new Date().toISOString();

    return user;
  }

  static async getUserStats(): Promise<{
    total: number;
    active: number;
    verified: number;
    byRole: Record<UserRole, number>;
    byRegion: Record<SaudiRegion, number>;
    recentRegistrations: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const total = mockUsers.length;
    const active = mockUsers.filter(u => u.status === UserStatus.ACTIVE).length;
    const verified = mockUsers.filter(u => u.isVerified).length;

    const byRole = Object.values(UserRole).reduce((acc, role) => {
      acc[role] = mockUsers.filter(u => u.role === role).length;
      return acc;
    }, {} as Record<UserRole, number>);

    const byRegion = Object.values(SaudiRegion).reduce((acc, region) => {
      acc[region] = mockUsers.filter(u => 
        u.addresses.some(addr => addr.region === region)
      ).length;
      return acc;
    }, {} as Record<SaudiRegion, number>);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentRegistrations = mockUsers.filter(u => 
      new Date(u.createdAt) > oneWeekAgo
    ).length;

    return {
      total,
      active,
      verified,
      byRole,
      byRegion,
      recentRegistrations
    };
  }
}