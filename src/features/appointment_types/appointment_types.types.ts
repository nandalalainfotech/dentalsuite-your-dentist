export interface AppointmentType {
  id: string;
  name: string;
  existingEnabled: boolean;
  existingDuration: number;
  existingLink: string;
  existingFutureBookingLimit: number;
  newEnabled: boolean;
  newDuration: number;
  newLink: string;
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
  name: string;
  appointmentTypes: any[]; 
}

export interface AppointmentTypesState {
  data: AppointmentType[];
  teamMembers: TeamMemberApptContext[];
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
}