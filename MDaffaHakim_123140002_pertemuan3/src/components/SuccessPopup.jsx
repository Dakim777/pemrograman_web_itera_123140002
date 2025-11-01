import React, { useEffect } from "react";
import "../styles/SuccessPopup.css";

const SuccessPopup = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="popup-overlay">
      <div className="popup-box" role="dialog" aria-modal="true">
        <div className="popup-icon">✅</div>
        <h2>Pesanan Berhasil!</h2>
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
        <button className="popup-close" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
};

export default SuccessPopup;
