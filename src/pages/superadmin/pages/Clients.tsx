import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import {
    ChevronDown,
    Info,
    Check,
    X,
    Loader2
} from "lucide-react";
import { GET_CLIENTS, UPDATE_PRACTICE_STATUS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";

// ... Interfaces remain same as your provided code ...
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

    const { data, loading, error, refetch } = useQuery<ClientsResponse>(
        GET_CLIENTS,
        { client: localClient }
    );

    const [updateStatus] = useMutation(UPDATE_PRACTICE_STATUS, {
        client: localClient,
    });

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateStatus({ variables: { id, status } });
            setShowActionsId(null);
            await refetch();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-wide">Syncing data...</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center bg-red-50 rounded-2xl border border-red-100">Unable to load accounts. Please check your connection.</div>;

    const clients = data?.accounts ?? [];

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">Account Management</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage and verify practice registrations</p>
            </div>

            <div className="space-y-4">
                {/* Simplified Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-3 text-[11px] font-bold border bg-gray-300 text-gray-800 uppercase tracking-[0.1em]">
                    <div className="col-span-3">Practice Name</div>
                    <div className="col-span-3">Contact Email</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {clients.map((client) => {
                    const isExpanded = expandedId === client.id;
                    const isActionsOpen = showActionsId === client.id;
                    const isPending = client.status === 'PENDING';

                    return (
                        <div
                            key={client.id}
                            className={`group transition-all duration-300 bg-white border rounded-[18px] ${
                                isExpanded ? 'border-[#f47521] shadow-xl ring-1 ring-[#f47521]/5' : 'border-gray-100 hover:border-gray-300 shadow-sm'
                            }`}
                        >
                            {/* Main Row */}
                            <div 
                                className="grid grid-cols-12 gap-4 px-8 py-6 items-center cursor-pointer" 
                                onClick={() => setExpandedId(isExpanded ? null : client.id)}
                            >
                                <div className="col-span-3 font-bold text-[#1a2b3c] text-[15px]">
                                    {client.practice_name || "Untitled Practice"}
                                </div>

                                <div className="col-span-3 text-gray-500 text-sm font-medium truncate pr-4">
                                    {client.email}
                                </div>

                                <div className="col-span-3 text-gray-400 text-sm truncate">
                                    {client.address || "Address missing"}
                                </div>

                                <div className="col-span-2">
                                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        client.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
                                        client.status === 'PENDING' ? 'bg-orange-50 text-[#f47521]' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                        {client.status}
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-end gap-2">
                                    {isPending ? (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowActionsId(isActionsOpen ? null : client.id);
                                                }}
                                                className={`p-2 rounded-xl transition-all ${isActionsOpen ? 'bg-[#f47521] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#f47521]'}`}
                                            >
                                                <Info size={18} strokeWidth={2.5} />
                                            </button>

                                            {isActionsOpen && (
                                                <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 shadow-2xl rounded-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(client.id, "APPROVED"); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-green-600 hover:bg-green-50"
                                                    >
                                                        <Check size={16} strokeWidth={3} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusChange(client.id, "DECLINED"); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
                                                    >
                                                        <X size={16} strokeWidth={3} /> Decline
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-2 opacity-80">
                                            {client.status === 'APPROVED' ? <Check size={18} strokeWidth={3} className="text-green-600"/> : <X size={18} strokeWidth={3} className="text-red-600"/>}
                                        </div>
                                    )}
                                    <div className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#f47521]' : ''}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details - Clean Grid Design */}
                            {isExpanded && (
                                <div className="px-8 pb-10 pt-4 border-t border-gray-50">
                                    <div className="grid grid-cols-3 gap-12">
                                        
                                        {/* Contact Column */}
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

                                        {/* Address Column */}
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

                                        {/* Business Column */}
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
                })}
            </div>
        </div>
    );
}