import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import 'animate.css';

import { BrowserRouter } from "react-router-dom";
import { PracticeAuthProvider } from "./hooks/usePracticeAuth.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PracticeAuthProvider>
          <App />
        </PracticeAuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

