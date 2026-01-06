<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ColorSwatch } from '../types/color'

// Component props with TypeScript typing
const props = defineProps<{
  color: ColorSwatch
}>()

// Toast notification state
const showToast = ref(false)

// Computed property: automatically updates when props.color changes
// Converts RGB object to CSS rgb() string
const rgbString = computed(() => {
  const { r, g, b } = props.color.rgb
  return `rgb(${r}, ${g}, ${b})`
})

/**
 * Copy RGB value to clipboard and show toast notification
 * Uses the Clipboard API for modern browsers
 */
async function copyColor() {
  try {
    // Copy to clipboard
    await navigator.clipboard.writeText(rgbString.value)

    // Show toast notification
    showToast.value = true

    // Hide toast after 2 seconds
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    // Fallback: could show error toast here
  }
}
</script>

<template>
  <div class="color-swatch" @click="copyColor">
    <!-- Color preview: dynamic background color -->
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

    <!-- Toast notification with Vue transition -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        Copied {{ rgbString }}!
      </div>
    </Transition>
  </div>
</template>

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

/* Copy hint - hidden by default, shown on hover */
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

/* Toast notification styles */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background-color: #2c3e50;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 1000;
  pointer-events: none;
}

/* Vue Transition classes for toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
