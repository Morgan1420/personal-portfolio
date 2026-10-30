<script setup>
// Axis line, ticks + date labels, duration pills, gap labels and the "Future" marker.
defineProps({
  lines: { type: Array, required: true }, // { x, w, kind: 'idle' | 'work' | 'future' }
  ticks: { type: Array, required: true }, // { x, label, align: 'start' | 'center' | 'end', project? }
  pills: { type: Array, required: true }, // { x, label }
  gaps: { type: Array, required: true }, // { x, label }
  futureX: { type: Number, required: true },
})
</script>

<template>
  <div class="axis">
    <span
      v-for="(line, i) in lines"
      :key="`line-${i}`"
      class="axis__line"
      :class="`axis__line--${line.kind}`"
      :style="{ left: `${line.x}px`, width: `${line.w}px` }"
      aria-hidden="true"
    ></span>

    <span
      v-for="tick in ticks"
      :key="`tick-${tick.x}-${tick.label}`"
      class="tick"
      :class="[`tick--${tick.align}`, { 'tick--project': tick.project }]"
      :style="{ left: `${tick.x}px` }"
    >
      <span class="tick__mark" aria-hidden="true"></span>
      <span class="tick__label">{{ tick.label }}</span>
    </span>

    <span v-for="pill in pills" :key="`pill-${pill.x}`" class="pill" :style="{ left: `${pill.x}px` }">
      {{ pill.label }}
    </span>

    <span v-for="gap in gaps" :key="`gap-${gap.x}`" class="gap" :style="{ left: `${gap.x}px` }">
      {{ gap.label }}
    </span>

    <div class="future" :style="{ left: `${futureX}px` }">Future →</div>
  </div>
</template>

<style scoped>
.axis__line {
  position: absolute;
  top: 306px;
  height: 0;
  border-top: 2px solid var(--color-ink);
}

.axis__line--idle {
  border-top-style: dashed;
  border-top-color: var(--color-line-dashed);
}

.axis__line--future {
  border-top-style: dashed;
  border-top-color: var(--color-accent);
}

.tick {
  position: absolute;
  top: 299px;
  width: 0;
  height: 0;
}

.tick__mark {
  position: absolute;
  left: -1px;
  top: 0;
  width: 2px;
  height: 16px;
  background: var(--color-ink);
}

.tick__label {
  position: absolute;
  left: 0;
  top: 22px;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  color: var(--color-muted);
  white-space: nowrap;
}

.tick--center .tick__label {
  transform: translateX(-50%);
}

.tick--end .tick__label {
  transform: translateX(-100%);
}

.tick--project {
  animation: tick-in 0.3s ease 0.45s both;
}

.tick--project .tick__mark {
  background: var(--color-accent);
}

.tick--project .tick__label {
  top: 44px;
  color: var(--color-accent);
}

.pill {
  position: absolute;
  top: 318px;
  transform: translateX(-50%);
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-tint);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  white-space: nowrap;
}

.gap {
  position: absolute;
  top: 218px;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--color-muted);
  white-space: nowrap;
}

.future {
  position: absolute;
  top: 160px;
  height: 132px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  white-space: nowrap;
}

@keyframes tick-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
