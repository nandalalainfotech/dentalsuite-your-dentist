/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';

import { subscriptionService } from './subscription.service';
import type { PaymentType } from './subscription.types';

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

    async (
      {
        practiceId,
        paymentType,
        subscription_start_date,
        subscription_end_date,
        pending_start_date
      }: {
        practiceId: string;
        paymentType: PaymentType;
        subscription_start_date: string;
        subscription_end_date: string;
        pending_start_date: string;
      }
    ) => {

      return await subscriptionService.saveSubscription({
        practiceId,
        paymentType,

        subscription_start_date,
        subscription_end_date,
        pending_start_date
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
          action.payload || null;
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

        const payload: any =
          action.payload;

        state.subscription =

          payload?.data
            ?.insert_practice_subscription_one ||

          payload?.data
            ?.update_practice_subscription_by_pk ||

          payload;
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