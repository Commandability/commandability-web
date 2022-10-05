import * as React from "react";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

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

  let userRef;
  if (user.current) userRef = doc(db, "users", user.current?.uid);

  React.useEffect(() => {
    if (!user.current) return;

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
  }, [user, userRef]);

  const value = {
    firestoreUser,
    setFirestoreUserDoc: async (...args) => {
      await setDoc(userRef, ...args);
    },
    updateFirestoreUserDoc: async (...args) => {
      await updateDoc(userRef, ...args);
    },
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
