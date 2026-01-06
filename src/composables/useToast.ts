import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  duration: number
  backgroundColor: string
  textColor: 'white' | 'black'
}

export interface ToastOptions {
  duration?: number
  backgroundColor?: string
  textColor?: 'white' | 'black'
}

export const useToast = (() => {
  const activeToasts = ref<Toast[]>([])
  let toastIdCounter = 0

  function removeToast(id: string) {
    const index = activeToasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      activeToasts.value.splice(index, 1)
    }
  }

  function showToast(message: string, options: ToastOptions = {}) {
    toastIdCounter += 1

    const toast: Toast = {
      id: `toast-${toastIdCounter}`,
      message,
      duration: options.duration ?? 2000,
      backgroundColor: options.backgroundColor ?? '#2c3e50',
      textColor: options.textColor ?? 'white'
    }

    activeToasts.value.push(toast)

    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)
  }

  function clearAllToasts() {
    activeToasts.value = []
  }

  return () => ({
    showToast,
    activeToasts,
    clearAllToasts
  })
})()
