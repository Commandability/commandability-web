import * as React from "react";
import styled from "styled-components";
import { zeroRightClassName } from "react-remove-scroll-bar";
import * as Dialog from "@radix-ui/react-dialog";
import { useAuth } from "context/auth-context";
import VisuallyHidden from "components/visually-hidden";
import { FiX } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";

const validDisplayName = new RegExp("^([a-zA-Z0-9._-]).{2,}");
const validEmail = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
const validPassword = new RegExp("^(?=.*?[A-Za-z]).{8,}$");

function UserAccountDialog(props) {
  const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
  } = useAuth();

  const [displayName, setDisplayName] = React.useState("");
  const [displayNameError, setDisplayNameError] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [dialog, setDialog] = React.useState(props.dialog);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);

  function validateNewAccount(event) {
    event.preventDefault();
    if (!validDisplayName.test(displayName)) {
      setDisplayNameError(true);
    }
    if (!validEmail.test(email)) {
      setEmailError(true);
    }
    if (!validPassword.test(password)) {
      setPasswordError(true);
    }
    if (
      validDisplayName.test(displayName) &&
      validEmail.test(email) &&
      validPassword.test(password)
    ) {
      submitNewAccount();
    }
  }

  async function submitNewAccount() {
    // createNewUser(email, password, displayName);
    const userCredentials = await createUserWithEmailAndPassword(
      email,
      password
    );
    await updateProfile(userCredentials.user, { displayName: displayName });
    setOpenStatus(false);
    handleClose();
  }

  function validateLogin(event) {
    event.preventDefault();
    if (!validEmail.test(email)) {
      setEmailError(true);
    }
    if (!validPassword.test(password)) {
      setPasswordError(true);
    }
    if (validEmail.test(email) && validPassword.test(password)) {
      submitLogin();
    }
  }

  function submitLogin() {
    signInWithEmailAndPassword(email, password);
    setOpenStatus(false);
    handleClose();
  }

  function validateRecoverAccount(event) {
    event.preventDefault();
    if (!validEmail.test(email)) {
      setEmailError(true);
    }
    if (validEmail.test(email)) {
      submitRecoverAccount();
    }
  }

  function submitRecoverAccount() {
    sendPasswordResetEmail(email);
    setOpenStatus(false);
    handleClose();
  }

  function handleNavClick(target) {
    setIsAnimating(true);
    setTimeout(() => {
      setDialog(target);
      resetInputs();
    }, "150");
  }

  function handleClose() {
    setTimeout(() => {
      setDialog(props.dialog);
      setIsAnimating(false);
      resetInputs();
    }, "250");
  }

  function resetInputs() {
    setDisplayName("");
    setEmail("");
    setPassword("");
    setDisplayNameError(false);
    setEmailError(false);
    setPasswordError(false);
  }

  return (
    <Dialog.Root
      open={openStatus}
      onOpenChange={() => setOpenStatus(!openStatus)}
    >
      <AccountTrigger>
        <div>{props.button}</div>
      </AccountTrigger>
      <Dialog.Portal>
        <Overlay />
        {/* The className zeroRightClassName is part of the react-remove-scroll-bar package. This will make sure any fixed position elements will
        have their right position modified to match the original right position before the scroll bar is removed. */}
        <AccountContent
          onInteractOutside={handleClose}
          className={zeroRightClassName}
        >
          <DialogContent
            className={isAnimating ? "animate" : ""}
            onAnimationEnd={() => setIsAnimating(false)}
          >
            {dialog === "NewUser" ? (
              <>
                <AccountForm>
                  <InputWrapper>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Department One"
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        setDisplayNameError(false);
                      }}
                      value={displayName}
                    />
                    {displayNameError ? (
                      <InputError>
                        Display name must be at least 3 characters
                      </InputError>
                    ) : (
                      <InputError />
                    )}
                    <Label htmlFor="emailInput">Email</Label>
                    <Input
                      id="emailInput"
                      type="email"
                      placeholder="example@example.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                      value={email}
                    />
                    {emailError ? (
                      <InputError>Invalid email</InputError>
                    ) : (
                      <InputError />
                    )}
                    <Label htmlFor="passwordInput">Password</Label>
                    <Input
                      id="passwordInput"
                      type="password"
                      placeholder="example password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      value={password}
                    />
                    {passwordError ? (
                      <InputError>
                        Password must be at least 8 characters
                      </InputError>
                    ) : (
                      <InputError />
                    )}
                  </InputWrapper>
                  <SubmitButton type="submit" onClick={validateNewAccount}>
                    Create Account
                  </SubmitButton>
                </AccountForm>
                <DialogSwitchButton
                  onClick={() => handleNavClick("CurrentUser")}
                >
                  Already have an account?
                </DialogSwitchButton>
              </>
            ) : dialog === "CurrentUser" ? (
              <>
                <AccountForm>
                  <InputWrapper>
                    <Label htmlFor="emailInput">Email</Label>
                    <Input
                      id="emailInput"
                      type="email"
                      placeholder="example@example.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                      value={email}
                    />
                    {emailError ? (
                      <InputError>Invalid email</InputError>
                    ) : (
                      <InputError />
                    )}
                    <Label htmlFor="passwordInput">Password</Label>
                    <Input
                      id="passwordInput"
                      type="password"
                      placeholder="example password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      value={password}
                    />
                    {passwordError ? (
                      <InputError>
                        Password must be at least 8 characters
                      </InputError>
                    ) : (
                      <InputError />
                    )}
                    <ForgotPasswordButton
                      type="button"
                      onClick={() => handleNavClick("ForgotPassword")}
                    >
                      Forgot password?
                    </ForgotPasswordButton>
                  </InputWrapper>

                  <SubmitButton type="submit" onClick={validateLogin}>
                    Login
                  </SubmitButton>
                </AccountForm>
                <DialogSwitchButton onClick={() => handleNavClick("NewUser")}>
                  Create an account
                </DialogSwitchButton>
              </>
            ) : (
              <>
                <AccountForm>
                  <InputWrapper>
                    <Label htmlFor="emailInput">Email</Label>
                    <Input
                      id="emailInput"
                      type="email"
                      placeholder="example@example.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                      value={email}
                    />
                    {emailError ? (
                      <InputError>Invalid email</InputError>
                    ) : (
                      <InputError />
                    )}
                  </InputWrapper>
                  <SubmitButton type="submit" onClick={validateRecoverAccount}>
                    Reset Password
                  </SubmitButton>
                </AccountForm>
                <DialogSwitchButton
                  onClick={() => handleNavClick("CurrentUser")}
                >
                  Return to login
                </DialogSwitchButton>
              </>
            )}
          </DialogContent>
          <Dialog.Close asChild>
            <CloseButton>
              <VisuallyHidden>Close</VisuallyHidden>
              <FiX />
            </CloseButton>
          </Dialog.Close>
        </AccountContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 16px;
  right: 16px;
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

const AccountContent = styled(Dialog.Content)`
  position: fixed;
  inset: 0;
  margin: auto;
  height: 600px;
  width: 480px;
  background-color: var(--color-gray-10);
  border-radius: 8px;
  padding: 36px;
  box-shadow: var(--box-shadow);
  z-index: 1000;
  display: flex;

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

const DialogContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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

const AccountForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  /* font-weight: bold; */
  text-transform: uppercase;
  color: var(--color-yellow-2);
  /* color: var(--color-gray-3); */
  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  width: 100%;
  border: solid 1px var(--color-gray-5);
  /* border: solid 1px var(--color-yellow-3); */
  &::placeholder {
    color: var(--color-gray-5);
  }
  border-radius: 8px;
  &:focus-visible {
    outline: solid 2px var(--color-yellow-3);
    border-color: var(--color-yellow-3);
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

const InputError = styled.div`
  position: flex;
  align-self: flex-end;
  height: 16px;
  color: var(--color-red-3);
  font-size: ${14 / 16}rem;
`;

const SubmitButton = styled(UnstyledButton)`
  padding: 12px;
  width: 100%;
  background-color: var(--color-yellow-2);
  border: none;
  border-radius: 8px;
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
      background-color: var(--color-yellow-2);
    }
    100% {
      background-color: var(--color-yellow-3);
    }
  }
`;

const DialogSwitchButton = styled(UnstyledButton)`
  color: var(--color-yellow-2);
  font-weight: bold;
  margin: auto;
  padding-top: 18px;
  &:hover {
    color: var(--color-yellow-4);
    cursor: pointer;
  }
`;

export default UserAccountDialog;
