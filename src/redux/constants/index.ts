export const AuthActionTypes = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
} as const;

export const BookingActionTypes = {
  SET_BOOKING_DATA: 'SET_BOOKING_DATA',
  CLEAR_BOOKING: 'CLEAR_BOOKING',
  SET_STEP: 'SET_STEP',
} as const;

export const FilterActionTypes = {
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
} as const;
