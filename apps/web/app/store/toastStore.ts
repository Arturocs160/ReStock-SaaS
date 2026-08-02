import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  title?: string;
  duration?: number;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

export const useToastStore = create<ToastState>((set, get) => {
  const addToast = (message: string, type: ToastType, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = options?.duration ?? 4000;

    const newToast: Toast = {
      id,
      message,
      type,
      title: options?.title,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  };

  return {
    toasts: [],
    addToast,
    removeToast,
    success: (message, options) => addToast(message, "success", options),
    error: (message, options) => addToast(message, "error", options),
    info: (message, options) => addToast(message, "info", options),
    warning: (message, options) => addToast(message, "warning", options),
  };
});
