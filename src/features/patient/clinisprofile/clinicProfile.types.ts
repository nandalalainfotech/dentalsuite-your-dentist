// ==================== TIME SLOT ====================
export interface TimeSlot {
    start: string;
    end: string;
}

// ==================== PRACTICE SERVICE ====================
export interface PracticeService {
    id: string;
    name: string;
    all_service_id?: string | null;
}

// ==================== PRACTICE BASE INFO ====================
export interface PracticeBaseInfo {
    id: string;
    website?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
}

// ==================== PRACTICE TEAM MEMBER ====================
export interface PracticeTeamMember {
    id: string;
    first_name: string;
    last_name: string;
    gender: string | null;
    languages: any[] | null;
    qualification?: string | null;
    image?: string | null;
    specialization?: string | null;
    experience_years?: number | null;
    bio?: string | null;
}

// ==================== PRACTICE INSURANCE ====================
export interface PracticeInsurance {
    id: string;
    provider_name: string;
}

// ==================== PRACTICE OPENING HOUR ====================
export interface PracticeOpeningHour {
    id: string;
    day_of_week: string;
    is_open: boolean;
    opening_time?: string | null;
    closing_time?: string | null;
    time_slots?: TimeSlot[] | null;
}

// ==================== PRACTICE FACILITY ====================
export interface PracticeFacility {
    id: string;
    facility_name: string;
}

// ==================== PRACTICE GALLERY IMAGE ====================
export interface PracticeGalleryImage {
    id: string;
    image_url: string;
    caption?: string | null;
}

// ==================== PRACTICE ACHIEVEMENT ====================
export interface PracticeAchievement {
    id: string;
    title: string;
    description?: string | null;
    image_url?: string | null;
    award_year?: number | null;
    awarded_by?: string | null;
}

// ==================== PRACTICE CERTIFICATION ====================
export interface PracticeCertification {
    id: string;
    title: string;
    certification_number?: string | null;
    image_url?: string | null;
    issued_date?: string | null;
    expiry_date?: string | null;
    issuing_authority?: string | null;
}

// ==================== PRACTICE REVIEW ====================
export interface PracticeReview {
    id: string;
    patient_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

// ==================== MAIN CLINIC PROFILE DATA ====================
export interface ClinicProfileData {
    id: string;
    practice_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
    logo: string | null;
    description: string | null;
    banner_image: string | null;
    email: string | null;
    practice_phone: string | null;
    status: string | null;

    // Additional Info
    practice_base_info?: PracticeBaseInfo | null;

    // Related Data
    practice_services: PracticeService[];
    practice_team_members: PracticeTeamMember[];
    practice_insurances: PracticeInsurance[];
    practice_opening_hours: PracticeOpeningHour[];
    practice_facilities?: PracticeFacility[];
    practice_galleries?: PracticeGalleryImage[];
    practice_achievements?: PracticeAchievement[];
    practice_certifications?: PracticeCertification[];
}

// ==================== FILTER/SEARCH TYPES ====================
export interface SearchResult {
    type: 'service' | 'practice' | 'practitioner';
    id: string;
    name: string;
    subtitle: string;
    practiceId?: string;
}

export interface LocationResult {
    city: string;
    state: string;
    postcode: string;
    displayText: string;
}

export interface FilterOptions {
    specialties: string[];
    languages: string[];
    genders: string[];
    insurances: string[];
    availableDays: string[];
}

export interface CombinedFilterParams {
    // Main search
    serviceType?: 'service' | 'practice' | 'practitioner';
    serviceId?: string;
    serviceName?: string;
    locationCity?: string;
    locationState?: string;
    locationPostcode?: string;

    // Sidebar filters
    specialties?: string[];
    languages?: string[];
    genders?: string[];
    insurances?: string[];
    days?: string[];
}