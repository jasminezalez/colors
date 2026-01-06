<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in activeToasts"
        :key="toast.id"
        class="toast"
        :style="{
          backgroundColor: toast.backgroundColor,
          color: toast.textColor
        }"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { activeToasts } = useToast()
</script>

<style scoped>
/* Toast container: fixed at bottom-right, stacks vertically */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  z-index: 1000;
  pointer-events: none; /* Don't block clicks */
}

/* Individual toast notification */
.toast {
  padding: 12px 24px;
  /* Background color set dynamically via :style */
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  font-size: 0.9rem;
  font-weight: 600;
  pointer-events: none; /* Don't block clicks */
}

/* Vue TransitionGroup classes for toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
