export interface AppointmentType {
  id: string;
  name: string;
  existingEnabled: boolean;
  existingDuration: number;
  existingFutureBookingLimit: number;
  newEnabled: boolean;
  newDuration: number;
  newFutureBookingLimit: number;
  newTermsEnabled: boolean;
  onlineEnabled: boolean;
  askReason: boolean;
  addMessage: boolean;
  unavailableAction: 'call' | 'inform';
  cancellationEnabled: boolean;
  sortOrder?: number;
}

export interface PractitionerSetting {
  ex: boolean;
  new: boolean;
}

export interface TeamMemberApptContext {
  id: string;
  first_name: string;
  last_name: string;
  appointmentTypes: any[]; 
}

export interface AppointmentTypesState {
  data: AppointmentType[];
  teamMembers: TeamMemberApptContext[];
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
}