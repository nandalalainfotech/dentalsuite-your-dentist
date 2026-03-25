import type { Table } from "./constant/tables";
import { INSERT, UPDATE } from "./graphql/graphql";


const GRAPHQL_URL = 'http://localhost:8080/v1/graphql';

const request = async (query: string, variables: any) => {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': 'myadminsecret',
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};


export const insertData = async (
  table: Table,
  fields: Record<string, any>
) => {
  const query = INSERT(table);
  return await request(query, { fields });
};


export const updateData = async (
  table: Table,
  id: string,
  fields: Record<string, any>
) => {
  const query = UPDATE(table);
  return await request(query, { id, fields });
};