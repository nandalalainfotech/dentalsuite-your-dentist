import { configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  practiceReducer,
  superadminReducer,
  bookingReducer,
  clinicReducer,
  dentistReducer,
  filterReducer,
} from './slices';

export const store = configureStore({
  reducer: {
    user: userReducer,
    practice: practiceReducer,
    superadmin: superadminReducer,
    booking: bookingReducer,
    clinic: clinicReducer,
    dentist: dentistReducer,
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
