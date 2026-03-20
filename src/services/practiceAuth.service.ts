/* eslint-disable @typescript-eslint/no-explicit-any */
import { localClient } from "../api/apollo/localClient";
import bcrypt from "bcryptjs";
import { SIGNIN_QUERY } from "../pages/practice/auth/graphql/auth.query";
// --- Types ---
export interface LoginPayload {
  email: string;
  password: string;
}
interface LoginQueryResponse {
  users: {
    id: string;
    email: string;
    password: string;
    practice_name: string;
    phone: string;
    created_at:string;
  }[];
}

// --- LOGIN SERVICE (LOCAL DB) ---
export const loginService = async (
  payload: LoginPayload
) => {
  try {
    const { data } = await localClient.query<LoginQueryResponse>({
      query: SIGNIN_QUERY,
      variables: { email: payload.email },
    });

    const user = data?.users?.[0];

    if (!user) {
      return { success: false, message: "User not found" };
    }

    //  Compare password
    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }

    //  Clean user object (ONLY required fields)
    const mappedUser = {
      id: user.id,
      email: user.email,
      practiceName: user.practice_name,
      phone: user.phone,
      token: "local-auth", 
      created_at: user.created_at,
    };

    return {
      success: true,
      message: "Login successful",
      user: mappedUser,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Login failed",
    };
  }
};