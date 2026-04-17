// src/features/permissions/permissions.service.ts
import { localClient } from "../../api/apollo/localClient";
import { GET_PERMISSION_MODULES_MASTER, GET_PRACTICE_PERMISSIONS, UPDATE_PRACTICE_PERMISSIONS } from "../../pages/superadmin/graphql/permissions.queries";
import type { PermissionModuleMaster, PracticeModulePermission, PracticePermissionsData } from "./permissions.types";


class PermissionsService {

    // Get all master modules
    async getMasterModules(): Promise<PermissionModuleMaster[]> {
        const response = await localClient.query({
            query: GET_PERMISSION_MODULES_MASTER,
            fetchPolicy: "cache-first",
        });
        return (response.data as any).practice_permission_modules_master;
    }

    // Get practice permissions
    async getPracticePermissions(practiceId: string): Promise<PracticePermissionsData | null> {
        const response = await localClient.query({
            query: GET_PRACTICE_PERMISSIONS,
            variables: { practiceId },
            fetchPolicy: "network-only",
        });
        return (response.data as any).practice_permissions[0] || null;
    }

    // Update practice permissions
    async updatePracticePermissions(
        practiceId: string,
        permissions: PracticeModulePermission[]
    ): Promise<string> {
        await localClient.mutate({
            mutation: UPDATE_PRACTICE_PERMISSIONS,
            variables: {
                practiceId,
                permissions,
            },
        });
        return "Permissions updated successfully!";
    }
}

export default new PermissionsService();