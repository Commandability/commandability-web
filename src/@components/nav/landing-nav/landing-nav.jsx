import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { zeroRightClassName } from "react-remove-scroll-bar";

import { useAuth } from "@context/auth-context";
import { useInitialLoad } from "@context/initial-load-context";
import useRect from "@hooks/use-rect";
import useScroll from "@hooks/use-scroll";
import SmoothScrollTo from "@components/smooth-scroll-to";
import * as NavBase from "@components/nav/nav-base";
import * as NavTabs from "@components/nav/nav-tabs";
import * as NavMenu from "@components/nav/nav-menu";
import * as Dialog from "@components/dialog";
import AccountDialogContent, {
  accountContentType,
} from "@components/account-dialog-content";

const RENDER_TIMEOUT = 100;

function LandingNav({
  hashIds,
  headerInView,
  featuresInView,
  howItWorksInView,
  footerInView,
  setToastState,
  setToastOpen,
}) {
  const { hash } = useLocation();
  const { user } = useAuth();
  const initialLoad = useInitialLoad();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef();

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
        NavBase.TAB_TRANSITION_DURATION
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
  }, [y, renderTimeout]);

  function handleSignOut() {
    window.location.assign("/");
    signOut(user.current.auth);
  }

  function onNavLinkClick() {
    dispatch({
      type: "path-update",
      payload: {
        origin: "onclick",
      },
    });
  }

  return (
    <NavBase.Root
      ref={navRef}
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
      <NavBase.LeftSide>
        <h1>
          <NavBase.SiteID
            href="/"
            style={{
              "--color": `${
                scrolled ? "var(--text-primary)" : "var(--color-white)"
              }`,
              "--fill": `${
                scrolled ? "var(--color-red-3)" : "var(--color-yellow-9)"
              }`,
              "--fill-active": `${
                scrolled ? "var(--color-yellow-3)" : "var(--color-white)"
              }`,
            }}
          >
            <NavBase.FireIcon />
            Commandability
          </NavBase.SiteID>
        </h1>
      </NavBase.LeftSide>
      <NavBase.Middle>
        <NavBase.Desktop>
          <NavBase.Center>
            <NavTabs.Root
              style={{
                "--color": `${
                  scrolled ? "var(--text-secondary)" : "var(--color-gray-9)"
                }`,
                "--color-active": `${
                  scrolled ? "var(--color-red-3)" : "var(--color-yellow-9)"
                }`,
                "--tab-transition":
                  tabTransition === "active"
                    ? `left ${NavBase.TAB_TRANSITION_DURATION}ms, width ${NavBase.TAB_TRANSITION_DURATION}ms, background-color ${NavBase.NAV_TRANSITION_DURATION}ms`
                    : `background-color ${NavBase.NAV_TRANSITION_DURATION}ms`,
                "--tab-width": `${rectsById[state.activeTargetId]?.width}px`,
                "--tab-left": `${rectsById[state.activeTargetId]?.left}px`,
                "--max-width": "640px",
              }}
            >
              <NavTabs.Tab
                ref={homeTabRef}
                targetId={hashIds.hero}
                inView={state.activeTargetId === hashIds.hero ? true : false}
                onClick={onNavLinkClick}
                as={SmoothScrollTo}
              >
                Home
              </NavTabs.Tab>
              <NavTabs.Tab
                ref={featuresTabRef}
                targetId={hashIds.features}
                inView={
                  state.activeTargetId === hashIds.features ? true : false
                }
                onClick={onNavLinkClick}
                as={SmoothScrollTo}
              >
                Features
              </NavTabs.Tab>
              <NavTabs.Tab
                ref={howItWorksTabRef}
                targetId={hashIds.howItWorks}
                inView={
                  state.activeTargetId === hashIds.howItWorks ? true : false
                }
                onClick={onNavLinkClick}
                as={SmoothScrollTo}
              >
                How it works
              </NavTabs.Tab>
              <NavTabs.Tab
                ref={contactTabRef}
                targetId={hashIds.footer}
                inView={state.activeTargetId === hashIds.footer ? true : false}
                onClick={onNavLinkClick}
                as={SmoothScrollTo}
              >
                Contact
              </NavTabs.Tab>
            </NavTabs.Root>
          </NavBase.Center>
        </NavBase.Desktop>
      </NavBase.Middle>
      <NavBase.Mobile>
        <NavMenu.Root
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navRef={navRef}
        >
          <NavMenu.Link
            as={SmoothScrollTo}
            targetId={hashIds.hero}
            inView={state.activeTargetId === hashIds.hero ? true : false}
            onClick={onNavLinkClick}
          >
            Home
          </NavMenu.Link>
          <NavMenu.Link
            as={SmoothScrollTo}
            targetId={hashIds.features}
            inView={state.activeTargetId === hashIds.features ? true : false}
            onClick={onNavLinkClick}
          >
            Features
          </NavMenu.Link>
          <NavMenu.Link
            as={SmoothScrollTo}
            targetId={hashIds.howItWorks}
            inView={state.activeTargetId === hashIds.howItWorks ? true : false}
            onClick={onNavLinkClick}
          >
            How it works
          </NavMenu.Link>
          <NavMenu.Link
            as={SmoothScrollTo}
            targetId={hashIds.footer}
            inView={state.activeTargetId === hashIds.footer ? true : false}
            onClick={onNavLinkClick}
          >
            Contact
          </NavMenu.Link>
        </NavMenu.Root>
      </NavBase.Mobile>
      <NavBase.RightSide>
        <NavBase.AccountOptions
          style={{
            "--color": `${
              scrolled ? "var(--color-red-3)" : "var(--color-yellow-9)"
            }`,
            "--color-active": `${
              scrolled ? "var(--color-red-1)" : "var(--color-white)"
            }`,
          }}
        >
          {user.current ? (
            <NavBase.Option as={Link} to="/dashboard/reports">
              Go to dashboard
            </NavBase.Option>
          ) : (
            <Dialog.Root open={newAccountOpen} onOpenChange={setNewAccountOpen}>
              <Dialog.Trigger asChild>
                <NavBase.Option>Create an account</NavBase.Option>
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
            <NavBase.Option onClick={handleSignOut}>Sign out</NavBase.Option>
          ) : (
            <Dialog.Root
              open={currentAccountOpen}
              onOpenChange={setCurrentAccountOpen}
            >
              <Dialog.Trigger asChild>
                <NavBase.Option>Sign in</NavBase.Option>
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
        </NavBase.AccountOptions>
      </NavBase.RightSide>
    </NavBase.Root>
  );
}

export default LandingNav;
