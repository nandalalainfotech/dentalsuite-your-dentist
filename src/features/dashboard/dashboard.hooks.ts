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
    const profileId = user?.practiceId || user?.id;
    if (profileId && !profile) {
      dispatch(fetchProfile(profileId));
    }
  }, [dispatch, user, profile]);

  return {
    profile,
    loading: isLoading,
    error,
  };
};