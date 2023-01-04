import * as React from "react";
import styled from "styled-components";
import * as RadixSelect from "@radix-ui/react-select";
import * as RadixLabel from "@radix-ui/react-label";
import { FiChevronDown, FiCheck } from "react-icons/fi";

import UnstyledButton from "components/unstyled-button";

export const Root = React.forwardRef(
  ({ className, children, label, ...props }, forwardedRef) => {
    return (
      <RootWrapper className={className}>
        <RadixLabel.Root>
          <LabelText>{label}</LabelText>
          <RadixSelect.Root {...props}>
            <RadixSelect.Trigger ref={forwardedRef} asChild>
              <TriggerButton>
                <RadixSelect.Value />
                <RadixSelect.Icon>
                  <FiChevronDown />
                </RadixSelect.Icon>
              </TriggerButton>
            </RadixSelect.Trigger>
            <RadixSelect.Portal>
              <RootContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectViewport>{children}</SelectViewport>
              </RootContent>
            </RadixSelect.Portal>
          </RadixSelect.Root>
        </RadixLabel.Root>
      </RootWrapper>
    );
  }
);

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelText = styled.span`
  color: var(--color-gray-2);
  font-size: ${14 / 16}rem;
`;

const TriggerButton = styled(UnstyledButton)`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  align-items: center;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-gray-5);
  color: var(--color-gray-2);
  padding: 8px;
  background-color: var(--color-white);
  width: 100%;
`;

const RootContent = styled(RadixSelect.Content)`
  background-color: var(--color-white);
  color: inherit;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  cursor: pointer;
`;

const SelectViewport = styled(RadixSelect.Viewport)`
  --select-viewport-padding: calc(var(--border-radius) / 2);
  padding: var(--select-viewport-padding);
`;

export const Item = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <ItemWrapper {...props} ref={forwardedRef}>
      <ItemIndicator>
        <FiCheck />
      </ItemIndicator>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </ItemWrapper>
  );
});

const ItemWrapper = styled(RadixSelect.Item)`
  all: unset;
  display: flex;
  padding: 8px;
  padding-left: 24px;
  padding-right: 32px;
  user-select: none;
  // Outer radius - padding
  border-radius: calc(var(--border-radius) - var(--select-viewport-padding));
  display: flex;
  align-items: center;

  &[data-highlighted] {
    background-color: var(--color-yellow-2);
    color: var(--color-yellow-9);
  }
`;

const ItemIndicator = styled(RadixSelect.ItemIndicator)`
  position: absolute;
  left: 8px;
  color: var(--color-yellow-2);

  ${ItemWrapper}[data-highlighted] & {
    color: var(--color-yellow-9);
  }
`;
