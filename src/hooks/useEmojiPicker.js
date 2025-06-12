import { useState, useRef } from "react";
import { useClickOutside } from "./useClickOutside";

/**
 * Manages emoji picker visibility and emoji selection.
 * @param {function} onEmojiClick A callback to handle selected emoji.
 */
export function useEmojiPicker(onEmojiClick) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setVisible(false), visible);

  const toggle = () => setVisible((v) => !v);

  // Pass-through function for emoji picker component
  const handleEmojiClick = (emojiData) => {
    if (typeof onEmojiClick === "function") {
      onEmojiClick(emojiData);
    }
  };

  return {
    visible,
    ref,
    toggle,
    handleEmojiClick,
  };
}
