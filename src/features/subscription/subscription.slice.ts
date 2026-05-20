/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

import { subscriptionService } from './subscription.service';

export const fetchPracticeSubscription =
  createAsyncThunk(
    'subscription/fetchPracticeSubscription',

    async (
      practiceId: string
    ) => {

      return await subscriptionService.getSubscription(
        practiceId
      );
    }
  );

export const savePracticeSubscription =
  createAsyncThunk(
    'subscription/savePracticeSubscription',

    async ({
      practiceId,
      paymentType
    }: {
      practiceId: string;
      paymentType: 'PAY_PER_PATIENT' | 'PAY_PER_MONTH';
    }) => {

      return await subscriptionService.saveSubscription({
        practiceId,
        paymentType
      });
    }
  );

interface SubscriptionState {
  subscription: any;
  loading: boolean;
  saving: boolean;
}

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  saving: false
};

const subscriptionSlice = createSlice({
  name: 'subscription',

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    /* =========================
        FETCH
    ========================= */

    builder.addCase(
      fetchPracticeSubscription.pending,

      (state) => {
        state.loading = true;
      }
    );

    builder.addCase(
      fetchPracticeSubscription.fulfilled,

      (state, action) => {

        state.loading = false;

        state.subscription =
          action.payload;
      }
    );

    builder.addCase(
      fetchPracticeSubscription.rejected,

      (state) => {

        state.loading = false;
      }
    );

    /* =========================
        SAVE
    ========================= */

    builder.addCase(
      savePracticeSubscription.pending,

      (state) => {
        state.saving = true;
      }
    );

    builder.addCase(
      savePracticeSubscription.fulfilled,

      (state, action) => {

        state.saving = false;

        state.subscription =
          action.payload;
      }
    );

    builder.addCase(
      savePracticeSubscription.rejected,

      (state) => {

        state.saving = false;
      }
    );
  }
});

export default subscriptionSlice.reducer;