import { createApolloClient } from "../apolloClient";

export const localClient = createApolloClient({
  httpUrl: "http://localhost:8080/v1/graphql",
  useAdminSecret: true,
});