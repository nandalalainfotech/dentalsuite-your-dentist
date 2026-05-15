import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { InviteUserData, PracticeUser, PracticeUserState, UpdateUserData } from './PracticeUserAccount.types';
import { PracticeUserAccountService } from './PracticeUserAccount.service';

const initialState: PracticeUserState = {
    users: [],
    loading: false,
    error: null,
    updateLoading: false,
    deleteLoading: false,
    inviteLoading: false,
};

// Async Thunks
export const fetchPracticeUsers = createAsyncThunk(
    'practiceUsers/fetch',
    async (practiceId: string, { rejectWithValue }) => {
        try {
            const accounts = await PracticeUserAccountService.fetchUsers(practiceId);

            const users: PracticeUser[] = accounts.map((account) => ({
                id: account.id,
                name: `${account.first_name || ''} ${account.last_name || ''}`.trim() || account.email,
                first_name: account.first_name,
                last_name: account.last_name,
                email: account.email,
                access_level: account.type || 'Dashboard and Sidebar',
                user_access: account.status === 'ACTIVE',
                multi_factor_auth: false,
                practice_id: account.practice_id,
                type: account.type,
                status: account.status,
                created_at: account.created_at,
                updated_at: account.updated_at,
            }));

            return users;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserAccess = createAsyncThunk(
    'practiceUsers/update',
    async (data: UpdateUserData, { rejectWithValue }) => {
        try {
            const updatedAccount = await PracticeUserAccountService.updateUser(data);
            return { ...data, updatedAccount };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'practiceUsers/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await PracticeUserAccountService.deleteUser(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const inviteUser = createAsyncThunk(
    'practiceUsers/invite',
    async (userData: InviteUserData, { rejectWithValue }) => {
        try {
            // Validate password before sending
            if (!userData.password) {
                throw new Error("Password is required");
            }

            const response = await PracticeUserAccountService.inviteUser(userData);
            const newAccount = response.user;

            const formattedUser: PracticeUser = {
                id: newAccount.id,
                name: `${newAccount.first_name || ''} ${newAccount.last_name || ''}`.trim() || newAccount.email,
                first_name: newAccount.first_name,
                last_name: newAccount.last_name,
                email: newAccount.email,
                access_level: newAccount.type || 'Dashboard and Sidebar',
                user_access: newAccount.status === 'ACTIVE',
                multi_factor_auth: false,
                practice_id: newAccount.practice_id,
                type: newAccount.type,
                status: newAccount.status,
                created_at: newAccount.created_at,
                updated_at: newAccount.updated_at,
            };

            return formattedUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const PracticeUserAccountSlice = createSlice({
    name: 'practiceUsers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetState: () => initialState,
        updateUserLocally: (state, action: PayloadAction<{ id: string; updates: Partial<PracticeUser> }>) => {
            const user = state.users.find(u => u.id === action.payload.id);
            if (user) {
                Object.assign(user, action.payload.updates);
            }
        },
        removeUserLocally: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchPracticeUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPracticeUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchPracticeUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update user
            .addCase(updateUserAccess.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateUserAccess.fulfilled, (state, action) => {
                state.updateLoading = false;
                const { id, access_level, user_access, multi_factor_auth } = action.payload;
                const user = state.users.find(u => u.id === id);
                if (user) {
                    if (access_level !== undefined) user.access_level = access_level;
                    if (user_access !== undefined) user.user_access = user_access;
                    if (multi_factor_auth !== undefined) user.multi_factor_auth = multi_factor_auth;
                    // Also update status based on user_access
                    if (user_access !== undefined) {
                        user.status = user_access ? 'ACTIVE' : 'INACTIVE';
                    }
                    if (access_level !== undefined) {
                        user.type = access_level;
                    }
                }
            })
            .addCase(updateUserAccess.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            })

            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload as string;
            })

            // Invite user
            .addCase(inviteUser.pending, (state) => {
                state.inviteLoading = true;
                state.error = null;
            })
            .addCase(inviteUser.fulfilled, (state, action) => {
                state.inviteLoading = false;
                state.users.push(action.payload);
            })
            .addCase(inviteUser.rejected, (state, action) => {
                state.inviteLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetState, updateUserLocally, removeUserLocally } = PracticeUserAccountSlice.actions;
export default PracticeUserAccountSlice.reducer;