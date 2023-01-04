import * as React from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { FiCheckSquare, FiChevronDown } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

import { useAuth } from "context/auth-context";
import { useInitialLoad } from "context/initial-load-context";
import * as Toast from "components/toast";
import useMergeRefs from "hooks/use-merge-refs";
import useFragment from "hooks/use-fragment";
import HeroImage from "components/hero-image";
import FooterImage from "components/footer-image";
import Card from "components/card";
import IconItem, { ItemContents } from "components/icon-item";
import Pill from "components/pill";
import Spacer from "components/spacer";
import LandingNav from "components/landing-nav";
import VisuallyHidden from "components/visually-hidden";
import Skip from "components/skip";
import SmoothScrollTo from "components/smooth-scroll-to";
import * as Dialog from "components/dialog";
import AccountDialogContent, {
  accountContentType,
} from "components/account-dialog-content";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { ReactComponent as UnstyledManageIcon } from "assets/icons/manage-icon.svg";
import { ReactComponent as UnstyledCustomizeIcon } from "assets/icons/customize-icon.svg";
import { ReactComponent as UnstyledReviewIcon } from "assets/icons/review-icon.svg";
import { BREAKPOINTS, QUERIES } from "constants";

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
                      <AccountDialogContent
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
              <Download href="https://play.google.com/store/apps/details?id=com.commandability&hl=en_US&gl=US">
                Download for Android
              </Download>
              <Download href="https://apps.apple.com/us/app/commandability/id1579180681">
                Download for iOS
              </Download>
            </DownloadsWrapper>
            <ScrollDown targetRef={featuresScrollRef}>
              <ScrollDownContents>
                <FiChevronDown />
                <VisuallyHidden>Scroll down</VisuallyHidden>
              </ScrollDownContents>
            </ScrollDown>
          </Hero>
        </HeroImage>
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
                personnel movements, group changes, and overdue alerts, as well
                as additional notes about each incident.
              </FeatureText>
            </FeatureContent>
          </Feature>
        </FeaturesWrapper>
        <HowItWorks id={hashIds.howItWorks} ref={howItWorksRef}>
          <StepOne
            subheader="Step 1"
            header="Setup an account"
            backgroundColor="var(--color-red-3)"
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
            subheader="Step 2"
            header="Take control of incidents"
            backgroundColor="var(--color-red-2)"
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
                  Sign in and update to load your department’s data, then start
                  an incident
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
            subheader="Step 3"
            header="Stay accountable"
            backgroundColor="var(--color-red-1)"
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
        <FooterImage>
          <Footer id={hashIds.footer} ref={footerRef}>
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
                <FooterFireIcon />
                Copyright © {new Date().getFullYear()} Commandability
              </Copyright>
              <Policies>
                <Policy to="/privacy-policy">Privacy Policy</Policy>
              </Policies>
            </Legal>
          </Footer>
        </FooterImage>
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

const Wrapper = styled.div`
  height: 100%;

  @media (min-height: ${BREAKPOINTS.laptop}px) {
    height: 80%;
  }
`;

const Main = styled.main`
  height: 100%;
`;

const Hero = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 48px;
  padding-left: clamp(24px, 8vw, 160px);
  padding-right: 24px;

  @media (orientation: landscape) and (max-height: 600px) {
    gap: 24px;
  }
`;

const Heading = styled.h1`
  text-transform: uppercase;
  color: var(--color-gray-10);
  font-size: clamp(${18 / 16}rem, 2vw + 1rem, ${64 / 16}rem);
  font-weight: normal;
  max-width: 22ch;
  letter-spacing: 0.05em;
`;

const Subheading = styled.h2`
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

const HeaderPills = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
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
  color: var(--color-yellow-9);
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

const ScrollDown = styled(SmoothScrollTo)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${64 / 16}rem;
  bottom: 92px;
  color: var(--color-gray-10);
  -webkit-tap-highlight-color: transparent;

  @media ${QUERIES.tabletAndSmaller} {
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

const ScrollDownContents = styled.div`
  @media (prefers-reduced-motion: no-preference) {
    will-change: transform;
    transition: transform 200ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-8px);
    }
  }
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
  max-width: 64ch;
`;

const ManageIcon = styled(UnstyledManageIcon)`
  fill: var(--color-yellow-9);
  background-color: var(--color-yellow-1);
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
  background-color: var(--color-yellow-2);
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
  background-color: var(--color-yellow-3);
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
  display: flex;
  justify-content: center;
  gap: 64px;
  min-height: calc(512px + 96px * 3);
  padding: 96px 24px;
  padding-top: 48px;
  background-color: var(--color-gray-10);
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  list-style: none;
  padding: 48px;
  font-size: ${18 / 16}rem;
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

const FooterFireIcon = styled(UnstyledFireIcon)`
  fill: var(--color-yellow-9);
  min-width: 1em;
`;

export default Home;
