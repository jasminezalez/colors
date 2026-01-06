import { ref, type Ref } from 'vue'
import type { ColorAPIResponse, ColorSwatch } from '../types/color'

const API_BASE_URL = 'https://www.thecolorapi.com/id'

// Hue step size: Balance between API call count and color coverage
// 10° gives us 36 API calls (360° / 10°) with good distinct name coverage
const HUE_STEP = 10

// Cache for API responses
// Key format: "saturation-lightness" (e.g., "100-50")
// Persists across component instances and re-renders
const colorCache = new Map<string, ColorSwatch[]>()

export function useColorAPI() {
  const colors: Ref<ColorSwatch[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fetch colors across the hue spectrum for given saturation and lightness
   * @param saturation - 0-100 (percentage)
   * @param lightness - 0-100 (percentage)
   */
  async function fetchColors(saturation: number, lightness: number) {
    // Create cache key from S and L values
    const cacheKey = `${saturation}-${lightness}`

    // Check cache first
    if (colorCache.has(cacheKey)) {
      colors.value = colorCache.get(cacheKey)!
      return
    }

    console.log(`[Cache MISS] Fetching colors for S=${saturation}%, L=${lightness}%`)
    loading.value = true
    error.value = null
    colors.value = [] // Clear previous results

    try {
      // Progressive rendering: Show colors as they arrive
      // Track seen names to avoid duplicates during progressive updates
      const seenNames = new Set<string>()
      const progressiveColors: ColorSwatch[] = []

      // Create array of promises for parallel API calls
      const promises: Promise<void>[] = []

      for (let hue = 0; hue < 360; hue += HUE_STEP) {
        const url = `${API_BASE_URL}?hsl=${hue},${saturation},${lightness}&format=json`

        // Each promise processes its result immediately when it arrives
        const promise = fetch(url)
          .then(res => {
            if (!res.ok) {
              throw new Error(`API request failed: ${res.status}`)
            }
            return res.json()
          })
          .then((result: ColorAPIResponse) => {
            const colorName = result.name.value

            // Only add if we haven't seen this name yet
            if (!seenNames.has(colorName)) {
              seenNames.add(colorName)
              progressiveColors.push({
                name: colorName,
                rgb: {
                  r: result.rgb.r,
                  g: result.rgb.g,
                  b: result.rgb.b
                },
                hue: result.hsl.h
              })

              // Update UI immediately with new color
              // Create new array to trigger Vue reactivity
              colors.value = [...progressiveColors]
            }
          })

        promises.push(promise)
      }

      // Wait for all API calls to complete
      await Promise.all(promises)

      // Final result is already in colors.value from progressive updates
      // Store in cache for future use
      colorCache.set(cacheKey, colors.value)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch colors'
      console.error('Error fetching colors:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    colors,
    loading,
    error,
    fetchColors
  }
}
