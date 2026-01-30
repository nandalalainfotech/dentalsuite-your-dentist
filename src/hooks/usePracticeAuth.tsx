import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Practice } from '../types/auth';
import { validateAllPracticeCredentials, findPracticeByEmail, addPractice, updatePractice } from '../data/practices';

// ----------------------------------------------------------------------
// 1. STATIC DATA & CONFIGURATION
// ----------------------------------------------------------------------

const AUTH_CONSTANTS = {
  STORAGE_KEY: 'practice',

  MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_INVALID: 'Invalid email/mobile or password',
    LOGIN_ERROR: 'An error occurred during login',

    SIGNUP_SUCCESS: 'Practice account created successfully',
    SIGNUP_EMAIL_EXISTS: 'Practice with this email already exists',
    SIGNUP_ERROR: 'An error occurred during signup',

    CONTEXT_ERROR: 'usePracticeAuth must be used within a PracticeAuthProvider'
  },

  INITIAL_STATE: {
    practice: null as Practice | null,
    isAuthenticated: false,
    isLoading: true
  }
};

// ----------------------------------------------------------------------
// 2. INTERFACES & TYPES
// ----------------------------------------------------------------------

export interface SignupCredentials {
  practiceName: string;
  abnNumber: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  practiceType: 'general_dentistry' | 'specialist' | 'cosmetic' | 'orthodontic' | 'pediatric';
  practicePhone: string;
  practiceAddress: string;
  practiceCity: string;
  practiceState: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  practicePostcode: string;
}

interface PracticeAuthState {
  practice: Practice | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface PracticeAuthContextType extends PracticeAuthState {
  login: (credentials: { emailOrMobile: string; password: string }) => Promise<{ success: boolean; message: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (practiceData: Partial<Practice>) => void;
}

// ----------------------------------------------------------------------
// 3. CONTEXT & PROVIDER LOGIC
// ----------------------------------------------------------------------

const PracticeAuthContext = createContext<PracticeAuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const usePracticeAuth = () => {
  const context = useContext(PracticeAuthContext);
  if (context === undefined) {
    throw new Error(AUTH_CONSTANTS.MESSAGES.CONTEXT_ERROR);
  }
  return context;
};

interface PracticeAuthProviderProps {
  children: ReactNode;
}

export const PracticeAuthProvider: React.FC<PracticeAuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<PracticeAuthState>(AUTH_CONSTANTS.INITIAL_STATE);

  useEffect(() => {
    const savedPractice = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEY);
    if (savedPractice) {
      try {
        const practice = JSON.parse(savedPractice);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          practice,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEY);
        setState({ ...AUTH_CONSTANTS.INITIAL_STATE, isLoading: false });
        console.error("The error is", error);
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: { emailOrMobile: string; password: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const practice = validateAllPracticeCredentials(credentials.emailOrMobile, credentials.password);

      if (practice) {
        setState({
          practice,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY, JSON.stringify(practice));
        return { success: true, message: AUTH_CONSTANTS.MESSAGES.LOGIN_SUCCESS };
      } else {
        return { success: false, message: AUTH_CONSTANTS.MESSAGES.LOGIN_INVALID };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false, message: AUTH_CONSTANTS.MESSAGES.LOGIN_ERROR };
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const existingPractice = findPracticeByEmail(credentials.email);

      if (existingPractice) {
        return { success: false, message: AUTH_CONSTANTS.MESSAGES.SIGNUP_EMAIL_EXISTS };
      }

      const newPractice = addPractice({
        practiceName: credentials.practiceName,
        abnNumber: credentials.abnNumber,
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        mobileNumber: credentials.mobileNumber,
        practiceType: credentials.practiceType,
        practicePhone: credentials.practicePhone,
        practiceAddress: credentials.practiceAddress,
        practiceCity: credentials.practiceCity,
        practiceState: credentials.practiceState,
        practicePostcode: credentials.practicePostcode
      });

      setState({
        practice: newPractice,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY, JSON.stringify(newPractice));

      return { success: true, message: AUTH_CONSTANTS.MESSAGES.SIGNUP_SUCCESS };
    } catch (error) {
      console.log("The error is", error);
      return { success: false, message: AUTH_CONSTANTS.MESSAGES.SIGNUP_ERROR };
    }
  };

  const logout = () => {
    setState({ ...AUTH_CONSTANTS.INITIAL_STATE, isLoading: false });
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEY);
  };

  const updateProfile = (practiceData: Partial<Practice>): void => {
    setState(prev => {
      if (!prev.practice) return prev;

      const updatedPractice = updatePractice(prev.practice.id, practiceData);
      if (updatedPractice) {
        localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY, JSON.stringify(updatedPractice));
        return { ...prev, practice: updatedPractice };
      }
      return prev;
    });
  };

  const value: PracticeAuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <PracticeAuthContext.Provider value={value}>
      {children}
    </PracticeAuthContext.Provider>
  );
};