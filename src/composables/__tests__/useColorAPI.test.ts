import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useColorAPI } from '../useColorAPI'

// Mock fetch globally
global.fetch = vi.fn()

describe('useColorAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should cache results and avoid redundant API calls', async () => {
    // Arrange: Mock API response
    const mockResponse = {
      name: { value: 'Red' },
      rgb: { r: 255, g: 0, b: 0 },
      hsl: { h: 0, s: 100, l: 50 }
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })

    const { fetchColors } = useColorAPI()

    // Act: Fetch same S/L combination twice
    await fetchColors(75, 60)
    const firstCallCount = (fetch as any).mock.calls.length

    await fetchColors(75, 60)
    const secondCallCount = (fetch as any).mock.calls.length

    // Assert: Second call should use cache (no additional API calls)
    expect(secondCallCount).toBe(firstCallCount)
  })

  it('should deduplicate colors with the same name during progressive rendering', async () => {
    // Arrange: Mock responses with duplicate color names
    let callCount = 0
    ;(global.fetch as any).mockImplementation(() => {
      callCount++
      // First and third API calls return same color name
      const name = callCount === 1 || callCount === 3 ? 'Red' : `Color${callCount}`
      return Promise.resolve({
        ok: true,
        json: async () => ({
          name: { value: name },
          rgb: { r: 255, g: 0, b: 0 },
          hsl: { h: callCount * 10, s: 100, l: 50 }
        })
      })
    })

    const { fetchColors, colors } = useColorAPI()

    // Act: Fetch colors
    await fetchColors(90, 45)

    // Assert: Should not have duplicate "Red" entries
    const redColors = colors.value.filter(c => c.name === 'Red')
    expect(redColors.length).toBe(1)
  })

  it('should handle API errors gracefully', async () => {
    // Arrange: Mock failed API response
    ;(global.fetch as any).mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    )

    const { fetchColors, error, colors } = useColorAPI()

    // Act: Attempt to fetch colors
    await fetchColors(88, 55)

    // Assert: Should set error state and clear colors
    expect(error.value).toBeTruthy()
    expect(error.value).toContain('API request failed')
    expect(colors.value.length).toBe(0)
  })
})
