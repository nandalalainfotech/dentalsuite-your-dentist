export interface PatientProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  date_of_birth: string;
  gender: string;
  type?: string;
  profile_image?: string;
  status: string;
}