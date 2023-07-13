import * as React from "react";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";

import UnstyledButton from "@components/unstyled-button";
import VisuallyHidden from "@components/visually-hidden";

const VARIANTS = {
  dialog: "dialog",
  page: "page",
};

const TextInput = ({
  id,
  className,
  type = "text",
  label,
  variant = "dialog",
  errorText,
  ...props
}) => {
  if (!id) {
    throw new Error("TextInput must have an id");
  }
  if (!VARIANTS[variant] && variant)
    throw new Error(`Unknown variant provided to TextInput.`);

  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const passwordInputRef = React.useRef();

  function handleTogglePassword() {
    setVisiblePassword((isVisible) => !isVisible);
    passwordInputRef.current.focus();
  }

  return (
    <Wrapper>
      <InputGroup className={className}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        <Input
          ref={passwordInputRef}
          type={type === "password" && !visiblePassword ? "password" : "text"}
          id={id}
          placeholder={type === "password" ? "password" : undefined}
          required={type === "password" ? true : false}
          autoComplete={type === "password" ? "current-password" : undefined}
          {...props}
        />
        {type === "password" ? (
          <ToggleVisibilityButton
            type="button"
            aria-pressed={visiblePassword ? "true" : "false"}
            onClick={handleTogglePassword}
          >
            <VisuallyHidden>Toggle password visibility</VisuallyHidden>
            {visiblePassword ? <FiEye /> : <FiEyeOff />}
          </ToggleVisibilityButton>
        ) : null}
      </InputGroup>
      <InputError>{errorText}</InputError>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 16px;
  color: var(--color-yellow-2);
  position: relative;
`;

const Input = styled.input`
  border: 1px solid var(--color-yellow-3);
  border-radius: var(--border-radius);
  padding: 8px 12px;
  color: inherit;
  width: 320px;

  &::placeholder {
    color: var(--color-gray-5);
  }

  &:focus-visible {
    outline: 2px solid var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

const ToggleVisibilityButton = styled(UnstyledButton)`
  position: absolute;
  top: 10px;
  right: 8px;
  padding: 4px;

  & > svg {
    stroke: var(--color-yellow-4);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-radius: 100%;

      & > svg {
        stroke: var(--color-yellow-2);
      }
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

export default TextInput;
