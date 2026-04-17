// src/pages/UserSettings.tsx
import { useState } from 'react';
import { useQuery } from "@apollo/client/react";
import {
    ChevronDown,
    Settings,
    Loader2,
    ArrowLeft
} from "lucide-react";
import { GET_CLIENTS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import { PermissionManager } from "../graphql/components/PermissionManager";

interface Client {
    id: string;
    email: string;
    status: string;
    created_at: string;
    practice_name?: string;
    address?: string;
    city?: string;
    state?: string;
    postcode?: string;
}

interface ClientsResponse {
    accounts: Client[];
}

export default function UserSettings() {
    const [selectedClinic, setSelectedClinic] = useState<Client | null>(null);

    const { data, loading, error } = useQuery<ClientsResponse>(
        GET_CLIENTS,
        { client: localClient }
    );

    const approvedClients = data?.accounts?.filter(c => c.status === 'APPROVED') ?? [];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-wide">Syncing data...</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center bg-red-50 rounded-2xl border border-red-100">Unable to load accounts. Please check your connection.</div>;

    if (selectedClinic) {
        return (
            <div className="w-full max-w-7xl mx-auto">
                <button
                    onClick={() => setSelectedClinic(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#f47521] mb-6 font-medium transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Clinics
                </button>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-[#1a2b3c] tracking-tight">
                        {selectedClinic.practice_name}
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium">
                        {selectedClinic.address}, {selectedClinic.city}{selectedClinic.state ? `, ${selectedClinic.state}` : ''} {selectedClinic.postcode}
                    </p>
                </div>

                <PermissionManager practiceId={selectedClinic.id} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">User Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Select a clinic to manage permissions</p>
            </div>

            {approvedClients.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 font-medium">No approved clinics found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 text-[11px] font-bold border bg-gray-300 text-gray-800 uppercase tracking-[0.1em]">
                        <div className="col-span-4">Practice Name</div>
                        <div className="col-span-4">Location</div>
                        <div className="col-span-4 text-right">Actions</div>
                    </div>

                    {approvedClients.map((client) => (
                        <div
                            key={client.id}
                            className="group transition-all duration-300 bg-white border border-gray-100 hover:border-gray-300 shadow-sm rounded-[18px]"
                        >
                            <div 
                                className="grid grid-cols-12 gap-4 px-8 py-6 items-center cursor-pointer"
                                onClick={() => setSelectedClinic(client)}
                            >
                                <div className="col-span-4 font-bold text-[#1a2b3c] text-[15px]">
                                    {client.practice_name || "Untitled Practice"}
                                </div>

                                <div className="col-span-4 text-gray-400 text-sm truncate">
                                    {client.address || "Address missing"}
                                </div>

                                <div className="col-span-4 flex items-center justify-end gap-2">
                                    <div className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#f47521] group-hover:text-white transition-all">
                                        <Settings size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-gray-300 group-hover:text-[#f47521]">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}