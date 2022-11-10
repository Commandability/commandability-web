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
