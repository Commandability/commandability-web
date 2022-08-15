import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth-context";
import { InitialLoadProvider } from "./initial-load-context";

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InitialLoadProvider>{children}</InitialLoadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
