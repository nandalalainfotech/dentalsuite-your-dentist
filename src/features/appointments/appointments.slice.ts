import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  isAnyOf
} from "@reduxjs/toolkit";
import appointmentsService from "./appointments.service";
import type { OnlineBooking, Practitioner } from "./appointments.type";

interface AppointmentsState {
  list: OnlineBooking[];
  practitioners: Practitioner[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AppointmentsState = {
  list: [],
  practitioners: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  successMessage: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetch",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentsService.getAppointments(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch appointments");
    }
  }
);

export const fetchPractitioners = createAsyncThunk(
  "appointments/fetchPractitioners",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentsService.getPractitioners(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const updatedData = await appointmentsService.updateStatus(id, status);
      return updatedData; // Returns the updated fields from API
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update status");
    }
  }
);

export const rescheduleBooking = createAsyncThunk(
  "appointments/reschedule",
  async ({ id, date, time }: { id: string; date: string; time: string }, thunkAPI) => {
    try {
      const updatedData = await appointmentsService.reschedule(id, date, time);
      return updatedData; // Returns the updated fields from API
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to reschedule");
    }
  }
);

// --- SLICE ---

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // 1. Fetch Logic
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<OnlineBooking[]>) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(fetchPractitioners.fulfilled, (state, action) => {
      state.practitioners = action.payload;
    });

    // 2. Shared Update/Reschedule Logic (Pending)
    builder.addMatcher(
      isAnyOf(updateBookingStatus.pending, rescheduleBooking.pending),
      (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      }
    );

    // 3. Shared Update/Reschedule Logic (Fulfilled)
    builder.addMatcher(
      isAnyOf(updateBookingStatus.fulfilled, rescheduleBooking.fulfilled),
      (state, action: PayloadAction<OnlineBooking>) => {
        state.isUpdating = false;
        state.successMessage = "Action completed successfully";

        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = {
            ...state.list[index],
            ...action.payload
          };
        }
      }
    );

    // 4. Shared Update/Reschedule Logic (Rejected)
    builder.addMatcher(
      isAnyOf(updateBookingStatus.rejected, rescheduleBooking.rejected),
      (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const { clearMessages } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;