import * as React from "react";
import styled from "styled-components";
import { FiSave, FiUserX, FiMail } from "react-icons/fi";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import {
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";

import AccountOption from "@components/account-option";
import TextInput from "@components/text-input";
import Button from "@components/button";
import { useAuth } from "@context/auth-context";
import * as Dialog from "@components/dialog";
import UnstyledButton from "@components/unstyled-button";
import * as Toast from "@components/toast";
import FireLoader from "@components/fire-loader";
import { auth } from "firebase-config";

const isOrganizationName = /^([a-zA-Z0-9]){3,16}$/;
const MINIMUM_LOADING_TIME = 400;

const inputErrors = {
  organizationName:
    "Must be alphanumeric and contain between 3 and 16 characters",
  email: "Must be a valid email",
  password: "Must contain at least 16 characters",
  confirmPassword: "Must match new password above",
};

const passwordRequirements = {
  minLength: 16,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
};

const dialogActions = {
  updateAccount: "updateAccount",
  changePassword: "changePassword",
  recoverPassword: "recoverPassword",
  verifyEmail: "verifyEmail",
  deleteAccount: "deleteAccount",
};

function Account() {
  const { user } = useAuth();

  const [organizationName, setOrganizationName] = React.useState(
    user.current.displayName
  );
  const [organizationNameError, setOrganizationNameError] =
    React.useState(false);
  const [accountEmail, setAccountEmail] = React.useState(user.current.email);
  const [accountEmailError, setAccountEmailError] = React.useState(false);
  const [generalUpdateCheck, setGeneralUpdateCheck] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState();
  const [currentPasswordError, setCurrentPasswordError] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState();
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = React.useState();
  const [confirmNewPasswordError, setConfirmNewPasswordError] =
    React.useState(false);

  const [reauthenticationDialogOpen, setReauthenticationDialogOpen] =
    React.useState(false);
  const [dialogAction, setDialogAction] = React.useState("");
  const [dialogButton, setDialogButton] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (
      organizationName === user.current.displayName &&
      accountEmail === user.current.email
    ) {
      setGeneralUpdateCheck(true);
    } else {
      setGeneralUpdateCheck(false);
    }
  }, [user, organizationName, accountEmail]);

  React.useEffect(() => {
    if (dialogAction === "updateAccount") {
      setDialogButton("update account");
    }
    if (dialogAction === "deleteAccount") {
      setDialogButton("delete account");
    } else return;
  }, [dialogAction, dialogButton]);

  async function handleAccountUpdate() {
    try {
      await updateEmail(user.current, accountEmail);
    } catch (error) {
      return error;
    }
    await updateProfile(user.current, { displayName: organizationName });
  }

  async function handleAccountDelete() {}

  async function onReauthenticationSubmit(event) {
    event.preventDefault();
    setReauthenticationDialogOpen(false);
    setLoading(true);
    const credentials = await EmailAuthProvider.credential(
      user.current.email,
      loginPassword
    );
    try {
      await reauthenticateWithCredential(user.current, credentials);
      setLoading(false);
      if (dialogAction === "updateAccount") {
        handleAccountUpdate();
      }
      if (dialogAction === "deleteAccount") {
        handleAccountDelete();
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function onRecoverPasswordSubmit(event) {
    event.preventDefault();

    const recoverAccountToastState = {
      title: "Password reset email sent",
      description:
        "If an account exists, you will receive a password reset email",
      icon: <FiMail />,
    };
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, accountEmail);
      setToastState(recoverAccountToastState);
      setTimeout(() => {
        setLoading(false);
        setToastOpen(true);
      }, MINIMUM_LOADING_TIME);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setToastState(recoverAccountToastState);
      } else {
        setToastState(Toast.unknownState);
      }
      setTimeout(() => {
        setLoading(false);
        setToastOpen(true);
      }, MINIMUM_LOADING_TIME);
    }
  }

  return (
    <Wrapper>
      <Options>
        <AccountOption
          header="General"
          onSubmit={handleAccountUpdate}
          method="post"
        >
          <TextInput
            id="organization-name-input"
            labelText="Organization name"
            value={organizationName}
            onChange={(e) => {
              setOrganizationName(e.target.value);
              isOrganizationName.test(e.target.value)
                ? setOrganizationNameError(false)
                : setOrganizationNameError(true);
            }}
            errorText={
              !organizationNameError ? "" : inputErrors.organizationName
            }
          />
          <TextInput
            id="account-email-input"
            labelText="Account email"
            value={accountEmail}
            onChange={(e) => {
              setAccountEmail(e.target.value);
              isEmail(e.target.value)
                ? setAccountEmailError(false)
                : setAccountEmailError(true);
            }}
            errorText={!accountEmailError ? "" : inputErrors.email}
          />
          <SubmitLoaderWrapper>
            {loading && dialogAction === "updateAccount" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <Button
              type="button"
              onClick={() => {
                setDialogAction(dialogActions.updateAccount);
                setReauthenticationDialogOpen(true);
              }}
              disabled={generalUpdateCheck}
            >
              <FiSave />
              Save
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption header="Change Password">
          <TextInput
            id="current-password-input"
            labelText="Current password"
            value={currentPassword}
            variant="password"
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              isStrongPassword(e.target.value, passwordRequirements)
                ? setCurrentPasswordError(false)
                : setCurrentPasswordError(true);
            }}
            errorText={!currentPasswordError ? "" : inputErrors.password}
          />
          <TextInput
            id="new-password-input"
            labelText="New password"
            value={newPassword}
            variant="password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              isStrongPassword(e.target.value, passwordRequirements)
                ? setNewPasswordError(false)
                : setNewPasswordError(true);
            }}
            errorText={!newPasswordError ? "" : inputErrors.password}
          />
          <TextInput
            id="new-password-input"
            labelText="Confirm new password"
            value={confirmNewPassword}
            variant="password"
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              e.target.value === newPassword
                ? setConfirmNewPasswordError(false)
                : setConfirmNewPasswordError(true);
            }}
            errorText={
              !confirmNewPasswordError ? "" : inputErrors.confirmPassword
            }
          />
          <SubmitLoaderWrapper>
            {loading && dialogAction === "changePassword" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <Button
              type="button"
              onClick={() => {
                setDialogAction(dialogActions.changePassword);
              }}
            >
              <FiSave />
              Save
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption header="Recover password" layout="horizontal">
          <SubmitLoaderWrapper>
            {loading && dialogAction === "recoverPassword" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <Button
              variant="primary"
              type="submit"
              onClick={(event) => {
                setDialogAction(dialogActions.recoverPassword);
                onRecoverPasswordSubmit(event);
              }}
            >
              <FiMail />
              Send
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption header="Verify Email" layout="horizontal">
          <SubmitLoaderWrapper>
            {loading && dialogAction === "verifyEmail" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <Button
              variant="primary"
              type="button"
              onClick={() => {
                setDialogAction(dialogActions.verifyEmail);
              }}
            >
              <FiMail />
              Send
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption header="Delete Account" layout="horizontal">
          <SubmitLoaderWrapper>
            {loading && dialogAction === "deleteAccount" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <Button
              type="button"
              onClick={() => {
                setDialogAction(dialogActions.deleteAccount);
                setReauthenticationDialogOpen(true);
              }}
            >
              <FiUserX />
              Delete
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>{" "}
      </Options>
      <Dialog.Root
        open={reauthenticationDialogOpen}
        onOpenChange={setReauthenticationDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay>
            <DialogContent
              header
              title="Re-authentication required"
              description="For security purposes, please re-enter your login credentials to make the requested account changes"
            >
              <DialogForm onSubmit={onReauthenticationSubmit}>
                <DialogInputs>
                  <TextInput
                    id="password-input"
                    labelText="Current Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </DialogInputs>
                <SubmitWrapper>
                  <TextButton
                    type="button"
                    onClick={(event) => {
                      setReauthenticationDialogOpen(false);
                      setDialogAction(dialogActions.recoverPassword);
                      onRecoverPasswordSubmit(event);
                    }}
                  >
                    Forgot password?
                  </TextButton>
                  <Button
                    type="submit"
                    onClick={(event) => {
                      onReauthenticationSubmit(event);
                    }}
                  >
                    {dialogButton}
                  </Button>
                </SubmitWrapper>
              </DialogForm>
            </DialogContent>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastState.title}
        description={toastState.description}
      >
        <Toast.Icon>{toastState.icon}</Toast.Icon>
      </Toast.Root>
      <Toast.Viewport />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 72px;
  padding-bottom: 72px;
`;

const DialogContent = styled(Dialog.Content)`
  max-width: 664px;
`;

const DialogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: var(--color-yellow-2);
  gap: 16px;
`;

const DialogInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TextButton = styled(UnstyledButton)`
  color: var(--color-yellow-2);
  font-weight: bold;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--color-yellow-1);
    }
  }
`;

const SubmitLoaderWrapper = styled.div`
  display: flex;
  width: fit-content;
  align-self: flex-end;
  gap: 16px;
`;

export default Account;
