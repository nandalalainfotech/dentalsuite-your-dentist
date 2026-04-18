// src/features/permissions/hooks/usePermissions.ts
import { useCallback, useEffect } from "react";

import {
    fetchMasterModules,
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
        masterModules,
        permissions,
        isLoading,
        isSaving,
        error,
        successMessage,
    } = useAppSelector((state: any) => state.permissions);

    // Load all data
    const loadData = useCallback(() => {
        dispatch(fetchMasterModules());
    }, [dispatch]);

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

    // Get permission matrix for UI
    const getPermissionMatrix = useCallback(() => {
        const matrix: Record<string, Record<string, boolean>> = {};
        masterModules.forEach((module: { module_key: string; actions: any[]; }) => {
            matrix[module.module_key] = {};
            module.actions.forEach((action) => {
                matrix[module.module_key][action] = hasPermission(module.module_key, action);
            });
        });
        return matrix;
    }, [masterModules, hasPermission]);

    return {
        masterModules,
        permissions,
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
        getPermissionMatrix,
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
