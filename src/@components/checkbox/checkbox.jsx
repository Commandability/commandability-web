import * as React from "react";
import styled from "styled-components";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import * as RadixLabel from "@radix-ui/react-label";
import { FiCheck } from "react-icons/fi";

import VisuallyHidden from "@components/visually-hidden";

const Select = React.forwardRef(({ label, ...props }, forwardedRef) => {
  return (
    <RadixLabel.Root>
      <VisuallyHidden>{label}</VisuallyHidden>
      <RadixCheckboxRoot ref={forwardedRef} {...props}>
        <RadixCheckbox.Indicator>
          <StyledFiCheck />
        </RadixCheckbox.Indicator>
      </RadixCheckboxRoot>
    </RadixLabel.Root>
  );
});

Select.displayName = "Select";

const RadixCheckboxRoot = styled(RadixCheckbox.Root)`
  color: var(--text-primary);
  background-color: var(--color-white);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--text-accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &[disabled] {
    cursor: auto;
  }
`;

const StyledFiCheck = styled(FiCheck)`
  min-width: ${16 / 16}rem;
`;

export default Select;
