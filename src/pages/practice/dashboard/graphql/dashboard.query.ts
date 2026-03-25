import { gql } from "@apollo/client";

export const GET_PRACTICE_PROFILE_QUERY = gql`
  query GetPracticeProfile($id: uuid!) {
    practice_info(where: { id: { _eq: $id } }) {
      id
      practice_name
      abn_number
      practice_type
      email
      practice_phone
      address
      city
      state
      postcode
      first_name
      last_name
      mobile
      logo
    }
  }
`;

export const UPDATE_PRACTICE_PROFILE_MUTATION = gql`
  mutation UpdatePracticeProfile($id: uuid!, $changes: practice_info_set_input!) {
    update_practice_info_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
      practice_name
      practice_type
      abn_number
      email
      practice_phone
      address
      city
      state
      postcode
      first_name
      last_name
      mobile
      logo
    }
  }
`;