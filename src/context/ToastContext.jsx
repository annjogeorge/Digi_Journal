import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const duration = options.duration || 3800;

    setToasts((prev) => {
      // Prevent spam duplicates
      if (prev.some((t) => t.message === message)) return prev;
      return [...prev, { id, message, type, ...options }];
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';
            const isAchievement = toast.type === 'achievement';

            let borderClass = 'border-black';
            let bgClass = 'bg-[#1e1b4b] text-white';
            let icon = <Info size={18} className="text-[#8be9fd] shrink-0" />;

            if (isSuccess) {
              borderClass = 'border-[#50fa7b]';
              bgClass = 'bg-[#15232d] text-white';
              icon = <CheckCircle2 size={18} className="text-[#50fa7b] shrink-0" />;
            } else if (isError) {
              borderClass = 'border-[#ff5555]';
              bgClass = 'bg-[#2b1820] text-white';
              icon = <AlertCircle size={18} className="text-[#ff5555] shrink-0" />;
            } else if (isWarning) {
              borderClass = 'border-[#f3df23]';
              bgClass = 'bg-[#2b2614] text-white';
              icon = <AlertTriangle size={18} className="text-[#f3df23] shrink-0" />;
            } else if (isAchievement) {
              borderClass = 'border-black';
              bgClass = 'bg-[#f3df23] text-black font-bold';
              icon = <CheckCircle2 size={18} className="text-black shrink-0" />;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto p-3.5 border-2 shadow-[4px_4px_12px_rgba(0,0,0,0.5)] border-2 border-black shadow-[2px_2px_0px_#000] flex items-start justify-between gap-3 ${borderClass} ${bgClass}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{icon}</div>
                  <div>
                    {isAchievement && (
                      <div className="font-pixel text-[9px] uppercase tracking-wider text-black/75">
                        ★ Achievement Unlocked
                      </div>
                    )}
                    <p className={`text-xs sm:text-sm font-sans ${isAchievement ? 'font-pixel text-xs' : 'font-medium'}`}>
                      {toast.message}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
