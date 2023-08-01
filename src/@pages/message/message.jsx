import * as React from "react";
import styled from "styled-components";
import isStrongPassword from "validator/lib/isStrongPassword";
import { FiSave, FiX, FiCheck } from "react-icons/fi";
import {
  confirmPasswordReset,
  applyActionCode,
  updateEmail,
} from "firebase/auth";
import isEmail from "validator/lib/isEmail";

import { QUERIES } from "@constants";
import AccountOption from "@components/account-option";
import Button from "@components/button";
import FireLoader from "@components/fire-loader";
import TextInput from "@components/text-input";
import { useAuth } from "@context/auth-context";
import * as Toast from "@components/toast";
import { passwordRequirements } from "site-config";
import Pill from "@components/pill";

const inputErrors = {
  email: `Must be a valid email`,
  password: `Must contain at least ${passwordRequirements.minLength} characters`,
};

function Message() {
  const { setUser, user, auth } = useAuth();

  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [newEmailError, setNewEmailError] = React.useState("false");
  const [loading, setLoading] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  const searchParameters = new URLSearchParams(window.location.search);
  const mode = searchParameters.get("mode");
  const code = searchParameters.get("oobCode");

  React.useEffect(() => {
    async function handleVerifyEmail() {
      try {
        await applyActionCode(auth, code);
        if (user.current) {
          setUser((prevUser) => ({ ...prevUser, current: user.current }));
          user.current.reload();
        }
        setSuccess(true);
        setPageLoading(false);
      } catch (error) {
        setPageLoading(false);
        return error;
      }
    }
    if (mode === "verifyEmail") {
      handleVerifyEmail();
    }
  }, [mode, auth, code, setUser, user, success]);

  async function handleEmailReset(event) {
    event.preventDefault();
    setLoading(true);
    let emailResetToastState = {
      title: "Email reset error",
      description:
        "There was an error when trying to reset your email, please try again",
      icon: <FiX />,
    };
    setToastState(emailResetToastState);
    try {
      await updateEmail(user.current, newEmail);
      emailResetToastState = {
        title: "Email changed",
        description: "You have successfully changed your email",
        icon: <FiCheck />,
      };
      setToastState(emailResetToastState);
      setToastOpen(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setToastOpen(true);
      return error;
    }
  }

  async function handlePasswordReset(event) {
    event.preventDefault();
    setLoading(true);
    let passwordResetToastState = {
      title: "Password reset error",
      description:
        "There was an error when trying to reset your password, please try again",
      icon: <FiX />,
    };
    setToastState(passwordResetToastState);
    try {
      await confirmPasswordReset(auth, code, newPassword);
      passwordResetToastState = {
        title: "Password changed",
        description: "You have successfully changed your password",
        icon: <FiCheck />,
      };
      setToastState(passwordResetToastState);
      setToastOpen(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setToastOpen(true);
      return error;
    }
  }

  let messageContent = (
    <FireWrapper>
      <FireLoader />
    </FireWrapper>
  );
  if (mode === "verifyEmail" && pageLoading === false) {
    messageContent = (
      <MessageWrapper>
        <MessageContent>
          <TextWrapper>
            <MessageTitle>{success ? "Verified" : "Error"}</MessageTitle>
            <MessageDescription>
              {success
                ? "Your email account has been successfully verified"
                : "We were unable to verify your email, please try again or contact support"}
            </MessageDescription>
          </TextWrapper>
          {user.current ? (
            <Pill to="/dashboard/account" theme="light" angle>
              Return to account
            </Pill>
          ) : (
            <Pill to="/" theme="light" angle>
              Return to home
            </Pill>
          )}
        </MessageContent>
      </MessageWrapper>
    );
  } else if (mode === "resetPassword") {
    messageContent = (
      <Wrapper>
        <Content>
          <AccountOption header="Reset Password">
            <TextInput
              id="new-password-input"
              labelText="New password"
              value={newPassword}
              type="password"
              onChange={(e) => {
                setNewPassword(e.target.value);
                isStrongPassword(e.target.value, passwordRequirements)
                  ? setNewPasswordError(false)
                  : setNewPasswordError(true);
              }}
              errorText={!newPasswordError ? "" : inputErrors.password}
            />
            <SubmitLoaderWrapper>
              {loading ? (
                <FireLoader
                  style={{
                    "--fire-icon-width": "36px",
                    "--fire-icon-height": "36px",
                  }}
                />
              ) : null}
              <Button
                type="submit"
                onClick={(event) => {
                  handlePasswordReset(event);
                }}
                disabled={newPasswordError}
              >
                <FiSave />
                Save
              </Button>
            </SubmitLoaderWrapper>
          </AccountOption>
        </Content>
      </Wrapper>
    );
  } else if (mode === "recoverEmail") {
    messageContent = (
      <Wrapper>
        <Content>
          <AccountOption header="Reset Email">
            <TextInput
              id="new-email-input"
              labelText="New email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                isEmail(e.target.value)
                  ? setNewEmailError(false)
                  : setNewEmailError(true);
              }}
              errorText={!newEmailError ? "" : inputErrors.email}
            />
            <SubmitLoaderWrapper>
              {loading ? (
                <FireLoader
                  style={{
                    "--fire-icon-width": "36px",
                    "--fire-icon-height": "36px",
                  }}
                />
              ) : null}
              <Button
                type="submit"
                onClick={(event) => {
                  handleEmailReset(event);
                }}
                disabled={newEmailError}
              >
                <FiSave />
                Save
              </Button>
            </SubmitLoaderWrapper>
          </AccountOption>
        </Content>
      </Wrapper>
    );
  } else {
    messageContent = (
      <MessageWrapper>
        <MessageContent>
          <TextWrapper>
            <MessageTitle>Unknown Error</MessageTitle>
            <MessageDescription>
              There is a problem with the page you are trying to access, please
              try again
            </MessageDescription>
          </TextWrapper>
          <Pill to="/dashboard/account" theme="light" angle>
            Return to account page
          </Pill>
        </MessageContent>
      </MessageWrapper>
    );
  }

  return (
    <>
      <div aria-live="polite" aria-atomic="true">
        {messageContent}
      </div>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 72px 16px;

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0;
  }
`;

const Content = styled.div`
  --horizontal-padding: 64px;
  max-width: calc(75ch + var(--horizontal-padding) * 2);
  border-radius: var(--border-radius);
  background-color: var(--color-white);

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0px 8px;
    border-radius: 0;
  }
`;

const SubmitLoaderWrapper = styled.div`
  width: fit-content;
  display: flex;
  align-self: flex-end;
  gap: 16px;
`;

const MessageWrapper = styled.div`
  height: 100%;
  padding: 0 48px;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  justify-content: center;
`;

const MessageContent = styled.div`
  grid-row: 2;
  display: grid;
  justify-items: start;
  align-content: start;
  gap: 32px;
  width: 544px;
`;

const TextWrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const MessageTitle = styled.div`
  display: grid;
  font-size: clamp(${16 / 16}rem, 8vw + 1rem, ${32 / 16}rem);
  letter-spacing: 0.05em;
  color: var(--text-primary-bg-dark);
  text-transform: uppercase;
`;

const MessageDescription = styled.div`
  display: grid;
  font-size: clamp(${16 / 16}rem, 2vw + 1rem, ${18 / 16}rem);
  color: var(--text-secondary-bg-dark);
  letter-spacing: 0.05em;
  line-height: var(--header-line-height);
`;

const FireWrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: var(--color-gray-8);
  z-index: 2147483647;
`;

export default Message;
