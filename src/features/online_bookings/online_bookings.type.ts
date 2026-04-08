export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed' 
  | 'dismissed'  
  | 'no_show';

export interface Practitioner {
  id: string;
  name: string;
  image?: string | null;
  role?: string | null;
}

export interface PracticeService {
  id: string;
  name: string;
}

export interface PracticeOpeningHours {
  id: string;
  day_of_week: string; 
  is_open: boolean;
  time_slots: any; 
}

export interface OnlineBooking {
  id: string;
  practice_id: string;
  practitioner_id?: string;
  
  practitioner?: Practitioner | null;

  patient_name: string;
  mobile: string;
  dob?: string;
  email?: string;

  treatment: string;
  appointment_date: string; 
  appointment_time: string; 

  status: string;
  is_rescheduled: boolean;
  
  isNewPatient: boolean;
  isDependent: boolean;

  patient_notes?: string;
  booked_by?: string;

  created_at: string;
  updated_at: string;
}

export interface PractitionerBreak {
  id: string;
  practitioner_id: string;
  title: string;
  start_time: string; 
  end_time: string;   
  notes?: string | null;
  color: string;
}

export interface EnrichedAppointment extends Omit<OnlineBooking, 'status'> {
  status: AppointmentStatus; 
  practitioner_name: string;
  practitioner_image: string | null; 
  practitioner_role: string;     
}

export interface AppointmentsState {
  list: OnlineBooking[]; 
  services: PracticeService[];
  openingHours: PracticeOpeningHours[];
  practitioners: Practitioner[];
  breaks: PractitionerBreak[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  successMessage: string | null;
}