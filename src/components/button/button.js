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
      variant = "solid",
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
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.05em;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color);
  background-color: ${(props) =>
    props.variant === "solid" ? "var(--background-color)" : "transparent"};
  padding: ${(props) => (props.variant === "solid" ? "8px 16px" : "0px")};
  border-radius: ${(props) => (props.variant === "solid" ? "8px" : "0px")};

  & > svg {
    stroke-width: 0.175rem;
  }

  &:focus {
    outline-offset: 2px;
  }

  &:active {
    color: ${(props) =>
      props.variant === "solid" ? "var(--color);" : "var(--hover-color);"};
    background-color: ${(props) =>
      props.variant === "solid"
        ? "var(--hover-background-color);"
        : "transparent"};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${(props) =>
        props.variant === "solid" ? "var(--color);" : "var(--hover-color);"};
      background-color: ${(props) =>
        props.variant === "solid"
          ? "var(--hover-background-color);"
          : "transparent"};
    }
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
`;

export default Button;
