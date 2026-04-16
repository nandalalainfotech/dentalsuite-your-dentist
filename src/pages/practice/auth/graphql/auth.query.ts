import { gql } from "@apollo/client";

export const SIGNIN_QUERY = gql`
  query Login($email: String!) {
    accounts(where: { email: { _eq: $email } }) {
      id
      email
      password
      name
      type
      status
      practice_name
      practice_phone
    }
  }
`;

export const GET_SIGNUP_OPTIONS_QUERY = gql`
  query GetSignupOptions {
    common_practice_types {
      value
      label
    }
    common_states {
      code
      name
    }
  }
`;