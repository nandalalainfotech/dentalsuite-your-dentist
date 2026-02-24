import { createApolloClient } from "../apolloClient";

export const dentalsuiteClient = createApolloClient({
    httpUrl: import.meta.env.VITE_SUITE_HTTP_URL,
    wsUrl: import.meta.env.VITE_SUITE_WS_URL,
    enableSubscriptions: true,
});