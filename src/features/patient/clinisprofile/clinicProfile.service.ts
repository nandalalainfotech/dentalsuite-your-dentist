import axios from 'axios';
import API_ENDPOINTS from '../../../config/api';
import type { ClinicProfileData } from './clinicProfile.types';

export const clinicProfileApi = {

    getClinicById: async (id: string): Promise<ClinicProfileData> => {
        const response = await axios.get(
            `${API_ENDPOINTS.FILTER}/clinic/${id}`
        );
        return response.data;
    },

};