// src/components/PermissionManager.tsx
import React, { useEffect, useMemo } from "react";
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
        error,
        loadPracticePermissions,
        savePermissions,
        toggleModulePermission,
        resetMessages,
    } = usePermissions();

    const ACTION_COLUMNS = ['view', 'create', 'edit', 'delete'];

    useEffect(() => {
        if (practiceId) {
            console.log("Loading permissions for userId:", practiceId);
            loadPracticePermissions(practiceId);
        }
    }, [practiceId, loadPracticePermissions]);

    // Check if a module is using default permissions
    const isModuleUsingDefault = (moduleKey: string) => {
        if (!practicePermissions?.default_permission) return false;

        const defaultModule = practicePermissions.default_permission.find(
            (p: any) => p.module === moduleKey
        );
        const currentModule = permissions.find((p: any) => p.module === moduleKey);

        if (!defaultModule && !currentModule) return true;
        if (!defaultModule && (!currentModule?.actions || currentModule?.actions.length === 0)) return true;
        if (!defaultModule) return false;

        const defaultActions = [...(defaultModule.actions || [])].sort();
        const currentActions = [...(currentModule?.actions || [])].sort();

        return JSON.stringify(defaultActions) === JSON.stringify(currentActions);
    };

    // Check if an action is available for a module (based on default_permission)
    const isActionAvailable = (moduleKey: string, action: string) => {
        if (!practicePermissions?.default_permission) {
            console.log("Default permission not loaded yet");
            return true;
        }

        const defaultModule = practicePermissions.default_permission.find(
            (p: any) => p.module === moduleKey
        );

        if (!defaultModule) {
            console.log(`Module ${moduleKey} not found in default_permission, enabling all actions`);
            return true;
        }

        const isAvailable = defaultModule.actions?.includes(action) || false;
        console.log(`Module ${moduleKey}, action ${action}: ${isAvailable ? 'available' : 'not available'}`);
        return isAvailable;
    };

    // Create a safe copy of permissions for sorting
    // FIX: Include modules even if they have empty actions
    const sortedPermissions = useMemo(() => {
        if (!permissions || !Array.isArray(permissions)) return [];

        // Get all module keys from default_permission and current permissions
        const allModuleKeys = new Set<string>();

        // Add modules from current permissions
        permissions.forEach((p: any) => {
            if (p.module) allModuleKeys.add(p.module);
        });

        // Add modules from default_permission
        if (practicePermissions?.default_permission) {
            practicePermissions.default_permission.forEach((p: any) => {
                if (p.module) allModuleKeys.add(p.module);
            });
        }

        // Create a complete list of modules with their permissions
        const completePermissions = Array.from(allModuleKeys).map(moduleKey => {
            // Find existing permission or create default
            const existingPerm = permissions.find((p: any) => p.module === moduleKey);
            if (existingPerm) {
                return existingPerm;
            }

            // Create a default permission entry with empty actions
            return {
                module: moduleKey,
                actions: []
            };
        });

        return completePermissions.sort((a, b) => {
            return (a.module || '').localeCompare(b.module || '');
        });
    }, [permissions, practicePermissions?.default_permission]);

    // Log for debugging
    useEffect(() => {
        if (practicePermissions?.default_permission) {
            console.log("Default permissions loaded:", practicePermissions.default_permission);
            practicePermissions.default_permission.forEach((module: any) => {
                console.log(`Module ${module.module} has actions:`, module.actions);
            });
        }
        console.log("Current permissions:", permissions);
    }, [practicePermissions, permissions]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[22px] border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
                <p className="text-gray-400 font-medium tracking-wide">Loading permissions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[22px] border border-gray-100 shadow-sm">
                <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                <p className="text-red-500 font-medium">{error}</p>
                <button
                    onClick={() => loadPracticePermissions(practiceId)}
                    className="mt-4 px-4 py-2 bg-[#f47521] text-white rounded-lg text-sm font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-[#fafafa]/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-[#1a2b3c] text-xl">Module Permissions</h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                        Configure feature access for this clinic
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
                    <div className="mt-6 px-5 py-3.5 bg-green-50 border border-green-100 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3 text-green-700 font-bold text-sm">
                            <Check size={16} strokeWidth={3} /> {successMessage}
                        </div>
                        <button onClick={resetMessages} className="text-green-400 hover:text-green-600">
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 overflow-x-auto">
                {sortedPermissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Lock size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No permissions configured</p>
                        <p className="text-gray-400 text-sm mt-2">Default permissions will be applied</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase rounded-l-lg">Module</th>
                                {ACTION_COLUMNS.map((action) => (
                                    <th key={action} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase w-24">
                                        {action}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPermissions.map((module) => {
                                const moduleActions = module.actions || [];
                                const isDefault = isModuleUsingDefault(module.module);

                                return (
                                    <tr key={module.module} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {module.module.replace(/_/g, ' ')}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                        {module.module}
                                                    </div>
                                                </div>
                                                {isDefault && (
                                                    <span className="ml-3 inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        {ACTION_COLUMNS.map((action) => {
                                            const hasPermission = moduleActions.includes(action);
                                            const isAvailable = isActionAvailable(module.module, action);

                                            return (
                                                <td key={action} className="px-4 py-4 text-center">
                                                    <button
                                                        onClick={() => isAvailable && toggleModulePermission(module.module, action)}
                                                        disabled={!isAvailable}
                                                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all mx-auto
                                                            ${!isAvailable
                                                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                                : hasPermission
                                                                    ? 'bg-[#f47521] border-[#f47521] text-white hover:bg-[#e06510]'
                                                                    : 'bg-white border-gray-300 hover:border-[#f47521]'
                                                            }`}
                                                    >
                                                        {hasPermission && isAvailable && <Check size={16} strokeWidth={3} />}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Info note */}
            <div className="px-6 pb-6 pt-2">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs text-blue-800">
                        <strong>Note:</strong> Modules with <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 mx-1">Default</span> badge are using the system default settings.
                        Grayed out checkboxes indicate actions that are not available for that module (e.g., analytics doesn't support create/edit/delete).
                        Unchecking all permissions will save an empty permission set for the module.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PermissionManager;