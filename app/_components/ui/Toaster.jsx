"use client";

import { createContext, use, useCallback, useMemo, useRef, useState } from "react";
import { Check, AlertCircle } from "lucide-react";

const ToastContext = createContext({ toast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const toast = useCallback((message, { type = "success", duration = 3000 } = {}) => {
    const id = ++idRef.current;
    setToasts((t) => [...t.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {type === "error" ? (
              <AlertCircle className="size-4 text-destructive" aria-hidden />
            ) : (
              <Check className="size-4 text-primary" aria-hidden />
            )}
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return use(ToastContext);
}
