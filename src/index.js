import React from "react";
import ReactDOM from "react-dom/client";
import { InitialLoadProvider } from "context/initial-load-context";
import { AuthProvider } from "context/auth-context";

import App from "app";
import GlobalStyles from "global-styles.js";
import ScrollbarWidth from "scrollbar-width.js";
import reportWebVitals from "reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <ScrollbarWidth />
    <InitialLoadProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </InitialLoadProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
