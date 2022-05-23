import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";

import Spacer from "components/spacer";

function Pill({ variant, angle, children }) {
  let Component;

  if (variant === "light") {
    Component = LightPill;
  } else if (variant === "dark") {
    Component = DarkPill;
  } else {
    throw new Error(`Unrecognized Pill variant: ${variant}`);
  }
  return (
    <Component>
      {children}
      <Spacer size={8} axis="horizontal" />
      {angle ? <FiChevronRight /> : null}
    </Component>
  );
}

const PillBase = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  user-select: none;
`;

const LightPill = styled(PillBase)`
  background-color: var(--color-yellow-9);
  color: var(--color-yellow-2);

  &:hover {
    background-color: var(--color-yellow-10);
  }
`;

const DarkPill = styled(PillBase)`
  background-color: var(--color-yellow-2);
  color: var(--color-yellow-9);

  &:hover {
    background-color: var(--color-yellow-3);
  }
`;

export default Pill;
