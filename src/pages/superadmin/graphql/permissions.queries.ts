// src/features/permissions/graphql/permissions.queries.ts
import { gql } from "@apollo/client";

// Get all master modules
export const GET_PERMISSION_MODULES_MASTER = gql`
  query GetPermissionModulesMaster {
    practice_permission_modules_master(
      where: { is_active: { _eq: true } }
      order_by: { display_order: asc }
    ) {
      id
      module_name
      module_key
      actions
      description
      display_order
      is_active
      path
    }
  }
`;

// Get practice permissions
export const GET_PRACTICE_PERMISSIONS = gql`
  query GetPracticePermissions($practiceId: uuid!) {
    practice_permissions(where: { practice_id: { _eq: $practiceId } }) {
      id
      practice_id
      permissions
      created_at
      updated_at
    }
  }
`;

// Update practice permissions
export const UPDATE_PRACTICE_PERMISSIONS = gql`
  mutation UpdatePracticePermissions($practiceId: uuid!, $permissions: jsonb!) {
    insert_practice_permissions(
      objects: {
        practice_id: $practiceId
        permissions: $permissions
      }
      on_conflict: {
        constraint: unique_practice_permissions
        update_columns: [permissions, updated_at]
      }
    ) {
      affected_rows
      returning {
        id
        permissions
        updated_at
      }
    }
  }
`;