<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 14 },
  direction: { type: String, default: 'down' }, // up | down | left | right
  strokeWidth: { type: [Number, String], default: 2.2 },
})

const paths = {
  up: 'm6 15 6-6 6 6',
  down: 'm6 9 6 6 6-6',
  left: 'm15 6-6 6 6 6',
  right: 'm9 6 6 6-6 6',
}
const d = computed(() => paths[props.direction] ?? paths.down)
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path :d="d" />
  </svg>
</template>
