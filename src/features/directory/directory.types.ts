// src/features/directory/directory.types.ts

// ============================================================================
// DIRECTORY DATABASE INTERFACES (1:N Relationships)
// Strictly typed to match Hasura local DB columns (snake_case)
// ============================================================================

export interface PracticeOpeningHour {
  id: string;
  practice_id?: string;
  day_of_week: string;
  is_open: boolean;
  time_slots: any | null; // jsonb
}

export interface PracticeFacility {
  id: string;
  practice_id?: string;
  facility_name: string;
}

// Master Service List Type
export interface AllService {
  id: string;
  service_name: string;
}

export interface PracticeService {
  id: string;
  practice_id?: string;
  name: string;
  all_service_id: string | null; 
  show_in_appointment: boolean | null;
}

// NEW: Updated Junction Table Type
export interface PractitionerPracticeService {
  practice_service_id: string;
  practice_service: PracticeService; // The nested service details
}

export interface PracticeTeamMember {
  id: string;
  practice_id?: string;
  name: string;
  role: string | null;
  qualification: string | null;
  gender: string | null;
  ahpra_number: string | null;
  education: string | null;
  languages: string | null;
  professional_statement: string | null;
  
  // ADDED: The new junction array
  practitioner_practice_services: PractitionerPracticeService[];
  
  image: string | null;
  is_visible_online: boolean | null;
  allow_multiple_bookings: boolean | null;
  booking_time_limit: number | null;
  booking_time_limit_unit: string | null;
  cancel_time_limit: number | null;
  cancel_time_limit_unit: string | null;
  appointment_types: any | null; // jsonb
}

export interface PracticeInsurance {
  id: string;
  practice_id?: string;
  provider_name: string;
}

export interface PracticeGallery {
  id: string;
  practice_id?: string;
  image_url: string;
  caption: string | null;
}

export interface PracticeAchievement {
  id: string;
  practice_id?: string;
  title: string;
  image_url: string;
}

export interface PracticeCertification {
  id: string;
  practice_id?: string;
  title: string;
  image_url: string;
}

export interface PracticeException {
  id: string;
  practice_id?: string;
  exception_date: string;
  is_closed: boolean;
  start_time: string | null;
  end_time: string | null;
  label: string | null;
  note: string | null;
}

// ============================================================================
// MAIN DIRECTORY PROFILE TYPE
// ============================================================================

export interface DirectoryProfile {
  id: string;
  practice_name: string;      
  logo: string | null;        
  abn_number: string;
  practice_type: string;
  practice_phone: string;
  address: string;            
  city: string;
  state: string;
  postcode: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  type: string | null;
  status: string;

  practice_id?: string; 
  
  banner_image: string | null;
  description: string;
  website: string;
  directions: string;
  alert_message: string;
  formatted_address: string;  
  
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;

  practice_opening_hours: PracticeOpeningHour[];
  practice_facilities: PracticeFacility[];
  practice_team_members: PracticeTeamMember[];
  practice_services: PracticeService[];
  practice_insurances: PracticeInsurance[];
  practice_galleries: PracticeGallery[];
  practice_achievements: PracticeAchievement[];
  practice_certifications: PracticeCertification[];
  practice_exceptions: PracticeException[];
}

// ============================================================================
// REDUX PAYLOADS & STATE
// ============================================================================

export interface UpdateDirectoryPayload {
  id: string;
  data: Partial<DirectoryProfile>;
}

export interface DirectoryState {
  data: DirectoryProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
}