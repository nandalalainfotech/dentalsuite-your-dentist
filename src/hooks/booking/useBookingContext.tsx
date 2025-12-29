import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { PersonalDetails } from '../../types';
import type { Clinic, Dentist } from '../../types';

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
  isAuthenticated: boolean;
  user: PersonalDetails | null;
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
  | { type: 'SET_AUTHENTICATION'; payload: { isAuthenticated: boolean; user: PersonalDetails | null } }
  | { type: 'RESET_BOOKING' };

const loadPersistedState = (): BookingState => {
  try {
    const savedState = localStorage.getItem('bookingState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState,
        personalDetails: null,
        isAuthenticated: false,
        user: null,
      };
    }
  } catch (error) {
    console.error('Error loading booking state from localStorage:', error);
  }
  return {
    appointmentFor: null,
    patientStatus: null,
    selectedService: null,
    personalDetails: null,
    selectedDate: null,
    selectedTime: null,
    dentistId: null,
    dentist: null,
    clinic: null,
    isAuthenticated: false,
    user: null,
  };
};

const initialState: BookingState = loadPersistedState();

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
    case 'SET_AUTHENTICATION':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user
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
  setAuthentication: (isAuthenticated: boolean, user: PersonalDetails | null) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  useEffect(() => {
    try {
      const stateToSave = {
        ...state,
        personalDetails: null,
        isAuthenticated: false,
        user: null,
      };
      localStorage.setItem('bookingState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving booking state to localStorage:', error);
    }
  }, [state]);

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

  const setAuthentication = (isAuthenticated: boolean, user: PersonalDetails | null) => {
    dispatch({ type: 'SET_AUTHENTICATION', payload: { isAuthenticated, user } });
  };

  const resetBooking = () => {
    try {
      localStorage.removeItem('bookingState');
    } catch (error) {
      console.error('Error clearing booking state from localStorage:', error);
    }
    dispatch({ type: 'RESET_BOOKING' });
  };

  const contextValue: BookingContextType = {
    state,
    setDentistId,
    setDentist,
    setClinic,
    setAppointmentFor,
    setPatientStatus,
    setSelectedService,
    setPersonalDetails,
    setDateTime,
    setAuthentication,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={contextValue}>
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