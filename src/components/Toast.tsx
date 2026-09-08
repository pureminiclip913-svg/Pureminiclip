import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            id={`toast-${t.id}`}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              isError
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                : isWarning
                ? 'bg-amber-950/90 border-amber-800 text-amber-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isError && !isSuccess && !isWarning && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-sm leading-snug">{t.title}</h5>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed break-words">{t.message}</p>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
