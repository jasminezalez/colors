<script setup lang="ts">
import { ref, watch } from 'vue'

// Define the event this component emits
const emit = defineEmits<{
  update: [{ saturation: number; lightness: number }]
}>()

// Initialize with the example values from the assignment
const saturation = ref(100)
const lightness = ref(50)

// Watch for changes and emit update event
// NOTE: In Phase 1, this fires immediately on every slider change
// In Phase 2, we'll add debouncing to reduce API calls
watch([saturation, lightness], () => {
  emit('update', {
    saturation: saturation.value,
    lightness: lightness.value
  })
})
</script>

<template>
  <div class="input-controls">
    <div class="control-group">
      <label for="saturation">
        Saturation: <strong>{{ saturation }}%</strong>
      </label>
      <input
        id="saturation"
        v-model.number="saturation"
        type="range"
        min="0"
        max="100"
        step="1"
      />
    </div>

    <div class="control-group">
      <label for="lightness">
        Lightness: <strong>{{ lightness }}%</strong>
      </label>
      <input
        id="lightness"
        v-model.number="lightness"
        type="range"
        min="0"
        max="100"
        step="1"
      />
    </div>
  </div>
</template>

<style scoped>
.input-controls {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  color: #333;
}

label strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #ddd;
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
  transition: transform 0.15s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
  border: none;
  transition: transform 0.15s;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

@media (max-width: 640px) {
  .input-controls {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
