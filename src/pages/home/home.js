import * as React from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";
import { FiLogOut, FiLogIn } from "react-icons/fi";

import Hero from "components/hero";
import Footer from "components/footer";
import Pill from "components/pill";
import HowTo from "components/how-to";
import { useAuth } from "context/auth-context";
import Button from "components/button";
import Spacer from "components/spacer";
import { QUERIES } from "constants.js";

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
        <HowToSection>
          <HowToWrapper>
            <HowTo step="1" heading="Setup an account">
              Create an account on the Commandability website homepage. Add or
              import personnel on the website roster page. Configure group names
              and alerts on the website groups page
            </HowTo>
          </HowToWrapper>
          <HowToWrapper>
            <Spacer size={48} axis="vertical" />
            <HowTo step="2" heading="Take control of incidents">
              Download the Commandability app on your tablet device. Sign in and
              update to load your department’s data, then start an incident.
              Customize your groups to match the incident, and begin managing
              on-site personnel in real time
            </HowTo>
          </HowToWrapper>

          <HowToWrapper>
            <Spacer size={96} axis="vertical" />
            <HowTo step="3" heading="Stay accountable">
              After the incident, enter the incident location and any additional
              notes. Upload the report to your Commandability account. Review
              all uploaded reports on the Commandability website
            </HowTo>
          </HowToWrapper>
        </HowToSection>
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

const HowToSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 72px;
  padding: 72px 24px;
  @media ${QUERIES.laptopAndSmaller} {
    flex-direction: column;
    align-items: center;
    gap: 36px;
    padding: 36px 16px;
  }
`;

const HowToWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media ${QUERIES.laptopAndSmaller} {
    flex-direction: row;
  }
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
