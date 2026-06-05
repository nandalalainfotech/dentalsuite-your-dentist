// clinicProfile.slice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ClinicProfileData } from './clinicProfile.types';
import { clinicProfileApi } from './clinicProfile.service';

// Define the state interface
interface ClinicProfileState {
    currentClinic: ClinicProfileData | null;
    loading: boolean;
    error: string | null;
    selectedDentistId: string | null;
    selectedServiceId: string | null;
}

// Initial state
const initialState: ClinicProfileState = {
    currentClinic: null,
    loading: false,
    error: null,
    selectedDentistId: null,
    selectedServiceId: null,
};

// Async thunk for fetching clinic by ID
export const fetchClinicById = createAsyncThunk(
    'clinicProfile/fetchClinicById',
    async (id: string, { rejectWithValue }) => {
        try {
            const clinicData = await clinicProfileApi.getClinicById(id);
            return clinicData;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch clinic details'
            );
        }
    }
);

// Create the slice
const clinicProfileSlice = createSlice({
    name: 'clinicProfile',
    initialState,
    reducers: {
        // Clear clinic data
        clearClinicData: (state) => {
            state.currentClinic = null;
            state.selectedDentistId = null;
            state.selectedServiceId = null;
            state.error = null;
        },

        // Set selected dentist
        setSelectedDentist: (state, action: PayloadAction<string | null>) => {
            state.selectedDentistId = action.payload;
        },

        // Set selected service
        setSelectedService: (state, action: PayloadAction<string | null>) => {
            state.selectedServiceId = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset selections
        resetSelections: (state) => {
            state.selectedDentistId = null;
            state.selectedServiceId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch clinic pending
            .addCase(fetchClinicById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fetch clinic fulfilled
            .addCase(fetchClinicById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentClinic = action.payload;
                // Set default selected dentist if available
                if (action.payload?.practice_team_members?.length > 0 && !state.selectedDentistId) {
                    state.selectedDentistId = action.payload.practice_team_members[0].id;
                }
            })
            // Fetch clinic rejected
            .addCase(fetchClinicById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Export actions
export const {
    clearClinicData,
    setSelectedDentist,
    setSelectedService,
    clearError,
    resetSelections,
} = clinicProfileSlice.actions;

// Export selectors
export const selectCurrentClinic = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic;

export const selectClinicLoading = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.loading;

export const selectClinicError = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.error;

export const selectSelectedDentistId = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.selectedDentistId;

export const selectSelectedServiceId = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.selectedServiceId;

export const selectTeamMembers = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_team_members || [];

export const selectGalleryImages = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_galleries?.map(img => img.image_url) || [];

export const selectServices = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_services || [];

export const selectAchievements = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_achievements || [];

export const selectCertifications = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_certifications || [];

export const selectInsurances = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_insurances || [];

export const selectFacilities = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_facilities || [];

export const selectOpeningHours = (state: { clinicProfile: ClinicProfileState }) =>
    state.clinicProfile.currentClinic?.practice_opening_hours || [];

// Export the reducer
export default clinicProfileSlice.reducer;