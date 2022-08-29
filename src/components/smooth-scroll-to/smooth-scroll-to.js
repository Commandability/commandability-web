import * as React from "react";

import usePrefersReducedMotion from "hooks/use-prefers-reduced-motion";
import HashLink from "components/hash-link";
import UnstyledButton from "components/unstyled-button";

function SmoothScrollTo(
  { targetId, targetRef, onClick, style, activeStyle, children, ...props },
  forwardedRef
) {
  const prefersReducedMotion = usePrefersReducedMotion();

  function smoothScroll() {
    const target = targetId
      ? document.querySelector(`#${targetId}`)
      : targetRef.current;
    target?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  if (targetId) {
    return (
      <HashLink
        {...props}
        ref={forwardedRef}
        to={`#${targetId}`}
        onClick={(event) => {
          smoothScroll();
          onClick && onClick(event);
        }}
        style={{ ...style, ...activeStyle }}
      >
        {children}
      </HashLink>
    );
  } else if (targetRef) {
    return (
      <UnstyledButton
        {...props}
        onClick={(event) => {
          smoothScroll();
          onClick && onClick(event);
        }}
        style={style}
      >
        {children}
      </UnstyledButton>
    );
  } else {
    throw new Error(
      "SmoothScrollTo must have either a targetId or a targetRef"
    );
  }
}

export default React.forwardRef(SmoothScrollTo);
