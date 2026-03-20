import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// vvv MAKE SURE THIS IMPORT IS CORRECT vvv
import type { RootState, AppDispatch } from "../../store/store"; 
import { fetchAppointments, updateLocalStatus, updateLocalReschedule } from "./appointments.slice";
import type { AppointmentStatus } from "./appointments.type";

export const useAppointments = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const { items, isLoading, error } = useSelector((state: RootState) => {
    return state.appointments;
  });

  const loadData = useCallback(() => {
    if (user?.id) {
      dispatch(fetchAppointments(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const updateStatus = (id: string, status: AppointmentStatus) => {
    dispatch(updateLocalStatus({ id, status }));
  };

  const reschedule = (id: string, date: string, time: string) => {
    dispatch(updateLocalReschedule({ id, date, time }));
  };

  return {
    appointments: items || [], 
    loading: isLoading,
    error,
    refresh: loadData,
    updateStatus,
    reschedule,
  };
};