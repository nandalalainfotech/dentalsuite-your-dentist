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