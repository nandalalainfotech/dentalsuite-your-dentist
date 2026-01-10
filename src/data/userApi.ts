import { staticUsers } from './users';
import type { User, UserWithDashboard } from '../types/auth';

export const userApi = {
  getAllUsers: (): UserWithDashboard[] => {
    return staticUsers;
  },

  getUserById: (userId: string): UserWithDashboard | null => {
    return staticUsers.find(user => user.id === userId) || null;
  },

  getUserByEmail: (email: string): UserWithDashboard | null => {
    return staticUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserByMobile: (mobileNumber: string): UserWithDashboard | null => {
    return staticUsers.find(user => user.mobileNumber === mobileNumber) || null;
  },

  getUserByEmailOrMobile: (emailOrMobile: string): UserWithDashboard | null => {
    const user = staticUsers.find(user =>
      user.email.toLowerCase() === emailOrMobile.toLowerCase() ||
      user.mobileNumber === emailOrMobile
    );
    return user || null;
  },

  validateCredentials: (emailOrMobile: string, password: string): UserWithDashboard | null => {
    const user = userApi.getUserByEmailOrMobile(emailOrMobile);
    return user && user.password === password ? user : null;
  },

  updateUser: (userId: string, updateData: Partial<User>): UserWithDashboard | null => {
    const userIndex = staticUsers.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return null;
    }

    const updatedUser = {
      ...staticUsers[userIndex],
      ...updateData,
    };

    staticUsers[userIndex] = updatedUser;
    return updatedUser;
  },

  updateUserProfile: (userId: string, profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    mobileNumber?: string;
    profileImage?: string;
  }): UserWithDashboard | null => {
    return userApi.updateUser(userId, profileData);
  },

  addUser: (userData: Omit<User, 'id' | 'createdAt'>): UserWithDashboard => {
    const newUser: UserWithDashboard = {
      ...userData,
      id: (staticUsers.length + 1).toString(),
      createdAt: new Date().toISOString(),
      appointments: [],
      notifications: [],
      familyMembers: []
    };
    staticUsers.push(newUser);
    return newUser;
  },

  searchUsers: (query: string): UserWithDashboard[] => {
    const lowerQuery = query.toLowerCase();
    return staticUsers.filter(user =>
      user.firstName.toLowerCase().includes(lowerQuery) ||
      user.lastName.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowerQuery)
    );
  },

  getUsersByGender: (gender: 'male' | 'female' | 'other'): UserWithDashboard[] => {
    return staticUsers.filter(user => user.gender === gender);
  },

  getUsersByDateRange: (startDate: Date, endDate: Date): UserWithDashboard[] => {
    return staticUsers.filter(user => {
      const createdDate = new Date(user.createdAt);
      return createdDate >= startDate && createdDate <= endDate;
    });
  },

  getUserStats: () => {
    const totalUsers = staticUsers.length;
    const maleUsers = staticUsers.filter(user => user.gender === 'male').length;
    const femaleUsers = staticUsers.filter(user => user.gender === 'female').length;
    const otherUsers = staticUsers.filter(user => user.gender === 'other').length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = staticUsers.filter(user =>
      new Date(user.createdAt) >= thirtyDaysAgo
    ).length;

    return {
      totalUsers,
      maleUsers,
      femaleUsers,
      otherUsers,
      recentUsers
    };
  },

  deleteUser: (userId: string): boolean => {
    const userIndex = staticUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return false;
    }
    staticUsers.splice(userIndex, 1);
    return true;
  },

  emailExists: (email: string): boolean => {
    return staticUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
  },

  mobileExists: (mobileNumber: string): boolean => {
    return staticUsers.some(user => user.mobileNumber === mobileNumber);
  }
};

export const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByMobile,
  getUserByEmailOrMobile,
  validateCredentials,
  updateUser,
  updateUserProfile,
  addUser,
  searchUsers,
  getUsersByGender,
  getUsersByDateRange,
  getUserStats,
  deleteUser,
  emailExists,
  mobileExists
} = userApi;