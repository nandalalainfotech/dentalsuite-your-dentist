/* eslint-disable @typescript-eslint/no-unused-vars */
// Minimal in-memory practice store for development/login
import type { Practice, PracticeWithDashboard } from '../types/auth';

const staticPractices: PracticeWithDashboard[] = [
  {
    id: 'p1',
    practiceName: 'Dev Practice',
    abnNumber: '00-000-000',
    email: 'dev@practice.local',
    password: 'devpass',
    firstName: 'Dev',
    lastName: 'Owner',
    mobileNumber: '+61123456789',
    practiceType: 'general_dentistry',
    practicePhone: '+61123456789',
    practiceAddress: '1 Dev Street',
    practiceCity: 'DevCity',
    practiceState: 'NSW',
    practicePostcode: '2000',
    createdAt: new Date().toISOString(),
    appointments: [],
    notifications: [],
    profileImage: undefined,
    isActive: true,
    rating: 5,
    totalReviews: 0
  }
];

export const practiceApi = {
  getAllPractices: (): PracticeWithDashboard[] => staticPractices,
  getPracticeById: (id: string): PracticeWithDashboard | null => staticPractices.find(p => p.id === id) || null,
  getPracticeByEmail: (email: string): PracticeWithDashboard | null => staticPractices.find(p => p.email.toLowerCase() === email.toLowerCase()) || null,
  getPracticeByMobile: (mobile: string): PracticeWithDashboard | null => staticPractices.find(p => p.mobileNumber === mobile) || null,
  getPracticeByEmailOrMobile: (v: string): PracticeWithDashboard | null => staticPractices.find(p => p.email.toLowerCase() === v.toLowerCase() || p.mobileNumber === v) || null,
  validatePracticeCredentials: (v: string, p: string): PracticeWithDashboard | null => {
    const practice = staticPractices.find(pr => (pr.email.toLowerCase() === v.toLowerCase() || pr.mobileNumber === v) && pr.password === p);
    return practice || null;
  },
  updatePractice: (_id: string, _data: Partial<Practice>): PracticeWithDashboard | null => null,
  updatePracticeProfile: (_id: string, _data: Partial<Practice>): PracticeWithDashboard | null => null,
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
    } as PracticeWithDashboard;
    staticPractices.push(newPractice);
    return newPractice;
  },
  searchPractices: (_q: string): PracticeWithDashboard[] => [],
  getPracticesByType: (_t: string): PracticeWithDashboard[] => [],
  getPracticesByState: (_s: string): PracticeWithDashboard[] => [],
  getPracticesByDateRange: (_a: Date, _b: Date): PracticeWithDashboard[] => [],
  getPracticeStats: () => ({} as Record<string, unknown>),
  deletePractice: (_id: string) => false,
  emailExists: (email: string) => staticPractices.some(p => p.email.toLowerCase() === email.toLowerCase()),
  mobileExists: (m: string) => staticPractices.some(p => p.mobileNumber === m),
  abnExists: (a: string) => staticPractices.some(p => p.abnNumber === a)
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