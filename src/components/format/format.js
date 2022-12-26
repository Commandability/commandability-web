import * as React from "react";
import styled from "styled-components";

function Format({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>;
}

const Wrapper = styled.div`
  color: var(--color-gray-1);

  h1 {
    font-size: 2em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-gray-2);
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--color-gray-8);
  }

  h2 {
    font-size: 1.5em;
    color: var(--color-gray-3);
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--color-gray-8);
  }

  h3 {
    font-size: 1.25em;
    color: var(--color-gray-3);
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.875em;
  }

  h6 {
    font-size: 0.75em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  ul,
  ol,
  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  li + li {
    margin-top: 0.25em;
  }

  ul,
  ol {
    padding-left: 2em;
  }

  a {
    color: var(--color-yellow-2);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  strong {
    color: var(--color-yellow-1);
  }
`;

export default Format;
