// src/features/permissions/permissions.slice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import permissionsService from "./permissions.service";
import type { PermissionsState, PracticeModulePermission, PracticePermissionsData } from "./permissions.types";

const initialState: PermissionsState = {
    practicePermissions: null,
    loadedPracticeId: null,
    permissions: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
};

// Fetch practice permissions
export const fetchPracticePermissions = createAsyncThunk(
    "permissions/fetchPracticePermissions",
    async (userId: string, thunkAPI) => {
        try {
            const data = await permissionsService.getPracticePermissions(userId);
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
        payload: { userId: string; permissions: PracticeModulePermission[] },
        thunkAPI
    ) => {
        try {
            const message = await permissionsService.updatePracticePermissions(
                payload.userId,
                payload.permissions
            );
            thunkAPI.dispatch(fetchPracticePermissions(payload.userId));
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
            state.loadedPracticeId = null;
        },
        setPermissions: (state, action: PayloadAction<PracticeModulePermission[]>) => {
            state.permissions = action.payload;
        },
        togglePermission: (state, action: PayloadAction<{ moduleKey: string; actionKey: string }>) => {
            const { moduleKey, actionKey } = action.payload;
            const moduleIndex = state.permissions.findIndex((p) => p.module === moduleKey);

            if (moduleIndex === -1) {
                // Create new module with the action
                state.permissions.push({ module: moduleKey, actions: [actionKey] });
            } else {
                // Create a new array to avoid mutation issues
                const currentActions = [...state.permissions[moduleIndex].actions];
                const actionIndex = currentActions.indexOf(actionKey);

                if (actionIndex === -1) {
                    currentActions.push(actionKey);
                } else {
                    currentActions.splice(actionIndex, 1);
                }

                if (currentActions.length === 0) {
                    // Remove the module if no actions left
                    state.permissions.splice(moduleIndex, 1);
                } else {
                    // Update the actions
                    state.permissions[moduleIndex].actions = currentActions;
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch practice permissions
            .addCase(fetchPracticePermissions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.loadedPracticeId = null;
            })
            .addCase(fetchPracticePermissions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loadedPracticeId = action.meta.arg;
                if (action.payload) {
                    // Store the full practice permissions data
                    state.practicePermissions = action.payload as PracticePermissionsData;

                    // Get custom permissions and default permissions
                    const customPermissions = (action.payload as any).permissions || [];
                    const defaultPermissions = (action.payload as any).default_permission || [];

                    // Priority: use custom permissions if they exist and are not empty
                    let permissionsToUse = [];

                    if (Array.isArray(customPermissions) && customPermissions.length > 0) {
                        permissionsToUse = customPermissions;
                    } else if (Array.isArray(defaultPermissions) && defaultPermissions.length > 0) {
                        permissionsToUse = defaultPermissions;
                    }

                    // Ensure each permission has the correct structure
                    state.permissions = permissionsToUse.map((perm: any) => ({
                        module: perm.module || perm.module_key,
                        actions: Array.isArray(perm.actions) ? [...perm.actions] : []
                    }));

                } else {
                    state.practicePermissions = null;
                    state.permissions = [];
                }
            })
            .addCase(fetchPracticePermissions.rejected, (state, action) => {
                state.isLoading = false;
                state.loadedPracticeId = action.meta.arg;
                state.error = action.payload as string;
                console.error("Fetch permissions error:", action.payload);
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
                console.log("Permissions updated successfully:", action.payload);
            })
            .addCase(updatePracticePermissions.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
                console.error("Update permissions error:", action.payload);
            });
    },
});

export const { clearMessages, resetPermissions, togglePermission, setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
