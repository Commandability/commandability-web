import * as React from "react";
import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

import { useAuth } from "context/auth-context";
import useRect from "hooks/use-rect";
import useScroll from "hooks/use-scroll";
import VisuallyHidden from "components/visually-hidden";
import UnstyledButton from "components/unstyled-button";
import SmoothScrollTo from "components/smooth-scroll-to";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";
import MenuButton from "components/menu-button";

const TAB_TRANSITION_DURATION = 400;

function LandingNav({ header, features, howItWorks, footer }) {
  const { user } = useAuth();

  const [homeTabRef, homeTabRect] = useRect();
  const [featuresTabRef, featuresTabRect] = useRect();
  const [howItWorksTabRef, howItWorksTabRect] = useRect();
  const [contactTabRef, contactTabRect] = useRect();

  const rectsById = {
    [header.id]: homeTabRect,
    [features.id]: featuresTabRect,
    [howItWorks.id]: howItWorksTabRect,
    [footer.id]: contactTabRect,
  };

  const { y, direction, status } = useScroll();
  const [transition, setTransition] = React.useState(false);

  const [state, dispatch] = React.useReducer(activeReducer, {
    activeTargetId: "",
  });

  function activeReducer(state, action) {
    // Set header as active on refresh
    if (!y)
      return {
        ...state,
        activeTargetId: header.id,
      };

    switch (action.type) {
      case "scroll-update":
        // Set the next element as active when the current element is no longer in view / the header intersects the next element
        if (direction === "down" && !action.payload.elementInView) {
          setTransition(true);
          return {
            ...state,
            activeTargetId: action.payload.adjacentSiblingId,
          };
          // Set the current element as active when the header intersects it
        } else if (direction === "up" && action.payload.elementInView) {
          setTransition(true);
          return {
            ...state,
            activeTargetId: action.payload.elementId,
          };
        } else {
          return state;
        }
      case "bound-update":
        // Set the current element as active when it's in view, otherwise set its sibling as active
        if (action.payload.elementInView) {
          setTransition(true);
          return {
            ...state,
            activeTargetId: action.payload.elementId,
          };
        } else {
          setTransition(true);
          return {
            ...state,
            activeTargetId: action.payload.siblingId,
          };
        }
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }

  React.useEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: header.inView,
          elementId: header.id,
          adjacentSiblingId: features.id,
        },
      });
    };
    effect();
  }, [header.inView, header.id, features.id]);

  React.useEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: features.inView,
          elementId: features.id,
          adjacentSiblingId: howItWorks.id,
        },
      });
    };
    effect();
  }, [features.inView, features.id, howItWorks.id]);

  React.useEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: howItWorks.inView,
          elementId: howItWorks.id,
          adjacentSiblingId: footer.id,
        },
      });
    };
    effect();
  }, [howItWorks.inView, howItWorks.id, footer.id]);

  React.useEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "bound-update",
        payload: {
          elementInView: footer.inView,
          elementId: footer.id,
          siblingId: howItWorks.id,
        },
      });
    };
    effect();
  }, [footer.inView, footer.id, howItWorks.id]);

  React.useEffect(() => {
    let transitionTimeoutID;
    if (status === "idle") {
      transitionTimeoutID = setTimeout(
        () => setTransition(false),
        TAB_TRANSITION_DURATION
      );
    }
    return () => clearTimeout(transitionTimeoutID);
  }, [status]);

  return (
    <Nav
      style={{
        "--background-color": `${y ? "var(--color-white)" : "transparent"}`,
        "--box-shadow": `${y ? "inherit" : "none"}`,
      }}
    >
      <LeftSide>
        <SiteID
          href="/"
          style={{
            "--color": `${y ? "var(--color-gray-1)" : "var(--color-white)"}`,
          }}
        >
          <NavFireIcon
            style={{
              "--fill": `${y ? "var(--color-red-3)" : "var(--color-yellow-9)"}`,
              "--fill-active": `${
                y ? "var(--color-yellow-4)" : "var(--color-white)"
              }`,
            }}
          />
          Commandability
        </SiteID>
      </LeftSide>
      <Desktop
        style={{
          "--color": `${y ? "var(--color-gray-4)" : "var(--color-gray-8)"}`,
          "--color-active": `${
            y ? "var(--color-red-3)" : "var(--color-white)"
          }`,
          "--transition": transition
            ? `left ${TAB_TRANSITION_DURATION}ms, width ${TAB_TRANSITION_DURATION}ms`
            : "none",
          "--tab-width": `${rectsById[state.activeTargetId]?.width}px`,
          "--tab-left": `${rectsById[state.activeTargetId]?.left}px`,
        }}
      >
        <Tab
          ref={homeTabRef}
          targetId={header.id}
          inView={state.activeTargetId === header.id ? true : false}
        >
          Home
        </Tab>
        <Tab
          ref={featuresTabRef}
          targetId={features.id}
          inView={state.activeTargetId === features.id ? true : false}
        >
          Features
        </Tab>
        <Tab
          ref={howItWorksTabRef}
          targetId={howItWorks.id}
          inView={state.activeTargetId === howItWorks.id ? true : false}
        >
          How it works
        </Tab>
        <Tab
          ref={contactTabRef}
          targetId={footer.id}
          inView={state.activeTargetId === footer.id ? true : false}
        >
          Contact
        </Tab>
      </Desktop>
      <Mobile>
        <Dialog.Root modal={false}>
          <Trigger asChild>
            <MenuButton />
          </Trigger>
          <Dialog.Portal>
            <Content
              onInteractOutside={(e) => e.preventDefault()}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <Dialog.Title>
                <VisuallyHidden>Navigation</VisuallyHidden>
              </Dialog.Title>
              <Menu>
                <Item
                  targetId={header.id}
                  inView={state.activeTargetId === header.id ? true : false}
                >
                  Home
                </Item>
                <Item
                  targetId={features.id}
                  inView={state.activeTargetId === features.id ? true : false}
                >
                  Features
                </Item>
                <Item
                  targetId={howItWorks.id}
                  inView={state.activeTargetId === howItWorks.id ? true : false}
                >
                  How it works
                </Item>
                <Item
                  targetId={footer.id}
                  inView={state.activeTargetId === footer.id ? true : false}
                >
                  Contact
                </Item>
              </Menu>
            </Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Mobile>
      <RightSide>
        <AccountOptions
          style={{
            "--color": `${
              y ? "var(--color-yellow-2)" : "var(--color-yellow-9)"
            }`,
            "--color-active": `${
              y ? "var(--color-yellow-4)" : "var(--color-white)"
            }`,
          }}
        >
          {user.current ? (
            <Option>Go to dashboard</Option>
          ) : (
            <Option>Create an account</Option>
          )}
          {user.current ? <Option>Sign out</Option> : <Option>Sign in</Option>}
        </AccountOptions>
      </RightSide>
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 72px;
  display: flex;
  z-index: 999999;
  align-items: center;
  font-size: clamp(${16 / 16}rem, 0.25vw + 1rem, ${18 / 16}rem);
  padding: 0px 24px;
  background-color: var(--background-color);
  box-shadow: var(--box-shadow);
  -webkit-tap-highlight-color: transparent;

  @media (prefers-reduced-motion: no-preference) {
    will-change: background-color;
    transition: background-color 400ms;
  }

  @media ${QUERIES.tabletAndSmaller} {
    background-color: var(--color-white);
  }
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SiteID = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color);
  gap: 8px;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }

  @media ${QUERIES.tabletAndSmaller} {
    color: var(--color-gray-1);
  }
`;

const NavFireIcon = styled(UnstyledFireIcon)`
  fill: var(--fill);
  min-width: 32px;
  min-height: 32px;

  @media (prefers-reduced-motion: no-preference) {
    will-change: fill;
    transition: fill 400ms;
  }

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

  &::after {
    content: "";
    position: absolute;
    top: calc(72px - 4px);
    left: var(--tab-left);
    width: var(--tab-width);
    height: 4px;
    background-color: var(--color-active);

    @media (prefers-reduced-motion: no-preference) {
      will-change: left, width;
      transition: var(--transition);
    }
  }

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
  color: var(--color);

  @media (prefers-reduced-motion: no-preference) {
    will-change: color, border-bottom;
    transition: color 400ms, border-bottom 400ms;
  }

  &.active {
    color: var(--color-active);
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
  // Remove one pixel for when users drag the dialog upwards while scrolling at the bottom of the screen
  top: calc(72px - 1px);
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

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }

  &.active {
    color: var(--color-red-3);
    &::before {
      content: "??? ";
      position: relative;
      top: -0.05em;
      opacity: 1;
    }
  }
`;

const Trigger = styled(Dialog.Trigger)`
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container and the Menu icon and it's container
  padding-right: calc(((32px - 18.67px) / 2) - ((24px - 18px) / 2));
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-self: center;
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container
  padding-right: calc((32px - 18.67px) / 2);

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const AccountOptions = styled.div`
  display: flex;
  gap: 16px;
`;

const Option = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color);
  font-size: ${16 / 16}rem;
  font-weight: bold;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-active);
    }
  }
`;

export default LandingNav;
