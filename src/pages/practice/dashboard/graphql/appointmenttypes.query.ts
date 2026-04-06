import { gql } from "@apollo/client";

export const GET_DATA = gql`
  query GetAppointmentTypesData($practiceId: uuid!) {
    appointment_types(
      where: { practice_id: { _eq: $practiceId } },
      order_by: { sort_order: asc }
    ) {
      id
      name
      existing_enabled
      existing_duration
      existing_link
      existing_future_booking_limit
      new_enabled
      new_duration
      new_link
      new_future_booking_limit
      new_terms_enabled
      online_enabled
      ask_reason
      add_message
      unavailable_action
      cancellation_enabled
      sort_order
    }
    practice_team_members(where: { practice_id: { _eq: $practiceId } }) {
      id
       name
        appointment_types
    }
  }
`;

export const INSERT_APPT_TYPE = gql`
  mutation InsertAppointmentType($object: appointment_types_insert_input!) {
    insert_appointment_types_one(object: $object) { id }
  }
`;

export const UPDATE_APPT_TYPE = gql`
  mutation UpdateAppointmentType($id: uuid!, $changes: appointment_types_set_input!) {
    update_appointment_types_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
  }
`;

export const DELETE_APPT_TYPE = gql`
  mutation DeleteAppointmentType($id: uuid!) {
    delete_appointment_types_by_pk(id: $id) { id }
  }
`;

export const UPDATE_TEAM_MEMBER_JSON = gql`
  mutation UpdateTeamMemberJSON($id: uuid!, $json: jsonb!) {
    update_practice_team_members_by_pk(pk_columns: { id: $id }, _set: { appointment_types: $json }) { id }
  }
`;