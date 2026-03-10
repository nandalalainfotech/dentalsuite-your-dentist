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

import { setUser } from './slices/userSlice';

/* ===========================
   REDUX STORE CONFIG
=========================== */

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

/* ===========================
   🔹 AUTO-HYDRATE AUTH STATE
   (RUNS ON APP LOAD ONCE)
=========================== */

const storedUser =  sessionStorage.getItem('user');
const storedToken =  sessionStorage.getItem('token');


if (storedUser && storedToken) {
  try {
    const parsedUser = JSON.parse(storedUser);

    store.dispatch(setUser(parsedUser));

  } catch (error) {
     sessionStorage.removeItem('user');
     sessionStorage.removeItem('token');
  }
}

/* ===========================
   TYPES
=========================== */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


