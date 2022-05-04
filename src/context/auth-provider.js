import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "firebase.js";

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
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
