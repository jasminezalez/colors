<template>
  <div class="grid-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading colors...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <!-- Success State: Grid of Colors -->
    <div v-else-if="colors.length" class="color-grid">
      <ColorSwatch
        v-for="color in colors"
        :key="color.name"
        :color="color"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No colors found. Try adjusting saturation and lightness values.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ColorSwatch from './ColorSwatch.vue'
import type { ColorSwatch as ColorSwatchType } from '../types/color'

// Props for managing grid state
defineProps<{
  colors: ColorSwatchType[]
  loading: boolean
  error: string | null
}>()
</script>

<style scoped>
.grid-container {
  min-height: 200px;
}

/* CSS Grid - responsive */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  width: 100%;
}

/* Loading State Styles */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State Styles */
.error-state {
  padding: 2rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  text-align: center;
}

/* Empty State Styles */
.empty-state {
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .color-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
}
</style>
