import * as React from "react";

interface Scroll {
  y: number;
  status: "idle" | "scrolling-down" | "scrolling-up";
}

/**
 * Track the scroll position and status
 * @returns The last render's window.scrollY position and the current scroll status
 */
function useScroll(): Scroll {
  const [scroll, setScroll] = React.useState<Scroll>({
    y: window.scrollY,
    status: "idle",
  });

  React.useEffect(() => {
    let statusTimeoutID: ReturnType<typeof setTimeout>;
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
