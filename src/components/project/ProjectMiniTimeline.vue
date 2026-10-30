<script setup>
// Bar spanning the experience, with one segment per project and dashes for the gaps.
import { computed } from 'vue'
import { currentMonthIndex, formatMonth, toMonthIndex } from '../../utils/dates.js'

const props = defineProps({
  project: { type: Object, required: true },
  experience: { type: Object, required: true },
  siblings: { type: Array, required: true }, // oldest first, includes the project itself
})

const startIdx = computed(() => toMonthIndex(props.experience.start))
const endIdx = computed(() => (props.experience.end ? toMonthIndex(props.experience.end) : currentMonthIndex()))

const segments = computed(() => {
  const result = []
  let cursor = startIdx.value
  for (const sibling of props.siblings) {
    if (!sibling.start) continue
    const from = toMonthIndex(sibling.start)
    const to = sibling.end ? toMonthIndex(sibling.end) : endIdx.value
    if (from > cursor) result.push({ key: `gap-${from}`, grow: from - cursor, gap: true })
    result.push({ key: sibling.id, grow: Math.max(1, to - from), current: sibling.id === props.project.id })
    cursor = Math.max(cursor, to)
  }
  if (endIdx.value > cursor) result.push({ key: 'gap-end', grow: endIdx.value - cursor, gap: true })
  return result
})
</script>

<template>
  <div class="mini" aria-hidden="true">
    <div class="mini__bar">
      <span
        v-for="segment in segments"
        :key="segment.key"
        class="mini__segment"
        :class="{ 'is-gap': segment.gap, 'is-current': segment.current }"
        :style="{ flexGrow: segment.grow }"
      ></span>
    </div>
    <div class="mini__labels">
      <span>{{ formatMonth(startIdx) }}</span>
      <span>{{ experience.end ? formatMonth(endIdx) : 'Present' }}</span>
    </div>
  </div>
</template>

<style scoped>
.mini {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mini__bar {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 10px;
}

.mini__segment {
  flex: 1 1 0;
  height: 10px;
  border-radius: var(--radius-pill);
  background: var(--color-tint-2);
}

.mini__segment.is-current {
  background: var(--color-accent);
}

.mini__segment.is-gap {
  height: 0;
  border-radius: 0;
  border-top: 2px dashed var(--color-line-dashed);
  background: none;
}

.mini__labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--color-muted);
}
</style>
