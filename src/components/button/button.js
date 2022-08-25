import Spacer from "components/spacer";
import * as React from "react";
import styled from "styled-components";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--hover-background-color": "var(--color-yellow-8)",
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

const Button = React.forwardRef(
  ({ theme, icon, children, style, ...props }, forwardedRef) => {
    const themeStyles = THEMES[theme];

    return (
      <ButtonBase
        {...props}
        ref={forwardedRef}
        style={{ ...themeStyles, ...style }}
      >
        {icon ? icon() : null}
        {icon ? <Spacer size={8} axis="horizontal" /> : null}
        <Text>{children}</Text>
      </ButtonBase>
    );
  }
);

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
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
