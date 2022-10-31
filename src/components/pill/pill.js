import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import usePrefersReducedMotion from "hooks/use-prefers-reduced-motion";
import Spacer from "components/spacer";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--hover-background-color": "var(--color-yellow-10)",
    "--color": "var(--color-yellow-2)",
  },
  dark: {
    "--background-color": "var(--color-yellow-2)",
    "--hover-background-color": "var(--color-yellow-1)",
    "--color": "var(--color-yellow-9)",
    "--selection-color": "var(--color-yellow-3)",
    "--selection-background": "var(--color-yellow-10)",
  },
};

const Pill = React.forwardRef(
  (
    { theme, angle, targetRef, to, onClick, href, children, style, ...props },
    forwardedRef
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const themeStyles = THEMES[theme];

    function smoothScroll() {
      targetRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    function selectTag() {
      if (to) {
        return Link;
      } else if (href) {
        return "a";
      } else {
        return "button";
      }
    }

    return (
      <PillBase
        {...props}
        ref={forwardedRef}
        style={{ ...themeStyles, ...style }}
        to={to}
        onClick={(event) => {
          targetRef && smoothScroll(event);
          onClick && onClick(event);
        }}
        href={href}
        as={selectTag()}
      >
        <Text>{children}</Text>
        <Spacer size={8} axis="horizontal" />
        {angle ? <FiChevronRight /> : null}
      </PillBase>
    );
  }
);

const PillBase = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999999px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  background-color: var(--background-color);
  font-weight: bold;
  color: var(--color);
  text-decoration: none;

  @media (prefers-reduced-motion: no-preference) {
    will-change: background-color;
    transition: background-color 200ms;
  }

  & > svg {
    stroke-width: 0.175rem;
  }

  &:focus {
    outline-offset: 2px;
  }

  &:active {
    background-color: var(--hover-background-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--hover-background-color);
    }
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
`;

export default Pill;
