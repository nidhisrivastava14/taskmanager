import React from 'react';
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast Card Item Component
 */
const ToastItem = ({ id, message, type }) => {
  const { removeToast } = useToast();

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgMap = {
    success: 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-300',
    error: 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-500/30 text-rose-950 dark:text-rose-300',
    info: 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-500/30 text-blue-950 dark:text-blue-300'
  };

  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border shadow-lg backdrop-blur-md animate-slideIn ${bgMap[type] || bgMap.info}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {iconMap[type] || iconMap.info}
      </div>
      <p className="text-sm font-medium leading-relaxed pr-2">
        {message}
      </p>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 ml-auto rounded-lg p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 * Absolute layout that renders all active toasts
 */
export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-auto"
      style={{ contentVisibility: 'auto' }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
};

export default ToastItem;
