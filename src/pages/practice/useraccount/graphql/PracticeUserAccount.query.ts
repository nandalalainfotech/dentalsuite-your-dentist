import { gql } from '@apollo/client';

// Query to fetch accounts by practice_id
export const GET_ACCOUNTS_BY_PRACTICE_QUERY = gql`
    query GetAccountsByPractice($practiceId: uuid) {
        accounts(where: { practice_id: { _eq: $practiceId } }) {
            id
            email
            type
            status
            practice_name
            abn_number
            practice_type
            practice_phone
            address
            city
            state
            postcode
            first_name
            last_name
            mobile
            practice_id
            created_at
            updated_at
        }
    }
`;

// Query to fetch a single account
export const GET_ACCOUNT_QUERY = gql`
    query GetAccount($id: uuid!) {
        accounts_by_pk(id: $id) {
            id
            email
            type
            status
            practice_name
            abn_number
            practice_type
            practice_phone
            address
            city
            state
            postcode
            first_name
            last_name
            mobile
            practice_id
            created_at
            updated_at
        }
    }
`;

// Mutation to invite/create a new account
export const INVITE_ACCOUNT_MUTATION = gql`
    mutation InviteAccount(
        $email: String!, 
        $password: String!,  # Remove ? to make it required
        $type: String, 
        $status: String, 
        $practice_id: uuid, 
        $first_name: String, 
        $last_name: String, 
        $mobile: String
    ) {
        insert_accounts_one(object: {
            email: $email,
            password: $password,
            type: $type,
            status: $status,
            practice_id: $practice_id,
            first_name: $first_name,
            last_name: $last_name,
            mobile: $mobile
        }) {
            id
            email
            type
            status
            practice_id
            first_name
            last_name
            mobile
            created_at
            updated_at
        }
    }
`;

// Mutation to update an account
export const UPDATE_ACCOUNT_MUTATION = gql`
    mutation UpdateAccount($id: uuid!, $type: String, $status: String, $first_name: String, $last_name: String, $mobile: String) {
        update_accounts_by_pk(pk_columns: {id: $id}, _set: {
            type: $type,
            status: $status,
            first_name: $first_name,
            last_name: $last_name,
            mobile: $mobile
        }) {
            id
            email
            type
            status
            first_name
            last_name
            mobile
            updated_at
        }
    }
`;

// Mutation to delete an account
export const DELETE_ACCOUNT_MUTATION = gql`
    mutation DeleteAccount($id: uuid!) {
        delete_accounts_by_pk(id: $id) {
            id
        }
    }
`;

// Keep old queries for backward compatibility (you can remove if not needed)
export const GET_PRACTICE_USERS_QUERY = GET_ACCOUNTS_BY_PRACTICE_QUERY;
export const UPDATE_USER_ACCESS_MUTATION = UPDATE_ACCOUNT_MUTATION;
export const DELETE_USER_MUTATION = DELETE_ACCOUNT_MUTATION;
export const INVITE_USER_MUTATION = INVITE_ACCOUNT_MUTATION;