import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { AuthState, User, SignupPayload } from "./auth.types";
import authService from "./auth.service";

// =========================
// INITIAL STATE
// =========================
const storedUser = sessionStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  isLoading: false,
  error: null,
};

// =========================
// LOGIN THUNK
// =========================
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, thunkAPI) => {
    try {
      const response = await authService.login({ email, password });

      const { user, accessToken, refreshToken } = response;

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);

      return user;
    } catch (error: any) {
      const message =
        error.message || "Login failed. Please check your credentials.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =========================
// SIGNUP THUNK
// =========================
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload: SignupPayload, thunkAPI) => {
    try {
      const response = await authService.signup(payload);
      return response;
    } catch (error: any) {
      const message =
        error.message || "Registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =========================
// LOGOUT THUNK (with cache clear and reload)
// =========================
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    // Clear sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");

    // Clear localStorage
    localStorage.clear();

    // Clear all caches
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }

    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }

    // Force reload to clear all memory and reset application state
    window.location.reload();

    return null;
  }
);

// =========================
// SLICE
// =========================
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // -------------------------
    // SET USER (manual login restore)
    // -------------------------
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // -------------------------
    // LOGOUT (synchronous without cache clear)
    // -------------------------
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");

      // Clear localStorage
      localStorage.clear();

      // Clear caches (fire and forget)
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(key => {
            caches.delete(key);
          });
        });
      }

      // Unregister service workers (fire and forget)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        });
      }

      // Optional: Force reload after a small delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },

    // -------------------------
    // RESET ERROR
    // -------------------------
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // =========================
      // LOGIN
      // =========================
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // =========================
      // SIGNUP
      // =========================
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<{ message: string; user: User }>) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // =========================
      // LOGOUT (async with reload)
      // =========================
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

// =========================
// EXPORTS
// =========================
export const { logout, resetError, setUser } = authSlice.actions;
export default authSlice.reducer;