import React from "react";
import styled from "styled-components";

import * as NavBase from "@components/nav/nav-base";

export const Root = styled.ul`
  flex: 1;
  display: flex;
  justify-content: space-between;
  max-width: var(--max-width);
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
`;

export const Tab = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <TabWrapper ref={forwardedRef}>
      <TabLink {...props}>{children}</TabLink>
    </TabWrapper>
  );
});

Tab.displayName = "Tab";

const TabWrapper = styled.li`
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TabLink = styled.a`
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  color: var(--color);

  @media (prefers-reduced-motion: no-preference) {
    will-change: color, border-bottom;
    transition: color ${NavBase.NAV_TRANSITION_DURATION}ms,
      border-bottom ${NavBase.NAV_TRANSITION_DURATION}ms;
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
