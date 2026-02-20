import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Practice } from '../types/auth';
import type { Clinic } from '../types';
import { clinics } from '../data/clinics';

// ----------------------------------------------------------------------
// 1. STATIC DATA & CONFIGURATION
// ----------------------------------------------------------------------

const AUTH_CONSTANTS = {
  // IMPORTANT: Changed storage key to avoid conflict with patient login
  STORAGE_KEY: 'practiceUser', 

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
  practiceLogo: string;
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

const STATE_CODES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;
const STATE_REGEX = new RegExp(`\\b(${STATE_CODES.join('|')})\\b`);
const POSTCODE_REGEX = /\b\d{4}\b/;

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.replace(/\D/g, '');

const getAddressParts = (address: string) => {
  const stateMatch = address.match(STATE_REGEX);
  const postcodeMatch = address.match(POSTCODE_REGEX);

  const state = (stateMatch?.[1] as Practice['practiceState'] | undefined) ?? 'NSW';
  const postcode = postcodeMatch?.[0] ?? '2000';

  let city = '';
  if (address.includes(',')) {
    const parts = address.split(',').map(p => p.trim()).filter(Boolean);
    const lastPart = parts[parts.length - 1] ?? '';
    const cityFromLast = lastPart
      .replace(STATE_REGEX, '')
      .replace(POSTCODE_REGEX, '')
      .trim();
    city = cityFromLast || parts[parts.length - 2] || '';
  } else if (stateMatch && stateMatch.index !== undefined) {
    const beforeState = address.slice(0, stateMatch.index).trim();
    const tokens = beforeState.split(/\s+/).filter(Boolean);
    city = tokens[tokens.length - 1] || '';
  }

  return {
    city,
    state,
    postcode
  };
};

// ----------------------------------------------------------------------
// 4. MAPPER & VALIDATION HELPERS (UPDATED)
// ----------------------------------------------------------------------

// Helper to map a Clinic object to a Practice user object, assigning the correct role.
const mapClinicToPractice = (clinic: Clinic, role: 'practice' | 'superadmin'): Practice => {
  const { city, state, postcode } = getAddressParts(clinic.address);
  const createdAtYear = clinic.establishedYear ?? new Date().getFullYear();

  return {
    id: clinic.id,
    role: role, // <--- DYNAMIC ROLE
    
    // Append (Admin) to name if it's an admin login, for clarity in dashboard
    practiceName: role === 'superadmin' ? `${clinic.name}` : clinic.name,
    
    abnNumber: '00000000000',
    
    // Use the email that corresponds to the role
    email: role === 'superadmin' && clinic.admin ? clinic.admin.email : (clinic.email ?? ''),
    
    // Don't expose password in state
    password: '', 
    
    firstName: role === 'superadmin' ? 'Super' : 'Practice',
    lastName: 'Admin',
    practiceLogo: clinic.logo ?? '',
    mobileNumber: clinic.phone ?? '',
    practiceType: 'general_dentistry',
    practicePhone: clinic.phone ?? '',
    practiceAddress: clinic.address,
    practiceCity: city || 'Sydney',
    practiceState: state,
    practicePostcode: postcode,
    createdAt: new Date(`${createdAtYear}-01-01T00:00:00Z`).toISOString()
  } as Practice;
};

// Updated validation logic that checks BOTH roles
const validateClinicCredentials = (emailOrMobile: string, password: string): Practice | null => {
  const normalizedInput = normalizeEmail(emailOrMobile);
  const normalizedPhone = normalizePhone(emailOrMobile);

  for (const clinic of clinics) {
    
    // --- CHECK 1: Standard Clinic Profile Login ---
    const isProfileEmail = clinic.email && normalizeEmail(clinic.email) === normalizedInput;
    // Simple phone check: matches if phone is provided and matches input
    const isProfilePhone = clinic.phone && normalizePhone(clinic.phone) === normalizedPhone && normalizedPhone.length > 0;

    if ((isProfileEmail || isProfilePhone) && clinic.password === password) {
      return mapClinicToPractice(clinic, 'practice');
    }

    // --- CHECK 2: Clinic Super Admin Login ---
    if (clinic.admin) {
      const isAdminEmail = normalizeEmail(clinic.admin.email) === normalizedInput;
      // You can add admin phone check here if you add a phone field to the admin object
      
      if (isAdminEmail && clinic.admin.password === password) {
        return mapClinicToPractice(clinic, 'superadmin');
      }
    }
  }

  return null;
};

// ----------------------------------------------------------------------
// 5. HOOK & PROVIDER
// ----------------------------------------------------------------------

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
        console.error("Auth Error:", error);
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: { emailOrMobile: string; password: string }): Promise<{ success: boolean; message: string }> => {
    try {
      // Use the updated validation function
      const practiceUser = validateClinicCredentials(credentials.emailOrMobile, credentials.password);

      if (practiceUser) {
        setState({
          practice: practiceUser,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY, JSON.stringify(practiceUser));
        return { success: true, message: AUTH_CONSTANTS.MESSAGES.LOGIN_SUCCESS };
      } else {
        return { success: false, message: AUTH_CONSTANTS.MESSAGES.LOGIN_INVALID };
      }
    } catch (error) {
      return { success: false, message: AUTH_CONSTANTS.MESSAGES.LOGIN_ERROR };
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const existingClinic = clinics.find(clinic =>
        clinic.email && normalizeEmail(clinic.email) === normalizeEmail(credentials.email)
      );

      if (existingClinic) {
        return { success: false, message: AUTH_CONSTANTS.MESSAGES.SIGNUP_EMAIL_EXISTS };
      }

      const newPractice: Practice = {
        id: `practice-${Date.now()}`,
        role: 'practice', // Default role for new signups
        practiceName: credentials.practiceName,
        abnNumber: credentials.abnNumber,
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        mobileNumber: credentials.mobileNumber,
        practiceLogo: credentials.practiceLogo,
        practiceType: credentials.practiceType,
        practicePhone: credentials.practicePhone,
        practiceAddress: credentials.practiceAddress,
        practiceCity: credentials.practiceCity,
        practiceState: credentials.practiceState,
        practicePostcode: credentials.practicePostcode,
        createdAt: new Date().toISOString()
      };

      setState({
        practice: newPractice,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY, JSON.stringify(newPractice));

      return { success: true, message: AUTH_CONSTANTS.MESSAGES.SIGNUP_SUCCESS };
    } catch (error) {
      console.log("Signup Error:", error);
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

      const updatedPractice = { ...prev.practice, ...practiceData };
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEY, JSON.stringify(updatedPractice));
      return { ...prev, practice: updatedPractice };
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