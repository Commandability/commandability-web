import React from "react";
import styled, { keyframes } from "styled-components";
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";

import TextInput from "components/text-input";
import Button from "components/button";

function AlertDialog({
  triggerText,
  triggerIcon,
  title,
  description,
  cancelText,
  actionText,
  onAction,
  requireAuth,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");

  function onClick(e) {
    if (!requireAuth) {
      onAction();
      return;
    }

    e.preventDefault();
    setOpen(false);
  }

  return (
    <RadixAlertDialog.Root open={open} onOpenChange={setOpen}>
      <RadixAlertDialog.Trigger asChild>
        <Button theme="light" icon={triggerIcon}>
          {triggerText}
        </Button>
      </RadixAlertDialog.Trigger>
      <RadixAlertDialog.Portal>
        <RadixDialogOverlay>
          <RadixDialogContent
            {...props}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <Header>
              <RadixDialogTitle>{title}</RadixDialogTitle>
              <RadixDialogDescription>{description}</RadixDialogDescription>
            </Header>
            {requireAuth ? (
              <TextInput
                type="password"
                id="password-input"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : null}
            <Options>
              <RadixAlertDialog.Cancel asChild>
                <Button theme="light">{cancelText}</Button>
              </RadixAlertDialog.Cancel>
              <RadixAlertDialog.Action asChild>
                <Button onClick={onClick} theme="dark">
                  {actionText}
                </Button>
              </RadixAlertDialog.Action>
            </Options>
          </RadixDialogContent>
        </RadixDialogOverlay>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
}

export default AlertDialog;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RadixDialogOverlay = styled(RadixAlertDialog.Overlay)`
  background-color: hsl(0 0% 0% / 0.5);
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} 200ms ease-out forwards;
  }
`;

const RadixDialogContent = styled(RadixAlertDialog.Content)`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  background-color: var(--color-white);
  color: var(--color-yellow-2);
  max-width: 512px;
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

const RadixDialogTitle = styled(RadixAlertDialog.Title)`
  font-size: ${18 / 16}rem;
  font-weight: bold;
  color: var(--color-gray-3);
`;

const RadixDialogDescription = styled(RadixAlertDialog.Description)`
  color: var(--color-gray-4);
`;

const Options = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;
