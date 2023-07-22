import * as React from "react";
import styled from "styled-components";
import * as RadixSelect from "@radix-ui/react-select";
import { FiChevronDown, FiCheck } from "react-icons/fi";

import UnstyledButton from "@components/unstyled-button";

const VARIANTS = {
  dialog: "dialog",
  page: "page",
};

export const Root = React.forwardRef(
  (
    { className, children, label, variant = "dialog", id, ...props },
    forwardedRef
  ) => {
    if (!VARIANTS[variant] && variant)
      throw new Error(`Unknown variant provided to Select.`);

    return (
      <RootWrapper className={className} variant={variant}>
        <LabelText variant={variant} htmlFor={id}>
          {label}
        </LabelText>
        <InputWrapper variant={variant}>
          <RadixSelect.Root {...props}>
            <RadixSelect.Trigger
              id={id}
              ref={forwardedRef}
              variant={variant}
              asChild
            >
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
        </InputWrapper>
      </RootWrapper>
    );
  }
);

Root.displayName = "Root";

const RootWrapper = styled.div`
  display: flex;
  padding-bottom: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "20px";
      case VARIANTS.page:
        return null;
      default:
    }
  }};
  flex-direction: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "row";
      case VARIANTS.page:
        return "column";
      default:
    }
  }};
  gap: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "16px";
      case VARIANTS.page:
        return "4px";
      default:
    }
  }};
  align-items: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "baseline";
      case VARIANTS.page:
        return null;
      default:
    }
  }};
  justify-content: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "flex-end";
      case VARIANTS.page:
        return null;
      default:
    }
  }};
`;

const InputWrapper = styled.div`
  width: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "320px";
      case VARIANTS.page:
        return "208px";
      default:
    }
  }};
`;

const LabelText = styled.span`
  color: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "var(--color-yellow-2)";
      case VARIANTS.page:
        return "var(--text-secondary)";
      default:
    }
  }};
  font-size: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "1rem";
      case VARIANTS.page:
        return "0.875rem";
      default:
    }
  }};
`;

const TriggerButton = styled(UnstyledButton)`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  align-items: center;
  border-radius: var(--border-radius);
  border: 1px solid
    ${(props) => {
      switch (props.variant) {
        case VARIANTS.dialog:
          return "var(--color-yellow-3)";
        case VARIANTS.page:
          return "var(--text-accent-primary)";
        default:
      }
    }};

  color: ${(props) => {
    switch (props.variant) {
      case VARIANTS.dialog:
        return "var(--color-yellow-2)";
      case VARIANTS.page:
        return "var(--text-primary)";
      default:
    }
  }};
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

Item.displayName = "Item";

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
