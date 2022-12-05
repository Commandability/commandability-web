import * as React from "react";
import styled from "styled-components";

import UnstyledButton from "components/unstyled-button";

const THEMES = {
  light: {
    "--color": "var(--color-yellow-9)",
    "--color-disabled": "var(--color-gray-4)",
    "--color-hover": "var(--color-yellow-10)",
  },
  dark: {
    "--color": "var(--color-yellow-2)",
    "--color-disabled": "var(--color-gray-6)",
    "--color-hover": "var(--color-yellow-1)",
  },
};

function IconButton({ theme = "dark", children, style, ...props }) {
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
  color: var(--color);

  & > svg {
    stroke-width: 0.175rem;
    width: 24px;
    height: 24px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-hover);
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
