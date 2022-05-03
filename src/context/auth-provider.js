import * as React from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "firebase.js";

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const value = [currentUser];
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
