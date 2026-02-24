/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api/client';
import type { Practice, PracticeWithDashboard } from '../../types/auth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const practiceService = {
  getAllPractices: async (): Promise<Practice[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Practice[]>>('/practices');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching practices:', error);
      return [];
    }
  },

  getPracticeById: async (id: string): Promise<Practice | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Practice>>(`/practices/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching practice:', error);
      return null;
    }
  },

  getPracticeWithDashboard: async (id: string): Promise<PracticeWithDashboard | null> => {
    try {
      const response = await apiClient.get<ApiResponse<PracticeWithDashboard>>(`/practices/${id}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching practice dashboard:', error);
      return null;
    }
  },

  createPractice: async (practice: Partial<Practice>): Promise<Practice | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Practice>>('/practices', practice);
      return response.data.data;
    } catch (error) {
      console.error('Error creating practice:', error);
      return null;
    }
  },

  updatePractice: async (id: string, practice: Partial<Practice>): Promise<Practice | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Practice>>(`/practices/${id}`, practice);
      return response.data.data;
    } catch (error) {
      console.error('Error updating practice:', error);
      return null;
    }
  },

  deletePractice: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/practices/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting practice:', error);
      return false;
    }
  },

  getPracticeStats: async (id: string) => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/practices/${id}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching practice stats:', error);
      return null;
    }
  },
};
