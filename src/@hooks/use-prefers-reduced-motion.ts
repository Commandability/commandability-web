/*
  Adapted from Josh Comeau's usePrefersReducedMotion
  https://www.joshwcomeau.com/react/prefers-reduced-motion/
  License: none (public domain)
*/

import * as React from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

const getInitialState = () => !window.matchMedia(QUERY).matches;

/**
 * Check if a user has reduced motion enabled
 * @returns A boolean that is true if reduced motion is enabled
 */
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    React.useState(getInitialState);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };
    mediaQueryList.addEventListener("change", listener);
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
