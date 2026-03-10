export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Review {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  specialities: string[];
  phone?: string;
  email?: string;
  password?: string;
  admin?: {
    email: string;
    password: string;
  };

  available?: boolean;
  website?: string;
  rating?: number;
  logo?: string;
  banner?: string;
  gallery?: string[];
  slots?: TimeSlot[];
  time: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  description?: string;
  establishedYear?: number;
  dentists?: Dentist[];
  facilities?: string[];
  insurance?: string[];
  insurances?: string[];
  services?: string[];
  tagline?: string;
  appointmentTypes: AppointmentType[];
  team?: { name: string; role: string; qual?: string }[];
  achievements?: { title: string; org?: string }[];
  parking?: boolean;
  emergency?: boolean;
  reviews: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number; // in minutes
}

// Forward declaration for circular dependency
export interface Dentist {
  id: string;
  name: string;
  qualification: string;
  experience: number;
  specialities: string[];
  rating?: number;
  slots?: TimeSlot[];
  availabledays: string[];
  image?: string;
  gender?: "male" | "female" | "other";
  languages?: string[];
  overview?: string;
  reviews?: Review[];
  specialization?:string[];
  description?: string;
}



export interface PracticeInfo {
  id: string;
  name: string;
  address: string;
  zipcode: string;
  company_name: string;
  profession_type?: string
  specialities: string[];
  phone?: string;
  email?: string;
  abn_acn?: string;
  password?: string;
  admin?: {
    email: string;
    password: string;
  };

  available?: boolean;
  website?: string;
  rating?: number;
  logo?: string;
  banner?: string;
  gallery?: string[];
  slots?: TimeSlot[];
  time: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  description?: string;
  establishedYear?: number;
  dentists?: Dentist[];
  facilities?: string[];
  insurances?: string[];
  insurance?: string[];
  services?: { id: string; name: string; description?: string }[];
  tagline?: string;
  appointmentTypes: AppointmentType[];
  team?: { name: string; role: string; qual?: string }[];
  parking?: boolean;
  emergency?: boolean;
  reviews: string;
  faqs?: string;
  testimonials?: string;
  business_name: string;
  banner_image: string | undefined | any;
  directory_achievements?: {
    id: string;
    title?: string;
    image?: string;
  }[];

  directory_certifications?: {
    id: string;
    title?: string;
    attachments?: {
      url?: string;
      name?: string;
    };
  }[];
  practiceLogo: string | undefined | any;
  practicePhone: string | undefined;
  directory_services: any;
  directory_team_members: Dentist[] | undefined;
  directory_gallery_posts: any;
  directory_testimonials: string | undefined;
  openingHours: any;
  directory_locations: any;
}