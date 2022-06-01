import * as React from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";
import { Link } from "react-router-dom";
import { FiLogOut, FiLogIn } from "react-icons/fi";

import HeroImage from "components/hero-image";
import FooterImage from "components/footer-image";
import Pill from "components/pill";
import HowTo from "components/how-to";
import { useAuth } from "context/auth-context";
import Button from "components/button";
import Spacer from "components/spacer";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";

function Home() {
  const [user] = useAuth();

  return (
    <Main>
      <HeroImage>
        <Header>
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
        </Header>
      </HeroImage>
      <HowToSection>
        <HowToWrapper>
          <HowTo step="1" heading="Setup an account">
            Create an account on the Commandability website homepage. Add or
            import personnel on the website roster page. Configure group names
            and alerts on the website groups page.
          </HowTo>
        </HowToWrapper>
        <HowToWrapper>
          <Spacer size={48} axis="vertical" />
          <HowTo step="2" heading="Take control of incidents">
            Download the Commandability app on your tablet device. Sign in and
            update to load your department’s data, then start an incident.
            Customize your groups to match the incident, and begin managing
            on-site personnel in real time.
          </HowTo>
        </HowToWrapper>

        <HowToWrapper>
          <Spacer size={96} axis="vertical" />
          <HowTo step="3" heading="Stay accountable">
            After the incident, enter the incident location and any additional
            notes. Upload the report to your Commandability account. Review all
            uploaded reports on the Commandability website.
          </HowTo>
        </HowToWrapper>
      </HowToSection>
      <FooterImage>
        <Footer>
          <Contact>
            <QuestionText>Have questions?</QuestionText>
            <MessageText>Send us a message</MessageText>
            <Spacer size={32} axis="vertical" />
            <Pill theme="light" angle>
              Contact us
            </Pill>
          </Contact>
          <Legal>
            <Copyright>
              <FireIcon />
              Copyright © {new Date().getFullYear()} Commandability
            </Copyright>
            <Policies>
              <Policy to="/privacy-policy">Privacy Policy</Policy>
              <Policy to="/terms-of-service">Terms of Service</Policy>
            </Policies>
          </Legal>
        </Footer>
      </FooterImage>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
`;

const Header = styled.header`
  height: 100%;
`;

const HowToSection = styled.section`
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

const Footer = styled.footer`
  display: grid;
  place-content: center;
  height: 100%;
`;

const Contact = styled.div`
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

const Legal = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px 64px;
  padding: 24px;
`;

const Copyright = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${14 / 16}rem;
  color: var(--color-gray-7);
`;

const Policies = styled.div`
  display: flex;
  gap: 16px;
`;

const Policy = styled(Link)`
  font-size: ${14 / 16}rem;
  color: var(--color-gray-7);
`;

const FireIcon = styled(UnstyledFireIcon)`
  fill: var(--color-yellow-9);
`;

export default Home;
