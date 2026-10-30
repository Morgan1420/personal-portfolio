<script setup>
defineProps({ size: { type: [Number, String], default: 20 } })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" />
  </svg>
</template>
