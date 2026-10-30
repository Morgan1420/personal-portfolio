<script setup>
defineProps({ size: { type: [Number, String], default: 20 } })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 12v9" /><circle cx="12" cy="10" r="2" /><path d="M8.5 6.5a5 5 0 0 0 0 7" /><path d="M15.5 6.5a5 5 0 0 1 0 7" />
  </svg>
</template>
