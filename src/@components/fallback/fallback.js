import styled, { css, keyframes } from "styled-components";

const backgroundColorShift = keyframes`
  0% {
    background-color: var(--shift-color-1);
  }
  50% {
    background-color: var(--shift-color-2);
  }
  100% {
    background-color: var(--shift-color-3);
  }
`;

const fillShift = keyframes`
  0% {
    fill: var(--shift-color-1);
  }
  50% {
    fill: var(--shift-color-2);
  }
  100% {
    fill: var(--shift-color-3);
  }
`;

const base = css`
  --animation-duration: 2000ms;
`;

const shiftColors = css`
  --shift-color-1: var(--color-gray-9);
  --shift-color-2: var(--color-gray-8);
  --shift-color-3: var(--color-gray-7);
`;

const animationStyles = css`
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

export const html = css`
  ${base}
  border-radius: var(--border-radius);
  background-color: var(--color-gray-9);

  ${shiftColors}
  animation: ${backgroundColorShift} var(--animation-duration);
  ${animationStyles}
`;

export const svg = css`
  ${base}
  fill: var(--color-gray-9);

  ${shiftColors}
  animation: ${fillShift} var(--animation-duration);
  ${animationStyles}
`;

export function Text({ ...props }) {
  return <TextWrapper aria-hidden={true} {...props} />;
}

const TextWrapper = styled.div`
  ${html}

  color: transparent;
  width: var(--text-length);
  height: 1em;
  position: relative;
  // Account for spacing under below typography specific to ClearSans font-family
  top: 0.15em;

  // Maintain baseline alignment of other items that depend on the loaded text
  &:after {
    content: "_";
  }
`;
