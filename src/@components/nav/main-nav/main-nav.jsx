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
import AccountDialogContent, {
  accountContentType,
} from "@components/account-dialog-content";
import { QUERIES } from "@constants";
import Spacer from "@components/spacer/spacer";

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
              "--color": "var(--color-gray-1)",
            }}
          >
            <NavBase.FireIcon
              style={{
                "--fill": "var(--color-red-3)",
                "--fill-active": "var(--color-yellow-3)",
              }}
            />
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
                  "--color-active": "var(--color-red-3)",
                  "--max-width": "512px",
                }}
              >
                <NavTabs.Tab
                  ref={reportsTabRef}
                  style={{
                    "--color": "var(--color-gray-4)",
                    "--color-active": "var(--color-red-3)",
                  }}
                  to="/dashboard/reports"
                  onClick={() => setTabTransition(true)}
                  as={NavLink}
                >
                  Reports
                </NavTabs.Tab>
                <NavTabs.Tab
                  ref={rosterTabRef}
                  style={{
                    "--color": "var(--color-gray-4)",
                    "--color-active": "var(--color-red-3)",
                  }}
                  to="/dashboard/roster"
                  onClick={() => setTabTransition(true)}
                  as={NavLink}
                >
                  Roster
                </NavTabs.Tab>
                <NavTabs.Tab
                  ref={groupsTabRef}
                  style={{
                    "--color": "var(--color-gray-4)",
                    "--color-active": "var(--color-red-3)",
                  }}
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
                <Tooltip.Root delayDuration={200}>
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
                          Verify your account
                          <FiArrowRight />
                        </TooltipContentWrapper>
                        <TooltipArrow
                          className="TooltipArrow"
                          height={12}
                          width={12}
                        />
                      </TooltipContent>
                    </Link>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
            <Spacer size={8} axis="horizontal" />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <DropdownMenuButton>
                  {user.current.displayName}
                  <FiChevronDown />
                </DropdownMenuButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenuContent>
                  <DropdownMenuArrow />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <DropdownMenuAction
                        as="a"
                        href="mailto:support@commandability.app?"
                      >
                        <FiHelpCircle />
                        Contact us
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
                  <AccountDialogContent
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
                  <AccountDialogContent
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
  position: relative;
  right: calc(160px / 2 - 16px);
`;

const DropdownMenuGroup = styled(DropdownMenu.Group)`
  width: 100%;
  padding: 4px 0;
`;

const DropdownMenuItem = styled(DropdownMenu.Item)`
  width: 100%;
  padding: 0px 16px;
  color: var(--color-gray-1);
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
  color: inherit;

  & > svg {
    stroke: inherit;
    position: relative;
    top: 0.25em;
  }
`;

const DropdownMenuSeparator = styled(DropdownMenu.Separator)`
  height: 1px;
  width: "100%";
  background-color: var(--color-gray-6);
`;

const DropdownMenuButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gray-1);
  font-size: ${16 / 16}rem;

  & > svg {
    position: relative;
    top: 0.05rem;
    stroke: var(--color-red-4);
    stroke-width: 0.175rem;
    font-size: ${18 / 16}rem;
  }
`;

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
    &:hover {
      stroke: var(--color-yellow-3);
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
  &:hover {
    & > svg {
      stroke: var(--color-yellow-2);
    }
  }
`;

const TooltipArrow = styled(Tooltip.Arrow)`
  fill: var(--color-gray-9);
`;

export default MainNav;
