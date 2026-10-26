<script setup>
defineProps({
  size: { type: [Number, String], default: 14 },
  up: { type: Boolean, default: false },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path :d="up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'" />
  </svg>
</template>
