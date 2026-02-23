import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Practice } from '../../types/auth';
import type { DentistWithClinic } from '../../types/dentist';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

interface BookingState {
  currentStep: number;
  selectedPractice: Practice | null;
  selectedDentist: DentistWithClinic | null;
  selectedService: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  personalDetails: PersonalDetails | null;
  selectedFamilyMemberId: string | null;
  paymentMethod: 'card' | 'insurance' | 'later';
  bookingData: {
    notes?: string;
    isEmergency: boolean;
  } | null;
  availableSlots: TimeSlot[];
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: BookingState = {
  currentStep: 1,
  selectedPractice: null,
  selectedDentist: null,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  personalDetails: null,
  selectedFamilyMemberId: null,
  paymentMethod: 'later',
  bookingData: null,
  availableSlots: [],
  isSubmitting: false,
  isSuccess: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setSelectedPractice: (state, action: PayloadAction<Practice | null>) => {
      state.selectedPractice = action.payload;
      state.selectedDentist = null;
      state.selectedService = null;
      state.selectedDate = null;
      state.selectedTime = null;
    },
    setSelectedDentist: (state, action: PayloadAction<DentistWithClinic | null>) => {
      state.selectedDentist = action.payload;
      state.selectedService = null;
      state.selectedDate = null;
      state.selectedTime = null;
    },
    setSelectedService: (state, action: PayloadAction<string | null>) => {
      state.selectedService = action.payload;
      state.selectedDate = null;
      state.selectedTime = null;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
      state.selectedTime = null;
    },
    setSelectedTime: (state, action: PayloadAction<string | null>) => {
      state.selectedTime = action.payload;
    },
    setPersonalDetails: (state, action: PayloadAction<PersonalDetails | null>) => {
      state.personalDetails = action.payload;
    },
    setSelectedFamilyMember: (state, action: PayloadAction<string | null>) => {
      state.selectedFamilyMemberId = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<BookingState['paymentMethod']>) => {
      state.paymentMethod = action.payload;
    },
    setBookingData: (state, action: PayloadAction<BookingState['bookingData']>) => {
      state.bookingData = action.payload;
    },
    setAvailableSlots: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableSlots = action.payload;
    },
    submitBooking: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    submitBookingSuccess: (state) => {
      state.isSubmitting = false;
      state.isSuccess = true;
    },
    submitBookingFailure: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },
    resetBooking: (state) => {
      state.currentStep = 1;
      state.selectedPractice = null;
      state.selectedDentist = null;
      state.selectedService = null;
      state.selectedDate = null;
      state.selectedTime = null;
      state.personalDetails = null;
      state.selectedFamilyMemberId = null;
      state.paymentMethod = 'later';
      state.bookingData = null;
      state.availableSlots = [];
      state.isSubmitting = false;
      state.isSuccess = false;
      state.error = null;
    },
    setBookingLoading: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setBookingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStep,
  nextStep,
  previousStep,
  setSelectedPractice,
  setSelectedDentist,
  setSelectedService,
  setSelectedDate,
  setSelectedTime,
  setPersonalDetails,
  setSelectedFamilyMember,
  setPaymentMethod,
  setBookingData,
  setAvailableSlots,
  submitBooking,
  submitBookingSuccess,
  submitBookingFailure,
  resetBooking,
  setBookingLoading,
  setBookingError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
