import React from "react";
import styled from "styled-components";
import * as RadixSelect from "@radix-ui/react-select";
import * as RadixLabel from "@radix-ui/react-label";
import { FiChevronDown, FiCheck } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";

export const Select = React.forwardRef(
  ({ className, children, label, ...props }, forwardedRef) => {
    return (
      <SelectWrapper className={className}>
        <RadixLabel.Root>
          <LabelText>{label}</LabelText>
          <RadixSelect.Root {...props}>
            <RadixSelect.Trigger ref={forwardedRef} asChild>
              <SelectButton>
                <RadixSelect.Value />
                <RadixSelect.Icon>
                  <FiChevronDown />
                </RadixSelect.Icon>
              </SelectButton>
            </RadixSelect.Trigger>
            <RadixSelect.Portal>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectViewport>{children}</SelectViewport>
              </SelectContent>
            </RadixSelect.Portal>
          </RadixSelect.Root>
        </RadixLabel.Root>
      </SelectWrapper>
    );
  }
);

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelText = styled.span`
  color: var(--color-gray-2);
  font-size: ${14 / 16}rem;
`;

const SelectButton = styled(UnstyledButton)`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--color-gray-5);
  color: var(--color-gray-2);
  padding: 8px;
  background-color: var(--color-white);
  width: 100%;
`;

const SelectContent = styled(RadixSelect.Content)`
  background-color: var(--color-white);
  color: inherit;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
`;

const SelectViewport = styled(RadixSelect.Viewport)`
  padding: 4px;
`;

export const SelectItem = React.forwardRef(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectItemWrapper {...props} ref={forwardedRef}>
        <SelectItemIndicator>
          <FiCheck />
        </SelectItemIndicator>
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      </SelectItemWrapper>
    );
  }
);

const SelectItemWrapper = styled(RadixSelect.Item)`
  all: unset;
  display: flex;
  padding: 8px;
  padding-left: 24px;
  padding-right: 32px;
  user-select: none;
  // Outer radius - padding
  border-radius: calc(8px - 4px);
  display: flex;
  align-items: center;

  &[data-highlighted] {
    background-color: var(--color-yellow-3);
    color: var(--color-white);
  }
`;

const SelectItemIndicator = styled(RadixSelect.ItemIndicator)`
  position: absolute;
  left: 8px;
`;
