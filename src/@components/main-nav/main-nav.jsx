import * as React from "react";
import styled from "styled-components";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { zeroRightClassName } from "react-remove-scroll-bar";
import {
  FiChevronDown,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "@context/auth-context";
import * as NavMenu from "@components/nav-menu";
import * as Toast from "@components/toast";
import useRect from "@hooks/use-rect";
import UnstyledButton from "@components/unstyled-button";
import * as Dialog from "@components/dialog";
import AccountDialogContent, {
  accountContentType,
} from "@components/account-dialog-content";
import { ReactComponent as UnstyledFireIcon } from "@assets/icons/fire-icon.svg";
import { QUERIES } from "@constants";

const TAB_TRANSITION_DURATION = 400;

function MainNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const navRef = React.useRef();

  const [reportsTabRef, reportsTabRect] = useRect();
  const [rosterTabRef, rosterTabRect] = useRect();
  const [groupsTabRef, groupsTabRect] = useRect();

  const [transition, setTransition] = React.useState(false);
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
      ref={navRef}
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
        </Mobile>
      ) : null}
      <RightSide>
        {user.current ? (
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
                    <DropdownMenuAction to="/dashboard/settings">
                      <FiSettings />
                      Settings
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
        ) : (
          <AccountOptions>
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
          </AccountOptions>
        )}
      </RightSide>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
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
      fill: var(--color-yellow-3);
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
  }
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

const AccountOptions = styled.div`
  display: flex;
  gap: 16px;
`;

const Option = styled(UnstyledButton)`
  display: flex;
  color: var(--color-red-3);
  font-size: ${16 / 16}rem;
  font-weight: bold;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-red-1);
    }
  }
`;

export default MainNav;
