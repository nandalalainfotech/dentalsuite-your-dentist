import { apiClient } from '../api/client';
import type { Appointment } from '../../types/booking';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const bookingService = {
  createBooking: async (bookingData: {
    clinicId: string;
    dentistId?: string;
    appointmentType: string;
    appointmentDate: string;
    appointmentTime: string;
    personalDetails: {
      firstName: string;
      lastName: string;
      email: string;
      mobileNumber: string;
      dateOfBirth?: string;
      gender?: string;
    };
  }): Promise<Appointment | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Appointment>>('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  getAppointments: async (userId?: string): Promise<Appointment[]> => {
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient.get<ApiResponse<Appointment[]>>('/bookings', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  },

  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Appointment>>(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Appointment>>(`/bookings/${id}`, updates);
      return response.data.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      return null;
    }
  },

  cancelAppointment: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/bookings/${id}`);
      return true;
    } catch (error) {
      console.error('Error canceling appointment:', error);
      return false;
    }
  },

  rescheduleAppointment: async (id: string, newDate: string, newTime: string): Promise<Appointment | null> => {
    try {
      const response = await apiClient.put<ApiResponse<Appointment>>(`/bookings/${id}/reschedule`, {
        appointmentDate: newDate,
        appointmentTime: newTime,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return null;
    }
  },

  getAvailableSlots: async (clinicId: string, dentistId: string, date: string): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(`/bookings/slots`, {
        params: { clinicId, dentistId, date },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching slots:', error);
      return [];
    }
  },
};
