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
} from "firebase/auth";

import AccountOption from "@components/account-option";
import TextInput from "@components/text-input";
import Button from "@components/button";
import { useAuth } from "@context/auth-context";
import * as Dialog from "@components/dialog";

const isOrganizationName = /^([a-zA-Z0-9]){3,16}$/;

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

function Account() {
  const { auth, user } = useAuth();

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
    React.useState(true);
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

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

  async function handleAccountUpdate(event) {
    event.preventDefault();
    try {
      await updateEmail(user.current, accountEmail);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        setReauthenticationDialogOpen(true);
      }
    }
    await updateProfile(user.current, { displayName: organizationName });
  }

  async function onReauthenticationSubmit(event) {
    event.preventDefault();
    const credentials = await EmailAuthProvider.credential(
      loginEmail,
      loginPassword
    );
    try {
      await reauthenticateWithCredential(user.current, credentials);
    } catch (error) {
      return error;
    }
  }

  return (
    <Wrapper>
      <Options>
        <AccountOption header="Verify Email" layout="horizontal">
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button variant="primary" type="submit">
              <FiMail />
              Send Email
            </Button>
          </div>
        </AccountOption>
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
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button disabled={generalUpdateCheck}>
              <FiSave />
              Save Changes
            </Button>
          </div>
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
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button>
              <FiSave />
              Save Password
            </Button>
          </div>
        </AccountOption>
        <AccountOption header="Delete Account" layout="horizontal">
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button variant="primary" type="submit">
              <FiUserX />
              Delete
            </Button>
          </div>
        </AccountOption>{" "}
      </Options>
      <Dialog.Root
        open={reauthenticationDialogOpen}
        onOpenChange={setReauthenticationDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay>
            <Dialog.Content
              header
              title="Re-authentication required"
              description="For security purposes, please re-enter your login credentials to make the requested account changes"
            >
              <DialogForm onSubmit={onReauthenticationSubmit}>
                <DialogInputs>
                  <TextInput
                    id="email-input"
                    labelText="Current Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <TextInput
                    id="password-input"
                    labelText="Current Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </DialogInputs>
                <Button type="submit">
                  <FiSave />
                  Save person
                </Button>
              </DialogForm>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
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

const DialogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 32px;
  color: var(--color-yellow-2);
`;

const DialogInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default Account;
