import * as React from "react";
import { ref } from "firebase/storage";

import { useAuth } from "./auth-context";
import { storage } from "firebase.js";

const StorageUserContext = React.createContext();
StorageUserContext.displayName = "StorageUserContext";

function StorageUserProvider({ children }) {
  const [storageUser, setStorageUser] = React.useState({
    status: "pending",
    path: "",
    error: null,
  });
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user.current) {
      setStorageUser({ status: "pending", path: "", error: null });
      return;
    }

    try {
      setStorageUser({
        status: "resolved",
        path: `users/${user.current?.uid}`,
        error: null,
      });
    } catch (error) {
      setStorageUser({ status: "pending", path: "", error });
    }
  }, [user]);

  const value = {
    storageUser,
    ref: (...args) => ref(storage, ...args),
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
