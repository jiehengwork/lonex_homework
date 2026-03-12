import { useState, useEffect } from 'react';
import type { ToastMessage } from '../utils/toast';

let toastCounter = 0;

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newToast = { id: ++toastCounter, ...customEvent.detail };
      setToasts((prev) => [...prev, newToast]);
      
      // 3 秒後自動消失
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-top toast-center sm:toast-end z-[100] mt-16 sm:mt-0">
      {toasts.map((t) => (
        <div key={t.id} className={`alert alert-${t.type} shadow-lg text-white`}>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
