'use client';

import toast from 'react-hot-toast';

/**
 * Hook that exposes convenient toast notification helpers.
 */
export function useToast() {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast(message),
    loading: (message) => toast.loading(message),
    dismiss: (toastId) => toast.dismiss(toastId),
    promise: (promise, messages) => toast.promise(promise, messages),
  };
}

export default useToast;
