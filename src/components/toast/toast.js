import styled, { keyframes } from "styled-components";
import * as RadixToast from "@radix-ui/react-toast";
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
  max-width: 512px;
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

export function Root({ children, title, description, ...props }) {
  return (
    <RadixToastRoot {...props}>
      <Content>
        {title ? <Title>{title}</Title> : null}
        {description ? <Description>{description}</Description> : null}
      </Content>
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
  grid-template-areas: "icon content buttons" "icon content buttons";
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
      transition: transform 200ms ease-out;
    }
    &[data-swipe="end"] {
      animation: ${swipeOut} 100ms ease-out;
    }
  }
`;

export const Icon = styled.div`
  grid-area: icon;
  font-size: ${24 / 16}rem;
  color: var(--color-yellow-2);
  border: solid 2px var(--color-yellow-4);
  border-radius: var(--border-radius);
  padding: 4px;
`;

const Content = styled.div`
  font-size: ${16 / 16}rem;
  grid-area: content;
`;

const Title = styled(RadixToast.Title)`
  font-weight: bold;
  color: var(--color-gray-1);
`;

const Description = styled(RadixToast.Description)`
  color: var(--color-gray-3);
`;

export const Buttons = styled.div`
  grid-area: buttons;
`;

export const Action = RadixToast.Action;
export const Close = RadixToast.Close;
