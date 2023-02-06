import * as React from "react";

/**
 * Track the size and position of a dom element
 * @returns A react callback ref and an object containing the size and position of a dom element
 */
function useRect() {
  const [element, setElement] = React.useState<Element | null>(null);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  const ref = React.useCallback((element: Element) => {
    const effect = async () => {
      await document.fonts.ready;

      if (element !== null) {
        setElement(element);
        setRect(element.getBoundingClientRect());
      }
    };
    effect();
  }, []);

  React.useLayoutEffect(() => {
    function handleResize() {
      if (element) {
        setRect(element.getBoundingClientRect());
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [element]);

  return [ref, rect];
}

export default useRect;
