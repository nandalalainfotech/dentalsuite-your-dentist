import axios from "axios";
import { localClient } from "../../api/apollo/localClient";
import { GET_SIGNUP_OPTIONS_QUERY } from "../../pages/practice/auth/graphql/auth.query";
import type { User, SignupPayload, PracticeTypeOption, StateOption } from "./auth.types";

const API_BASE_URL = "http://localhost:3000/auth";

// --- Interfaces ---
interface LoginPayload { 
  email: string; 
  password: string; 
}

interface OptionsQueryResponse { 
  common_practice_types: PracticeTypeOption[]; 
  common_states: StateOption[]; 
}

// --- 1. LOGIN (Connected to NestJS Backend) ---
const login = async (payload: LoginPayload): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: payload.email,
      password: payload.password,
    });

    const responseData = response.data;
    const userData = responseData.user || responseData; 
    const token = responseData.token || responseData.access_token || "mock-jwt-token";

    if (userData.status && userData.status.toLowerCase() !== "approved") {
      throw new Error("Your account is currently pending approval by the Superadmin.");
    }

    return {
      id: userData.id,
      email: userData.email,
      practiceName: userData.practice_name || userData.practiceName,
      phone: userData.practice_phone || userData.practicePhone,
      token: token,
    };
  } catch (error: any) {
    // Safely extract the exact error message thrown by NestJS
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message ||
      "Login failed. Please check your credentials.";
      
    throw new Error(message);
  }
};

// --- 2. SIGNUP (Connected to NestJS Backend) ---
const signup = async (payload: SignupPayload): Promise<string> => {
  try {
    const practiceData = {
      practice_name: payload.practiceName,
      abn_number: payload.abnNumber,
      email: payload.email,
      practice_type: payload.practiceType,
      practice_phone: payload.practicePhone,
      address: payload.practiceAddress,
      city: payload.practiceCity,
      state: payload.practiceState,
      postcode: payload.practicePostcode,
      first_name: payload.firstName,
      last_name: payload.lastName,
      mobile: payload.mobileNumber,
      password: payload.password, 
      status: "PENDING", 
      logo: payload.practiceLogo || "",
    };

    const response = await axios.post(`${API_BASE_URL}/register`, practiceData);

    return response.data?.message || "Registration successful! Waiting for approval.";
  } catch (error: any) {
    const message = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      "An error occurred during registration. Please try again.";

    throw new Error(message);
  }
};

// --- 3. GET OPTIONS (Still using local GraphQL for dropdowns) ---
const getSignupOptions = async () => {
  const { data } = await localClient.query<OptionsQueryResponse>({
    query: GET_SIGNUP_OPTIONS_QUERY,
    fetchPolicy: "cache-first", 
  });
  return {
    practiceTypes: data?.common_practice_types || [],
    states: data?.common_states || []
  };
};

const authService = { login, signup, getSignupOptions };
export default authService;