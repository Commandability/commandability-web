import React from "react";
import styled from "styled-components";

const TextInput = ({
  id,
  type,
  className,
  label,
  value,
  onChange,
  ...props
}) => {
  if (!id) {
    throw new Error("TextInput must have an id");
  }

  return (
    <Wrapper className={className}>
      <label htmlFor={id}>{label}</label>
      <Input
        type={type ? type : "text"}
        id={id}
        value={value}
        onChange={onChange}
        {...props}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 16px;
  color: var(--color-yellow-2);
  position: relative;
`;

const Input = styled.input`
  border: 1px solid var(--color-yellow-3);
  border-radius: 8px;
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

export default TextInput;
