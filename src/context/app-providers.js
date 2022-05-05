import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth-context";

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
