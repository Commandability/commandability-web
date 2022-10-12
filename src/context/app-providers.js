import * as React from "react";
import { AuthProvider } from "./auth-context";
import { FirestoreUserProvider } from "./firestore-user-context";
import { InitialLoadProvider } from "./initial-load-context";

function AppProviders({ children }) {
  return (
    <InitialLoadProvider>
      <AuthProvider>
        <FirestoreUserProvider>{children}</FirestoreUserProvider>
      </AuthProvider>
    </InitialLoadProvider>
  );
}

export default AppProviders;
