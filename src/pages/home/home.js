import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiCheckSquare } from "react-icons/fi";

import HeroImage from "components/hero-image";
import FooterImage from "components/footer-image";
import Card from "components/card";
import ListItem from "components/list-item";
import Pill from "components/pill";
import Spacer from "components/spacer";
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { ReactComponent as UnstyledManageIcon } from "assets/icons/manage-icon.svg";
import { ReactComponent as UnstyledCustomizeIcon } from "assets/icons/customize-icon.svg";
import { ReactComponent as UnstyledReviewIcon } from "assets/icons/review-icon.svg";
import { FiChevronDown } from "react-icons/fi";
import { QUERIES } from "constants.js";

function Home() {
  return (
    <Main>
      <HeroImage>
        <Header>
          <Title>Keep your department safe and accountable</Title>
          <Subtitle>
            Manage your department’s personnel and automatically generate
            incident reports for safety and accountability, all from your
            tablet.
          </Subtitle>
          <ButtonWrapper>
            <Pill onClick={() => {}} theme="light" angle>
              Learn more
            </Pill>
            <Pill onClick={() => {}} theme="dark" angle>
              Get started
            </Pill>
          </ButtonWrapper>
        </Header>
        <DownloadsWrapper>
          <Download href="http://www.google.com">Download for Android</Download>
          <Download href="http://www.google.com">Download for iOS</Download>
        </DownloadsWrapper>
        <ScrollButton>
          <FiChevronDown />
          <VisuallyHidden>Scroll down</VisuallyHidden>
        </ScrollButton>
      </HeroImage>
      <FeaturesWrapper>
        <Feature>
          <ManageIcon />
          <FeatureContent>
            <FeatureHeader style={{ "--color": "var(--color-yellow-1)" }}>
              Manage
            </FeatureHeader>
            <FeatureText>
              Use the Commandability app’s interactive interface to move
              personnel between on-site groups and track the location of all
              personnel throughout an incident. Monitor the time personnel are
              exposed to high risk areas using group alerts.
            </FeatureText>
          </FeatureContent>
        </Feature>
        <Feature>
          <FeatureContent>
            <FeatureHeader style={{ "--color": "var(--color-yellow-2)" }}>
              Customize
            </FeatureHeader>
            <FeatureText>
              Use the Commandability website to configure your department’s
              preferred groups and alert times, as well as to upload your
              deparment’s roster for use during incidents.
            </FeatureText>
          </FeatureContent>
          <CustomizeIcon />
        </Feature>
        <Feature>
          <ReviewIcon />
          <FeatureContent>
            <FeatureHeader style={{ "--color": "var(--color-yellow-3)" }}>
              Review
            </FeatureHeader>
            <FeatureText>
              View auto-generated reports of all in-app events on the
              Commandability website. Reports include timestamped entries of
              personnel movements, group changes, and overdue alerts, as well as
              additional notes about each incident.
            </FeatureText>
          </FeatureContent>
        </Feature>
      </FeaturesWrapper>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 48px;
  padding-left: clamp(24px, 8vw, 160px);
  padding-right: 24px;
  width: clamp(280px, 100%, 1800px);
  max-width: 100%;

  @media (orientation: landscape) and (max-height: 600px) {
    gap: 24px;
  }
`;

const Title = styled.h1`
  text-transform: uppercase;
  color: var(--color-gray-10);
  font-size: clamp(${18 / 16}rem, 2vw + 1rem, ${64 / 16}rem);
  font-weight: normal;
  max-width: 22ch;
  letter-spacing: 0.05em;
`;

const Subtitle = styled.h2`
  color: var(--color-gray-8);
  font-size: clamp(${18 / 16}rem, 0.5vw + 1rem, ${32 / 16}rem);
  font-weight: normal;
  max-width: 48ch;

  @media ${QUERIES.phoneAndSmaller} {
    max-width: 28ch;
  }

  @media (orientation: landscape) and (max-height: 600px) {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const DownloadsWrapper = styled.div`
  position: absolute;
  bottom: 48px;
  left: 48px;
  display: flex;
  gap: 8px 16px;

  @media ${QUERIES.phoneAndSmaller} {
    bottom: 24px;
    left: 24px;
    flex-direction: column;
  }

  @media (orientation: landscape) and (max-height: 600px) {
    bottom: 24px;
    left: 24px;
  }
`;

const ScrollButton = styled(UnstyledButton)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${64 / 16}rem;
  bottom: 92px;
  color: var(--color-gray-10);

  @media ${QUERIES.phoneAndSmaller} {
    font-size: ${48 / 16}rem;
    bottom: calc(24px - 0.2em);
    right: 24px;
    transform: revert;
    left: revert;
  }

  @media (orientation: landscape) and (max-height: 600px) {
    font-size: ${48 / 16}rem;
    bottom: calc(24px - 0.2em);
    right: 24px;
    transform: revert;
    left: revert;
  }
`;

const Download = styled.a`
  color: var(--color-yellow-9);
  text-decoration: none;
`;

const FeaturesWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  background-color: var(--color-gray-10);
  color: var(--color-gray-1);
  padding: 96px 24px;
  padding-bottom: 48px;
`;

const Feature = styled.article`
  display: flex;
  gap: 24px 48px;
  align-items: center;
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FeatureHeader = styled.h2`
  font-size: ${20 / 16}rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color);
`;

const FeatureText = styled.p`
  font-size: ${18 / 16}rem;
  max-width: 64ch;
`;

const ManageIcon = styled(UnstyledManageIcon)`
  fill: var(--color-yellow-9);
  background-color: var(--color-yellow-1);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  min-width: 192px;
  min-height: 192px;
  padding: 48px;

  @media ${QUERIES.phoneAndSmaller} {
    display: none;
  }
`;

const CustomizeIcon = styled(UnstyledCustomizeIcon)`
  fill: var(--color-yellow-9);
  background-color: var(--color-yellow-2);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  min-width: 192px;
  min-height: 192px;
  padding: 48px;

  @media ${QUERIES.phoneAndSmaller} {
    display: none;
  }
`;

const ReviewIcon = styled(UnstyledReviewIcon)`
  fill: var(--color-yellow-9);
  background-color: var(--color-yellow-3);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  min-width: 192px;
  min-height: 192px;
  padding: 48px;

  @media ${QUERIES.phoneAndSmaller} {
    display: none;
  }
`;

const HowItWorks = styled.section`
  display: flex;
  justify-content: center;
  gap: 64px;
  min-height: calc(512px + 96px * 3);
  padding: 96px 24px;
  padding-top: 48px;
  background-color: var(--color-gray-10);

  @media ${QUERIES.laptopAndSmaller} {
    flex-direction: column;
    align-items: center;
    gap: 64px;
    padding: 96px 24px;
    padding-top: 48px;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  list-style: none;
  padding: 48px;
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
  letter-spacing: 0.05em;
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
