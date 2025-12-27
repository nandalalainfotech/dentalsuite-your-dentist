import { useState, useMemo } from 'react';
import { clinicApi } from '../api';
import { useFilters } from './filters/useFilters';
import type { Clinic, SearchFilters, Dentist, TimeSlot } from '../types';

interface TimeSlotWithDentist {
  time: string;
  dentistName: string;
  dentistId: string;
}

export const useClinicData = () => {
  const getAllAvailableSlots = (clinic: Clinic): TimeSlotWithDentist[] => {
    if (!clinic.dentists) return [];
    const allSlots: TimeSlotWithDentist[] = [];

    clinic.dentists.forEach((dentist: Dentist) => {
      if (dentist.slots) {
        dentist.slots
          .filter((slot: TimeSlot) => slot.available)
          .forEach((slot: TimeSlot) => {
            allSlots.push({
              time: slot.time,
              dentistName: dentist.name,
              dentistId: dentist.id
            });
          });
      }
    });

    return allSlots.sort((a, b) => {
      const timeA = new Date(`2000-01-01 ${a.time}`);
      const timeB = new Date(`2000-01-01 ${b.time}`);
      return timeA.getTime() - timeB.getTime();
    });
  };

  return { getAllAvailableSlots };
};

export const useHomeSearch = () => {
  const [serviceResults, setServiceResults] = useState<Clinic[]>([]);
  const [locationResults, setLocationResults] = useState<Clinic[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<"service" | "location" | null>(null);

  const {
    state: {
      serviceInput,
      locationInput,
      selectedLanguage,
      selectedGender,
      selectedSpecialty,
      selectedInsurance,
      selectedAvailableDays,
    },
    setServiceInput,
    setLocationInput,
  } = useFilters();

  const handleServiceChange = (value: string) => {
    setServiceInput(value);
    setActiveDropdown("service");
    const results = clinicApi.searchClinics(value);
    setServiceResults(results);
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    setActiveDropdown("location");
    const results = clinicApi.searchClinics(value);
    setLocationResults(results);
  };

  const handleClearService = () => {
    setServiceInput("");
    setActiveDropdown(null);
  };

  const handleClearLocation = () => {
    setLocationInput("");
    setActiveDropdown(null);
  };

  const { searchResults, showResults } = useMemo(() => {
    const hasAnyFilter = serviceInput || locationInput ||
      selectedLanguage.length > 0 || selectedGender.length > 0 ||
      selectedSpecialty.length > 0 || selectedInsurance.length > 0 || selectedAvailableDays.length > 0;

    if (hasAnyFilter) {
      const filters: SearchFilters = {
        service: serviceInput,
        location: locationInput,
        language: selectedLanguage.length > 0 ? selectedLanguage.join(',') : undefined,
        gender: selectedGender.length > 0 ? selectedGender.join(',') : undefined,
        specialty: selectedSpecialty.length > 0 ? selectedSpecialty.join(',') : undefined,
        insurance: selectedInsurance.length > 0 ? selectedInsurance.join(',') : undefined,
        availableDays: selectedAvailableDays.length > 0 ? selectedAvailableDays.join(',') : undefined,
      };

      return {
        searchResults: clinicApi.searchClinicsWithFilters(filters),
        showResults: true
      };
    }

    return {
      searchResults: [],
      showResults: false
    };
  }, [serviceInput, locationInput, selectedLanguage, selectedGender, selectedSpecialty, selectedInsurance, selectedAvailableDays]);

  const languages = useMemo(() => clinicApi.getAllLanguages(), []);
  const specialties = useMemo(() => clinicApi.getAllSpecialties(), []);
  const insuranceOptions = useMemo(() => clinicApi.getAllInsurances(), []);
  const availableDaysOptions = useMemo(() => clinicApi.getAllAvailableDays(), []);
  const genderOptions = ["male", "female", "other"];

  return {
    serviceResults,
    locationResults,
    activeDropdown,
    setActiveDropdown,
    searchResults,
    showResults,
    serviceInput,
    locationInput,
    setServiceInput,
    setLocationInput,
    languages,
    specialties,
    insuranceOptions,
    availableDaysOptions,
    genderOptions,
    handleServiceChange,
    handleLocationChange,
    handleClearService,
    handleClearLocation,
  };
};