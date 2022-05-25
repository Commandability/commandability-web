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
          <FooterWrapper>
            <FooterBody>
              <QuestionText>Have questions?</QuestionText>
              <MessageText>Send us a message</MessageText>
              <Spacer size={32} axis="vertical" />
              <Pill theme="light" angle>
                Contact us
              </Pill>
            </FooterBody>
          </FooterWrapper>
          <FooterLinks>
            <Copyright>Copyright © 2022 Commandability</Copyright>
            <FooterFlex />
            <PrivacyPolicy>Privacy Policy</PrivacyPolicy>
          </FooterLinks>
        </Footer>
      </Section>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* padding: 24px; */
`;

const FooterBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionText = styled.p`
  color: var(--color-yellow-9);
  font-size: clamp(1rem, 1vw + 1rem, 2rem);
  font-weight: bold;
  align-self: flex-start;
`;

const MessageText = styled.p`
  color: var(--color-gray-10);
  font-size: clamp(1rem, 2vw + 1rem, 3rem);
  text-transform: uppercase;
`;

const FooterLinks = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Copyright = styled.div`
  font-size: 0.875rem;
  padding: 24px;
  color: var(--color-gray-7);
`;

const PrivacyPolicy = styled.a`
  font-size: 0.875rem;
  padding: 24px;
  color: var(--color-gray-7);
`;

const FooterFlex = styled.div`
  flex: 1;
`;

const Section = styled.section`
  height: 100%;
`;

export default Home;
