import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { PractitionerDetails } from './practitionerProfile.types';
import { practitionerProfileApi } from './practitionerProfile.service';

interface PractitionerProfileState {
    practitioner: PractitionerDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: PractitionerProfileState = {
    practitioner: null,
    loading: false,
    error: null,
};

export const fetchPractitionerById = createAsyncThunk(
    'practitionerProfile/fetchById',
    async (id: string) => {
        const response = await practitionerProfileApi.getPractitionerById(id);
        return response;
    }
);

const practitionerProfileSlice = createSlice({
    name: 'practitionerProfile',
    initialState,
    reducers: {
        clearPractitioner: (state) => {
            state.practitioner = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPractitionerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPractitionerById.fulfilled, (state, action: PayloadAction<PractitionerDetails>) => {
                state.loading = false;
                state.practitioner = action.payload;
            })
            .addCase(fetchPractitionerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch practitioner details';
            });
    },
});

export const { clearPractitioner } = practitionerProfileSlice.actions;
export default practitionerProfileSlice.reducer;