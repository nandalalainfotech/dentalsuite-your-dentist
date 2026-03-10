/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { interfaceClient } from "../api/apollo/dental_interface";
import { LOGIN_MUTATION } from "../queries/auth_query";

// --- Types ---
export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

export interface LoginApiData {
  login_api: {
    phone: string;
    id: string;
    email: string;
    business_name: string;
    name: string;
    address: string;
    type: "PRACTICE" | "SUPERADMIN";
    logo: string;
    accessToken: string;
  };
}

//  FIX: Updated Interface to match 'Practice' type strictness
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    role: "practice" | "superadmin";
    practiceName: string;
    abnNumber: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    practiceLogo: string;
    practiceType: 'general_dentistry' | 'specialist' | 'cosmetic' | 'orthodontic' | 'pediatric';
    practicePhone: string;
    practiceAddress: string;
    address: string;
    practiceCity: string;
    practiceState: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
    practicePostcode: string;
    createdAt: string;
    status?: string;
    profileCompleted?: boolean;
    paymentCompleted?: boolean;
    subscriptionPermissions?: unknown;
    token: string;
    refreshToken?: string;
    logo?: string;
    business_name: string;
    gender?: "male" | "female" | "other";
    dateOfBirth: string;
  };
}


// --- Helper Functions ---
const extractState = (address: string): any => {
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
  for (const state of states) {
    if (address && address.includes(state)) return state;
  }
  return "NSW";
};

const extractPostcode = (address: string): string => {
  const match = address ? address.match(/\b\d{4}\b/) : null;
  return match ? match[0] : "2000";
};

const extractCity = (address: string): string => {
  if (!address) return "";
  const parts = address.split(",").map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return parts[parts.length - 1].replace(/\b\d{4}\b/, "").replace(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/, "").trim() || parts[parts.length - 2];
  }
  return "";
};

const extractFirstName = (name: string): string => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts[0];
};

const extractLastName = (name: string): string => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
};

// --- Services ---

export const loginService = async (payload: LoginPayload): Promise<LoginApiData> => {
 const variables = {
    details: {
      emailOrPhone: payload.emailOrMobile,
      password: payload.password,
    },
  };

  const { data } = await interfaceClient.mutate<LoginApiData>({
    mutation: LOGIN_MUTATION,
    variables,
  });

  if (!data) throw new Error("Login failed: No data returned");
  return data;
};

export const practiceLoginService = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const user = { password: payload.password, emailOrPhone: payload.emailOrMobile };
    const res = await axios.post(
      "https://qa-api.dentalinterface360.com/api/v1/auth/login-via-email-or-phone",
      { input: { details: user } },
      { headers: { "Content-Type": "application/json", "Accept": "application/json" } }
    );

    const responseData = res.data;

    if (!responseData.accessToken) {
      return { success: false, message: responseData.message || "Login failed" };
    }

    const role: "practice" | "superadmin" = responseData.type === "SUPER_ADMIN" ? "superadmin" : "practice";

    const practiceUser = {
      id: responseData.id || "",
      role: role,
      practiceName: responseData.business_name || responseData.name || "",
      abnNumber: responseData.abn_number || "",
      email: responseData.email || "",
      password: "",
      firstName: extractFirstName(responseData.name || ""),
      lastName: extractLastName(responseData.name || ""),
      mobileNumber: responseData.phone || "",
      practiceLogo: responseData.logo || "",
      practiceType: 'general_dentistry' as const,
      practicePhone: responseData.phone || "",
      practiceAddress: responseData.address || "",
      address: responseData.address || "",

      practiceCity: extractCity(responseData.address || ""),
      practiceState: extractState(responseData.address || ""),
      practicePostcode: extractPostcode(responseData.address || ""),
      createdAt: new Date().toISOString(),
      status: responseData.status || "",
      profileCompleted: responseData.profile_completed || false,
      paymentCompleted: responseData.payment_completed || false,
      subscriptionPermissions: responseData.subscription_permissions || null,
      token: responseData.accessToken || "",
      refreshToken: responseData.refreshToken || "",
      business_name: responseData.business_name || "",
      logo: responseData.logo || "",
      gender: (responseData.gender as "male" | "female" | "other") || undefined,
      dateOfBirth: "",
    };

    return { success: true, message: "Login successful", user: practiceUser };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.response?.data?.error || "Login failed. Please try again.",
    };
  }
};

export const updatePracticeProfileService = async (formData: FormData): Promise<LoginResponse> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) throw new Error("No authentication token found");

    const res = await axios.put(
      "https://qa-api.dentalinterface360.com/api/v1/practices/profile",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const responseData = res.data;

    const practiceUser = {
      id: responseData.id || "",
      role: "practice" as const,
      company_name:responseData.company_name || "",
      practiceName: responseData.business_name || responseData.name || "",
      abnNumber: responseData.abn_number || "",
      email: responseData.email || "",
      password: "",
      firstName: extractFirstName(responseData.name || ""),
      lastName: extractLastName(responseData.name || ""),
      mobileNumber: responseData.phone || "",
      practiceLogo: responseData.logo || "",
      practiceType: 'general_dentistry' as const,
      practicePhone: responseData.phone || "",
      practiceAddress: responseData.address || "",
      address: responseData.address || "",
      practiceCity: extractCity(responseData.address || ""),
      practiceState: extractState(responseData.address || ""),
      practicePostcode: extractPostcode(responseData.address || ""),
      createdAt: new Date().toISOString(),
      status: responseData.status || "",
      profileCompleted: responseData.profile_completed || false,
      paymentCompleted: responseData.payment_completed || false,
      subscriptionPermissions: responseData.subscription_permissions || null,
      token: token,
      refreshToken: "",
      business_name: responseData.business_name || "",
      logo: responseData.logo || "",
      dateOfBirth: "",
    };

    return { success: true, message: "Profile updated successfully", user: practiceUser };

  } catch (error: any) {
    console.error("Update Error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update profile",
    };
  }
};

