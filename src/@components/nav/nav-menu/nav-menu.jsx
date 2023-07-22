import * as React from "react";
import styled from "styled-components";
import { useTransition, animated } from "@react-spring/web";
import FocusLock from "react-focus-lock";

import { useKeyPress } from "@hooks/use-keypress";
import UnstyledButton from "@components/unstyled-button";
import VisuallyHidden from "@components/visually-hidden";

export function Root({ menuOpen, setMenuOpen, navRef, children }) {
  const escapeKey = useKeyPress("Escape");

  const transitions = useTransition(menuOpen, {
    from: {
      transform: "translateY(-100%)",
    },
    enter: {
      transform: "translateY(0%)",
    },
    leave: {
      transform: "translateY(-100%)",
    },
  });

  React.useEffect(() => {
    setMenuOpen(false);
  }, [escapeKey, setMenuOpen]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef, setMenuOpen]);

  return (
    <FocusLock disabled={!menuOpen}>
      <ButtonWrapper
        data-state={menuOpen ? "open" : "closed"}
        aria-pressed={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <BarOne />
        <BarTwo />
        <BarThree />
        <VisuallyHidden>Toggle menu</VisuallyHidden>
      </ButtonWrapper>
      <RootWrapper aria-expanded={menuOpen}>
        {transitions((style, item) =>
          item ? (
            <Animated style={style}>
              <List>{children}</List>
            </Animated>
          ) : null
        )}
      </RootWrapper>
    </FocusLock>
  );
}

const RootWrapper = styled.div`
  position: fixed;
  // Remove one pixel for when users drag the dialog upwards while scrolling at the bottom of the screen
  top: calc(72px - 1px);
  left: 0;
  right: 0;
  font-size: clamp(${16 / 16}rem, 0.25vw + 1rem, ${18 / 16}rem);
  overflow: hidden;
  // Add padding to bottom for box-shadow
  padding-bottom: 8px;
`;

const ButtonWrapper = styled(UnstyledButton)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  // Match padding to the SiteID padding, accounting for space between the SiteID icon and it's container and the Menu icon and it's container
  padding-right: calc(((32px - 18.67px) / 2) - ((24px - 18px) / 2));

  &::after {
    --tap-increment: -14px;
    content: "";
    position: absolute;
    top: var(--tap-increment);
    left: var(--tap-increment);
    right: var(--tap-increment);
    bottom: var(--tap-increment);
  }
`;

const Bar = styled.span`
  width: 24px;
  height: 2px;
  background-color: var(--text-secondary);
`;

const BarOne = styled(Bar)`
  @media (prefers-reduced-motion: no-preference) {
    will-change: transform;
    transition: transform 400ms;
  }

  ${ButtonWrapper}[data-state="open"] & {
    transform: translateY(6px) rotate(-45deg);
  }
`;

const BarTwo = styled(Bar)`
  @media (prefers-reduced-motion: no-preference) {
    will-change: opacity;
    transition: opacity 400ms;
  }

  ${ButtonWrapper}[data-state="open"] & {
    opacity: 0;
  }
`;

const BarThree = styled(Bar)`
  @media (prefers-reduced-motion: no-preference) {
    will-change: transform;
    transition: transform 400ms;
  }

  ${ButtonWrapper}[data-state="open"] & {
    transform: translateY(-6px) rotate(45deg);
  }
`;

const Animated = styled(animated.div)`
  display: flex;
  flex-direction: column;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-white);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  padding: 24px 48px;
  padding-top: 16px;
  box-shadow: var(--nav-box-shadow);
  list-style: none;
`;

export function Link({ ...props }) {
  return (
    <li>
      <LinkInternals {...props} />
    </li>
  );
}

const LinkInternals = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  text-transform: uppercase;

  @media (prefers-reduced-motion: no-preference) {
    will-change: color;
    transition: color 400ms;
  }

  &.active {
    color: var(--color-red-3);
    &::before {
      content: "→ ";
      position: relative;
      top: -0.05em;
      opacity: 1;
    }
  }
`;
