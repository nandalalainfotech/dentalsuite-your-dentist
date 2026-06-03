import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./auth.service";
import type {
    LoginPatientPayload,
    SignupPatientPayload,
} from "./auth.types";

export const signupPatient = createAsyncThunk(
    "auth/signup",
    async (payload: SignupPatientPayload, thunkAPI) => {
        try {
            return await authService.signup(payload);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Signup failed"
            );
        }
    }
);

export const loginPatient = createAsyncThunk(
    "auth/login",
    async (payload: LoginPatientPayload, thunkAPI) => {
        try {
            return await authService.login(payload);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

interface AuthState {
    user: any;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("patient_token"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "patientAuth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;

            localStorage.removeItem("patient_token");
            localStorage.removeItem("patient_user");
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(signupPatient.pending, (state) => {
                state.loading = true;
            })

            .addCase(signupPatient.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(signupPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(loginPatient.pending, (state) => {
                state.loading = true;
            })

            .addCase(loginPatient.fulfilled, (state, action: any) => {
                state.loading = false;

                state.token = action.payload.accessToken;
                state.user = action.payload.patient;

                localStorage.setItem(
                    "patient_token",
                    action.payload.accessToken
                );

                localStorage.setItem(
                    "patient_user",
                    JSON.stringify(action.payload.patient)
                );
            })

            .addCase(loginPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;