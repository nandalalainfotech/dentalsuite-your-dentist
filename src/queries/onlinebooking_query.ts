import { gql } from "@apollo/client";

export const GET_APPOINTMENTS_QUERY = gql`
  query online_booking_your_dentist($practice_id: uuid!) {
    online_booking_your_dentist(where: { practice_id: { _eq: $practice_id } }) {
    id
    practice_id
    dentist_id
    user_id
    patient_id
    patient_name
    mobile
    dob
    dentist_name
    treatment
    appointment_date
    appointment_time
    status
    is_rescheduled
    isNewPatient
    isDependent
    patient_notes
    booked_by
    created_at
    updated_at
    }
  }
`;

export const CONFIRM_ONLINE_BOOKING = gql`
mutation confirmOnlineBooking($id: uuid!) {
  update_online_bookings_by_pk(
    pk_columns: { id: $id }
    _set: { status: "confirmed" }
  ) {
    id
    status
    __typename
  }
}
`;

export const COMPLETE_ONLINE_BOOKING = gql`
mutation completeOnlineBooking($id: uuid!) {
  update_online_bookings_by_pk(
    pk_columns: { id: $id }
    _set: { status: "completed" }
  ) {
    id
    status
    __typename
  }
}
`;

export const RECEPTION_CANCEL_BOOKING = gql`
mutation receptionCancelBooking($id: uuid!) {
  update_online_bookings_by_pk(
    pk_columns: { id: $id }
    _set: { status: "reception_cancelled" }
  ) {
    id
    status
    __typename
  }
}
`;


export const DISMISS_ONLINE_BOOKING = gql`
mutation dismissOnlineBooking($id: uuid!) {
  update_online_bookings_by_pk(
    pk_columns: { id: $id }
    _set: { status: "dismissed" }
  ) {
    id
    status
    __typename
  }
}
`;

export const RESCHEDULE_ONLINE_BOOKING = gql`
mutation rescheduleOnlineBooking(
  $id: uuid!
  $date: date!
  $time: time!
  $dentist_id: uuid!
  $dentist_name: String!
) {
  update_online_bookings_by_pk(
    pk_columns: { id: $id }
    _set: {
      appointment_date: $date
      appointment_time: $time
      dentist_id: $dentist_id
      dentist_name: $dentist_name
      status: "pending"
      is_rescheduled: true
    }
  ) {
    id
    dentist_id
    dentist_name
    appointment_date
    appointment_time
    status
    is_rescheduled
    __typename
  }
}
`;

export const GET_AVAILABLE_SLOTS = gql`
query getAvailableSlots($dentistId: uuid!, $date: date!) {
  online_bookings(
    where: {
      dentist_id: { _eq: $dentistId }
      appointment_date: { _eq: $date }
      status: { _nin: ["reception_cancelled", "dismissed"] }
    }
  ) {
    appointment_time
    __typename
  }
}
`;