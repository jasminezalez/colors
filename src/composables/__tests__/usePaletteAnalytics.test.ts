import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { usePaletteAnalytics } from '../usePaletteAnalytics'
import type { ColorSwatch } from '../../types/color'

describe('usePaletteAnalytics', () => {
  it('should calculate warm and cool color percentages correctly', () => {
    // Arrange: Mix of warm (0-90°, 330-360°) and cool (90-330°) colors
    const testColors = ref<ColorSwatch[]>([
      { name: 'Red', rgb: { r: 255, g: 0, b: 0 }, hue: 0 }, // Warm
      { name: 'Orange', rgb: { r: 255, g: 128, b: 0 }, hue: 45 }, // Warm
      { name: 'Yellow', rgb: { r: 255, g: 255, b: 0 }, hue: 60 }, // Warm
      { name: 'Green', rgb: { r: 0, g: 255, b: 0 }, hue: 120 }, // Cool
      { name: 'Blue', rgb: { r: 0, g: 0, b: 255 }, hue: 240 }, // Cool
      { name: 'Magenta', rgb: { r: 255, g: 0, b: 128 }, hue: 340 } // Warm
    ])

    // Act
    const { paletteInsights } = usePaletteAnalytics(testColors)

    // Assert: 4 warm (67%), 2 cool (33%)
    expect(paletteInsights.value.totalColors).toBe(6)
    expect(paletteInsights.value.warmPercentage).toBe(67)
    expect(paletteInsights.value.coolPercentage).toBe(33)
  })

  it('should generate valid CSS custom properties with kebab-case names', () => {
    // Arrange
    const testColors = ref<ColorSwatch[]>([
      { name: 'Crimson Red', rgb: { r: 220, g: 20, b: 60 }, hue: 348 },
      { name: 'Sky Blue', rgb: { r: 135, g: 206, b: 235 }, hue: 197 }
    ])

    // Act
    const { generateCSSVariables } = usePaletteAnalytics(testColors)
    const css = generateCSSVariables.value

    // Assert: Should wrap in :root selector with kebab-case names
    expect(css).toContain(':root {')
    expect(css).toContain('--color-crimson-red: rgb(220, 20, 60);')
    expect(css).toContain('--color-sky-blue: rgb(135, 206, 235);')
  })

  it('should generate valid JSON export with proper structure', () => {
    // Arrange
    const testColors = ref<ColorSwatch[]>([
      { name: 'Red', rgb: { r: 255, g: 0, b: 0 }, hue: 0 }
    ])

    // Act
    const { generateJSON } = usePaletteAnalytics(testColors)
    const json = generateJSON.value
    const parsed = JSON.parse(json)

    // Assert: Should be valid JSON with palette wrapper and formatted RGB
    expect(parsed.palette).toBeDefined()
    expect(parsed.palette.colors[0]).toEqual({
      name: 'Red',
      rgb: 'rgb(255, 0, 0)',
      hue: 0
    })
  })
})
