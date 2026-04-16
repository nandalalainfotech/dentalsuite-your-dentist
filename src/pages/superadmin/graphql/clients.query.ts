import { gql } from "@apollo/client";

export const GET_CLIENTS_QUERY = gql`
  query GetClients {
    accounts(
      where: { type: { _eq: "PRACTICE_ADMIN" } }
      order_by: { created_at: desc }
    ) {
      id
      practice_name
      email
      practice_phone
      status
      created_at
    }
  }
`;