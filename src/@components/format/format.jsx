import * as React from "react";
import styled from "styled-components";

function Format({ children, ...props }) {
  return <Wrapper {...props}>{children}</Wrapper>;
}

const Wrapper = styled.div`
  color: var(--text-secondary);

  h1 {
    font-size: 2em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--text-accent-secondary);
  }

  h2 {
    font-size: 1.5em;
    color: var(--text-primary);
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--text-accent-secondary);
  }

  h3 {
    font-size: 1.25em;
    color: var(--text-primary);
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
    -webkit-tap-highlight-color: transparent;
    color: var(--text-primary);
    text-decoration-color: var(--color-yellow-3);
    text-underline-offset: 0.3em;
    text-decoration-thickness: 0.1em;
    transition: text-decoration-color 200ms;

    @media (pointer: fine) {
      &:hover {
        text-decoration-color: var(--color-yellow-1);
      }
    }

    &:active {
      text-decoration-color: var(--color-yellow-1);
    }
  }

  strong {
    color: var(--color-yellow-1);
  }
`;

export default Format;
