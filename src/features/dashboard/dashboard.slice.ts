import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardState, PracticeProfile, UpdateProfilePayload } from "./dashboard.types";
import dashboardService from "./dashboard.service";

const initialState: DashboardState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "dashboard/fetchProfile",
  async (userId: string, thunkAPI) => {
    try {
      return await dashboardService.getProfile(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePracticeProfile = createAsyncThunk(
  "dashboard/updateProfile",
  async ({ id, data }: { id: string; data: UpdateProfilePayload }, thunkAPI) => {
    try {
      return await dashboardService.updateProfile(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<PracticeProfile>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePracticeProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePracticeProfile.fulfilled, (state, action: PayloadAction<PracticeProfile>) => {
        state.isLoading = false;
        state.profile = action.payload; // Update local state with new data
      })
      .addCase(updatePracticeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;