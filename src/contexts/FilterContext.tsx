import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

interface FilterState {
  serviceInput: string;
  locationInput: string;
  selectedLanguage: string[];
  selectedGender: string[];
  selectedSpecialty: string[];
  selectedInsurance: string[];
  selectedAvailableDays: string[];
}

type FilterAction =
  | { type: 'SET_SERVICE_INPUT'; payload: string }
  | { type: 'SET_LOCATION_INPUT'; payload: string }
  | { type: 'SET_SELECTED_LANGUAGE'; payload: string[] }
  | { type: 'SET_SELECTED_GENDER'; payload: string[] }
  | { type: 'SET_SELECTED_SPECIALTY'; payload: string[] }
  | { type: 'SET_SELECTED_INSURANCE'; payload: string[] }
  | { type: 'SET_SELECTED_AVAILABLE_DAYS'; payload: string[] }
  | { type: 'CLEAR_ALL_FILTERS' }
  | { type: 'LOAD_FILTERS'; payload: FilterState };

const initialState: FilterState = {
  serviceInput: '',
  locationInput: '',
  selectedLanguage: [],
  selectedGender: [],
  selectedSpecialty: [],
  selectedInsurance: [],
  selectedAvailableDays: [],
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SERVICE_INPUT':
      return { ...state, serviceInput: action.payload };
    case 'SET_LOCATION_INPUT':
      return { ...state, locationInput: action.payload };
    case 'SET_SELECTED_LANGUAGE':
      return { ...state, selectedLanguage: action.payload };
    case 'SET_SELECTED_GENDER':
      return { ...state, selectedGender: action.payload };
    case 'SET_SELECTED_SPECIALTY':
      return { ...state, selectedSpecialty: action.payload };
    case 'SET_SELECTED_INSURANCE':
      return { ...state, selectedInsurance: action.payload };
    case 'SET_SELECTED_AVAILABLE_DAYS':
      return { ...state, selectedAvailableDays: action.payload };
    case 'CLEAR_ALL_FILTERS':
      return initialState;
    case 'LOAD_FILTERS':
      return action.payload;
    default:
      return state;
  }
}

interface FilterContextType {
  state: FilterState;
  setServiceInput: (value: string) => void;
  setLocationInput: (value: string) => void;
  setSelectedLanguage: (languages: string[]) => void;
  setSelectedGender: (genders: string[]) => void;
  setSelectedSpecialty: (specialties: string[]) => void;
  setSelectedInsurance: (insurances: string[]) => void;
  setSelectedAvailableDays: (days: string[]) => void;
  clearAllFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('dentalFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        dispatch({ type: 'LOAD_FILTERS', payload: parsedFilters });
      } catch (error) {
        console.error('Error loading filters from localStorage:', error);
      }
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('dentalFilters', JSON.stringify(state));
  }, [state]);

  const setServiceInput = (value: string) => {
    dispatch({ type: 'SET_SERVICE_INPUT', payload: value });
  };

  const setLocationInput = (value: string) => {
    dispatch({ type: 'SET_LOCATION_INPUT', payload: value });
  };

  const setSelectedLanguage = (languages: string[]) => {
    dispatch({ type: 'SET_SELECTED_LANGUAGE', payload: languages });
  };

  const setSelectedGender = (genders: string[]) => {
    dispatch({ type: 'SET_SELECTED_GENDER', payload: genders });
  };

  const setSelectedSpecialty = (specialties: string[]) => {
    dispatch({ type: 'SET_SELECTED_SPECIALTY', payload: specialties });
  };

  const setSelectedInsurance = (insurances: string[]) => {
    dispatch({ type: 'SET_SELECTED_INSURANCE', payload: insurances });
  };

  const setSelectedAvailableDays = (days: string[]) => {
    dispatch({ type: 'SET_SELECTED_AVAILABLE_DAYS', payload: days });
  };

  const clearAllFilters = () => {
    dispatch({ type: 'CLEAR_ALL_FILTERS' });
  };

  return (
    <FilterContext.Provider
      value={{
        state,
        setServiceInput,
        setLocationInput,
        setSelectedLanguage,
        setSelectedGender,
        setSelectedSpecialty,
        setSelectedInsurance,
        setSelectedAvailableDays,
        clearAllFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}