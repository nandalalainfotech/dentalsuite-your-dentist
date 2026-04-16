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
      const responseMessage = await authService.signup(payload);
      return responseMessage;
    } catch (error: any) {
      const message =
        error.message || "Registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
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
    // LOGOUT
    // -------------------------
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
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

      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;

        // IMPORTANT:
        // user is NOT set here because account is still PENDING
        state.isAuthenticated = false;
        state.user = null;
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// =========================
// EXPORTS
// =========================
export const { logout, resetError, setUser } = authSlice.actions;
export default authSlice.reducer;