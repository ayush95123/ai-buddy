import { useEffect } from "react";

/**
 * Calls callback when the specified key is pressed anywhere in the document.
 * @param {string} targetKey - The key to listen for (e.g. "Enter").
 * @param {() => void} callback - Function to call when key is pressed.
 */
export function useKeyDown(targetKey, callback) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === targetKey) {
        e.preventDefault();
        callback();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [targetKey, callback]);
}