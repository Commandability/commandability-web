import * as React from "react";

function SmoothScrollTo({ targetId, className, children }) {
  function handleClick(ev) {
    // Disable the default anchor-clicking behavior
    // of scrolling to the element
    ev.preventDefault();
    const target = document.querySelector(`#${targetId}`);
    target?.scrollIntoView({
      behavior: "smooth",
    });
  }
  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export default SmoothScrollTo;
