import * as React from "react";
import styled from "styled-components";
import * as RadixProgress from "@radix-ui/react-progress";

export const Root = styled(RadixProgress.Root)`
  position: relative;
  overflow: hidden;
  background-color: var(--color-gray-8);
  border-radius: 99999px;

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
`;

export function Indicator({ progress, transition = true }) {
  return (
    <IndicatorWrapper
      style={{ transform: `translateX(-${100 - progress}%)` }}
      data-transition={transition}
    />
  );
}

const IndicatorWrapper = styled(RadixProgress.Indicator)`
  background-color: var(--color-yellow-2);
  width: 100%;
  height: 100%;

  &[data-transition="true"] {
    transition: transform 600ms ease-in-out;
  }
`;
