import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, duration: 4000, ...toast };
    set({ toasts: [...get().toasts, newToast] });
    setTimeout(() => { set({ toasts: get().toasts.filter(t => t.id !== id) }); }, newToast.duration);
  },
  removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}));

export const useToast = () => {
  const addToast = useToastStore((s) => s.addToast);
  return {
    success: (message) => addToast({ type: 'success', message }),
    error: (message) => addToast({ type: 'error', message }),
    warning: (message) => addToast({ type: 'warning', message }),
    info: (message) => addToast({ type: 'info', message }),
  };
};

export default useToastStore;
