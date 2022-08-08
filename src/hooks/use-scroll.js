import * as React from "react";

function useScroll() {
  const [scroll, setScroll] = React.useState({
    y: 0,
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
