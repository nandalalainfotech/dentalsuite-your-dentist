import axios from "axios";
import { localClient } from "../../api/apollo/localClient";
import { GET_SIGNUP_OPTIONS_QUERY } from "../../pages/practice/auth/graphql/auth.query";
import type {
  User,
  SignupPayload,
  PracticeTypeOption,
  StateOption,
  LoginResponse,
} from "./auth.types";
import API_ENDPOINTS from "../../config/api";

const API_BASE_URL =
  API_ENDPOINTS.PRACTICE_AUTH;

// =========================
// TYPES
// =========================
interface LoginPayload {
  email: string;
  password: string;
  type?: string;
}

interface OptionsQueryResponse {
  common_practice_types: PracticeTypeOption[];
  common_states: StateOption[];
}

// =========================
// 1. LOGIN
// =========================
const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: payload.email,
      password: payload.password,
    });

    const responseData = response.data;

    const userData = responseData.user;
    const accessToken = responseData.accessToken;
    const refreshToken = responseData.refreshToken;

    if (!userData) {
      throw new Error("Invalid login response");
    }

    const normalizedUser: User = {
      id: userData.id,
      email: userData.email,
      practiceName: userData.practice_name || userData.practiceName,
      phone: userData.practice_phone || userData.practicePhone,
      practiceId: userData.practice_id || userData.id,
      type: userData.type,
    };

    return {
      message: responseData.message,
      user: normalizedUser,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Login failed. Please check your credentials.";

    throw new Error(message);
  }
};

// =========================
// 2. SIGNUP - UPDATE THIS
// =========================
const signup = async (payload: SignupPayload): Promise<{ message: string; user: User; success: boolean }> => {
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

      type: payload.type || "PRACTICE_ADMIN",
    };

    const response = await axios.post(
      `${API_BASE_URL}/register`,
      practiceData
    );


    // Normalize the user data
    const userData = response.data.user;
    const normalizedUser: User = {
      id: userData.id,
      email: userData.email,
      practiceName: userData.practice_name || payload.practiceName,
      phone: userData.practice_phone || payload.practicePhone,
      practiceId: userData.practice_id || userData.id,
      type: userData.type || "PRACTICE_ADMIN",
      status: userData.status || "PENDING",
    };

    return {
      message: response.data?.message || "Registration successful! Waiting for approval.",
      user: normalizedUser,
      success: true
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "An error occurred during registration. Please try again.";

    throw new Error(message);
  }
};

// =========================
// 3. GET SIGNUP OPTIONS
// =========================
const getSignupOptions = async () => {
  const { data } = await localClient.query<OptionsQueryResponse>({
    query: GET_SIGNUP_OPTIONS_QUERY,
    fetchPolicy: "cache-first",
  });

  return {
    practiceTypes: data?.common_practice_types || [],
    states: data?.common_states || [],
  };
};

// =========================
// EXPORT
// =========================
const authService = {
  login,
  signup,
  getSignupOptions,
};

export default authService;