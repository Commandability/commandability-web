import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Spacer from "components/spacer";

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
    {
      theme = "light",
      type = "solid",
      icon,
      to,
      href,
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const themeStyles = THEMES[theme];

    function selectTag() {
      if (to) {
        return Link;
      } else if (href) {
        return "a";
      } else {
        return "button";
      }
    }

    if (type === "text") {
      return (
        <TextButton
          as={selectTag()}
          ref={forwardedRef}
          style={{ ...themeStyles, ...style }}
          to={to}
          href={href}
          {...props}
        >
          {children}
        </TextButton>
      );
    } else {
      return (
        <SolidButton
          as={selectTag()}
          ref={forwardedRef}
          style={{ ...themeStyles, ...style }}
          to={to}
          href={href}
          {...props}
        >
          {icon ? icon() : null}
          {icon ? <Spacer size={8} axis="horizontal" /> : null}
          <Text>{children}</Text>
        </SolidButton>
      );
    }
  }
);

const TextButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.05em;
  padding: 0;
  background-color: transparent;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
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

const SolidButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.05em;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--background-color);
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
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
