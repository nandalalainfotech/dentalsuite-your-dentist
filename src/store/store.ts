import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import dashboardReducer from "../features/dashboard/dashboard.slice";
import appointmentsReducer from "../features/appointments/appointments.slice"; 
import directoryReducer from "../features/directory/directory.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    appointments: appointmentsReducer,
    directory: directoryReducer, 
  },
});

// This infers the type from the reducer object above
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;