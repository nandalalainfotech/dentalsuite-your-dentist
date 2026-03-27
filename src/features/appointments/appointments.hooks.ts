import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store'; 
import { 
  fetchAppointments, 
  updateBookingStatus, 
  rescheduleBooking,
  clearMessages
} from './appointments.slice';

export const useAppointments = (practiceId?: string) => {
  const dispatch = useAppDispatch();
  
  // Select data from the updated slice structure
  const { 
    list, 
    isLoading, 
    isUpdating, 
    error, 
    successMessage 
  } = useAppSelector((state: any) => state.appointments);

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
    // API expects 'cancelled', but UI might pass 'dismissed'/'reception_cancelled'
    // The Thunk just takes the string, so we ensure we send 'cancelled'
    dispatch(updateBookingStatus({ id, status: 'cancelled' }));
  }, [dispatch]);

  const onReschedule = useCallback((id: string, date: string, time: string) => {
    return dispatch(rescheduleBooking({ id, date, time })).unwrap();
  }, [dispatch]);

  const clearAlerts = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  // 3. Return the exact shape expected by PracticeOnlineBookings.tsx
  return {
    bookings: list,           // Map 'list' to 'bookings'
    loading: isLoading,       // Map 'isLoading' to 'loading'
    actionLoading: isUpdating,// Map 'isUpdating' to 'actionLoading'
    error,
    successMessage,
    
    // Actions
    refresh,
    confirmBooking,
    cancelBooking,
    onReschedule,
    clearAlerts
  };
};