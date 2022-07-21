import * as React from "react";
import styled, { keyframes } from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { FiChevronDown } from "react-icons/fi";

import { useAuth } from "context/auth-context";
import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";
import { ReactComponent as UnstyledFireIcon } from "assets/icons/fire-icon.svg";
import { QUERIES } from "constants.js";
import MenuButton from "components/menu-button";

function MainNav() {
  const reportsTabRef = React.useRef();
  const rosterTabRef = React.useRef();
  const groupsTabRef = React.useRef();

  const [activeTab, setActiveTab] = React.useState({ ref: null });

  const { user } = useAuth();
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    const effect = async () => {
      // Don't calculate tab with until the font has loaded
      await document.fonts.ready;

      if (/\/dashboard\/reports(?:$|\/)/.test(pathname)) {
        setActiveTab({
          width: reportsTabRef.current.getBoundingClientRect().width,
          left: reportsTabRef.current.getBoundingClientRect().left,
          ref: reportsTabRef,
        });
      } else if (/\/dashboard\/roster(?:$|\/)/.test(pathname)) {
        setActiveTab({
          width: rosterTabRef.current.getBoundingClientRect().width,
          left: rosterTabRef.current.getBoundingClientRect().left,
          ref: rosterTabRef,
        });
      } else if (/\/dashboard\/groups(?:$|\/)/.test(pathname)) {
        setActiveTab({
          width: groupsTabRef.current.getBoundingClientRect().width,
          left: groupsTabRef.current.getBoundingClientRect().left,
          ref: groupsTabRef,
        });
      }
    };
    effect();
  }, [pathname]);

  React.useLayoutEffect(() => {
    function handleResize() {
      setActiveTab((prevActiveTab) => ({
        width: prevActiveTab.ref?.current.getBoundingClientRect().width,
        left: prevActiveTab.ref?.current.getBoundingClientRect().left,
        ref: prevActiveTab.ref,
      }));
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Nav>
      <LeftSide>
        <SiteID href="/">
          <NavFireIcon />
          Commandability
        </SiteID>
      </LeftSide>
      {user.current ? (
        <Desktop
          style={{
            "--tab-width": `${activeTab?.width}px`,
            "--tab-left": `${activeTab?.left}px`,
          }}
        >
          <Tab ref={reportsTabRef} to="/dashboard/reports">
            Reports
          </Tab>
          <Tab ref={rosterTabRef} to="/dashboard/roster">
            Roster
          </Tab>
          <Tab ref={groupsTabRef} to="/dashboard/groups">
            Groups
          </Tab>
        </Desktop>
      ) : null}
      {user.current ? (
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
                  <Item to="/dashboard/reports">Reports</Item>
                  <Item to="/dashboard/roster">Roster</Item>
                  <Item to="/dashboard/groups">Groups</Item>
                </Menu>
              </Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Mobile>
      ) : null}
      <RightSide>
        {user.current ? (
          <DropDown>
            {user.current.displayName}
            <FiChevronDown />
          </DropDown>
        ) : (
          <AccountOptions>
            <Option>Create an account</Option>
            <Option>Sign in</Option>
          </AccountOptions>
        )}
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
  background-color: var(--color-white);
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
  color: var(--color-gray-1);
  gap: 8px;

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

const Desktop = styled.div`
  flex: 2;
  display: flex;
  max-width: 512px;
  justify-content: space-between;
  align-self: stretch;

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
      transition: left 400ms, width 400ms;
    }
  }

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

const Tab = styled(NavLink)`
  text-transform: uppercase;
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const Item = styled(NavLink)`
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

const DropDown = styled(UnstyledButton)`
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
