import type { Clinic } from './clinic';

export interface DentistWithClinic {
  dentist: import('./clinic').Dentist;
  clinic: Clinic;
}