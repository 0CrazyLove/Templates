import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  const color = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${color} text-white px-4 py-3 rounded shadow-md`}> 
      <div className="flex items-center justify-between gap-4">
        <div>{message}</div>
        <button onClick={onClose} className="opacity-80 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}
