import React, { useState, useEffect } from 'react';
import { usePracticeUsers } from '../../../../features/PracticeUserAccount/PracticeUserAccount.hooks';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PERMISSION_MODULES_MASTER, GET_PRACTICE_PERMISSIONS, UPDATE_PRACTICE_PERMISSIONS } from '../../../superadmin/graphql/permissions.queries';
import { localClient } from '../../../../api/apollo/localClient';
import { Check, Loader2 } from 'lucide-react';
import type { PracticeUser } from '../../../../features/PracticeUserAccount/PracticeUserAccount.types';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: PracticeUser | null;
}

interface ModulePermission {
    module_key: string;
    module_name: string;
    path: string;
    actions: string[];
    available_actions: string[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
    const { updateUser, updateLoading } = usePracticeUsers();

    // Fetch permission modules
    const { data: modulesData, loading: modulesLoading } = useQuery(GET_PERMISSION_MODULES_MASTER, {
        skip: !isOpen || !user,
        client: localClient
    });

    // Fetch user's existing permissions
    const { data: userPermissionsData, loading: permissionsLoading, refetch: refetchPermissions } = useQuery(GET_PRACTICE_PERMISSIONS, {
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
    const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
    const [defaultPermissions, setDefaultPermissions] = useState<ModulePermission[]>([]);
    const [useDefaultPermissions, setUseDefaultPermissions] = useState(true);
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSettingPermissions, setIsSettingPermissions] = useState(false);

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

    // Initialize permissions when modules data loads
    useEffect(() => {
        if ((modulesData as any)?.practice_permission_modules_master) {
            const modules = (modulesData as any).practice_permission_modules_master;

            const initialPermissions = modules.map((module: any) => ({
                module_key: module.module_key,
                module_name: module.module_name,
                path: module.path,
                available_actions: module.actions || [],
                actions: []
            }));

            const defaultPerms = modules.map((module: any) => ({
                module_key: module.module_key,
                module_name: module.module_name,
                path: module.path,
                available_actions: module.actions || [],
                actions: getDefaultActionsForModule(module)
            }));

            setModulePermissions(initialPermissions);
            setDefaultPermissions(defaultPerms);

            // If we have user permissions data, apply them
            if ((userPermissionsData as any)?.practice_permissions) {
                applyUserPermissions(initialPermissions, (userPermissionsData as any).practice_permissions);
            } else if (useDefaultPermissions) {
                setModulePermissions(JSON.parse(JSON.stringify(defaultPerms)));
            }
        }
    }, [modulesData, userPermissionsData]);

    // Get default actions for a module
    const getDefaultActionsForModule = (module: any) => {
        if (module.module_key === 'support') {
            return ['view'];
        }
        if (module.module_key === 'analytics') {
            return module.actions?.filter((action: string) => ['view', 'export', 'download'].includes(action)) || [];
        }
        return module.actions?.filter((action: string) => ['view', 'create', 'edit'].includes(action)) || [];
    };

    // Apply user's existing permissions
    const applyUserPermissions = (modules: ModulePermission[], userPerms: any[]) => {
        const updatedModules = modules.map(module => {
            const userPerm = userPerms.find(perm => perm.module === module.module_key);
            if (userPerm && userPerm.actions) {
                return { ...module, actions: userPerm.actions };
            }
            return module;
        });

        setModulePermissions(updatedModules);

        // Check if permissions match default
        const isUsingDefault = updatedModules.every(module => {
            const defaultModule = defaultPermissions.find(d => d.module_key === module.module_key);
            return defaultModule && JSON.stringify(module.actions.sort()) === JSON.stringify(defaultModule.actions.sort());
        });

        setUseDefaultPermissions(isUsingDefault);
    };

    useEffect(() => {
        if (generalError || success) {
            const timer = setTimeout(() => {
                setGeneralError('');
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [generalError, success]);

    if (!isOpen || !user) return null;

    const toggleModulePermission = (moduleKey: string, action: string) => {
        setModulePermissions(prev => prev.map(module => {
            if (module.module_key === moduleKey) {
                const actionExists = module.actions.includes(action);
                let updatedActions = actionExists
                    ? module.actions.filter(a => a !== action)
                    : [...module.actions, action];

                // If adding 'create', 'update', or 'delete', ensure 'view' is also present
                if (!actionExists && action !== 'view') {
                    if (!updatedActions.includes('view') && module.available_actions.includes('view')) {
                        updatedActions = ['view', ...updatedActions];
                    }
                }

                return { ...module, actions: updatedActions };
            }
            return module;
        }));
    };

    const isActionDisabled = (module: ModulePermission, action: string) => {
        return !module.available_actions.includes(action);
    };

    const applyDefaultPermissions = () => {
        setModulePermissions(JSON.parse(JSON.stringify(defaultPermissions)));
        setUseDefaultPermissions(true);
    };

    const resetToEmptyPermissions = () => {
        setModulePermissions(prev => prev.map(module => ({
            ...module,
            actions: []
        })));
        setUseDefaultPermissions(false);
    };

    const toggleDefaultMode = () => {
        if (useDefaultPermissions) {
            resetToEmptyPermissions();
        } else {
            applyDefaultPermissions();
        }
    };

    const updateUserPermissions = async (userId: string) => {
        try {
            let modules = (modulesData as any)?.practice_permission_modules_master ?? [];

            if (modulesLoading && modules.length === 0) {
                await new Promise((resolve) => {
                    const checkModules = setInterval(() => {
                        const currentModules = (modulesData as any)?.practice_permission_modules_master ?? [];
                        if (!modulesLoading || currentModules.length > 0) {
                            clearInterval(checkModules);
                            resolve(null);
                        }
                    }, 100);

                    setTimeout(() => {
                        clearInterval(checkModules);
                        resolve(null);
                    }, 10000);
                });

                modules = (modulesData as any)?.practice_permission_modules_master ?? [];
            }

            if (modules.length === 0) {
                return false;
            }

            // Build permissions based on selected checkboxes
            const selectedPermissions = modulePermissions
                .filter(module => module.actions.length > 0)
                .map(module => ({
                    module: module.module_key,
                    path: module.path,
                    actions: module.actions
                }));

            const defaultPermsToSend = defaultPermissions
                .filter(module => module.actions.length > 0)
                .map(module => ({
                    module: module.module_key,
                    path: module.path,
                    actions: module.actions
                }));

            setIsSettingPermissions(true);

            const permissionsToSend = JSON.parse(JSON.stringify(selectedPermissions));
            const defaultPermsToSendCloned = JSON.parse(JSON.stringify(defaultPermsToSend));

            await updatePermissions({
                variables: {
                    practiceId: userId,
                    permissions: permissionsToSend,
                    defaultPermission: defaultPermsToSendCloned
                }
            });

            return true;
        } catch (permError) {
            console.error("Permission update error:", permError);
            throw new Error(`Failed to update user permissions`);
        } finally {
            setIsSettingPermissions(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Update user basic info
            await updateUser({
                id: user.id,
                access_level: formData.access_level,
                user_access: formData.user_access,
                multi_factor_auth: formData.multi_factor_auth,
            });

            // Update permissions
            await updateUserPermissions(user.id);

            setSuccess('User updated successfully!');
            setTimeout(() => {
                onClose();
                setSuccess('');
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

    const getAllActions = () => {
        const allActions = new Set<string>();
        modulePermissions.forEach(module => {
            module.available_actions.forEach(action => {
                allActions.add(action);
            });
        });
        return Array.from(allActions);
    };

    const isLoading = modulesLoading || permissionsLoading;

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
                        disabled={updateLoading || isSettingPermissions}
                    >
                        ×
                    </button>
                </div>

                {/* Toast Notifications */}
                {(generalError || success) && (
                    <div className="mx-6 mt-4">
                        {generalError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                <div className="p-1 bg-red-200/50 rounded-full shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">{generalError}</span>
                                <button onClick={() => setGeneralError('')} className="ml-auto text-red-500 hover:text-red-700">✕</button>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                <div className="p-1 bg-green-200/50 rounded-full shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">{success}</span>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Access Level
                            </label>
                            <select
                                value={formData.access_level}
                                onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                disabled={updateLoading || isSettingPermissions}
                            >
                                <option>Dashboard and Sidebar</option>
                                <option>Admin</option>
                                <option>View Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.user_access}
                                    onChange={(e) => setFormData({ ...formData, user_access: e.target.checked })}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    disabled={updateLoading || isSettingPermissions}
                                />
                                <span className="ml-2 text-sm text-gray-700">User Access</span>
                            </label>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.multi_factor_auth}
                                    onChange={(e) => setFormData({ ...formData, multi_factor_auth: e.target.checked })}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    disabled={updateLoading || isSettingPermissions}
                                />
                                <span className="ml-2 text-sm text-gray-700">Multi-Factor Authentication</span>
                            </label>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Module Permissions</h3>

                            <button
                                type="button"
                                onClick={toggleDefaultMode}
                                disabled={updateLoading || isSettingPermissions || isLoading}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${useDefaultPermissions
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                {useDefaultPermissions ? '✓ Using Default Permissions' : 'Use Default Permissions'}
                            </button>
                        </div>

                        <p className="text-sm text-gray-500">
                            Configure access permissions for this user
                            {useDefaultPermissions && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Default permissions applied
                                </span>
                            )}
                        </p>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-xl">
                                <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                                <p className="text-gray-400 font-medium">Loading permissions...</p>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50">
                                                Module
                                            </th>
                                            {getAllActions().map((action) => (
                                                <th key={action} className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
                                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modulePermissions.map((module) => {
                                            const isUsingDefault = useDefaultPermissions &&
                                                JSON.stringify(module.actions.sort()) ===
                                                JSON.stringify(defaultPermissions.find(d => d.module_key === module.module_key)?.actions.sort() || []);

                                            return (
                                                <tr key={module.module_key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-gray-50 border-r border-gray-100">
                                                        <div className="font-medium text-gray-900 text-sm">
                                                            {module.module_name}
                                                            {isUsingDefault && useDefaultPermissions && (
                                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                                                            {module.module_key}
                                                        </div>
                                                    </td>
                                                    {getAllActions().map((action) => {
                                                        const hasPermission = module.actions.includes(action);
                                                        const isDisabled = isActionDisabled(module, action);

                                                        return (
                                                            <td key={action} className="px-4 py-4 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleModulePermission(module.module_key, action)}
                                                                    disabled={isDisabled || updateLoading || isSettingPermissions}
                                                                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isDisabled
                                                                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                                                                        : hasPermission
                                                                            ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                                                                            : 'bg-white border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                                                                        }`}
                                                                >
                                                                    {hasPermission && <Check size={16} strokeWidth={3} />}
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

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <p className="text-xs text-blue-800">
                                <strong>Note:</strong> Available permissions are based on module configuration. Some modules may have limited actions.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            disabled={updateLoading || isSettingPermissions}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateLoading || isSettingPermissions || isLoading}
                            className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg shadow-orange-600/20"
                        >
                            {(updateLoading || isSettingPermissions) ? (
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