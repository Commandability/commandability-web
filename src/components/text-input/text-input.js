import * as React from "react";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";
import VisuallyHidden from "components/visually-hidden";

const VARIANTS = {
  text: "text",
  password: "password",
};

const TextInput = ({
  id,
  className,
  labelText,
  variant = "text",
  errorText,
  ...props
}) => {
  if (!id) {
    throw new Error("TextInput must have an id");
  }
  if (!VARIANTS[variant])
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
        {labelText ? <label htmlFor={id}>{labelText}</label> : null}
        <Input
          ref={passwordInputRef}
          type={
            variant === "password" && !visiblePassword ? "password" : "text"
          }
          id={id}
          placeholder={variant === "password" ? "password" : undefined}
          required={variant === "password" ? true : false}
          autoComplete={variant === "password" ? "current-password" : undefined}
          {...props}
        />
        {variant === "password" ? (
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
    stroke: var(--color-yellow-3);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-radius: 100%;
      background-color: var(--color-yellow-9);
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
