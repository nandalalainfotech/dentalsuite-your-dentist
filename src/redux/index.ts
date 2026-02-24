export { store } from './store';
export type { AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export { rootReducer, type RootState } from './reducers';
export { authReducer, clinicReducer, bookingReducer, filterReducer } from './reducers';

export {
  login,
  loginPractice,
  signup,
  fetchCurrentUser,
  setUser,
  logoutAction,
  clearError
} from './slices/authSlice';

export {
  fetchClinics,
  fetchClinicById,
  searchClinics,
  createClinic,
  updateClinic,
  setSelectedClinic,
  clearClinics
} from './slices/clinicSlice';

export {
  createBooking,
  fetchAppointments,
  cancelAppointment,
  rescheduleAppointment,
  setCurrentBooking,
  setBookingStep,
  clearCurrentBooking,
  clearBookingError
} from './slices/bookingSlice';

export {
  applyFilters,
  setFilters,
  updateFilter,
  clearFilters,
  setFilterLoading
} from './slices/filterSlice';

export * from './constants';
