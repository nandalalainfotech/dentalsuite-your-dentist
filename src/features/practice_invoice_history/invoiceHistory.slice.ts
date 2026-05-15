import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import invoiceHistoryService from "./invoiceHistory.service";
import type {
    DisputedAppointment,
    DisputeStatus,
    FetchDisputesParams,
    InvoiceHistoryState,
    ResolveDisputePayload,
    UpdateDisputeStatusPayload
} from "./invoiceHistory.type";

const initialState: InvoiceHistoryState = {
    disputes: [],
    completedNewPatients: [],
    cancelledNewPatients: [],
    approvedDisputes: [],
    dispute: [],
    isLoading: false,
    isUpdating: false,
    error: null,
    successMessage: null,
    totalCount: 0,
    filters: {
        status: 'all',
    },
};

// --- Async Thunks ---

export const fetchDisputes = createAsyncThunk(
    "invoiceHistory/fetchDisputes",
    async (params: FetchDisputesParams, thunkAPI) => {
        try {
            const result = await invoiceHistoryService.fetchDisputes(params);
            return result;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to fetch disputes");
        }
    }
);

export const updateDisputeStatus = createAsyncThunk(
    "invoiceHistory/updateStatus",
    async (payload: UpdateDisputeStatusPayload, thunkAPI) => {
        try {
            const updated = await invoiceHistoryService.updateDisputeStatus(payload);
            return updated;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to update dispute status");
        }
    }
);

export const resolveDispute = createAsyncThunk(
    "invoiceHistory/resolveDispute",
    async (payload: ResolveDisputePayload, thunkAPI) => {
        try {
            const resolved = await invoiceHistoryService.resolveDispute(payload);
            return resolved;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to resolve dispute");
        }
    }
);

export const fetchNewPatientBookings = createAsyncThunk(
    "invoiceHistory/fetchNewPatientBookings",
    async (params: FetchDisputesParams, { rejectWithValue }) => {
        try {
            const result = await invoiceHistoryService.fetchNewPatientBookings(params);
            return result;
        } catch (error: any) {
            console.error("Thunk error:", error);
            return rejectWithValue(error.message || "Failed to fetch new patient bookings");
        }
    }
);

export const addDisputeNotes = createAsyncThunk(
    "invoiceHistory/addNotes",
    async ({ id, notes }: { id: string; notes: string }, thunkAPI) => {
        try {
            const updated = await invoiceHistoryService.addDisputeNotes(id, notes);
            return updated;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message || "Failed to add notes");
        }
    }
);

// --- Slice ---

const invoiceHistorySlice = createSlice({
    name: "invoiceHistory",
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        setStatusFilter: (state, action: PayloadAction<DisputeStatus | 'all'>) => {
            state.filters.status = action.payload;
        },
        setDateRangeFilter: (state, action: PayloadAction<{ from?: string; to?: string }>) => {
            state.filters.dateFrom = action.payload.from;
            state.filters.dateTo = action.payload.to;
        },
        clearFilters: (state) => {
            state.filters = {
                status: 'all',
            };
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch Disputes
        builder
            .addCase(fetchDisputes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDisputes.fulfilled, (state, action: PayloadAction<{ disputes: DisputedAppointment[]; totalCount: number }>) => {
                state.isLoading = false;
                state.disputes = action.payload.disputes;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchDisputes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Dispute Status
        builder
            .addCase(updateDisputeStatus.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateDisputeStatus.fulfilled, (state, action: PayloadAction<DisputedAppointment>) => {
                state.isUpdating = false;
                state.successMessage = `Dispute status updated to ${action.payload.status}`;

                const index = state.disputes.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.disputes[index] = {
                        ...state.disputes[index],
                        ...action.payload
                    };
                }
            })
            .addCase(updateDisputeStatus.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(fetchNewPatientBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNewPatientBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.completedNewPatients = action.payload.completed;
                state.cancelledNewPatients = action.payload.cancelled;
                state.approvedDisputes = action.payload.approvedDisputes;
                state.dispute = action.payload.dispute;
                state.totalCount = action.payload.totalCompleted + action.payload.totalCancelled;
            })
            .addCase(fetchNewPatientBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Resolve Dispute
        builder
            .addCase(resolveDispute.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resolveDispute.fulfilled, (state, action: PayloadAction<DisputedAppointment>) => {
                state.isUpdating = false;
                state.successMessage = "Dispute resolved successfully";

                const index = state.disputes.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.disputes[index] = {
                        ...state.disputes[index],
                        ...action.payload
                    };
                }
            })
            .addCase(resolveDispute.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });

        // Add Dispute Notes
        builder
            .addCase(addDisputeNotes.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(addDisputeNotes.fulfilled, (state, action: PayloadAction<DisputedAppointment>) => {
                state.isUpdating = false;
                state.successMessage = "Notes added successfully";

                const index = state.disputes.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.disputes[index] = {
                        ...state.disputes[index],
                        ...action.payload
                    };
                }
            })
            .addCase(addDisputeNotes.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearMessages,
    setStatusFilter,
    setDateRangeFilter,
    clearFilters,
    resetState
} = invoiceHistorySlice.actions;

export default invoiceHistorySlice.reducer;