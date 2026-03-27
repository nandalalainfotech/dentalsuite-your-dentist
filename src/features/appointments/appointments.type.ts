export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'dismissed' 
  | 'reception_cancelled' 
  | 'no_show';

export interface Practitioner {
  id: string;
  name: string;
  image?: string | null;
  role?: string | null;
}


export interface OnlineBooking {
  id: string;
  practice_id: string;
  practitioner_id?: string;

  
  practitioner?: Practitioner;

  patient_name: string;
  mobile: string;
  dob?: string;
  email?: string;

  treatment: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM:SS

  status: string;
  is_rescheduled: boolean;
  
  isNewPatient: boolean;
  isDependent: boolean;

  patient_notes?: string;
  booked_by?: string;

  created_at: string;
  updated_at: string;
}


export interface EnrichedAppointment extends Omit<OnlineBooking, 'status'> {
  status: AppointmentStatus; 
  dentist_name: string;
  dentist_image: string | null; 
  dentist_role: string;     
}


export interface AppointmentsState {
  list: OnlineBooking[]; 
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  successMessage: string | null;
}