// Approve Dispute
// Reject Dispute

import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react';
import { UPDATE_DISPUTE_STATUS_MUTATION } from '../graphql/invoiceDispute.query';
import { localClient } from '../../../api/apollo/localClient';
import { useMutation } from '@apollo/client/react';

interface Dispute {
    id: string;
    practice_id: string;
    practitioner_id: string;
    patient_name: string;
    mobile: string;
    dob: string;
    email: string;
    treatment: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    is_rescheduled: boolean;
    is_new_patient: boolean;
    is_dependent: boolean;
    patient_notes: string;
    booked_by: string;
    created_at: string;
    updated_at: string;
    resolved_at: string;
    dispute_reason: string;
    dispute_resolution_notes: string;
    dispute_status: string;
    practitioner: {
        id: string;
        first_name: string;
        last_name: string;
        role: string;
        image: string;
    };
    practice_info: {
        id: string;
        practice_name: string;
        email: string;
        logo: string;
    };
}

interface DisputeActionModalProps {
    dispute: Dispute;
    actionType: 'approve' | 'rejected';
    onClose: () => void;
    onSuccess: () => Promise<void>;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-AU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const getDisputeStatusBadge = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
        case 'resolved':
        case 'approve':
            return 'bg-green-50 text-green-600 border-green-100';
        case 'pending':
            return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'rejected':
            return 'bg-red-50 text-red-600 border-red-100';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-100';
    }
};

const getDisputeStatusIcon = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
        case 'resolved':
        case 'approve':
            return <CheckCircle size={14} />;
        case 'rejected':
            return <XCircle size={14} />;
        default:
            return null;
    }
};

const getDisplayStatus = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === 'approve' || lowerStatus === 'resolved') return 'Approved';
    if (lowerStatus === 'pending') return 'Pending';
    if (lowerStatus === 'rejected') return 'Rejected';
    return status || 'Pending';
};
export default function DisputeActionModal({ dispute, actionType, onClose, onSuccess }: DisputeActionModalProps) {
    const [resolutionNote, setResolutionNote] = useState('');
    const [noteError, setNoteError] = useState('');
    const [updateDisputeStatus, { loading: isUpdating }] = useMutation(UPDATE_DISPUTE_STATUS_MUTATION, {
        client: localClient
    });

    const handleSubmit = async () => {
        if (!resolutionNote.trim()) {
            setNoteError('Note is required');
            return;
        }

        try {
            await updateDisputeStatus({
                variables: {
                    id: dispute.id,
                    dispute_status: actionType,
                    resolution_notes: resolutionNote.trim(),
                    resolved_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            });

            await onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating dispute status:', err);
            alert('Failed to update dispute status. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                {/* Sticky Header */}
                <div className="p-8 border-b border-gray-100 relative sticky top-0 bg-white rounded-t-[24px] z-10">
                    <h2 className="text-2xl font-black text-[#1a2b3c] pr-8">
                        {actionType === 'approve' ? 'Approve Dispute' : 'Reject Dispute'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Practice Details Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Practice Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Name</p>
                                <p className="text-[#1a2b3c] font-bold">{dispute.practice_info?.practice_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Email</p>
                                <p className="text-[#1a2b3c] font-medium">{dispute.practice_info?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Details Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Patient Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Patient Name</p>
                                <p className="text-[#1a2b3c] font-bold">{dispute.patient_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email</p>
                                <p className="text-[#1a2b3c] font-medium">{dispute.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Mobile</p>
                                <p className="text-[#1a2b3c] font-medium">{dispute.mobile || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date of Birth</p>
                                <p className="text-[#1a2b3c] font-medium">{formatDate(dispute.dob)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Appointment Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date</p>
                                <p className="text-[#1a2b3c] font-bold">{formatDate(dispute.appointment_date)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Time</p>
                                <p className="text-[#1a2b3c] font-medium">{dispute.appointment_time || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Treatment</p>
                                <p className="text-[#1a2b3c] font-medium">{dispute.treatment || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practitioner</p>
                                <p className="text-[#1a2b3c] font-medium">
                                    {dispute.practitioner
                                        ? `${dispute.practitioner.first_name} ${dispute.practitioner.last_name}`
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dispute Details Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Dispute Details
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Dispute Status</p>
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getDisputeStatusBadge(dispute.dispute_status)}`}>
                                        {getDisputeStatusIcon(dispute.dispute_status)}
                                        {getDisplayStatus(dispute.dispute_status)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Filed On</p>
                                    <p className="text-[#1a2b3c] font-medium">{formatDate(dispute.created_at)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Dispute Reason</p>
                                <p className="text-[#1a2b3c] font-medium bg-white p-4 rounded-xl border border-gray-100">
                                    {dispute.dispute_reason || 'No reason provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Resolution Note Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Resolution Note <span className="text-red-500">*</span>
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-2xl">
                            <textarea
                                value={resolutionNote}
                                onChange={(e) => {
                                    setResolutionNote(e.target.value);
                                    if (noteError) setNoteError('');
                                }}
                                placeholder="Enter resolution note..."
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-xl text-sm font-medium text-[#1a2b3c] placeholder:text-gray-400 outline-none shadow-sm resize-none ${noteError ? 'border-red-500 focus:ring-2 focus:ring-red-500/70' : 'border-gray-200 focus:ring-2 focus:ring-[#f47521]/70'}`}
                                disabled={isUpdating}
                            />
                            {noteError && (
                                <p className="text-red-500 text-xs font-bold mt-2">{noteError}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-8 border-t border-gray-100 flex justify-end gap-4 sticky bottom-0 bg-white rounded-b-[24px]">
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="px-6 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        className={`px-6 py-3 rounded-full font-bold text-white transition-all flex items-center gap-2 ${actionType === 'approve'
                            ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                            : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                            }`}
                    >
                        {isUpdating && <Loader2 size={16} className="animate-spin" />}
                        {isUpdating
                            ? 'Updating...'
                            : (actionType === 'approve' ? 'Approve' : 'Reject')
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}