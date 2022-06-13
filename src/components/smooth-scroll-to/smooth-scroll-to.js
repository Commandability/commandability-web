import * as React from "react";
import { NavLink } from "react-router-dom";

function SmoothScrollTo({ targetId, onClick, className, children }) {
  function smoothScroll() {
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <NavLink
      to={`#${targetId}`}
      onClick={(event) => {
        smoothScroll();
        onClick && onClick(event);
      }}
      className={className}
    >
      {children}
    </NavLink>
  );
}

export default SmoothScrollTo;
