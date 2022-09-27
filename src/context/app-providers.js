import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth-context";
import { InitialLoadProvider } from "./initial-load-context";
import { FirestoreUserProvider } from "./firestore-user-context";

function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FirestoreUserProvider>
          <InitialLoadProvider>{children}</InitialLoadProvider>
        </FirestoreUserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
