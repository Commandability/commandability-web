import * as React from "react";
import { useLocation } from "react-router-dom";

import usePrefersReducedMotion from "hooks/use-prefers-reduced-motion";

/**
 * Smooth scroll to a dom node on mount if the url hash matches the node id
 * @param {Object} options - scrollIntoView options
 * @returns {React.useCallback} A react callback ref
 */
function useFragment(options = {}) {
  const [initialized, setInitialized] = React.useState(false);
  const { hash } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  return React.useCallback(
    (node) => {
      const { behavior = "auto" } = options;

      if (!initialized && node && hash.replace("#", "") === node?.id) {
        node.scrollIntoView({
          ...options,
          behavior: prefersReducedMotion ? "auto" : behavior,
        });
        setInitialized(true);
      }
    },
    [initialized, hash, prefersReducedMotion, options]
  );
}

export default useFragment;
