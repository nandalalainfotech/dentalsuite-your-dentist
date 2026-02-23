import type { ReactNode } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Navigate } from 'react-router-dom';

interface PracticeProtectedRouteProps {
  children: ReactNode;
}

function PracticeProtectedRoute({ children }: PracticeProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.practice.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/practice/signin" replace />;
  }

  return <>{children}</>;
}

export default PracticeProtectedRoute;
