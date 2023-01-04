import * as React from "react";
import styled, { keyframes } from "styled-components";
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";

import VisuallyHidden from "components/visually-hidden";

export const Root = RadixAlertDialog.Root;
export const Trigger = RadixAlertDialog.Trigger;
export const Cancel = RadixAlertDialog.Cancel;
export const Action = RadixAlertDialog.Action;

/**
 * Styles for children of Content in case the dialog content has a wrapper as its direct child
 */
export const contentChildrenStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "32px",
};

export const Content = React.forwardRef(
  ({ header, title, description, children, ...props }, forwardedRef) => (
    <RadixAlertDialog.Portal>
      <RadixAlertDialogOverlay>
        <RadixAlertDialogContent
          style={contentChildrenStyles}
          {...props}
          ref={forwardedRef}
        >
          {header ? (
            <Header>
              <RadixAlertDialogTitle>{title}</RadixAlertDialogTitle>
              {description ? (
                <RadixAlertDialogDescription>
                  {description}
                </RadixAlertDialogDescription>
              ) : null}
            </Header>
          ) : (
            <VisuallyHidden>
              <RadixAlertDialog.Title>{title}</RadixAlertDialog.Title>
              {description ? (
                <RadixAlertDialog.Description>
                  {description}
                </RadixAlertDialog.Description>
              ) : null}
            </VisuallyHidden>
          )}
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
  // Disregard scrollbar width when centering so content is centered
  // consistently regardless of scrollbar presence
  position: relative;
  right: calc(var(--scrollbar-width) / 2);
  padding: 24px;
  border-radius: var(--border-radius);
  background-color: var(--color-gray-10);
  color: var(--color-yellow-2);

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
