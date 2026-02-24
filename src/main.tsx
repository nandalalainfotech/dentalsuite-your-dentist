import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App.tsx";
import "./index.css";
import 'animate.css';

import { BrowserRouter } from "react-router-dom";
import { PracticeAuthProvider } from "./hooks/usePracticeAuth.tsx";
import { apolloClient } from "./api/apolloClient.ts";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <PracticeAuthProvider>
          <App />
        </PracticeAuthProvider>
      </ApolloProvider>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

