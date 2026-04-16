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