<script setup lang="ts">
import { onMounted } from 'vue'
import InputControls from './components/InputControls.vue'
import ColorGrid from './components/ColorGrid.vue'
import { useColorAPI } from './composables/useColorAPI'
import { useDebounceFn } from './composables/useDebounce'

// Use our composable to get reactive state and methods
const { colors, loading, error, fetchColors } = useColorAPI()

/**
 * Handle input changes from the sliders
 * Phase 2: Debounced version - waits 500ms after user stops moving slider
 * This prevents excessive API calls during slider drag
 */
const handleInputChange = useDebounceFn(
  ({ saturation, lightness }: { saturation: number; lightness: number }) => {
    fetchColors(saturation, lightness)
  },
  500
)

/**
 * Load initial colors when component mounts
 * Using the example values from the assignment: S=100%, L=50%
 */
onMounted(() => {
  fetchColors(100, 50)
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Color Swatches</h1>
      <p class="subtitle">
        Explore colors across the hue spectrum at different saturation and lightness values
      </p>
    </header>

    <main class="app-main">
      <!-- Input Controls: Emits @update event when sliders change -->
      <InputControls @update="handleInputChange" />

      <!-- Color Grid: Displays the results -->
      <ColorGrid
        :colors="colors"
        :loading="loading"
        :error="error"
      />

      <!-- Display count when we have colors -->
      <div v-if="!loading && colors.length > 0" class="color-count">
        Showing {{ colors.length }} distinct colors
      </div>
    </main>
  </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #fafafa;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #666;
}

.app-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.color-count {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-size: 0.95rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }
}
</style>
