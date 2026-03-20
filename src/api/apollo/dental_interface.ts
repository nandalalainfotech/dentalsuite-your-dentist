import { createApolloClient } from "../apolloClient";

export const interfaceClient = createApolloClient({
    httpUrl: import.meta.env.VITE_INTERFACE_HTTP_URL,
    enableSubscriptions: false,
    useAdminSecret: false,
});