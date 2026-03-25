export const INSERT = (table: string) => `
  mutation insertRecord($fields: ${table}_insert_input!) {
    insert_${table}_one(object: $fields) {
      id
    }
  }
`;

export const UPDATE = (table: string) => `
  mutation updateRecord($id: uuid!, $fields: ${table}_set_input!) {
    update_${table}_by_pk(pk_columns: { id: $id }, _set: $fields) {
      id
    }
  }
`;