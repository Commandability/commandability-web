import React from "react";
import styled, { keyframes } from "styled-components";
import * as RadixDialog from "@radix-ui/react-dialog";
import { FiX } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export const DialogContent = React.forwardRef(
  (
    { header, title, description, portal = true, children, ...props },
    forwardedRef
  ) => {
    const component = (
      <RadixDialogOverlay>
        <RadixDialogContent
          {...props}
          ref={forwardedRef}
          style={{
            // Account for extra space above and below 16px close icon in 24px container to space everything 24px apart
            "--padding-top": `${header ? "24px" : `${24 - 8 * 2 + 24 * 2}px`}`,
          }}
        >
          {header ? (
            <Header>
              <RadixDialogTitle>{title}</RadixDialogTitle>
              {description ? (
                <RadixDialogDescription>{description}</RadixDialogDescription>
              ) : null}
            </Header>
          ) : (
            <VisuallyHidden>
              <RadixDialog.Title>{title}</RadixDialog.Title>
              {description ? (
                <RadixDialog.Description>{description}</RadixDialog.Description>
              ) : null}
            </VisuallyHidden>
          )}
          {children}
          <RadixDialog.Close asChild>
            <CloseButton>
              <VisuallyHidden>Close</VisuallyHidden>
              <FiX />
            </CloseButton>
          </RadixDialog.Close>
        </RadixDialogContent>
      </RadixDialogOverlay>
    );

    if (portal) return <RadixDialog.Portal>{component}</RadixDialog.Portal>;

    return component;
  }
);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RadixDialogOverlay = styled(RadixDialog.Overlay)`
  background-color: hsl(0 0% 0% / 0.5);
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 200ms ease-out forwards;
  }
`;

const RadixDialogContent = styled(RadixDialog.Content)`
  position: relative;
  padding: 24px;
  padding-top: var(--padding-top);
  border-radius: 8px;
  background-color: var(--color-gray-10);
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: var(--color-gray-2);

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 200ms ease-out forwards;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadixDialogTitle = styled(RadixDialog.Title)`
  font-size: ${18 / 16}rem;
  font-weight: bold;
  color: var(--color-gray-3);
`;

const RadixDialogDescription = styled(RadixDialog.Description)`
  color: var(--color-gray-4);
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  // The icon is 16px but its width and height are 24px for the hover circle size, so remove 8px to align with 24px padding
  top: calc(24px - 8px);
  right: calc(24px - 8px);
  width: 24px;
  height: 24px;
  border-radius: 100%;
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
