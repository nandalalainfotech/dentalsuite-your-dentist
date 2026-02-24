import { apiClient } from '../api/client';
import type { Clinic } from '../../types/clinic';
import type { SearchFilters } from '../../types/filters';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const clinicService = {
  getAllClinics: async (filters?: SearchFilters): Promise<Clinic[]> => {
    try {
      const params = filters ? { ...filters } : {};
      const response = await apiClient.get<ApiResponse<Clinic[]>>('/clinics', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching clinics:', error);
      return [];
    }
  },

  getClinicById: async (id: string): Promise<Clinic | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Clinic>>(`/clinics/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching clinic:', error);
      return null;
    }
  },

  searchClinics: async (query: string): Promise<Clinic[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Clinic[]>>('/clinics/search', {
        params: { q: query },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching clinics:', error);
      return [];
    }
  },

  createClinic: async (clinic: Partial<Clinic>): Promise<Clinic | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Clinic>>('/clinics', clinic);
      return response.data.data;
    } catch (error) {
      console.error('Error creating clinic:', error);
      return null;
    }
  },

  updateClinic: async (id: string, clinic: Partial<Clinic>): Promise<Clinic | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Clinic>>(`/clinics/${id}`, clinic);
      return response.data.data;
    } catch (error) {
      console.error('Error updating clinic:', error);
      return null;
    }
  },

  deleteClinic: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/clinics/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting clinic:', error);
      return false;
    }
  },
};
