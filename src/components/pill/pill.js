import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";

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

function Pill({ theme, angle, href, onClick, children }) {
  const styles = THEMES[theme];

  return (
    <PillBase
      style={styles}
      href={href}
      onClick={onClick}
      as={onClick ? "button" : "a"}
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

  & > svg {
    stroke-width: 0.175rem;
  }

  &:active {
    background-color: var(--hover-background-color);
  }

  &:focus-visible {
    background-color: var(--hover-background-color);
    outline-color: var(--color-yellow-9);
    outline-style: solid;
    outline-width: 2px;
    outline-offset: 4px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--hover-background-color);
    }

    &:active {
      outline-color: var(--color-yellow-9);
      outline-style: solid;
      outline-width: 2px;
      outline-offset: 4px;
    }
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
`;

export default Pill;
