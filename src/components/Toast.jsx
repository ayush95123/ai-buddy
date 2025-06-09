import React, { useEffect } from "react";
import "../css/Toast.css";

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="custom-toast">
      <div className="toast-content">
        <span className="toast-icon">⚠️</span>
        <span className="toast-message">{message}</span>
        <span className="toast-close" onClick={onClose}>
          ✖
        </span>
      </div>
    </div>
  );
};

export default Toast;
