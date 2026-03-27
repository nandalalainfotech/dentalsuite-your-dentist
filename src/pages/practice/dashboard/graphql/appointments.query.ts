import { gql } from "@apollo/client";

export const GET_APPOINTMENTS_QUERY = gql`
  query GetAppointments($practice_id: uuid!) {
    online_bookings(
      where: { practice_id: { _eq: $practice_id } }
      order_by: { appointment_date: desc, appointment_time: asc }
    ) {
      id
      practice_id
      patient_name
      mobile
      dob
      email
      
      practitioner {
        id
        name
        image
        role
      }
      
      treatment
      appointment_date
      appointment_time
      status
      
      # Aliasing to camelCase for easier frontend use
      isNewPatient: is_new_patient
      isDependent: is_dependent
      
      is_rescheduled
      patient_notes
      booked_by
      created_at
      updated_at
    }
  }
`;

export const GET_PRACTITIONERS_QUERY = gql`
  query GetPractitioners($practice_id: uuid!) {
    practice_team_members(where: { practice_id: { _eq: $practice_id } }) {
      id
      name
      image
      role
    }
  }
`;

export const UPDATE_STATUS_MUTATION = gql`
  mutation UpdateStatus($id: uuid!, $status: String!) {
    update_online_bookings_by_pk(
      pk_columns: { id: $id }, 
      _set: { status: $status, updated_at: "now()" }
    ) {
      id
      status
      updated_at
    }
  }
`;

export const RESCHEDULE_MUTATION = gql`
  mutation Reschedule($id: uuid!, $date: Date!, $time: Time!) {
    update_online_bookings_by_pk(
      pk_columns: { id: $id }, 
      _set: { 
        appointment_date: $date, 
        appointment_time: $time, 
        status: "confirmed", 
        is_rescheduled: true,
        updated_at: "now()" 
      }
    ) {
      id
      appointment_date
      appointment_time
      status
      is_rescheduled
      updated_at
    }
  }
`;