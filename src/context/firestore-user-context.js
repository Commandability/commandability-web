import * as React from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

import { useAuth } from "./auth-context";
import { db } from "firebase.js";

const FirestoreUserContext = React.createContext();
FirestoreUserContext.displayName = "FirestoreUserContext";

function FirestoreUserProvider({ children }) {
  const [firestoreUser, setFirestoreUser] = React.useState({
    status: "pending",
    data: null,
    error: null,
  });
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user.current) return;
    const unsubscribe = onSnapshot(
      doc(db, "users", user.current.uid),
      { includeMetadataChanges: true },
      (doc) => {
        if (!doc.hasPendingWrites) {
          setFirestoreUser({
            status: "resolved",
            data: doc.data(),
            error: null,
          });
        } else {
          setFirestoreUser({
            status: "pending",
            data: doc.data(),
            error: null,
          });
        }
      },
      (error) => {
        setFirestoreUser({ status: "rejected", data: null, error });
      }
    );
    return () => unsubscribe();
  }, [user]);

  const value = {
    firestoreUser,
    updateFirestoreUserData: async (...args) => {
      await setDoc(doc(db, "users", user.current.uid), ...args);
    },
  };

  if (firestoreUser.status === "pending") {
    return (
      <FirestoreUserContext.Provider value={value}>
        {children}
      </FirestoreUserContext.Provider>
    );
  }

  if (firestoreUser.status === "rejected") {
    throw new Error(firestoreUser.error);
  }

  if (firestoreUser.status === "resolved") {
    return (
      <FirestoreUserContext.Provider value={value}>
        {children}
      </FirestoreUserContext.Provider>
    );
  }
}

function useFirestoreUser() {
  const context = React.useContext(FirestoreUserContext);
  if (context === undefined) {
    throw new Error(
      `useFirestoreUser must be used within a FirestoreUserProvider`
    );
  }
  return context;
}

export { FirestoreUserProvider, useFirestoreUser };
