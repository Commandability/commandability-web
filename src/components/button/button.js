import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Spacer from "components/spacer";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--hover-background-color": "var(--color-yellow-10)",

    "--color": "var(--color-yellow-2)",
    "--color-alternate": "var(--color-yellow-9)",
    "--hover-color-alternate": "var(--color-yellow-10)",

    "--border-color": "var(--color-yellow-6)",
    "--hover-border-color": "var(--color-yellow-7)",
  },
  dark: {
    "--background-color": "var(--color-yellow-2)",
    "--hover-background-color": "var(--color-yellow-1)",

    "--color": "var(--color-yellow-9)",
    "--color-alternate": "var(--color-yellow-2)",
    "--hover-color-alternate": "var(--color-yellow-1)",

    "--border-color": "var(--color-yellow-4)",
    "--hover-border-color": "var(--color-yellow-3)",
  },
};

const Button = React.forwardRef(
  (
    {
      theme = "dark",
      variant = "primary",
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

    return (
      <ButtonWrapper
        as={selectTag()}
        ref={forwardedRef}
        style={{
          ...themeStyles,
          ...style,
        }}
        to={to}
        href={href}
        theme={theme}
        variant={variant}
        {...props}
      >
        {icon ? icon() : null}
        {icon ? <Spacer size={8} axis="horizontal" /> : null}
        <Text>{children}</Text>
      </ButtonWrapper>
    );
  }
);

const ButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.05em;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;

  color: ${(props) => {
    switch (props.variant) {
      case "secondary":
      case "tertiary":
        return "var(--color-alternate)";
      default:
        return "var(--color)";
    }
  }};
  background-color: ${(props) => {
    switch (props.variant) {
      case "secondary":
      case "tertiary":
        return "transparent";
      default:
        return "var(--background-color)";
    }
  }};
  padding: ${(props) => {
    switch (props.variant) {
      case "secondary":
        return "calc(8px - 2px) calc(16px - 2px)";
      case "tertiary":
        return "0px";
      default:
        return "8px 16px";
    }
  }};
  border: ${(props) => {
    switch (props.variant) {
      case "secondary":
        return "2px solid var(--border-color)";
      default:
        return "none";
    }
  }};
  border-radius: ${(props) => {
    switch (props.variant) {
      case "tertiary":
        return "0px";
      default:
        return "8px";
    }
  }};

  & > svg {
    stroke-width: 0.175rem;
  }

  &:focus {
    outline-offset: 2px;
  }

  --selection-color: ${(props) => {
    switch (props.variant) {
      case "secondary":
      case "tertiary":
        return "var(--color);";
      default:
        return "var(--color-alternate);";
    }
  }};
  --selection-background: ${(props) => {
    switch (props.variant) {
      case "secondary":
      case "tertiary":
        return "var(--color-alternate);";
      default:
        return "var(--color);";
    }
  }};

  &:active {
    color: ${(props) => {
      switch (props.variant) {
        case "secondary":
        case "tertiary":
          return "var(--hover-color-alternate);";
        default:
          return "var(--color);";
      }
    }};
    border-color: ${(props) => {
      switch (props.variant) {
        case "secondary":
          return "var(--hover-border-color);";
        default:
          return "transparent";
      }
    }};
    background-color: ${(props) => {
      switch (props.variant) {
        case "secondary":
        case "tertiary":
          return "transparent";
        default:
          return "var(--hover-background-color);";
      }
    }};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${(props) => {
        switch (props.variant) {
          case "secondary":
          case "tertiary":
            return "var(--hover-color-alternate);";
          default:
            return "var(--color);";
        }
      }};
      border-color: ${(props) => {
        switch (props.variant) {
          case "secondary":
            return "var(--hover-border-color);";
          default:
            return "transparent";
        }
      }};
      background-color: ${(props) => {
        switch (props.variant) {
          case "secondary":
          case "tertiary":
            return "transparent";
          default:
            return "var(--hover-background-color);";
        }
      }};
    }
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
`;

export default Button;
