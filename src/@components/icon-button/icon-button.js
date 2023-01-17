import * as React from "react";
import styled from "styled-components";

import UnstyledButton from "@components/unstyled-button";

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

const SIZES = {
  small: {
    "--dimension": "24px",
    "--stroke-width": "0.175rem",
  },
  large: {
    "--dimension": "48px",
    "--stroke-width": "0.125rem",
  },
};

function IconButton({
  icon,
  theme = "dark",
  size = "small",
  children,
  style,
  ...props
}) {
  const themeStyles = THEMES[theme];
  const sizeStyles = SIZES[size];

  return (
    <Wrapper
      style={{
        ...themeStyles,
        ...sizeStyles,
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
    stroke-width: var(--stroke-width);
    width: var(--dimension);
    height: var(--dimension);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-hover);
    }
  }

  &:focus {
    outline-offset: 2px;
  }

  &:disabled {
    color: var(--color-disabled);
  }
`;

export default IconButton;
