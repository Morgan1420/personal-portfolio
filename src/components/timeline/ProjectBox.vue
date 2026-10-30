<script setup>
// Project of an open work box. Slides out from behind it; click → detail pop-up.
defineProps({
  project: { type: Object, required: true }, // { title, duration, durationSpace, x, w }
  slide: { type: Object, required: true },
})
</script>

<template>
  <button
    :ref="slide.box"
    type="button"
    class="project tl-clickable"
    :style="{ left: `${project.x}px`, width: `${project.w}px` }"
    :aria-label="`Open project: ${project.title} (${project.duration})`"
  >
    <span :ref="slide.t" class="project__name" :style="{ maxWidth: `calc(100% - ${project.durationSpace}px)` }">
      {{ project.title }}
    </span>
    <span :ref="slide.l" class="project__duration">{{ project.duration }}</span>
  </button>
</template>

<style scoped>
.project {
  position: absolute;
  top: 8px;
  height: 48px;
  z-index: 2;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-xs);
  border: 1.5px solid var(--color-accent);
  background: var(--color-surface);
  color: var(--color-ink);
  text-align: left;
  box-shadow: var(--shadow-project);
  animation: proj-in 0.38s var(--ease-out) 0.3s both;
  transition:
    background-color var(--dur) ease,
    filter var(--dur) ease,
    translate var(--dur) ease;
}

.project:hover,
.project:focus-visible {
  background: var(--color-project-hover);
}

.project__name,
.project__duration {
  position: absolute;
  top: 0;
  height: 45px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.project__name {
  left: 14px;
  display: block;
  line-height: 45px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--fs-caption);
  font-weight: 600;
}

.project__duration {
  right: 14px;
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  color: var(--color-accent);
}

@keyframes proj-in {
  from {
    transform: translateY(64px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
