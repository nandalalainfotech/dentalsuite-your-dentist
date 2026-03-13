/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api/client';
import type {
  User,
  Practice,
  LoginCredentials,
  PracticeLoginCredentials,
  SignupCredentials,
  PracticeSignupCredentials
} from '../../types/auth';

interface AuthResponse {
  user: { id: string; email: string; role?: string | undefined; password: string; firstName: string; lastName: string; dateOfBirth: string; gender?: "male" | "female" | "other" | undefined; mobileNumber: string; createdAt: string; } | { practiceType: string; id: string; role?: string | undefined; practiceName: string; abnNumber: string; email: string; password: string; firstName: string; lastName: string; mobileNumber: string; practiceLogo: string; practicePhone: string; practiceAddress: string; practiceCity: string; practiceState: string; practicePostcode: string; createdAt: string; status?: string | undefined; profileCompleted?: boolean | undefined; paymentCompleted?: boolean | undefined; subscriptionPermissions?: unknown; token?: string | undefined; refreshToken?: string | undefined; business_name: string; address?: string | undefined; phone?: string | undefined; name?: string | undefined; city?: string | undefined; } | null;
  success: boolean;
  data: {
    user: User | Practice;
    token: string;
  };
  message?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return error.response?.data || null;
    }
  },

  loginPractice: async (credentials: PracticeLoginCredentials): Promise<AuthResponse | null> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/practice/login', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Practice login error:', error);
      return error.response?.data || null;
    }
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse | null> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error);
      return error.response?.data || null;
    }
  },

  signupPractice: async (credentials: PracticeSignupCredentials): Promise<AuthResponse | null> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/practice/signup', credentials);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Practice signup error:', error);
      return error.response?.data || null;
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User | Practice | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: User | Practice }>('/auth/me');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<User | null> => {
    try {
      const response = await apiClient.put<{ success: boolean; data: User }>('/auth/profile', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },

  refreshToken: async (): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ success: boolean; data: { token: string } }>('/auth/refresh');
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  },
};
