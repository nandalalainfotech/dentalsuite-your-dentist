import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  location: string;
  treatment: string;
  state: string;
  practiceType: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  priceRange: {
    min: number | null;
    max: number | null;
  };
  availability: string;
  rating: number | null;
  searchQuery: string;
}

const initialState: FilterState = {
  location: '',
  treatment: '',
  state: '',
  practiceType: '',
  dateRange: {
    start: null,
    end: null,
  },
  priceRange: {
    min: null,
    max: null,
  },
  availability: '',
  rating: null,
  searchQuery: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setLocationFilter: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setTreatmentFilter: (state, action: PayloadAction<string>) => {
      state.treatment = action.payload;
    },
    setStateFilter: (state, action: PayloadAction<string>) => {
      state.state = action.payload;
    },
    setPracticeTypeFilter: (state, action: PayloadAction<string>) => {
      state.practiceType = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<FilterState['dateRange']>) => {
      state.dateRange = action.payload;
    },
    setPriceRangeFilter: (state, action: PayloadAction<FilterState['priceRange']>) => {
      state.priceRange = action.payload;
    },
    setAvailabilityFilter: (state, action: PayloadAction<string>) => {
      state.availability = action.payload;
    },
    setRatingFilter: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSingleFilter: (state, action: PayloadAction<keyof FilterState>) => {
      if (action.payload === 'dateRange') {
        state.dateRange = { start: null, end: null };
      } else if (action.payload === 'priceRange') {
        state.priceRange = { min: null, max: null };
      } else {
        (state as Record<string, unknown>)[action.payload] = '';
      }
    },
    clearAllFilters: () => {
      return initialState;
    },
  },
});

export const {
  setLocationFilter,
  setTreatmentFilter,
  setStateFilter,
  setPracticeTypeFilter,
  setDateRangeFilter,
  setPriceRangeFilter,
  setAvailabilityFilter,
  setRatingFilter,
  setSearchQuery,
  clearSingleFilter,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
