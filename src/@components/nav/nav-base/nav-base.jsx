import styled from "styled-components";

import UnstyledButton from "@components/unstyled-button";
import { QUERIES } from "@constants";
import { ReactComponent as UnstyledFireIcon } from "@assets/icons/fire-icon.svg";

export const TAB_TRANSITION_DURATION = 500;
export const NAV_TRANSITION_DURATION = 300;

export const Root = styled.nav`
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

export const LeftSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

export const SiteID = styled.a`
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
    color: var(--text-primary);
  }
`;

export const FireIcon = styled(UnstyledFireIcon)`
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

export const Middle = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

export const Desktop = styled.div`
  flex: 1;
  display: flex;

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

export const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const Mobile = styled.div`
  display: none;

  @media ${QUERIES.tabletAndSmaller} {
    display: flex;
  }
`;

export const RightSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container
  padding-right: calc((32px - 18.67px) / 2);

  @media ${QUERIES.tabletAndSmaller} {
    display: none;
  }
`;

export const AccountOptions = styled.div`
  display: flex;
  gap: 16px;
`;

export const Option = styled(UnstyledButton)`
  display: flex;
  color: var(--color);
  font-size: ${16 / 16}rem;
  font-weight: bold;
  text-decoration: none;

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
