import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

/* ==============================
   HTTP LINK
============================== */
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_HTTP_URL,
});

/* ==============================
   AUTH LINK (like Angular)
============================== */
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/* ==============================
   ERROR LINK
============================== */
const errorLink = onError((error) => {
  const { graphQLErrors, networkError, operation } = error as any;

  if (graphQLErrors?.length) {
    graphQLErrors.forEach((err: any) => {
      console.error("🔴 GraphQL Error:", {
        message: err.message,
        path: err.path,
        locations: err.locations,
        operation: operation?.operationName,
      });
    });
  }

  if (networkError) {
    console.error("🔴 Network Error:", networkError);
  }
});

/* ==============================
   WS CLIENT (graphql-ws)
============================== */
const wsClient = createClient({
  url: import.meta.env.VITE_HASURA_WS_URL,
  lazy: true,
  retryAttempts: 5,
  connectionParams: () => {
    const token = localStorage.getItem("accessToken");

    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  },
});

/* ==============================
   WS LINK
============================== */
const wsLink = new GraphQLWsLink(wsClient);

/* ==============================
   SPLIT (Subscription vs Others)
============================== */
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,                       // Subscriptions
  errorLink.concat(authLink.concat(httpLink)) // Queries + Mutations
);

/* ==============================
   APOLLO CLIENT
============================== */
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export { wsClient };