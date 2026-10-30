<script setup>
// Hover zone on a section edge: scrolls continuously on hover, steps on click.
// Positioned against the nearest positioned ancestor (the section).
import IconChevron from '../ui/icons/IconChevron.vue'

defineProps({
  side: { type: String, required: true }, // 'back' | 'forward'
})
defineEmits(['start', 'stop', 'step'])
</script>

<template>
  <div class="edge" :class="`edge--${side}`" @mouseenter="$emit('start')" @mouseleave="$emit('stop')">
    <button
      type="button"
      class="edge__button"
      :aria-label="side === 'back' ? 'Scroll timeline back' : 'Scroll timeline forward'"
      @click="$emit('step')"
    >
      <IconChevron :direction="side === 'back' ? 'left' : 'right'" :size="20" :stroke-width="2" />
    </button>
  </div>
</template>

<style scoped>
.edge {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 5;
  width: max(112px, 12%);
}

.edge--back {
  left: 0;
}

.edge--forward {
  right: 0;
}

.edge::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.edge--back::before {
  background: linear-gradient(to right, var(--edge-shade), transparent);
}

.edge--forward::before {
  background: linear-gradient(to left, var(--edge-shade), transparent);
}

.edge:hover::before {
  opacity: 1;
}

.edge__button {
  position: absolute;
  bottom: 192px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid var(--color-ink);
  background: var(--color-surface);
  color: var(--color-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-floating);
  transition:
    background-color var(--dur) ease,
    color var(--dur) ease,
    border-color var(--dur) ease,
    transform var(--dur) ease;
}

.edge--back .edge__button {
  left: 24px;
}

.edge--forward .edge__button {
  right: 24px;
}

.edge:hover .edge__button,
.edge__button:hover,
.edge__button:focus-visible {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
  transform: scale(1.1);
}

/* Touch: swipe scrolls natively */
@media (hover: none) {
  .edge {
    display: none;
  }
}
</style>
