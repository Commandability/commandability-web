import * as React from "react";
import styled from "styled-components";
import isStrongPassword from "validator/lib/isStrongPassword";
import { FiSave, FiX, FiCheck } from "react-icons/fi";
import { confirmPasswordReset } from "firebase/auth";

import { QUERIES } from "@constants";
import AccountOption from "@components/account-option";
import Button from "@components/button";
import FireLoader from "@components/fire-loader";
import TextInput from "@components/text-input";
import { useAuth } from "@context/auth-context";
import * as Toast from "@components/toast";
import { passwordRequirements } from "site-config";

const inputErrors = {
  password: `Must contain at least ${passwordRequirements.minLength} characters`,
};

function ManageAccount() {
  const { auth } = useAuth();

  const [newPassword, setNewPassword] = React.useState("");
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [toastState, setToastState] = React.useState({
    title: "",
    description: "",
    icon: null,
  });
  const [toastOpen, setToastOpen] = React.useState(false);

  const searchParameters = new URLSearchParams(window.location.search);
  const mode = searchParameters.get("mode");
  const code = searchParameters.get("oobCode");

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

  return (
    <Wrapper>
      <Content>
        {mode === "resetPassword" ? (
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
        ) : (
          <AccountOption header="Email Successfully Verified"></AccountOption>
        )}
      </Content>
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

export default ManageAccount;
