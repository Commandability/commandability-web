import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "firebase.js";
import Spinner from "components/spinner";

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = React.useState({
    status: "pending",
    current: null,
    error: null,
  });

  React.useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        setUser({ status: "resolved", current: user, error: null });
      },
      (error) => {
        setUser({ status: "rejected", current: null, error });
      }
    );
  }, []);

  const value = [user];

  if (user.status === "pending") {
    return <Spinner />;
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
