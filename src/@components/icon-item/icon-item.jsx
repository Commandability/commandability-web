import * as React from "react";
import styled from "styled-components";

function IconItem({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>;
}

const Wrapper = styled.li`
  display: flex;
  flex-direction: row;
  gap: 16px;

  & > svg {
    stroke-width: 0.175rem;
    stroke: var(--color-yellow-3);
    min-width: ${18 / 16}rem;
    position: relative;
    top: 0.25rem;
  }
`;

export const ItemContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  line-height: var(--content-line-height);
`;

export default IconItem;
