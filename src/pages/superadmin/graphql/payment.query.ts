import { gql } from "@apollo/client";

// =========================
// GET PAYMENT SETTINGS
// =========================

export const GET_PAYMENT_SETTINGS = gql`
  query GetPaymentSettings {
    payment_settings(
      limit: 1
      order_by: { created_at: desc }
    ) {
      id
      pay_per_patient_amount
      pay_per_month_amount
      created_at
      updated_at
    }
  }
`;

// =========================
// CREATE PAYMENT SETTINGS
// =========================

export const CREATE_PAYMENT_SETTINGS = gql`
  mutation CreatePaymentSettings(
    $pay_per_patient_amount: numeric!
    $pay_per_month_amount: numeric!
  ) {
    insert_payment_settings_one(
      object: {
        pay_per_patient_amount: $pay_per_patient_amount
        pay_per_month_amount: $pay_per_month_amount
      }
    ) {
      id
      pay_per_patient_amount
      pay_per_month_amount
      created_at
      updated_at
    }
  }
`;

// =========================
// UPDATE PAYMENT SETTINGS
// =========================

export const UPDATE_PAYMENT_SETTINGS = gql`
  mutation UpdatePaymentSettings(
    $id: uuid!
    $pay_per_patient_amount: numeric!
    $pay_per_month_amount: numeric!
  ) {
    update_payment_settings_by_pk(
      pk_columns: {
        id: $id
      }

      _set: {
        pay_per_patient_amount: $pay_per_patient_amount
        pay_per_month_amount: $pay_per_month_amount
      }
    ) {
      id
      pay_per_patient_amount
      pay_per_month_amount
      created_at
      updated_at
    }
  }
`;

