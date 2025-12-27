import { clinics } from '../data/clinics';
import type { Dentist, DentistWithClinic } from '../types';

export const dentistApi = {
  getDentistsByClinic: (clinicId: string): Dentist[] => {
    const clinic = clinics.find((c: import('../types').Clinic) => c.id === clinicId);
    return clinic?.dentists || [];
  },

  searchDentists: (keyword: string): DentistWithClinic[] => {
    const lower = keyword.toLowerCase();
    const allDentists: DentistWithClinic[] = [];

    clinics.forEach((clinic) => {
      if (clinic.dentists) {
        clinic.dentists.forEach((dentist) => {
          if (
            dentist.name.toLowerCase().includes(lower) ||
            dentist.specialities.some((s: string) => s.toLowerCase().includes(lower)) ||
            dentist.qualification.toLowerCase().includes(lower)
          ) {
            allDentists.push({ dentist, clinic });
          }
        });
      }
    });

    return allDentists;
  },

  getDentistById: (dentistId: string) => {
    for (const clinic of clinics) {
      const dentist = clinic.dentists?.find(d => d.id === dentistId);
      if (dentist) {
        return { dentist, clinicId: clinic.id, clinicName: clinic.name };
      }
    }
    return null;
  },

  getAllGenders: (): string[] => {
    return ["male", "female", "other"];
  },

  getClinicDentists: (clinicId: string) => {
    const clinic = clinics.find(c => c.id === clinicId);
    return clinic?.dentists || [];
  }
};