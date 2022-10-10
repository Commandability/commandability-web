import * as React from "react";
import styled, { keyframes } from "styled-components";
import * as RadixToast from "@radix-ui/react-toast";

const DEFAULT_TOAST_DURATION = 3000;

export const unknownToastState = {
  title: "Unknown error",
  message: "Try again later or contact support.",
};

export function ToastProvider({ children, ...props }) {
  return (
    <RadixToast.Provider duration={DEFAULT_TOAST_DURATION} {...props}>
      {children}
    </RadixToast.Provider>
  );
}

export const ToastViewport = styled(RadixToast.Viewport)`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  list-style: none;
  padding: 24px;
`;

export function Toast({ title, content, children, ...props }) {
  return (
    <ToastRoot {...props} onSwipeEnd={(e) => e.preventDefault()}>
      <ToastContent>
        {title ? <ToastTitle>{title}</ToastTitle> : null}
        <ToastDescription>{content}</ToastDescription>
      </ToastContent>
      {children ? (
        <RadixToast.Action asChild>{children}</RadixToast.Action>
      ) : null}
    </ToastRoot>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ToastRoot = styled(RadixToast.Root)`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  color: var(--color-gray-2);
  background-color: var(--color-gray-10);
  box-shadow: var(--box-shadow);

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 200ms ease-out forwards;
  }
`;

const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ToastTitle = styled(RadixToast.Title)`
  font-size: ${18 / 16}rem;
  font-weight: bold;
  color: var(--color-yellow-2);
`;

const ToastDescription = styled(RadixToast.Description)`
  color: var(--color-gray-4);
`;
