import * as React from "react";

function useScroll() {
  const [scroll, setScroll] = React.useState({
    y: 0,
    direction: "",
    status: "idle",
  });

  React.useEffect(() => {
    let statusTimeoutID;
    function handleScroll() {
      setScroll((prevScroll) => ({
        y: window.scrollY,
        direction: window.scrollY > prevScroll.y ? "down" : "up",
        status: "scrolling",
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
