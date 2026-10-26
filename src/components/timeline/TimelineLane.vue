<script setup>
// Studies / venture bar. Clickable → detail pop-up (click handler falls through to the button).
defineProps({
  lane: { type: Object, required: true }, // { kind, left, right, x, w, ongoing }
  top: { type: Number, required: true },
  alt: { type: Boolean, default: false }, // second education tint
  faded: { type: Boolean, default: false },
  slide: { type: Object, required: true }, // ref callbacks from useSlidingLabels
})
</script>

<template>
  <button
    :ref="slide.box"
    type="button"
    class="lane tl-clickable"
    :class="[`lane--${lane.kind}`, { 'lane--alt': alt, 'lane--ongoing': lane.ongoing, 'is-faded': faded }]"
    :style="{ left: `${lane.x}px`, top: `${top}px`, width: `${lane.w}px` }"
  >
    <span class="lane__bg" aria-hidden="true"></span>
    <span :ref="slide.t" class="lane__left">{{ lane.left }}</span>
    <span :ref="slide.l" class="lane__right">{{ lane.right }}</span>
  </button>
</template>

<style scoped>
.lane {
  position: absolute;
  height: 40px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-ink);
  text-align: left;
  overflow: hidden;
  transition:
    opacity 0.25s ease,
    filter var(--dur) ease,
    translate var(--dur) ease;
}

.lane.is-faded {
  opacity: 0.18;
}

.lane__bg {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lane);
  border: 1.5px solid transparent;
  background: var(--color-tint);
  transition: border-color var(--dur) ease;
}

.lane--alt .lane__bg {
  background: var(--color-tint-2);
}

.lane--venture .lane__bg {
  background: var(--color-surface);
  border-color: var(--color-accent);
}

/* Ongoing: open-ended, fades out to the right (background only — text stays crisp) */
.lane--ongoing .lane__bg {
  border-right-width: 0;
  border-radius: var(--radius-lane) 0 0 var(--radius-lane);
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 220px), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - 220px), transparent);
}

.lane__left,
.lane__right {
  position: absolute;
  top: 0;
  height: 40px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.lane__left {
  left: 16px;
  font-size: var(--fs-caption);
  font-weight: 600;
}

.lane__right {
  right: 16px;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  color: var(--color-accent);
}

.lane--ongoing .lane__right {
  right: 200px;
}

.lane:hover .lane__bg,
.lane:focus-visible .lane__bg {
  border-color: var(--color-accent);
}
</style>
