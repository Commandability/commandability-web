import * as React from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

import { auth } from "firebase-config";
import FireLoader from "@components/fire-loader";

type User = {
  status: "pending" | "resolved";
  current: FirebaseUser | null;
};

type Auth = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>> | null;
};

const initialUser: User = {
  status: "pending",
  current: null,
};

const initialAuth: Auth = {
  user: initialUser,
  setUser: null,
};

const AuthContext = React.createContext(initialAuth);
AuthContext.displayName = "AuthContext";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(initialUser);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser({ status: "resolved", current: user });
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    auth,
  };

  if (user.status === "pending") {
    return <FireLoader />;
  }

  if (user.status === "resolved") {
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
