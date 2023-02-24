import * as React from "react";
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
  return (
    // Prevent accessibility APIs from accessing content
    <TextWrapper aria-hidden={true} {...props}>
      <TextShape />
    </TextWrapper>
  );
}

const TextWrapper = styled.div`
  // Ensure wrapper width reflects the absolutely positioned shape's width not
  // its content. This prevents layout shift in sibling elements.
  width: var(--text-length);
  // Contain the absolutely positioned shape
  position: relative;
  color: transparent;

  // Render content for baseline-alignment
  &:after {
    content: "_";
  }
`;

const TextShape = styled.div`
  height: 1em;
  width: var(--text-length);
  // Position the shape in the middle of the line
  position: absolute;
  top: calc((1em * var(--line-height) - 1em) / 2);
  ${html}
`;
