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
  available?: boolean;
  website?: string;
  rating?: number;
  logo?: string;
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
  parking?: boolean;
  emergency?: boolean;
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
}