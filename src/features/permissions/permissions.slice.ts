import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import permissionsService from "./permissions.service";
import type { PermissionsState, PracticeModulePermission, PracticePermissionsData } from "./permissions.types";

const initialState: PermissionsState = {
    practicePermissions: null,
    permissions: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
};

// Fetch practice permissions
export const fetchPracticePermissions = createAsyncThunk(
    "permissions/fetchPracticePermissions",
    async (practiceId: string, thunkAPI) => {
        try {
            const data = await permissionsService.getPracticePermissions(practiceId);
            return data || { permissions: [], default_permission: [] };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Update practice permissions
export const updatePracticePermissions = createAsyncThunk(
    "permissions/updatePracticePermissions",
    async (
        payload: { practiceId: string; permissions: PracticeModulePermission[] },
        thunkAPI
    ) => {
        try {
            const message = await permissionsService.updatePracticePermissions(
                payload.practiceId,
                payload.permissions
            );
            thunkAPI.dispatch(fetchPracticePermissions(payload.practiceId));
            return message;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const permissionsSlice = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        },
        resetPermissions: (state) => {
            state.permissions = [];
            state.practicePermissions = null;
        },
        setPermissions: (state, action: PayloadAction<PracticeModulePermission[]>) => {
            state.permissions = action.payload;
        },
        togglePermission: (state, action: PayloadAction<{ moduleKey: string; actionKey: string }>) => {
            const { moduleKey, actionKey } = action.payload;
            const moduleIndex = state.permissions.findIndex((p) => p.module === moduleKey);

            if (moduleIndex === -1) {
                state.permissions.push({ module: moduleKey, actions: [actionKey] });
            } else {
                const actions = [...state.permissions[moduleIndex].actions];
                const actionIndex = actions.indexOf(actionKey);

                if (actionIndex === -1) {
                    actions.push(actionKey);
                } else {
                    actions.splice(actionIndex, 1);
                }

                if (actions.length === 0) {
                    state.permissions.splice(moduleIndex, 1);
                } else {
                    state.permissions[moduleIndex].actions = actions;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch practice permissions
            .addCase(fetchPracticePermissions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPracticePermissions.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.practicePermissions = action.payload as PracticePermissionsData;
                    // Priority: permissions (custom) > default_permission (fallback)
                    const customPermissions = (action.payload as any).permissions || [];
                    const defaultPermissions = (action.payload as any).default_permission || [];

                    if (customPermissions.length > 0) {
                        state.permissions = customPermissions;
                    } else {
                        state.permissions = defaultPermissions;
                    }
                } else {
                    state.practicePermissions = null;
                    state.permissions = [];
                }
            })
            .addCase(fetchPracticePermissions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update practice permissions
            .addCase(updatePracticePermissions.pending, (state) => {
                state.isSaving = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updatePracticePermissions.fulfilled, (state, action) => {
                state.isSaving = false;
                state.successMessage = action.payload;
            })
            .addCase(updatePracticePermissions.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages, resetPermissions, togglePermission, setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;