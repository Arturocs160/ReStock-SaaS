"use client";

import { useEffect, useState } from "react";
import { useToastStore, Toast } from "../store/toastStore";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const TYPE_STYLES = {
  success: {
    borderColor: "border-primary",
    bgIcon: "bg-[#eafaf1]",
    textIcon: "text-[#00a365]",
    textTitle: "text-[#00a365]",
    defaultTitle: "ÉXITO",
    Icon: CheckCircle2,
  },
  error: {
    borderColor: "border-red-500",
    bgIcon: "bg-red-50",
    textIcon: "text-red-600",
    textTitle: "text-red-600",
    defaultTitle: "ERROR",
    Icon: AlertTriangle,
  },
  info: {
    borderColor: "border-blue-500",
    bgIcon: "bg-blue-50",
    textIcon: "text-blue-600",
    textTitle: "text-blue-600",
    defaultTitle: "INFORMACIÓN",
    Icon: Info,
  },
  warning: {
    borderColor: "border-amber-500",
    bgIcon: "bg-amber-50",
    textIcon: "text-amber-600",
    textTitle: "text-amber-600",
    defaultTitle: "ADVERTENCIA",
    Icon: AlertTriangle,
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Subscribe to store changes
    const unsub = useToastStore.subscribe((state) => {
      setToasts(state.toasts);
    });
    // Set initial toasts
    setToasts(useToastStore.getState().toasts);
    return unsub;
  }, []);

  const handleRemove = (id: string) => {
    useToastStore.getState().removeToast(id);
  };

  if (!mounted || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-[420px] px-4 sm:px-0">
      {toasts.map((toast) => {
        const styles = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
        const IconComponent = styles.Icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-4 px-5 py-4 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-lg border-l-[6px] ${styles.borderColor} animate-scale-up duration-300 w-full`}
          >
            {/* Icon Column */}
            <div className={`p-2.5 rounded-full flex items-center justify-center shrink-0 ${styles.bgIcon}`}>
              <IconComponent className={`w-5 h-5 ${styles.textIcon}`} />
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-0.5 ${styles.textTitle}`}>
                {toast.title || styles.defaultTitle}
              </p>
              <p className="text-sm font-bold text-gray-800 leading-snug break-words">
                {toast.message}
              </p>
            </div>

            {/* Close Button Column */}
            <button
              onClick={() => handleRemove(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer shrink-0 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
