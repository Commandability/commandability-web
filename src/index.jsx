import React from "react";
import ReactDOM from "react-dom/client";
import { InitialLoadProvider } from "@context/initial-load-context";
import { AuthProvider } from "@context/auth-context";

import App from "app";
import GlobalStyles from "global-styles.jsx";
import ScrollbarWidth from "scrollbar-width.jsx";
import * as Toast from "@components/toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <ScrollbarWidth />
    <InitialLoadProvider>
      <AuthProvider>
        <Toast.Provider>
          <App />
        </Toast.Provider>
      </AuthProvider>
    </InitialLoadProvider>
  </React.StrictMode>
);
