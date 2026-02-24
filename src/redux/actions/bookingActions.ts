import { BookingActionTypes } from '../constants';
import type { PersonalDetails } from '../../types/booking';

export interface BookingData {
  clinicId?: string;
  dentistId?: string;
  appointmentType?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  personalDetails?: PersonalDetails;
}

export const setBookingData = (data: BookingData) => ({
  type: BookingActionTypes.SET_BOOKING_DATA,
  payload: data,
});

export const clearBooking = () => ({
  type: BookingActionTypes.CLEAR_BOOKING,
});

export const setBookingStep = (step: number) => ({
  type: BookingActionTypes.SET_STEP,
  payload: step,
});
