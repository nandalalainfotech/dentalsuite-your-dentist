import { gql } from "@apollo/client";

export const GET_APPOINTMENTS_QUERY = gql`
  query GetAppointments($practice_id: uuid!) {
    online_booking(
      where: { practice_id: { _eq: $practice_id } }
      order_by: { appointment_date: desc }
    ) {
      id
      practice_id
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