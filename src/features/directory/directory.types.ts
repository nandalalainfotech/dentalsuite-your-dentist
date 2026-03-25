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
  areas_of_interest: string | null;
  image: string | null;
  is_visible_online: boolean | null;
  allow_multiple_bookings: boolean | null;
  booking_time_limit: number | null;
  booking_time_limit_unit: string | null;
  cancel_time_limit: number | null;
  cancel_time_limit_unit: string | null;
  appointment_types: any | null; // jsonb
}

export interface PracticeService {
  id: string;
  practice_id?: string;
  name: string;
  description: string | null;
  show_in_appointment: boolean | null;
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
// Combines Core Info (Parent) and Base Info (Child) into one flat object
// ============================================================================

export interface DirectoryProfile {
  // --- 1. CORE INFO (Table: practice_info) ---
  id: string;
  practice_name: string;      // The Single Source of Truth for Name
  logo: string | null;        // The Single Source of Truth for Logo
  
  abn_number: string;
  practice_type: string;
  practice_phone: string;
  address: string;            // Core Address
  city: string;
  state: string;
  postcode: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  type: string | null;
  status: string;

  // --- 2. BASE INFO (Table: practice_base_info) ---
  // Note: practice_id is the FK here, usually matches 'id' above.
  practice_id?: string; 
  
  // Visuals & Socials
  banner_image: string | null;
  description: string;
  website: string;
  directions: string;
  alert_message: string;
  formatted_address: string;  // Display Address (Child table)
  
  // Social Links
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;

  // --- 3. RELATIONAL ARRAYS ---
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