import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // in milliseconds, undefined means no auto-dismiss
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const DEFAULT_DURATION = 5000; // 5 seconds

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const newToast: Toast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random()}`,
      duration: toast.duration ?? DEFAULT_DURATION,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  success: (message, title) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: 'success',
          message,
          title,
          duration: DEFAULT_DURATION,
        },
      ],
    }));
  },

  error: (message, title) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: 'error',
          message,
          title,
          duration: DEFAULT_DURATION,
        },
      ],
    }));
  },

  warning: (message, title) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: 'warning',
          message,
          title,
          duration: DEFAULT_DURATION,
        },
      ],
    }));
  },

  info: (message, title) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: 'info',
          message,
          title,
          duration: DEFAULT_DURATION,
        },
      ],
    }));
  },
}));
