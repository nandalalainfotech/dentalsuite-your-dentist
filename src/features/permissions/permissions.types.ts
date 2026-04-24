export interface PracticeModulePermission {
    module: string;
    actions: string[];
}

export interface PracticePermissionsData {
    id: string;
    practice_id: string;
    permissions: PracticeModulePermission[];
    default_permission: PracticeModulePermission[];
    created_at: string;
    updated_at: string;
}

export interface PermissionsState {
    practicePermissions: PracticePermissionsData | null;
    permissions: PracticeModulePermission[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    successMessage: string | null;
}