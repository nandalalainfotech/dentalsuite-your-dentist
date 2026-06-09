import { useEffect, useState } from "react";
import type { PatientProfile } from "./dashboard.types";
import { getProfile } from "./dashboard.service";

export const useDashboard = () => {
  const [patient, setPatient] =
    useState<PatientProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response =
          await getProfile();

        setPatient(
          response.patient,
        );
      } catch (error) {
        console.error(
          "Failed to fetch profile",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    patient,
    loading,
  };
};

export const useProfile = () => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();

      setPatient(response.patient);
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    patient,
    loading,
    fetchProfile,
  };
};