import React from "react";

/**
 * Track when a key is pressed
 * @param targetKey - The tracked key
 * @returns A boolean value that is true if the key is pressed and is false otherwise
 */
export function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = React.useState(false);

  React.useEffect(() => {
    function downHandler({ key }: KeyboardEvent) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
    function upHandler({ key }: KeyboardEvent) {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    }
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
