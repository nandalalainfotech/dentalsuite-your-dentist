import axios from 'axios';
import type { PracticeInfo } from './practice.types';
import API_ENDPOINTS from '../../../config/api';

export const practiceApi = {
    getFilterOptions: async () => {
        const token = localStorage.getItem("patient_access_token");

        const [specialties, languages, genders, insurances, days] =
            await Promise.all([
                axios.get(`${API_ENDPOINTS.FILTER}/filters/specialties`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }),
                axios.get(`${API_ENDPOINTS.FILTER}/filters/languages`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }),
                axios.get(`${API_ENDPOINTS.FILTER}/filters/genders`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }),
                axios.get(`${API_ENDPOINTS.FILTER}/filters/insurances`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }),
                axios.get(`${API_ENDPOINTS.FILTER}/filters/days`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                }),
            ]);

        return {
            specialties: specialties.data,
            languages: languages.data,
            genders: genders.data,
            insurances: insurances.data,
            availableDays: days.data,
        };
    },

    // NEW: Combined filter with main search
    filterClinicsWithSearch: async (params: {
        // Main search
        serviceType?: 'service' | 'practice' | 'practitioner';
        serviceId?: string;
        serviceName?: string;
        locationCity?: string;
        locationState?: string;
        locationPostcode?: string;

        // Sidebar filters
        specialties?: string[];
        languages?: string[];
        genders?: string[];
        insurances?: string[];
        days?: string[];
    }): Promise<PracticeInfo[]> => {
        const token = localStorage.getItem("patient_access_token");
        const queryParams: Record<string, string> = {};

        // Main search params
        if (params.serviceType) queryParams.serviceType = params.serviceType;
        if (params.serviceId) queryParams.serviceId = params.serviceId;
        if (params.serviceName) queryParams.serviceName = params.serviceName;
        if (params.locationCity) queryParams.locationCity = params.locationCity;
        if (params.locationState) queryParams.locationState = params.locationState;
        if (params.locationPostcode) queryParams.locationPostcode = params.locationPostcode;

        console.log('API Request Params==========>', queryParams);

        // Sidebar filter params
        if (params.specialties && params.specialties.length > 0) {
            queryParams.specialties = params.specialties.join(',');
        }
        if (params.languages && params.languages.length > 0) {
            queryParams.languages = params.languages.join(',');
        }
        if (params.genders && params.genders.length > 0) {
            queryParams.genders = params.genders.join(',');
        }
        if (params.insurances && params.insurances.length > 0) {
            queryParams.insurances = params.insurances.join(',');
        }
        if (params.days && params.days.length > 0) {
            queryParams.days = params.days.join(',');
        }

        const response = await axios.get(
            `${API_ENDPOINTS.FILTER}/filter`,
            {
                params: queryParams,
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );
        return response.data;
    },

    searchServices: async (query: string) => {
        const token = localStorage.getItem("patient_access_token");

        if (!query || query.trim().length < 2) {
            return [];
        }
        const response = await axios.get(
            `${API_ENDPOINTS.FILTER}/search/services`,
            {
                params: { query },
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );
        return response.data;
    },

    searchLocations: async (query: string) => {
        const token = localStorage.getItem("patient_access_token");

        if (!query || query.trim().length < 2) {
            return [];
        }
        const response = await axios.get(
            `${API_ENDPOINTS.FILTER}/search/locations`,
            {
                params: { query },
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            }
        );
        return response.data;
    },
};