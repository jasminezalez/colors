<template>
  <div class="color-swatch" @click="copyColor">
    <!-- Color preview: dynamic bg color -->
    <div
      class="color-preview"
      :style="{ backgroundColor: rgbString }"
      :aria-label="`Color preview for ${color.name}`"
    ></div>

    <!-- Color information -->
    <div class="color-info">
      <h3 class="color-name">{{ color.name }}</h3>
      <p class="color-value">{{ rgbString }}</p>
      <span class="copy-hint">Click to copy</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColorSwatch } from '../types/color'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  color: ColorSwatch
}>()

const { showToast } = useToast()

/**
 * Computed: RGB value as CSS string
 * Converts RGB object {r, g, b} to "rgb(r, g, b)" format, this is included in the style binding
 */
const rgbString = computed(() => {
  const { r, g, b } = props.color.rgb
  return `rgb(${r}, ${g}, ${b})`
})

/**
 * UX! Computed: Determine if the color is light enough to need dark text
 * Uses perceived brightness formula (human eye is more sensitive to green)
 * Returns true for light backgrounds, false for dark backgrounds
 */
const isLightTextColor = computed(() => {
  const { r, g, b } = props.color.rgb
  // Calculate perceived brightness (0-255)
  // Formula: https://www.w3.org/TR/AERT/#color-contrast
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  // If brightness > 128, it's a light color
  return brightness > 128
})

/**
 * Copy RGB value to clipboard and show color-matched toast
 */
async function copyColor() {
  try {
    await navigator.clipboard.writeText(rgbString.value)
    showToast(`Copied ${props.color.name}!`, {
      backgroundColor: rgbString.value,
      textColor: isLightTextColor.value ? 'black' : 'white'
    })
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}
</script>

<style scoped>
.color-swatch {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.color-swatch:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-preview {
  width: 100%;
  /* aspect-ratio ensures square regardless of container width */
  aspect-ratio: 1;
}

.color-info {
  padding: 12px;
  text-align: center;
}

.color-name {
  margin: 0 0 6px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.color-value {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
  color: #666;
}

/* Copy hint, hidden by default, shown on hover */
.copy-hint {
  display: block;
  font-size: 0.75rem;
  color: #42b983;
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: 500;
}

.color-swatch:hover .copy-hint {
  opacity: 1;
}
</style>
