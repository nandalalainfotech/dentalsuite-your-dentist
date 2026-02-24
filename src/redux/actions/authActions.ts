import type { AuthUser } from '../../types/auth';
import { AuthActionTypes } from '../constants';

export const setUser = (user: AuthUser | null) => ({
  type: AuthActionTypes.SET_USER,
  payload: user,
});

export const logout = () => ({
  type: AuthActionTypes.LOGOUT,
});

export const setAuthLoading = (loading: boolean) => ({
  type: AuthActionTypes.SET_LOADING,
  payload: loading,
});

export const setAuthError = (error: string | null) => ({
  type: AuthActionTypes.SET_ERROR,
  payload: error,
});
