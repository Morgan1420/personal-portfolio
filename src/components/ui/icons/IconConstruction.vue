<script setup>
defineProps({ size: { type: [Number, String], default: 20 } })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M2 20h20" /><path d="M5 20V9l7-5 7 5v11" /><path d="M9 20v-6h6v6" />
  </svg>
</template>
