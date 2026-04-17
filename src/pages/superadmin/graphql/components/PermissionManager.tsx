// src/components/PermissionManager.tsx
import React, { useEffect } from "react";
import { Check, X, Save, Loader2 } from "lucide-react";
import { usePermissions } from "../../../../features/permissions/Permissions.hooks";


interface PermissionManagerProps {
    practiceId: string;
}

export const PermissionManager: React.FC<PermissionManagerProps> = ({ practiceId }) => {
    const {
        masterModules,
        isLoading,
        isSaving,
        error,
        successMessage,
        loadData,
        loadPracticePermissions,
        clearPracticePermissions,
        savePermissions,
        toggleModulePermission,
        resetMessages,
        hasPermission,
    } = usePermissions();

    useEffect(() => {
        loadData();
        clearPracticePermissions();
        loadPracticePermissions(practiceId);
    }, [practiceId, loadData, clearPracticePermissions, loadPracticePermissions]);

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => resetMessages(), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error, resetMessages]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">
                    Permission Manager
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                    Manage module permissions for your practice
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Module Permissions</h2>
                        <button
                            onClick={() => savePermissions(practiceId)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Permission Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Module
                                </th>
                                {masterModules[0]?.actions.map((action: any) => (
                                    <th
                                        key={action}
                                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {action.charAt(0).toUpperCase() + action.slice(1)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {masterModules.map((module: any) => (
                                <tr key={module.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {module.module_name}
                                        </div>
                                        <div className="text-xs text-gray-500">{module.description}</div>
                                    </td>
                                    {module.actions.map((action: any) => {
                                        const isChecked = hasPermission(module.module_key, action);
                                        return (
                                            <td key={action} className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        toggleModulePermission(module.module_key, action)
                                                    }
                                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isChecked
                                                        ? "bg-orange-500 text-white hover:bg-orange-600"
                                                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {isChecked ? <Check size={16} /> : <X size={16} />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <p className="text-xs text-gray-500">
                        ✅ Green checkmark means permission is enabled. Click to toggle.
                    </p>
                </div>
            </div>
        </div>
    );
};