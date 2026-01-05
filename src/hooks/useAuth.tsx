import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthContextType, LoginCredentials, SignupCredentials } from '../types/auth';
import { validateUserCredentials, findUserByEmail, addUser } from '../data/users';


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
    isLoading: true
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
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('user');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        console.error("The error is", error)
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const user = validateUserCredentials(credentials.emailOrMobile, credentials.password);

      if (user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem('user', JSON.stringify(user));
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
      const existingUser = findUserByEmail(credentials.email);

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
        isLoading: false
      });
      localStorage.setItem('user', JSON.stringify(newUser));

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
      isLoading: false
    });
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};