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
export const GET_COUPONS = gql`
    query GetCoupons {
        coupons(order_by: { created_at: desc }) {
            id
            code
            description
            discount_type
            discount_value
            free_months
            duration_months
            is_active
            valid_from
            valid_until
            max_uses
            used_count
            created_at
        }
    }
`;

export const CREATE_COUPON = gql`
    mutation CreateCoupon(
        $code: String!
        $description: String
        $discount_type: String!
        $discount_value: numeric
        $free_months: Int
        $duration_months: Int
        $is_active: Boolean
        $valid_from: date
        $valid_until: date
        $max_uses: Int
    ) {
        insert_coupons_one(
            object: {
                code: $code
                description: $description
                discount_type: $discount_type
                discount_value: $discount_value
                free_months: $free_months
                duration_months: $duration_months
                is_active: $is_active
                valid_from: $valid_from
                valid_until: $valid_until
                max_uses: $max_uses
                practice_usage_json: "{}"
            }
        ) {
            id
            code
        }
    }
`;

export const UPDATE_COUPON = gql`
    mutation UpdateCoupon($id: uuid!, $input: coupons_set_input!) {
        update_coupons_by_pk(pk_columns: { id: $id }, _set: $input) {
            id
            code
        }
    }
`;

export const DELETE_COUPON = gql`
    mutation DeleteCoupon($id: uuid!) {
        delete_coupons_by_pk(id: $id) {
            id
        }
    }
`;