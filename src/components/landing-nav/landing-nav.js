import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";
import SmoothScrollTo from "components/smooth-scroll-to";
import VisuallyHidden from "components/visually-hidden";
import MobileMenu from "components/mobile-menu";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";

function LandingNav({
  headerInView,
  featuresInView,
  howItWorksInView,
  contactInView,
}) {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  let tabInView;
  if (headerInView) {
    tabInView = "home";
  } else if (featuresInView) {
    tabInView = "features";
  } else if (howItWorksInView) {
    tabInView = "how-it-works";
  } else if (contactInView) {
    tabInView = "contact";
  }

  const [scroll, setScroll] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Nav
      style={{
        "--background-color": `${
          scroll ? "var(--color-gray-10)" : "transparent"
        }`,
        "--box-shadow": `${scroll ? "inherit" : "none"}`,
      }}
    >
      <SiteIDWrapper>
        <SiteID
          to="/"
          style={{
            "--color": `${
              scroll ? "var(--color-gray-1)" : "var(--color-white)"
            }`,
          }}
        >
          <NavFireIcon
            style={{
              "--fill": `${
                scroll ? "var(--color-red-3)" : "var(--color-yellow-9)"
              }`,
            }}
          />
          Commandability
        </SiteID>
      </SiteIDWrapper>
      <DesktopNav
        style={{
          "--color": `${
            scroll ? "var(--color-gray-4)" : "var(--color-gray-8)"
          }`,
          "--active-color": `${
            scroll ? "var(--color-red-3)" : "var(--color-white)"
          }`,
        }}
      >
        <Tab targetId="home" inView={tabInView === "home" ? true : false}>
          Home
        </Tab>
        <Tab
          targetId="features"
          inView={tabInView === "features" ? true : false}
        >
          Features
        </Tab>
        <Tab
          targetId="how-it-works"
          inView={tabInView === "how-it-works" ? true : false}
        >
          How it works
        </Tab>
        <Tab targetId="contact" inView={tabInView === "contact" ? true : false}>
          Contact
        </Tab>
      </DesktopNav>
      <AccountOptions
        style={{
          "--color": `${
            scroll ? "var(--color-yellow-2)" : "var(--color-yellow-9)"
          }`,
        }}
      >
        <Option>Create an account</Option>
        <Option>Login</Option>
      </AccountOptions>
      <MobileActions>
        <MenuButton onClick={() => setShowMobileMenu(true)}>
          <FiMenu />
          <VisuallyHidden>Open menu</VisuallyHidden>
        </MenuButton>
      </MobileActions>
      <MobileMenu
        isOpen={showMobileMenu}
        onDismiss={() => setShowMobileMenu(false)}
        tabInView={tabInView}
      />
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 0%;
  width: 100%;
  height: 72px;
  display: flex;
  z-index: 9999999;
  align-items: center;
  font-size: clamp(${16 / 16}rem, 0.25vw + 1rem, ${18 / 16}rem);
  padding: 0px 24px;
  background-color: var(--background-color);
  box-shadow: var(--box-shadow);
  -webkit-tap-highlight-color: transparent;
`;

const SiteIDWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SiteID = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color);
  padding: 0px 8px;
  gap: 8px;
`;

const NavFireIcon = styled(UnstyledFireIcon)`
  fill: var(--fill);
  min-width: 32px;
  min-height: 32px;
`;

const DesktopNav = styled.div`
  flex: 2;
  display: flex;
  max-width: 640px;
  justify-content: space-between;
  align-self: stretch;
  color: var(--color);

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const Tab = styled(SmoothScrollTo)`
  text-transform: uppercase;
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: 0.05em;
  text-decoration: none;
  border-bottom: 4px solid hsl(0 0% 0% / 0);
  color: inherit;

  &.active {
    color: var(--active-color);
    border-bottom: 4px solid var(--active-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--active-color);
    }
  }
`;

const AccountOptions = styled.div`
  flex: 1;
  display: flex;
  align-self: stretch;
  justify-content: flex-end;
  gap: 16px;

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const Option = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 8px;
  color: var(--color);
  font-size: ${16 / 16}rem;
  font-weight: bold;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-white);
    }
  }
`;

const MobileActions = styled.div`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }
`;

const MenuButton = styled(UnstyledButton)``;

export default LandingNav;
