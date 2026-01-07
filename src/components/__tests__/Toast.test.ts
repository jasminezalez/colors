import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Toast from '../Toast.vue'
import { useToast } from '../../composables/useToast'

describe('Toast', () => {
  beforeEach(() => {
    const { clearAllToasts } = useToast()
    clearAllToasts()
    vi.clearAllTimers()
  })

  it('should display multiple toasts simultaneously', async () => {
    // Arrange
    const { showToast } = useToast()

    // Act
    const wrapper = mount(Toast)
    showToast('First toast')
    showToast('Second toast')
    showToast('Third toast')
    await nextTick()

    // Assert: All three toasts should be visible
    const toasts = wrapper.findAll('.toast')
    expect(toasts.length).toBe(3)
    expect(toasts[0].text()).toContain('First toast')
    expect(toasts[1].text()).toContain('Second toast')
    expect(toasts[2].text()).toContain('Third toast')
  })

  it('should auto-dismiss toasts after specified duration', async () => {
    // Arrange
    vi.useFakeTimers()
    const { showToast } = useToast()
    const wrapper = mount(Toast)

    // Act: Show toast with 1000ms duration
    showToast('Auto-dismiss test', { duration: 1000 })
    await nextTick()

    // Assert: Toast visible
    expect(wrapper.find('.toast').exists()).toBe(true)

    // Act: Fast-forward 1000ms
    vi.advanceTimersByTime(1000)
    await nextTick()

    // Assert: Toast dismissed
    expect(wrapper.find('.toast').exists()).toBe(false)

    vi.useRealTimers()
  })
})
