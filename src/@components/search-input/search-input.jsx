import * as React from "react";
import styled from "styled-components";
import { FiSearch as UnstyledFiSearch } from "react-icons/fi";

export const Root = ({ id, className, children, ...props }) => {
  if (!id) {
    throw new Error("SearchInput must have an id");
  }

  return (
    <Wrapper className={className}>
      {children}
      <InputWrapper>
        <TextInput id={id} {...props} />
        <StyledFiSearch />
      </InputWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--text-primary);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

const TextInput = styled.input`
  border: 1px solid var(--text-accent-primary);
  border-radius: var(--border-radius);
  padding: 8px 12px;
  padding-left: 36px;
  flex: 1;
  color: inherit;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-yellow-3);
    border-color: var(--color-yellow-3);
  }
`;

const StyledFiSearch = styled(UnstyledFiSearch)`
  position: absolute;
  left: 12px;
  stroke: var(--text-primary);

  ${TextInput}:focus-visible + & {
    stroke: var(--color-yellow-3);
  }
`;

export const Label = styled.label`
  color: var(--text-secondary);
  font-size: ${14 / 16}rem;
`;
