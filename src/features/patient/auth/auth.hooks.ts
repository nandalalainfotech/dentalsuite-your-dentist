import { useState } from "react";
import authService from "./auth.service";

export const useAuth = () => {
    const [isLoading, setLoading] = useState(false);

    const signup = async (payload: any) => {
        try {
            setLoading(true);

            const response = await authService.signup(payload);

            return {
                success: true,
                data: response,
                message: "Account created successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Signup failed",
            };
        } finally {
            setLoading(false);
        }
    };

    const login = async (payload: any) => {
        try {
            setLoading(true);

            const response =
                await authService.login(payload);

            if (response.success) {
                localStorage.setItem(
                    "patient_access_token",
                    response.accessToken
                );

                localStorage.setItem(
                    "patient",
                    JSON.stringify(response.patient)
                );
            }

            return response;
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message ??
                    "Login failed",
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("patient_access_token");
        localStorage.removeItem("patient");
    };

    const getCurrentUser = () => {
        const user = localStorage.getItem("patient");

        return user ? JSON.parse(user) : null;
    };

    const getToken = () => {
        return localStorage.getItem("patient_access_token");
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem("patient_access_token");
    };

    return {
        signup,
        login,
        logout,
        getCurrentUser,
        getToken,
        isAuthenticated,
        isLoading,
    };
};