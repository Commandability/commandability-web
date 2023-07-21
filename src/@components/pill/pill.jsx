import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import usePrefersReducedMotion from "@hooks/use-prefers-reduced-motion";
import Spacer from "@components/spacer";
import { COLORS } from "@constants";

const THEMES = {
  light: {
    "--background-color":
      "linear-gradient(135deg,var(--color-yellow-9),var(--color-white))",
    "--hover-background-color": `hsl(${COLORS.yellow[10]} / 0.6)`,
    "--hover-text-background-color": `hsl(${COLORS.gray[5]})`,
    "--color": "var(--color-yellow-2)",
    "--icon-color": "var(--color-yellow-4)",
  },
  dark: {
    "--background-color":
      "linear-gradient(135deg,var(--color-yellow-1),var(--color-yellow-3))",
    "--hover-background-color": `hsl(${COLORS.yellow[3]} / 0.6)`,
    "--hover-text-background-color": `hsl(${COLORS.gray[2]})`,
    "--color": "var(--color-yellow-9)",
    "--icon-color": "var(--color-yellow-7)",
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
      <PillWrapper
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
      </PillWrapper>
    );
  }
);

Pill.displayName = "Pill";

const PillWrapper = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999999px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  background-image: var(--background-color);
  font-weight: bold;
  color: var(--color);
  text-decoration: none;
  box-shadow: none;
  text-shadow: none;

  & > svg {
    stroke-width: 0.175rem;
    color: var(--icon-color);
  }

  &:focus {
    outline-offset: 2px;
  }

  &:active {
    box-shadow: var(--hover-background-color) 0px 1px 24px;
  }

  transition: box-shadow 300ms ease, text-shadow 300ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: var(--hover-background-color) 0px 1px 24px;
      text-shadow: var(--hover-text-background-color) 0px 3px 12px;
    }
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
`;

export default Pill;
