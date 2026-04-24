import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import {
    ChevronDown,
    MoreVertical,
    Loader2,
    Search,
    Filter,
    Ban,
    Edit2,
    RotateCcw,
    Trash2,
    UserCheck
} from "lucide-react";
import { GET_CLIENTS, UPDATE_PRACTICE_STATUS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";

interface Client {
    id: string;
    email: string;
    status: string;
    created_at: string;
    practice_name?: string;
    abn_number?: string;
    practice_type?: string;
    practice_phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postcode?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
}

interface ClientsResponse {
    accounts: Client[];
}

export default function Clients() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showActionsId, setShowActionsId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState<'practice_name' | 'email' | 'address' | 'status'>('practice_name');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, loading, error, refetch } = useQuery<ClientsResponse>(GET_CLIENTS, { client: localClient });

    const [updateStatus] = useMutation(UPDATE_PRACTICE_STATUS, { client: localClient });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActionsId(null);
            }
        };
        if (showActionsId) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showActionsId]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setIsProcessing(id);
        try {
            await updateStatus({ variables: { id, status: newStatus } });
            setShowActionsId(null);
            await refetch();
        } catch (err) {
            console.error(`Error updating status to ${newStatus}:`, err);
        } finally {
            setIsProcessing(null);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-50 text-green-600 border-green-100';
            case 'VERIFIED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'DECLINED':
            case 'INACTIVE': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-wide">Syncing data...</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center">Unable to load accounts.</div>;

    const filteredClients = (data?.accounts ?? []).filter((client) => {
        const valueToSearch = client[searchCategory]?.toLowerCase() || "";
        return valueToSearch.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">Account Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and verify practice registrations</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex items-center gap-3 bg-gray-300 p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative flex items-center">
                        <Filter size={16} className="absolute left-4 text-gray-400" />
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value as any)}
                            className="pl-10 pr-8 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-[#1a2b3c] appearance-none focus:ring-2 focus:ring-[#f47521]/50 cursor-pointer outline-none"
                        >
                            <option value="practice_name">Practice Name</option>
                            <option value="email">Email Address</option>
                            <option value="address">Location</option>
                            <option value="status">Status</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>

                    <div className="relative flex items-center group">
                        <Search size={18} className="absolute left-4 text-gray-400 group-focus-within:text-[#f47521] transition-colors" />
                        <input
                            type="text"
                            placeholder={`Search by ${searchCategory.replace('_', ' ')}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-2.5 w-64 md:w-80 bg-white border-none rounded-xl text-sm font-medium text-[#1a2b3c] placeholder:text-gray-400 focus:ring-0 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[11px] font-bold text-gray-700 border bg-gray-100 rounded-t-xl uppercase tracking-wider">
                    <div className="col-span-3">Practice Name</div>
                    <div className="col-span-3">Contact Email</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {filteredClients.map((client) => {
                    const isExpanded = expandedId === client.id;
                    const isActionsOpen = showActionsId === client.id;
                    const status = client.status || 'PENDING';
                    const isProcessingThis = isProcessing === client.id;

                    return (
                        <div key={client.id} className={`group transition-all duration-300 bg-white border rounded-[18px] ${isExpanded ? 'border-[#f47521] shadow-lg' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : client.id)}>
                                <div className="col-span-3 font-bold text-[#1a2b3c] text-[15px]">{client.practice_name || "Untitled Practice"}</div>
                                <div className="col-span-3 text-gray-500 text-sm font-medium truncate pr-4">{client.email}</div>
                                <div className="col-span-3 text-gray-400 text-sm truncate">{client.address || "Address missing"}</div>

                                <div className="col-span-2">
                                    <div className={`inline-flex px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
                                        {status}
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-end gap-2">
                                    <div className="relative" ref={isActionsOpen ? dropdownRef : null}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowActionsId(isActionsOpen ? null : client.id);
                                            }}
                                            className={`p-2 rounded-xl transition-all ${isActionsOpen ? 'bg-[#f47521] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 hover:text-[#f47521]'}`}
                                            disabled={isProcessingThis}
                                        >
                                            {isProcessingThis ? <Loader2 size={20} className="animate-spin" /> : <MoreVertical size={20} strokeWidth={2.5} />}
                                        </button>

                                        {isActionsOpen && (
                                            <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 shadow-2xl rounded-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2">
                                                {/* Common Action: Edit */}
                                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
                                                    <Edit2 size={16} /> Edit Details
                                                </button>

                                                {/* PENDING State */}
                                                {status === 'PENDING' && (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'DECLINED'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                            <Ban size={16} /> Decline
                                                        </button>
                                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50">
                                                            <RotateCcw size={16} /> Resend Verification
                                                        </button>
                                                    </>
                                                )}

                                                {/* VERIFIED State */}
                                                {status === 'VERIFIED' && (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'ACTIVE'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-green-600 hover:bg-green-50">
                                                            <UserCheck size={16} /> Approve
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'DECLINED'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                            <Ban size={16} /> Decline
                                                        </button>
                                                    </>
                                                )}

                                                {/* ACTIVE State */}
                                                {status === 'ACTIVE' && (
                                                    <>
                                                        <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'INACTIVE'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50">
                                                            <Ban size={16} /> Mark Inactive
                                                        </button>
                                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                            <Trash2 size={16} /> Delete Account
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#f47521]' : ''}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-8 pb-10 pt-4 border-t border-gray-50 bg-[#fafafa]/30">
                                    <div className="grid grid-cols-3 gap-12">
                                        <div className="space-y-6">
                                            <h4 className="text-[11px] font-extrabold text-[#f47521] uppercase tracking-[0.15em]">Personal Details</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Owner Name</label>
                                                    <p className="text-[#1a2b3c] font-bold text-sm mt-0.5">{(client.first_name ?? "") + " " + (client.last_name ?? "") || "Not provided"}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Mobile</label>
                                                        <p className="text-gray-700 font-semibold text-sm mt-0.5">{client.mobile || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Practice Phone</label>
                                                        <p className="text-gray-700 font-semibold text-sm mt-0.5">{client.practice_phone || "—"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[11px] font-extrabold text-[#f47521] uppercase tracking-[0.15em]">Location</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Full Address</label>
                                                    <p className="text-[#1a2b3c] font-bold text-sm mt-0.5 leading-relaxed">{client.address || "—"}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">City / State</label>
                                                        <p className="text-gray-700 font-semibold text-sm mt-0.5">{client.city || "—"}{client.state ? `, ${client.state}` : ''}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Postcode</label>
                                                        <p className="text-gray-700 font-semibold text-sm mt-0.5">{client.postcode || "—"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-[11px] font-extrabold text-[#f47521] uppercase tracking-[0.15em]">Business Profile</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">ABN / ACN</label>
                                                    <p className="text-[#1a2b3c] font-bold text-sm mt-0.5">{client.abn_number || "—"}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Practice Category</label>
                                                    <p className="text-gray-700 font-semibold text-sm mt-0.5">{client.practice_type || "General Dentistry"}</p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Registration Date</label>
                                                    <p className="text-gray-400 text-xs mt-1 font-medium">{new Date(client.created_at).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
                }
            </div>
        </div>
    );
}