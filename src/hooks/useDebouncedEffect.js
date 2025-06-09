import { useEffect } from "react";

/**
 * useDebouncedEffect
 * A custom hook that delays execution of a callback until
 * after a specified delay has passed since the last dependency change.
 *
 * @param {Function} callback - The effect function to debounce.
 * @param {Array<any>} deps - Dependency array, like in useEffect.
 * @param {number} delay - Delay in milliseconds before the callback fires.
 */
export const useDebouncedEffect = (callback, deps, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    // Cleanup function clears the timeout if deps or delay changes
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};