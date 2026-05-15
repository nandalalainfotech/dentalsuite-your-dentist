import { gql } from "@apollo/client";

export const GET_DISPUTED_APPOINTMENTS_QUERY = gql`
  query GetDisputesOnly(
    $practice_id: uuid!
    $limit: Int
    $offset: Int
    $from_date: date
    $to_date: date
  ) {
    online_bookings(
      where: {
        practice_id: { _eq: $practice_id }
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
    }
    online_bookings_aggregate(
      where: {
        practice_id: { _eq: $practice_id }
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
  mutation UpdateDisputeStatus($id: uuid!, $dispute_status: String!, $resolution_notes: String, $resolved_at: timestamptz) {
    update_online_bookings_by_pk(
      pk_columns: {id: $id},
      _set: {
        dispute_status: $dispute_status,
        dispute_resolution_notes: $resolution_notes,
        resolved_at: $resolved_at
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

export const RESOLVE_DISPUTE_MUTATION = gql`
  mutation ResolveDispute($id: uuid!, $resolution_notes: String!) {
    update_online_bookings_by_pk(
      pk_columns: { id: $id }
      _set: {
        status: "resolved"
        dispute_resolution_notes: $resolution_notes
        resolved_at: "now()"
      }
    ) {
      id
      status
      dispute_resolution_notes
      resolved_at
      updated_at
    }
  }
`;

export const ADD_DISPUTE_NOTES_MUTATION = gql`
  mutation AddDisputeNotes($id: uuid!, $notes: String!) {
    update_online_bookings_by_pk(
      pk_columns: { id: $id }
      _set: { dispute_resolution_notes: $notes }
    ) {
      id
      dispute_resolution_notes
      updated_at
    }
  }
`;



export const GET_NEW_PATIENT_BOOKINGS = gql`
  query GetNewPatientBookings(
    $practice_id: uuid!
    $limit: Int
    $offset: Int
    $from_date: date
    $to_date: date
  ) {
    completed_bookings: online_bookings(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "completed" }
        is_new_patient: { _eq: true }
      }
      order_by: { appointment_date: desc }
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
      dispute_status
      dispute_resolution_notes
      practitioner {
        id
        first_name
        last_name
        role
        image
      }
    }
    
    cancelled_bookings: online_bookings(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "cancelled" }
        is_new_patient: { _eq: true }
      }
      order_by: { appointment_date: desc }
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
      dispute_status
      dispute_resolution_notes
      practitioner {
        id
        first_name
        last_name
        role
        image
      }
    }

    dispute_bookings: online_bookings(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "dispute" }
        is_new_patient: { _eq: true }
      }
      order_by: { appointment_date: desc }
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
      dispute_status
      dispute_resolution_notes
      practitioner {
        id
        first_name
        last_name
        role
        image
      }
    }
  
    approved_dispute_bookings: online_bookings(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "dispute" }
        dispute_status: { _eq: "approve" }
        is_new_patient: { _eq: true }
      }
      order_by: { appointment_date: desc }
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
      dispute_status
      dispute_resolution_notes
      practitioner {
        id
        first_name
        last_name
        role
        image
      }
    }
    
    completed_aggregate: online_bookings_aggregate(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "completed" }
        is_new_patient: { _eq: true }
      }
    ) {
      aggregate {
        count
      }
    }
    
    cancelled_aggregate: online_bookings_aggregate(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "cancelled" }
        is_new_patient: { _eq: true }
      }
    ) {
      aggregate {
        count
      }
    }

    # ✅ FIXED - 把 status 从 "cancelled" 改成 "dispute"
    dispute_aggregate: online_bookings_aggregate(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "dispute" }  # ✅ 修复这里！
        is_new_patient: { _eq: true }
      }
    ) {
      aggregate {
        count
      }
    }
    
    approved_dispute_aggregate: online_bookings_aggregate(
      where: {
        practice_id: { _eq: $practice_id }
        status: { _eq: "dispute" }
        dispute_status: { _eq: "approve" }
        is_new_patient: { _eq: true }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;