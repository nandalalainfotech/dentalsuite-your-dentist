import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Practice } from '../../types/auth';

interface SuperAdminAuthState {
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'superadmin';
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SuperAdminPracticesState {
  practices: Practice[];
  selectedPractice: Practice | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    state: string;
    search: string;
  };
}

interface SuperAdminUsersState {
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    status: 'active' | 'inactive';
  }>;
  selectedUser: unknown | null;
  isLoading: boolean;
  error: string | null;
}

interface SuperAdminAnalyticsState {
  overview: {
    totalPractices: number;
    activePractices: number;
    totalUsers: number;
    totalAppointments: number;
    totalRevenue: number;
    monthlyGrowth: number;
  } | null;
  revenueStats: Array<{
    month: string;
    revenue: number;
  }>;
  userStats: Array<{
    month: string;
    newUsers: number;
  }>;
  appointmentStats: Array<{
    month: string;
    appointments: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
  isLoading: boolean;
  error: string | null;
}

interface SuperAdminSettingsState {
  settings: {
    siteName: string;
    supportEmail: string;
    commissionRate: number;
    subscriptionPlans: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  } | null;
  isLoading: boolean;
}

interface SuperAdminDashboardState {
  data: {
    recentPractices: Practice[];
    recentAppointments: Array<{
      id: string;
      practiceName: string;
      patientName: string;
      dateTime: string;
      status: string;
    }>;
    pendingApprovals: number;
    notifications: Array<{
      id: string;
      type: string;
      message: string;
      timestamp: string;
    }>;
  } | null;
  isLoading: boolean;
  error: string | null;
}

interface SuperAdminState {
  auth: SuperAdminAuthState;
  practices: SuperAdminPracticesState;
  users: SuperAdminUsersState;
  analytics: SuperAdminAnalyticsState;
  settings: SuperAdminSettingsState;
  dashboard: SuperAdminDashboardState;
}

const initialAuthState: SuperAdminAuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const initialPracticesState: SuperAdminPracticesState = {
  practices: [],
  selectedPractice: null,
  isLoading: false,
  error: null,
  filters: {
    status: '',
    state: '',
    search: '',
  },
};

const initialUsersState: SuperAdminUsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

const initialAnalyticsState: SuperAdminAnalyticsState = {
  overview: null,
  revenueStats: [],
  userStats: [],
  appointmentStats: [],
  dateRange: {
    start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    end: new Date().toISOString(),
  },
  isLoading: false,
  error: null,
};

const initialSettingsState: SuperAdminSettingsState = {
  settings: null,
  isLoading: false,
};

const initialDashboardState: SuperAdminDashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

const initialState: SuperAdminState = {
  auth: initialAuthState,
  practices: initialPracticesState,
  users: initialUsersState,
  analytics: initialAnalyticsState,
  settings: initialSettingsState,
  dashboard: initialDashboardState,
};

const superadminSlice = createSlice({
  name: 'superadmin',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ admin: SuperAdminAuthState['admin']; token: string }>) => {
      state.auth.isLoading = false;
      state.auth.isAuthenticated = true;
      state.auth.admin = action.payload.admin;
      state.auth.token = action.payload.token;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.auth.isLoading = false;
      state.auth.error = action.payload;
    },
    logout: (state) => {
      state.auth.admin = null;
      state.auth.token = null;
      state.auth.isAuthenticated = false;
      state.auth.isLoading = false;
    },
    setSuperadmin: (state, action: PayloadAction<SuperAdminAuthState['admin']>) => {
      state.auth.admin = action.payload;
      state.auth.isAuthenticated = true;
      state.auth.isLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.auth.isLoading = action.payload;
    },
    clearAuthError: (state) => {
      state.auth.error = null;
    },
    setPractices: (state, action: PayloadAction<Practice[]>) => {
      state.practices.practices = action.payload;
      state.practices.isLoading = false;
    },
    addPractice: (state, action: PayloadAction<Practice>) => {
      state.practices.practices.unshift(action.payload);
    },
    updatePractice: (state, action: PayloadAction<Practice>) => {
      const index = state.practices.practices.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.practices.practices[index] = action.payload;
      }
    },
    removePractice: (state, action: PayloadAction<string>) => {
      state.practices.practices = state.practices.practices.filter(
        (p) => p.id !== action.payload
      );
    },
    approvePractice: (state, action: PayloadAction<string>) => {
      const practice = state.practices.practices.find(
        (p) => p.id === action.payload
      );
      if (practice) {
        practice.status = 'active';
      }
    },
    rejectPractice: (state, action: PayloadAction<string>) => {
      const practice = state.practices.practices.find(
        (p) => p.id === action.payload
      );
      if (practice) {
        practice.status = 'rejected';
      }
    },
    suspendPractice: (state, action: PayloadAction<string>) => {
      const practice = state.practices.practices.find(
        (p) => p.id === action.payload
      );
      if (practice) {
        practice.status = 'suspended';
      }
    },
    activatePractice: (state, action: PayloadAction<string>) => {
      const practice = state.practices.practices.find(
        (p) => p.id === action.payload
      );
      if (practice) {
        practice.status = 'active';
      }
    },
    setSelectedPractice: (state, action: PayloadAction<Practice | null>) => {
      state.practices.selectedPractice = action.payload;
    },
    setPracticesFilters: (state, action: PayloadAction<Partial<SuperAdminPracticesState['filters']>>) => {
      state.practices.filters = { ...state.practices.filters, ...action.payload };
    },
    setPracticesLoading: (state, action: PayloadAction<boolean>) => {
      state.practices.isLoading = action.payload;
    },
    setPracticesError: (state, action: PayloadAction<string | null>) => {
      state.practices.error = action.payload;
      state.practices.isLoading = false;
    },
    setUsers: (state, action: PayloadAction<SuperAdminUsersState['users']>) => {
      state.users.users = action.payload;
      state.users.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<SuperAdminUsersState['users'][0]>) => {
      const index = state.users.users.findIndex(
        (u) => u.id === action.payload.id
      );
      if (index !== -1) {
        state.users.users[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users.users = state.users.users.filter(
        (u) => u.id !== action.payload
      );
    },
    setSelectedUser: (state, action: PayloadAction<unknown | null>) => {
      state.users.selectedUser = action.payload;
    },
    setUsersLoading: (state, action: PayloadAction<boolean>) => {
      state.users.isLoading = action.payload;
    },
    setAnalytics: (state, action: PayloadAction<SuperAdminAnalyticsState['overview']>) => {
      state.analytics.overview = action.payload;
      state.analytics.isLoading = false;
    },
    setRevenueStats: (state, action: PayloadAction<SuperAdminAnalyticsState['revenueStats']>) => {
      state.analytics.revenueStats = action.payload;
    },
    setUserStats: (state, action: PayloadAction<SuperAdminAnalyticsState['userStats']>) => {
      state.analytics.userStats = action.payload;
    },
    setAppointmentStats: (state, action: PayloadAction<SuperAdminAnalyticsState['appointmentStats']>) => {
      state.analytics.appointmentStats = action.payload;
    },
    setDateRange: (state, action: PayloadAction<SuperAdminAnalyticsState['dateRange']>) => {
      state.analytics.dateRange = action.payload;
    },
    setAnalyticsLoading: (state, action: PayloadAction<boolean>) => {
      state.analytics.isLoading = action.payload;
    },
    setAnalyticsError: (state, action: PayloadAction<string | null>) => {
      state.analytics.error = action.payload;
      state.analytics.isLoading = false;
    },
    setSettings: (state, action: PayloadAction<SuperAdminSettingsState['settings']>) => {
      state.settings.settings = action.payload;
      state.settings.isLoading = false;
    },
    updateSettings: (state, action: PayloadAction<SuperAdminSettingsState['settings']>) => {
      state.settings.settings = action.payload;
    },
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.settings.isLoading = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<SuperAdminDashboardState['data']>) => {
      state.dashboard.data = action.payload;
      state.dashboard.isLoading = false;
    },
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.dashboard.isLoading = action.payload;
    },
    setDashboardError: (state, action: PayloadAction<string | null>) => {
      state.dashboard.error = action.payload;
      state.dashboard.isLoading = false;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setSuperadmin,
  setAuthLoading,
  clearAuthError,
  setPractices,
  addPractice,
  updatePractice,
  removePractice,
  approvePractice,
  rejectPractice,
  suspendPractice,
  activatePractice,
  setSelectedPractice,
  setPracticesFilters,
  setPracticesLoading,
  setPracticesError,
  setUsers,
  updateUser,
  removeUser,
  setSelectedUser,
  setUsersLoading,
  setAnalytics,
  setRevenueStats,
  setUserStats,
  setAppointmentStats,
  setDateRange,
  setAnalyticsLoading,
  setAnalyticsError,
  setSettings,
  updateSettings,
  setSettingsLoading,
  setDashboardData,
  setDashboardLoading,
  setDashboardError,
} = superadminSlice.actions;

export default superadminSlice.reducer;
