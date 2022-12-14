import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { zeroRightClassName } from "react-remove-scroll-bar";
import {
  FiChevronDown,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "context/auth-context";
import { Toast, ToastProvider, ToastViewport } from "components/toast";
import useRect from "hooks/use-rect";
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import MenuButton from "components/menu-button";
import Spacer from "components/spacer";
import { Dialog, DialogTrigger, DialogContent } from "components/dialog";
import AccountDialogContent, {
  accountContentType,
} from "components/account-dialog-content";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";

const TAB_TRANSITION_DURATION = 400;

function MainNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [reportsTabRef, reportsTabRect] = useRect();
  const [rosterTabRef, rosterTabRect] = useRect();
  const [groupsTabRef, groupsTabRect] = useRect();

  const [transition, setTransition] = React.useState(false);
  const [activeTabRect, setActiveTabRect] = React.useState(null);

  const [currentAccountOpen, setCurrentAccountOpen] = React.useState(false);
  const [newAccountOpen, setNewAccountOpen] = React.useState(false);

  const [toastState, setToastState] = React.useState({
    title: "",
    message: "",
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
    let transitionTimeoutID;
    if (transition) {
      transitionTimeoutID = setTimeout(
        () => setTransition(false),
        TAB_TRANSITION_DURATION
      );
    }
    return () => clearTimeout(transitionTimeoutID);
  }, [transition]);

  function handleSignOut() {
    if (/\/dashboard\//.test(pathname)) {
      window.location.assign("/");
    } else {
      window.location.assign(window.location);
    }
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
    >
      <LeftSide>
        <h1>
          <SiteID href="/">
            <NavFireIcon />
            Commandability
          </SiteID>
        </h1>
      </LeftSide>
      {user.current ? (
        <Desktop
          role="list"
          style={{
            "--transition": transition
              ? `left ${TAB_TRANSITION_DURATION}ms, width ${TAB_TRANSITION_DURATION}ms`
              : "none",
            "--tab-width": `${activeTabRect?.width}px`,
            "--tab-left": `${activeTabRect?.left}px`,
          }}
        >
          <Tab ref={reportsTabRef}>
            <TabLink
              to="/dashboard/reports"
              onClick={() => setTransition(true)}
            >
              Reports
            </TabLink>
          </Tab>
          <Tab ref={rosterTabRef}>
            <TabLink to="/dashboard/roster" onClick={() => setTransition(true)}>
              Roster
            </TabLink>
          </Tab>
          <Tab ref={groupsTabRef}>
            <TabLink to="/dashboard/groups" onClick={() => setTransition(true)}>
              Groups
            </TabLink>
          </Tab>
        </Desktop>
      ) : null}
      {user.current ? (
        <Mobile>
          <RadixDialog.Root modal={false}>
            <RadixDialogTrigger asChild>
              <MenuButton />
            </RadixDialogTrigger>
            <RadixDialog.Portal>
              <RadixDialogContent onInteractOutside={(e) => e.preventDefault()}>
                <RadixDialog.Title>
                  <VisuallyHidden>Navigation</VisuallyHidden>
                </RadixDialog.Title>
                <RadixDialogMenu>
                  <RadixDialogItem to="/dashboard/reports">
                    Reports
                  </RadixDialogItem>
                  <RadixDialogItem to="/dashboard/roster">
                    Roster
                  </RadixDialogItem>
                  <RadixDialogItem to="/dashboard/groups">
                    Groups
                  </RadixDialogItem>
                </RadixDialogMenu>
              </RadixDialogContent>
            </RadixDialog.Portal>
          </RadixDialog.Root>
        </Mobile>
      ) : null}
      <RightSide>
        {user.current ? (
          <RadixDropdownMenu.Root>
            <RadixDropdownMenu.Trigger asChild>
              <DropdownMenuButton>
                {user.current.displayName}
                <FiChevronDown />
              </DropdownMenuButton>
            </RadixDropdownMenu.Trigger>
            <RadixDropdownMenu.Portal>
              <RadixDropdownMenuContent>
                <RadixDropdownMenuArrow />
                <RadixDropdownMenuGroup>
                  <RadixDropdownMenuItem asChild>
                    <DropdownMenuAction
                      as="a"
                      href="mailto:support@commandability.app?"
                    >
                      <FiHelpCircle />
                      <Spacer axis="horizontal" size={8} />
                      Contact us
                    </DropdownMenuAction>
                  </RadixDropdownMenuItem>
                  <RadixDropdownMenuItem asChild>
                    <DropdownMenuAction to="/dashboard/settings">
                      <FiSettings />
                      <Spacer axis="horizontal" size={8} />
                      Settings
                    </DropdownMenuAction>
                  </RadixDropdownMenuItem>
                </RadixDropdownMenuGroup>
                <RadixDropdownMenuSeparator />
                <RadixDropdownMenuGroup>
                  <RadixDropdownMenuItem asChild>
                    <DropdownMenuAction
                      as={UnstyledButton}
                      onClick={handleSignOut}
                    >
                      <FiLogOut />
                      <Spacer axis="horizontal" size={8} />
                      Sign out
                    </DropdownMenuAction>
                  </RadixDropdownMenuItem>
                </RadixDropdownMenuGroup>
              </RadixDropdownMenuContent>
            </RadixDropdownMenu.Portal>
          </RadixDropdownMenu.Root>
        ) : (
          <AccountOptions>
            <Dialog open={newAccountOpen} onOpenChange={setNewAccountOpen}>
              <DialogTrigger asChild>
                <Option>Create an account</Option>
              </DialogTrigger>
              <DialogContent title="Create an account" portal={false}>
                <AccountDialogContent
                  defaultContent={accountContentType.NEW_USER}
                  setToastOpen={setToastOpen}
                  setToastState={setToastState}
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={currentAccountOpen}
              onOpenChange={setCurrentAccountOpen}
            >
              <DialogTrigger asChild>
                <Option>Sign in</Option>
              </DialogTrigger>
              <DialogContent title="Sign in" portal={false}>
                <AccountDialogContent
                  defaultContent={accountContentType.CURRENT_USER}
                  setToastOpen={setToastOpen}
                  setToastState={setToastState}
                />
              </DialogContent>
            </Dialog>
          </AccountOptions>
        )}
      </RightSide>
      <ToastProvider>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          title={toastState.title}
          content={toastState.message}
        />
        <ToastViewport />
      </ToastProvider>
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
  background-color: var(--color-white);
  box-shadow: var(--nav-box-shadow);
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
  gap: 8px;
  font-size: ${18 / 16}rem;
  font-weight: normal;
  text-decoration: none;
  color: var(--color-gray-1);

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }
`;

const NavFireIcon = styled(UnstyledFireIcon)`
  fill: var(--color-red-3);
  min-width: 32px;
  min-height: 32px;

  @media (prefers-reduced-motion: no-preference) {
    will-change: fill;
    transition: fill 400ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      fill: var(--color-yellow-4);
    }
  }

  @media ${QUERIES.tabletAndSmaller} {
    fill: var(--color-red-3);
  }
`;

const Desktop = styled.ul`
  flex: 2;
  display: flex;
  max-width: 512px;
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
    background-color: var(--color-red-3);

    @media (prefers-reduced-motion: no-preference) {
      will-change: left, width;
      transition: var(--transition);
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

const TabLink = styled(NavLink)`
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  color: var(--color-gray-4);

  @media (prefers-reduced-motion: no-preference) {
    will-change: color, border-bottom;
    transition: color 400ms, border-bottom 400ms;
  }

  &.active {
    color: var(--color-red-3);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-red-3);
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

const RadixDialogContent = styled(RadixDialog.Content)`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    display: block;
  }

  position: fixed;
  // Remove one pixel for when users drag the dialog upwards while scrolling at the bottom of the screen
  top: calc(72px - 1px);
  width: 100%;
  font-size: ${18 / 16}rem;
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

const RadixDialogMenu = styled.div`
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
    ${DialogContent}[data-state="open"] & {
      animation: ${slideIn} 300ms ease-out forwards;
    }
    ${DialogContent}[data-state="closed"] & {
      animation: ${slideOut} 300ms ease-in forwards;
    }
  }
`;

const RadixDialogItem = styled(NavLink)`
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
      content: "→ ";
      position: relative;
      top: -0.05em;
      opacity: 1;
    }
  }
`;

const RadixDialogTrigger = styled(RadixDialog.Trigger)`
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container and the Menu icon and it's container
  padding-right: calc(((32px - 18.67px) / 2) - ((24px - 18px) / 2));
`;

const RightSide = styled.div`
  align-self: center;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container
  padding-right: calc((32px - 18.67px) / 2);

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const RadixDropdownMenuContent = styled(RadixDropdownMenu.Content)`
  width: 160px;
  background-color: var(--color-gray-9);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  position: relative;
  top: 8px;
  padding: 8px 0px;
  display: flex;
  flex-direction: column;

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const RadixDropdownMenuArrow = styled(RadixDropdownMenu.Arrow)`
  fill: var(--color-gray-9);
  position: relative;
  right: calc(160px / 2 - 16px);
`;

const RadixDropdownMenuGroup = styled(RadixDropdownMenu.Group)`
  padding: 4px 0px;
`;

const RadixDropdownMenuItem = styled(RadixDropdownMenu.Item)`
  width: 100%;
  padding: 0px 16px;
  color: var(--color-gray-1);
  stroke: var(--color-yellow-2);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-yellow-2);
      color: var(--color-white);
      stroke: var(--color-white);
    }
  }
`;

const DropdownMenuAction = styled(Link)`
  display: flex;
  width: 100%;
  text-decoration: none;
  color: inherit;

  & > svg {
    stroke: inherit;
    position: relative;
    top: 0.25em;
  }
`;

const RadixDropdownMenuSeparator = styled(RadixDropdownMenu.Separator)`
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
    top: 2px;
    stroke: var(--color-yellow-3);
    stroke-width: 0.175rem;
    font-size: ${20 / 16}rem;
  }
`;

const AccountOptions = styled.div`
  display: flex;
  gap: 16px;
`;

const Option = styled(UnstyledButton)`
  display: flex;
  color: var(--color-yellow-2);
  font-size: ${16 / 16}rem;
  font-weight: bold;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-yellow-4);
    }
  }
`;

export default MainNav;
