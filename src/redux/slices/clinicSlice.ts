/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Clinic } from '../../types/clinic';
import type { SearchFilters } from '../../types/filters';
import { clinicService } from '../../services/clinic';

interface ClinicState {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClinicState = {
  clinics: [],
  selectedClinic: null,
  isLoading: false,
  error: null,
};

export const fetchClinics = createAsyncThunk(
  'clinics/fetchClinics',
  async (filters: SearchFilters | undefined = undefined, { rejectWithValue }) => {
    try {
      const clinics = await clinicService.getAllClinics(filters);
      return clinics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch clinics');
    }
  }
);

export const fetchClinicById = createAsyncThunk(
  'clinics/fetchClinicById',
  async (id: string, { rejectWithValue }) => {
    try {
      const clinic = await clinicService.getClinicById(id);
      return clinic;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch clinic');
    }
  }
);

export const searchClinics = createAsyncThunk(
  'clinics/searchClinics',
  async (query: string, { rejectWithValue }) => {
    try {
      const clinics = await clinicService.searchClinics(query);
      return clinics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search clinics');
    }
  }
);

export const createClinic = createAsyncThunk(
  'clinics/createClinic',
  async (clinic: Partial<Clinic>, { rejectWithValue }) => {
    try {
      const newClinic = await clinicService.createClinic(clinic);
      return newClinic;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create clinic');
    }
  }
);

export const updateClinic = createAsyncThunk(
  'clinics/updateClinic',
  async ({ id, data }: { id: string; data: Partial<Clinic> }, { rejectWithValue }) => {
    try {
      const updatedClinic = await clinicService.updateClinic(id, data);
      return updatedClinic;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update clinic');
    }
  }
);

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setSelectedClinic: (state, action) => {
      state.selectedClinic = action.payload;
    },
    clearClinics: (state) => {
      state.clinics = [];
      state.selectedClinic = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clinics = action.payload;
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClinicById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClinicById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedClinic = action.payload;
      })
      .addCase(fetchClinicById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchClinics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchClinics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clinics = action.payload;
      })
      .addCase(searchClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createClinic.fulfilled, (state, action) => {
        if (action.payload) {
          state.clinics.push(action.payload);
        }
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.clinics.findIndex((c) => c.id === action.payload!.id);
          if (index !== -1) {
            state.clinics[index] = action.payload;
          }
          if (state.selectedClinic?.id === action.payload.id) {
            state.selectedClinic = action.payload;
          }
        }
      });
  },
});

export const { setSelectedClinic, clearClinics, clearError } = clinicSlice.actions;
export default clinicSlice.reducer;
