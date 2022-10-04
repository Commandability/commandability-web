import * as React from "react";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "context/auth-context";
import FireLoader from "components/fire-loader";
import UnstyledButton from "components/unstyled-button";
import { Toast, ToastProvider, ToastViewport } from "components/toast";
import VisuallyHidden from "components/visually-hidden";

const unknownToastState = {
  title: "Unknown error",
  message: "Try again later or contact support.",
};

export const accountContentType = {
  NEW_USER: "NEW_USER",
  CURRENT_USER: "CURRENT_USER",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

const MINIMUM_LOADING_TIME = 400;
const ANIMATION_DURATION = 300;

const isDisplayName = /^([a-zA-Z0-9]){3,16}$/;

const inputErrors = {
  displayName: "Must be alphanumeric and contain between 3 and 16 characters",
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

function AccountDialogContent({ defaultContent }) {
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

  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const passwordInputRef = React.useRef();

  const [toastState, setToastState] = React.useState({
    title: "",
    message: "",
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  const [content, setContent] = React.useState(defaultContent);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (content === accountContentType.NEW_USER) {
      setDisplayNameError(true);
      setEmailError(true);
      setPasswordError(true);
    }
  }, [content]);

  async function onCreateAccountSubmit(event) {
    event.preventDefault();
    if (!isDisplayName.test(displayName)) {
      setDisplayNameError(true);
    }
    if (!isEmail(email)) {
      setEmailError(true);
    }
    if (!isStrongPassword(password, passwordRequirements)) {
      setPasswordError(true);
    }

    if (
      isDisplayName.test(displayName) &&
      isEmail(email) &&
      isStrongPassword(password, passwordRequirements)
    ) {
      setLoading(true);
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          email,
          password
        );
        await updateProfile(userCredentials.user, { displayName: displayName });
        window.location.assign("/");
        setTimeout(() => setLoading(false), MINIMUM_LOADING_TIME);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setToastState({
            title: "Email already in use",
            message:
              "There is already an account associated with this email address",
          });
        } else {
          setToastState(unknownToastState);
        }
        setTimeout(() => {
          setLoading(false);
          setToastOpen(true);
        }, MINIMUM_LOADING_TIME);
      }
    }
  }

  async function onSignInSubmit(event) {
    event.preventDefault();
    if (!isEmail(email)) {
      setEmailError(true);
    } else {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(email, password);
        window.location.assign("/");
        setTimeout(() => setLoading(false), MINIMUM_LOADING_TIME);
      } catch (error) {
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setToastState({
            title: "Login failed",
            message: "Invalid email or password",
          });
        } else {
          setToastState(unknownToastState);
        }
        setTimeout(() => {
          setLoading(false);
          setToastOpen(true);
        }, MINIMUM_LOADING_TIME);
      }
    }
  }

  async function onRecoverAccountSubmit(event) {
    event.preventDefault();
    if (!isEmail(email)) {
      setEmailError(true);
    } else {
      const recoverAccountToastState = {
        title: "Password reset email sent",
        message:
          "If an account exists, you will receive a password reset email",
      };

      setLoading(true);
      try {
        await sendPasswordResetEmail(email);
        setToastState(recoverAccountToastState);
        setTimeout(() => {
          setLoading(false);
          setToastOpen(true);
        }, MINIMUM_LOADING_TIME);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          setToastState(recoverAccountToastState);
        } else {
          setToastState(unknownToastState);
        }
        setTimeout(() => {
          setLoading(false);
          setToastOpen(true);
        }, MINIMUM_LOADING_TIME);
      }
    }
  }

  function handleContentSwitch(target) {
    // Animating is disabled on mount
    setIsAnimating(true);

    setTimeout(() => {
      setContent(target);
      setDisplayName("");
      setEmail("");
      setPassword("");
      setDisplayNameError(false);
      setEmailError(false);
      setPasswordError(false);
      setVisiblePassword(false);
      // Reset content halfway through the animation when the content has opacity: 0
    }, ANIMATION_DURATION / 2);
  }

  function handleTogglePassword() {
    setVisiblePassword((isVisible) => !isVisible);
    passwordInputRef.current.focus();
  }

  let renderedContent;
  if (loading) {
    renderedContent = <FireLoader />;
  } else if (content === accountContentType.NEW_USER) {
    renderedContent = (
      <Content>
        <AccountForm>
          <FormInputs>
            <InputGroup>
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                type="text"
                required
                placeholder="ExampleDept"
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  isDisplayName.test(e.target.value)
                    ? setDisplayNameError(false)
                    : setDisplayNameError(true);
                }}
                value={displayName}
              />
              <InputError>
                {displayNameError ? inputErrors.displayName : null}
              </InputError>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                autoComplete="username"
                required
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  isEmail(e.target.value)
                    ? setEmailError(false)
                    : setEmailError(true);
                }}
                value={email}
              />
              <InputError>{emailError ? inputErrors.email : null}</InputError>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="new-password">Password</Label>
              <InputWrapper>
                <Input
                  ref={passwordInputRef}
                  id="new-password"
                  type={visiblePassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    isStrongPassword(e.target.value, passwordRequirements)
                      ? setPasswordError(false)
                      : setPasswordError(true);
                  }}
                  value={password}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={handleTogglePassword}
                >
                  <VisuallyHidden>Toggle password visibility</VisuallyHidden>
                  {visiblePassword ? <FiEyeOff /> : <FiEye />}
                </TogglePasswordButton>
              </InputWrapper>
              <InputError>
                {passwordError ? inputErrors.password : null}
              </InputError>
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
              <Label htmlFor="current-email">Email</Label>
              <Input
                id="current-email"
                type="email"
                autoComplete="username"
                required
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                value={email}
              />
              <InputError>{emailError ? inputErrors.email : null}</InputError>
            </InputGroup>
            <InputGroup>
              <Label htmlFor="current-password">Password</Label>
              <InputWrapper>
                <Input
                  ref={passwordInputRef}
                  id="current-password"
                  type={visiblePassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  value={password}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={handleTogglePassword}
                >
                  <VisuallyHidden>Toggle password visibility</VisuallyHidden>
                  {visiblePassword ? <FiEyeOff /> : <FiEye />}
                </TogglePasswordButton>
              </InputWrapper>
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
              <Label htmlFor="current-email">Email</Label>
              <Input
                id="current-email"
                type="email"
                autoComplete="username"
                required
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                value={email}
              />
              <InputError>{emailError ? inputErrors.email : null}</InputError>
            </InputGroup>
          </FormInputs>
          <SubmitButton type="submit" onClick={onRecoverAccountSubmit}>
            Request password reset
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
    <>
      <ContentSwitch
        aria-live="polite"
        aria-atomic="true"
        data-animating={isAnimating ? "true" : "false"}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        {renderedContent}
      </ContentSwitch>
      <ToastProvider>
        <Toast
          open={toastOpen}
          onOpenChange={setToastOpen}
          title={toastState.title}
          content={toastState.message}
        />
        <ToastViewport />
      </ToastProvider>
    </>
  );
}

const ContentSwitch = styled.div`
  height: 512px;
  width: 480px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-gray-10);

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
  flex: 1;
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

const TogglePasswordButton = styled(UnstyledButton)`
  position: absolute;
  top: 10px;
  right: 8px;
  padding: 4px;

  & > svg {
    stroke: var(--color-gray-2);
  }

  ${Input}:focus-visible + & {
    & > svg {
      stroke: var(--color-yellow-3);
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-radius: 100%;
      background-color: var(--color-gray-9);

      ${Input}:focus-visible + & {
        background-color: var(--color-yellow-9);
      }
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  position: relative;
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
  align-self: flex-end;
  display: flex;
  align-items: center;
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
