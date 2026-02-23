/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { Practice } from '../types/auth';

interface PracticeUserContextType {
  user: Practice | null;
  setUser: (user: Practice | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const PracticeUserContext = createContext<PracticeUserContextType | undefined>(undefined);

const STORAGE_KEY = 'practiceUser';

export function PracticeUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Practice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = (newUser: Practice | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <PracticeUserContext.Provider value={{ user, setUser: handleSetUser, logout, isLoading }}>
      {children}
    </PracticeUserContext.Provider>
  );
}

export function usePracticeUser() {
  const context = useContext(PracticeUserContext);
  if (!context) {
    throw new Error('usePracticeUser must be used within PracticeUserProvider');
  }
  return context;
}
