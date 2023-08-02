import * as React from "react";
import styled from "styled-components";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { zeroRightClassName } from "react-remove-scroll-bar";
import {
  FiChevronDown,
  FiHelpCircle,
  FiUsers,
  FiLogOut,
  FiAlertCircle,
  FiArrowRight,
} from "react-icons/fi";
import * as Tooltip from "@radix-ui/react-tooltip";

import { useAuth } from "@context/auth-context";
import * as NavBase from "@components/nav/nav-base";
import * as NavTabs from "@components/nav/nav-tabs";
import * as NavMenu from "@components/nav/nav-menu";
import * as Toast from "@components/toast";
import useRect from "@hooks/use-rect";
import UnstyledButton from "@components/unstyled-button";
import * as Dialog from "@components/dialog";
import CreateAccountDialogContent, {
  accountContentType,
} from "@components/create-account-dialog-content";
import { QUERIES } from "@constants";

function MainNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef();

  const [reportsTabRef, reportsTabRect] = useRect();
  const [rosterTabRef, rosterTabRect] = useRect();
  const [groupsTabRef, groupsTabRect] = useRect();

  const [tabTransition, setTabTransition] = React.useState(false);
  const [activeTabRect, setActiveTabRect] = React.useState(null);

  const [currentAccountOpen, setCurrentAccountOpen] = React.useState(false);
  const [newAccountOpen, setNewAccountOpen] = React.useState(false);

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  React.useLayoutEffect(() => {
    const effect = async () => {
      // Don't calculate tab width until the font has loaded
      await document.fonts.ready;

      if (/\/dashboard\/reports(?:$|\/)/.test(pathname)) {
        setActiveTabRect(reportsTabRect);
      } else if (/\/dashboard\/roster(?:$|\/)/.test(pathname)) {
        setActiveTabRect(rosterTabRect);
      } else if (/\/dashboard\/groups(?:$|\/)/.test(pathname)) {
        setActiveTabRect(groupsTabRect);
      } else {
        setActiveTabRect(null);
      }
    };
    effect();
  }, [pathname, reportsTabRect, rosterTabRect, groupsTabRect]);

  React.useEffect(() => {
    let tabTransitionTimeoutID;
    if (tabTransition) {
      tabTransitionTimeoutID = setTimeout(
        () => setTabTransition(false),
        NavBase.TAB_TRANSITION_DURATION
      );
    }
    return () => clearTimeout(tabTransitionTimeoutID);
  }, [tabTransition]);

  function handleSignOut() {
    if (/\/dashboard\//.test(pathname)) {
      window.location.assign("/");
    } else {
      window.location.assign(window.location);
    }
    signOut(user.current.auth);
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
        "--background-color": "var(--color-white)",
      }}
    >
      <NavBase.LeftSide>
        <h1>
          <NavBase.SiteID
            href="/"
            style={{
              "--color": "var(--text-primary)",
              "--fill": "var(--color-red-3)",
              "--fill-active": "var(--color-red-1)",
            }}
          >
            <NavBase.FireIcon />
            Commandability
          </NavBase.SiteID>
        </h1>
      </NavBase.LeftSide>
      {user.current ? (
        <NavBase.Middle>
          <NavBase.Desktop>
            <NavBase.Center>
              <NavTabs.Root
                style={{
                  "--tab-transition": tabTransition
                    ? `left ${NavBase.TAB_TRANSITION_DURATION}ms, width ${NavBase.TAB_TRANSITION_DURATION}ms`
                    : "none",
                  "--tab-width": `${activeTabRect?.width}px`,
                  "--tab-left": `${activeTabRect?.left}px`,
                  "--color": "var(--text-secondary)",
                  "--color-active": "var(--color-red-3)",
                  "--max-width": "512px",
                }}
              >
                <NavTabs.Tab
                  ref={reportsTabRef}
                  to="/dashboard/reports"
                  onClick={() => setTabTransition(true)}
                  as={NavLink}
                >
                  Reports
                </NavTabs.Tab>
                <NavTabs.Tab
                  ref={rosterTabRef}
                  to="/dashboard/roster"
                  onClick={() => setTabTransition(true)}
                  as={NavLink}
                >
                  Roster
                </NavTabs.Tab>
                <NavTabs.Tab
                  ref={groupsTabRef}
                  to="/dashboard/groups"
                  onClick={() => setTabTransition(true)}
                  as={NavLink}
                >
                  Groups
                </NavTabs.Tab>
              </NavTabs.Root>
            </NavBase.Center>
          </NavBase.Desktop>
        </NavBase.Middle>
      ) : null}
      {user.current ? (
        <NavBase.Mobile>
          <NavMenu.Root
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            navRef={navRef}
          >
            <NavMenu.Link to="/dashboard/reports" as={NavLink}>
              Reports
            </NavMenu.Link>
            <NavMenu.Link to="/dashboard/roster" as={NavLink}>
              Roster
            </NavMenu.Link>
            <NavMenu.Link to="/dashboard/groups" as={NavLink}>
              Groups
            </NavMenu.Link>
          </NavMenu.Root>
        </NavBase.Mobile>
      ) : null}
      <NavBase.RightSide>
        {user.current ? (
          <>
            {user.current.emailVerified ? (
              <></>
            ) : (
              <Tooltip.Provider>
                <Tooltip.Root delayDuration={NavBase.NAV_TRANSITION_DURATION}>
                  <Link to="/dashboard/account">
                    <TooltipTrigger>
                      <FiAlertCircle></FiAlertCircle>
                    </TooltipTrigger>
                  </Link>
                  <Tooltip.Portal>
                    <Link to="/dashboard/account">
                      <TooltipContent
                        side="bottom"
                        sideOffset={12}
                        align="end"
                        alignOffset={-12}
                      >
                        <TooltipContentWrapper>
                          Verify your email
                          <FiArrowRight />
                        </TooltipContentWrapper>
                        <TooltipArrow />
                      </TooltipContent>
                    </Link>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <DropdownMenuButton>
                  {user.current.displayName}
                  <FiChevronDown />
                </DropdownMenuButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  // Match --border-radius
                  arrowPadding={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <DropdownMenuAction
                        as="a"
                        href="mailto:support@commandability.app?"
                      >
                        <FiHelpCircle />
                        Support
                      </DropdownMenuAction>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <DropdownMenuAction to="/dashboard/account">
                        <FiUsers />
                        Account
                      </DropdownMenuAction>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <DropdownMenuAction
                        as={UnstyledButton}
                        onClick={handleSignOut}
                      >
                        <FiLogOut />
                        Sign out
                      </DropdownMenuAction>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuArrow />
                </DropdownMenuContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        ) : (
          <NavBase.AccountOptions>
            <Dialog.Root open={newAccountOpen} onOpenChange={setNewAccountOpen}>
              <Dialog.Trigger asChild>
                <NavBase.Option
                  style={{
                    "--color": "var(--color-red-3)",
                    "--color-active": "var(--color-red-1)",
                  }}
                >
                  Create an account
                </NavBase.Option>
              </Dialog.Trigger>
              {/* Render without portal so toast is not unmounted */}
              <Dialog.Overlay>
                <Dialog.Content title="Create an account">
                  <CreateAccountDialogContent
                    defaultContent={accountContentType.NEW_USER}
                    setToastOpen={setToastOpen}
                    setToastState={setToastState}
                  />
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Root>
            <Dialog.Root
              open={currentAccountOpen}
              onOpenChange={setCurrentAccountOpen}
            >
              <Dialog.Trigger asChild>
                <NavBase.Option
                  style={{
                    "--color": "var(--color-red-3)",
                    "--color-active": "var(--color-red-1)",
                  }}
                >
                  Sign in
                </NavBase.Option>
              </Dialog.Trigger>
              {/* Render without portal so toast is not unmounted */}
              <Dialog.Overlay>
                <Dialog.Content title="Sign in">
                  <CreateAccountDialogContent
                    defaultContent={accountContentType.CURRENT_USER}
                    setToastOpen={setToastOpen}
                    setToastState={setToastState}
                  />
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Root>
          </NavBase.AccountOptions>
        )}
      </NavBase.RightSide>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </NavBase.Root>
  );
}

const TooltipTrigger = styled(Tooltip.Trigger)`
  border: none;
  display: flex;
  align-items: center;
  background-color: var(--color-white);
  cursor: pointer;

  & > svg {
    position: relative;
    top: 0.1rem;
    stroke-width: 0.175rem;
    font-size: ${18 / 16}rem;
    stroke: var(--color-red-3);

    @media (prefers-reduced-motion: no-preference) {
      will-change: stroke;
      transition: stroke ${NavBase.NAV_TRANSITION_DURATION}ms;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        stroke: var(--color-red-1);
      }
    }
  }
`;

const TooltipContent = styled(Tooltip.Content)`
  width: fit-content;
  padding: 12px;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  color: var(--color-gray-1);
  text-align: center;
  background-color: var(--color-gray-9);
  cursor: pointer;
`;

const TooltipContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  & > svg {
    position: relative;
    top: 0.1rem;
    stroke-width: 0.175rem;
    font-size: ${18 / 16}rem;
    stroke: var(--color-red-3);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      & > svg {
        stroke: var(--color-red-1);
      }
    }
  }
`;

const TooltipArrow = styled(Tooltip.Arrow)`
  fill: var(--color-gray-9);
`;

const DropdownMenuContent = styled(DropdownMenu.Content)`
  width: 160px;
  background-color: var(--color-gray-9);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  position: relative;
  top: 8px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const DropdownMenuArrow = styled(DropdownMenu.Arrow)`
  fill: var(--color-gray-9);
`;

const DropdownMenuGroup = styled(DropdownMenu.Group)`
  width: 100%;
  padding: 4px 0;
`;

const DropdownMenuItem = styled(DropdownMenu.Item)`
  width: 100%;
  padding: 0px 16px;
  stroke: var(--color-red-3);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-red-3);
      color: var(--color-gray-10);
      stroke: var(--color-gray-10);
    }
  }
`;

const DropdownMenuAction = styled(Link)`
  display: flex;
  gap: 8px;
  text-decoration: none;
  color: var(--text-primary);

  & > svg {
    stroke: inherit;
    position: relative;
    top: 0.25em;
  }
`;

const DropdownMenuSeparator = styled(DropdownMenu.Separator)`
  height: 1px;
  width: "100%";
  background-color: var(--text-accent-primary);
`;

const DropdownMenuButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-size: ${16 / 16}rem;

  @media (prefers-reduced-motion: no-preference) {
    & > svg {
      will-change: stroke;
      transition: stroke ${NavBase.NAV_TRANSITION_DURATION}ms;
    }
  }

  & > svg {
    position: relative;
    top: 0.05rem;
    stroke: var(--color-red-4);
    stroke-width: 0.175rem;
    font-size: ${18 / 16}rem;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      & > svg {
        stroke: var(--color-red-1);
      }
    }
  }
`;

export default MainNav;
