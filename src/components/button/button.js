import * as React from "react";
import styled from "styled-components";

function Button({ variant, children }) {
  let Component;

  if (variant === "light") {
    Component = LightButton;
  } else if (variant === "dark") {
    Component = DarkButton;
  } else {
    throw new Error(`Unrecognized Button variant: ${variant}`);
  }
  return <Component>{children}</Component>;
}

const ButtonBase = styled.button`
  font-weight: bold;
  border-radius: 8px;
  border: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 24px;
  padding-right: 24px;
`;

const LightButton = styled(ButtonBase)`
  background-color: var(--color-yellow-9);
  color: var(--color-yellow-2);
`;

const DarkButton = styled(ButtonBase)`
  background-color: var(--color-yellow-2);
  color: var(--color-yellow-9);
`;

export default Button;
