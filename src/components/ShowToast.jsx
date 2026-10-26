
import { useEffect } from "react";
import "./Toast.css";

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="shopnest-toast" role="status">
      <span className="toast-check">✓</span>
      <span>{message}</span>

      <button onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

export default Toast;
