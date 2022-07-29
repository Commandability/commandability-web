import * as React from "react";

function useRect() {
  const [node, setNode] = React.useState(null);
  const [rect, setRect] = React.useState({
    bottom: undefined,
    height: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
    width: undefined,
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
