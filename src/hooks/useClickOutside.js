import { useEffect } from "react";

export const useClickOutside = (ref, handler, when = true) => {
  useEffect(() => {
    if (!when) return;

    const listener = (event) => {
      // If clicking inside the ref, do nothing
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event); // Otherwise, trigger handler
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, when]);
};