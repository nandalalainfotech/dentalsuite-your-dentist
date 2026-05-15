// src/store/slices/support.slice.ts
import { createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type { SupportTicket, TicketStatus } from './support.types';

interface SupportState {
  selectedTicket: SupportTicket | null;
  filterStatus: TicketStatus | 'ALL';
}

const initialState: SupportState = {
  selectedTicket: null,
  filterStatus: 'ALL',
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<SupportTicket | null>) => {
      state.selectedTicket = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<TicketStatus | 'ALL'>) => {
      state.filterStatus = action.payload;
    },
    resetSupportState: () => initialState,
  },
});

export const { setSelectedTicket, setFilterStatus, resetSupportState } = supportSlice.actions;
export const selectCurrentClinic = (state: any) => state.auth.user;
export const selectSelectedTicket = (state: any) => state.support.selectedTicket;
export const selectSupportFilter = (state: any) => state.support.filterStatus;

export default supportSlice.reducer;