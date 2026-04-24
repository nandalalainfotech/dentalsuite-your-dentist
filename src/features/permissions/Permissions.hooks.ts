import { useCallback, useEffect } from "react";
import {
    fetchPracticePermissions,
    updatePracticePermissions,
    togglePermission,
    clearMessages,
    resetPermissions,
} from "./permissions.slice";
import { useAppDispatch, useAppSelector } from "../../store";
import type { RootState } from "../../store/store";

export const usePermissions = () => {
    const dispatch = useAppDispatch();
    const {
        practicePermissions,
        permissions,
        isLoading,
        isSaving,
        error,
        successMessage,
    } = useAppSelector((state: any) => state.permissions);

    // Load practice permissions
    const loadPracticePermissions = useCallback(
        (practiceId: string) => {
            if (practiceId) {
                dispatch(fetchPracticePermissions(practiceId));
            }
        },
        [dispatch]
    );

    // Reset permissions (when switching clinics)
    const clearPracticePermissions = useCallback(() => {
        dispatch(resetPermissions());
    }, [dispatch]);

    // Save permissions
    const savePermissions = useCallback(
        (practiceId: string) => {
            dispatch(updatePracticePermissions({ practiceId, permissions }));
        },
        [dispatch, permissions]
    );

    // Toggle single permission
    const toggleModulePermission = useCallback(
        (moduleKey: string, actionKey: string) => {
            dispatch(togglePermission({ moduleKey, actionKey }));
        },
        [dispatch]
    );

    // Clear messages
    const resetMessages = useCallback(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    // Check if has permission
    const hasPermission = useCallback(
        (moduleKey: string, actionKey: string): boolean => {
            const module = permissions.find((p: any) => p.module === moduleKey);
            return module?.actions.includes(actionKey) || false;
        },
        [permissions]
    );

    return {
        practicePermissions,
        permissions,
        isLoading,
        isSaving,
        error,
        successMessage,
        loadPracticePermissions,
        clearPracticePermissions,
        savePermissions,
        toggleModulePermission,
        resetMessages,
        hasPermission,
    };
};

export const usePracticePermissions = (practiceId?: string) => {
    const dispatch = useAppDispatch();
    const authPracticeId = useAppSelector((state: RootState) => state.auth.user?.practiceId || state.auth.user?.id);
    const resolvedPracticeId = practiceId || authPracticeId;
    const {
        permissions,
        practicePermissions,
        isLoading,
        error,
    } = useAppSelector((state: RootState) => state.permissions);

    useEffect(() => {
        if (!resolvedPracticeId) return;
        if (isLoading) return;
        if (practicePermissions?.practice_id === resolvedPracticeId) return;

        dispatch(fetchPracticePermissions(resolvedPracticeId));
    }, [dispatch, resolvedPracticeId, practicePermissions?.practice_id, isLoading]);

    const hasPermission = useCallback(
        (moduleKey: string, actionKey: string) => {
            const modulePermission = permissions.find((permission) => permission.module === moduleKey);
            return modulePermission?.actions?.includes(actionKey) ?? false;
        },
        [permissions]
    );

    return {
        practiceId: resolvedPracticeId,
        permissions,
        isLoading,
        error,
        isReady: !resolvedPracticeId || practicePermissions?.practice_id === resolvedPracticeId,
        hasPermission,
        canView: (moduleKey: string) => hasPermission(moduleKey, "view"),
        canCreate: (moduleKey: string) => hasPermission(moduleKey, "create"),
        canEdit: (moduleKey: string) => hasPermission(moduleKey, "edit"),
        canDelete: (moduleKey: string) => hasPermission(moduleKey, "delete"),
    };
};