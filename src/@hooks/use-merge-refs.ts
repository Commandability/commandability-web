import * as React from "react";

/**
 * A react ref that only contains mutable objects
 */
export type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>;

/**
 * Merge all refs passed to the function into a callback ref
 * @param refs - React refs
 * @returns A react callback ref
 */
function useMergeRefs<T>(...refs: ReactRef<T | null | undefined>[]) {
  const targetRef = React.useRef<T | null | undefined>(null);

  const mergedRefs = React.useCallback(
    (node: T | null | undefined) => {
      targetRef.current = node;

      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(targetRef.current);
        } else {
          ref.current = targetRef.current;
        }
      });

      return targetRef;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...refs]
  );

  return mergedRefs;
}

export default useMergeRefs;
