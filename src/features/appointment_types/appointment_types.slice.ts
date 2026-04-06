import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentTypesService from "./appointment_types.service";
import type { AppointmentType, AppointmentTypesState, PractitionerSetting, TeamMemberApptContext } from "./appointment_types.types";

const initialState: AppointmentTypesState = {
  data: [],
  teamMembers: [],
  loading: false,
  error: null,
  saveLoading: false,
};

export const fetchAppointmentData = createAsyncThunk(
  "appointmentTypes/fetchData",
  async (practiceId: string, thunkAPI) => {
    try {
      return await appointmentTypesService.getAppointmentTypesData(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const saveAppointmentData = createAsyncThunk(
  "appointmentTypes/saveData",
  async (payload: {
    id?: string;
    data: AppointmentType;
    practiceId: string;
    settings: Record<string, PractitionerSetting>,
    teamMembers: TeamMemberApptContext[]
  },
    thunkAPI) => {
    try {
      await appointmentTypesService.saveFullAppointmentType({
        id: payload.id,
        data: payload.data,
        practiceId: payload.practiceId,
        practitionerSettings: payload.settings,
        teamMembers: payload.teamMembers
      });
      // Refresh after saving
      thunkAPI.dispatch(fetchAppointmentData(payload.practiceId));
      return payload.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteAppointmentType = createAsyncThunk(
  "appointmentTypes/delete",
  async (id: string, thunkAPI) => {
    try {
      return await appointmentTypesService.deleteAppointmentType(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const appointmentTypesSlice = createSlice({
  name: "appointmentTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentData.pending, (state) => { state.loading = true; })
      .addCase(fetchAppointmentData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.appointmentTypes;
        state.teamMembers = action.payload.teamMembers;
      })
      .addCase(fetchAppointmentData.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      })
      .addCase(saveAppointmentData.pending, (state) => { state.saveLoading = true; })
      .addCase(saveAppointmentData.fulfilled, (state) => { state.saveLoading = false; })
      .addCase(saveAppointmentData.rejected, (state) => { state.saveLoading = false; })
      .addCase(deleteAppointmentType.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
  },
});

export default appointmentTypesSlice.reducer;