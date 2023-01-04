import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import * as RadixDialog from "@radix-ui/react-dialog";
import { zeroRightClassName } from "react-remove-scroll-bar";

import { useAuth } from "context/auth-context";
import { useInitialLoad } from "context/initial-load-context";
import * as Toast from "components/toast";
import useRect from "hooks/use-rect";
import useScroll from "hooks/use-scroll";
import UnstyledButton from "components/unstyled-button";
import SmoothScrollTo from "components/smooth-scroll-to";
import VisuallyHidden from "components/visually-hidden";
import MenuButton from "components/menu-button";
import * as Dialog from "components/dialog";
import AccountDialogContent, {
  accountContentType,
} from "components/account-dialog-content";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants";

const NAV_TRANSITION_DURATION = 800;
const TAB_TRANSITION_DURATION = 400;
const RENDER_TIMEOUT = 100;

function LandingNav({
  hashIds,
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
    [hashIds.hero]: homeTabRect,
    [hashIds.features]: featuresTabRect,
    [hashIds.howItWorks]: howItWorksTabRect,
    [hashIds.footer]: contactTabRect,
  };

  const { y, status } = useScroll();
  const [tabTransition, setTabTransition] = React.useState("inactive");

  const [state, dispatch] = React.useReducer(activeReducer, {
    activeTargetId: "",
    hashUpdate: "inactive",
  });

  const [currentAccountOpen, setCurrentAccountOpen] = React.useState(false);
  const [newAccountOpen, setNewAccountOpen] = React.useState(false);

  const [renderTimeout, setRenderTimeout] = React.useState(true);
  const [scrolled, setScrolled] = React.useState(!initialLoad);

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  function activeReducer(state, action) {
    switch (action.type) {
      case "initial-state":
        return {
          ...state,
          activeTargetId: action.payload.initialId,
        };
      // path-update handles path changes that do not smooth scroll and may be too fast to trigger scroll updates and bound updates
      case "path-update":
        // The effect always dispatches after the onclick dispatches, so set hashUpdate to "active"
        // so path-update knows the hash change is handled by scroll-update and bound-update
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

  // Run after all other dispatch triggers due to scroll restore
  React.useEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      if (initialLoad) {
        dispatch({
          type: "initial-state",
          payload: {
            initialId: hashIds.hero,
          },
        });
      }
    };
    effect();
  }, [hashIds, initialLoad]);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      if (!initialLoad) {
        dispatch({
          type: "path-update",
          payload: {
            origin: "effect",
            hashId: hash.replace("#", "") || hashIds.hero,
          },
        });
      }
    };
    effect();
  }, [hashIds, initialLoad, hash]);

  React.useLayoutEffect(() => {
    const effect = async () => {
      await document.fonts.ready;

      dispatch({
        type: "scroll-update",
        payload: {
          elementInView: headerInView,
          elementId: hashIds.hero,
          adjacentSiblingId: hashIds.features,
        },
      });
    };
    effect();
  }, [hashIds, headerInView]);

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
  }, [hashIds, featuresInView]);

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
  }, [hashIds, howItWorksInView]);

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
  }, [hashIds, footerInView, howItWorksInView]);

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

  // Identify timeout duration on mount but before first paint
  React.useLayoutEffect(() => {
    let renderTimeoutID = setTimeout(() => {
      setRenderTimeout(false);
    }, RENDER_TIMEOUT);

    return () => clearTimeout(renderTimeoutID);
  }, []);

  React.useEffect(() => {
    // Prevent scrolled state from triggering nav transition during scroll restore
    if (renderTimeout) return;

    if (y) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [y, initialLoad, renderTimeout]);

  function handleSignOut() {
    window.location.assign("/");
    signOut(user.current.auth);
  }

  return (
    <Nav
      /* 
        zeroRightClassName makes sure any fixed position elements have their right position modified
        to match the original right position before the scroll bar is removed
        https://github.com/theKashey/react-remove-scroll-bar#the-right-border
      */
      className={zeroRightClassName}
      style={{
        "--background-color": `${
          scrolled ? "var(--color-white)" : "transparent"
        }`,
        "--nav-box-shadow": `${scrolled ? "inherit" : "none"}`,
      }}
    >
      <LeftSide>
        <h1>
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
        </h1>
      </LeftSide>
      <Desktop
        role="list"
        style={{
          "--color": `${
            scrolled ? "var(--color-gray-3)" : "var(--color-gray-9)"
          }`,
          "--color-active": `${
            scrolled ? "var(--color-red-3)" : "var(--color-yellow-9)"
          }`,
          "--tab-transition":
            tabTransition === "active"
              ? `left ${TAB_TRANSITION_DURATION}ms, width ${TAB_TRANSITION_DURATION}ms, background-color ${NAV_TRANSITION_DURATION}ms`
              : `background-color ${NAV_TRANSITION_DURATION}ms`,
          "--tab-width": `${rectsById[state.activeTargetId]?.width}px`,
          "--tab-left": `${rectsById[state.activeTargetId]?.left}px`,
        }}
      >
        <Tab ref={homeTabRef}>
          <TabLink
            targetId={hashIds.hero}
            inView={state.activeTargetId === hashIds.hero ? true : false}
            onClick={() =>
              dispatch({
                type: "path-update",
                payload: {
                  origin: "onclick",
                },
              })
            }
          >
            Home
          </TabLink>
        </Tab>
        <Tab ref={featuresTabRef}>
          <TabLink
            targetId={hashIds.features}
            inView={state.activeTargetId === hashIds.features ? true : false}
            onClick={() =>
              dispatch({
                type: "path-update",
                payload: {
                  origin: "onclick",
                },
              })
            }
          >
            Features
          </TabLink>
        </Tab>
        <Tab ref={howItWorksTabRef}>
          <TabLink
            targetId={hashIds.howItWorks}
            inView={state.activeTargetId === hashIds.howItWorks ? true : false}
            onClick={() =>
              dispatch({
                type: "path-update",
                payload: {
                  origin: "onclick",
                },
              })
            }
          >
            How it works
          </TabLink>
        </Tab>
        <Tab ref={contactTabRef}>
          <TabLink
            targetId={hashIds.footer}
            inView={state.activeTargetId === hashIds.footer ? true : false}
            onClick={() =>
              dispatch({
                type: "path-update",
                payload: {
                  origin: "onclick",
                },
              })
            }
          >
            Contact
          </TabLink>
        </Tab>
      </Desktop>
      <Mobile>
        <RadixDialog.Root modal={false}>
          <Trigger asChild>
            <MenuButton />
          </Trigger>
          <RadixDialog.Portal>
            <Content onInteractOutside={(e) => e.preventDefault()}>
              <RadixDialog.Title>
                <VisuallyHidden>Navigation</VisuallyHidden>
              </RadixDialog.Title>
              <Menu>
                <Item
                  targetId={hashIds.hero}
                  inView={state.activeTargetId === hashIds.hero ? true : false}
                  onClick={() =>
                    dispatch({
                      type: "path-update",
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
                      type: "path-update",
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
                      type: "path-update",
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
                      type: "path-update",
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
          </RadixDialog.Portal>
        </RadixDialog.Root>
      </Mobile>
      <RightSide>
        <AccountOptions
          style={{
            "--color": `${
              scrolled ? "var(--color-red-3)" : "var(--color-yellow-9)"
            }`,
            "--color-active": `${
              scrolled ? "var(--color-red-3)" : "var(--color-white)"
            }`,
          }}
        >
          {user.current ? (
            <Option as={Link} to="/dashboard/reports">
              Go to dashboard
            </Option>
          ) : (
            <Dialog.Root open={newAccountOpen} onOpenChange={setNewAccountOpen}>
              <Dialog.Trigger asChild>
                <Option>Create an account</Option>
              </Dialog.Trigger>
              {/* Render without portal so toast is not unmounted */}
              <Dialog.Overlay>
                <Dialog.Content title="Create an account">
                  <AccountDialogContent
                    defaultContent={accountContentType.NEW_USER}
                    setToastOpen={setToastOpen}
                    setToastState={setToastState}
                  />
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Root>
          )}
          {user.current ? (
            <Option onClick={handleSignOut}>Sign out</Option>
          ) : (
            <Dialog.Root
              open={currentAccountOpen}
              onOpenChange={setCurrentAccountOpen}
            >
              <Dialog.Trigger asChild>
                <Option>Sign in</Option>
              </Dialog.Trigger>
              {/* Render without portal so toast is not unmounted */}
              <Dialog.Overlay>
                <Dialog.Content title="Sign in">
                  <AccountDialogContent
                    defaultContent={accountContentType.CURRENT_USER}
                    setToastOpen={setToastOpen}
                    setToastState={setToastState}
                  />
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Root>
          )}
        </AccountOptions>
      </RightSide>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        style={{
          // Reset box shadow after nav conditional
          "--nav-box-shadow": "0px 8px 8px -8px hsl(0 0% 0% / 50%)",
        }}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </Nav>
  );
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: flex;
  z-index: 1;
  align-items: center;
  font-size: ${18 / 16}rem;
  padding: 0px 24px;
  background-color: var(--background-color);
  box-shadow: var(--nav-box-shadow);
  -webkit-tap-highlight-color: transparent;

  @media (prefers-reduced-motion: no-preference) {
    will-change: background-color;
    transition: background-color ${NAV_TRANSITION_DURATION}ms;
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
  gap: 8px;
  font-size: ${18 / 16}rem;
  font-weight: normal;
  text-decoration: none;
  color: var(--color);

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color ${NAV_TRANSITION_DURATION}ms;
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
    transition: fill ${NAV_TRANSITION_DURATION}ms;
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

const Desktop = styled.ul`
  flex: 2;
  display: flex;
  max-width: 640px;
  justify-content: space-between;
  align-self: stretch;
  list-style: none;
  padding-left: 0;

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

const Tab = styled.li`
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TabLink = styled(SmoothScrollTo)`
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  color: var(--color);

  @media (prefers-reduced-motion: no-preference) {
    will-change: color, border-bottom;
    transition: color ${NAV_TRANSITION_DURATION}ms,
      border-bottom ${NAV_TRANSITION_DURATION}ms;
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

const Content = styled(RadixDialog.Content)`
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

const Trigger = styled(RadixDialog.Trigger)`
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
    transition: color ${NAV_TRANSITION_DURATION}ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-active);
    }
  }
`;

export default LandingNav;
