import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBooking } from "./useBookingContext";
import { clinicApi } from "../../api";
import type { Clinic, Dentist } from "../../types";

export function useBookingDataLoader() {
  const { id: dentistId } = useParams<{ id: string }>();
  const { state, setDentistId, setDentist, setClinic } = useBooking();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBookingData = async () => {
      if (!dentistId) return;
      
      // If booking context is empty, reload the data
      if (!state.dentistId || !state.dentist) {
        setLoading(true);
        try {
          const allClinics = await clinicApi.getAllClinics();
          const foundClinic = allClinics.find((c: Clinic) =>
            c.dentists?.some((d: Dentist) => String(d.id) === dentistId)
          );

          if (foundClinic) {
            const foundDentist = foundClinic.dentists?.find(
              (d: Dentist) => String(d.id) === dentistId
            );

            if (foundDentist) {
              setDentistId(dentistId);
              setDentist(foundDentist);
              setClinic(foundClinic);
            }
          }
        } catch (error) {
          console.error('Error loading booking data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadBookingData();
  }, [dentistId, state.dentistId, state.dentist, setDentistId, setDentist, setClinic]);

  return { loading, hasData: !!(state.dentist && state.clinic) };
}