export interface PracticeProfile {
  id: string;
  practiceName: string;
  abnNumber?: string;
  email: string;
  phone: string;
  logo: string | null;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  practiceType?: string;
}

export interface DashboardState {
  profile: PracticeProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Payload for the Update Form
export interface UpdateProfilePayload {
  practiceName: string;
  abnNumber: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  practiceType: string;
  logo?: string; // Optional if updating image
}