import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import appointmentsService from "./appointments.service";
import type { AppointmentsState } from "./appointments.type";

const initialState: AppointmentsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAll",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentsService.getAppointments(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Local Updates for Instant UI Feedback
    updateLocalStatus: (state, action: PayloadAction<{ id: string; status: any }>) => {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index].status = action.payload.status;
        state.items[index].updatedAt = new Date().toISOString();
      }
    },
    updateLocalReschedule: (state, action: PayloadAction<{ id: string; date: string; time: string }>) => {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index].appointmentDate = action.payload.date;
        state.items[index].appointmentTime = action.payload.time;
        state.items[index].status = 'confirmed';
        state.items[index].isRescheduled = true;
        state.items[index].updatedAt = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateLocalStatus, updateLocalReschedule } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;