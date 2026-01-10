import { staticPractices } from './practices';
import type { Practice, PracticeWithDashboard } from '../types/auth';

export const practiceApi = {
  getAllPractices: (): PracticeWithDashboard[] => {
    return staticPractices;
  },

  getPracticeById: (practiceId: string): PracticeWithDashboard | null => {
    return staticPractices.find(practice => practice.id === practiceId) || null;
  },

  getPracticeByEmail: (email: string): PracticeWithDashboard | null => {
    return staticPractices.find(practice => practice.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getPracticeByMobile: (mobileNumber: string): PracticeWithDashboard | null => {
    return staticPractices.find(practice => practice.mobileNumber === mobileNumber) || null;
  },

  getPracticeByEmailOrMobile: (emailOrMobile: string): PracticeWithDashboard | null => {
    const practice = staticPractices.find(practice =>
      practice.email.toLowerCase() === emailOrMobile.toLowerCase() ||
      practice.mobileNumber === emailOrMobile
    );
    return practice || null;
  },

  validatePracticeCredentials: (emailOrMobile: string, password: string): PracticeWithDashboard | null => {
    const practice = practiceApi.getPracticeByEmailOrMobile(emailOrMobile);
    return practice && practice.password === password ? practice : null;
  },

  updatePractice: (practiceId: string, updateData: Partial<Practice>): PracticeWithDashboard | null => {
    const practiceIndex = staticPractices.findIndex(practice => practice.id === practiceId);

    if (practiceIndex === -1) {
      return null;
    }

    const updatedPractice = {
      ...staticPractices[practiceIndex],
      ...updateData,
    };

    staticPractices[practiceIndex] = updatedPractice;
    return updatedPractice;
  },

  updatePracticeProfile: (practiceId: string, profileData: {
    practiceName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobileNumber?: string;
    practicePhone?: string;
    practiceAddress?: string;
    practiceCity?: string;
    practiceState?: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
    practicePostcode?: string;
    profileImage?: string;
  }): PracticeWithDashboard | null => {
    return practiceApi.updatePractice(practiceId, profileData);
  },

  addPractice: (practiceData: Omit<Practice, 'id' | 'createdAt'>): PracticeWithDashboard => {
    const newPractice: PracticeWithDashboard = {
      ...practiceData,
      id: (staticPractices.length + 1).toString(),
      createdAt: new Date().toISOString(),
      appointments: [],
      notifications: [],
      isActive: true,
      rating: 0,
      totalReviews: 0
    };
    staticPractices.push(newPractice);
    return newPractice;
  },

  searchPractices: (query: string): PracticeWithDashboard[] => {
    const lowerQuery = query.toLowerCase();
    return staticPractices.filter(practice =>
      practice.practiceName.toLowerCase().includes(lowerQuery) ||
      practice.firstName.toLowerCase().includes(lowerQuery) ||
      practice.lastName.toLowerCase().includes(lowerQuery) ||
      practice.email.toLowerCase().includes(lowerQuery) ||
      `${practice.firstName} ${practice.lastName}`.toLowerCase().includes(lowerQuery)
    );
  },

  getPracticesByType: (practiceType: 'general_dentistry' | 'specialist' | 'cosmetic' | 'orthodontic' | 'pediatric'): PracticeWithDashboard[] => {
    return staticPractices.filter(practice => practice.practiceType === practiceType);
  },

  getPracticesByState: (state: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'): PracticeWithDashboard[] => {
    return staticPractices.filter(practice => practice.practiceState === state);
  },

  getPracticesByDateRange: (startDate: Date, endDate: Date): PracticeWithDashboard[] => {
    return staticPractices.filter(practice => {
      const createdDate = new Date(practice.createdAt);
      return createdDate >= startDate && createdDate <= endDate;
    });
  },

  getPracticeStats: () => {
    const totalPractices = staticPractices.length;
    const activePractices = staticPractices.filter(practice => practice.isActive).length;
    
    const practiceTypes = {
      general_dentistry: staticPractices.filter(p => p.practiceType === 'general_dentistry').length,
      specialist: staticPractices.filter(p => p.practiceType === 'specialist').length,
      cosmetic: staticPractices.filter(p => p.practiceType === 'cosmetic').length,
      orthodontic: staticPractices.filter(p => p.practiceType === 'orthodontic').length,
      pediatric: staticPractices.filter(p => p.practiceType === 'pediatric').length
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPractices = staticPractices.filter(practice =>
      new Date(practice.createdAt) >= thirtyDaysAgo
    ).length;

    return {
      totalPractices,
      activePractices,
      practiceTypes,
      recentPractices,
      averageRating: staticPractices.reduce((sum, p) => sum + p.rating, 0) / totalPractices
    };
  },

  deletePractice: (practiceId: string): boolean => {
    const practiceIndex = staticPractices.findIndex(practice => practice.id === practiceId);
    if (practiceIndex === -1) {
      return false;
    }
    staticPractices.splice(practiceIndex, 1);
    return true;
  },

  emailExists: (email: string): boolean => {
    return staticPractices.some(practice => practice.email.toLowerCase() === email.toLowerCase());
  },

  mobileExists: (mobileNumber: string): boolean => {
    return staticPractices.some(practice => practice.mobileNumber === mobileNumber);
  },

  abnExists: (abnNumber: string): boolean => {
    return staticPractices.some(practice => practice.abnNumber === abnNumber);
  }
};

export const {
  getAllPractices,
  getPracticeById,
  getPracticeByEmail,
  getPracticeByMobile,
  getPracticeByEmailOrMobile,
  validatePracticeCredentials,
  updatePractice,
  updatePracticeProfile,
  addPractice,
  searchPractices,
  getPracticesByType,
  getPracticesByState,
  getPracticesByDateRange,
  getPracticeStats,
  deletePractice,
  emailExists,
  mobileExists,
  abnExists
} = practiceApi;