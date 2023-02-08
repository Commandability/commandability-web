import * as React from "react";

/**
 * A mutable react ref
 */
export type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>;

/**
 * Merge all refs passed to the function into a callback ref
 * @param refs - React refs
 * @returns A react callback ref
 */
function useMergeRefs<T>(...refs: ReactRef<T | null | undefined>[]) {
  // Store the element the callback function is called with
  // here to be passed to or assigned to the merged refs
  const targetRef = React.useRef<T | null | undefined>(null);

  const mergedRefs = React.useCallback(
    // React will call the callback function with the element as a parameter
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
