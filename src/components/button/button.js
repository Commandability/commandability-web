import Spacer from "components/spacer";
import * as React from "react";
import styled from "styled-components";

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

function Button({ theme, icon, children }) {
  const styles = THEMES[theme];

  return (
    <ButtonBase style={styles}>
      {icon ? icon() : null}
      <Spacer size={8} axis="horizontal" />
      {children}
    </ButtonBase>
  );
}

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
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

export default Button;
