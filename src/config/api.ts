const BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");


export const API_ENDPOINTS = {
    PATIENT_AUTH: `${BASE_URL}/patient/auth`,
    PRACTICE_AUTH: `${BASE_URL}/practice/auth`,
    IMPERSONATE_AUTH: `${BASE_URL}/practice/auth/impersonate`,
    PATIENT: `${BASE_URL}/patient`,
    PRACTICE: `${BASE_URL}/practice`,
    FILTER: `${BASE_URL}/clinics`,
};

export default API_ENDPOINTS;