import React from "react";
import styled from "styled-components";
import { FiSearch as UnstyledFiSearch } from "react-icons/fi";

import VisuallyHidden from "components/visually-hidden";
import UnstyledButton from "components/unstyled-button";

const SearchInput = ({ id, className, variant, ...props }) => {
  if (!id) {
    throw new Error("SearchInput must have an id");
  }

  return (
    <Wrapper className={className}>
      <Label htmlFor={id}>Search</Label>
      <InputWrapper>
        <TextInput type="text" id={id} {...props} />
        {variant === "button" ? (
          <SearchButton type="submit">
            <VisuallyHidden>Search</VisuallyHidden>
            <UnstyledFiSearch />
          </SearchButton>
        ) : (
          <StyledFiSearch />
        )}
      </InputWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--color-gray-2);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

const Label = styled.label`
  color: var(--color-gray-2);
  font-size: ${14 / 16}rem;
`;

const TextInput = styled.input`
  border: 1px solid var(--color-gray-5);
  border-radius: 8px;
  padding: 8px 12px;
  padding-left: 36px;
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

const StyledFiSearch = styled(UnstyledFiSearch)`
  position: absolute;
  left: 12px;
  stroke: var(--color-gray-2);

  ${TextInput}:focus-visible + & {
    stroke: var(--color-yellow-3);
  }
`;

const SearchButton = styled(UnstyledButton)`
  position: absolute;
  left: 8px;
  padding: 4px;
  & > svg {
    stroke: var(--color-gray-2);
  }
  ${TextInput}:focus-visible + & {
    & > svg {
      stroke: var(--color-yellow-3);
    }
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-radius: 100%;
      background-color: var(--color-gray-9);
      ${TextInput}:focus-visible + & {
        background-color: var(--color-yellow-9);
      }
    }
  }
`;

export default SearchInput;
