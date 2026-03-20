export interface User {
  id: string;
  email: string;
  practiceName: string;
  phone: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage?: string | null; 
}
export interface PracticeTypeOption {
  value: string;
  label: string;
}


export interface StateOption {
  code: string;
  name: string;
}

export interface SignupPayload {
  practiceName: string;
  abnNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  practiceLogo?: string;
  practiceAddress: string;
  practiceCity: string;
  practiceState: string;
  practicePostcode: string;
  practicePhone: string;
  practiceType: string;
}


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
  logo?: string;
}