import * as React from "react";

import usePrefersReducedMotion from "hooks/use-prefers-reduced-motion";
import HashLink from "components/hash-link";

function SmoothScrollTo(
  { targetId, onClick, style, activeStyle, children, ...props },
  ref
) {
  const prefersReducedMotion = usePrefersReducedMotion();

  function smoothScroll() {
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <HashLink
      {...props}
      ref={ref}
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
}

export default React.forwardRef(SmoothScrollTo);
