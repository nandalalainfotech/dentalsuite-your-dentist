import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchNewPatientBookings } from './invoiceHistory.slice';
import type { FetchDisputesParams } from './invoiceHistory.type';

export const useNewPatientBookings = (practiceId?: string, autoFetch: boolean = true) => {
    const dispatch = useAppDispatch();

    const { completedNewPatients, cancelledNewPatients, approvedDisputes, dispute, isLoading, error, totalCount } = useAppSelector(
        (state: any) => {
            return state.invoiceHistory;
        }
    );

    const refresh = useCallback((params?: Partial<FetchDisputesParams>) => {
        if (!practiceId) {
            console.warn('No practiceId provided to useNewPatientBookings');
            return;
        }

        dispatch(fetchNewPatientBookings({
            practiceId,
            limit: 500,
            offset: 0,
            ...params
        }));
    }, [dispatch, practiceId]);

    useEffect(() => {
        if (autoFetch && practiceId) {
            refresh();
        }
    }, [autoFetch, practiceId, refresh]);

    return {
        completedBookings: completedNewPatients || [],
        cancelledBookings: cancelledNewPatients || [],
        dispute: dispute || [],  // ← FIXED: use dispute, not cancelledNewPatients
        approvedDisputeBookings: approvedDisputes || [],
        disputeBookings: dispute || [],
        totalCount,
        loading: isLoading,
        error,
        refresh
    };
};