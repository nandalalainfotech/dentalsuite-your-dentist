export interface FilterState {
  serviceInput: string;
  locationInput: string;
  selectedLanguage: string[];
  selectedGender: string[];
  selectedSpecialty: string[];
  selectedInsurance: string[];
  selectedAvailableDays: string[];
}

export interface SearchFilters {
  service?: string;
  location?: string;
  language?: string;
  gender?: string;
  specialty?: string;
  insurance?: string;
  availableDays?: string;
}