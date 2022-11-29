import * as React from "react";
import styled from "styled-components";

import UnstyledButton from "components/unstyled-button";

const THEMES = {
  light: {
    "--color": "var(--color-yellow-9)",
    "--color-disabled": "var(--color-gray-4)",
    "--background-color": "var(--color-yellow-2)",
  },
  dark: {
    "--color": "var(--color-yellow-2)",
    "--color-disabled": "var(--color-gray-6)",
    "--background-color": "var(--color-yellow-9)",
  },
};

function IconButton({ theme = "dark", icon, children, style, ...props }) {
  if (!THEMES[theme]) throw new Error(`Unknown theme provided to Button.`);

  const themeStyles = THEMES[theme];

  return (
    <Wrapper
      style={{
        ...themeStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled(UnstyledButton)`
  display: grid;
  place-content: center;
  padding: 8px;
  border-radius: 100%;
  color: var(--color);

  & > svg {
    stroke-width: 0.175rem;
    width: 24px;
    height: 24px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--background-color);

      &:disabled {
        background-color: transparent;
      }
    }
  }

  &:active {
    background-color: var(--background-color);
  }

  &:focus {
    outline-offset: 2px;
  }

  &:disabled {
    color: var(--color-disabled);
  }
`;

export default IconButton;
