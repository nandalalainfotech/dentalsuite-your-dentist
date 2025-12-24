import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Dentist, Clinic } from '../services/ClinicService';

interface PersonalDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    reason: string;
}

interface BookingState {
    appointmentFor: "myself" | "someone-else" | null;
    patientStatus: "new" | "existing" | null;
    selectedService: string | null;
    personalDetails: PersonalDetails | null;
    selectedDate: string | null;
    selectedTime: string | null;
    dentistId: string | null;
    dentist: Dentist | null;
    clinic: Clinic | null;
}

type BookingAction =
    | { type: 'SET_DENTIST_ID'; payload: string }
    | { type: 'SET_DENTIST'; payload: Dentist }
    | { type: 'SET_CLINIC'; payload: Clinic }
    | { type: 'SET_APPOINTMENT_FOR'; payload: "myself" | "someone-else" }
    | { type: 'SET_PATIENT_STATUS'; payload: "new" | "existing" }
    | { type: 'SET_SELECTED_SERVICE'; payload: string }
    | { type: 'SET_PERSONAL_DETAILS'; payload: PersonalDetails }
    | { type: 'SET_DATE_TIME'; payload: { date: string; time: string } }
    | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
    appointmentFor: null,
    patientStatus: null,
    selectedService: null,
    personalDetails: null,
    selectedDate: null,
    selectedTime: null,
    dentistId: null,
    dentist: null,
    clinic: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SET_DENTIST_ID':
            return { ...state, dentistId: action.payload };
        case 'SET_DENTIST':
            return { ...state, dentist: action.payload };
        case 'SET_CLINIC':
            return { ...state, clinic: action.payload };
        case 'SET_APPOINTMENT_FOR':
            return { ...state, appointmentFor: action.payload };
        case 'SET_PATIENT_STATUS':
            return { ...state, patientStatus: action.payload };
        case 'SET_SELECTED_SERVICE':
            return { ...state, selectedService: action.payload };
        case 'SET_PERSONAL_DETAILS':
            return { ...state, personalDetails: action.payload };
        case 'SET_DATE_TIME':
            return {
                ...state,
                selectedDate: action.payload.date,
                selectedTime: action.payload.time
            };
        case 'RESET_BOOKING':
            return initialState;
        default:
            return state;
    }
}

interface BookingContextType {
    state: BookingState;
    setDentistId: (id: string) => void;
    setDentist: (dentist: Dentist) => void;
    setClinic: (clinic: Clinic) => void;
    setAppointmentFor: (appointmentFor: "myself" | "someone-else") => void;
    setPatientStatus: (status: "new" | "existing") => void;
    setSelectedService: (service: string) => void;
    setPersonalDetails: (details: PersonalDetails) => void;
    setDateTime: (date: string, time: string) => void;
    resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
    children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    const setDentistId = (id: string) => {
        dispatch({ type: 'SET_DENTIST_ID', payload: id });
    };

    const setDentist = (dentist: Dentist) => {
        dispatch({ type: 'SET_DENTIST', payload: dentist });
    };

    const setClinic = (clinic: Clinic) => {
        dispatch({ type: 'SET_CLINIC', payload: clinic });
    };

    const setAppointmentFor = (appointmentFor: "myself" | "someone-else") => {
        dispatch({ type: 'SET_APPOINTMENT_FOR', payload: appointmentFor });
    };

    const setPatientStatus = (status: "new" | "existing") => {
        dispatch({ type: 'SET_PATIENT_STATUS', payload: status });
    };

    const setSelectedService = (service: string) => {
        dispatch({ type: 'SET_SELECTED_SERVICE', payload: service });
    };

    const setPersonalDetails = (details: PersonalDetails) => {
        dispatch({ type: 'SET_PERSONAL_DETAILS', payload: details });
    };

    const setDateTime = (date: string, time: string) => {
        dispatch({ type: 'SET_DATE_TIME', payload: { date, time } });
    };

    const resetBooking = () => {
        dispatch({ type: 'RESET_BOOKING' });
    };

    return (
        <BookingContext.Provider
            value={{
                state,
                setDentistId,
                setDentist,
                setClinic,
                setAppointmentFor,
                setPatientStatus,
                setSelectedService,
                setPersonalDetails,
                setDateTime,
                resetBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}