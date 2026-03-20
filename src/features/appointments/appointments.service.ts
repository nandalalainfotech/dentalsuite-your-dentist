import { localClient } from "../../api/apollo/localClient";
import { GET_APPOINTMENTS_QUERY } from "../../pages/practice/dashboard/graphql/appointments.query";
import type { Appointment, AppointmentStatus } from "./appointments.type";

interface AppointmentResponse {
  online_booking: any[];
}

// Helper to map DB response to clean TypeScript object
const mapToAppointment = (data: any): Appointment => {
  const mapStatus = (apiStatus: string): AppointmentStatus => {
    const statusMap: Record<string, AppointmentStatus> = {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      COMPLETED: 'completed',
      DISMISSED: 'dismissed',
      PATIENT_CANCELLED: 'patient_cancelled',
      RECEPTION_CANCELLED: 'reception_cancelled',
      CANCELLED: 'reception_cancelled'
    };
    return statusMap[apiStatus?.toUpperCase()] || 'pending';
  };

  return {
    id: data.id,
    patientName: data.patient_name,
    treatment: data.treatment,
    dentistId: data.dentist_id || "unknown", 
    dentistName: data.dentist_name,
    appointmentDate: data.appointment_date,
    appointmentTime: data.appointment_time?.substring(0, 5) || '00:00',
    bookedAt: data.created_at,
    isNewPatient: data.isNewPatient || false,
    isDependent: data.isDependent || false,
    status: mapStatus(data.status),
    mobile: data.mobile,
    dob: data.dob,
    patientNotes: data.patient_notes || '',
    bookedBy: data.booked_by || data.patient_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    isRescheduled: data.is_rescheduled || false,
  };
};

const getAppointments = async (practiceId: string): Promise<Appointment[]> => {
  const { data } = await localClient.query<AppointmentResponse>({
    query: GET_APPOINTMENTS_QUERY,
    // Variable name must match the query definition ($practice_id)
    variables: { practice_id: practiceId },
    fetchPolicy: "network-only",
  });

  return (data?.online_booking || []).map(mapToAppointment);
};

const appointmentsService = {
  getAppointments,
};

export default appointmentsService;