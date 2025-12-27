import { clinics } from '../data/clinics';
import type { Clinic, SearchFilters } from '../types';

export const clinicApi = {
  getAllClinics: async (): Promise<Clinic[]> => clinics,

  getClinicById: (id: string): Clinic | undefined => {
    return clinics.find(c => c.id === id);
  },

  searchClinics: (keyword: string): Clinic[] => {
    const lower = keyword.toLowerCase();
    return clinics.filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.address.toLowerCase().includes(lower) ||
      c.specialities.some(s => s.toLowerCase().includes(lower))
    );
  },

  searchClinicsByLocation: (location: string): Clinic[] => {
    const lower = location.toLowerCase();
    return clinics.filter(c => c.address.toLowerCase().includes(lower));
  },

  searchClinicsBySpecialty: (specialty: string): Clinic[] => {
    const lower = specialty.toLowerCase();
    return clinics.filter(c =>
      c.specialities.some(s => s.toLowerCase().includes(lower))
    );
  },

  searchClinicsWithFilters: (filters: SearchFilters): Clinic[] => {
    let filteredClinics = clinics;

    if (filters.service) {
      const serviceLower = filters.service.toLowerCase();
      filteredClinics = filteredClinics.filter(c =>
        c.name.toLowerCase().includes(serviceLower) ||
        c.specialities.some(s => s.toLowerCase().includes(serviceLower))
      );
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filteredClinics = filteredClinics.filter(c =>
        c.address.toLowerCase().includes(locationLower)
      );
    }

    if (filters.specialty) {
      const specialtyLower = filters.specialty.toLowerCase();
      filteredClinics = filteredClinics.filter(c =>
        c.specialities.some(s => s.toLowerCase().includes(specialtyLower))
      );
    }

    if (filters.language || filters.gender || filters.insurance || filters.availableDays) {
      filteredClinics = filteredClinics.filter(clinic => {
        // If clinic has no dentists, only include it if we're not filtering by language/gender
        if (!clinic.dentists || clinic.dentists.length === 0) {
          return !filters.language && !filters.gender && !filters.insurance && !filters.availableDays;
        }

        return clinic.dentists.some(dentist => {
          let matchesLanguage = true;
          let matchesGender = true;
          let matchesInsurance = true;
          let matchesAvailableDays = true;

          if (filters.language) {
            const languages = filters.language.split(',').map((l: string) => l.trim().toLowerCase());
            matchesLanguage = dentist.languages?.some((lang: string) =>
              languages.some((filterLang: string) => lang.toLowerCase().includes(filterLang))
            ) || false;
          }

          if (filters.gender) {
            const genders = filters.gender.split(',').map(g => g.trim().toLowerCase());
            matchesGender = genders.some(filterGender =>
              dentist.gender?.toLowerCase() === filterGender
            ) || false;
          }

          if (filters.insurance) {
            const insurances = filters.insurance.split(',').map(i => i.trim().toLowerCase());
            matchesInsurance = clinic.insurance?.some(ins =>
              insurances.some(filterIns => ins.toLowerCase().includes(filterIns))
            ) || false;
          }

          if (filters.availableDays) {
            const days = filters.availableDays.split(',').map((d: string) => d.trim().toLowerCase());
            matchesAvailableDays = dentist.availabledays?.some((day: string) =>
              days.some((filterDay: string) => day.toLowerCase() === filterDay)
            ) || false;
          }

          return matchesLanguage && matchesGender && matchesInsurance && matchesAvailableDays;
        });
      });
    }

    return filteredClinics;
  },

  extractStateCode: (address: string): string => {
    const parts = address.split(" ");
    return parts[parts.length - 2]; // second last value
  },

  getAllLanguages: (): string[] => {
    const languages = new Set<string>();
    clinics.forEach(clinic => {
      clinic.dentists?.forEach(dentist => {
        dentist.languages?.forEach(lang => languages.add(lang));
      });
    });
    return Array.from(languages).sort();
  },

  getAllSpecialties: (): string[] => {
    const specialties = new Set<string>();
      clinics.forEach((clinic) => {
        clinic.specialities.forEach((spec: string) => specialties.add(spec));
        clinic.dentists?.forEach((dentist) => {
          dentist.specialities.forEach((spec: string) => specialties.add(spec));
        });
      });
    return Array.from(specialties).sort();
  },

  getAllInsurances: (): string[] => {
    const insurances = new Set<string>();
    clinics.forEach(clinic => {
      clinic.insurance?.forEach(ins => insurances.add(ins));
    });
    return Array.from(insurances).sort();
  },

  getAllAvailableDays: (): string[] => {
    const days = new Set<string>();
    clinics.forEach(clinic => {
      clinic.dentists?.forEach(dentist => {
        dentist.availabledays?.forEach(day => days.add(day));
      });
    });
    return Array.from(days).sort();
  },

  updateDentistSlots: (clinicId: string, dentistId: string, slots: import('../types').TimeSlot[]): boolean => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (clinic) {
      const dentist = clinic.dentists?.find(d => d.id === dentistId);
      if (dentist) {
        dentist.slots = slots;
        return true;
      }
    }
    return false;
  }
};