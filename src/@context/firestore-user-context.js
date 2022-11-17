import * as React from "react";
import { doc, onSnapshot } from "firebase/firestore";

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
  const [userRef, setUserRef] = React.useState(null);
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user.current) {
      setUserRef(null);
      return;
    }

    setUserRef(doc(db, "users", user.current?.uid));
  }, [user]);

  React.useEffect(() => {
    if (!userRef) return;

    const unsubscribe = onSnapshot(
      userRef,
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
  }, [userRef]);

  const value = {
    firestoreUser,
    userRef,
  };

  if (firestoreUser.status === "rejected") {
    throw new Error(firestoreUser.error);
  }

  if (
    firestoreUser.status === "pending" ||
    firestoreUser.status === "resolved"
  ) {
    return (
      <FirestoreUserContext.Provider value={value}>
        {children}
      </FirestoreUserContext.Provider>
    );
  }

  throw new Error(`Unhandled authentication status: ${user.status}`);
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
