import React from 'react';
import { useUniversity } from '../context/UniversityContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useUniversity();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none no-print">
      {toasts.map((toast) => {
        let bgStyle = 'bg-white border-emerald-600 text-slate-800 shadow-xl';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;

        if (toast.type === 'error') {
          bgStyle = 'bg-white border-rose-500 text-slate-800 shadow-xl';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
        } else if (toast.type === 'info') {
          bgStyle = 'bg-white border-emerald-700 text-slate-800 shadow-xl';
          icon = <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border-l-4 border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${bgStyle}`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
