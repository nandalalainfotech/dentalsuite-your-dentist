/* eslint-disable @typescript-eslint/no-explicit-any */

import { gql } from '@apollo/client';

export const GET_PRACTICE_SUBSCRIPTION = gql`
  query GetPracticeSubscription(
    $practiceId: uuid!
  ) {
    practice_subscription(
      where: {
        practice_id: {
          _eq: $practiceId
        }
      }
      limit: 1
    ) {
      id
      practice_id
      current_payment_type
      current_price
      subscription_start_date
      subscription_end_date
      pending_payment_type
      pending_price
      pending_start_date
      is_active
      created_at
      updated_at
    }
  }
`;

export const GET_PAYMENT_SETTINGS = gql`
  query GetPaymentSettings {
    payment_settings(limit: 1) {
      pay_per_patient_amount
      pay_per_month_amount
    }
  }
`;

export const UPSERT_PRACTICE_SUBSCRIPTION = gql`
  mutation UpsertPracticeSubscription(
    $object: practice_subscription_insert_input!
  ) {
    insert_practice_subscription_one(
      object: $object
      on_conflict: {
        constraint: practice_subscription_practice_id_key
        update_columns: [
          current_payment_type
          current_price
          subscription_start_date
          subscription_end_date
          pending_payment_type
          pending_price
          pending_start_date
          is_active
          updated_at
        ]
      }
    ) {
      id
      practice_id
      current_payment_type
      current_price
      subscription_start_date
      subscription_end_date
      pending_payment_type
      pending_price
      pending_start_date
      is_active
      created_at
      updated_at
    }
  }
`;