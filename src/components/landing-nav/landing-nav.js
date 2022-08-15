import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

import { useAuth } from "context/auth-context";
import { useInitialLoad } from "context/initial-load-context";
import useRect from "hooks/use-rect";
import useScroll from "hooks/use-scroll";
import VisuallyHidden from "components/visually-hidden";
import UnstyledButton from "components/unstyled-button";
import SmoothScrollTo from "components/smooth-scroll-to";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";
import MenuButton from "components/menu-button";
import { hashIds } from "pages/home";

const NAV_TRANSITION_DURATION = 400;
const TAB_TRANSITION_DURATION = 400;

function LandingNav({
  headerInView,
  featuresInView,
  howItWorksInView,
  footerInView,
}) {
  const { hash } = useLocation();
  const { user } = useAuth();
  const initialLoad = useInitialLoad();

  const [homeTabRef, homeTabRect] = useRect();
  const [featuresTabRef, featuresTabRect] = useRect();
  const [howItWorksTabRef, howItWorksTabRect] = useRect();
  const [contactTabRef, contactTabRect] = useRect();

  const rectsById = {
    [hashIds.header]: homeTabRect,
    [hashIds.features]: featuresTabRect,
    [hashIds.howItWorks]: howItWorksTabRect,
    [hashIds.footer]: contactTabRect,
  };

  const { y, status } = useScroll();
  const [tabTransition, setTabTransition] = React.useState("inactive");
  const [scrolled, setScrolled] = React.useState(false);

  const [state, dispatch] = React.useReducer(activeReducer, {
    activeTargetId: hashIds.header,
    hashUpdate: "inactive",
  });

  function activeReducer(state, action) {
    switch (action.type) {
      case "initial-state":
        return {
          ...state,
          activeTargetId: action.payload.initialId,
        };
      // hash-update handles hash changes that do not smooth scroll and may be too fast to trigger scroll updates and bound updates
      case "hash-update":
        // The effect always dispatches after the onclick dispatches, so set hashUpdate to "active"
        // so hash-update knows the hash change is handled by scroll-update and bound-update
        if (action.payload.origin === "onclick") {
          return {
            ...state,
            hashUpdate: "active",
          };
          // If the effect was not triggered by the onclick's dispatch
        } else if (
          state.hashUpdate !== "active" &&
          action.payload.origin === "effect"
        ) {
          setTabTransition("deferred");
          return {
            ...state,
            activeTargetId: action.payload.hashId,
          };
          // If the effect was triggered by the onclick's dispatch, reset hashUpdate to "inactive"
        } else {
          return {
            ...state,
            hashUpdate: "inactive",
          };
        }
      case "scroll-update":
        // Set the next element as active when the current element is no longer in view / the header intersects the next element
        if (status === "scrolling-down" && !action.payload.elementInView) {
          if (tabTransition !== "deferred") setTabTransition("active");
          return {
            ...state,
            activeTargetId: action.payload.adjacentSiblingId,
          };
          // Set the current element as active when the header intersects it
        } else if (status === "scrolling-up" && action.payload.elementInView) {
          if (tabTransition !== "deferred") setTabTransition("active");
          return {
            ...state,
            activeTargetId: action.payload.elementId,
          };
        } else {
          return state;
        }
      case "bound-update":
        // Set the current element as active when its inView threshold is triggered, and set its sibling as active as soon as it's no longer triggered
        if (action.payload.elementInView) {
          if (tabTransition !== "deferred") setTabTransition("active");
          return {
            ...state,
            activeTargetId: action.payload.elementId,
          };
        } else if (status === "scrolling-up" && action.payload.siblingInView) {
          if (tabTransition !== "deferred") setTabTransition("active");
          return {
            ...state,
            activeTargetId: action.payload.siblingId,
          };
        } else {
          return state;
        }
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }

  React.useEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "initial-state",
        payload: {
          initialId: hashIds.header,
        },
      });
    };
    effect();
  }, []);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "hash-update",
        payload: {
          origin: "effect",
          hashId: hash.replace("#", "") || hashIds.header,
        },
      });
    };
    effect();
  }, [hash]);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: headerInView,
          elementId: hashIds.header,
          adjacentSiblingId: hashIds.features,
        },
      });
    };
    effect();
  }, [headerInView]);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: featuresInView,
          elementId: hashIds.features,
          adjacentSiblingId: hashIds.howItWorks,
        },
      });
    };
    effect();
  }, [featuresInView]);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: howItWorksInView,
          elementId: hashIds.howItWorks,
          adjacentSiblingId: hashIds.footer,
        },
      });
    };
    effect();
  }, [howItWorksInView]);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "bound-update",
        payload: {
          elementInView: footerInView,
          siblingInView: howItWorksInView,
          elementId: hashIds.footer,
          siblingId: hashIds.howItWorks,
        },
      });
    };
    effect();
  }, [footerInView, howItWorksInView]);

  React.useEffect(() => {
    let transitionTimeoutID;
    if (status === "idle" && tabTransition !== "inactive") {
      transitionTimeoutID = setTimeout(
        () => setTabTransition("inactive"),
        TAB_TRANSITION_DURATION
      );
    }
    return () => clearTimeout(transitionTimeoutID);
  }, [status, tabTransition]);

  React.useLayoutEffect(() => {
    if (!initialLoad) {
      setTabTransition("deferred");
    }
  }, [initialLoad]);

  React.useLayoutEffect(() => {
    // Only use y went in the hero image section to prevent transition flashes
    if (headerInView) {
      setScrolled(y ? true : false);
    } else {
      setScrolled(true);
    }
  }, [headerInView, y]);

  return (
    <Nav
      data-nav-transition={headerInView ? "true" : "false"}
      style={{
        "--background-color": `${
          scrolled ? "var(--color-white)" : "transparent"
        }`,
        "--box-shadow": `${scrolled ? "inherit" : "none"}`,
      }}
    >
      <LeftSide>
        <SiteID
          href="/"
          style={{
            "--color": `${
              scrolled ? "var(--color-gray-1)" : "var(--color-white)"
            }`,
          }}
        >
          <NavFireIcon
            style={{
              "--fill": `${
                scrolled ? "var(--color-red-3)" : "var(--color-yellow-9)"
              }`,
              "--fill-active": `${
                scrolled ? "var(--color-yellow-4)" : "var(--color-white)"
              }`,
            }}
          />
          Commandability
        </SiteID>
      </LeftSide>
      <Desktop
        style={{
          "--color": `${
            scrolled ? "var(--color-gray-4)" : "var(--color-gray-8)"
          }`,
          "--color-active": `${
            scrolled ? "var(--color-red-3)" : "var(--color-white)"
          }`,
          "--tab-transition":
            tabTransition === "active"
              ? `left ${TAB_TRANSITION_DURATION}ms, width ${TAB_TRANSITION_DURATION}ms, background-color ${TAB_TRANSITION_DURATION}ms`
              : "none",
          "--tab-width": `${rectsById[state.activeTargetId]?.width}px`,
          "--tab-left": `${rectsById[state.activeTargetId]?.left}px`,
        }}
      >
        <Tab
          ref={homeTabRef}
          targetId={hashIds.header}
          inView={state.activeTargetId === hashIds.header ? true : false}
          onClick={() =>
            dispatch({
              type: "hash-update",
              payload: {
                origin: "onclick",
              },
            })
          }
        >
          Home
        </Tab>
        <Tab
          ref={featuresTabRef}
          targetId={hashIds.features}
          inView={state.activeTargetId === hashIds.features ? true : false}
          onClick={() =>
            dispatch({
              type: "hash-update",
              payload: {
                origin: "onclick",
              },
            })
          }
        >
          Features
        </Tab>
        <Tab
          ref={howItWorksTabRef}
          targetId={hashIds.howItWorks}
          inView={state.activeTargetId === hashIds.howItWorks ? true : false}
          onClick={() =>
            dispatch({
              type: "hash-update",
              payload: {
                origin: "onclick",
              },
            })
          }
        >
          How it works
        </Tab>
        <Tab
          ref={contactTabRef}
          targetId={hashIds.footer}
          inView={state.activeTargetId === hashIds.footer ? true : false}
          onClick={() =>
            dispatch({
              type: "hash-update",
              payload: {
                origin: "onclick",
              },
            })
          }
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
                  targetId={hashIds.header}
                  inView={
                    state.activeTargetId === hashIds.header ? true : false
                  }
                  onClick={() =>
                    dispatch({
                      type: "hash-update",
                      payload: {
                        origin: "onclick",
                      },
                    })
                  }
                >
                  Home
                </Item>
                <Item
                  targetId={hashIds.features}
                  inView={
                    state.activeTargetId === hashIds.features ? true : false
                  }
                  onClick={() =>
                    dispatch({
                      type: "hash-update",
                      payload: {
                        origin: "onclick",
                      },
                    })
                  }
                >
                  Features
                </Item>
                <Item
                  targetId={hashIds.howItWorks}
                  inView={
                    state.activeTargetId === hashIds.howItWorks ? true : false
                  }
                  onClick={() =>
                    dispatch({
                      type: "hash-update",
                      payload: {
                        origin: "onclick",
                      },
                    })
                  }
                >
                  How it works
                </Item>
                <Item
                  targetId={hashIds.footer}
                  inView={
                    state.activeTargetId === hashIds.footer ? true : false
                  }
                  onClick={() =>
                    dispatch({
                      type: "hash-update",
                      payload: {
                        origin: "onclick",
                      },
                    })
                  }
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
              scrolled ? "var(--color-yellow-2)" : "var(--color-yellow-9)"
            }`,
            "--color-active": `${
              scrolled ? "var(--color-yellow-4)" : "var(--color-white)"
            }`,
          }}
        >
          {user.current ? (
            <Option as={Link} to="/dashboard/reports">
              Go to dashboard
            </Option>
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
  font-size: ${18 / 16}rem;
  padding: 0px 24px;
  background-color: var(--background-color);
  box-shadow: var(--box-shadow);
  -webkit-tap-highlight-color: transparent;

  @media (prefers-reduced-motion: no-preference) {
    will-change: background-color;
    &[data-nav-transition="true"] {
      transition: background-color ${NAV_TRANSITION_DURATION}ms;
    }
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
    ${Nav}[data-nav-transition="true"] & {
      transition: color ${NAV_TRANSITION_DURATION}ms;
    }
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
    ${Nav}[data-nav-transition="true"] & {
      transition: fill ${NAV_TRANSITION_DURATION}ms;
    }
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
      will-change: left, width, background-color;
      transition: var(--tab-transition);
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
    ${Nav}[data-nav-transition="true"] & {
      transition: color ${NAV_TRANSITION_DURATION}ms,
        border-bottom ${NAV_TRANSITION_DURATION}ms;
    }
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

  &.active {
    color: var(--color-red-3);
    &::before {
      content: "→ ";
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

  text-decoration: none;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    ${Nav}[data-nav-transition="true"] & {
      transition: color ${NAV_TRANSITION_DURATION}ms;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-active);
    }
  }
`;

export default LandingNav;
