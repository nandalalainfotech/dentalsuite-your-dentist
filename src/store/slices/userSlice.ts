import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/auth';
import type { Appointment, Notification, FamilyMember } from '../../types/dashboard';

interface UserAuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UserAppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

interface UserNotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

interface UserFamilyState {
  familyMembers: FamilyMember[];
  isLoading: boolean;
  error: string | null;
}

interface UserState {
  auth: UserAuthState;
  appointments: UserAppointmentState;
  notifications: UserNotificationState;
  familyMembers: UserFamilyState;
}

const initialAuthState: UserAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const initialAppointmentState: UserAppointmentState = {
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
};

const initialNotificationState: UserNotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const initialFamilyState: UserFamilyState = {
  familyMembers: [],
  isLoading: false,
  error: null,
};

const initialState: UserState = {
  auth: initialAuthState,
  appointments: initialAppointmentState,
  notifications: initialNotificationState,
  familyMembers: initialFamilyState,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.auth.isLoading = false;
      state.auth.isAuthenticated = true;
      state.auth.user = action.payload.user;
      state.auth.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.auth.isLoading = false;
      state.auth.error = action.payload;
    },
    registerRequest: (state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.auth.isLoading = false;
      state.auth.isAuthenticated = true;
      state.auth.user = action.payload.user;
      state.auth.token = action.payload.token;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.auth.isLoading = false;
      state.auth.error = action.payload;
    },
    logout: (state) => {
      state.auth.user = null;
      state.auth.token = null;
      state.auth.isAuthenticated = false;
      state.auth.isLoading = false;
      state.auth.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.auth.user = action.payload;
      state.auth.isAuthenticated = true;
      state.auth.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.auth.user) {
        state.auth.user = { ...state.auth.user, ...action.payload };
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.auth.isLoading = action.payload;
    },
    clearAuthError: (state) => {
      state.auth.error = null;
    },
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments.appointments = action.payload;
      state.appointments.isLoading = false;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.appointments.findIndex(
        (apt) => apt.id === action.payload.id
      );
      if (index !== -1) {
        state.appointments.appointments[index] = action.payload;
      }
    },
    removeAppointment: (state, action: PayloadAction<string>) => {
      state.appointments.appointments = state.appointments.appointments.filter(
        (apt) => apt.id !== action.payload
      );
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.appointments.selectedAppointment = action.payload;
    },
    setAppointmentsLoading: (state, action: PayloadAction<boolean>) => {
      state.appointments.isLoading = action.payload;
    },
    setAppointmentsError: (state, action: PayloadAction<string | null>) => {
      state.appointments.error = action.payload;
      state.appointments.isLoading = false;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications.notifications = action.payload;
      state.notifications.unreadCount = action.payload.filter((n) => !n.isRead).length;
      state.notifications.isLoading = false;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.notifications.unreadCount += 1;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.notifications.unreadCount -= 1;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.notifications.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.isRead) {
        state.notifications.unreadCount -= 1;
      }
      state.notifications.notifications = state.notifications.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setFamilyMembers: (state, action: PayloadAction<FamilyMember[]>) => {
      state.familyMembers.familyMembers = action.payload;
      state.familyMembers.isLoading = false;
    },
    addFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
      state.familyMembers.familyMembers.push(action.payload);
    },
    updateFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
      const index = state.familyMembers.familyMembers.findIndex(
        (fm) => fm.id === action.payload.id
      );
      if (index !== -1) {
        state.familyMembers.familyMembers[index] = action.payload;
      }
    },
    removeFamilyMember: (state, action: PayloadAction<string>) => {
      state.familyMembers.familyMembers = state.familyMembers.familyMembers.filter(
        (fm) => fm.id !== action.payload
      );
    },
    setFamilyMembersLoading: (state, action: PayloadAction<boolean>) => {
      state.familyMembers.isLoading = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
  setUser,
  updateUser,
  setAuthLoading,
  clearAuthError,
  setAppointments,
  addAppointment,
  updateAppointment,
  removeAppointment,
  setSelectedAppointment,
  setAppointmentsLoading,
  setAppointmentsError,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  setFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  setFamilyMembersLoading,
} = userSlice.actions;

export default userSlice.reducer;
