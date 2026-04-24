import { localClient } from "../../api/apollo/localClient";
import { CREATE_PRACTICE_PERMISSIONS, GET_PRACTICE_PERMISSIONS, UPDATE_PRACTICE_PERMISSIONS } from "../../pages/superadmin/graphql/permissions.queries";
import type { PracticeModulePermission, PracticePermissionsData } from "./permissions.types";

class PermissionsService {
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

    async createPracticePermissions(
        practiceId: string,
        permissions: PracticeModulePermission[],
        defaultPermission: PracticeModulePermission[]
    ): Promise<string> {
        await localClient.mutate({
            mutation: CREATE_PRACTICE_PERMISSIONS,
            variables: {
                practiceId,
                permissions,
                defaultPermission,
            },
        });
        return "Practice permissions created successfully!";
    }
}

export default new PermissionsService();