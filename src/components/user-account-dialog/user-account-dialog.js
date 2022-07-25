import * as React from "react";
import styled from "styled-components";
import { zeroRightClassName } from "react-remove-scroll-bar";
import * as Dialog from "@radix-ui/react-dialog";

import UnstyledButton from "components/unstyled-button";

function UserAccountDialog(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newDisplayName, setNewDisplayName] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [dialog, setDialog] = React.useState(props.dialog);
  const [isAnimating, setIsAnimating] = React.useState(false);

  function handleLoginSubmit(event) {
    event.preventDefault();
    props.onSubmitUserInfo(email, password);
  }

  function handleNewAccountSubmit(event) {
    event.preventDefault();
    props.onSubmitUserInfo(newEmail, newPassword);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleNewDisplayNameChange(event) {
    setNewDisplayName(event.target.value);
  }

  function handleNewEmailChange(event) {
    setNewEmail(event.target.value);
  }

  function handleNewPasswordChange(event) {
    setNewPassword(event.target.value);
  }

  function handleNavClick(target) {
    setIsAnimating(true);
    setTimeout(() => {
      setDialog(target);
    }, "150");
  }

  function handleClose() {
    setTimeout(() => {
      setDialog(props.dialog);
      setEmail("");
      setPassword("");
      setNewEmail("");
      setNewPassword("");
      setIsAnimating(false);
    }, "250");
  }

  return (
    <Dialog.Root>
      <AccountTrigger>
        <div>{props.button}</div>
      </AccountTrigger>
      <Dialog.Portal>
        <Overlay className={zeroRightClassName} />
        <AccountContent
          onInteractOutside={handleClose}
          className={zeroRightClassName}
        >
          <AnimationControl
            className={isAnimating ? "animate" : ""}
            onAnimationEnd={() => setIsAnimating(false)}
          >
            {dialog === "NewUser" ? (
              <>
                {/*
              The className is part of the react-remove-scroll-bar package. This will make sure any fixed position elements will
              have their right position modified to match the original right position before the scroll bar is removed.
             */}

                <AccountForm>
                  <InputWrapper>
                    <Label htmlFor="newDisplayName">Display Name</Label>
                    <Input
                      id="newDisplayName"
                      type="text"
                      placeholder="Department One"
                      onChange={handleNewDisplayNameChange}
                      value={newDisplayName}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Label htmlFor="newEmailInput">Email</Label>
                    <Input
                      id="newEmailInput"
                      type="email"
                      placeholder="example@example.com"
                      onChange={handleNewEmailChange}
                      value={newEmail}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Label htmlFor="newPasswordInput">Password</Label>
                    <Input
                      id="newPasswordInput"
                      type="password"
                      placeholder="example password"
                      onChange={handleNewPasswordChange}
                      value={newPassword}
                    />
                  </InputWrapper>

                  <SubmitButton type="submit" onClick={handleNewAccountSubmit}>
                    Create Account
                  </SubmitButton>
                </AccountForm>
                <OtherNavOptions>
                  <hr />
                  <DialogSwitchButton
                    onClick={() => handleNavClick("CurrentUser")}
                  >
                    Already have an account?
                  </DialogSwitchButton>
                </OtherNavOptions>
              </>
            ) : dialog === "CurrentUser" ? (
              <>
                {/*
              The className is part of the react-remove-scroll-bar package. This will make sure any fixed position elements will
              have their right position modified to match the original right position before the scroll bar is removed.
             */}

                <AccountForm>
                  <InputWrapper>
                    <Label htmlFor="emailInput">Email</Label>
                    <Input
                      id="emailInput"
                      type="email"
                      placeholder="example@example.com"
                      onChange={handleEmailChange}
                      value={email}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Label htmlFor="passwordInput">Password</Label>
                    <Input
                      id="passwordInput"
                      type="password"
                      placeholder="example password"
                      onChange={handlePasswordChange}
                      value={password}
                    />
                  </InputWrapper>

                  <SubmitButton type="submit" onClick={handleLoginSubmit}>
                    Login
                  </SubmitButton>
                </AccountForm>
                <ForgotPasswordButton
                  onClick={() => handleNavClick("ForgotPassword")}
                >
                  Forgot password?
                </ForgotPasswordButton>
                <OtherNavOptions>
                  <hr />
                  <DialogSwitchButton onClick={() => handleNavClick("NewUser")}>
                    Create an account
                  </DialogSwitchButton>
                </OtherNavOptions>
              </>
            ) : (
              <>
                {/*
              The className is part of the react-remove-scroll-bar package. This will make sure any fixed position elements will
              have their right position modified to match the original right position before the scroll bar is removed.
             */}

                <AccountForm>
                  <InputWrapper>
                    <Label htmlFor="emailInput">Email</Label>
                    <Input
                      id="emailInput"
                      type="email"
                      placeholder="example@example.com"
                      onChange={handleEmailChange}
                      value={email}
                    />
                  </InputWrapper>

                  <Dialog.Close asChild>
                    <SubmitButton type="submit" onClick={handleClose}>
                      Reset Password
                    </SubmitButton>
                  </Dialog.Close>
                </AccountForm>
                <OtherNavOptions>
                  <hr />
                  <DialogSwitchButton
                    onClick={() => handleNavClick("CurrentUser")}
                  >
                    Return to login
                  </DialogSwitchButton>
                </OtherNavOptions>
              </>
            )}
          </AnimationControl>
        </AccountContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const AccountForm = styled.form`
  display: flex;
  position: relative;
  gap: 24px;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  gap: 4px;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  text-transform: uppercase;
  font-weight: bold;
  align-self: flex-start;
`;

const Input = styled.input`
  height: 48px;
  padding: 12px;
  width: 100%;
  border: solid 1px var(--color-gray-5);
  border-radius: 6px;
  &:focus {
    outline: none;
    border: solid 1px var(--color-red-3);
  }
`;

const SubmitButton = styled(UnstyledButton)`
  padding: 12px;
  margin-top: 12px;
  width: 100%;
  background-color: var(--color-red-3);
  border: none;
  border-radius: 6px;
  color: var(--color-white);
  font-size: ${16 / 16}rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-align: center;

  &:focus {
    outline-offset: 3px;
  }
  &:hover {
    cursor: pointer;
    animation: morph 200ms linear;
    background-color: var(--color-yellow-3);
  }
  @keyframes morph {
    0% {
      background-color: var(--color-red-3);
    }
    100% {
      background-color: var(--color-yellow-3);
    }
  }
`;

const ForgotPasswordButton = styled(UnstyledButton)`
  color: var(--color-yellow-2);
  font-weight: bold;
  margin: auto;
  &:hover {
    color: var(--color-yellow-4);
    cursor: pointer;
  }
`;

const OtherNavOptions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 36px;
`;

const DialogSwitchButton = styled(UnstyledButton)`
  color: var(--color-yellow-2);
  font-weight: bold;
  padding-top: 12px;
  margin: auto;
  &:hover {
    color: var(--color-yellow-4);
    cursor: pointer;
  }
`;

const AnimationControl = styled.div`
  @media (prefers-reduced-motion: no-preference) {
    &.animate {
      animation: fade 300ms ease-in-out;
    }
  }
  @keyframes fade {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const AccountContent = styled(Dialog.Content)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 540px;
  width: 480px;
  background-color: var(--color-gray-10);
  border-radius: 16px;
  padding: 36px;
  box-shadow: var(--box-shadow);
  z-index: 1000;

  @media (prefers-reduced-motion: no-preference) {
    &[data-state="open"] {
      animation: fadeIn 250ms ease-out forwards;
    }
    &[data-state="closed"] {
      animation: fadeOut 250ms ease-in forwards;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const AccountTrigger = styled(Dialog.Trigger)`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: hsl(360, 10%, 25%, 0.4);
`;

export default UserAccountDialog;
