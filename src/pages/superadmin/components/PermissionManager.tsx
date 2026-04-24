// src/components/PermissionManager.tsx
import React, { useEffect } from "react";
import { Check, X, Save, Loader2, Lock } from "lucide-react";
import { usePermissions } from "../../../features/permissions/Permissions.hooks";

interface PermissionManagerProps {
    practiceId: string;
}

const PermissionManager = ({ practiceId }: PermissionManagerProps) => {
    const {
        permissions,
        practicePermissions,
        isLoading,
        isSaving,
        successMessage,
        loadPracticePermissions,
        savePermissions,
        toggleModulePermission,
        resetMessages
    } = usePermissions();

    useEffect(() => {
        if (practiceId) loadPracticePermissions(practiceId); // Load practice permissions
    }, [practiceId, loadPracticePermissions]);

    const ACTION_COLUMNS = ['view', 'create', 'edit', 'delete'];

    // Check if using default permissions
    const isUsingDefault = practicePermissions?.permissions?.length === 0;
    const hasCustomPermissions = practicePermissions?.permissions?.length > 0;

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[22px] border border-gray-100 shadow-sm">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-wide">Loading permissions...</p>
        </div>
    );

    return (
        <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-[#fafafa]/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-[#1a2b3c] text-xl">Module Permissions</h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                        Configure feature access for this clinic
                        {isUsingDefault && !hasCustomPermissions && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Using Default Settings
                            </span>
                        )}
                        {hasCustomPermissions && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Custom Settings
                            </span>
                        )}
                    </p>
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
                            {ACTION_COLUMNS.map((action: any) => (
                                <th key={action} className="px-4 py-4 text-center text-[11px] font-bold text-gray-700 border bg-gray-300 uppercase tracking-[0.15em] w-32">{action}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((module: any) => {
                            return (
                                <tr key={module.module} className="group transition-all">
                                    <td className="px-6 py-5 bg-gray-50/50 rounded-l-[18px] border-y border-l border-gray-100 group-hover:bg-gray-50 transition-colors">
                                        <span className="font-bold text-[#1a2b3c] block text-sm uppercase tracking-tight">
                                            {module.module.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-1 block">Key: {module.module}</span>
                                    </td>
                                    {ACTION_COLUMNS.map((action: any) => {
                                        const hasPermission = module.actions?.includes(action);
                                        return (
                                            <td key={action} className="py-5 bg-gray-50/50 border-y border-gray-100 text-center group-hover:bg-gray-50 last:border-r last:rounded-r-[18px] transition-colors">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => toggleModulePermission(module.module, action)}
                                                        className={`w-8 h-8 rounded-[10px] border-2 flex items-center justify-center transition-all duration-300 ${hasPermission ? 'bg-[#f47521] border-[#f47521] text-white shadow-md' : 'bg-white border-gray-200 hover:border-[#f47521]'
                                                            }`}
                                                    >
                                                        {hasPermission && <Check size={18} strokeWidth={3} />}
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

export default PermissionManager;