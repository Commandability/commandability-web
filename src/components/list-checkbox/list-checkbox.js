import React from "react";
import styled from "styled-components";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import * as RadixLabel from "@radix-ui/react-label";
import { FiCheck } from "react-icons/fi";

import VisuallyHidden from "components/visually-hidden";

export default React.forwardRef(
  ({ className, children, label, ...props }, ref) => {
    return (
      <RadixLabel.Root>
        <VisuallyHidden>{label}</VisuallyHidden>
        <RadixCheckboxRoot ref={ref} {...props}>
          <RadixCheckbox.Indicator>
            <StyledFiCheck />
          </RadixCheckbox.Indicator>
        </RadixCheckboxRoot>
      </RadixLabel.Root>
    );
  }
);

const RadixCheckboxRoot = styled(RadixCheckbox.Root)`
  background-color: var(--color-white);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--color-gray-2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledFiCheck = styled(FiCheck)`
  min-width: ${16 / 16}rem;
`;
