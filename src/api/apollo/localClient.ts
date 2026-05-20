import { createApolloClient } from "../apolloClient";

export const localClient = createApolloClient({
  httpUrl: "https://leading-hen-46.hasura.app/v1/graphql",
  useAdminSecret: true,
});