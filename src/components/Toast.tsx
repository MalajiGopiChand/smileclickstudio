import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-24 right-5 z-50 max-w-md bg-[#062F3C] text-white p-4 rounded-2xl shadow-2xl border border-[#00A3D9]/40 flex items-start gap-3 animate-fade-in">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
      <div className="text-xs sm:text-sm text-slate-100 flex-1">{message}</div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
