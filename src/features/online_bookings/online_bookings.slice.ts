import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  isAnyOf
} from "@reduxjs/toolkit";
import appointmentsService from "./online_bookings.service";
import type {
  OnlineBooking,
  Practitioner,
  PracticeService,
  PracticeOpeningHours,
  PractitionerBreak
} from "./online_bookings.type";

// Updated this interface to use the strict types rather than 'any[]'
interface AppointmentsState {
  list: OnlineBooking[];
  practitioners: Practitioner[];
  services: PracticeService[];
  openingHours: PracticeOpeningHours[];
  breaks: PractitionerBreak[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AppointmentsState = {
  list: [],
  practitioners: [],
  services: [],
  openingHours: [],
  breaks: [],
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

export const fetchPracticeServices = createAsyncThunk(
  "appointments/fetchServices",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentsService.getPracticeServices(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOpeningHours = createAsyncThunk(
  "appointments/fetchOpeningHours",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentsService.getOpeningHours(practiceId);
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
      return updatedData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update status");
    }
  }
);

export const rescheduleBooking = createAsyncThunk(
  "appointments/reschedule",
  async ({ id, date, time, practitionerId }: { id: string; date: string; time: string, practitionerId: string }, thunkAPI) => {
    try {
      const updatedData = await appointmentsService.reschedule(id, date, time, practitionerId);
      return updatedData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to reschedule");
    }
  }
);

export const fetchBreaks = createAsyncThunk(
  "appointments/fetchBreaks",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentsService.getBreaks(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createBreak = createAsyncThunk(
  "appointments/createBreak",
  async (breakData: Omit<PractitionerBreak, "id">, thunkAPI) => {
    try {
      return await appointmentsService.insertBreak(breakData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editBreak = createAsyncThunk(
  "appointments/editBreak",
  async ({ id, data }: { id: string, data: Partial<PractitionerBreak> }, thunkAPI) => {
    try {
      return await appointmentsService.updateBreak(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeBreak = createAsyncThunk(
  "appointments/removeBreak",
  async (id: string, thunkAPI) => {
    try {
      return await appointmentsService.deleteBreak(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
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

    builder.addCase(fetchPractitioners.fulfilled, (state, action: PayloadAction<Practitioner[]>) => {
      state.practitioners = action.payload;
    });

    builder.addCase(fetchPracticeServices.fulfilled, (state, action: PayloadAction<PracticeService[]>) => {
      state.services = action.payload;
    });

    builder.addCase(fetchOpeningHours.fulfilled, (state, action: PayloadAction<PracticeOpeningHours[]>) => {
      state.openingHours = action.payload;
    });

    builder.addCase(fetchBreaks.fulfilled, (state, action: PayloadAction<PractitionerBreak[]>) => {
      state.breaks = action.payload;
    });

    builder.addCase(createBreak.fulfilled, (state, action: PayloadAction<PractitionerBreak>) => {
      state.breaks.push(action.payload);
      state.isUpdating = false;
      state.successMessage = "Break added successfully";
    });

    builder.addCase(editBreak.fulfilled, (state, action: PayloadAction<PractitionerBreak>) => {
      const index = state.breaks.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.breaks[index] = action.payload;
      }
      state.isUpdating = false;
      state.successMessage = "Break updated successfully";
    });

    builder.addCase(removeBreak.fulfilled, (state, action: PayloadAction<string>) => {
      state.breaks = state.breaks.filter(b => b.id !== action.payload);
      state.isUpdating = false;
      state.successMessage = "Break removed successfully";
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
          if (action.payload.practitioner) {
            state.list[index].practitioner = action.payload.practitioner;

            if (action.payload.practitioner_id) {
              state.list[index].practitioner_id = action.payload.practitioner_id;
            }
          }
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