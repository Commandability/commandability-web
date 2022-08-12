import * as React from "react";

function useMergeRefs(...refs) {
  const targetRef = React.useRef();

  const mergedRefs = React.useCallback(
    (node) => {
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
