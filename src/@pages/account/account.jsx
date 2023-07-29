import * as React from "react";
import styled from "styled-components";
import { FiSave, FiUserX, FiMail, FiX, FiCheck } from "react-icons/fi";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";

import AccountOption from "@components/account-option";
import TextInput from "@components/text-input";
import Button from "@components/button";
import { useAuth } from "@context/auth-context";
import * as Dialog from "@components/dialog";
import * as Toast from "@components/toast";
import Stack from "@components/stack";
import FireLoader from "@components/fire-loader";
import { passwordRequirements } from "site-config";

const isOrganizationName = /^([a-zA-Z0-9]){3,16}$/;
const MINIMUM_LOADING_TIME = 400;

const inputErrors = {
  organizationName: `Must be alphanumeric and contain between 3 and 16 characters`,
  email: `Must be a valid email`,
  password: `Must contain at least ${passwordRequirements.minLength} characters`,
  confirmPassword: `Must match new password above`,
};

const dialogActions = {
  updateAccount: "updateAccount",
  changePassword: "changePassword",
  recoverPassword: "recoverPassword",
  verifyEmail: "verifyEmail",
  deleteAccount: "deleteAccount",
};

function SecurityDialog({
  actionHandler,
  actionLabel,
  handleReauthentication,
  children,
}) {
  const [securityDialogOpen, setSecurityDialogOpen] = React.useState(false);
  const [loginPassword, setLoginPassword] = React.useState("");
  return (
    <Dialog.Root open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
      {children}
      <Dialog.Portal>
        <Dialog.Overlay>
          <DialogContent
            header
            title="Re-authentication required"
            description="For security purposes, please re-enter your login credentials to make the requested account changes"
          >
            <DialogForm
              onSubmit={(e) => {
                e.preventDefault();
                setSecurityDialogOpen(false);
                handleReauthentication(actionHandler, loginPassword);
              }}
            >
              <DialogInputs>
                <TextInput
                  id="password-input"
                  label="Current Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </DialogInputs>
              <SubmitWrapper>
                <Button
                  type="button"
                  variant="quaternary"
                  onClick={(e) => {
                    e.preventDefault();
                    setSecurityDialogOpen(false);
                    setDialogAction(dialogActions.recoverPassword);
                    handleRecoverPassword();
                  }}
                >
                  Forgot password?
                </Button>
                <Stack axis="horizontal">
                  <Dialog.Close asChild>
                    <Button variant="secondary">
                      <FiX />
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button type="submit">{actionLabel}</Button>
                </Stack>
              </SubmitWrapper>
            </DialogForm>
          </DialogContent>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Account() {
  const { user, setUser, auth } = useAuth();

  const [organizationName, setOrganizationName] = React.useState(
    user.current.displayName
  );
  const [organizationNameError, setOrganizationNameError] =
    React.useState(false);
  const [accountEmail, setAccountEmail] = React.useState(user.current.email);
  const [accountEmailError, setAccountEmailError] = React.useState(false);
  const [generalOptionEnable, setGeneralOptionEnable] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] =
    React.useState(false);
  const [passwordOptionEnable, setPasswordOptionEnable] = React.useState(false);

  const [dialogAction, setDialogAction] = React.useState("");

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
      setGeneralOptionEnable(true);
    } else {
      setGeneralOptionEnable(false);
    }
  }, [user, organizationName, accountEmail]);

  React.useEffect(() => {
    if (
      currentPassword !== "" &&
      confirmNewPassword !== "" &&
      !confirmNewPasswordError
    ) {
      setPasswordOptionEnable(false);
    } else {
      setPasswordOptionEnable(true);
    }
  }, [currentPassword, confirmNewPassword, confirmNewPasswordError]);

  async function handleReauthentication(actionHandler, loginPassword) {
    console.log(loginPassword);
    let reauthenticationToastState = {
      title: "Invalid password",
      description: "The password given for reauthentication was invalid",
      icon: <FiX />,
    };
    if (loginPassword === "") {
      setToastState(reauthenticationToastState);
      setToastOpen(true);
      resetState();
      return;
    }
    setLoading(true);
    const credentials = await EmailAuthProvider.credential(
      user.current.email,
      loginPassword
    );
    try {
      await reauthenticateWithCredential(user.current, credentials);
      setLoading(false);
      actionHandler();
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/wrong-password") {
        setToastState(reauthenticationToastState);
        setToastOpen(true);
        resetState(true);
        return;
      } else {
        setToastState(Toast.unknownState);
        setToastOpen(true);
        resetState(true);
        return error;
      }
    }
  }

  async function handleAccountUpdate() {
    let changeAccountIntoToastState = {
      title: "Account updated",
      description: "your account has been successfully updated",
      icon: <FiCheck />,
    };
    try {
      await updateEmail(user.current, accountEmail);
    } catch (error) {
      setToastState(Toast.unknownState);
      setToastOpen(true);
      resetState(true);
      return error;
    }
    try {
      await updateProfile(user.current, { displayName: organizationName });
      setUser((prevUser) => ({ ...prevUser, current: user.current }));
      setToastState(changeAccountIntoToastState);
      setToastOpen(true);
    } catch (error) {
      setToastState(Toast.unknownState);
      setToastOpen(true);
      resetState(true);
      return error;
    }
  }

  async function handlePasswordChange() {
    let changePasswordToastState = {
      title: "Invalid password",
      description:
        "The current password that was entered for authentication was invalid",
      icon: <FiX />,
    };
    setLoading(true);
    const credentials = await EmailAuthProvider.credential(
      user.current.email,
      currentPassword
    );
    try {
      await reauthenticateWithCredential(user.current, credentials);
      await updatePassword(user.current, newPassword);
      clearPasswordInputs();
      setLoading(false);
      changePasswordToastState = {
        title: "Password changed",
        description: "You have successfully changed your password",
        icon: <FiCheck />,
      };
      setToastState(changePasswordToastState);
      setToastOpen(true);
      resetState(true);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/wrong-password") {
        setToastState(changePasswordToastState);
        setToastOpen(true);
        resetState(true);
        return;
      } else {
        setToastState(Toast.unknownState);
        setToastOpen(true);
        resetState(true);
        return error;
      }
    }
  }

  async function handleRecoverPassword() {
    const recoverPasswordToastState = {
      title: "Password reset email sent",
      description:
        "If an account exists, you will receive a password reset email",
      icon: <FiMail />,
    };
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, accountEmail);
      setToastState(recoverPasswordToastState);
      setTimeout(() => {
        setLoading(false);
        setToastOpen(true);
      }, MINIMUM_LOADING_TIME);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setToastState(recoverPasswordToastState);
      } else {
        setToastState(Toast.unknownState);
      }
      resetState(true);
      setTimeout(() => {
        setLoading(false);
        setToastOpen(true);
      }, MINIMUM_LOADING_TIME);
    }
  }

  async function handleAccountDelete() {
    try {
      await deleteUser(user.current);
      window.open("/");
    } catch (error) {
      setToastState(Toast.unknownState);
      setToastOpen(true);
      resetState(true);
    }
  }

  async function handleVerifyEmail() {
    const verifyEmailToastState = {
      title: "Verification email sent",
      description:
        "If an account exists, you will receive an account verification email",
      icon: <FiMail />,
    };
    try {
      await sendEmailVerification(user.current);
      setToastState(verifyEmailToastState);
      setToastOpen(true);
      resetState(true);
    } catch (error) {
      setToastState(Toast.unknownState);
      setToastOpen(true);
      resetState(true);
    }
    return;
  }

  function resetState() {
    setDialogAction("");
  }

  function clearPasswordInputs() {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordError(false);
    setConfirmNewPassword("");
    setConfirmNewPasswordError(false);
  }

  return (
    <Wrapper>
      <Options>
        {user.current.emailVerified ? (
          <></>
        ) : (
          <AccountOption
            header="Verify Email"
            layout="horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              setDialogAction(dialogActions.verifyEmail);
              handleVerifyEmail();
            }}
          >
            <SubmitLoaderWrapper>
              {loading && dialogAction === "verifyEmail" ? (
                <FireLoader
                  style={{
                    "--fire-icon-width": "36px",
                    "--fire-icon-height": "36px",
                  }}
                />
              ) : null}
              <Button variant="primary" type="submit">
                <FiMail />
                Send
              </Button>
            </SubmitLoaderWrapper>
          </AccountOption>
        )}
        <AccountOption
          header="General"
          onSubmit={(e) => {
            e.preventDefault();
            setDialogAction(dialogActions.updateAccount);
          }}
          method="post"
        >
          <TextInput
            id="organization-name-input"
            label="Organization name"
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
            label="Account email"
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
            <SecurityDialog
              actionHandler={handleAccountUpdate}
              actionLabel={"update account"}
              handleReauthentication={handleReauthentication}
            >
              <Dialog.Trigger asChild>
                <Button type="submit" disabled={generalOptionEnable}>
                  <FiSave />
                  Save
                </Button>
              </Dialog.Trigger>
            </SecurityDialog>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption
          header="Change Password"
          onSubmit={(e) => {
            e.preventDefault();
            setDialogAction(dialogActions.changePassword);
            handlePasswordChange();
          }}
        >
          <TextInput
            id="current-password-input"
            label="Current password"
            value={currentPassword}
            type="password"
            onChange={(e) => {
              setCurrentPassword(e.target.value);
            }}
          />
          <TextInput
            id="new-password-input"
            label="New password"
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
          <TextInput
            id="confirm-new-password-input"
            label="Confirm new password"
            value={confirmNewPassword}
            type="password"
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
            <Button type="submit" disabled={passwordOptionEnable}>
              <FiSave />
              Save
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption
          header="Recover password"
          layout="horizontal"
          onSubmit={(e) => {
            e.preventDefault();
            setDialogAction(dialogActions.recoverPassword);
            handleRecoverPassword(e);
          }}
        >
          <SubmitLoaderWrapper>
            {loading && dialogAction === "recoverPassword" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <Button variant="primary" type="submit">
              <FiMail />
              Send
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
        <AccountOption
          header="Delete Account"
          layout="horizontal"
          onSubmit={(e) => {
            e.preventDefault();
            setDialogAction(dialogActions.deleteAccount);
          }}
        >
          <SubmitLoaderWrapper>
            {loading && dialogAction === "deleteAccount" ? (
              <FireLoader
                style={{
                  "--fire-icon-width": "36px",
                  "--fire-icon-height": "36px",
                }}
              />
            ) : null}
            <SecurityDialog
              actionHandler={handleAccountDelete}
              actionLabel={"update account"}
              handleReauthentication={handleReauthentication}
            >
              <Dialog.Trigger asChild>
                <Button type="submit">
                  <FiUserX />
                  Delete
                </Button>
              </Dialog.Trigger>
            </SecurityDialog>
          </SubmitLoaderWrapper>
        </AccountOption>
      </Options>

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
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  justify-items: center;
  align-items: center;
`;

const Options = styled.div`
  padding: 32px 16px;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const DialogContent = styled(Dialog.Content)`
  max-width: 664px;
`;

const DialogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  color: var(--color-yellow-2);
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

const SubmitLoaderWrapper = styled.div`
  width: fit-content;
  display: flex;
  align-self: flex-end;
  gap: 16px;
`;

export default Account;
