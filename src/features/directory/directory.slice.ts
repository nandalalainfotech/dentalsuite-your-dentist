import { createSlice, createAsyncThunk, type PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import directoryService from "./directory.service";
import type { DirectoryProfile, DirectoryState, UpdateDirectoryPayload } from "./directory.types";

const initialState: DirectoryState = {
  data: null,
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
};

// --- CORE FETCH THUNK ---
export const fetchDirectory = createAsyncThunk(
  "directory/fetch",
  async (practiceId: string, thunkAPI) => {
    try {
      return await directoryService.getDirectory(practiceId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to load directory");
    }
  }
);

// --- CORE UPDATE THUNK ---
export const updateDirectoryInfo = createAsyncThunk(
  "directory/updateInfo",
  async (payload: UpdateDirectoryPayload, thunkAPI) => {
    try {
      const message = await directoryService.updateDirectory(payload);
      return { message, data: payload.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update directory");
    }
  }
);

// --- ARRAY UPDATE THUNKS ---
// (All of these dispatch fetchDirectory to refresh state automatically after saving)

export const updateDirectoryServices = createAsyncThunk("directory/updateServices",
  async (payload: { practiceId: string; services: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateServices(payload.practiceId, payload.services);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryCertifications = createAsyncThunk("directory/updateCertifications",
  async (payload: { practiceId: string; certifications: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateCertifications(payload.practiceId, payload.certifications);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryAchievements = createAsyncThunk("directory/updateAchievements",
  async (payload: { practiceId: string; achievements: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateAchievements(payload.practiceId, payload.achievements);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryTeam = createAsyncThunk("directory/updateTeam",
  async (payload: { practiceId: string; team: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateTeamMembers(payload.practiceId, payload.team);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const deleteDirectoryTeamMember = createAsyncThunk(
  "directory/deleteTeamMember",
  async (id: string, thunkAPI) => {
    try {
      return await directoryService.deleteTeamMember(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to delete member");
    }
  }
);

export const updateDirectoryGalleries = createAsyncThunk("directory/updateGalleries",
  async (payload: { practiceId: string; galleries: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateGalleries(payload.practiceId, payload.galleries);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryInsurances = createAsyncThunk("directory/updateInsurances",
  async (payload: { practiceId: string; insurances: string[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateInsurances(payload.practiceId, payload.insurances);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryFacilities = createAsyncThunk("directory/updateFacilities",
  async (payload: { practiceId: string; facilities: string[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateFacilities(payload.practiceId, payload.facilities);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryOpeningHours = createAsyncThunk("directory/updateOpeningHours",
  async (payload: { practiceId: string; hours: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateOpeningHours(payload.practiceId, payload.hours);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

export const updateDirectoryExceptions = createAsyncThunk("directory/updateExceptions",
  async (payload: { practiceId: string; exceptions: any[] },
    thunkAPI) => {
    try {
      const m = await directoryService.updateExceptions(payload.practiceId, payload.exceptions);
      thunkAPI.dispatch(fetchDirectory(payload.practiceId));
      return m;
    }
    catch (e: any) { return thunkAPI.rejectWithValue(e.message); }
  });

// --- SLICE CONFIG ---
export const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {
    clearDirectoryMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    clearDirectoryData: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    // 1. Handle Initial Data Fetch
    builder
      .addCase(fetchDirectory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDirectory.fulfilled, (state, action: PayloadAction<DirectoryProfile>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchDirectory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 2. Handle Core Data Update 
    builder
      .addCase(updateDirectoryInfo.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateDirectoryInfo.fulfilled, (state, action) => {
        state.isSaving = false;
        state.successMessage = action.payload.message;
        if (state.data) {
          state.data = { ...state.data, ...action.payload.data };
        }
      })
      .addCase(updateDirectoryInfo.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // 3. Handle Array Updates intelligently using addMatcher
    // This catches ANY "pending" state from our array update thunks and sets isSaving to true
    builder.addMatcher(
      isAnyOf(
        updateDirectoryServices.pending,
        updateDirectoryCertifications.pending,
        updateDirectoryAchievements.pending,
        updateDirectoryTeam.pending,
        updateDirectoryGalleries.pending,
        updateDirectoryInsurances.pending,
        updateDirectoryFacilities.pending,
        updateDirectoryOpeningHours.pending,
        updateDirectoryExceptions.pending
      ),
      (state) => {
        state.isSaving = true;
        state.error = null;
        state.successMessage = null;
      }
    );

    // This catches ANY "fulfilled" state from our array update thunks
    builder.addMatcher(
      isAnyOf(
        updateDirectoryServices.fulfilled,
        updateDirectoryCertifications.fulfilled,
        updateDirectoryAchievements.fulfilled,
        updateDirectoryTeam.fulfilled,
        updateDirectoryGalleries.fulfilled,
        updateDirectoryInsurances.fulfilled,
        updateDirectoryFacilities.fulfilled,
        updateDirectoryOpeningHours.fulfilled,
        updateDirectoryExceptions.fulfilled
      ),
      (state, action) => {
        state.isSaving = false;
        state.successMessage = action.payload as string;
      }
    );

    // This catches ANY "rejected" state from our array update thunks
    builder.addMatcher(
      isAnyOf(
        updateDirectoryServices.rejected,
        updateDirectoryCertifications.rejected,
        updateDirectoryAchievements.rejected,
        updateDirectoryTeam.rejected,
        updateDirectoryGalleries.rejected,
        updateDirectoryInsurances.rejected,
        updateDirectoryFacilities.rejected,
        updateDirectoryOpeningHours.rejected,
        updateDirectoryExceptions.rejected
      ),
      (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const { clearDirectoryMessages, clearDirectoryData } = directorySlice.actions;
export default directorySlice.reducer;