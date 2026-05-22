import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query GetClients {
    accounts(where: { type: { _eq: "PRACTICE_ADMIN" } }) {
      id
      email
      status
      created_at
      practice_name
      abn_number
      practice_type
      practice_phone
      address
      city
      state
      postcode
      first_name
      last_name
      mobile
      type
    }
  }
`;

export const GET_PRACTICE_SUBSCRIPTION = gql`
  query GetPracticeSubscription($practiceId: uuid!) {
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

  pending_payment_type
  pending_price

  subscription_start_date
  subscription_end_date
  pending_start_date

  is_active
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

export const CREATE_PRACTICE_SUBSCRIPTION = gql`
    mutation CreatePracticeSubscription(
        $object: practice_subscription_insert_input!
    ) {
        insert_practice_subscription_one(
            object: $object
        ) {
            id
        }
    }
`;

export const CREATE_PRACTICE_INFO = gql`
mutation CreatePracticeInfo(
    $object: practice_info_insert_input!
) {

    insert_practice_info_one(
        object: $object
    ) {
        id
    }

}
`;

export const UPDATE_PRACTICE_SUBSCRIPTION = gql`

mutation UpdatePracticeSubscription(
    $id: uuid!,
    $current_payment_type: String,
    $current_price: numeric,
    $pending_payment_type: String,
    $pending_price: numeric,
    $pending_start_date: timestamptz
) {
    update_practice_subscription_by_pk(
        pk_columns: {
            id: $id
        },
        _set: {
            current_payment_type: $current_payment_type,
            current_price: $current_price,
            pending_payment_type: $pending_payment_type,
            pending_price: $pending_price,
            pending_start_date: $pending_start_date
        }
    ) {
        id
    }
}
`;

export const UPDATE_PRACTICE_STATUS = gql`
  mutation UpdatePracticeStatus($id: uuid!, $status: String!) {
    update_accounts_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: uuid!) {
    delete_practice_permissions(
      where: {
        practice_id: {
          _eq: $id
        }
      }
    ) {
      affected_rows
    }

    delete_accounts_by_pk(id: $id) {
      id
    }
  }
`;