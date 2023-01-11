import * as React from "react";
import styled from "styled-components";
import { FiSave, FiX } from "react-icons/fi";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import AccountOption from "components/account-option";
import TextInput from "components/text-input";
import Button from "components/button";
import { useAuth } from "context/auth-context";

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
  const [currentPassword, setCurrentPassword] = React.useState();
  const [currentPasswordError, setCurrentPasswordError] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState();
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = React.useState();
  const [confirmNewPasswordError, setConfirmNewPasswordError] =
    React.useState(false);

  return (
    <Wrapper>
      <Options>
        <AccountOption header="General">
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
            error={!organizationNameError ? "" : inputErrors.organizationName}
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
            error={!accountEmailError ? "" : inputErrors.email}
          />
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button icon={FiSave}>Save</Button>
          </div>
        </AccountOption>
        <AccountOption header="Change Password">
          <TextInput
            id="current-password-input"
            label="Current password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              isStrongPassword(e.target.value, passwordRequirements)
                ? setCurrentPasswordError(false)
                : setCurrentPasswordError(true);
            }}
            error={!currentPasswordError ? "" : inputErrors.password}
          />
          <TextInput
            id="new-password-input"
            label="New password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              isStrongPassword(e.target.value, passwordRequirements)
                ? setNewPasswordError(false)
                : setNewPasswordError(true);
            }}
            error={!newPasswordError ? "" : inputErrors.password}
          />
          <TextInput
            id="new-password-input"
            label="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
              e.target.value === newPassword
                ? setConfirmNewPasswordError(false)
                : setConfirmNewPasswordError(true);
            }}
            error={!confirmNewPasswordError ? "" : inputErrors.confirmPassword}
          />
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button icon={FiSave}>Save</Button>
          </div>
        </AccountOption>
        <AccountOption header="Delete Account">
          <div style={{ width: "fit-content", alignSelf: "flex-end" }}>
            <Button variant="primary" type="submit" icon={FiX}>
              Delete
            </Button>
          </div>
        </AccountOption>
      </Options>
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
  margin-top: 32px;
`;

export default Account;
