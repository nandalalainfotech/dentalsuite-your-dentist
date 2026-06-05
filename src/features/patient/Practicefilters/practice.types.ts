export interface PracticeService {
    id: string;
    name: string;
}

export interface PracticeTeamMember {
    last_name: string;
    first_name: any;
    id: string;
    name: string;
    gender: string | null;
    languages: string[] | null;
}

export interface PracticeInsurance {
    id: string;
    provider_name: string;
}

export interface PracticeOpeningHour {
    id: string;
    day_of_week: string;
    is_open: boolean;
}

export interface PracticeInfo {
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
    practice_services: PracticeService[];
    practice_team_members: PracticeTeamMember[];
    practice_insurances: PracticeInsurance[];
    practice_opening_hours: PracticeOpeningHour[];
}

export interface PracticeService {
    id: string;
    name: string;
}

export interface PracticeTeamMember {
    id: string;
    last_name: string;
    // name?: string;
    gender: string | null;
    languages: string[] | null;
}

export interface PracticeInsurance {
    id: string;
    provider_name: string;
}

export interface PracticeOpeningHour {
    id: string;
    day_of_week: string;
    is_open: boolean;
}

export interface PracticeInfo {
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
    practice_services: PracticeService[];
    practice_team_members: PracticeTeamMember[];
    practice_insurances: PracticeInsurance[];
    practice_opening_hours: PracticeOpeningHour[];
}

// Search result types
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

// Filter options type
export interface FilterOptions {
    specialties: string[];
    languages: string[];
    genders: string[];
    insurances: string[];
    availableDays: string[];
}

// Combined filter params type
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