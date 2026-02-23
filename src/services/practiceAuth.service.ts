import axios from "axios";

export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

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
  };
}


const extractState = (address: string): "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT" => {
  const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
  for (const state of states) {
    if (address.includes(state)) return state as "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
  }
  return "NSW";
};

const extractPostcode = (address: string): string => {
  const match = address.match(/\b\d{4}\b/);
  return match ? match[0] : "2000";
};

const extractCity = (address: string): string => {
  const parts = address.split(",").map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/\b\d{4}\b/, "").replace(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/, "").trim() || parts[parts.length - 2];
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


export const practiceLoginService = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const user = {
      password: payload.password,
      emailOrPhone: payload.emailOrMobile,
    };

    const a = {
      input: {
        details: user,
      },
    };

    console.log("user------------>", user);

    const res = await axios.post(
      "https://qa-api.dentalinterface360.com/api/v1/auth/login-via-email-or-phone",
      a,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    const responseData = res.data;
    
    if (!responseData.accessToken) {
      return {
        success: false,
        message: responseData.message || "Login failed",
      };
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
    };
    
    return {
      success: true,
      message: "Login successful",
      user: practiceUser
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Login failed. Please try again.",
    };
  }
};