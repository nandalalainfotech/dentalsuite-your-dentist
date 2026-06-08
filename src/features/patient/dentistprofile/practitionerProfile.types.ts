export interface PractitionerService {
    practice_service_id: string;
    practice_service: {
        id: string;
        name: string;
        all_service_id?: string | null;
    };
}

export interface PracticeBaseInfo {
    id: string;
    website?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
}

export interface PracticeOpeningHour {
    id: string;
    day_of_week: string;
    is_open: boolean;
    time_slots?: Array<{
        start: string;
        end: string;
    }> | null;
}


export interface PracticeInfoForPractitioner {
    id: string;
    practice_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
    logo: string | null;
    banner_image: string | null;
    email: string | null;
    practice_phone: string | null;
    practice_base_info?: PracticeBaseInfo | null;
    practice_opening_hours: PracticeOpeningHour[];
}

export interface PractitionerDetails {
    id: string;
    practice_id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    role: string | null;
    qualification: string | null;
    gender: string | null;
    ahpra_number: string | null;
    education: string | null;
    professional_statement: string | null;
    image: string | null;
    is_visible_online: boolean;
    languages: any[] | null;
    practice_info: PracticeInfoForPractitioner;
    practitioner_practice_services: PractitionerService[];
}

export interface PractitionerReview {
    id: string;
    patient_name: string;
    rating: number;
    comment: string;
    created_at: string;
}