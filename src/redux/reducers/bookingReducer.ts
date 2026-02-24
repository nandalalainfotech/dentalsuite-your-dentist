import { BookingActionTypes } from '../constants';
import type { BookingData } from '../actions/bookingActions';

export interface BookingState {
  bookingData: BookingData;
  currentStep: number;
}

const initialState: BookingState = {
  bookingData: {},
  currentStep: 1,
};

export const bookingReducer = (state = initialState, action: { type: string; payload?: unknown }) => {
  switch (action.type) {
    case BookingActionTypes.SET_BOOKING_DATA:
      return {
        ...state,
        bookingData: {
          ...state.bookingData,
          ...(action.payload as BookingData),
        },
      };
    case BookingActionTypes.CLEAR_BOOKING:
      return initialState;
    case BookingActionTypes.SET_STEP:
      return {
        ...state,
        currentStep: action.payload as number,
      };
    default:
      return state;
  }
};
