import { useEffect } from "react";

/**
 * useClickOutside
 * Calls handler when a mousedown occurs outside the referenced element.
 *
 * @param {React.RefObject} ref - Element to monitor.
 * @param {Function} handler - Callback invoked on outside click.
 * @param {boolean} [when=true] - Whether the listener is active.
 */
export const useClickOutside = (ref, handler, when = true) => {
  useEffect(() => {
    if (!when) return;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, when]);
};