import Spacer from "components/spacer";
import * as React from "react";
import styled from "styled-components";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--hover-background-color": "var(--color-yellow-8)",
    "--color": "var(--color-yellow-2)",
    "--hover-color": "var(--color-yellow-3)",
  },
  dark: {
    "--background-color": "var(--color-yellow-2)",
    "--hover-background-color": "var(--color-yellow-3)",
    "--color": "var(--color-yellow-9)",
    "--hover-color": "var(--color-yellow-8)",
    "--selection-color": "var(--color-yellow-3)",
    "--selection-background": "var(--color-yellow-10)",
  },
};

const Button = React.forwardRef(
  (
    { theme = "light", type = "solid", icon, children, style, ...props },
    forwardedRef
  ) => {
    const themeStyles = THEMES[theme];

    if (type === "text") {
      return (
        <TextButton
          {...props}
          ref={forwardedRef}
          style={{ ...themeStyles, ...style }}
        >
          {children}
        </TextButton>
      );
    } else {
      return (
        <SolidButton
          {...props}
          ref={forwardedRef}
          style={{ ...themeStyles, ...style }}
        >
          {icon ? icon() : null}
          {icon ? <Spacer size={8} axis="horizontal" /> : null}
          <Text>{children}</Text>
        </SolidButton>
      );
    }
  }
);

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.05em;
`;

const TextButton = styled(ButtonBase)`
  padding: 0;
  background-color: transparent;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color);

  &:focus {
    outline-offset: 2px;
  }

  &:active {
    color: var(--hover-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--hover-color);
    }
  }
`;

const SolidButton = styled(ButtonBase)`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--background-color);
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color);

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

export default Button;
