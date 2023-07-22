import * as React from "react";
import styled, { keyframes } from "styled-components";
import * as RadixToast from "@radix-ui/react-toast";
import { fullWidthClassName } from "react-remove-scroll-bar";
import { FiAlertTriangle } from "react-icons/fi";

export const unknownState = {
  title: "Unknown error",
  description: "Try again later or contact support.",
  icon: <FiAlertTriangle />,
};

export const Provider = RadixToast.Provider;

export const Viewport = styled(RadixToast.Viewport)`
  --viewport-padding: 8px;
  position: fixed;
  margin: 0 auto;
  inset: 0;
  top: auto;
  bottom: 64px;
  padding: var(--viewport-padding);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 384px;
  width: fit-content;
  max-width: 576px;
  list-style: none;
  z-index: 2147483647;
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(calc(100% + var(--viewport-padding)));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const swipeOut = keyframes`
  from {
    transform: translateX(var(--radix-toast-swipe-end-x));
  }
  to {
    transform: translateX(calc(100% + var(--viewport-padding)));
  }
`;

export function Root({ children, title, description, className, ...props }) {
  return (
    <RadixToastRoot {...props} className={`${fullWidthClassName} ${className}`}>
      {title ? <Title>{title}</Title> : null}
      {description ? <Description>{description}</Description> : null}
      {children}
    </RadixToastRoot>
  );
}

const RadixToastRoot = styled(RadixToast.Root)`
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  position: relative;
  padding: 16px;
  display: grid;
  grid-template-areas:
    "icon title buttons"
    "icon description buttons";
  grid-template-columns: max-content auto max-content;
  column-gap: 16px;
  align-items: center;

  // Based on https://www.radix-ui.com/docs/primitives/components/toast
  @media (prefers-reduced-motion: no-preference) {
    &[data-state="open"] {
      animation: ${slideIn} 200ms ease-out;
    }
    &[data-state="closed"] {
      animation: ${fadeOut} 200ms ease-in;
    }
    &[data-swipe="move"] {
      transform: translateX(var(--radix-toast-swipe-move-x));
    }
    &ToastRoot[data-swipe="cancel"] {
      transform: translateX(0);
      will-change: transform;
      transition: transform 200ms ease-out;
    }
    &[data-swipe="end"] {
      animation: ${swipeOut} 100ms ease-out;
    }
  }
`;

export const Icon = styled.div`
  --size: ${24 / 16}rem;
  grid-area: icon;
  min-width: var(--size);
  font-size: var(--size);
  color: var(--color-yellow-2);
  border: solid 2px var(--color-yellow-4);
  border-radius: var(--border-radius);
  padding: 4px;
`;

const Title = styled(RadixToast.Title)`
  grid-area: title;
  font-weight: bold;
  color: var(--text-primary);
`;

const Description = styled(RadixToast.Description)`
  grid-area: description;
  color: var(--text-secondary);
`;

export const Buttons = styled.div`
  grid-area: buttons;
`;

export const Action = RadixToast.Action;
export const Close = RadixToast.Close;
