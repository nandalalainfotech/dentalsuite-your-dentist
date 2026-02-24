import { FilterActionTypes } from '../constants';
import type { SearchFilters } from '../../types/filters';

export const setFilters = (filters: SearchFilters) => ({
  type: FilterActionTypes.SET_FILTERS,
  payload: filters,
});

export const clearFilters = () => ({
  type: FilterActionTypes.CLEAR_FILTERS,
});
