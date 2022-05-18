import * as React from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";

import Hero from "components/hero";
import Footer from "components/footer";
import { useAuth } from "context/auth-context";

function Home() {
  const [user] = useAuth();

  return (
    <>
      <Hero>
        <div>Home</div>
        {user.current ? (
          <button onClick={() => signOut(auth)}>Sign out</button>
        ) : (
          <button onClick={() => signInWithEmailAndPassword(auth, "", "")}>
            Sign in
          </button>
        )}
      </Hero>
      <Footer />
    </>
  );
}

export default Home;
