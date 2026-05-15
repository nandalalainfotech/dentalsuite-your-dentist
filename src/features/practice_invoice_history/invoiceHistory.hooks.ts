import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
    addDisputeNotes,
    clearFilters,
    clearMessages,
    fetchDisputes,
    resolveDispute,
    setDateRangeFilter,
    setStatusFilter,
    updateDisputeStatus
} from './invoiceHistory.slice';
import type {
    DisputedAppointment,
    DisputeStatus,
    EnrichedDisputedAppointment,
    FetchDisputesParams,
    ResolveDisputePayload,
    UpdateDisputeStatusPayload
} from './invoiceHistory.type';


export const formatShortDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatTime = (dateString?: string, timeString?: string): string => {
    if (timeString) return timeString;
    if (dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    return 'N/A';
};

export const formatRelativeUpdatedAt = (updatedAt: string): string => {
    const updated = new Date(updatedAt);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
};

export const getDisputeStatusColor = (status: DisputeStatus): string => {
    const colors = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        approve: 'bg-green-50 text-green-700 border-green-200',
        rejected: 'bg-red-50 text-red-700 border-red-200',
        dispute: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || colors.pending;
};

// Helper function to enrich dispute data
const enrichDispute = (dispute: DisputedAppointment): EnrichedDisputedAppointment => {
    const calculateDaysOld = (dateString: string): number => {
        const created = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return {
        ...dispute,
        practitioner_name: dispute.practitioner
            ? `${dispute.practitioner.first_name || ''} ${dispute.practitioner.last_name || ''}`.trim()
            : 'Unassigned',
        practitioner_role: dispute.practitioner?.role || 'Practitioner',
        practitioner_image: dispute.practitioner?.image || null,
        dispute_age_days: calculateDaysOld(dispute.created_at),
        formatted_created_date: formatShortDate(dispute.created_at),
        formatted_updated_date: formatShortDate(dispute.updated_at)
    };
};

// ============================================
// HOOK
// ============================================

export const useInvoiceHistory = (practiceId?: string, autoFetch: boolean = true) => {
    const dispatch = useAppDispatch();

    // Select state
    const {
        disputes,
        isLoading,
        isUpdating,
        error,
        successMessage,
        totalCount,
        filters
    } = useAppSelector((state: any) => state.invoiceHistory);

    // Enriched disputes
    const enrichedDisputes = useMemo(() =>
        disputes.map(enrichDispute),
        [disputes]
    );

    // Filtered disputes
    const filteredDisputes = useMemo(() => {
        let filtered = enrichedDisputes;

        if (filters.status !== 'all') {
            filtered = filtered.filter((d: EnrichedDisputedAppointment) =>
                d.dispute_status === filters.status
            );
        }

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter((d: { appointment_date: string | number | Date; }) => new Date(d.appointment_date) >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            filtered = filtered.filter((d: { appointment_date: string | number | Date; }) => new Date(d.appointment_date) <= toDate);
        }

        return filtered;
    }, [enrichedDisputes, filters]);

    // Fetch disputes
    // Auto-fetch on mount
    const refresh = useCallback((params?: Partial<FetchDisputesParams>) => {
        if (!practiceId) return;

        dispatch(fetchDisputes({
            practiceId,
            // Remove status here so we fetch everything and can calculate all counts
            fromDate: filters.dateFrom,
            toDate: filters.dateTo,
            ...params
        }));
    }, [dispatch, practiceId, filters.dateFrom, filters.dateTo]);

    useEffect(() => {
        if (autoFetch && practiceId) {
            refresh();
        }
    }, [autoFetch, practiceId, refresh]);

    // Actions
    const updateStatus = useCallback((payload: UpdateDisputeStatusPayload) => {
        return dispatch(updateDisputeStatus(payload)).unwrap();
    }, [dispatch]);

    const resolve = useCallback((payload: ResolveDisputePayload) => {
        return dispatch(resolveDispute(payload)).unwrap();
    }, [dispatch]);

    const addNotes = useCallback((id: string, notes: string) => {
        return dispatch(addDisputeNotes({ id, notes })).unwrap();
    }, [dispatch]);

    const clearAlerts = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    const changeStatusFilter = useCallback((status: DisputeStatus | 'all') => {
        dispatch(setStatusFilter(status));
    }, [dispatch]);

    const changeDateRangeFilter = useCallback((from?: string, to?: string) => {
        dispatch(setDateRangeFilter({ from, to }));
    }, [dispatch]);

    const resetFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    const stats = useMemo(() => ({
        total: enrichedDisputes.length,
        pending: enrichedDisputes.filter((d: { dispute_status: string; }) => d.dispute_status === 'pending').length,
        approved: enrichedDisputes.filter((d: { dispute_status: string; }) => d.dispute_status === 'approve').length,
        rejected: enrichedDisputes.filter((d: { dispute_status: string; }) => d.dispute_status === 'rejected').length
    }), [enrichedDisputes]);

    return {
        disputes: filteredDisputes,
        rawDisputes: disputes,
        totalCount,
        stats,
        loading: isLoading,
        actionLoading: isUpdating,
        error,
        successMessage,
        filters,
        refresh,
        updateStatus,
        resolve,
        addNotes,
        clearAlerts,
        changeStatusFilter,
        changeDateRangeFilter,
        resetFilters
    };
};