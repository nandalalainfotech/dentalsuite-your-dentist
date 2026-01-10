import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Practice } from '../types/auth';
import { validatePracticeCredentials, getPracticeByEmail, addPractice, updatePractice } from '../data/practiceApi';

interface PracticeAuthState {
  practice: Practice | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface PracticeAuthContextType extends PracticeAuthState {
  login: (credentials: { emailOrMobile: string; password: string }) => Promise<{ success: boolean; message: string }>;
  signup: (credentials: {
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
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (practiceData: Partial<Practice>) => void;
}

const PracticeAuthContext = createContext<PracticeAuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const usePracticeAuth = () => {
  const context = useContext(PracticeAuthContext);
  if (context === undefined) {
    throw new Error('usePracticeAuth must be used within a PracticeAuthProvider');
  }
  return context;
};

interface PracticeAuthProviderProps {
  children: ReactNode;
}

export const PracticeAuthProvider: React.FC<PracticeAuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<PracticeAuthState>({
    practice: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const savedPractice = localStorage.getItem('practice');
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
        localStorage.removeItem('practice');
        setState({
          practice: null,
          isAuthenticated: false,
          isLoading: false
        });
        console.error("The error is", error);
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: { emailOrMobile: string; password: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const practice = validatePracticeCredentials(credentials.emailOrMobile, credentials.password);

      if (practice) {
        setState({
          practice,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem('practice', JSON.stringify(practice));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid email/mobile or password' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signup = async (credentials: {
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
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const existingPractice = getPracticeByEmail(credentials.email);

      if (existingPractice) {
        return { success: false, message: 'Practice with this email already exists' };
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
      localStorage.setItem('practice', JSON.stringify(newPractice));

      return { success: true, message: 'Practice account created successfully' };
    } catch (error) {
      console.log("The error is", error);
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    setState({
      practice: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('practice');
  };

  const updateProfile = (practiceData: Partial<Practice>): void => {
    setState(prev => {
      if (!prev.practice) return prev;

      const updatedPractice = updatePractice(prev.practice.id, practiceData);
      if (updatedPractice) {
        localStorage.setItem('practice', JSON.stringify(updatedPractice));
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