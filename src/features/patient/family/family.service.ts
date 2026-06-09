import axios from "axios";
import API_ENDPOINTS from "../../../config/api";

const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem(
        "patient_access_token"
    )}`,
});

export const getFamilyMembers = async () => {
    const response = await axios.get(
        `${API_ENDPOINTS.PATIENT}/family-members`,
        
        {
            headers: getHeaders(),
        }
    );

    return response.data;
};

export const addFamilyMember = async (
    payload: any
) => {
    const response = await axios.post(
        `${API_ENDPOINTS.PATIENT}/family-members`,
        payload,
        {
            headers: getHeaders(),
        }
    );

    return response.data;
};

export const updateFamilyMember = async (
    memberId: string,
    payload: any
) => {
    const response = await axios.put(
        `${API_ENDPOINTS.PATIENT}/family-members/${memberId}`,
        payload,
        {
            headers: getHeaders(),
        }
    );

    return response.data;
};

export const deleteFamilyMember = async (
    memberId: string
) => {
    const response = await axios.delete(
        `${API_ENDPOINTS.PATIENT}/family-members/${memberId}`,
        {
            headers: getHeaders(),
        }
    );

    return response.data;
};