<script setup>
// One job on the work lane. Hover/focus listeners fall through from ExperienceTimeline.
defineProps({
  job: { type: Object, required: true }, // { x, w, org, role, description, current }
  open: { type: Boolean, default: false },
  slide: { type: Object, required: true },
})
</script>

<template>
  <article
    :ref="slide.box"
    class="work"
    :class="{ 'is-open': open, 'is-current': job.current }"
    :style="{ left: `${job.x}px`, width: `${job.w}px` }"
    tabindex="0"
  >
    <div :ref="slide.t" class="work__text">
      <p class="work__org">{{ job.org }}</p>
      <h3 class="work__role">{{ job.role }}</h3>
      <p class="work__desc">{{ job.description }}</p>
    </div>
    <div :ref="slide.l" class="work__logo" aria-hidden="true">[Logo]</div>
  </article>
</template>

<style scoped>
.work {
  position: absolute;
  top: 160px;
  height: 132px;
  z-index: 1;
  overflow: hidden;
  border-radius: var(--radius-card);
  border: 1.5px solid var(--color-line);
  background: var(--color-surface);
  color: var(--color-ink);
  transition:
    top var(--dur-slow) ease,
    height var(--dur-slow) ease,
    box-shadow var(--dur-slow) ease;
}

/* Grows upward — the axis never moves */
.work.is-open {
  top: 64px;
  height: 228px;
  z-index: 3;
  box-shadow: var(--shadow-box-open);
}

.work.is-current {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}

.work:focus-visible {
  outline-offset: 3px;
}

.work__text {
  position: absolute;
  left: 22px;
  top: 0;
  padding-top: 38px;
  max-width: min(480px, calc(100% - 140px));
}

.work__org {
  margin-bottom: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  letter-spacing: 0.04em;
  opacity: 0.8;
}

.work__role {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-card-title);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.work__desc {
  margin-top: 22px;
  font-size: var(--fs-small);
  line-height: 1.55;
  opacity: 0;
  transition: opacity 0.25s ease 0.05s;
}

.work.is-open .work__desc {
  opacity: 1;
}

.work__logo {
  position: absolute;
  right: 22px;
  top: 28px;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  background: var(--color-tint);
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
}

.work.is-current .work__logo {
  background: var(--color-on-accent-soft);
  color: var(--color-on-accent);
}
</style>
