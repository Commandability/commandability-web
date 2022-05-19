import * as React from "react";
import styled from "styled-components";

function Pill({ variant, children }) {
  let Component;

  if (variant === "light") {
    Component = LightPill;
  } else if (variant === "dark") {
    Component = DarkPill;
  } else {
    throw new Error(`Unrecognized Button variant: ${variant}`);
  }
  return <Component>{children}</Component>;
}

const PillBase = styled.button`
  font-weight: bold;
  border-radius: 24px;
  border: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 24px;
  padding-right: 24px;
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
