import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import type { RootState } from "../../store/store";
import { clearError, deleteUser, inviteUser, updateUserAccess } from './PracticeUserAccount.slice';
import type { InviteUserData, PracticeUser, UpdateUserData } from './PracticeUserAccount.types';


export const usePracticeUsers = () => {  // <--- Remove the parameter
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error, updateLoading, deleteLoading, inviteLoading } = useSelector(
        (state: RootState) => state.practiceUsers
    );

    const handleUpdateUser = useCallback(
        async (data: UpdateUserData) => {
            const result = await dispatch(updateUserAccess(data));
            return result;
        },
        [dispatch]
    );

    const handleDeleteUser = useCallback(
        async (id: string) => {
            const result = await dispatch(deleteUser(id));
            return result;
        },
        [dispatch]
    );

    const handleInviteUser = useCallback(
        async (data: InviteUserData) => {
            const result = await dispatch(inviteUser(data));
            return result;
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        users,
        loading,
        error,
        updateLoading,
        deleteLoading,
        inviteLoading,
        updateUser: handleUpdateUser,
        deleteUser: handleDeleteUser,
        inviteUser: handleInviteUser,
        clearError: handleClearError,
    };
};

export const useUserSearch = (users: PracticeUser[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [accessLevelFilter, setAccessLevelFilter] = useState('All');
    const [userAccessFilter, setUserAccessFilter] = useState('All');
    const [mfaFilter, setMfaFilter] = useState('All');

    const filteredUsers = users.filter((user) => {
        // Search filter
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Access level filter
        const matchesAccessLevel = accessLevelFilter === 'All' || user.access_level === accessLevelFilter;

        // User access filter
        const matchesUserAccess = userAccessFilter === 'All' ||
            (userAccessFilter === 'Active' && user.user_access) ||
            (userAccessFilter === 'Inactive' && !user.user_access);

        // MFA filter
        const matchesMFA = mfaFilter === 'All' ||
            (mfaFilter === 'Enabled' && user.multi_factor_auth) ||
            (mfaFilter === 'Disabled' && !user.multi_factor_auth);

        return matchesSearch && matchesAccessLevel && matchesUserAccess && matchesMFA;
    });

    return {
        searchTerm,
        setSearchTerm,
        accessLevelFilter,
        setAccessLevelFilter,
        userAccessFilter,
        setUserAccessFilter,
        mfaFilter,
        setMfaFilter,
        filteredUsers,
    };
};

export const useModalState = () => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<PracticeUser | null>(null);

    const openInviteModal = () => setIsInviteModalOpen(true);
    const closeInviteModal = () => setIsInviteModalOpen(false);

    const openEditModal = (user: PracticeUser) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    return {
        isInviteModalOpen,
        isEditModalOpen,
        selectedUser,
        openInviteModal,
        closeInviteModal,
        openEditModal,
        closeEditModal,
    };
};