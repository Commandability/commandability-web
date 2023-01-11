import * as React from "react";
import styled from "styled-components";
import { FiSave, FiX } from "react-icons/fi";

import AccountOption from "components/account-option";
import TextInput from "components/text-input";
import Button from "components/button";

function Account() {
  const [organizationName, setOrganizationName] = React.useState();
  const [accountEmail, setAccountEmail] = React.useState();
  const [newPassword, setNewPassword] = React.useState();
  const [currentPassword, setCurrentPassword] = React.useState();

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
            }}
          />
          <TextInput
            id="account-email-input"
            label="Account email"
            value={accountEmail}
            onChange={(e) => {
              setAccountEmail(e.target.value);
            }}
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
            }}
          />
          <TextInput
            id="new-password-input"
            label="New password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <TextInput
            id="new-password-input"
            label="Confirm new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
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
