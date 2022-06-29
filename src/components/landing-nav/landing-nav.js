import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";

import UnstyledButton from "components/unstyled-button";
import SmoothScrollTo from "components/smooth-scroll-to";
import VisuallyHidden from "components/visually-hidden";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";

function LandingNav({ header, features, howItWorks, footer }) {
  const [scroll, setScroll] = React.useState({ y: 0, direction: "" });
  const [state, dispatch] = React.useReducer(reducer, { active: "home" });

  function reducer(state, action) {
    // Set header as active on refresh
    if (!scroll.y) return { ...state, active: header.id };

    switch (action.type) {
      case "scroll-update":
        // Set the next element as active when the current element is no longer in view / the header intersects the next element
        if (scroll.direction === "down" && !action.payload.elementInView) {
          return { ...state, active: action.payload.adjacentSiblingId };
          // Set the current element as active when the header intersects it
        } else if (scroll.direction === "up" && action.payload.elementInView) {
          return { ...state, active: action.payload.elementId };
        } else {
          return state;
        }
      case "bound-update":
        // Set the current element as active when it's in view, otherwise set its sibling as active
        if (action.payload.elementInView) {
          return { ...state, active: action.payload.elementId };
        } else {
          return { ...state, active: action.payload.siblingId };
        }
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }

  React.useEffect(
    () =>
      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: header.inView,
          elementId: header.id,
          adjacentSiblingId: features.id,
        },
      }),
    [header.inView, header.id, features.id]
  );

  React.useEffect(
    () =>
      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: features.inView,
          elementId: features.id,
          adjacentSiblingId: howItWorks.id,
        },
      }),
    [features.inView, features.id, howItWorks.id]
  );

  React.useEffect(
    () =>
      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: howItWorks.inView,
          elementId: howItWorks.id,
          adjacentSiblingId: footer.id,
        },
      }),
    [howItWorks.inView, howItWorks.id, footer.id]
  );

  React.useEffect(
    () =>
      dispatch({
        type: "bound-update",
        payload: {
          elementInView: footer.inView,
          elementId: footer.id,
          siblingId: howItWorks.id,
        },
      }),
    [footer.inView, footer.id, howItWorks.id]
  );

  React.useEffect(() => {
    function handleScroll() {
      setScroll((prevScroll) => ({
        y: window.scrollY,
        direction: window.scrollY > prevScroll.y ? "down" : "up",
      }));
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
          scroll.y ? "var(--color-white)" : "transparent"
        }`,
        "--box-shadow": `${scroll.y ? "inherit" : "none"}`,
      }}
    >
      <SiteIDWrapper>
        <SiteID
          to="/"
          style={{
            "--color": `${
              scroll.y ? "var(--color-gray-1)" : "var(--color-white)"
            }`,
          }}
        >
          <NavFireIcon
            style={{
              "--fill": `${
                scroll.y ? "var(--color-red-3)" : "var(--color-yellow-9)"
              }`,
              "--fill-active": `${
                scroll.y ? "var(--color-yellow-4)" : "var(--color-white)"
              }`,
            }}
          />
          Commandability
        </SiteID>
      </SiteIDWrapper>
      <Desktop
        style={{
          "--color": `${
            scroll.y ? "var(--color-gray-4)" : "var(--color-gray-8)"
          }`,
          "--color-active": `${
            scroll.y ? "var(--color-red-3)" : "var(--color-white)"
          }`,
        }}
      >
        <Tab targetId="home" inView={state.active === "home" ? true : false}>
          Home
        </Tab>
        <Tab
          targetId="features"
          inView={state.active === "features" ? true : false}
        >
          Features
        </Tab>
        <Tab
          targetId="how-it-works"
          inView={state.active === "how-it-works" ? true : false}
        >
          How it works
        </Tab>
        <Tab
          targetId="contact"
          inView={state.active === "contact" ? true : false}
        >
          Contact
        </Tab>
      </Desktop>
      <Mobile>
        <Dialog.Root modal={false}>
          <Trigger>
            <FiMenu size={24} />
            <VisuallyHidden>Toggle menu</VisuallyHidden>
          </Trigger>
          <Dialog.Portal>
            <Content
              onInteractOutside={(e) => e.preventDefault()}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <Dialog.Title />
              <Dialog.Description />
              <Menu>
                <Item
                  targetId="home"
                  inView={state.active === "home" ? true : false}
                >
                  Home
                </Item>
                <Item
                  targetId="features"
                  inView={state.active === "features" ? true : false}
                >
                  Features
                </Item>
                <Item
                  targetId="how-it-works"
                  inView={state.active === "how-it-works" ? true : false}
                >
                  How it works
                </Item>
                <Item
                  targetId="contact"
                  inView={state.active === "contact" ? true : false}
                >
                  Contact
                </Item>
              </Menu>
            </Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Mobile>
      <AccountOptions
        style={{
          "--color": `${
            scroll.y ? "var(--color-yellow-2)" : "var(--color-yellow-9)"
          }`,
          "--color-active": `${
            scroll.y ? "var(--color-yellow-4)" : "var(--color-white)"
          }`,
        }}
      >
        <Option>Create an account</Option>
        <Option>Login</Option>
      </AccountOptions>
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
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

  @media ${QUERIES.tabletAndSmaller} {
    background-color: var(--color-white);
  }
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
  gap: 8px;

  @media ${QUERIES.tabletAndSmaller} {
    color: var(--color-gray-1);
  }
`;

const NavFireIcon = styled(UnstyledFireIcon)`
  fill: var(--fill);
  min-width: 32px;
  min-height: 32px;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      fill: var(--fill-active);
    }
  }

  @media ${QUERIES.tabletAndSmaller} {
    fill: var(--color-red-3);
  }
`;

const Desktop = styled.div`
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
    color: var(--color-active);
    border-bottom: 4px solid var(--color-active);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-active);
    }
  }
`;

const Mobile = styled.div`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }
`;

const filler = keyframes`
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(0%);
  }
`;

const Content = styled(Dialog.Content)`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    display: block;
  }

  position: fixed;
  top: 72px;
  width: 100%;
  font-size: clamp(${16 / 16}rem, 0.25vw + 1rem, ${18 / 16}rem);
  overflow: hidden;
  // Add padding to bottom for box-shadow
  padding-bottom: 8px;

  @media (prefers-reduced-motion: no-preference) {
    // Add filler animation because radix doesn't detect closed animations on children
    &[data-state="closed"] {
      animation: ${filler} 300ms ease-in forwards;
    }
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0%);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-100%);
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-white);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  padding: 24px 48px;
  padding-top: 16px;
  width: 100%;
  box-shadow: var(--box-shadow);

  @media (prefers-reduced-motion: no-preference) {
    ${Content}[data-state="open"] & {
      animation: ${slideIn} 300ms ease-out forwards;
    }
    ${Content}[data-state="closed"] & {
      animation: ${slideOut} 300ms ease-in forwards;
    }
  }
`;

const Item = styled(SmoothScrollTo)`
  color: var(--color-gray-1);
  text-decoration: none;
  text-transform: uppercase;

  &.active {
    color: var(--color-red-3);
    &::before {
      content: "→ ";
      position: relative;
      top: -0.05em;
    }
  }
`;

const Trigger = styled(Dialog.Trigger)`
  margin: 0;
  padding: 0;
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container and the Menu icon and it's container
  padding-right: calc(((32px - 18.67px) / 2) - ((24px - 18px) / 2));
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  text-align: left;
  font: inherit;
  color: inherit;

  &:focus {
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const AccountOptions = styled.div`
  flex: 1;
  display: flex;
  align-self: stretch;
  justify-content: flex-end;
  gap: 16px;
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container
  padding-right: calc((32px - 18.67px) / 2);

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const Option = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color);
  font-size: ${16 / 16}rem;
  font-weight: bold;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-active);
    }
  }
`;

export default LandingNav;
