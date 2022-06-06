import * as React from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "firebase.js";
import { Link } from "react-router-dom";
import { FiLogOut, FiLogIn, FiCheckSquare } from "react-icons/fi";

import HeroImage from "components/hero-image";
import FooterImage from "components/footer-image";
import Card from "components/card";
import ListItem from "components/list-item";
import { useAuth } from "context/auth-context";
import Button from "components/button";
import Pill from "components/pill";
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
          <Pill onClick={() => {}} theme="light" angle>
            Learn more
          </Pill>
          <Spacer size={8} axis="vertical" />
          <Pill onClick={() => {}} theme="dark" angle>
            Get started
          </Pill>
        </Header>
      </HeroImage>
      <HowItWorks>
        <StepOne
          subheader="Step 1"
          header="Setup an account"
          backgroundColor="var(--color-red-3)"
        >
          <UnorderedList>
            <ListItem icon={FiCheckSquare}>
              Create an account on the Commandability website homepage
            </ListItem>
            <ListItem icon={FiCheckSquare}>
              Add or import personnel on the website roster page
            </ListItem>
            <ListItem icon={FiCheckSquare}>
              Configure group names and alerts on the website groups page
            </ListItem>
          </UnorderedList>
        </StepOne>
        <StepTwo
          subheader="Step 2"
          header="Take control of incidents"
          backgroundColor="var(--color-red-2)"
        >
          <UnorderedList>
            <ListItem icon={FiCheckSquare}>
              Download the Commandability app on your tablet device
            </ListItem>
            <ListItem icon={FiCheckSquare}>
              Sign in and update to load your department’s data, then start an
              incident
            </ListItem>
            <ListItem icon={FiCheckSquare}>
              Customize your groups to match the incident, and begin managing
              on-site personnel in real time
            </ListItem>
          </UnorderedList>
        </StepTwo>
        <StepThree
          subheader="Step 3"
          header="Stay accountable"
          backgroundColor="var(--color-red-1)"
        >
          <UnorderedList>
            <ListItem icon={FiCheckSquare}>
              After the incident, enter the incident location and any additional
              notes
            </ListItem>
            <ListItem icon={FiCheckSquare}>
              Upload the report to your Commandability account
            </ListItem>
            <ListItem icon={FiCheckSquare}>
              Review all uploaded reports on the Commandability website
            </ListItem>
          </UnorderedList>
        </StepThree>
      </HowItWorks>
      <FooterImage>
        <Footer>
          <Contact>
            <QuestionText>Have questions?</QuestionText>
            <MessageText>Send us a message</MessageText>
            <Spacer size={32} axis="vertical" />
            <Pill
              theme="light"
              angle
              href={"mailto:support@commandability.app?"}
            >
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

const HowItWorks = styled.section`
  display: flex;
  justify-content: center;
  gap: 72px;
  min-height: calc(512px + 72px * 3);
  padding: 72px 24px;
  background-color: var(--color-gray-10);

  @media ${QUERIES.laptopAndSmaller} {
    flex-direction: column;
    align-items: center;
    gap: 36px;
    padding: 36px;
  }
`;

const StepOne = styled(Card)`
  align-self: flex-start;

  @media ${QUERIES.phoneAndSmaller} {
    align-self: center;
  }
`;

const StepTwo = styled(Card)`
  align-self: center;
`;

const StepThree = styled(Card)`
  align-self: flex-end;

  @media ${QUERIES.phoneAndSmaller} {
    align-self: center;
  }
`;

const UnorderedList = styled.ul`
  list-style: none;
  flex: 1;
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
