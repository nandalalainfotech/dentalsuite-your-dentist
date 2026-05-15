import { gql } from '@apollo/client';

// Query to fetch accounts by practice_id
export const GET_ACCOUNTS_BY_PRACTICE_QUERY = gql`
    query GetAccountsByPractice($practiceId: uuid) {
        accounts(where: { practice_id: { _eq: $practiceId } }) {
            id
            email
            type
            status
            address
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

export const DELETE_ACCOUNT_MUTATION = gql`
    mutation DeleteAccount($id: uuid!) {

        delete_practice_permissions(
            where: {
                practice_id: {
                    _eq: $id
                }
            }
        ) {
            affected_rows
        }

        delete_accounts_by_pk(id: $id) {
            id
        }
    }
`;
