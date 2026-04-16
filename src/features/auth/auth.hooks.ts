import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";

import {
  loginUser,
  logout,
  signupUser,
} from "./auth.slice";

import type { SignupPayload, User } from "./auth.types";

// =========================
// CUSTOM HOOK
// =========================
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await dispatch(
        loginUser({ email, password })
      ).unwrap();

      // =========================
      // ROLE BASED NAVIGATION SUPPORT
      // =========================
      // You can use this in UI after login
      const typedUser = result as User;

      return {
        success: true,
        user: typedUser,
      };
    } catch (err) {
      throw err;
    }
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async (payload: SignupPayload) => {
    try {
      const responseMessage = await dispatch(
        signupUser(payload)
      ).unwrap();

      return {
        success: true,
        message: responseMessage,
      };
    } catch (err) {
      return {
        success: false,
        message: err as string,
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    dispatch(logout());

    // safety cleanup (optional but good)
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
  };

  // =========================
  // DERIVED VALUES (IMPORTANT)
  // =========================
  const userType = user?.type;
  const isApproved = user?.status === "APPROVED";

  // =========================
  // RETURN
  // =========================
  return {
    // state
    user,
    isAuthenticated,
    loading: isLoading,
    error,

    // actions
    handleLogin,
    handleSignup,
    handleLogout,

    // helpers 
    userType,
    isApproved,
  };
};