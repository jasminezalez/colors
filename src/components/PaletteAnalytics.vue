<template>
  <div class="analytics-container">
    <div v-if="loading" class="loading-state">
      <p>Loading analytics...</p>
    </div>

    <div v-else-if="colors.length === 0" class="empty-state">
      <p>No colors to analyze. Adjust saturation and lightness values.</p>
    </div>

    <div v-else class="analytics-content">
      <!-- Color Distribution Section -->
      <section class="analytics-card">
        <h2>Color Distribution</h2>
        <div class="distribution-bars">
          <div
            v-for="[family, count] in Object.entries(colorDistribution)"
            :key="family"
            class="distribution-row"
            v-show="count > 0"
          >
            <span class="family-label" :style="{ color: getFamilyColor(family) }">
              {{ family.charAt(0).toUpperCase() + family.slice(1) }}
            </span>
            <div class="bar-container">
              <div
                class="bar-fill"
                :style="{
                  width: `${getPercentage(count)}%`,
                  backgroundColor: getFamilyColor(family)
                }"
              ></div>
            </div>
            <span class="percentage">{{ getPercentage(count) }}%</span>
          </div>
        </div>
      </section>

      <!-- Palette Insights Section -->
      <section class="analytics-card">
        <h2>Palette Insights</h2>
        <div class="insights-grid">
          <div class="insight-item">
            <span class="insight-label">Total Colors</span>
            <span class="insight-value">{{ paletteInsights.totalColors }}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">Warm Colors</span>
            <span class="insight-value">{{ paletteInsights.warmPercentage }}%</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">Cool Colors</span>
            <span class="insight-value">{{ paletteInsights.coolPercentage }}%</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">Dominant</span>
            <span class="insight-value">{{ paletteInsights.dominantFamily }}</span>
          </div>
        </div>
      </section>

      <!-- Export Options Section -->
      <section class="analytics-card">
        <h2>Export Options</h2>
        <div class="export-buttons">
          <button
            @click="downloadFile(generateCSSVariables, 'palette.css')"
            class="export-btn"
          >
            Download CSS Variables
          </button>
          <button
            @click="downloadFile(generateJSON, 'palette.json')"
            class="export-btn"
          >
            Download JSON
          </button>
          <button
            @click="copyToClipboard(generateJSON, 'Copied JSON to clipboard!')"
            class="export-btn"
          >
            Copy JSON
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { ColorSwatch } from '../types/color'
import { usePaletteAnalytics } from '../composables/usePaletteAnalytics'
import { useToast } from '../composables/useToast'

const props = defineProps<{
  colors: ColorSwatch[]
  loading: boolean
}>()

// Convert props.colors to a ref for the composable
const colorsRef = toRef(props, 'colors')

// Get analytics data
const { colorDistribution, paletteInsights, generateCSSVariables, generateJSON } =
  usePaletteAnalytics(colorsRef)

const { showToast } = useToast()

/**
 * Copy text to clipboard and show toast notification
 */
async function copyToClipboard(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text)
    showToast(message)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

/**
 * Download text as a file
 */
function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)

  showToast(`Downloaded ${filename}`)
}

/**
 * Get percentage for a color family
 */
function getPercentage(count: number): number {
  return props.colors.length > 0
    ? Math.round((count / props.colors.length) * 100)
    : 0
}

/**
 * Get color for family label
 */
function getFamilyColor(family: string): string {
  const colors: { [key: string]: string } = {
    red: '#f44336',
    orange: '#ff9800',
    yellow: '#ffeb3b',
    green: '#4caf50',
    cyan: '#00bcd4',
    blue: '#2196f3',
    purple: '#9c27b0',
    magenta: '#e91e63'
  }
  return colors[family] || '#999'
}
</script>

<style scoped>
.analytics-container {
  width: 100%;
  min-height: 400px;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  text-align: center;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Analytics Card */
.analytics-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
}

.analytics-card h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Distribution Bars */
.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.distribution-row {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  gap: 1rem;
  align-items: center;
}

.family-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.bar-container {
  height: 24px;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 12px;
}

.percentage {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-align: right;
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.insight-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.insight-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

/* Export Buttons */
.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.export-btn {
  padding: 12px 24px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.export-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 640px) {
  .analytics-card {
    padding: 1.5rem;
  }

  .distribution-row {
    grid-template-columns: 80px 1fr 50px;
    gap: 0.75rem;
  }

  .insights-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
