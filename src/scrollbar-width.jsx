import * as React from "react";

export default function ScrollbarWidth() {
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      window.innerWidth - document.documentElement.clientWidth + "px"
    );
  }, []);

  return undefined;
}
