import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation RegisterPractice($object: practice_info_insert_input!) {
    insert_practice_info_one(object: $object) {
      id
      email
      practice_name
      status
    }
  }
`;