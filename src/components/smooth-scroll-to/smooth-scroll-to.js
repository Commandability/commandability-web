import * as React from "react";

function SmoothScrollTo({ id, children }) {
  function handleClick(ev) {
    // Disable the default anchor-clicking behavior
    // of scrolling to the element
    ev.preventDefault();
    const target = document.querySelector(`#${id}`);
    target?.scrollIntoView({
      behavior: "smooth",
    });
  }
  return (
    <a href={`#${id}`} onClick={handleClick}>
      {children}
    </a>
  );
}

export default SmoothScrollTo;
