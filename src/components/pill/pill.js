import * as React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";

import Spacer from "components/spacer";

const THEMES = {
  light: {
    "--background-color": "var(--color-yellow-9)",
    "--hover-background-color": "var(--color-yellow-10)",
    "--color": "var(--color-yellow-2)",
  },
  dark: {
    "--background-color": "var(--color-yellow-2)",
    "--hover-background-color": "var(--color-yellow-3)",
    "--color": "var(--color-yellow-9)",
    "--selection-color": "var(--color-yellow-3)",
    "--selection-background": "var(--color-yellow-10)",
  },
};

function Pill({ theme, angle, targetId, href, onClick, children }) {
  const styles = THEMES[theme];

  function smoothScroll(ev) {
    // Disable the default anchor-clicking behavior
    // of scrolling to the element
    ev.preventDefault();
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <PillBase
      style={styles}
      href={targetId ? `#${targetId}` : href}
      onClick={(event) => {
        targetId && smoothScroll(event);
        onClick(event);
      }}
      as={href || targetId ? "a" : "button"}
    >
      <Text>{children}</Text>
      <Spacer size={8} axis="horizontal" />
      {angle ? <FiChevronRight /> : null}
    </PillBase>
  );
}

const PillBase = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999999px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  background-color: var(--background-color);
  font-weight: bold;
  color: var(--color);
  text-decoration: none;

  & > svg {
    stroke-width: 0.175rem;
  }

  &:focus {
    outline-offset: 2px;
  }

  &:active {
    background-color: var(--hover-background-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--hover-background-color);
    }
  }
`;

const Text = styled.span`
  position: relative;
  top: -0.05rem;
`;

export default Pill;
