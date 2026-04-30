import React, { useState, useEffect, useMemo } from 'react';
import { usePracticeUsers } from '../../../../features/PracticeUserAccount/PracticeUserAccount.hooks';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRACTICE_PERMISSIONS, UPDATE_PRACTICE_PERMISSIONS } from '../../../superadmin/graphql/permissions.queries';
import { localClient } from '../../../../api/apollo/localClient';
import { Check, Loader2, Save, X } from 'lucide-react';
import type { PracticeUser } from '../../../../features/PracticeUserAccount/PracticeUserAccount.types';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: PracticeUser | null;
}

interface ModulePermission {
    module: string;
    actions: string[];
}

interface PermissionRecord {
    id: string;
    practice_id: string;
    permissions: any;
    default_permission: any;
    created_at: string;
    updated_at: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
    const { updateUser, updateLoading } = usePracticeUsers();
    const ACTION_COLUMNS = ['view', 'create', 'edit', 'delete'];

    // Fetch user's existing permissions
    const { data: userPermissionsData, loading: permissionsLoading, refetch } = useQuery(GET_PRACTICE_PERMISSIONS, {
        skip: !isOpen || !user,
        variables: { practiceId: user?.id },
        client: localClient
    });

    const [updatePermissions] = useMutation(UPDATE_PRACTICE_PERMISSIONS, {
        client: localClient
    });

    const [formData, setFormData] = useState({
        access_level: '',
        user_access: false,
        multi_factor_auth: false,
    });

    // Permission state
    const [permissions, setPermissions] = useState<ModulePermission[]>([]);
    const [practicePermissions, setPracticePermissions] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [permissionId, setPermissionId] = useState<string | null>(null);

    // Initialize form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                access_level: user.access_level || 'Dashboard and Sidebar',
                user_access: user.user_access || false,
                multi_factor_auth: user.multi_factor_auth || false,
            });
        }
    }, [user]);

    // Parse permissions from JSONB to array format
    const parsePermissionsToArray = (permissionsObj: any): ModulePermission[] => {
        if (!permissionsObj || typeof permissionsObj !== 'object') {
            return [];
        }

        // Handle array format
        if (Array.isArray(permissionsObj)) {
            return permissionsObj.map((item: any) => ({
                module: item.module || item.module_key,
                actions: item.actions || []
            }));
        }

        // Handle object format keyed by module
        const modulesArray: ModulePermission[] = [];
        for (const [moduleKey, moduleData] of Object.entries(permissionsObj)) {
            if (typeof moduleData === 'object' && moduleData !== null) {
                modulesArray.push({
                    module: moduleKey,
                    actions: (moduleData as any).actions || []
                });
            }
        }
        return modulesArray;
    };

    // Initialize permissions when data loads
    useEffect(() => {
        if ((userPermissionsData as any)?.practice_permissions && (userPermissionsData as any).practice_permissions.length > 0) {
            const permissionRecord = (userPermissionsData as any).practice_permissions[0] as PermissionRecord;
            setPermissionId(permissionRecord.id);

            // Parse default permissions (this contains all available modules)
            let defaultPermsArray: ModulePermission[] = [];
            if (permissionRecord.default_permission) {
                defaultPermsArray = parsePermissionsToArray(permissionRecord.default_permission);
                setPracticePermissions({
                    default_permission: defaultPermsArray,
                    permissions: permissionRecord.permissions
                });
            }

            // Parse user's active permissions
            let userPermsArray: ModulePermission[] = [];
            if (permissionRecord.permissions) {
                userPermsArray = parsePermissionsToArray(permissionRecord.permissions);
            }

            // If user has permissions, use them; otherwise use default
            if (userPermsArray.length > 0) {
                setPermissions(userPermsArray);
            } else if (defaultPermsArray.length > 0) {
                setPermissions(defaultPermsArray);
            }
        } else if ((userPermissionsData as any)?.practice_permissions && (userPermissionsData as any).practice_permissions.length === 0) {
            // No permissions record exists yet
            setPermissionId(null);
            setPermissions([]);
            setPracticePermissions(null);
        }
    }, [userPermissionsData]);

    // Create a safe copy of permissions for sorting - include modules even if they have empty actions
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
            return true;
        }

        const defaultModule = practicePermissions.default_permission.find(
            (p: any) => p.module === moduleKey
        );

        if (!defaultModule) {
            return true;
        }

        return defaultModule.actions?.includes(action) || false;
    };

    // Toggle module permission
    const toggleModulePermission = (moduleKey: string, action: string) => {
        setPermissions(prev => {
            const moduleIndex = prev.findIndex(p => p.module === moduleKey);
            const currentActions = moduleIndex >= 0 ? [...prev[moduleIndex].actions] : [];

            let updatedActions;
            if (currentActions.includes(action)) {
                updatedActions = currentActions.filter(a => a !== action);
            } else {
                updatedActions = [...currentActions, action];
            }

            // If adding 'create', 'edit', or 'delete', ensure 'view' is also present
            if (!currentActions.includes(action) && action !== 'view') {
                const defaultModule = practicePermissions?.default_permission?.find(
                    (p: any) => p.module === moduleKey
                );
                if (defaultModule?.actions?.includes('view') && !updatedActions.includes('view')) {
                    updatedActions = ['view', ...updatedActions];
                }
            }

            const updatedPermissions = [...prev];
            if (moduleIndex >= 0) {
                updatedPermissions[moduleIndex] = {
                    ...updatedPermissions[moduleIndex],
                    actions: updatedActions
                };
            } else {
                updatedPermissions.push({
                    module: moduleKey,
                    actions: updatedActions
                });
            }

            return updatedPermissions;
        });
    };

    // Convert permissions to the format expected by the mutation
    const convertPermissionsToJSON = (permissionsArray: ModulePermission[]) => {
        return permissionsArray.map(perm => ({
            module: perm.module,
            actions: perm.actions
        }));
    };

    const savePermissions = async (userId: string) => {
        try {
            setIsSaving(true);
            setGeneralError('');
            setSuccessMessage('');

            // Convert permissions to array format
            const permissionsToSave = convertPermissionsToJSON(permissions);
            const defaultPermissionsToSave = practicePermissions?.default_permission
                ? convertPermissionsToJSON(practicePermissions.default_permission)
                : [];

            await updatePermissions({
                variables: {
                    practiceId: userId,
                    permissions: permissionsToSave,
                    defaultPermission: defaultPermissionsToSave
                }
            });

            setSuccessMessage('Permissions updated successfully!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (permError) {
            console.error("Permission update error:", permError);
            throw new Error(`Failed to update user permissions`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setGeneralError('User data is missing');
            return;
        }

        try {
            // Update user basic info
            await updateUser({
                id: user.id,
                access_level: formData.access_level,
                user_access: formData.user_access,
                multi_factor_auth: formData.multi_factor_auth,
            });

            // Update permissions
            await savePermissions(user.id);

            setSuccessMessage('User updated successfully!');
            setTimeout(() => {
                onClose();
                setSuccessMessage('');
                setGeneralError('');
            }, 1500);
        } catch (error: any) {
            let errorMessage = 'Failed to update user. Please try again.';

            if (error.message) {
                errorMessage = error.message;
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            }

            setGeneralError(errorMessage);
        }
    };

    const resetMessages = () => {
        setGeneralError('');
        setSuccessMessage('');
    };

    const isLoading = permissionsLoading;

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                        <p className="text-sm text-gray-500 mt-1">Edit user information and permissions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={updateLoading || isSaving}
                    >
                        ×
                    </button>
                </div>

                {/* Toast Notifications */}
                {(generalError || successMessage) && (
                    <div className="mx-6 mt-4">
                        {generalError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                <div className="p-1 bg-red-200/50 rounded-full shrink-0">
                                    <X className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">{generalError}</span>
                                <button onClick={resetMessages} className="ml-auto text-red-500 hover:text-red-700">
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                <div className="p-1 bg-green-200/50 rounded-full shrink-0">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">{successMessage}</span>
                                <button onClick={resetMessages} className="ml-auto text-green-500 hover:text-green-700">
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* User Information Section */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">User Information</h3>

                        {/* User Details Display */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Name:</span>
                                <span className="text-sm text-gray-900">{user.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">Email:</span>
                                <span className="text-sm text-gray-900">{user.email}</span>
                            </div>
                        </div>

                        {/* Editable Fields */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Access Level
                            </label>
                            <select
                                value={formData.access_level}
                                onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                disabled={updateLoading || isSaving}
                            >
                                <option>Dashboard and Sidebar</option>
                                <option>Admin</option>
                                <option>View Only</option>
                            </select>
                        </div> */}

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.user_access}
                                    onChange={(e) => setFormData({ ...formData, user_access: e.target.checked })}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    disabled={updateLoading || isSaving}
                                />
                                <span className="ml-2 text-sm text-gray-700">User Access</span>
                            </label>
                        </div>

                        {/* <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.multi_factor_auth}
                                    onChange={(e) => setFormData({ ...formData, multi_factor_auth: e.target.checked })}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    disabled={updateLoading || isSaving}
                                />
                                <span className="ml-2 text-sm text-gray-700">Multi-Factor Authentication</span>
                            </label>
                        </div> */}
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Module Permissions</h3>
                            <button
                                type="button"
                                onClick={() => savePermissions(user.id)}
                                disabled={isSaving || isLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all text-sm font-medium shadow-lg shadow-orange-100"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? 'Saving...' : 'Save Permissions'}
                            </button>
                        </div>

                        <p className="text-sm text-gray-500">
                            Configure access permissions for this user
                        </p>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-xl">
                                <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                                <p className="text-gray-400 font-medium">Loading permissions...</p>
                            </div>
                        ) : sortedPermissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-xl">
                                <p className="text-gray-400 font-medium">No permission modules found</p>
                                <p className="text-gray-400 text-sm mt-2">Please contact administrator</p>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px] border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider rounded-l-lg">
                                                Module
                                            </th>
                                            {ACTION_COLUMNS.map((action) => (
                                                <th key={action} className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
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
                                                <tr key={module.module} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium text-gray-900 text-sm">
                                                                    {module.module.replace(/_/g, ' ')}
                                                                </div>
                                                                <div className="text-xs text-gray-400 font-mono mt-0.5">
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
                                                                    type="button"
                                                                    onClick={() => isAvailable && toggleModulePermission(module.module, action)}
                                                                    disabled={!isAvailable || updateLoading || isSaving}
                                                                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all mx-auto
                                                                        ${!isAvailable
                                                                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                                            : hasPermission
                                                                                ? 'bg-orange-500 border-orange-500 text-white shadow-md hover:bg-orange-600'
                                                                                : 'bg-white border-gray-300 hover:border-orange-400 hover:bg-orange-50'
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
                            </div>
                        )}

                        {/* Info note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <p className="text-xs text-blue-800">
                                <strong>Note:</strong> Modules with <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 mx-1">Default</span> badge are using the system default settings.
                                Grayed out checkboxes indicate actions that are not available for that module (e.g., analytics doesn't support create/edit/delete).
                                Unchecking all permissions will save an empty permission set for the module.
                            </p>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            disabled={updateLoading || isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateLoading || isSaving || isLoading}
                            className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg shadow-orange-600/20"
                        >
                            {(updateLoading || isSaving) ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    <span>{updateLoading ? 'Saving...' : 'Updating permissions...'}</span>
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;