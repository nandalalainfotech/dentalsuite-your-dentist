import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, SignupPayload } from "./auth.types"; // <-- Added SignupPayload
import authService from "./auth.service";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// --- Async Thunks ---

// 1. Login Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, thunkAPI) => {
    try {
      const user = await authService.login({ email, password });
      // Save to sessionStorage automatically on success
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", user.token); 
      return user;
    } catch (error: any) {
      // Since your auth.service.ts throws standard Error objects, error.message works perfectly
      const message = error.message || "Login failed. Please check your credentials.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 2. NEW: Signup Thunk
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload: SignupPayload, thunkAPI) => {
    try {
      // Calls your GraphQL mutation via auth.service.ts
      const responseMessage = await authService.signup(payload);
      return responseMessage; // Returns: "Registration successful! Waiting for approval."
    } catch (error: any) {
      const message = error.message || "Registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Slice ---

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Login Cases ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // --- NEW: Signup Cases ---
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        // IMPORTANT: We do NOT set user or isAuthenticated to true 
        // because the new practice is PENDING approval.
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, resetError, setUser } = authSlice.actions;
export default authSlice.reducer;