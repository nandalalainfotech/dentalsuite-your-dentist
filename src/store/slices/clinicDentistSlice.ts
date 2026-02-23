/* eslint-disable @typescript-eslint/no-empty-object-type */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Clinic, DentistWithClinic, Review } from '../../types';

interface ClinicState {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  isLoading: boolean;
  error: string | null;
}

interface DentistState {
  dentists: DentistWithClinic[];
  selectedDentist: DentistWithClinic | null;
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

interface InitialClinicState extends ClinicState { }
interface InitialDentistState extends DentistState { }

const initialClinicState: InitialClinicState = {
  clinics: [],
  selectedClinic: null,
  isLoading: false,
  error: null,
};

const initialDentistState: InitialDentistState = {
  dentists: [],
  selectedDentist: null,
  reviews: [],
  isLoading: false,
  error: null,
};

const clinicSlice = createSlice({
  name: 'clinic',
  initialState: initialClinicState,
  reducers: {
    fetchClinicsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchClinicsSuccess: (state, action: PayloadAction<Clinic[]>) => {
      state.isLoading = false;
      state.clinics = action.payload;
    },
    fetchClinicsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedClinic: (state, action: PayloadAction<Clinic | null>) => {
      state.selectedClinic = action.payload;
    },
    searchClinics: (state) => {
      state.isLoading = true;
    },
    filterClinics: (state) => {
      state.isLoading = true;
    },
    clearClinicFilters: (state) => {
      state.error = null;
    },
  },
});

const dentistSlice = createSlice({
  name: 'dentist',
  initialState: initialDentistState,
  reducers: {
    fetchDentistsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDentistsSuccess: (state, action: PayloadAction<DentistWithClinic[]>) => {
      state.isLoading = false;
      state.dentists = action.payload;
    },
    fetchDentistsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedDentist: (state, action: PayloadAction<DentistWithClinic | null>) => {
      state.selectedDentist = action.payload;
    },
    searchDentists: (state) => {
      state.isLoading = true;
    },
    filterDentists: (state) => {
      state.isLoading = true;
    },
    fetchReviewsRequest: (state) => {
      state.isLoading = true;
    },
    fetchReviewsSuccess: (state, action: PayloadAction<Review[]>) => {
      state.isLoading = false;
      state.reviews = action.payload;
    },
    fetchReviewsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.unshift(action.payload);
    },
  },
});

export const {
  fetchClinicsRequest,
  fetchClinicsSuccess,
  fetchClinicsFailure,
  setSelectedClinic,
  searchClinics,
  filterClinics,
  clearClinicFilters,
} = clinicSlice.actions;

export const {
  fetchDentistsRequest,
  fetchDentistsSuccess,
  fetchDentistsFailure,
  setSelectedDentist,
  searchDentists,
  filterDentists,
  fetchReviewsRequest,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  addReview,
} = dentistSlice.actions;

export const clinicReducer = clinicSlice.reducer;
export const dentistReducer = dentistSlice.reducer;
