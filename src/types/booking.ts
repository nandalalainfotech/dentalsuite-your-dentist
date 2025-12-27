export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  reason: string;
}

export interface Appointment {
  id: string;
  dentistId: string;
  clinicId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  createdAt: string;
  updatedAt?: string;
}