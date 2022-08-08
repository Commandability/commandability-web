import * as React from "react";
import { useLocation } from "react-router-dom";

import usePrefersReducedMotion from "hooks/use-prefers-reduced-motion";

function useFragment(nodeId) {
  const [initialized, setInitialized] = React.useState(false);
  const { hash } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  return React.useCallback(
    (node) => {
      if (!initialized && node && hash.replace("#", "") === nodeId) {
        node.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        setInitialized(true);
      }
    },
    [initialized, hash, nodeId, prefersReducedMotion]
  );
}

export default useFragment;
