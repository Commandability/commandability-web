/**
 * Utility functions
 */

/**
 * Get a random integer between min and max
 * @param min - The minimum integer
 * @param max - The maximum integer
 * @returns A random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Delay the execution of a function such that it runs once after it has not been called for a specified wait time
 * @param callback - The debounced callback
 * @param wait - The wait time in milliseconds
 */
export function debounce(callback: Function, wait: number) {
  let timeoutId = 0;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}
