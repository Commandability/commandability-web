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
          <FooterBody>
            <QuestionText>Have questions?</QuestionText>
            <MessageText>Send us a message</MessageText>
            <Spacer size={48} axis="vertical" />
            <PillWrapper>
              <Pill theme="light" angle>
                Contact us
              </Pill>
            </PillWrapper>
          </FooterBody>
          <FooterLinks>
            <Copyright>Copyright © 2022 Commandability</Copyright>
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

const FooterBody = styled.div`
  position: relative;
  width: fit-content;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
  @media (max-width: 580px) {
    width: 15rem;
  }
`;

const QuestionText = styled.p`
  color: var(--color-yellow-9);
  font-size: 1.5rem;
  font-weight: bold;
`;

const MessageText = styled.p`
  color: var(--color-gray-10);
  font-size: 3rem;
  text-transform: uppercase;
`;

const PillWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const FooterLinks = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Copyright = styled.div`
  flex: 1;
  padding: 24px;
  color: var(--color-gray-10);
`;

const PrivacyPolicy = styled.a`
  flex: 1;
  padding: 24px;
  color: var(--color-gray-10);
  text-align: right;
`;

const Section = styled.section`
  height: 100%;
`;

export default Home;
