import styled from "styled-components";

export const Base = styled.div`
  background-color: var(--color-gray-9);
  color: transparent;
  border-radius: 8px;
`;

export function Text({ ...props }) {
  return <TextWrapper aria-hidden={true} {...props} />;
}

const TextWrapper = styled(Base)`
  background-color: var(--color-gray-9);
  color: transparent;
  border-radius: 8px;

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
