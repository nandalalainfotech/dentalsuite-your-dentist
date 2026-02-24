import { FilterActionTypes } from '../constants';
import type { SearchFilters } from '../../types/filters';

export interface FilterState {
  filters: SearchFilters;
}

const initialState: FilterState = {
  filters: {
    service: '',
    location: '',
    language: '',
    gender: '',
    specialty: '',
    insurance: '',
    availableDays: '',
  },
};

export const filterReducer = (state = initialState, action: { type: string; payload?: unknown }) => {
  switch (action.type) {
    case FilterActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: action.payload as SearchFilters,
      };
    case FilterActionTypes.CLEAR_FILTERS:
      return initialState;
    default:
      return state;
  }
};
