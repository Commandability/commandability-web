import Spacer from "components/spacer";
import * as React from "react";
import styled from "styled-components";

function Button({ variant, icon, children }) {
  let Component;

  if (variant === "light") {
    Component = LightButton;
  } else if (variant === "dark") {
    Component = DarkButton;
  } else {
    throw new Error(`Unrecognized Button variant: ${variant}`);
  }

  return (
    <Component>
      {icon ? icon() : null}
      <Spacer size={8} axis="horizontal" />
      {children}
    </Component>
  );
}

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const LightButton = styled(ButtonBase)`
  background-color: var(--color-yellow-9);
  color: var(--color-yellow-2);

  &:hover {
    background-color: var(--color-yellow-10);
  }
`;

const DarkButton = styled(ButtonBase)`
  background-color: var(--color-yellow-2);
  color: var(--color-yellow-9);

  &:hover {
    background-color: var(--color-yellow-3);
  }
`;

export default Button;
