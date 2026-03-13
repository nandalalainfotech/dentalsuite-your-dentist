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
