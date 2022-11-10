/**
 * Utility functions
 */

/**
 * Get a random integer between min and max
 * @param {number} min - The minimum integer
 * @param {number} max - The maximum integer
 * @returns {number} A random integer between min and max
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * A debounced callback
 * @callback debouncedCallback
 */

/**
 * Delay the execution of a function such that it runs once after it has not been called for a specified wait time
 * @param {debouncedCallback} callback - The debounced callback
 * @param {number} wait - The wait time in milliseconds
 */
export function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}
