import { gql } from "@apollo/client";

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