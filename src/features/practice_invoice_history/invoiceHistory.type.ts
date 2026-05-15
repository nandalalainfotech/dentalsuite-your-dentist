export type DisputeStatus =
    | 'pending'
    | 'approve'
    | 'rejected'
    | 'dispute';

export interface DisputedAppointment {
    id: string;
    practice_id: string;
    practitioner_id?: string;
    patient_name: string;
    mobile: string;
    dob?: string;
    email?: string;
    treatment: string;
    appointment_date: string;
    appointment_time: string;
    status: DisputeStatus;
    is_rescheduled: boolean;
    isNewPatient: boolean;
    isDependent: boolean;
    patient_notes?: string;
    dispute_reason?: string;
    dispute_resolution_notes?: string;
    booked_by?: string;
    dispute_status?: string;
    created_at: string;
    updated_at: string;
    resolved_at?: string;
    practitioner?: {
        id: string;
        first_name: string;
        last_name: string;
        role?: string;
        image?: string | null;
    } | null;
}

export interface EnrichedDisputedAppointment extends Omit<DisputedAppointment, 'status' | 'practitioner'> {
    status: DisputeStatus;
    practitioner_name: string;
    practitioner_role: string;
    practitioner_image: string | null;
    dispute_age_days: number;
    formatted_created_date: string;
    formatted_updated_date: string;
}

export interface InvoiceHistoryState {
    disputes: DisputedAppointment[];
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    successMessage: string | null;
    totalCount: number;
    filters: {
        status: DisputeStatus | 'all';
        dateFrom?: string;
        dateTo?: string;
    };
}

export interface UpdateDisputeStatusPayload {
    id: string;
    status: DisputeStatus;
    resolution_notes?: string;
}

export interface ResolveDisputePayload {
    id: string;
    status: 'resolved';
    resolution_notes: string;
}

export interface FetchDisputesParams {
    practiceId: string;
    status?: DisputeStatus | 'all';
    limit?: number;
    offset?: number;
    fromDate?: string;
    toDate?: string;
}

// Update the interface
export interface NewPatientBooking {
    id: string;
    practice_id: string;
    practitioner_id?: string;
    patient_name: string;
    mobile: string;
    dob?: string;
    email?: string;
    treatment: string;
    appointment_date: string;
    appointment_time: string;
    status: 'completed' | 'cancelled' | 'dispute';
    is_rescheduled: boolean;
    is_new_patient: boolean;
    isDependent: boolean;
    patient_notes?: string;
    booked_by?: string;
    created_at: string;
    updated_at: string;
    resolved_at?: string;
    dispute_status?: string;
    dispute_resolution_notes?: string;
    practitioner?: {
        id: string;
        first_name: string;
        last_name: string;
        role?: string;
        image?: string | null;
    } | null;
}

// Update state
export interface InvoiceHistoryState {
    disputes: DisputedAppointment[];
    completedNewPatients: NewPatientBooking[];
    cancelledNewPatients: NewPatientBooking[];
    approvedDisputes: NewPatientBooking[];
    dispute: NewPatientBooking[];
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    successMessage: string | null;
    totalCount: number;
    filters: {
        status: DisputeStatus | 'all';
        dateFrom?: string;
        dateTo?: string;
    };
}