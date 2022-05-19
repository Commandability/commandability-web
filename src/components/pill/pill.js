import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";

import Spacer from "components/spacer";

function Pill({ variant, children }) {
  let Component;

  if (variant === "light") {
    Component = LightPill;
  } else if (variant === "dark") {
    Component = DarkPill;
  } else {
    throw new Error(`Unrecognized Button variant: ${variant}`);
  }
  return (
    <Component>
      {children}
      <Spacer size={8} axis="horizontal" />
      <FiChevronRight />
    </Component>
  );
}

const PillBase = styled.button`
  font-weight: bold;
  border-radius: 24px;
  border: 0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
`;

const LightPill = styled(PillBase)`
  background-color: var(--color-yellow-9);
  color: var(--color-yellow-2);
`;

const DarkPill = styled(PillBase)`
  background-color: var(--color-yellow-2);
  color: var(--color-yellow-9);
`;

export default Pill;
