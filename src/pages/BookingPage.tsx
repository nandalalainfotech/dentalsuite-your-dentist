import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ClinicService, { type Clinic, type Dentist } from "../services/ClinicService";
import { useBooking } from "../contexts/BookingContext";

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: dentistId } = useParams<{ id: string }>();
    const { setDentistId, setDentist, setClinic, setDateTime, setSelectedService } = useBooking();
    const [dentist, setDentistState] = useState<Dentist | null>(null);
    const [clinic, setClinicState] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            if (!dentistId) {
                setError("No dentist ID provided");
                setLoading(false);
                return;
            }

            try {
                const response = await ClinicService.getAllClinics();
                const allClinics = response as Clinic[];

                const foundClinic = allClinics.find((c) =>
                    c.dentists?.some((d) => String(d.id) === dentistId)
                );

                if (!foundClinic) {
                    setError("Clinic not found");
                    setLoading(false);
                    return;
                }

                const foundDentist = foundClinic.dentists?.find(
                    (d) => String(d.id) === dentistId
                ) ?? null;

                if (!foundDentist) {
                    setError("Dentist not found");
                    setLoading(false);
                    return;
                }

                setClinicState(foundClinic);
                setClinic(foundClinic);
                setDentistState(foundDentist);
                setDentist(foundDentist);
                setDentistId(dentistId);

                const state = location.state as {
                    date?: string;
                    time?: string;
                    service?: string
                } | null;

                if (state?.date && state?.time) {
                    const dateObj = new Date(state.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    setDateTime(formattedDate, state.time);

                    if (state.service) {
                        setSelectedService(state.service);
                    }
                }

                navigate(`/booking/${dentistId}/step-1`);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Unable to load appointment information.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dentistId, location.state, navigate, setClinic, setDateTime, setDentist, setDentistId, setSelectedService]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-600"></div>
        </div>
    );

    if (error || !dentist || !clinic) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">Error</h2>
                <p className="text-gray-600">{error || "Data not found"}</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-orange-600 font-medium hover:underline">Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900">Loading booking...</h2>
                <p className="text-gray-600">Setting up your appointment</p>
            </div>
        </div>
    );
};

export default BookingPage;