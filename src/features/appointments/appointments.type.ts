export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'completed'
  | 'dismissed'
  | 'patient_cancelled'
  | 'reception_cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  treatment: string;
  dentistId: string;
  dentistName: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  bookedAt: string; // ISO Date
  isNewPatient: boolean;
  isDependent: boolean;
  status: AppointmentStatus;
  mobile: string;
  dob: string;
  patientNotes: string;
  bookedBy: string;
  createdAt: string;
  updatedAt: string;
  isRescheduled: boolean;
}

export interface AppointmentsState {
  items: Appointment[];
  isLoading: boolean;
  error: string | null;
}