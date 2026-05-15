import { gql } from "@apollo/client";

export const GET_ALL_DISPUTED_APPOINTMENTS_QUERY = gql`
  query GetAllDisputes(
    $limit: Int
    $offset: Int
    $from_date: date
    $to_date: date
    $status: String
  ) {
    online_bookings(
      where: {
        status: { _eq: "dispute" }
        appointment_date: {}
      }
      order_by: { updated_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      practice_id
      practitioner_id
      patient_name
      mobile
      dob
      email
      treatment
      appointment_date
      appointment_time
      status
      is_rescheduled
      is_new_patient
      is_dependent
      patient_notes
      booked_by
      created_at
      updated_at
      resolved_at
      dispute_reason
      dispute_resolution_notes
      dispute_status
      practitioner {
        id
        first_name
        last_name
        role
        image
      }
      practice_info {
        id
        practice_name
        email
        logo
      }
    }
    online_bookings_aggregate(
      where: {
        status: { _eq: "dispute" }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const UPDATE_DISPUTE_STATUS_MUTATION = gql`
  mutation UpdateDisputeStatus($id: uuid!, $dispute_status: String!, $resolution_notes: String, $resolved_at: timestamptz, $updated_at : timestamptz) {
    update_online_bookings_by_pk(
      pk_columns: {id: $id},
      _set: {
        dispute_status: $dispute_status,
        dispute_resolution_notes: $resolution_notes,
        resolved_at: $resolved_at
        updated_at: $updated_at
      }
    ) {
      id
      dispute_status
      dispute_resolution_notes
      resolved_at
      updated_at
    }
  }
`;