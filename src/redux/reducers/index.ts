import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import clinicReducer from '../slices/clinicSlice';
import bookingReducer from '../slices/bookingSlice';
import filterReducer from '../slices/filterSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  clinic: clinicReducer,
  booking: bookingReducer,
  filters: filterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export { authReducer, clinicReducer, bookingReducer, filterReducer };
