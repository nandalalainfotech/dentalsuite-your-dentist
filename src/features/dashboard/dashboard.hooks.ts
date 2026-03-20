import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchProfile } from "./dashboard.slice";

export const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get Auth ID to fetch the correct profile
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    // If we have a user ID but no profile data, fetch it
    if (user?.id && !profile) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user, profile]);

  return {
    profile,
    loading: isLoading,
    error,
  };
};