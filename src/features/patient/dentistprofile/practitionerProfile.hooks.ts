import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPractitionerById, clearPractitioner } from './practitionerProfile.slice';
import type { AppDispatch, RootState } from '../../../store';


export const usePractitionerProfile = (practitionerId: string | undefined) => {
    const dispatch = useDispatch<AppDispatch>();

    const { practitioner, loading, error } = useSelector(
        (state: RootState) => state.practitionerProfile
    );

    useEffect(() => {
        if (practitionerId) {
            dispatch(fetchPractitionerById(practitionerId));
        }

        return () => {
            dispatch(clearPractitioner());
        };
    }, [practitionerId, dispatch]);

    return {
        practitioner,
        loading,
        error,
    };
};