import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Appointment, Notification } from '../../types/dashboard';
import type { Practice } from '../../types/auth';
import { setUser } from './userSlice'; 

// --- HELPER: Local Storage Management ---
const STORAGE_KEY = 'practice_auth_session';

const getStoredAuthState = (): { practice: Practice | null; token: string | null; refreshToken: string | null; isAuthenticated: boolean } => {
  try {
    const stored =  sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.practice && parsed.token) {
        return {
          practice: parsed.practice,
          token: parsed.token,
          refreshToken: parsed.refreshToken || null,
          isAuthenticated: true,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load auth state from storage', error);
  }
  return { practice: null, token: null, refreshToken: null, isAuthenticated: false };
};

// ... [Existing Interfaces - Kept Unchanged] ...
interface PracticeAuthState {
  practice: Practice | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface PracticeAppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

interface PracticePatientState {
  patients: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    appointmentsCount: number;
    lastVisit?: string;
  }>;
  selectedPatient: unknown | null;
  isLoading: boolean;
  error: string | null;
}

interface PracticeSettingsState {
  settings: {
    practiceName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    practiceType: string;
    openingHours: Record<string, { open: string; close: string; closed: boolean }>;
    notifications: {
      email: boolean;
      sms: boolean;
      appointmentReminders: boolean;
    };
  } | null;
  isLoading: boolean;
  error: string | null;
}

interface PracticeNotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

interface PracticeDashboardState {
  stats: {
    totalAppointments: number;
    todayAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    totalPatients: number;
    totalRevenue: number;
    averageRating: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

interface PracticeState {
  auth: PracticeAuthState;
  appointments: PracticeAppointmentState;
  patients: PracticePatientState;
  settings: PracticeSettingsState;
  notifications: PracticeNotificationState;
  dashboard: PracticeDashboardState;
}

const storedAuth = getStoredAuthState();

const initialAuthState: PracticeAuthState = {
  practice: storedAuth.practice,
  token: storedAuth.token,
  refreshToken: storedAuth.refreshToken,
  isAuthenticated: storedAuth.isAuthenticated,
  isLoading: false,
  error: null,
};

const initialAppointmentState: PracticeAppointmentState = { appointments: [], selectedAppointment: null, isLoading: false, error: null };
const initialPatientState: PracticePatientState = { patients: [], selectedPatient: null, isLoading: false, error: null };
const initialSettingsState: PracticeSettingsState = { settings: null, isLoading: false, error: null };
const initialNotificationState: PracticeNotificationState = { notifications: [], unreadCount: 0, isLoading: false };
const initialDashboardState: PracticeDashboardState = { stats: null, isLoading: false, error: null };

const initialState: PracticeState = {
  auth: initialAuthState,
  appointments: initialAppointmentState,
  patients: initialPatientState,
  settings: initialSettingsState,
  notifications: initialNotificationState,
  dashboard: initialDashboardState,
};

//  2. DEFINE THE ASYNC THUNK
export const updatePracticeProfile = createAsyncThunk(
  'practice/updateProfile',
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await updatePracticeProfileService(formData);
      
      if (response.success && response.user) {
        // Update the Global User Slice (Important for Dashboard/Navbar sync)
        dispatch(setUser(response.user));
        return response.user;
      } else {
        return rejectWithValue(response.message || 'Update failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    // ... [Existing Reducers Kept Unchanged] ...
    loginRequest: (state) => { state.auth.isLoading = true; state.auth.error = null; },
    loginSuccess: (state, action: PayloadAction<{ practice: Practice; token: string; refreshToken?: string }>) => {
      state.auth.isLoading = false;
      state.auth.isAuthenticated = true;
      state.auth.practice = action.payload.practice;
      state.auth.token = action.payload.token;
      state.auth.refreshToken = action.payload.refreshToken || null;
       sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        practice: action.payload.practice,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken
      }));
    },
    loginFailure: (state, action: PayloadAction<string>) => { state.auth.isLoading = false; state.auth.error = action.payload; },
    logout: (state) => {
      state.auth.practice = null;
      state.auth.token = null;
      state.auth.refreshToken = null;
      state.auth.isAuthenticated = false;
      state.auth.isLoading = false;
      state.auth.error = null;
       sessionStorage.removeItem(STORAGE_KEY);
    },
    setPractice: (state, action: PayloadAction<Practice>) => {
      state.auth.practice = action.payload;
      state.auth.isAuthenticated = true;
      state.auth.isLoading = false;
    },
    updatePractice: (state, action: PayloadAction<Partial<Practice>>) => {
      if (state.auth.practice) {
        state.auth.practice = { ...state.auth.practice, ...action.payload };
        const currentStorage =  sessionStorage.getItem(STORAGE_KEY);
        if (currentStorage) {
          const parsed = JSON.parse(currentStorage);
          parsed.practice = state.auth.practice;
           sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      }
    },
    setToken: (state, action: PayloadAction<string>) => { state.auth.token = action.payload; },
    setRefreshToken: (state, action: PayloadAction<string>) => { state.auth.refreshToken = action.payload; },
    setAuthLoading: (state, action: PayloadAction<boolean>) => { state.auth.isLoading = action.payload; },
    clearAuthError: (state) => { state.auth.error = null; },
    setAppointments: (state, action: PayloadAction<Appointment[]>) => { state.appointments.appointments = action.payload; state.appointments.isLoading = false; },
    addAppointment: (state, action: PayloadAction<Appointment>) => { state.appointments.appointments.push(action.payload); },
    updateAppointment: (state, action: PayloadAction<Appointment>) => { const index = state.appointments.appointments.findIndex((apt) => apt.id === action.payload.id); if (index !== -1) state.appointments.appointments[index] = action.payload; },
    confirmAppointment: (state, action: PayloadAction<string>) => { const appointment = state.appointments.appointments.find((apt) => apt.id === action.payload); if (appointment) appointment.status = 'confirmed'; },
    completeAppointment: (state, action: PayloadAction<string>) => { const appointment = state.appointments.appointments.find((apt) => apt.id === action.payload); if (appointment) appointment.status = 'completed'; },
    cancelAppointment: (state, action: PayloadAction<string>) => { const appointment = state.appointments.appointments.find((apt) => apt.id === action.payload); if (appointment) appointment.status = 'cancelled'; },
    removeAppointment: (state, action: PayloadAction<string>) => { state.appointments.appointments = state.appointments.appointments.filter((apt) => apt.id !== action.payload); },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => { state.appointments.selectedAppointment = action.payload; },
    setAppointmentsLoading: (state, action: PayloadAction<boolean>) => { state.appointments.isLoading = action.payload; },
    setAppointmentsError: (state, action: PayloadAction<string | null>) => { state.appointments.error = action.payload; state.appointments.isLoading = false; },
    setPatients: (state, action: PayloadAction<PracticePatientState['patients']>) => { state.patients.patients = action.payload; state.patients.isLoading = false; },
    addPatient: (state, action: PayloadAction<PracticePatientState['patients'][0]>) => { state.patients.patients.push(action.payload); },
    updatePatient: (state, action: PayloadAction<PracticePatientState['patients'][0]>) => { const index = state.patients.patients.findIndex((p) => p.id === action.payload.id); if (index !== -1) state.patients.patients[index] = action.payload; },
    removePatient: (state, action: PayloadAction<string>) => { state.patients.patients = state.patients.patients.filter((p) => p.id !== action.payload); },
    setSelectedPatient: (state, action: PayloadAction<unknown | null>) => { state.patients.selectedPatient = action.payload; },
    setPatientsLoading: (state, action: PayloadAction<boolean>) => { state.patients.isLoading = action.payload; },
    setSettings: (state, action: PayloadAction<PracticeSettingsState['settings']>) => { state.settings.settings = action.payload; state.settings.isLoading = false; },
    updateSettings: (state, action: PayloadAction<PracticeSettingsState['settings']>) => { state.settings.settings = action.payload; },
    setSettingsLoading: (state, action: PayloadAction<boolean>) => { state.settings.isLoading = action.payload; },
    setSettingsError: (state, action: PayloadAction<string | null>) => { state.settings.error = action.payload; },
    setNotifications: (state, action: PayloadAction<Notification[]>) => { state.notifications.notifications = action.payload; state.notifications.unreadCount = action.payload.filter((n) => !n.isRead).length; state.notifications.isLoading = false; },
    addNotification: (state, action: PayloadAction<Notification>) => { state.notifications.notifications.unshift(action.payload); if (!action.payload.isRead) state.notifications.unreadCount += 1; },
    markNotificationAsRead: (state, action: PayloadAction<string>) => { const notification = state.notifications.notifications.find((n) => n.id === action.payload); if (notification && !notification.isRead) { notification.isRead = true; state.notifications.unreadCount -= 1; } },
    markAllNotificationsAsRead: (state) => { state.notifications.notifications.forEach((n) => { n.isRead = true; }); state.notifications.unreadCount = 0; },
    setDashboardStats: (state, action: PayloadAction<PracticeDashboardState['stats']>) => { state.dashboard.stats = action.payload; state.dashboard.isLoading = false; },
    setDashboardLoading: (state, action: PayloadAction<boolean>) => { state.dashboard.isLoading = action.payload; },
    setDashboardError: (state, action: PayloadAction<string | null>) => { state.dashboard.error = action.payload; state.dashboard.isLoading = false; },
  },
  //  3. ADD EXTRA REDUCERS TO HANDLE ASYNC THUNK
  extraReducers: (builder) => {
    builder
      .addCase(updatePracticeProfile.pending, (state) => {
        state.auth.isLoading = true;
        state.auth.error = null;
      })
      .addCase(updatePracticeProfile.fulfilled, (state, action) => {
        state.auth.isLoading = false;
        state.auth.practice = action.payload;
        
        // Sync with Session Storage
        const currentStorage = sessionStorage.getItem(STORAGE_KEY);
        if (currentStorage) {
          const parsed = JSON.parse(currentStorage);
          parsed.practice = action.payload;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      })
      .addCase(updatePracticeProfile.rejected, (state, action) => {
        state.auth.isLoading = false;
        state.auth.error = action.payload as string;
      });
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setPractice,
  updatePractice,
  setToken,
  setRefreshToken,
  setAuthLoading,
  clearAuthError,
  setAppointments,
  addAppointment,
  updateAppointment,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
  removeAppointment,
  setSelectedAppointment,
  setAppointmentsLoading,
  setAppointmentsError,
  setPatients,
  addPatient,
  updatePatient,
  removePatient,
  setSelectedPatient,
  setPatientsLoading,
  setSettings,
  updateSettings,
  setSettingsLoading,
  setSettingsError,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setDashboardStats,
  setDashboardLoading,
  setDashboardError,
} = practiceSlice.actions;

export default practiceSlice.reducer;