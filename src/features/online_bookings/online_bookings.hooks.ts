import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchAppointments,
  updateBookingStatus,
  rescheduleBooking,
  clearMessages
} from './online_bookings.slice';
import type { AppointmentsState } from './online_bookings.type';

export const useAppointments = (practiceId?: string) => {
  const dispatch = useAppDispatch();

  // Select data from the updated slice structure with strict typing
  const {
    list,
    practitioners, 
    services,      
    openingHours,  
    isLoading,
    isUpdating,
    error,
    successMessage
  } = useAppSelector((state: { appointments: AppointmentsState }) => state.appointments);

  // 1. Initial Fetch / Polling
  const refresh = useCallback(() => {
    if (practiceId) {
      dispatch(fetchAppointments(practiceId));
    }
  }, [dispatch, practiceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 2. Action Wrappers (Mapping UI actions to Redux Thunks)

  const confirmBooking = useCallback((id: string) => {
    dispatch(updateBookingStatus({ id, status: 'confirmed' }));
  }, [dispatch]);

  const cancelBooking = useCallback((id: string) => {
    dispatch(updateBookingStatus({ id, status: 'cancelled' }));
  }, [dispatch]);

  const onReschedule = useCallback((id: string, date: string, time: string, practitionerId: string) => {
    return dispatch(rescheduleBooking({ id, date, time, practitionerId })).unwrap();
  }, [dispatch]);

  const clearAlerts = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  // 3. Return the exact shape expected by PracticeOnlineBookings.tsx
  return {
    bookings: list,
    loading: isLoading,
    actionLoading: isUpdating,
    error,
    successMessage,

    // Safely exposing newly mapped DB tables for UI modals
    practitioners,
    services,
    openingHours,

    // Actions
    refresh,
    confirmBooking,
    cancelBooking,
    onReschedule,
    clearAlerts
  };
};