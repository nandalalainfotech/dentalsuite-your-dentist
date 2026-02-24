/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Appointment } from '../../types/booking';
import { bookingService } from '../../services/booking';

interface BookingState {
  appointments: Appointment[];
  currentBooking: {
    clinicId?: string;
    dentistId?: string;
    appointmentType?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    personalDetails?: any;
  };
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  appointments: [],
  currentBooking: {},
  currentStep: 1,
  isLoading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: any, { rejectWithValue }) => {
    try {
      const booking = await bookingService.createBooking(bookingData);
      return booking;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create booking');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'booking/fetchAppointments',
  async (userId: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const appointments = await bookingService.getAppointments(userId);
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointments');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'booking/cancelAppointment',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await bookingService.cancelAppointment(id);
      return success ? id : rejectWithValue('Failed to cancel appointment');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel appointment');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'booking/rescheduleAppointment',
  async ({ id, newDate, newTime }: { id: string; newDate: string; newTime: string }, { rejectWithValue }) => {
    try {
      const appointment = await bookingService.rescheduleAppointment(id, newDate, newTime);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reschedule appointment');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = { ...state.currentBooking, ...action.payload };
    },
    setBookingStep: (state, action) => {
      state.currentStep = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = {};
      state.currentStep = 1;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.appointments.push(action.payload);
          state.currentBooking = {};
          state.currentStep = 1;
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.appointments.findIndex((a) => a.id === action.payload!.id);
          if (index !== -1) {
            state.appointments[index] = action.payload;
          }
        }
      });
  },
});

export const { setCurrentBooking, setBookingStep, clearCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
