import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store"; 
import { loginUser, logout, signupUser } from "./auth.slice"; // <-- IMPORTED signupUser
import type { SignupPayload } from "./auth.types"; // <-- IMPORTED Payload Type

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      // unwrap() returns a Promise that resolves to the payload 
      // or rejects with the error payload
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      // We re-throw so the UI component (PracticeSignInPage) can catch it if needed
      throw err;
    }
  };

  // --- NEW: handleSignup function ---
  const handleSignup = async (payload: SignupPayload) => {
    try {
      // .unwrap() gets the success message returned from auth.service.ts
      const responseMessage = await dispatch(signupUser(payload)).unwrap();
      return { success: true, message: responseMessage };
    } catch (err) {
      // Catch the error string and return it nicely for the UI
      return { success: false, message: err as string };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading: isLoading,
    error,
    handleLogin,
    handleSignup, // <-- EXPORTED the new function
    handleLogout,
  };
};