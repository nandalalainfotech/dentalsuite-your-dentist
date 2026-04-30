import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client/react";
import {
    ChevronDown,
    Loader2,
    ArrowLeft,
    Search,
    Filter,
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { GET_CLIENTS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import PermissionManager from '../components/PermissionManager';

// Interfaces
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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState<'practice_name' | 'email' | 'city'>('practice_name');
    
    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const { data, loading, error } = useQuery<ClientsResponse>(GET_CLIENTS, { client: localClient });

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, searchCategory]);

    const approvedClients = data?.accounts?.filter(c => c.status === 'ACTIVE') ?? [];

    // --- SEARCH LOGIC ---
    const filteredClinics = approvedClients.filter((client) => {
        const value = client[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
    });

    // --- PAGINATION CALCULATION ---
    const totalItems = filteredClinics.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClinics = filteredClinics.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Loading Clinics</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center">Connection Error</div>;

    // DETAIL VIEW
    if (selectedClinic) {
        return (
            <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
                <button
                    onClick={() => setSelectedClinic(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#f47521] mb-6 font-bold text-sm transition-all"
                >
                    <ArrowLeft size={18} /> Back to Overview
                </button>

                <div className="mb-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">{selectedClinic.practice_name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">ID: {selectedClinic.id.slice(0, 8)}</span>
                            <span className="text-gray-400 text-sm font-medium">{selectedClinic.email}</span>
                        </div>
                    </div>
                </div>
                <PermissionManager practiceId={selectedClinic.id} />
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="w-full max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">User Settings</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage module access levels for approved practice</p>
                </div>

                {/* Unified Search Bar */}
                <div className="flex items-center gap-3 bg-gray-200 p-2 rounded-2xl border border-gray-100">
                    <div className="relative flex items-center">
                        <Filter size={16} className="absolute left-4 text-gray-400" />
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value as any)}
                            className="pl-10 pr-8 py-2.5 bg-white border-none rounded-xl text-sm font-bold text-[#1a2b3c] appearance-none focus:ring-0 cursor-pointer outline-none shadow-sm"
                        >
                            <option value="practice_name">Practice Name</option>
                            <option value="email">Email</option>
                            <option value="city">City</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-300 mx-1"></div>
                    <div className="relative flex items-center group">
                        <Search size={18} className="absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search clinic...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-2.5 w-64 md:w-72 bg-white border-none rounded-xl text-sm font-medium text-[#1a2b3c] focus:ring-0 outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Header Grid */}
                <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[11px] font-bold text-gray-700 border bg-gray-100 rounded-t-xl uppercase tracking-wider">
                    <div className="col-span-5">Practice Details</div>
                    <div className="col-span-5">Location</div>
                    <div className="col-span-2 text-right pr-4">Configure</div>
                </div>

                {currentClinics.length > 0 ? (
                    currentClinics.map((client) => (
                        <div
                            key={client.id}
                            className="group transition-all duration-300 bg-white border border-gray-100 rounded-[20px] shadow-sm hover:border-[#f47521] hover:shadow-xl hover:shadow-orange-50 cursor-pointer overflow-hidden"
                            onClick={() => setSelectedClinic(client)}
                        >
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                <div className="col-span-5">
                                    <div className="font-bold text-[#1a2b3c] text-[16px] group-hover:text-[#f47521] transition-colors duration-300">
                                        {client.practice_name || "Untitled Practice"}
                                    </div>
                                    <div className="text-sm text-gray-400 font-medium mt-1 truncate pr-8">{client.email}</div>
                                </div>

                                <div className="col-span-5">
                                    <div className="text-sm font-bold text-gray-600">
                                        {client.city ? `${client.city}, ${client.state}` : "No Location Set"}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-1 truncate pr-8">
                                        {client.address || "No address provided"}
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center justify-end">
                                    <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#f47521] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-100 transition-all duration-300">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching clinics found</p>
                    </div>
                )}
            </div>

            {/* --- PAGINATION UI --- */}
            {filteredClinics.length > 0 && (
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
                        <select 
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-[#f47521]"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <span className="text-sm text-gray-400">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems}
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
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-[#f47521] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}