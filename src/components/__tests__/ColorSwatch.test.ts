import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorSwatch from '../ColorSwatch.vue'
import type { ColorSwatch as ColorSwatchType } from '../../types/color'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
})

describe('ColorSwatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should copy RGB value to clipboard when clicked', async () => {
    // Arrange
    const color: ColorSwatchType = {
      name: 'Red',
      rgb: { r: 255, g: 0, b: 0 },
      hue: 0
    }

    const wrapper = mount(ColorSwatch, {
      props: { color }
    })

    // Act: Click the color swatch
    await wrapper.trigger('click')

    // Assert: Clipboard should have RGB value
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('rgb(255, 0, 0)')
  })

  it('should calculate text color correctly for light vs dark backgrounds', () => {
    // Arrange: Yellow is light (needs black text), Navy is dark (needs white text)
    const lightColor: ColorSwatchType = {
      name: 'Yellow',
      rgb: { r: 255, g: 255, b: 0 }, // Brightness = (255*299 + 255*587 + 0*114)/1000 = 225
      hue: 60
    }

    const darkColor: ColorSwatchType = {
      name: 'Navy',
      rgb: { r: 0, g: 0, b: 128 }, // Brightness = (0*299 + 0*587 + 128*114)/1000 = 14
      hue: 240
    }

    // Act
    const lightWrapper = mount(ColorSwatch, { props: { color: lightColor } })
    const darkWrapper = mount(ColorSwatch, { props: { color: darkColor } })

    // Assert: Light background → black text, Dark background → white text
    expect((lightWrapper.vm as any).isLightTextColor).toBe(true) // brightness > 128
    expect((darkWrapper.vm as any).isLightTextColor).toBe(false) // brightness < 128
  })
})
