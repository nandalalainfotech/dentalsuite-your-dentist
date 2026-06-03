import axios from "axios";
import type { LoginPatientPayload, SignupPatientPayload } from "./auth.types";
import API_ENDPOINTS from "../../../config/api";

const API_URL =
  API_ENDPOINTS.PATIENT_AUTH;

const signup = async (
    payload: SignupPatientPayload,
) => {
    const response = await axios.post(
        `${API_URL}/signup`,
        payload,
    );

    return response.data;
};

const login = async (
    payload: LoginPatientPayload,
) => {
    const response = await axios.post(
        `${API_URL}/login`,
        payload,
    );

    return response.data;
};

export default {
    signup,
    login,
};