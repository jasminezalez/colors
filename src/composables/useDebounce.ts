import { ref, watch, type Ref } from 'vue'

/**
 * Debounce a ref value
 *
 * Returns a debounced version of the input ref that only updates
 * after the specified delay has passed without changes
 *
 * @param value - The ref to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced ref
 *
 * @example
 * const searchQuery = ref('')
 * const debouncedQuery = useDebounce(searchQuery, 500)
 *
 * watch(debouncedQuery, (value) => {
 *   // This only fires 500ms after user stops typing
 *   fetchSearchResults(value)
 * })
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
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced function
 *
 * @example
 * const handleSearch = useDebounceFn((query: string) => {
 *   fetchResults(query)
 * }, 500)
 *
 * // Call multiple times rapidly
 * handleSearch('a')
 * handleSearch('ab')
 * handleSearch('abc')
 * // Only the last call executes after 500ms
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
