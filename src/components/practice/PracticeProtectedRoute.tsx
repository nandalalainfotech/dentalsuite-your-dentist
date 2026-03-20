import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Use standard hooks or your typed hooks
import { Navigate, useLocation } from 'react-router-dom';
import { setUser } from '../../features/auth/auth.slice'; // Point to NEW slice
import type { RootState, AppDispatch } from '../../store/store'; // Point to NEW store

interface PracticeProtectedRouteProps {
  children: ReactNode;
}

export default function PracticeProtectedRoute({ children }: PracticeProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // Select from the NEW 'auth' slice
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isHydrated, setIsHydrated] = useState(false);

  // 🔹 Hydrate Redux from sessionStorage on refresh
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    // Only hydrate if we aren't already logged in
    if (!isAuthenticated && storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Restore the user to Redux
        dispatch(setUser(parsedUser)); 
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
    
    setIsHydrated(true);
  }, [dispatch, isAuthenticated]);

  // Wait until hydration finishes
  if (!isHydrated) return null;

  // Auth guard
  if (!isAuthenticated || !user) {
    return <Navigate to="/practice/signin" replace state={{ from: location }} />;
  }

  // NOTE: I removed the 'role' check because the new User type 
  // currently doesn't have a 'role' field. 
  // Since we query 'practice_signin' table, the user is implicitly a practice.
  
  return <>{children}</>;
}