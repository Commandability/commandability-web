import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import Spacer from "components/spacer";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--hover-background-color": "var(--color-yellow-10)",
    "--color": "var(--color-yellow-2)",
  },
  dark: {
    "--background-color": "var(--color-yellow-2)",
    "--hover-background-color": "var(--color-yellow-3)",
    "--color": "var(--color-yellow-9)",
    "--selection-color": "var(--color-yellow-3)",
    "--selection-background": "var(--color-yellow-10)",
  },
};

function Pill({ theme, angle, targetId, to, onClick, href, children }) {
  const styles = THEMES[theme];

  function smoothScroll() {
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <PillBase
      style={styles}
      to={targetId ? `#${targetId}` : to}
      onClick={(event) => {
        targetId && smoothScroll(event);
        onClick && onClick(event);
      }}
      href={href}
      as={(() => {
        if (to || targetId) {
          return Link;
        } else if (onClick) {
          return "button";
        } else if (href) {
          return "a";
        } else {
          throw new Error(
            "Pill must have either a to, targetId, onClick, or href"
          );
        }
      })()}
    >
      <Text>{children}</Text>
      <Spacer size={8} axis="horizontal" />
      {angle ? <FiChevronRight /> : null}
    </PillBase>
  );
}

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
  transition: background-color 200ms;

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
