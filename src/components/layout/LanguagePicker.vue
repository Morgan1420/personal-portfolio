<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import IconChevron from '../ui/icons/IconChevron.vue'

// UI only for now — copy stays English until translations exist.
const languages = [
  { code: 'en', name: 'English' },
  { code: 'ca', name: 'Català' },
  { code: 'es', name: 'Español' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'de', name: 'Deutsch' },
]

const selected = ref('en')
const open = ref(false)
const root = ref(null)
const trigger = ref(null)

const current = computed(() => languages.find((l) => l.code === selected.value))

function close({ restoreFocus = false } = {}) {
  open.value = false
  if (restoreFocus) trigger.value?.focus()
}

function pick(code) {
  selected.value = code
  close({ restoreFocus: true })
}

function onKeydown(event) {
  if (event.key === 'Escape') close({ restoreFocus: true })
}

function onPointerDown(event) {
  if (!root.value?.contains(event.target)) close()
}

function onFocusOut(event) {
  if (open.value && !root.value?.contains(event.relatedTarget)) close()
}

watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  document[method]('pointerdown', onPointerDown)
  document[method]('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="picker" @focusout="onFocusOut">
    <button
      ref="trigger"
      type="button"
      class="picker__trigger"
      aria-haspopup="true"
      :aria-expanded="open"
      aria-controls="language-menu"
      :aria-label="`Language: ${current.name}`"
      @click="open = !open"
    >
      <span class="picker__code hover-underline" :class="{ 'is-active': open }">
        {{ current.code.toUpperCase() }}
      </span>
      <IconChevron :direction="open ? 'up' : 'down'" />
    </button>

    <ul v-if="open" id="language-menu" class="picker__menu" aria-label="Choose language">
      <li v-for="lang in languages" :key="lang.code">
        <button
          type="button"
          class="picker__option"
          :class="{ 'is-selected': lang.code === selected }"
          :aria-pressed="lang.code === selected"
          :lang="lang.code"
          @click="pick(lang.code)"
        >
          <span class="picker__option-code">{{ lang.code.toUpperCase() }}</span>
          <span class="picker__option-name">{{ lang.name }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.picker {
  position: relative;
}

.picker__trigger {
  min-height: 44px;
  min-width: 44px;
  padding: 0 4px;
  border: none;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.picker__code {
  background-position: 0 100%;
  padding-bottom: 3px;
}

.picker__trigger:hover .picker__code,
.picker__trigger:focus-visible .picker__code {
  background-size: 100% 2px;
}

.picker__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  z-index: 20;
  margin: 0;
  padding: 6px;
  list-style: none;
  width: 168px;
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-xs);
  box-shadow: var(--shadow-menu);
}

.picker__option {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border: none;
  border-radius: var(--radius-logo);
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--fs-small);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--dur-fast) ease;
}

.picker__option.is-selected {
  background: var(--color-tint);
}

.picker__option:not(.is-selected):hover,
.picker__option:not(.is-selected):focus-visible {
  background: var(--color-tint-hover);
}

.picker__option:focus-visible {
  outline-offset: -2px;
}

.picker__option-code {
  width: 24px;
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  color: var(--color-accent);
}

.picker__option-name {
  flex: 1;
}
</style>
