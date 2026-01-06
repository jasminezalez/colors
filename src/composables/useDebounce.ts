import { ref, watch, type Ref } from 'vue'

/**
 * Debounce a ref value
 *
 * Returns a debounced version of the input ref that only updates
 * after the specified delay has passed without changes
 *
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 500): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    // Clear any existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
      timeoutId = null
    }, delay)
  })

  return debouncedValue
}

/**
 * Create a debounced function
 *
 * Returns a function that delays invoking func until after delay milliseconds
 * have elapsed since the last time it was invoked
 *
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: Parameters<T>) {
    // Clear any existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}
