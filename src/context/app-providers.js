import * as React from "react";
import { AuthProvider } from "./auth-context";
import { FirestoreUserProvider } from "./firestore-user-context";
import { StorageUserProvider } from "./storage-user-context";
import { InitialLoadProvider } from "./initial-load-context";

function AppProviders({ children }) {
  return (
    <InitialLoadProvider>
      <AuthProvider>
        <StorageUserProvider>
          <FirestoreUserProvider>{children}</FirestoreUserProvider>
        </StorageUserProvider>
      </AuthProvider>
    </InitialLoadProvider>
  );
}

export default AppProviders;
