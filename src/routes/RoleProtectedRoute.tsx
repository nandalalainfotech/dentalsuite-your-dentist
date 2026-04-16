import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.hooks";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/practice/signin" replace />;
  }

  // Role check
  if (!user || !allowedRoles.includes(user.type || "")) {
    return <Navigate to="/practice/signin" replace />;
  }

  // Allowed
  return <>{children}</>;
};

export default RoleProtectedRoute;