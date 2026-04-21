import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client/react";
import {
    ChevronDown,
    Loader2,
    ArrowLeft,
    Save,
    Check,
    X,
    Lock,
    Search,
    Filter,
    ArrowRight
} from "lucide-react";
import { GET_CLIENTS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import { usePermissions } from '../../../features/permissions/Permissions.hooks';

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

const ACTION_COLUMNS = ['view', 'create', 'edit', 'delete'];

// --- Permission Manager Component ---
const PermissionManager = ({ practiceId }: { practiceId: string }) => {
    const {
        masterModules,
        permissions,
        isLoading,
        isSaving,
        successMessage,
        loadData,
        loadPracticePermissions,
        savePermissions,
        toggleModulePermission,
        resetMessages
    } = usePermissions();

    useEffect(() => {
        loadData();
        if (practiceId) loadPracticePermissions(practiceId);
    }, [practiceId, loadData, loadPracticePermissions]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[22px] border border-gray-100 shadow-sm">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-wide">Loading module configuration...</p>
        </div>
    );

    return (
        <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-[#fafafa]/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-[#1a2b3c] text-xl">Module Permissions</h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">Configure feature access for this clinic</p>
                </div>
                <button
                    onClick={() => savePermissions(practiceId)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#f47521] text-white rounded-xl hover:bg-[#e06510] disabled:opacity-50 transition-all text-sm font-bold shadow-lg shadow-orange-100"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Updating...' : 'Save Configuration'}
                </button>
            </div>

            <div className="px-8">
                {successMessage && (
                    <div className="mt-6 px-5 py-3.5 bg-green-50 border border-green-100 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 text-green-700 font-bold text-sm">
                            <Check size={16} strokeWidth={3} /> {successMessage}
                        </div>
                        <button onClick={resetMessages} className="text-green-400 hover:text-green-600"><X size={20} /></button>
                    </div>
                )}
            </div>

            <div className="p-6">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-700 border bg-gray-300 uppercase tracking-[0.15em]">Module</th>
                            {ACTION_COLUMNS.map(action => (
                                <th key={action} className="px-4 py-4 text-center text-[11px] font-bold text-gray-700 border bg-gray-300 uppercase tracking-[0.15em] w-32">{action}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {masterModules.map((module: any) => {
                            const modulePermissions = permissions.find((p: any) => p.module === module.module_key);
                            return (
                                <tr key={module.module_key} className="group transition-all">
                                    <td className="px-6 py-5 bg-gray-50/50 rounded-l-[18px] border-y border-l border-gray-100 group-hover:bg-gray-50 transition-colors">
                                        <span className="font-bold text-[#1a2b3c] block text-sm uppercase tracking-tight">
                                            {module.module_name || module.module_key.replace('_', ' ')}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-1 block">Key: {module.module_key}</span>
                                    </td>
                                    {ACTION_COLUMNS.map((action) => {
                                        const isSupported = module.actions?.includes(action);
                                        const hasPermission = modulePermissions?.actions?.includes(action) || false;
                                        return (
                                            <td key={action} className="py-5 bg-gray-50/50 border-y border-gray-100 text-center group-hover:bg-gray-50 last:border-r last:rounded-r-[18px] transition-colors">
                                                <div className="flex justify-center">
                                                    <button
                                                        disabled={!isSupported}
                                                        onClick={() => toggleModulePermission(module.module_key, action)}
                                                        className={`w-8 h-8 rounded-[10px] border-2 flex items-center justify-center transition-all duration-300 ${
                                                            !isSupported ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-30' :
                                                            hasPermission ? 'bg-[#f47521] border-[#f47521] text-white shadow-md' : 'bg-white border-gray-200 hover:border-[#f47521]'
                                                        }`}
                                                    >
                                                        {isSupported ? (hasPermission && <Check size={18} strokeWidth={3} />) : <Lock size={14} className="text-gray-400" />}
                                                    </button>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Main Settings Component ---
export default function UserSettings() {
    const [selectedClinic, setSelectedClinic] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState<'practice_name' | 'email' | 'city'>('practice_name');

    const { data, loading, error } = useQuery<ClientsResponse>(GET_CLIENTS, { client: localClient });

    const approvedClients = data?.accounts?.filter(c => c.status === 'ACTIVE') ?? [];
    
    // Search Logic
    const filteredClinics = approvedClients.filter((client) => {
        const value = client[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Loading Clinics</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center">Connection Error</div>;

    if (selectedClinic) {
        return (
            <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
                <button
                    onClick={() => setSelectedClinic(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#f47521] mb-6 font-bold text-sm transition-all"
                >
                    <ArrowLeft size={18} /> Back to Overview
                </button>

                <div className="mb-10 pb-6 border-b border-gray-100 flex items-center justify-between">
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

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">User Settings</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage module access levels for your approved clinics</p>
                </div>

                {/* Unified Search Bar */}
                <div className="flex items-center gap-3 bg-gray-300 p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative flex items-center">
                        <Filter size={16} className="absolute left-4 text-gray-400" />
                        <select 
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value as any)}
                            className="pl-10 pr-8 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-[#1a2b3c] appearance-none focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="practice_name">Practice Name</option>
                            <option value="email">Email</option>
                            <option value="city">City</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
                    <div className="relative flex items-center group">
                        <Search size={18} className="absolute left-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Search clinic...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-2.5 w-64 md:w-72 bg-white border-none rounded-xl text-sm font-medium text-[#1a2b3c] focus:ring-0 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Header Grid */}
                <div className="grid grid-cols-12 gap-4 px-8 py-3 text-[11px] font-bold text-gray-700 border bg-gray-300 uppercase tracking-[0.1em]">
                    <div className="col-span-5">Practice Details</div>
                    <div className="col-span-5">Location</div>
                    <div className="col-span-2 text-right pr-4">Configure</div>
                </div>

                {filteredClinics.length > 0 ? (
                    filteredClinics.map((client) => (
                        <div
                            key={client.id}
                            className="group transition-all duration-300 bg-white border border-gray-100 rounded-[20px] shadow-sm hover:border-[#f47521] hover:shadow-xl hover:shadow-orange-50 cursor-pointer overflow-hidden"
                            onClick={() => setSelectedClinic(client)}
                        >
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                <div className="col-span-5">
                                    <div className="font-bold text-[#1a2b3c] text-lg group-hover:text-[#f47521] transition-colors duration-300">
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
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#f47521] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-100 transition-all duration-300">
                                        <ArrowRight size={22} />
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
        </div>
    );
}