import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Navigate, useLocation } from 'react-router-dom';
import { setUser, setToken, setAuthenticated } from '../../store/slices/userSlice';

interface PracticeProtectedRouteProps {
  children: ReactNode;
}

export default function PracticeProtectedRoute({ children }: PracticeProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { user, token, isAuthenticated } = useAppSelector(
    (state) => state.user.auth
  );

  const [isHydrated, setIsHydrated] = useState(false);

  // 🔹 Hydrate Redux from  sessionStorage on refresh
  useEffect(() => {
    const storedUser =  sessionStorage.getItem('user');
    const storedToken =  sessionStorage.getItem('token');

    if ((!user || !token) && storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);

        dispatch(setUser(parsedUser));        // ✅ restore user
        dispatch(setToken(storedToken));      // ✅ restore token
        dispatch(setAuthenticated(true));     // ✅ restore auth flag

      } catch (err) {
      }
    }

    setIsHydrated(true);
  }, [dispatch]);

  //  Wait until hydration finishes
  if (!isHydrated) return null;

  //  Auth guard
  if (!isAuthenticated || !token || !user) {
    
    return <Navigate to="/practice/signin" replace state={{ from: location }} />;
  }

  // Role guard
  if (user.role !== 'practice') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}