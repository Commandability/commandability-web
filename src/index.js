import React from "react";
import ReactDOM from "react-dom/client";
import AppProviders from "context/app-providers";

import App from "app";
import GlobalStyles from "global-styles.js";
import reportWebVitals from "reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
      <GlobalStyles />
    </AppProviders>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
