// src/features/permissions/permissions.types.ts

export interface PermissionModuleMaster {
    id: string;
    module_name: string;
    module_key: string;
    actions: string[];
    description: string;
    display_order: number;
    is_active: boolean;
}

export interface PracticeModulePermission {
    module: string;
    actions: string[];
}

export interface PracticePermissionsData {
    id: string;
    practice_id: string;
    permissions: PracticeModulePermission[];
    created_at: string;
    updated_at: string;
}

export interface PermissionsState {
    masterModules: PermissionModuleMaster[];
    practicePermissions: PracticePermissionsData | null;
    permissions: PracticeModulePermission[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    successMessage: string | null;
}