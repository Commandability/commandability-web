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
  },
};

function Pill({ theme, angle, children }) {
  const styles = THEMES[theme];

  return (
    <PillBase style={styles}>
      {children}
      <Spacer size={8} axis="horizontal" />
      {angle ? <FiChevronRight size={20} /> : null}
    </PillBase>
  );
}

const PillBase = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 128px;
  border: none;
  cursor: pointer;
  user-select: none;
  background-color: var(--background-color);
  color: var(--color);

  &:hover {
    background-color: var(--hover-background-color);
  }

  &:focus {
    outline-style: solid;
    outline-color: var(--color-yellow-9);
    outline-offset: 4px;
  }
`;

export default Pill;
