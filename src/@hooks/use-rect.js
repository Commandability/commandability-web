import * as React from "react";

/**
 * A number, or a string containing a number.
 * @typedef {Object} Rect
 * @property {number} bottom - The node's bottom coordinate
 * @property {number} left - The node's left coordinate
 * @property {number} right - The node's right coordinate
 * @property {number} top - The node's top coordinate
 * @property {number} width - The node's width
 * @property {number} height - The node's height
 */

/**
 * Track the size and position of a dom node
 * @returns {Array<React.useCallback|Rect>} A react callback ref and an object containing the size and position of a dom node
 */
function useRect() {
  const [node, setNode] = React.useState(null);
  const [rect, setRect] = React.useState({
    bottom: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
    width: undefined,
    height: undefined,
  });

  const ref = React.useCallback((node) => {
    const effect = async () => {
      await document.fonts.ready;

      if (node !== null) {
        setNode(node);
        setRect(node.getBoundingClientRect());
      }
    };
    effect();
  }, []);

  React.useLayoutEffect(() => {
    function handleResize() {
      if (node) {
        setRect(node.getBoundingClientRect());
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [node]);

  return [ref, rect];
}

export default useRect;
