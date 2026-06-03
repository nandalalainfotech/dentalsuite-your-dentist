export interface SignupPatientPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  mobileNumber: string;
}

export interface LoginPatientPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  patient?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}