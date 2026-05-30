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
      monthly_addon_enabled
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
          monthly_addon_enabled
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
      monthly_addon_enabled
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

export const GET_ALL_COUPONS = gql`
  query GetAllCoupons {
    coupons(where: { is_active: { _eq: true } }, order_by: { created_at: desc }) {
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
      practice_usage_json
      coupon_applies_to
    }
  }
`;

export const ASSIGN_COUPON_TO_PRACTICE = gql`
  mutation AssignCouponToPractice(
    $id: uuid!
    $used_count: Int!
    $practice_usage_json: jsonb!
  ) {
    update_coupons_by_pk(
      pk_columns: { id: $id }
      _set: { 
        used_count: $used_count, 
        practice_usage_json: $practice_usage_json 
      }
    ) {
      id
      used_count
      practice_usage_json
    }
  }
`;

export const REMOVE_COUPON_FROM_PRACTICE = gql`
  mutation RemoveCouponFromPractice(
    $id: uuid!
    $used_count: Int!
    $practice_usage_json: jsonb!
  ) {
    update_coupons_by_pk(
      pk_columns: { id: $id }
      _set: { 
        used_count: $used_count, 
        practice_usage_json: $practice_usage_json 
      }
    ) {
      id
      used_count
      practice_usage_json
    }
  }
`;


export const VALIDATE_COUPON_BY_CODE = gql`
  query ValidateCouponByCode($code: String!) {
    coupons(where: { code: { _eq: $code }, is_active: { _eq: true } }) {
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
      practice_usage_json
      coupon_applies_to
    }
  }
`;


export const GET_PRACTICE_COUPONS = gql`
  query GetPracticeCoupons {
    coupons(where: { is_active: { _eq: true } }) {
      id
      code
      description
      discount_type
      discount_value
      free_months
      duration_months
      practice_usage_json
    }
  }
`;