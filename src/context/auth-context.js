import * as React from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "firebase.js";
import FireLoader from "components/fire-loader";

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = React.useState({
    status: "pending",
    current: null,
    error: null,
  });

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser({ status: "resolved", current: user, error: null });
      },
      (error) => {
        setUser({ status: "rejected", current: null, error });
      }
    );
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    createUserWithEmailAndPassword: (...args) =>
      createUserWithEmailAndPassword(auth, ...args),
    signInWithEmailAndPassword: (...args) =>
      signInWithEmailAndPassword(auth, ...args),
    signOut: () => signOut(auth),
  };

  if (user.status === "pending") {
    return <FireLoader />;
  }

  if (user.status === "rejected") {
    throw new Error(user.error);
  }

  if (user.status === "resolved") {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  throw new Error(`Unhandled authentication status: ${user.status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
