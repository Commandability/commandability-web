import * as React from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import { useAuth } from "context/auth-context";
import UnstyledButton from "components/unstyled-button";

export const accountContentType = {
  NEW_USER: "NEW_USER",
  CURRENT_USER: "CURRENT_USER",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

const ANIMATION_DURATION = 300;

const isDisplayName = /^([a-zA-Z0-9]){4,16}$/;

const errors = {
  displayName: "Must be alphanumeric and contain between 4 and 16 characters",
  email: "Must be a valid email",
  password: "Must contain at least 16 characters",
};

const passwordRequirements = {
  minLength: 16,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
};

function AccountDialogContent({ defaultContent, setOpen }) {
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

  const [content, setContent] = React.useState(defaultContent);
  const [isAnimating, setIsAnimating] = React.useState(false);

  async function onCreateAccountSubmit(event) {
    event.preventDefault();

    if (!isDisplayName.test(displayName)) {
      setDisplayNameError(errors.displayName);
    }
    if (!isEmail(email)) {
      setEmailError(errors.email);
    }
    if (!isStrongPassword(password, passwordRequirements)) {
      setPasswordError(errors.password);
    }

    if (
      isDisplayName.test(displayName) &&
      isEmail(email) &&
      isStrongPassword(password)
    ) {
      const userCredentials = await createUserWithEmailAndPassword(
        email,
        password
      );
      await updateProfile(userCredentials.user, { displayName: displayName });
      setOpen(false);
    }
  }

  async function onSignInSubmit(event) {
    event.preventDefault();

    if (!isEmail(email)) {
      setEmailError("Please enter a valid email");
    } else {
      await signInWithEmailAndPassword(email, password);
      setOpen(false);
    }
  }

  async function onRecoverAccountSubmit(event) {
    event.preventDefault();

    if (!isEmail(email)) {
      setEmailError("Invalid email");
    } else {
      await sendPasswordResetEmail(email);
      setOpen(false);
    }
  }

  function handleContentSwitch(target) {
    setIsAnimating(true);
    setTimeout(() => {
      setContent(target);
      setIsAnimating(false);
      setDisplayName("");
      setEmail("");
      setPassword("");
      setDisplayNameError("");
      setEmailError("");
      setPasswordError("");
    }, ANIMATION_DURATION / 2);
  }

  let renderedContent;
  if (content === accountContentType.NEW_USER) {
    renderedContent = (
      <Content>
        <AccountForm>
          <FormInputs>
            <InputGroup>
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                type="text"
                placeholder="ExampleDept"
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setDisplayNameError("");
                }}
                value={displayName}
              />
              <InputError>{displayNameError}</InputError>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="email-input">Email</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                value={email}
              />
              <InputError>{emailError}</InputError>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password-input">Password</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                value={password}
              />
              <InputError>{passwordError}</InputError>
            </InputGroup>
          </FormInputs>
          <SubmitButton type="submit" onClick={onCreateAccountSubmit}>
            Create Account
          </SubmitButton>
        </AccountForm>
        <TextButton
          onClick={() => handleContentSwitch(accountContentType.CURRENT_USER)}
        >
          Already have an account?
        </TextButton>
      </Content>
    );
  } else if (content === accountContentType.CURRENT_USER) {
    renderedContent = (
      <Content>
        <AccountForm>
          <FormInputs>
            <InputGroup>
              <Label htmlFor="email-input">Email</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                value={email}
              />
              <InputError>{emailError}</InputError>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password-input">Password</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                value={password}
              />
              <InputError>{passwordError}</InputError>
            </InputGroup>
            <TextButton
              type="button"
              onClick={() =>
                handleContentSwitch(accountContentType.FORGOT_PASSWORD)
              }
            >
              Forgot password?
            </TextButton>
          </FormInputs>
          <SubmitButton type="submit" onClick={onSignInSubmit}>
            Sign in
          </SubmitButton>
        </AccountForm>
        <TextButton
          onClick={() => handleContentSwitch(accountContentType.NEW_USER)}
        >
          Create an account
        </TextButton>
      </Content>
    );
  } else {
    renderedContent = (
      <Content>
        <AccountForm>
          <FormInputs>
            <InputGroup>
              <Label htmlFor="email-input">Email</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                value={email}
              />
              <InputError>{emailError}</InputError>
            </InputGroup>
          </FormInputs>
          <SubmitButton type="submit" onClick={onRecoverAccountSubmit}>
            Reset password
          </SubmitButton>
        </AccountForm>
        <TextButton
          onClick={() => handleContentSwitch(accountContentType.CURRENT_USER)}
        >
          Return to sign in
        </TextButton>
      </Content>
    );
  }
  return (
    <ContentSwitch
      aria-live="polite"
      aria-atomic="true"
      data-animating={isAnimating ? "true" : "false"}
      onAnimationEnd={() => setIsAnimating(false)}
    >
      {renderedContent}
    </ContentSwitch>
  );
}

const ContentSwitch = styled.div`
  height: 608px;
  width: 480px;
  display: flex;
  flex-direction: column;

  @media (prefers-reduced-motion: no-preference) {
    &[data-animating="true"] {
      animation: fade ${ANIMATION_DURATION}ms ease-in-out;
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

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`;

const AccountForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FormInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  text-transform: uppercase;
  color: var(--color-yellow-2);
`;

const Input = styled.input`
  padding: 8px 12px;
  border: solid 1px var(--color-gray-5);
  border-radius: 8px;

  &::placeholder {
    color: var(--color-gray-5);
  }

  &:focus-visible {
    outline: solid 2px var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

const TextButton = styled(UnstyledButton)`
  align-self: center;
  color: var(--color-yellow-2);
  font-weight: bold;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-yellow-4);
    }
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
  background-color: var(--color-yellow-2);
  border-radius: 8px;
  color: var(--color-white);
  font-size: ${16 / 16}rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--color-yellow-3);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    will-change: background-color;
    transition: background-color ${ANIMATION_DURATION}ms;
  }
`;

export default AccountDialogContent;
