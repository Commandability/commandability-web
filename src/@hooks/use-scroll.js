import * as React from "react";

/**
 * A number, or a string containing a number.
 * @typedef {Object} Scroll
 * @property {number} y - The y scroll position
 * @property {string} status - The scroll status, either "scrolling-down", "scrolling-up", or "idle"
 */

/**
 * Track the scroll position and status
 * @returns {Scroll} The last render's window.scrollY position and the current scroll status
 */
function useScroll() {
  const [scroll, setScroll] = React.useState({
    y: window.scrollY,
    status: "idle",
  });

  React.useEffect(() => {
    let statusTimeoutID;
    function handleScroll() {
      setScroll((prevScroll) => ({
        y: window.scrollY,
        status:
          window.scrollY > prevScroll.y ? "scrolling-down" : "scrolling-up",
      }));

      // Set status to idle if the scroll event doesn't fire for 100ms
      clearTimeout(statusTimeoutID);
      statusTimeoutID = setTimeout(
        () =>
          setScroll((prevScroll) => ({
            ...prevScroll,
            status: "idle",
          })),
        100
      );
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(statusTimeoutID);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scroll;
}

export default useScroll;
