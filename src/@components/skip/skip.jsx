import * as React from "react";
import styled from "styled-components";

function Skip({ ...props }) {
  return <SkipLink {...props}>Skip to content</SkipLink>;
}

const SkipLink = styled.a`
  position: fixed;
  left: 50%;
  z-index: 2147483647;
  transform: translate(-50%, -100%);
  padding: 8px;
  border-radius: var(--border-radius);
  background-color: var(--color-yellow-2);
  color: var(--color-yellow-9);
  font-weight: bold;
  text-decoration: none;

  @media (prefers-reduced-motion: no-preference) {
    will-change: transform;
    transition: transform 200ms ease-out;
  }

  &:focus {
    outline-offset: 2px;
    transform: translate(-50%, calc(0% + 16px));
  }
`;

export default Skip;
