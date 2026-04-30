import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setUser } from "../../features/auth/auth.slice";
import type { RootState, AppDispatch } from "../../store/store";

interface PracticeProtectedRouteProps {
  children: ReactNode;
}

export default function PracticeProtectedRoute({
  children,
}: PracticeProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const isImpersonating = sessionStorage.getItem("isImpersonating") === "true";

    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    const impersonationUser = sessionStorage.getItem("impersonation_user");
    const impersonationToken = sessionStorage.getItem("impersonation_token");

    try {
      // SUPER ADMIN VIEW
      if (isImpersonating && impersonationUser && impersonationToken) {
        const parsedUser = JSON.parse(impersonationUser);

        dispatch(
          setUser({
            ...parsedUser,
            type: "SUPER_ADMIN_VIEW",
          })
        );
      }

      // NORMAL PRACTICE LOGIN
      else if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
      }
    } catch (err) {
      console.error("Failed to parse stored user", err);
    }

    setIsHydrated(true);
  }, [dispatch]);

  // wait for hydration
  if (!isHydrated) return null;

  // block if still unauthenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/practice/signin" replace state={{ from: location }} />;
  }

  // allow practice admin or super admin view
  if (user.type === "PRACTICE_ADMIN" || user.type === "SUPER_ADMIN_VIEW") {
    return <>{children}</>;
  }

  return <Navigate to="/practice/signin" replace />;
}