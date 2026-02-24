/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { SearchFilters } from '../../types/filters';

interface FilterState {
  filters: SearchFilters;
  isLoading: boolean;
}

const initialState: FilterState = {
  filters: {
    service: '',
    location: '',
    language: '',
    gender: '',
    specialty: '',
    insurance: '',
    availableDays: '',
  },
  isLoading: false,
};

export const applyFilters = createAsyncThunk(
  'filters/applyFilters',
  async (filters: SearchFilters, { rejectWithValue }) => {
    try {
      return filters;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply filters');
    }
  }
);

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setFilterLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyFilters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyFilters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filters = action.payload;
      })
      .addCase(applyFilters.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setFilters, updateFilter, clearFilters, setFilterLoading } = filterSlice.actions;
export default filterSlice.reducer;
