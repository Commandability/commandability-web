import * as React from "react";
import styled from "styled-components";

import UnstyledButton from "@components/unstyled-button";
import VisuallyHidden from "@components/visually-hidden";

const MenuButton = React.forwardRef(
  ({ value, onChange, ...props }, forwardedRef) => {
    if (typeof onChange !== "function")
      throw new Error("onChange must be a function type");

    return (
      <Wrapper
        ref={forwardedRef}
        data-state={value ? "open" : "closed"}
        aria-pressed={value}
        onClick={() => onChange(!value)}
        {...props}
      >
        <BarOne />
        <BarTwo />
        <BarThree />
        <VisuallyHidden>Toggle menu</VisuallyHidden>
      </Wrapper>
    );
  }
);

MenuButton.displayName = "MenuButton";

const Wrapper = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  &::after {
    --tap-increment: -14px;
    content: "";
    position: absolute;
    top: var(--tap-increment);
    left: var(--tap-increment);
    right: var(--tap-increment);
    bottom: var(--tap-increment);
  }
`;

const Bar = styled.span`
  width: 24px;
  height: 2px;
  background-color: var(--color-gray-1);
`;

const BarOne = styled(Bar)`
  @media (prefers-reduced-motion: no-preference) {
    will-change: transform;
    transition: transform 400ms;
  }

  ${Wrapper}[data-state="open"] & {
    transform: translateY(6px) rotate(-45deg);
  }
`;

const BarTwo = styled(Bar)`
  @media (prefers-reduced-motion: no-preference) {
    will-change: opacity;
    transition: opacity 400ms;
  }

  ${Wrapper}[data-state="open"] & {
    opacity: 0;
  }
`;

const BarThree = styled(Bar)`
  @media (prefers-reduced-motion: no-preference) {
    will-change: transform;
    transition: transform 400ms;
  }

  // data-state is controlled by radix's dialog trigger
  ${Wrapper}[data-state="open"] & {
    transform: translateY(-6px) rotate(45deg);
  }
`;

export default MenuButton;
