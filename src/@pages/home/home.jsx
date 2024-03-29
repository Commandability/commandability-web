import * as React from "react";
import styled, { keyframes } from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { FiCheckSquare } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

import { useAuth } from "@context/auth-context";
import { useInitialLoad } from "@context/initial-load-context";
import * as Toast from "@components/toast";
import useMergeRefs from "@hooks/use-merge-refs";
import useFragment from "@hooks/use-fragment";
import HeroImage from "@components/images/hero";
import FiretruckImage from "@components/images/firetruck";
import Card from "@components/card";
import IconItem, { ItemContents } from "@components/icon-item";
import Pill from "@components/pill";
import Spacer from "@components/spacer";
import { LandingNav } from "@components/nav";
import Skip from "@components/skip";
import * as Dialog from "@components/dialog";
import CreateAccountDialogContent, {
  accountContentType,
} from "@components/create-account-dialog-content";
import { ReactComponent as UnstyledFireIcon } from "@assets/icons/fire-icon.svg";
import { ReactComponent as UnstyledManageIcon } from "@assets/icons/manage-icon.svg";
import { ReactComponent as UnstyledCustomizeIcon } from "@assets/icons/customize-icon.svg";
import { ReactComponent as UnstyledReviewIcon } from "@assets/icons/review-icon.svg";
import { BREAKPOINTS, QUERIES } from "@constants";

const hashIds = {
  hero: "home",
  features: "features",
  howItWorks: "how-it-works",
  footer: "contact",
};

const inViewOptions = {
  rootMargin: "-72px 0px",
};

function Home() {
  const [headerInViewRef, headerInView] = useInView(inViewOptions);
  const [featuresInViewRef, featuresInView] = useInView(inViewOptions);
  const [howItWorksInViewRef, howItWorksInView] = useInView(inViewOptions);
  const [footerInViewRef, footerInView] = useInView({
    // Account for pixel rounding and fixed header preventing the footer from being fully in view
    threshold: 0.99 - 72 / window.innerHeight,
  });

  const featuresScrollRef = React.useRef();
  const fragmentRef = useFragment({ behavior: "smooth" });

  const heroRef = useMergeRefs(headerInViewRef, fragmentRef);
  const featuresRef = useMergeRefs(
    featuresInViewRef,
    fragmentRef,
    featuresScrollRef
  );
  const howItWorksRef = useMergeRefs(howItWorksInViewRef, fragmentRef);
  const footerRef = useMergeRefs(footerInViewRef, fragmentRef);

  const { user } = useAuth();
  const [newAccountOpen, setNewAccountOpen] = React.useState(false);

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  const { pathname } = useLocation();
  const initialLoad = useInitialLoad();

  // React router's ScrollRestoration breaks smooth scrolling
  React.useEffect(() => {
    if (!initialLoad) {
      window.scrollTo(0, 0);
    }
  }, [initialLoad, pathname]);

  return (
    <Wrapper>
      <header>
        <Skip href={`#${hashIds.hero}`} />
        <LandingNav
          hashIds={hashIds}
          headerInView={headerInView}
          featuresInView={featuresInView}
          howItWorksInView={howItWorksInView}
          footerInView={footerInView}
          setToastState={setToastState}
          setToastOpen={setToastOpen}
        />
      </header>
      <Main>
        <HeroImage>
          <Hero id={hashIds.hero} ref={heroRef}>
            <Heading>Keep your department safe and accountable</Heading>
            <Subheading>
              Manage your department’s personnel and automatically generate
              incident reports for safety and accountability, all from your
              tablet.
            </Subheading>
            <HeaderPills>
              <Pill
                onClick={() => {}}
                targetRef={featuresScrollRef}
                theme="light"
                angle
              >
                Learn more
              </Pill>
              {user.current ? (
                <Pill to="/dashboard/reports" theme="dark" angle>
                  Go to dashboard
                </Pill>
              ) : (
                <Dialog.Root
                  open={newAccountOpen}
                  onOpenChange={setNewAccountOpen}
                >
                  <Dialog.Trigger asChild>
                    <DesktopPill theme="dark" angle>
                      Get started
                    </DesktopPill>
                  </Dialog.Trigger>
                  {/* Render without portal so toast is not unmounted */}
                  <Dialog.Overlay>
                    <Dialog.Content title="Get started">
                      <CreateAccountDialogContent
                        defaultContent={accountContentType.NEW_USER}
                        setToastOpen={setToastOpen}
                        setToastState={setToastState}
                      />
                    </Dialog.Content>
                  </Dialog.Overlay>
                </Dialog.Root>
              )}
            </HeaderPills>
            <DownloadsWrapper>
              <Download href="https://apps.apple.com/us/app/commandability/id1579180681">
                Download for iOS
              </Download>
            </DownloadsWrapper>
          </Hero>
        </HeroImage>
        <Content>
          <Grid />
          <FeaturesWrapper id={hashIds.features} ref={featuresRef}>
            <Feature>
              <ManageIcon />
              <FeatureContent>
                <FeatureHeader style={{ "--color": "var(--color-yellow-1)" }}>
                  Manage
                </FeatureHeader>
                <FeatureText>
                  Use the Commandability app’s interactive interface to move
                  personnel between on-site groups and track the location of all
                  personnel throughout an incident. Monitor the time personnel
                  are exposed to high risk areas using group alerts.
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
                  department’s roster for use during incidents.
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
                  personnel movements, group changes, and overdue alerts, as
                  well as additional notes about each incident.
                </FeatureText>
              </FeatureContent>
            </Feature>
          </FeaturesWrapper>
          <HowItWorks id={hashIds.howItWorks} ref={howItWorksRef}>
            <StepOne
              style={{
                "--accent-color-1": "var(--color-yellow-5)",
                "--accent-color-2": "var(--color-yellow-3)",
              }}
              subheader="Step 1"
              header="Setup an account"
            >
              <UnorderedList>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Create an account on the Commandability website homepage
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Add or import personnel on the website roster page
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Configure group names and alerts on the website groups page
                  </ItemContents>
                </IconItem>
              </UnorderedList>
            </StepOne>
            <StepTwo
              style={{
                "--accent-color-1": "var(--color-yellow-4)",
                "--accent-color-2": "var(--color-yellow-2)",
              }}
              subheader="Step 2"
              header="Take control of incidents"
            >
              <UnorderedList>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Download the Commandability app on your tablet device
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Sign in and update to load your department’s data, then
                    start an incident
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Customize your groups to match the incident, and begin
                    managing on-site personnel in real time
                  </ItemContents>
                </IconItem>
              </UnorderedList>
            </StepTwo>
            <StepThree
              style={{
                "--accent-color-1": "var(--color-yellow-3)",
                "--accent-color-2": "var(--color-yellow-1)",
              }}
              subheader="Step 3"
              header="Stay accountable"
            >
              <UnorderedList>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    After the incident, enter the incident location and any
                    additional notes
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Upload the report to your Commandability account
                  </ItemContents>
                </IconItem>
                <IconItem>
                  <FiCheckSquare />
                  <ItemContents>
                    Review all uploaded reports on the Commandability website
                  </ItemContents>
                </IconItem>
              </UnorderedList>
            </StepThree>
          </HowItWorks>
        </Content>
        <FiretruckImage>
          <Footer id={hashIds.footer} ref={footerRef}>
            <Contact>
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
                <FooterFireIcon />
                Copyright © {new Date().getFullYear()} Commandability
              </Copyright>
              <Policies>
                <Policy to="/privacy-policy">Privacy Policy</Policy>
              </Policies>
            </Legal>
          </Footer>
        </FiretruckImage>
      </Main>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </Wrapper>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  height: 100%;

  @media (min-height: ${BREAKPOINTS.laptop}px) {
    height: 80%;
  }
`;

const Main = styled.main`
  height: 84%;

  @media ${QUERIES.phoneAndSmaller} {
    height: 88%;
  }
`;

const Hero = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 48px;
  padding: 0 8vw;
  padding-right: 24px;

  @media ${QUERIES.tabletAndSmaller} {
    padding-left: 48px;
  }

  @media (orientation: landscape) and (max-height: ${BREAKPOINTS.phone}),
    ${QUERIES.phoneAndSmaller} {
    padding-left: 24px;
    gap: 24px;
  }
`;

const Heading = styled.h1`
  text-transform: uppercase;
  color: var(--text-primary-bg-dark);
  font-size: clamp(${18 / 16}rem, 2vw + 1rem, ${64 / 16}rem);
  font-weight: normal;
  line-height: var(--header-line-height);
  max-width: 22ch;
  letter-spacing: 0.05em;
  opacity: 0;
  animation: ${fadeIn} 1200ms ease-in-out forwards;
`;

const Subheading = styled.h2`
  color: var(--text-secondary-bg-dark);
  font-size: clamp(${18 / 16}rem, 0.5vw + 1rem, ${32 / 16}rem);
  font-weight: normal;
  line-height: var(--content-line-height);
  max-width: 48ch;
  opacity: 0;
  animation: ${fadeIn} 1200ms ease-in-out 800ms forwards;

  @media ${QUERIES.phoneAndSmaller} {
    max-width: 28ch;
  }

  @media (orientation: landscape) and (max-height: 600px) {
    display: none;
  }
`;

const HeaderPills = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${fadeIn} 1200ms ease-in-out 1600ms forwards;
`;

const DesktopPill = styled(Pill)`
  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
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

const Download = styled.a`
  color: var(--text-secondary-bg-dark);
  text-decoration: none;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 200ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-white);
    }
  }
`;

const Content = styled.div`
  isolation: isolate;
  position: relative;
  background-image: linear-gradient(
    135deg,
    var(--color-white),
    var(--color-gray-10)
  );
  line-height: var(--content-line-height);
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("graphics/grid-pattern.svg");
  background-size: 32px;
  background-repeat: repeat;
`;

const FeaturesWrapper = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  color: var(--text-secondary);
  padding: 48px 24px;
  scroll-margin: calc(72px - 1px);
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
  max-width: 72ch;
`;

const ManageIcon = styled(UnstyledManageIcon)`
  fill: var(--color-yellow-9);
  background-image: linear-gradient(
    135deg,
    var(--color-yellow-1),
    var(--color-yellow-2)
  );
  border-radius: var(--border-radius);
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
  background-image: linear-gradient(
    135deg,
    var(--color-yellow-2),
    var(--color-yellow-3)
  );
  border-radius: var(--border-radius);
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
  background-image: linear-gradient(
    135deg,
    var(--color-yellow-3),
    var(--color-yellow-4)
  );
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  min-width: 192px;
  min-height: 192px;
  padding: 48px;

  @media ${QUERIES.phoneAndSmaller} {
    display: none;
  }
`;

const HowItWorks = styled.section`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 64px;
  min-height: calc(512px + 96px * 3);
  padding: 48px 24px;
  scroll-margin: calc(72px - 1px);

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
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  list-style: none;
  font-size: ${18 / 16}rem;
  color: var(--text-secondary);

  & svg {
    stroke: var(--accent-color-1);
  }
`;

const Footer = styled.footer`
  display: grid;
  place-content: center;
  height: 100%;
`;

const Contact = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`;

const MessageText = styled.p`
  color: var(--text-primary-bg-dark);
  font-size: clamp(${16 / 16}rem, 2vw + 1rem, ${64 / 16}rem);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const Legal = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px 64px;
  padding: 24px;
  --color: var(--text-secondary-bg-dark);
`;

const Copyright = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${14 / 16}rem;
  color: var(--color);
`;

const Policies = styled.div`
  display: flex;
  gap: 16px;
`;

const Policy = styled(Link)`
  font-size: ${14 / 16}rem;
  color: var(--color-gray-7);
`;

const FooterFireIcon = styled(UnstyledFireIcon)`
  fill: var(--color);
  min-width: 1em;
`;

export default Home;
