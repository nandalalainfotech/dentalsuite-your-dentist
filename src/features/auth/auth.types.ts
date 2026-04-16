export interface User {
  id: string;

  // existing
  practiceId?: string;
  email: string;
  practiceName: string;
  phone: string;

  type?: string;  
  status?: string; 

}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // optional UI state support
  successMessage?: string | null;
}

// =========================
// SIGNUP DROPDOWN OPTIONS
// =========================
export interface PracticeTypeOption {
  value: string;
  label: string;
}

export interface StateOption {
  code: string;
  name: string;
}

// =========================
// SIGNUP PAYLOAD (FRONTEND FORM)
// =========================
export interface SignupPayload {
  practiceName: string;
  abnNumber: string;
  email: string;
  password: string;

  firstName: string;
  lastName: string;
  mobileNumber: string;


  practiceAddress: string;
  practiceCity: string;
  practiceState: string;
  practicePostcode: string;

  practicePhone: string;
  practiceType: string;

  // =========================
  // NEW (IMPORTANT)
  // =========================
  type?: string; 
}

// =========================
// BACKEND INSERT FORMAT (accounts table mapping)
// =========================
export interface RegisterPracticePayload {
  practice_name: string;
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

  password: string;


  // NEW
  type?: string;
  status?: string;
}