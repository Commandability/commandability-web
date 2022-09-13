import * as React from "react";
import styled from "styled-components";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { FiX } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ToastPrimitive.Viewport;

export function Toast({ title, content, children, ...props }) {
  return (
    <ToastPrimitive.Root {...props} style={{ "list-style-type": "none" }}>
      <ToastContent>
        {title && <ToastTitle>{title}</ToastTitle>}
        <ToastDescription>{content}</ToastDescription>
        {children && (
          <ToastPrimitive.Action altText="alt text">
            {children}
          </ToastPrimitive.Action>
        )}
        <ToastPrimitive.Close asChild>
          <CloseButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <FiX />
          </CloseButton>
        </ToastPrimitive.Close>
      </ToastContent>
    </ToastPrimitive.Root>
  );
}

const ToastContent = styled.div`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  background-color: var(--color-gray-10);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--color-gray-2);
`;

const ToastTitle = styled(ToastPrimitive.Title)`
  font-size: ${18 / 16}rem;
  font-weight: bold;
  color: var(--color-gray-3);
`;

const ToastDescription = styled(ToastPrimitive.Description)`
  color: var(--color-gray-4);
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 4px;
  right: 4px;
  border-radius: 100%;
  width: 24px;
  height: 24px;
  display: grid;
  place-content: center;
  color: var(--color-yellow-2);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-yellow-9);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;
