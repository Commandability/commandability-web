import * as React from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";
import { FiLogOut, FiLogIn } from "react-icons/fi";

import Hero from "components/hero";
import Footer from "components/footer";
import Pill from "components/pill";
import { useAuth } from "context/auth-context";
import Button from "components/button";
import Spacer from "components/spacer";

function Home() {
  const [user] = useAuth();

  return (
    <>
      <Hero>
        {user.current ? (
          <Button onClick={() => signOut(auth)} variant="light" icon={FiLogOut}>
            Sign out
          </Button>
        ) : (
          <Button
            onClick={() => signInWithEmailAndPassword(auth, "", "")}
            variant="light"
            icon={FiLogIn}
          >
            Sign in
          </Button>
        )}
        <Spacer size={8} axis="vertical" />
        <Pill variant="light" angle>
          Learn more
        </Pill>
        <Spacer size={8} axis="vertical" />
        <Pill variant="dark" angle>
          Get started
        </Pill>
      </Hero>
      <Footer>
        <Pill variant={"light"} angle>
          Contact us
        </Pill>
      </Footer>
    </>
  );
}

export default Home;
