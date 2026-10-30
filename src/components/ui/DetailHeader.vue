<script setup>
// Fixed header of the pop-up: pills + close, title, tagline, and an optional slot (facts strip).
import IconClose from './icons/IconClose.vue'

defineProps({
  kind: { type: String, required: true },
  chip: { type: String, default: '' },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
})
defineEmits(['close'])
</script>

<template>
  <header class="head">
    <div class="head__row">
      <div class="head__pills" data-stagger>
        <span class="head__kind">{{ kind }}</span>
        <span v-if="chip" class="head__chip">{{ chip }}</span>
      </div>
      <button type="button" class="head__close" aria-label="Close" @click="$emit('close')">
        <IconClose />
      </button>
    </div>
    <h2 id="detail-title" class="head__title" data-stagger>{{ title }}</h2>
    <p v-if="tagline" class="head__tagline" data-stagger>{{ tagline }}</p>
    <slot />
  </header>
</template>

<style scoped>
.head {
  flex: 0 0 auto;
  padding: 32px 48px 26px;
  border-bottom: 1px solid var(--color-line);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.head__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.head__pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.head__kind {
  padding: 6px 12px;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.head__chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  background: var(--color-tint);
  font-family: var(--font-mono);
  font-size: var(--fs-label-sm);
}

.head__close {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--color-ink);
  background: var(--color-surface);
  color: var(--color-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color var(--dur) ease,
    color var(--dur) ease,
    transform var(--dur) ease;
}

.head__close:hover,
.head__close:focus-visible {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
  transform: rotate(90deg);
}

.head__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--fs-popup-title);
  line-height: 1.02;
  letter-spacing: -0.02em;
}

.head__tagline {
  max-width: 720px;
  font-size: 18px;
  line-height: 1.55;
  color: var(--color-ink-2);
}

@media (max-width: 700px) {
  .head {
    padding: 16px 16px 18px;
  }

  .head__title {
    font-size: 34px;
  }
}
</style>
