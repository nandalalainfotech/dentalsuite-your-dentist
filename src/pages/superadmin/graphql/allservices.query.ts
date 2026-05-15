import { gql } from "@apollo/client";

export const GET_ALL_SERVICES = gql`
  query GetAllServices {
    all_services(order_by: { service_name: asc }) {
      id
      service_name
      created_at
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService($service_name: String!) {
    insert_all_services_one(
      object: {
        service_name: $service_name
      }
    ) {
      id
      service_name
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $id: uuid!,
    $service_name: String!
  ) {
    update_all_services_by_pk(
      pk_columns: { id: $id },
      _set: {
        service_name: $service_name
      }
    ) {
      id
      service_name
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: uuid!) {
    delete_all_services_by_pk(id: $id) {
      id
    }
  }
`;