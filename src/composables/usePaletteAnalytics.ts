import { computed, type Ref } from 'vue'
import type { ColorSwatch } from '../types/color'

/**
 * Color family categories based on hue ranges
 * Based on standard color wheel divisions
 */
type ColorFamily = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'magenta'

interface ColorDistribution {
  [key: string]: number
  red: number
  orange: number
  yellow: number
  green: number
  cyan: number
  blue: number
  purple: number
  magenta: number
}

interface PaletteInsights {
  totalColors: number
  warmPercentage: number
  coolPercentage: number
  dominantFamily: string
}

/**
 * Easy with HSL to categorize a color by its hue value
 * Hue ranges based on color wheel (0-360 degrees)
 */
function categorizeByHue(hue: number): ColorFamily {
  // Normalize hue to 0-360 range
  const normalizedHue = ((hue % 360) + 360) % 360

  if (normalizedHue >= 0 && normalizedHue < 30) return 'red'
  if (normalizedHue >= 30 && normalizedHue < 60) return 'orange'
  if (normalizedHue >= 60 && normalizedHue < 90) return 'yellow'
  if (normalizedHue >= 90 && normalizedHue < 150) return 'green'
  if (normalizedHue >= 150 && normalizedHue < 210) return 'cyan'
  if (normalizedHue >= 210 && normalizedHue < 270) return 'blue'
  if (normalizedHue >= 270 && normalizedHue < 330) return 'purple'
  return 'magenta' // 330-360
}

/**
 * Determine if a hue is warm (reds, oranges, yellows)
 */
function isWarmColor(hue: number): boolean {
  const normalizedHue = ((hue % 360) + 360) % 360
  // Warm colors: reds (330-360 and 0-30), oranges (30-60), yellows (60-90)
  return (normalizedHue >= 330 && normalizedHue < 360) || (normalizedHue >= 0 && normalizedHue < 90)
}

/**
 * Custom composable for analyzing color palette data
 * Provides distribution statistics and insights about the current color palette
 *
 * @param colors - Reactive array of color swatches
 * @returns Computed analytics data
 */
export function usePaletteAnalytics(colors: Ref<ColorSwatch[]>) {
  /**
   * Calculate distribution of colors across color families
   * Groups colors by hue ranges (red, orange, yellow, etc.)
   */
  const colorDistribution = computed<ColorDistribution>(() => {
    const distribution: ColorDistribution = {
      red: 0,
      orange: 0,
      yellow: 0,
      green: 0,
      cyan: 0,
      blue: 0,
      purple: 0,
      magenta: 0
    }

    colors.value.forEach(color => {
      const family = categorizeByHue(color.hue)
      distribution[family]++
    })

    return distribution
  })

  /**
   * Calculate key insights about the palette
   * - Total color count
   * - Warm vs cool color percentages
   * - Dominant color family
   */
  const paletteInsights = computed<PaletteInsights>(() => {
    const total = colors.value.length

    if (total === 0) {
      return {
        totalColors: 0,
        warmPercentage: 0,
        coolPercentage: 0,
        dominantFamily: 'None'
      }
    }

    // Count warm and cool colors
    const warmCount = colors.value.filter(c => isWarmColor(c.hue)).length
    const coolCount = total - warmCount

    // Find dominant color family
    const dist = colorDistribution.value
    const dominantEntry = Object.entries(dist)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])[0]

    return {
      totalColors: total,
      warmPercentage: Math.round((warmCount / total) * 100),
      coolPercentage: Math.round((coolCount / total) * 100),
      dominantFamily: dominantEntry ? dominantEntry[0].charAt(0).toUpperCase() + dominantEntry[0].slice(1) : 'None'
    }
  })

  /**
   * Generate CSS custom properties for all colors
   * Format: --color-{name}: rgb(r, g, b);
   */
  const generateCSSVariables = computed(() => {
    const cssLines = [':root {']

    colors.value.forEach(color => {
      const safeName = color.name.toLowerCase().replace(/\s+/g, '-')
      const { r, g, b } = color.rgb
      cssLines.push(`  --color-${safeName}: rgb(${r}, ${g}, ${b});`)
    })

    cssLines.push('}')
    return cssLines.join('\n')
  })

  /**
   * Generate JSON export of palette data
   */
  const generateJSON = computed(() => {
    return JSON.stringify(
      {
        palette: {
          colors: colors.value.map(c => ({
            name: c.name,
            rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
            hue: c.hue
          }))
        }
      },
      null,
      2
    )
  })

  return {
    colorDistribution,
    paletteInsights,
    generateCSSVariables,
    generateJSON
  }
}
