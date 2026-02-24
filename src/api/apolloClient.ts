/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface CreateApolloClientOptions {
  httpUrl: string;
  wsUrl?: string;
  enableSubscriptions?: boolean;
}

export function createApolloClient({
  httpUrl,
  wsUrl,
  enableSubscriptions = false,
}: CreateApolloClientOptions) {
  /* ==============================
     HTTP LINK
  ============================== */
  const httpLink = new HttpLink({
    uri: httpUrl,
  });

  /* ==============================
     AUTH LINK
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

  let link = errorLink.concat(authLink.concat(httpLink));

  /* ==============================
     SUBSCRIPTIONS (OPTIONAL)
  ============================== */
  if (enableSubscriptions && wsUrl) {
    const wsClient = createClient({
      url: wsUrl,
      lazy: true,
      retryAttempts: 5,
      connectionParams: () => {
        const token = localStorage.getItem("accessToken");
        return token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
      },
    });

    const wsLink = new GraphQLWsLink(wsClient);

    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      link
    );
  }

  /* ==============================
     APOLLO CLIENT
  ============================== */
  return new ApolloClient({
    link,
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
}