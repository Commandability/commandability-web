import * as React from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";

import { useAuth } from "context/auth-context";

function Home() {
  const [user] = useAuth();

  return (
    <div>
      <div>Home</div>
      {user.current ? (
        <button onClick={() => signOut(auth)}>Sign out</button>
      ) : (
        <button onClick={() => signInWithEmailAndPassword(auth, "", "")}>
          Sign in
        </button>
      )}
    </div>
  );
}

export default Home;
