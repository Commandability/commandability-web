import * as React from "react";

import HashLink from "components/hash-link";

function SmoothScrollTo({
  targetId,
  onClick,
  className,
  activeStyle,
  children,
  ...props
}) {
  function smoothScroll() {
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <HashLink
      {...props}
      to={`#${targetId}`}
      onClick={(event) => {
        smoothScroll();
        onClick && onClick(event);
      }}
      className={className}
      style={activeStyle}
    >
      {children}
    </HashLink>
  );
}

export default SmoothScrollTo;
