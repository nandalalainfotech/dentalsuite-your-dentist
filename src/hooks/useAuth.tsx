import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthContextType, LoginCredentials, SignupCredentials, PracticeSignupCredentials, User, Practice } from '../types/auth';
import { validateCredentials, getUserByEmail, addUser, updateUser } from '../data/userApi';
import { validatePracticeCredentials, getPracticeByEmail, addPractice, updatePractice } from '../data/practiceApi';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    userRole: null
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          userRole: 'patient'
        });
      } catch (error) {
        localStorage.removeItem('user');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          userRole: null
        });
        console.error("The error is", error)
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const user = validateCredentials(credentials.emailOrMobile, credentials.password);

      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          userRole: 'patient'
        });
        localStorage.setItem('user', JSON.stringify({ ...user, userRole: 'patient' }));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid email/mobile or password' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const existingUser = getUserByEmail(credentials.email);

      if (existingUser) {
        return { success: false, message: 'Email already exists' };
      }

      const newUser = addUser({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        dateOfBirth: credentials.dateOfBirth,
        gender: credentials.gender,
        mobileNumber: credentials.mobileNumber
      });

      setState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        userRole: 'patient'
      });
      localStorage.setItem('user', JSON.stringify({ ...newUser, userRole: 'patient' }));

      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      console.log("The error is", error)
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      userRole: null
    });
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>): void => {
    setState(prev => {
      if (!prev.user || prev.userRole !== 'patient') return prev;

      const updatedUser = updateUser(prev.user.id, userData);
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify({ ...updatedUser, userRole: 'patient' }));
        return { ...prev, user: updatedUser };
      }
      return prev;
    });
  };

  const loginPractice = async (credentials: { emailOrMobile: string; password: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const practice = validatePracticeCredentials(credentials.emailOrMobile, credentials.password);

      if (practice) {
        setState({
          user: practice,
          isAuthenticated: true,
          isLoading: false,
          userRole: 'practice'
        });
        localStorage.setItem('user', JSON.stringify({ ...practice, userRole: 'practice' }));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid email/mobile or password' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signupPractice = async (credentials: PracticeSignupCredentials): Promise<{ success: boolean; message: string }> => {
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
        user: newPractice,
        isAuthenticated: true,
        isLoading: false,
        userRole: 'practice'
      });
      localStorage.setItem('user', JSON.stringify({ ...newPractice, userRole: 'practice' }));

      return { success: true, message: 'Practice account created successfully' };
    } catch (error) {
      console.log("The error is", error)
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const updatePracticeProfile = (practiceData: Partial<Practice>): void => {
    setState(prev => {
      if (!prev.user || prev.userRole !== 'practice') return prev;

      const updatedPractice = updatePractice(prev.user.id, practiceData);
      if (updatedPractice) {
        localStorage.setItem('user', JSON.stringify({ ...updatedPractice, userRole: 'practice' }));
        return { ...prev, user: updatedPractice };
      }
      return prev;
    });
  };

  const value: AuthContextType = {
    ...state,
    login,
    loginPractice,
    signup,
    signupPractice,
    logout,
    updateProfile,
    updatePracticeProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};