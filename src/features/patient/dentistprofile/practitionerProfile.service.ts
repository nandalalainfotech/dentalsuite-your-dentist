import axios from 'axios';
import type { PractitionerDetails } from './practitionerProfile.types';
import API_ENDPOINTS from '../../../config/api';

export const practitionerProfileApi = {
    getPractitionerById: async (id: string): Promise<PractitionerDetails> => {
        const response = await axios.get(
            `${API_ENDPOINTS.FILTER}/practitioner/${id}`
        );
        return response.data;
    },
};