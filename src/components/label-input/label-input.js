import React from "react";
import styled from "styled-components";

const LabelInput = ({ id, className, label, value, onChange, ...props }) => {
  if (!id) {
    throw new Error("LabelInput must have an id");
  }

  return (
    <Wrapper role="search" className={className}>
      <label htmlFor={id}>{label}</label>
      <InputWrapper>
        <TextInput
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          {...props}
        />
      </InputWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-yellow-2);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

const TextInput = styled.input`
  border: 1px solid var(--color-yellow-3);
  border-radius: 8px;
  padding: 8px 12px;
  flex: 1;
  color: inherit;

  &::placeholder {
    color: var(--color-gray-5);
  }

  &:focus-visible {
    outline: 2px solid var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

export default LabelInput;
