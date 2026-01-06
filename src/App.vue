<template>
  <div class="app">
    <header class="app-header">
      <div class="header-top">
        <h1>Color Swatches</h1>
        <button @click="toggleView" class="view-toggle-btn">
          <span v-if="currentView === 'grid'">Analytics</span>
          <span v-else>Grid</span>
        </button>
      </div>
      <p class="subtitle">
        Explore colors across the hue spectrum at different saturation and lightness values
      </p>
    </header>

    <main class="app-main">
      <!-- Input Controls: Emits @update event when sliders change -->
      <InputControls @update="handleInputChange" />

      <!-- View Switcher with Transition -->
      <Transition name="fade" mode="out-in">
        <!-- Grid View -->
        <ColorGrid
          v-if="currentView === 'grid'"
          key="grid"
          :colors="colors"
          :loading="loading"
          :error="error"
        />

        <!-- Analytics View -->
        <PaletteAnalytics
          v-else
          key="analytics"
          :colors="colors"
          :loading="loading"
        />
      </Transition>

      <!-- Display count when we have colors in grid view -->
      <div v-if="currentView === 'grid' && !loading && colors.length > 0" class="color-count">
        Showing {{ colors.length }} distinct colors
      </div>
    </main>

    <!-- Global toast notification -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InputControls from './components/InputControls.vue'
import ColorGrid from './components/ColorGrid.vue'
import PaletteAnalytics from './components/PaletteAnalytics.vue'
import Toast from './components/Toast.vue'
import { useColorAPI } from './composables/useColorAPI'
import { useDebounceFn } from './composables/useDebounce'

// Use our composable to get reactive state and methods
const { colors, loading, error, fetchColors } = useColorAPI()

// View toggle state
type ViewMode = 'grid' | 'analytics'
const currentView = ref<ViewMode>('grid')

/**
 * Toggle between Grid and Analytics views
 */
function toggleView() {
  currentView.value = currentView.value === 'grid' ? 'analytics' : 'grid'
}

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

.header-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 0.5rem;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.view-toggle-btn {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.view-toggle-btn:hover {
  background: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.view-toggle-btn:active {
  transform: translateY(0);
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

/* View Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }
}
</style>
