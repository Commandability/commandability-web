import React from "react";
import styled, { keyframes } from "styled-components";
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";

export const AlertDialog = RadixAlertDialog.Root;
export const AlertDialogTrigger = RadixAlertDialog.Trigger;
export const AlertDialogCancel = RadixAlertDialog.Cancel;
export const AlertDialogAction = RadixAlertDialog.Action;

export const AlertDialogContent = React.forwardRef(
  ({ title, description, children, ...props }, forwardedRef) => (
    <RadixAlertDialog.Portal>
      <RadixAlertDialogOverlay>
        <RadixAlertDialogContent
          {...props}
          ref={forwardedRef}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Header>
            <RadixAlertDialogTitle>{title}</RadixAlertDialogTitle>
            <RadixAlertDialogDescription>
              {description}
            </RadixAlertDialogDescription>
          </Header>
          {children}
        </RadixAlertDialogContent>
      </RadixAlertDialogOverlay>
    </RadixAlertDialog.Portal>
  )
);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RadixAlertDialogOverlay = styled(RadixAlertDialog.Overlay)`
  background-color: hsl(0 0% 0% / 0.5);
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 200ms ease-out forwards;
  }
`;

const RadixAlertDialogContent = styled(RadixAlertDialog.Content)`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  background-color: var(--color-white);
  color: var(--color-yellow-2);
  min-width: 384px;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 200ms ease-out forwards;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadixAlertDialogTitle = styled(RadixAlertDialog.Title)`
  font-size: ${18 / 16}rem;
  font-weight: bold;
  color: var(--color-gray-3);
`;

const RadixAlertDialogDescription = styled(RadixAlertDialog.Description)`
  color: var(--color-gray-4);
`;
