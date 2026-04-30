import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchProfile } from "./dashboard.slice";

export const useDashboard = (practiceId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {

    // Determine correct profile id
    const profileId =
      practiceId ||
      user?.practiceId ||
      user?.id;

    if (profileId && profile?.id !== profileId) {
      dispatch(fetchProfile(profileId));
    }

  }, [dispatch, practiceId, user, profile]);

  return {
    profile,
    loading: isLoading,
    error,
  };
};