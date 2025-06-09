import { useEffect } from "react";
import "../../styles/chat/Toast.css";

/**
 * Toast - Simple alert popup for showing temporary messages
 *
 * Props:
 * - message: string - The message to display inside the toast
 * - onClose: function - Callback to close the toast
 * - duration: number (default: 3000) - How long (in ms) to auto-dismiss
 */
const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup on unmount or rerender
  }, [onClose, duration]);

  return (
    <div className="custom-toast" role="alert" aria-live="assertive">
      <div className="toast-content">
        <span className="toast-icon" aria-hidden="true">
          ⚠️
        </span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose} aria-label="Close">
          ✖
        </button>
      </div>
    </div>
  );
};

export default Toast;
