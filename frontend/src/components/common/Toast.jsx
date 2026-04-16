import { useState, useEffect, useCallback } from 'react';

let addToast;

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToast = (msg, type = 'info') => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
  }, []);

  if (!toasts.length) return null;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

export const toast = {
  success: (msg) => addToast?.(msg, 'success'),
  error:   (msg) => addToast?.(msg, 'error'),
  info:    (msg) => addToast?.(msg, 'info'),
};
