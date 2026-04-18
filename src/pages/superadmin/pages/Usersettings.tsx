import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client/react";
import {
    ChevronDown,
    Settings,
    Loader2,
    ArrowLeft,
    Save,
    Check,
    X,
    Lock
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

// Fixed Action list for the table headers
const ACTION_COLUMNS = ['view', 'create', 'edit', 'delete'];

// Permission Manager Component
const PermissionManager = ({ practiceId }: { practiceId: string }) => {
    const {
        masterModules,
        permissions,
        isLoading,
        isSaving,
        error,
        successMessage,
        loadData,
        loadPracticePermissions,
        savePermissions,
        toggleModulePermission,
        resetMessages
    } = usePermissions();

    useEffect(() => {
        loadData();
        if (practiceId) {
            loadPracticePermissions(practiceId);
        }
    }, [practiceId, loadData, loadPracticePermissions]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
                <p className="text-gray-400 font-medium tracking-wide">Fetching configuration...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
            {/* Action Bar */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Module Permissions</h3>
                    <p className="text-xs text-gray-500 font-medium">Define what this clinic can access and modify</p>
                </div>
                <button
                    onClick={() => savePermissions(practiceId)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#f47521] text-white rounded-xl hover:bg-[#e06510] disabled:opacity-50 transition-all text-sm font-bold shadow-md shadow-orange-100"
                >
                    {isSaving ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Save size={18} />
                    )}
                    {isSaving ? 'Saving Changes...' : 'Save Permissions'}
                </button>
            </div>

            {/* Notifications */}
            <div className="px-6">
                {successMessage && (
                    <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 text-green-700">
                            <div className="bg-green-100 p-1 rounded-full"><Check size={14} /></div>
                            <span className="text-sm font-semibold">{successMessage}</span>
                        </div>
                        <button onClick={resetMessages} className="text-green-500 hover:text-green-700">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3 text-red-700">
                            <X size={18} className="bg-red-100 p-0.5 rounded-full" />
                            <span className="text-sm font-semibold">{error}</span>
                        </div>
                        <button onClick={resetMessages} className="text-red-500 hover:text-red-700">
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Permissions Table */}
            <div className="overflow-x-auto p-4">
                <table className="w-full border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                Module Name
                            </th>
                            {ACTION_COLUMNS.map(action => (
                                <th key={action} className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-widest w-28">
                                    {action}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {masterModules.map((module: any) => {
                            const modulePermissions = permissions.find(
                                (p: any) => p.module === module.module_key
                            );

                            return (
                                <tr key={module.module_key} className="group transition-all">
                                    <td className="px-6 py-4 bg-gray-50/50 rounded-l-2xl border-y border-l border-gray-100 group-hover:bg-gray-50">
                                        <span className="font-bold text-gray-700 block uppercase text-sm tracking-tight">
                                            {module.module_name || module.module_key.replace('_', ' ')}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono italic">
                                            {module.module_key}
                                        </span>
                                    </td>

                                    {ACTION_COLUMNS.map((action) => {
                                        // Check if this action is supported by the module (from DB)
                                        const isSupported = module.actions?.includes(action);
                                        // Check if the permission is currently active
                                        const hasPermission = modulePermissions?.actions?.includes(action) || false;

                                        return (
                                            <td key={action} className={`py-4 bg-gray-50/50 border-y border-gray-100 text-center group-hover:bg-gray-50 last:border-r last:rounded-r-2xl`}>
                                                <div className="flex flex-col items-center justify-center">
                                                    <button
                                                        disabled={!isSupported}
                                                        onClick={() => toggleModulePermission(module.module_key, action)}
                                                        className={`
                                                            w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                                            ${!isSupported
                                                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                                                : hasPermission
                                                                    ? 'bg-[#f47521] border-[#f47521] shadow-lg shadow-orange-100'
                                                                    : 'bg-white border-gray-300 hover:border-[#f47521] hover:scale-110'
                                                            }
                                                        `}
                                                    >
                                                        {isSupported ? (
                                                            hasPermission && <Check size={16} className="text-white stroke-[3px]" />
                                                        ) : (
                                                            <Lock size={12} className="text-gray-300" />
                                                        )}
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

            {masterModules.length === 0 && !isLoading && (
                <div className="text-center py-16">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-400 font-medium italic">No modules found in database</p>
                </div>
            )}
        </div>
    );
};

// Main Component
export default function UserSettings() {
    const [selectedClinic, setSelectedClinic] = useState<Client | null>(null);

    const { data, loading, error } = useQuery<ClientsResponse>(
        GET_CLIENTS,
        { client: localClient }
    );

    const approvedClients = data?.accounts?.filter(c => c.status === 'APPROVED') ?? [];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 h-screen">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#f47521] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 font-bold mt-6 tracking-widest uppercase text-xs">Syncing Clinic Data</p>
        </div>
    );

    if (error) return (
        <div className="p-10 text-red-500 text-center bg-red-50 rounded-2xl border border-red-100 max-w-lg mx-auto mt-20">
            <h2 className="font-bold text-lg mb-2">Connection Error</h2>
            <p className="text-sm opacity-80 font-medium">Unable to load accounts. Please check your network connection.</p>
        </div>
    );

    if (selectedClinic) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
                <button
                    onClick={() => setSelectedClinic(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#f47521] mb-8 font-bold transition-all hover:-translate-x-1"
                >
                    <ArrowLeft size={20} />
                    Back to Clinic Overview
                </button>

                <div className="mb-8 flex items-end justify-between border-b border-gray-100 pb-6">
                    <div>
                        <span className="text-[#f47521] text-xs font-black uppercase tracking-widest">Selected Practice</span>
                        <h2 className="text-4xl font-black text-[#1a2b3c] tracking-tight mt-1">
                            {selectedClinic.practice_name}
                        </h2>
                        <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-tight">Clinic ID: {selectedClinic.id.slice(0, 8)}</span>
                            • {selectedClinic.city}, {selectedClinic.state}
                        </p>
                    </div>
                </div>

                <PermissionManager practiceId={selectedClinic.id} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-[#1a2b3c] tracking-tight">User Settings</h1>
                <p className="text-gray-500 font-medium mt-2">Manage module access levels for your approved clinics</p>
            </div>

            {approvedClients.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-lg uppercase tracking-wider">No approved clinics found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-8 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <div className="col-span-5">Practice Details</div>
                        <div className="col-span-5">Location</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    {/* Clinic List */}
                    {approvedClients.map((client) => (
                        <div
                            key={client.id}
                            className="group bg-white border border-gray-200 hover:border-[#f47521] hover:shadow-xl hover:shadow-orange-50 rounded-2xl transition-all cursor-pointer overflow-hidden"
                            onClick={() => setSelectedClinic(client)}
                        >
                            <div className="grid grid-cols-12 gap-4 px-8 py-6 items-center">
                                <div className="col-span-5">
                                    <div className="font-bold text-gray-800 text-lg group-hover:text-[#f47521] transition-colors">
                                        {client.practice_name || "Untitled Practice"}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-1">{client.email}</div>
                                </div>

                                <div className="col-span-5">
                                    <div className="text-sm font-semibold text-gray-600">
                                        {client.city ? `${client.city}, ${client.state}` : "Location not set"}
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1 truncate">
                                        {client.address || "No address provided"}
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center justify-end gap-3">
                                    <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#f47521] group-hover:text-white transition-all duration-300">
                                        <Settings size={20} />
                                    </div>
                                    <ChevronDown size={20} className="text-gray-300 group-hover:text-[#f47521] transition-colors -rotate-90" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}