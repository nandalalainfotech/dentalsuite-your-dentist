import { localClient } from '../../api/apollo/localClient';
import {
    GET_ACCOUNTS_BY_PRACTICE_QUERY,
    UPDATE_ACCOUNT_MUTATION,
    DELETE_ACCOUNT_MUTATION,
    INVITE_ACCOUNT_MUTATION
} from '../../pages/practice/useraccount/graphql/PracticeUserAccount.query';
import type { GraphQLAccount, UpdateUserData, InviteUserData } from './PracticeUserAccount.types';

// Service functions
export const PracticeUserAccountService = {
    async fetchUsers(practiceId: string): Promise<GraphQLAccount[]> {
        try {
            const response = await localClient.query({
                query: GET_ACCOUNTS_BY_PRACTICE_QUERY,
                variables: { practiceId },
                fetchPolicy: "network-only",
            });

            const accounts = (response.data as any)?.accounts || [];

            if (!accounts) {
                throw new Error("Accounts not found");
            }

            return accounts;
        } catch (error: any) {
            throw new Error(error.message || "Failed to load users");
        }
    },

    async updateUser(data: UpdateUserData): Promise<any> {
        try {
            const response = await localClient.mutate({
                mutation: UPDATE_ACCOUNT_MUTATION,
                variables: {
                    id: data.id,
                    type: data.access_level, // Map access_level to type
                    status: data.user_access ? 'ACTIVE' : 'INACTIVE', // Map user_access to status
                    first_name: data.first_name,
                    last_name: data.last_name,
                    mobile: data.mobile,
                },
            });
            return (response.data as any).update_accounts_by_pk;
        } catch (error: any) {
            throw new Error(error.message || "Failed to update user");
        }
    },

    async deleteUser(id: string): Promise<string> {
        try {
            await localClient.mutate({
                mutation: DELETE_ACCOUNT_MUTATION,
                variables: { id },
            });
            return id;
        } catch (error: any) {
            throw new Error(error.message || "Failed to delete user");
        }
    },

    async inviteUser(data: InviteUserData): Promise<any> {

        console.log("data================>", data);

        try {
            // Validate password is provided
            if (!data.password) {
                throw new Error("Password is required");
            }

            console.log("Invite user data:", {
                email: data.email,
                password: "***", // Don't log actual password in production
                hasPassword: !!data.password,
                practice_id: data.practice_id,
                type: data.type || 'Dashboard and Sidebar',
                status: data.status || 'ACTIVE',
                first_name: data.first_name,
                last_name: data.last_name,
            });

            const response = await localClient.mutate({
                mutation: INVITE_ACCOUNT_MUTATION,
                variables: {
                    email: data.email,
                    password: data.password,
                    practice_id: data.practice_id,
                    type: data.type || 'Dashboard and Sidebar',
                    status: data.status || 'ACTIVE',
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    mobile: data.mobile || '',
                },
            });

            console.log("Invite response====================>", response.data);
            return (response.data as any).insert_accounts_one;
        } catch (error: any) {
            console.error("Full invite user error:", error);
            throw new Error(error.message || "Failed to invite user");
        }
    }
};