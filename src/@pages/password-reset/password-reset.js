import * as React from "react";
import styled from "styled-components";
import isStrongPassword from "validator/lib/isStrongPassword";
import { FiSave } from "react-icons/fi";
import { confirmPasswordReset } from "firebase/auth";

import { QUERIES } from "@constants";
import AccountOption from "@components/account-option";
import Button from "@components/button";
import FireLoader from "@components/fire-loader";
import TextInput from "@components/text-input";

const inputErrors = {
  password: "Must contain at least 16 characters",
};

const passwordRequirements = {
  minLength: 16,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
};

function PasswordReset() {
  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handlePasswordReset(event) {
    event.preventDefault();
  }

  return (
    <Wrapper>
      <Content>
        <AccountOption header="Reset Password">
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
              type="button"
              onClick={(event) => {
                handlePasswordReset(event);
              }}
              disabled={newPasswordError || newPassword === ""}
            >
              <FiSave />
              Save
            </Button>
          </SubmitLoaderWrapper>
        </AccountOption>
      </Content>
    </Wrapper>
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
  background-color: var(--color-white);
  border-radius: var(--border-radius);

  @media ${QUERIES.phoneAndSmaller} {
    padding: 0px 8px;
    border-radius: 0;
  }
`;

const SubmitLoaderWrapper = styled.div`
  display: flex;
  width: fit-content;
  align-self: flex-end;
  gap: 16px;
`;

export default PasswordReset;
