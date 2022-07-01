// https://www.joshwcomeau.com/react/prefers-reduced-motion/

import * as React from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

const getInitialState = () => !window.matchMedia(QUERY).matches;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    React.useState(getInitialState);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event) => {
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
