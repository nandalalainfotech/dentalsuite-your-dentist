import React, { useState, useEffect } from 'react';
import { usePracticeUsers } from '../../../../features/PracticeUserAccount/PracticeUserAccount.hooks';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_PRACTICE_PERMISSIONS, GET_PERMISSION_MODULES_MASTER } from '../../../superadmin/graphql/permissions.queries';
import { localClient } from '../../../../api/apollo/localClient';
import { Check, Loader2 } from 'lucide-react';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    practiceId: string;
}

interface ModulePermission {
    module_key: string;
    module_name: string;
    path: string;
    actions: string[];
    available_actions: string[];
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, practiceId }) => {
    const { inviteUser, inviteLoading } = usePracticeUsers();

    const { data: modulesData, loading: modulesLoading } = useQuery(GET_PERMISSION_MODULES_MASTER, {
        skip: !isOpen,
        client: localClient
    });

    const [updatePermissions] = useMutation(CREATE_PRACTICE_PERMISSIONS, {
        client: localClient
    });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
    });

    // Permission state
    const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
    const [defaultPermissions, setDefaultPermissions] = useState<ModulePermission[]>([]);
    const [useDefaultPermissions, setUseDefaultPermissions] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSettingPermissions, setIsSettingPermissions] = useState(false);

    // Initialize permissions when modules data loads
    useEffect(() => {
        if ((modulesData as any)?.practice_permission_modules_master) {
            const modules = (modulesData as any).practice_permission_modules_master;

            // Create default permissions based on common role patterns
            // You can modify this based on your business logic
            const getDefaultActionsForModule = (module: any) => {
                // For Support module, only give view
                if (module.module_key === 'support') {
                    return ['view'];
                }
                // For Analytics, give view, export, download
                if (module.module_key === 'analytics') {
                    return module.actions?.filter((action: string) => ['view', 'export', 'download'].includes(action)) || [];
                }
                // For other modules, give common permissions (view, create, edit)
                // But not delete by default for safety
                return module.actions?.filter((action: string) => ['view', 'create', 'edit'].includes(action)) || [];
            };

            const initialPermissions = modules.map((module: any) => ({
                module_key: module.module_key,
                module_name: module.module_name,
                path: module.path,
                available_actions: module.actions || [],
                actions: [] // Start with no permissions selected for custom mode
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

            // Set initial permissions to default if useDefaultPermissions is true
            if (useDefaultPermissions) {
                setModulePermissions(JSON.parse(JSON.stringify(defaultPerms)));
            }
        }
    }, [modulesData]);

    useEffect(() => {
        if (generalError || success) {
            const timer = setTimeout(() => {
                setGeneralError('');
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [generalError, success]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'confirmPassword' && formData.password && value !== formData.password) {
            setPasswordError('Passwords do not match');
        } else if (name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const toggleModulePermission = (moduleKey: string, action: string) => {
        setModulePermissions(prev => prev.map(module => {
            if (module.module_key === moduleKey) {
                const actionExists = module.actions.includes(action);
                let updatedActions = actionExists
                    ? module.actions.filter(a => a !== action)
                    : [...module.actions, action];

                // If adding 'create', 'update', or 'delete', ensure 'view' is also present (if view is available)
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

    // Check if an action should be disabled for a module
    const isActionDisabled = (module: ModulePermission, action: string) => {
        // If the action is not available in the module's available_actions from API, disable it
        if (!module.available_actions.includes(action)) {
            return true;
        }
        return false;
    };

    // Apply default permissions to custom permissions
    const applyDefaultPermissions = () => {
        setModulePermissions(JSON.parse(JSON.stringify(defaultPermissions)));
        setUseDefaultPermissions(true);
    };

    // Reset to empty permissions (custom mode)
    const resetToEmptyPermissions = () => {
        setModulePermissions(prev => prev.map(module => ({
            ...module,
            actions: []
        })));
        setUseDefaultPermissions(false);
    };

    // Toggle between default and custom mode
    const toggleDefaultMode = () => {
        if (useDefaultPermissions) {
            resetToEmptyPermissions();
        } else {
            applyDefaultPermissions();
        }
    };

    const validateForm = () => {
        setPasswordError('');
        setGeneralError('');

        if (!formData.password) {
            setPasswordError('Password is required');
            return false;
        }

        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        if (!formData.email) {
            setGeneralError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setGeneralError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const setupUserPermissions = async (userId: string) => {
        try {
            // Get all available modules
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

            // Build default permissions (for fallback)
            const defaultPermsToSend = defaultPermissions
                .filter(module => module.actions.length > 0)
                .map(module => ({
                    module: module.module_key,
                    path: module.path,
                    actions: module.actions
                }));

            if (selectedPermissions.length === 0 && defaultPermsToSend.length === 0) {
                // If no permissions selected and no defaults, don't set any permissions
                return true;
            }

            setIsSettingPermissions(true);

            // Clone the permissions to avoid reference issues
            const permissionsToSend = JSON.parse(JSON.stringify(selectedPermissions));
            const defaultPermsToSendCloned = JSON.parse(JSON.stringify(defaultPermsToSend));

            await updatePermissions({
                variables: {
                    practiceId: userId, // Using userId as practice_id in permissions table
                    permissions: permissionsToSend,
                    defaultPermission: defaultPermsToSendCloned // Send cloned default permissions
                }
            });

            return true;
        } catch (permError) {
            console.error("Permission setup error:", permError);
            throw new Error(`Failed to setup user permissions`);
        } finally {
            setIsSettingPermissions(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!modulesData && !modulesLoading) {
            setGeneralError('Failed to load permission data. Please try again.');
            return;
        }

        try {
            const inviteData = {
                practice_id: practiceId,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,
                type: 'Custom',
                status: 'ACTIVE'
            };

            const result = await inviteUser(inviteData);

            const userId = (result as any)?.payload?.id ?? (result as any)?.id;

            if (!userId) {
                throw new Error("Failed to get user ID after invitation");
            }

            if (userId) {
                await setupUserPermissions(userId);
            }

            setSuccess('User invited successfully!');
            setTimeout(() => {
                onClose();
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    mobile: '',
                });
                setModulePermissions([]);
                setDefaultPermissions([]);
                setUseDefaultPermissions(true);
                setPasswordError('');
                setGeneralError('');
                setSuccess('');
            }, 1500);

        } catch (error: any) {
            let errorMessage = 'Failed to invite user. Please try again.';

            if (error.message) {
                errorMessage = error.message;
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            if (errorMessage.toLowerCase().includes('duplicate') ||
                errorMessage.toLowerCase().includes('already exists') ||
                errorMessage.toLowerCase().includes('unique constraint')) {
                errorMessage = 'A user with this email address already exists. Please use a different email address.';
            }

            setGeneralError(errorMessage);
        }
    };

    // Get all unique actions from all modules to display as columns
    const getAllActions = () => {
        const allActions = new Set<string>();
        modulePermissions.forEach(module => {
            module.available_actions.forEach(action => {
                allActions.add(action);
            });
        });
        return Array.from(allActions);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Invite New User</h2>
                        <p className="text-sm text-gray-500 mt-1">Add a new team member and configure their permissions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={inviteLoading || isSettingPermissions}
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

                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="First name"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    disabled={inviteLoading || isSettingPermissions}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Last name"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    disabled={inviteLoading || isSettingPermissions}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="email@example.com"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                disabled={inviteLoading || isSettingPermissions}
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                disabled={inviteLoading || isSettingPermissions}
                            />
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Min 6 characters"
                                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${passwordError && formData.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500'}`}
                                    disabled={inviteLoading || isSettingPermissions}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Confirm password"
                                    className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500'}`}
                                    disabled={inviteLoading || isSettingPermissions}
                                />
                            </div>
                        </div>

                        {passwordError && (
                            <div className="text-red-600 text-sm">
                                {passwordError}
                            </div>
                        )}
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Module Permissions</h3>

                            {/* Default Permission Toggle */}
                            <button
                                type="button"
                                onClick={toggleDefaultMode}
                                disabled={inviteLoading || isSettingPermissions}
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

                        {modulesLoading ? (
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
                                                    {action}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modulePermissions.map((module) => {
                                            // Check if current permissions match default permissions
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
                                                                    disabled={isDisabled || inviteLoading || isSettingPermissions}
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

                        {/* Info message about restricted modules */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                            <p className="text-xs text-blue-800">
                                <strong>Note:</strong> Available permissions are based on module configuration. Some modules may have limited actions (e.g., Support only has View permission).
                            </p>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-blue-100 rounded-full shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> The user will receive login credentials via email. Only selected permissions will be granted.
                                </p>
                                {isSettingPermissions && (
                                    <p className="text-sm text-blue-800 mt-2 flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Setting up permissions...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            disabled={inviteLoading || isSettingPermissions}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={inviteLoading || isSettingPermissions || !!passwordError}
                            className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg shadow-orange-600/20"
                        >
                            {(inviteLoading || isSettingPermissions) ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{inviteLoading ? 'Inviting...' : 'Setting permissions...'}</span>
                                </>
                            ) : (
                                'Invite User'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteUserModal;