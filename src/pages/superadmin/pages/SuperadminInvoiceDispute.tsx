import React from 'react'

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    ChevronDown,
    MoreVertical,
    Loader2,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    ArrowLeft,
    Building2,
    X
} from 'lucide-react';
import { GET_ALL_DISPUTED_APPOINTMENTS_QUERY } from '../graphql/invoiceDispute.query';
import { localClient } from '../../../api/apollo/localClient';
import DisputeActionModal from './DisputeActionModal';

interface Practitioner {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    image: string;
}

interface PracticeInfo {
    id: string;
    practice_name: string;
    email: string;
    logo: string;
}

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
    practitioner: Practitioner;
    practice_info: PracticeInfo;
}

interface DisputesResponse {
    online_bookings: Dispute[];
    online_bookings_aggregate: {
        aggregate: {
            count: number;
        };
    };
}

interface PracticeGroup {
    practice_id: string;
    practice_name: string;
    practice_email: string;
    practice_logo: string;
    disputes: Dispute[];
    pending_count: number;
    approved_count: number;
    rejected_count: number;
    total_count: number;
}

type TabType = 'pending' | 'approve' | 'rejected';

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'pending', label: 'Pending', icon: <Clock size={16} /> },
    { id: 'approve', label: 'Approved', icon: <CheckCircle size={16} /> },
    { id: 'rejected', label: 'Rejected', icon: <XCircle size={16} /> },
];

export default function SuperadminInvoiceDispute() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState<'patient_name' | 'practice_name' | 'dispute_status' | 'treatment'>('practice_name');
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showActionsId, setShowActionsId] = useState<string | null>(null);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
    const [selectedPracticeId, setSelectedPracticeId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'rejected' | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, loading, error, refetch } = useQuery<DisputesResponse>(GET_ALL_DISPUTED_APPOINTMENTS_QUERY, {
        client: localClient,
        variables: {
            limit: 100,
            offset: 0,
            status: 'dispute'
        },
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActionsId(null);
            }
        };
        if (showActionsId) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showActionsId]);

    // Group disputes by practice
    const groupedPractices: PracticeGroup[] = React.useMemo(() => {
        if (!data?.online_bookings) return [];

        const practiceMap = new Map<string, PracticeGroup>();

        data.online_bookings.forEach((dispute) => {
            const practiceId = dispute.practice_id;

            if (!practiceMap.has(practiceId)) {
                practiceMap.set(practiceId, {
                    practice_id: practiceId,
                    practice_name: dispute.practice_info?.practice_name || 'Unknown Practice',
                    practice_email: dispute.practice_info?.email || '',
                    practice_logo: dispute.practice_info?.logo || '',
                    disputes: [],
                    pending_count: 0,
                    approved_count: 0,
                    rejected_count: 0,
                    total_count: 0
                });
            }

            const practice = practiceMap.get(practiceId)!;
            practice.disputes.push(dispute);
            practice.total_count++;

            const status = dispute.dispute_status?.toLowerCase() || 'pending';
            if (status === 'pending') practice.pending_count++;
            else if (status === 'approve' || status === 'resolved') practice.approved_count++;
            else if (status === 'rejected') practice.rejected_count++;
        });

        return Array.from(practiceMap.values());
    }, [data]);

    const selectedPractice = React.useMemo(
        () => groupedPractices.find((practice) => practice.practice_id === selectedPracticeId) || null,
        [groupedPractices, selectedPracticeId]
    );

    const openActionModal = (dispute: Dispute, type: 'approve' | 'rejected') => {
        setSelectedDispute(dispute);
        setActionType(type);
        setShowActionModal(true);
        setShowActionsId(null);
    };

    // const handleModalSuccess = () => {
    //     // Trigger refresh after successful update
    //     setRefreshTrigger(prev => prev + 1);
    // };

    const handleModalSuccess = async () => {
        await refetch({
            limit: 100,
            offset: 0,
            status: 'dispute'
        });
    };

    const handleBackToPractices = () => {
        setSelectedPracticeId(null);
        setCurrentPage(1);
        setSearchTerm('');
    };

    // Filter practices by search
    const filteredPractices = groupedPractices.filter((practice) => {
        const searchValue = searchTerm.toLowerCase();
        return practice.practice_name.toLowerCase().includes(searchValue) ||
            practice.practice_email.toLowerCase().includes(searchValue);
    });

    // Filter disputes within selected practice
    const getFilteredDisputesForPractice = () => {
        if (!selectedPractice) return [];

        // Filter by active tab first
        const tabFiltered = selectedPractice.disputes.filter((dispute) => {
            const disputeStatus = dispute.dispute_status?.toLowerCase() || 'pending';
            if (activeTab === 'approve') {
                return disputeStatus === 'approve' || disputeStatus === 'resolved';
            }
            return disputeStatus === activeTab;
        });

        // Then filter by search
        return tabFiltered.filter((dispute) => {
            const searchValue = searchTerm.toLowerCase();
            switch (searchCategory) {
                case 'patient_name':
                    return (dispute.patient_name || '').toLowerCase().includes(searchValue);
                case 'dispute_status':
                    return (dispute.dispute_status || '').toLowerCase().includes(searchValue);
                case 'treatment':
                    return (dispute.treatment || '').toLowerCase().includes(searchValue);
                default:
                    return true;
            }
        });
    };

    const currentDisputes = selectedPractice ? getFilteredDisputesForPractice() : [];
    const totalDisputeItems = currentDisputes.length;
    const totalDisputePages = Math.ceil(totalDisputeItems / itemsPerPage);
    const indexOfLastDispute = currentPage * itemsPerPage;
    const indexOfFirstDispute = indexOfLastDispute - itemsPerPage;
    const paginatedDisputes = currentDisputes.slice(indexOfFirstDispute, indexOfLastDispute);

    const totalPracticeItems = filteredPractices.length;
    const totalPracticePages = Math.ceil(totalPracticeItems / itemsPerPage);
    const indexOfLastPractice = currentPage * itemsPerPage;
    const indexOfFirstPractice = indexOfLastPractice - itemsPerPage;
    const paginatedPractices = filteredPractices.slice(indexOfFirstPractice, indexOfLastPractice);

    // Get counts for tabs (only when practice is selected)
    const getTabCount = (tab: TabType) => {
        if (!selectedPractice) return 0;

        if (tab === 'approve') return selectedPractice.approved_count;
        if (tab === 'pending') return selectedPractice.pending_count;
        if (tab === 'rejected') return selectedPractice.rejected_count;
        return 0;
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
            case 'pending':
                return <Clock size={14} />;
            case 'rejected':
                return <XCircle size={14} />;
            default:
                return <AlertCircle size={14} />;
        }
    };

    const getDisplayStatus = (status: string) => {
        const lowerStatus = status?.toLowerCase();
        if (lowerStatus === 'approve' || lowerStatus === 'resolved') return 'Approved';
        if (lowerStatus === 'pending') return 'Pending';
        if (lowerStatus === 'rejected') return 'Rejected';
        return status || 'Pending';
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-AU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
                <p className="text-gray-400 font-medium tracking-wide">Loading disputes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-red-500 text-center">
                Unable to load dispute data.
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                {selectedPractice && (
                    <button
                        onClick={handleBackToPractices}
                        className="flex items-center gap-2 text-[#f47521] font-bold mb-4 hover:underline"
                    >
                        <ArrowLeft size={20} />
                        Back to Practices
                    </button>
                )}
                <h1 className="text-3xl font-black text-[#1a2b3c]">
                    {selectedPractice ? selectedPractice.practice_name : 'Invoice Disputes'}
                </h1>
                <p className="text-gray-500 mt-2 font-medium text-lg">
                    {selectedPractice
                        ? `Manage disputes for ${selectedPractice.practice_name}`
                        : 'Select a practice to view and manage invoice disputes'
                    }
                </p>
            </div>

            {/* Tabs - Only show when practice is selected */}
            {selectedPractice && (
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex gap-1">
                        {TABS.map((tab) => {
                            const count = getTabCount(tab.id);
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setCurrentPage(1);
                                        setSearchTerm('');
                                    }}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-lg transition-all
                                        ${isActive
                                            ? 'bg-white text-[#f47521] border-b-2 border-[#f47521]'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    <span className={`
                                        ml-1 px-2 py-0.5 text-xs rounded-full
                                        ${isActive
                                            ? 'bg-[#f47521]/10 text-[#f47521]'
                                            : 'bg-gray-100 text-gray-500'
                                        }
                                    `}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="w-full mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex items-center w-full bg-[#d1d5db] p-2 rounded-[24px] border border-gray-200">
                        {selectedPractice && (
                            <>
                                <div className="relative flex items-center min-w-[200px]">
                                    <Filter size={18} className="absolute left-4 text-gray-500" />
                                    <select
                                        value={searchCategory}
                                        onChange={(e) => {
                                            setSearchCategory(e.target.value as 'patient_name' | 'practice_name' | 'dispute_status' | 'treatment');
                                            setCurrentPage(1);
                                        }}
                                        className="w-full pl-12 pr-10 py-3.5 bg-white border-none rounded-2xl text-sm font-bold text-[#1a2b3c] appearance-none focus:ring-2 focus:ring-[#f47521]/70 cursor-pointer outline-none shadow-sm"
                                    >
                                        <option value="patient_name">Patient Name</option>
                                        <option value="dispute_status">Dispute Status</option>
                                        <option value="treatment">Treatment</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="h-10 w-[2px] bg-gray-400/30 mx-4"></div>
                            </>
                        )}

                        <div className="relative flex-1 flex items-center group">
                            <Search size={20} className="absolute left-5 text-gray-400 group-focus-within:text-[#f47521] transition-colors" />
                            <input
                                type="text"
                                placeholder={selectedPractice
                                    ? `Search by ${searchCategory.replace('_', ' ')}...`
                                    : 'Search practices by name or email...'
                                }
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-14 pr-6 py-3.5 bg-white border-none rounded-2xl text-[15px] font-medium text-[#1a2b3c] placeholder:text-gray-400 focus:ring-2 focus:ring-[#f47521]/70 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Practice List View */}
            {!selectedPractice && (
                <>
                    {/* Practice List Header */}
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[11px] font-bold text-gray-700 border bg-gray-100 rounded-t-xl uppercase tracking-wider">
                        <div className="col-span-4">Practice Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-1 text-center">Pending</div>
                        <div className="col-span-1 text-center">Approved</div>
                        <div className="col-span-1 text-center">Rejected</div>
                        <div className="col-span-2 text-center">Total Disputes</div>
                    </div>

                    {/* Practice Rows */}
                    {paginatedPractices.length > 0 ? (
                        paginatedPractices.map((practice) => (
                            <div
                                key={practice.practice_id}
                                onClick={() => {
                                    setSelectedPracticeId(practice.practice_id);
                                    setCurrentPage(1);
                                    setSearchTerm('');
                                    setActiveTab('pending');
                                }}
                                className="group transition-all duration-300 bg-white border rounded-[18px] border-gray-100 hover:border-[#f47521] hover:shadow-lg shadow-sm mt-3 cursor-pointer"
                            >
                                <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center">
                                    {/* Practice Name with Logo */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        {practice.practice_logo ? (
                                            <img
                                                src={practice.practice_logo}
                                                alt={practice.practice_name}
                                                className="w-12 h-12 rounded-xl object-cover shadow-md border-2 border-gray-100"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-12 h-12 bg-gradient-to-br from-[#f47521] via-[#f47521] to-[#ff9966] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md ${practice.practice_logo ? 'hidden' : ''}`}>
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1a2b3c] text-[15px] group-hover:text-[#f47521] transition-colors">
                                                {practice.practice_name}
                                            </p>
                                            <p className="text-gray-400 text-xs">ID: {practice.practice_id}</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-3">
                                        <p className="text-gray-600 text-sm font-medium truncate">
                                            {practice.practice_email || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Pending Count */}
                                    <div className="col-span-1 text-center">
                                        <span className="inline-flex items-center justify-center w-10 h-10 bg-orange-50 text-orange-600 rounded-lg font-bold text-sm">
                                            {practice.pending_count}
                                        </span>
                                    </div>

                                    {/* Approved Count */}
                                    <div className="col-span-1 text-center">
                                        <span className="inline-flex items-center justify-center w-10 h-10 bg-green-50 text-green-600 rounded-lg font-bold text-sm">
                                            {practice.approved_count}
                                        </span>
                                    </div>

                                    {/* Rejected Count */}
                                    <div className="col-span-1 text-center">
                                        <span className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-lg font-bold text-sm">
                                            {practice.rejected_count}
                                        </span>
                                    </div>

                                    {/* Total Disputes */}
                                    <div className="col-span-2 text-center">
                                        <span className="inline-flex items-center justify-center px-4 h-10 bg-gray-100 text-gray-700 rounded-lg font-black text-base group-hover:bg-[#f47521] group-hover:text-white transition-colors">
                                            {practice.total_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-[24px] mt-3">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <Building2 size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-[#1a2b3c] font-bold text-lg">No practices found</h3>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-[#f47521] font-bold text-sm hover:underline"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Practice Pagination */}
                    {totalPracticeItems > 0 && (
                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-400">
                                    Showing {indexOfFirstPractice + 1} to {Math.min(indexOfLastPractice, totalPracticeItems)} of {totalPracticeItems}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {[...Array(totalPracticePages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPracticePages || totalPracticePages === 0}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Dispute List View (when practice is selected) */}
            {selectedPractice && (
                <>
                    {/* Dispute Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[11px] font-bold text-gray-700 border bg-gray-100 rounded-t-xl uppercase tracking-wider">
                        <div className="col-span-3">Patient</div>
                        <div className="col-span-2">Appointment</div>
                        <div className="col-span-2">Treatment</div>
                        <div className="col-span-2">Practitioner</div>
                        <div className="col-span-2">Dispute Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Dispute Rows */}
                    {paginatedDisputes.length > 0 ? (
                        paginatedDisputes.map((dispute) => {
                            const isActionsOpen = showActionsId === dispute.id;
                            const isPending = dispute.dispute_status?.toLowerCase() === 'pending';

                            return (
                                <div key={dispute.id} className="group transition-all duration-300 bg-white border rounded-[18px] border-gray-100 hover:border-gray-200 shadow-sm mt-3">
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                        {/* Patient Details */}
                                        <div className="col-span-3">
                                            <p className="font-bold text-[#1a2b3c] text-[15px] truncate">
                                                {dispute.patient_name || 'N/A'}
                                            </p>
                                            <p className="text-gray-400 text-xs truncate">
                                                {dispute.email || ''}
                                            </p>
                                        </div>

                                        {/* Appointment Date/Time */}
                                        <div className="col-span-2">
                                            <p className="font-medium text-[#1a2b3c] text-sm">
                                                {formatDate(dispute.appointment_date)}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {dispute.appointment_time || ''}
                                            </p>
                                        </div>

                                        {/* Treatment */}
                                        <div className="col-span-2">
                                            <p className="text-gray-600 text-sm font-medium truncate">
                                                {dispute.treatment || 'N/A'}
                                            </p>
                                        </div>

                                        {/* Practitioner */}
                                        <div className="col-span-2">
                                            <p className="text-gray-600 text-sm font-medium truncate">
                                                {dispute.practitioner
                                                    ? `${dispute.practitioner.first_name} ${dispute.practitioner.last_name}`
                                                    : 'N/A'}
                                            </p>
                                        </div>

                                        {/* Dispute Status */}
                                        <div className="col-span-2">
                                            <div className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getDisputeStatusBadge(dispute.dispute_status)}`}>
                                                {getDisputeStatusIcon(dispute.dispute_status)}
                                                {getDisplayStatus(dispute.dispute_status)}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center justify-end gap-2">
                                            {isPending ? (
                                                <div className="relative" ref={isActionsOpen ? dropdownRef : null}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowActionsId(isActionsOpen ? null : dispute.id);
                                                        }}
                                                        className={`p-2 rounded-xl transition-all ${isActionsOpen ? 'bg-[#f47521] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 hover:text-[#f47521]'}`}
                                                    >
                                                        <MoreVertical size={20} strokeWidth={2.5} />
                                                    </button>

                                                    {isActionsOpen && (
                                                        <div className="absolute right-0 w-52 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 py-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowActionsId(null);
                                                                    setSelectedDispute(dispute);
                                                                    setShowDetailsModal(true);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openActionModal(dispute, 'approve');
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-green-600 hover:bg-green-50"
                                                            >
                                                                <CheckCircle size={16} /> Approve
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openActionModal(dispute, 'rejected');
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
                                                            >
                                                                <XCircle size={16} /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedDispute(dispute);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-[#f47521] transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={20} strokeWidth={2} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-[24px] mt-3">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <Search size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-[#1a2b3c] font-bold text-lg">No {activeTab === 'approve' ? 'approved' : activeTab} disputes found</h3>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-[#f47521] font-bold text-sm hover:underline"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Dispute Pagination */}
                    {totalDisputeItems > 0 && (
                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-400">
                                    Showing {indexOfFirstDispute + 1} to {Math.min(indexOfLastDispute, totalDisputeItems)} of {totalDisputeItems}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {[...Array(totalDisputePages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalDisputePages || totalDisputePages === 0}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedDispute && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                        {/* Sticky Header */}
                        <div className="p-8 border-b border-gray-100 sticky top-0 bg-white rounded-t-[24px] z-10">
                            <h2 className="text-2xl font-black text-[#1a2b3c] pr-8">Dispute Details</h2>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedDispute(null);
                                }}
                                className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 transition-all"
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
                                        <p className="text-[#1a2b3c] font-bold">{selectedDispute.practice_info?.practice_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Email</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.practice_info?.email || 'N/A'}</p>
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
                                        <p className="text-[#1a2b3c] font-bold">{selectedDispute.patient_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Mobile</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.mobile || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date of Birth</p>
                                        <p className="text-[#1a2b3c] font-medium">{formatDate(selectedDispute.dob)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">New Patient</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.is_new_patient ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Dependent</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.is_dependent ? 'Yes' : 'No'}</p>
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
                                        <p className="text-[#1a2b3c] font-bold">{formatDate(selectedDispute.appointment_date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Time</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.appointment_time || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Treatment</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.treatment || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practitioner</p>
                                        <p className="text-[#1a2b3c] font-medium">
                                            {selectedDispute.practitioner
                                                ? `${selectedDispute.practitioner.first_name} ${selectedDispute.practitioner.last_name}`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Booked By</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.booked_by || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Rescheduled</p>
                                        <p className="text-[#1a2b3c] font-medium">{selectedDispute.is_rescheduled ? 'Yes' : 'No'}</p>
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
                                            <div className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getDisputeStatusBadge(selectedDispute.dispute_status)}`}>
                                                {getDisputeStatusIcon(selectedDispute.dispute_status)}
                                                {getDisplayStatus(selectedDispute.dispute_status)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Filed On</p>
                                            <p className="text-[#1a2b3c] font-medium">{formatDate(selectedDispute.created_at)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Dispute Reason</p>
                                        <p className="text-[#1a2b3c] font-medium bg-white p-4 rounded-xl border border-gray-100">
                                            {selectedDispute.dispute_reason || 'No reason provided'}
                                        </p>
                                    </div>
                                    {selectedDispute.dispute_resolution_notes && (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Resolution Notes</p>
                                            <p className="text-[#1a2b3c] font-medium bg-white p-4 rounded-xl border border-gray-100">
                                                {selectedDispute.dispute_resolution_notes}
                                            </p>
                                        </div>
                                    )}
                                    {selectedDispute.resolved_at && (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Resolved At</p>
                                            <p className="text-[#1a2b3c] font-medium">{formatDate(selectedDispute.resolved_at)}</p>
                                        </div>
                                    )}
                                    {selectedDispute.patient_notes && (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Patient Notes</p>
                                            <p className="text-[#1a2b3c] font-medium bg-white p-4 rounded-xl border border-gray-100">
                                                {selectedDispute.patient_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 sticky bottom-0 bg-white rounded-b-[24px]">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedDispute(null);
                                }}
                                className="px-6 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                Close
                            </button>
                            {selectedDispute.dispute_status?.toLowerCase() === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            openActionModal(selectedDispute, 'approve');
                                        }}
                                        className="px-6 py-3 rounded-full font-bold text-green-600 bg-green-50 hover:bg-green-100 transition-all"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            openActionModal(selectedDispute, 'rejected');
                                        }}
                                        className="px-6 py-3 rounded-full font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal (Approve/Reject) */}
            {showActionModal && selectedDispute && actionType && (
                <DisputeActionModal
                    dispute={selectedDispute}
                    actionType={actionType}
                    onClose={() => {
                        setShowActionModal(false);
                        setSelectedDispute(null);
                        setActionType(null);
                    }}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
}
