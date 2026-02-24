import { AuthActionTypes } from '../constants';
import type { AuthUser } from '../../types/auth';

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const authReducer = (state = initialState, action: { type: string; payload?: unknown }) => {
  switch (action.type) {
    case AuthActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload as AuthUser | null,
        isLoading: false,
        error: null,
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isLoading: false,
        error: null,
      };
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload as boolean,
      };
    case AuthActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload as string | null,
        isLoading: false,
      };
    default:
      return state;
  }
};
