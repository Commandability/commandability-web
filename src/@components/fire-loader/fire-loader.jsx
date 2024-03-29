import * as React from "react";
import styled, { keyframes } from "styled-components";

import { ReactComponent as UnstyledFireIcon } from "@assets/icons/fire-icon.svg";

function FireLoader({ ...props }) {
  return (
    <Wrapper {...props}>
      <FireIconLoader />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
`;

const yellowFillShift = keyframes`
  0% {
    fill: var(--color-yellow-1);
  }
  50% {
    fill: var(--color-yellow-2);
  }
  100% {
    fill: var(--color-yellow-3);
  }
`;

const FireIconLoader = styled(UnstyledFireIcon)`
  fill: var(--color-yellow-4);
  min-width: var(--fire-icon-width, 128px);
  min-height: var(--fire-icon-height, 128px);
  animation: ${yellowFillShift} 2000ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

export default FireLoader;
