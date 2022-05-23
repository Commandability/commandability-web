import * as React from "react";
import styled from "styled-components";
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
    <Main>
      <Section>
        <Hero>
          {user.current ? (
            <Button onClick={() => signOut(auth)} theme="light" icon={FiLogOut}>
              Sign out
            </Button>
          ) : (
            <Button
              onClick={() => signInWithEmailAndPassword(auth, "", "")}
              theme="light"
              icon={FiLogIn}
            >
              Sign in
            </Button>
          )}
          <Spacer size={8} axis="vertical" />
          <Pill theme="light" angle>
            Learn more
          </Pill>
          <Spacer size={8} axis="vertical" />
          <Pill theme="dark" angle>
            Get started
          </Pill>
        </Hero>
        <Footer>
          <Pill theme="light" angle>
            Contact us
          </Pill>
        </Footer>
      </Section>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;

const Section = styled.section`
  height: 100%;
`;

export default Home;
