/*
  Utility functions
*/

/**
 * Delay the execution of a function such that it runs once after it has not been called for a specified wait time
 * @param callback - The debounced callback
 * @param wait - The wait time in milliseconds
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  wait: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

/**
 * Sum an array of numbers
 * @param array - The array to be summed
 * @returns The sum of the numbers in the array
 */
export function sum(arr: (number | undefined)[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    const value: number | undefined = arr[i];
    if (typeof value === "number") {
      sum = sum + value;
    }
  }

  return sum;
}

/**
 * Create an array of numbers in a range and based on a step size
 * @param start - The start number
 * @param end - The end number
 * @param step - The array step size
 * @returns An array of numbers
 */
export function range(start: number, end?: number, step = 1) {
  const output = [];

  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i += step) {
    output.push(i);
  }

  return output;
};
