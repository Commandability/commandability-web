import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--background-color-hover": "var(--color-yellow-10)",
    "--background-color-disabled": "var(--color-gray-6)",

    "--color": "var(--color-yellow-2)",
    "--color-disabled": "var(--color-gray-1)",

    "--color-alternate": "var(--color-yellow-9)",
    "--color-alternate-hover": "var(--color-yellow-10)",
    "--color-alternate-disabled": "var(--color-gray-6)",

    "--accent-color": "var(--color-yellow-6)",
    "--accent-color-hover": "var(--color-yellow-7)",
    "--accent-color-disabled": "var(--color-gray-4)",

    "--accent-color-alternate": "var(--color-yellow-3)",
    "--accent-color-alternate-disabled": "var(--color-gray-3)",
  },
  dark: {
    "--background-color": "var(--color-yellow-2)",
    "--background-color-hover": "var(--color-yellow-1)",
    "--background-color-disabled": "var(--color-gray-4)",

    "--color": "var(--color-yellow-9)",
    "--color-disabled": "var(--color-gray-9)",

    "--color-alternate": "var(--color-yellow-2)",
    "--color-alternate-hover": "var(--color-yellow-1)",
    "--color-alternate-disabled": "var(--color-gray-4)",

    "--accent-color": "var(--color-yellow-4)",
    "--accent-color-hover": "var(--color-yellow-3)",
    "--accent-color-disabled": "var(--color-gray-6)",

    "--accent-color-alternate": "var(--color-yellow-8)",
    "--accent-color-alternate-disabled": "var(--color-gray-8)",
  },
};

const VARIANTS = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
};

const SIZES = {
  small: {
    "--font-size": `${16 / 16}rem`,
    "--stroke-width": "0.175rem",
  },
  medium: {
    "--font-size": `${24 / 16}rem`,
    "--stroke-width": "0.15rem",
  },
  large: {
    "--font-size": `${40 / 16}rem`,
    "--stroke-width": "0.125rem",
  },
};

const Button = React.forwardRef(
  (
    {
      theme = "dark",
      variant = "primary",
      size = "small",
      to,
      href,
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    if (!THEMES[theme]) throw new Error(`Unknown theme provided to Button.`);
    if (!VARIANTS[variant] && variant)
      throw new Error(`Unknown variant provided to Button.`);
    if (!SIZES[size]) throw new Error(`Unknown size provided to Button.`);

    const themeStyles = THEMES[theme];
    const sizesStyles = SIZES[size];

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
          ...sizesStyles,
          ...style,
        }}
        to={to}
        href={href}
        theme={theme}
        variant={variant}
        {...props}
      >
        {children}
      </ButtonWrapper>
    );
  }
);

Button.displayName = "Button";

const ButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  letter-spacing: 0.05em;
  font-weight: bold;
  font-size: var(--font-size);
  text-transform: uppercase;
  text-decoration: none;

  color: ${(props) => {
    switch (props.variant) {
      case VARIANTS.secondary:
      case VARIANTS.tertiary:
        return "var(--color-alternate)";
      default:
        return "var(--color)";
    }
  }};
  background-color: ${(props) => {
    switch (props.variant) {
      case VARIANTS.secondary:
      case VARIANTS.tertiary:
        return "transparent";
      default:
        return "var(--background-color)";
    }
  }};
  padding: ${(props) => {
    switch (props.variant) {
      case VARIANTS.secondary:
        return "calc(8px - 2px) calc(16px - 2px)";
      case VARIANTS.tertiary:
        return "0";
      default:
        return "8px 16px";
    }
  }};
  border: ${(props) => {
    switch (props.variant) {
      case VARIANTS.secondary:
        return "2px solid var(--accent-color)";
      default:
        return "none";
    }
  }};
  border-radius: ${(props) => {
    switch (props.variant) {
      case VARIANTS.tertiary:
        return "0";
      default:
        return "var(--border-radius);";
    }
  }};

  & > svg {
    stroke-width: var(--stroke-width);

    stroke: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
        case VARIANTS.tertiary:
          return "var(--accent-color);";
        default:
          return "var(--accent-color-alternate);";
      }
    }};
  }

  &:focus {
    outline-offset: 2px;
  }

  --selection-color: ${(props) => {
    switch (props.variant) {
      case VARIANTS.secondary:
      case VARIANTS.tertiary:
        return "var(--color);";
      default:
        return "var(--color-alternate);";
    }
  }};
  --selection-background: ${(props) => {
    switch (props.variant) {
      case VARIANTS.secondary:
      case VARIANTS.tertiary:
        return "var(--color-alternate);";
      default:
        return "var(--color);";
    }
  }};

  &:active {
    color: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
        case VARIANTS.tertiary:
          return "var(--color-alternate-hover);";
        default:
          return "var(--color);";
      }
    }};
    & > svg {
      stroke: ${(props) => {
        switch (props.variant) {
          case VARIANTS.secondary:
          case VARIANTS.tertiary:
            return "var(--accent-color-hover)";
          default:
            return "var(--accent-color-alternate)";
        }
      }};
    }
    border-color: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
          return "var(--accent-color-hover);";
        default:
          return "transparent";
      }
    }};
    background-color: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
        case VARIANTS.tertiary:
          return "transparent";
        default:
          return "var(--background-color-hover);";
      }
    }};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${(props) => {
        switch (props.variant) {
          case VARIANTS.secondary:
          case VARIANTS.tertiary:
            return "var(--color-alternate-hover);";
          default:
            return "var(--color);";
        }
      }};
      & > svg {
        stroke: ${(props) => {
          switch (props.variant) {
            case VARIANTS.secondary:
            case VARIANTS.tertiary:
              return "var(--accent-color-hover)";
            default:
              return "var(--accent-color-alternate)";
          }
        }};
      }
      border-color: ${(props) => {
        switch (props.variant) {
          case VARIANTS.secondary:
            return "var(--accent-color-hover);";
          default:
            return "transparent";
        }
      }};
      background-color: ${(props) => {
        switch (props.variant) {
          case VARIANTS.secondary:
          case VARIANTS.tertiary:
            return "transparent";
          default:
            return "var(--background-color-hover);";
        }
      }};
    }
  }

  &:disabled {
    cursor: auto;
    color: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
        case VARIANTS.tertiary:
          return "var(--color-alternate-disabled)";
        default:
          return "var(--color-disabled)";
      }
    }};
    & > svg {
      stroke: ${(props) => {
        switch (props.variant) {
          case VARIANTS.secondary:
          case VARIANTS.tertiary:
            return "var(--accent-color-disabled)";
          default:
            return "var(--accent-color-alternate-disabled)";
        }
      }};
    }
    border-color: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
          return "var(--accent-color-disabled);";
        default:
          return "transparent";
      }
    }};
    background-color: ${(props) => {
      switch (props.variant) {
        case VARIANTS.secondary:
        case VARIANTS.tertiary:
          return "transparent";
        default:
          return "var(--background-color-disabled)";
      }
    }};
  }
`;

export default Button;
