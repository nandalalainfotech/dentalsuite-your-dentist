import axios from "axios";
import API_ENDPOINTS from "../../../config/api";

export const getProfile = async () => {
    const token = localStorage.getItem("patient_access_token");
    if (!token) {
        throw new Error("No token found");
    }
    const response = await axios.get(
        `${API_ENDPOINTS.PATIENT}/profile`,
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        }
    );

    return response.data;
};

export const updateProfile = async (
    payload: any,
) => {
    const token = localStorage.getItem("patient_access_token");
    if (!token) {
        throw new Error("No token found");
    }

    const response = await axios.put(
        `${API_ENDPOINTS.PATIENT}/profile`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};