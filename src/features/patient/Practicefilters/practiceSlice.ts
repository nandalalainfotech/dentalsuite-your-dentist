import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { PracticeInfo, SearchResult, LocationResult } from './practice.types';
import { practiceApi } from './practice.service';
import type { RootState } from '../../../store';

interface PracticeState {

    clinics: PracticeInfo[];
    loading: boolean;
    filterLoading: boolean;
    activeRequests: number;
    error: string | null;

    // Filter options
    specialties: string[];
    languages: string[];
    insurances: string[];
    availableDays: string[];
    genders: string[];

    // Selected filters
    selectedSpecialties: string[];
    selectedLanguages: string[];
    selectedGenders: string[];
    selectedInsurances: string[];
    selectedDays: string[];

    // NEW: Main search selections
    selectedService: SearchResult | null;
    selectedLocation: LocationResult | null;

    filtersApplied: boolean;
}

const initialState: PracticeState = {
    clinics: [],
    loading: false,
    filterLoading: false,
    activeRequests: 0,
    error: null,

    specialties: [],
    languages: [],
    insurances: [],
    availableDays: [],
    genders: ['Male', 'Female', 'Other'],

    selectedSpecialties: [],
    selectedLanguages: [],
    selectedGenders: [],
    selectedInsurances: [],
    selectedDays: [],
    selectedService: null,
    selectedLocation: null,

    filtersApplied: false,
};

// Load filter options
export const getFilterOptions = createAsyncThunk(
    'practice/getFilterOptions',
    async () => {
        const response = await practiceApi.getFilterOptions();
        return response;
    }
);

// Fetch clinics with combined filters
export const fetchClinicsWithFilters = createAsyncThunk(
    'practice/fetchClinicsWithFilters',
    async (_, { getState }) => {
        const state = getState() as RootState;
        const {
            selectedSpecialties,
            selectedLanguages,
            selectedGenders,
            selectedInsurances,
            selectedDays,
            selectedService,
            selectedLocation,
        } = state.practice;

        const response = await practiceApi.filterClinicsWithSearch({
            // Main search
            serviceType: selectedService?.type,
            serviceId: selectedService?.id,
            serviceName: selectedService?.name,
            locationCity: selectedLocation?.city,
            locationState: selectedLocation?.state,
            locationPostcode: selectedLocation?.postcode,

            // Sidebar filters
            specialties: selectedSpecialties,
            languages: selectedLanguages,
            genders: selectedGenders,
            insurances: selectedInsurances,
            days: selectedDays,
        });
        return response;
    }
);

const practiceSlice = createSlice({
    name: 'practice',
    initialState,
    reducers: {
        setSelectedSpecialties: (state, action: PayloadAction<string[]>) => {
            state.selectedSpecialties = action.payload;
            state.filtersApplied = hasAnyFilter(state as any);
        },
        setSelectedLanguages: (state, action: PayloadAction<string[]>) => {
            state.selectedLanguages = action.payload;
            state.filtersApplied = hasAnyFilter(state);
        },
        setSelectedGenders: (state, action: PayloadAction<string[]>) => {
            state.selectedGenders = action.payload;
            state.filtersApplied = hasAnyFilter(state);
        },
        setSelectedInsurances: (state, action: PayloadAction<string[]>) => {
            state.selectedInsurances = action.payload;
            state.filtersApplied = hasAnyFilter(state);
        },
        setSelectedDays: (state, action: PayloadAction<string[]>) => {
            state.selectedDays = action.payload;
            state.filtersApplied = hasAnyFilter(state);
        },
        setSelectedService: (state, action: PayloadAction<SearchResult | null>) => {
            state.selectedService = action.payload;
            state.filtersApplied = hasAnyFilter(state);
        },
        setSelectedLocation: (state, action: PayloadAction<LocationResult | null>) => {
            state.selectedLocation = action.payload;
            state.filtersApplied = hasAnyFilter(state);
        },
        clearAllFilters: (state) => {
            state.selectedSpecialties = [];
            state.selectedLanguages = [];
            state.selectedGenders = [];
            state.selectedInsurances = [];
            state.selectedDays = [];
            state.selectedService = null;
            state.selectedLocation = null;
            state.clinics = [];
            state.filtersApplied = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFilterOptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFilterOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.specialties = action.payload.specialties || [];
                state.languages = action.payload.languages || [];
                state.insurances = action.payload.insurances || [];
                state.availableDays =
                    action.payload.availableDays?.length > 0
                        ? action.payload.availableDays
                        : [
                            'Monday', 'Tuesday', 'Wednesday',
                            'Thursday', 'Friday', 'Saturday', 'Sunday',
                        ];
                state.genders =
                    action.payload.genders?.length > 0
                        ? action.payload.genders
                        : ['Male', 'Female', 'Other'];
            })
            .addCase(getFilterOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch filter options';
            })
            .addCase(fetchClinicsWithFilters.pending, (state) => {
                state.activeRequests += 1;
                state.filterLoading = true;
                state.error = null;
            })

            .addCase(fetchClinicsWithFilters.fulfilled, (state, action) => {
                state.activeRequests -= 1;

                if (state.activeRequests <= 0) {
                    state.activeRequests = 0;
                    state.filterLoading = false;
                }

                state.clinics = action.payload;
            })
            .addCase(fetchClinicsWithFilters.rejected, (state, action) => {
                state.activeRequests -= 1;

                if (state.activeRequests <= 0) {
                    state.activeRequests = 0;
                    state.filterLoading = false;
                }

                state.error = action.error.message || 'Failed to fetch clinics';
            });
    },
});

function hasAnyFilter(state: PracticeState): boolean {
    return (
        state.selectedSpecialties.length > 0 ||
        state.selectedLanguages.length > 0 ||
        state.selectedGenders.length > 0 ||
        state.selectedInsurances.length > 0 ||
        state.selectedDays.length > 0 ||
        state.selectedService !== null ||
        state.selectedLocation !== null
    );
}

export const {
    setSelectedSpecialties,
    setSelectedLanguages,
    setSelectedGenders,
    setSelectedInsurances,
    setSelectedDays,
    setSelectedService,
    setSelectedLocation,
    clearAllFilters,
} = practiceSlice.actions;

export default practiceSlice.reducer;