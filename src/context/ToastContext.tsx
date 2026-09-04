import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: ToastFunction;
  addToast: ToastFunction;
  removeToast: (id: string) => void;
}

type ToastFunction = {
  (type: ToastMessage['type'], title: string, message?: string): void;
  (toast: Omit<ToastMessage, 'id'>): void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((typeOrToast: ToastMessage['type'] | Omit<ToastMessage, 'id'>, title?: string, message?: string) => {
    const type = typeof typeOrToast === 'string' ? typeOrToast : typeOrToast.type;
    const toastTitle = typeof typeOrToast === 'string' ? title || '' : typeOrToast.title;
    const toastMessage = typeof typeOrToast === 'string' ? message : typeOrToast.message;
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title: toastTitle, message: toastMessage };
    
    setToasts(prev => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const addToast = showToast;

  return (
    <ToastContext.Provider value={{ toasts, showToast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        id="toast-container" 
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map(toast => {
          const config = {
            success: {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
              border: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
              titleColor: 'text-emerald-950',
            },
            error: {
              icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
              border: 'border-rose-200 bg-rose-50/95 text-rose-900',
              titleColor: 'text-rose-950',
            },
            warning: {
              icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
              border: 'border-amber-200 bg-amber-50/95 text-amber-900',
              titleColor: 'text-amber-950',
            },
            info: {
              icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
              border: 'border-blue-200 bg-blue-50/95 text-blue-900',
              titleColor: 'text-blue-950',
            }
          }[toast.type];

          return (
            <div
              key={toast.id}
              id={`toast-item-${toast.id}`}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${config.border}`}
            >
              {config.icon}
              <div className="flex-1 text-sm">
                <p className={`font-semibold text-xs leading-tight ${config.titleColor}`}>{toast.title}</p>
                {toast.message && (
                  <p className="mt-0.5 text-xs text-slate-700 leading-snug">{toast.message}</p>
                )}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-800 p-0.5 rounded transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
