import * as React from "react";
import { ref } from "firebase/storage";

import { useAuth } from "./auth-context";
import { storage } from "firebase.js";

const StorageUserContext = React.createContext();
StorageUserContext.displayName = "StorageUserContext";

function StorageUserProvider({ children }) {
  const [storageUser, setStorageUser] = React.useState({
    status: "pending",
    userRef: null,
    error: null,
  });
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user.current) {
      setStorageUser({ status: "pending", userRef: null, error: null });
      return;
    }

    try {
      setStorageUser({
        status: "resolved",
        userRef: ref(storage, `users/${user.current?.uid}`),
        error: null,
      });
    } catch (error) {
      setStorageUser({ status: "pending", userRef: null, error });
    }
  }, [user]);

  const value = {
    storageUser,
  };

  return (
    <StorageUserContext.Provider value={value}>
      {children}
    </StorageUserContext.Provider>
  );
}

function useStorageUser() {
  const context = React.useContext(StorageUserContext);
  if (context === undefined) {
    throw new Error(`useStorageUser must be used within a StorageUserProvider`);
  }
  return context;
}

export { StorageUserProvider, useStorageUser };
