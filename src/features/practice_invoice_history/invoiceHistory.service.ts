import { localClient } from "../../api/apollo/localClient";
import {
    ADD_DISPUTE_NOTES_MUTATION,
    GET_DISPUTED_APPOINTMENTS_QUERY,
    GET_NEW_PATIENT_BOOKINGS,
    RESOLVE_DISPUTE_MUTATION,
    UPDATE_DISPUTE_STATUS_MUTATION
} from "../../pages/practice/Invoice/graphql/invoiceHistory.query";
import type {
    DisputedAppointment,
    FetchDisputesParams,
    NewPatientBooking,
    ResolveDisputePayload,
    UpdateDisputeStatusPayload
} from "./invoiceHistory.type";

export const invoiceHistoryService = {
    /**
     * Fetch disputed appointments with filters
     */
    async fetchDisputes(params: FetchDisputesParams): Promise<{ disputes: DisputedAppointment[]; totalCount: number }> {
        const { practiceId, status, limit, offset, fromDate, toDate } = params;

        const variables: any = {
            practice_id: practiceId,
            limit: limit || 50,
            offset: offset || 0,
        };

        if (fromDate) variables.from_date = fromDate;
        if (toDate) variables.to_date = toDate;

        if (status && status !== 'all') {
            variables.status = status;
        }

        const response = await localClient.query({
            query: GET_DISPUTED_APPOINTMENTS_QUERY,
            variables,
            fetchPolicy: "network-only",
        });

        const data = response.data as any;
        return {
            disputes: data.online_bookings || [],
            totalCount: data.online_bookings_aggregate?.aggregate?.count || 0
        };
    },

    /**
     * Update dispute status
     * FIXED: Proper variable naming based on error messages
     */
    async updateDisputeStatus(payload: UpdateDisputeStatusPayload): Promise<DisputedAppointment> {
        const { id, status, resolution_notes } = payload;

        const variables = {
            id: id,
            dispute_status: status,
            status: status,
            resolution_notes: resolution_notes || null,
            resolved_at: status === 'approve' ? new Date().toISOString() : null
        };


        const response = await localClient.mutate({
            mutation: UPDATE_DISPUTE_STATUS_MUTATION,
            variables: variables,
        });

        const data = response.data as any;

        // Check which field name is returned
        if (data.update_online_bookings_by_pk) {
            return data.update_online_bookings_by_pk;
        } else if (data.update_online_bookings) {
            return data.update_online_bookings;
        } else {
            throw new Error('No data returned from mutation');
        }
    },

    /**
     * Resolve dispute (shortcut method)
     */
    async resolveDispute(payload: ResolveDisputePayload): Promise<DisputedAppointment> {
        const response = await localClient.mutate({
            mutation: RESOLVE_DISPUTE_MUTATION,
            variables: {
                id: payload.id,
                resolution_notes: payload.resolution_notes
            },
        });

        const data = response.data as any;
        return data.update_online_bookings_by_pk;
    },

    /**
     * Add notes to dispute
     */
    async addDisputeNotes(id: string, notes: string): Promise<DisputedAppointment> {
        const response = await localClient.mutate({
            mutation: ADD_DISPUTE_NOTES_MUTATION,
            variables: { id, notes },
        });

        const data = response.data as any;
        return data.update_online_bookings_by_pk;
    },

    // Updated service method
    async fetchNewPatientBookings(params: FetchDisputesParams): Promise<{
        completed: NewPatientBooking[];
        cancelled: NewPatientBooking[];
        approvedDisputes: NewPatientBooking[];
        dispute: NewPatientBooking[];
        totalCompleted: number;
        totalCancelled: number;
        totalApprovedDisputes: number;
        totalDisputes: number;
    }> {
        const { practiceId, limit, offset, fromDate, toDate } = params;


        const variables: any = {
            practice_id: practiceId,
            limit: limit || 500,
            offset: offset || 0,
        };

        if (fromDate) variables.from_date = fromDate;
        if (toDate) variables.to_date = toDate;

        try {
            const response = await localClient.query({
                query: GET_NEW_PATIENT_BOOKINGS,
                variables,
                fetchPolicy: "network-only",
            });

            const data = response.data as any

            return {
                completed: data.completed_bookings || [],
                cancelled: data.cancelled_bookings || [],
                dispute: data.dispute_bookings || [],
                approvedDisputes: data.approved_dispute_bookings || [],
                totalCompleted: data.completed_aggregate?.aggregate?.count || 0,
                totalCancelled: data.cancelled_aggregate?.aggregate?.count || 0,
                totalApprovedDisputes: data.approved_dispute_aggregate?.aggregate?.count || 0,
                totalDisputes: data.dispute_aggregate?.aggregate?.count || 0
            };
        } catch (error) {
            console.error("Error in fetchNewPatientBookings:", error);
            throw error;
        }
    }
};

export default invoiceHistoryService;