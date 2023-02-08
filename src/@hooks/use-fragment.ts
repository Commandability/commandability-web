import * as React from "react";
import { useLocation } from "react-router-dom";

import usePrefersReducedMotion from "@hooks/use-prefers-reduced-motion";

/**
 * Smooth scroll to a dom node on mount if the url hash matches the node id
 * @param options - scrollIntoView options
 * @returns A react callback ref
 */
function useFragment(options: ScrollIntoViewOptions = {}) {
  const [initialized, setInitialized] = React.useState(false);
  const { hash } = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  return React.useCallback(
    (node: Element) => {
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
