import { useEffect } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import InviteUserModal from '../components/PracticeUserAccount.InviteModal';
import EditUserModal from '../components/PracticeUserAccount.EditModal';
import { useModalState, usePracticeUsers, useUserSearch } from '../../../../features/PracticeUserAccount/PracticeUserAccount.hooks';
import { useDispatch } from 'react-redux';
import { fetchPracticeUsers, resetState } from '../../../../features/PracticeUserAccount/PracticeUserAccount.slice';

const PracticeUserAccount = () => {
    const dispatch = useDispatch<any>(); // Add this
    const { user: currentUser, isLoading: authLoading } = useAppSelector((state: any) => state.auth);
    const practiceId = currentUser?.practiceId || currentUser?.id;

    // Different section uses different command
    // This SUPER_ADMIN_VIEW command enables view only for superadmin in practice dashboard  
    // The SUPER_ADMIN command enables view, add, edit and delete for superadmin in practice dashboard

    // const isSuperAdminView = currentUser?.type === "SUPER_ADMIN_VIEW" || currentUser?.user?.type === "SUPER_ADMIN_VIEW";
    const isSuperAdminView = currentUser?.type === "SUPER_ADMIN" || currentUser?.user?.type === "SUPER_ADMIN";

    useEffect(() => {
        if (practiceId) {
            dispatch(fetchPracticeUsers(practiceId));
        }
        return () => {
            dispatch(resetState());
        };
    }, [dispatch, practiceId]);


    const {
        users,
        loading,
        error,
        deleteUser,
        clearError,
    } = usePracticeUsers();


    const {
        searchTerm,
        setSearchTerm,
        accessLevelFilter,
        setAccessLevelFilter,
        userAccessFilter,
        setUserAccessFilter,
        mfaFilter,
        setMfaFilter,
        filteredUsers,
    } = useUserSearch(users);

    const {
        isInviteModalOpen,
        isEditModalOpen,
        selectedUser,
        openInviteModal,
        closeInviteModal,
        openEditModal,
        closeEditModal,
    } = useModalState();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (!practiceId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mt-4">No practice found</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Accounts</h1>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search name
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Access Level
                            </label>
                            <select
                                value={accessLevelFilter}
                                onChange={(e) => setAccessLevelFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option>All</option>
                                <option>Dashboard and Sidebar</option>
                                <option>Admin</option>
                                <option>View Only</option>
                            </select>
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User Access
                            </label>
                            <select
                                value={userAccessFilter}
                                onChange={(e) => setUserAccessFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Multi-Factor Auth
                            </label>
                            <select
                                value={mfaFilter}
                                onChange={(e) => setMfaFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option>All</option>
                                <option>Enabled</option>
                                <option>Disabled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Access Level
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Access
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Multi-Factor Auth
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((teamUser) => (
                                        <tr key={teamUser.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {teamUser.name}
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{teamUser.access_level}</div>
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teamUser.user_access
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {teamUser.user_access ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teamUser.multi_factor_auth
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {teamUser.multi_factor_auth ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{teamUser.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(teamUser)}
                                                    className={`mr-3 ${isSuperAdminView ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                                    disabled={loading || isSuperAdminView}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this user?')) {
                                                            deleteUser(teamUser.id);
                                                        }
                                                    }}
                                                    className={`${isSuperAdminView ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'}`}
                                                    disabled={loading || isSuperAdminView}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Invite Button */}
                {!isSuperAdminView && (
                    <div className="mt-6">
                        <button
                            onClick={openInviteModal}
                            disabled={loading}
                            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        >
                            + Invite New User
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {!isSuperAdminView && (
                <InviteUserModal
                    isOpen={isInviteModalOpen}
                    onClose={closeInviteModal}
                    practiceId={practiceId}
                />
            )}

            {!isSuperAdminView && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    user={selectedUser}
                />
            )}
        </div>
    );
};

export default PracticeUserAccount;